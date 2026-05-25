import React, { useState, useEffect } from "react";
import { Project, ProjectSettings, Character, WorldBuilding, ProjectFormat, NarrativeStructureMethod } from "./types";
import { PROJECT_TEMPLATES } from "./data/templates";

// Import Custom Workspace Components
import ProjectWizard from "./components/ProjectWizard";
import ScriptEditor from "./components/ScriptEditor";
import CharacterManager from "./components/CharacterManager";
import WorldBuilder from "./components/WorldBuilder";
import NarrativeStructure from "./components/NarrativeStructure";
import StoryboardLayout from "./components/StoryboardLayout";
import NarrativeAnalyzer from "./components/NarrativeAnalyzer";
import EduCenter from "./components/EduCenter";
import ExportPanel from "./components/ExportPanel";

// icons
import { 
  FolderOpen, Layout, Users, Globe, BookOpen, Monitor, BarChart2, 
  Download, Sparkles, GraduationCap, ChevronRight, Settings, Plus, RotateCcw, Home
} from "lucide-react";

export default function App() {
  const [projectList, setProjectList] = useState<Project[]>(() => {
    const local = localStorage.getItem("narrativa-grafica-pro-projects");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return PROJECT_TEMPLATES;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projectList.length > 0 ? projectList[0].id : "temp-noir";
  });

  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "HOME" | "SCRIPT" | "STRUCTURE" | "CHARACTERS" | "WORLD" | "STORYBOARD" | "ANALYZER" | "EDU" | "EXPORT"
  >("HOME");

  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("narrativa-grafica-pro-projects", JSON.stringify(projectList));
  }, [projectList]);

  const activeProject = projectList.find((p) => p.id === activeProjectId) || projectList[0];

  const handleUpdateProject = (updated: Project) => {
    setProjectList((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateNewProject = (settings: ProjectSettings) => {
    const newProj: Project = {
      id: "proj-" + Date.now(),
      settings,
      guidedStructure: {
        protagonist: "",
        desire: "",
        obstacle: "",
        mainConflict: "",
        risk: "",
        emotionalTransformation: ""
      },
      structureMethod: settings.format === "TIRINHAS" ? "STRIP_STRUCTURE" : "THREE_ACTS",
      structureAnswers: {},
      pages: [
        {
          id: "page-" + Date.now() + "-1",
          pageNumber: 1,
          rhythmNotes: "Roteiro inicial rápido.",
          panels: [
            {
              id: "panel-" + Date.now() + "-c1",
              panelNumber: 1,
              framing: "Plano médio",
              visualDescription: "Rascunhe os primeiros movimentos físicos da cena...",
              dialogue: "",
              narration: "",
              soundEffects: "",
              emotions: "Mistério",
              cameraMovement: "Estática",
              timeOfScene: "Dia",
              artistNotes: "Use enquadramentos lineares limpos para iniciar."
            }
          ]
        }
      ],
      characters: [],
      world: {
        era: "",
        technology: "",
        culture: "",
        politics: "",
        worldRules: "",
        visualClimate: "",
        architecture: "",
        references: ""
      }
    };

    setProjectList((prev) => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setShowWizard(false);
    setActiveTab("STRUCTURE");
    triggerToast("Novo estúdio criado com sucesso!");
  };

  const triggerToast = (msg: string) => {
    setGlobalMessage(msg);
    setTimeout(() => setGlobalMessage(null), 3500);
  };

  const handleResetToPresets = () => {
    if (confirm("Quer redefinir os projetos de exemplo para os originais restaurados? Suas edições locais serão sobrescritas.")) {
      setProjectList(PROJECT_TEMPLATES);
      setActiveProjectId(PROJECT_TEMPLATES[0].id);
      triggerToast("Presets profissionais restaurados!");
    }
  };

  const handleImportProjectJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as Project;
        
        if (!imported.id || !imported.settings || !imported.pages) {
          throw new Error("Arquivo JSON não contém a estrutura de projeto válida do Narrativa Gráfica Pro.");
        }
        
        const validatedProject: Project = {
          ...imported,
          id: imported.id.startsWith("proj-") ? imported.id : "proj-" + Date.now()
        };

        setProjectList((prev) => {
          const filtered = prev.filter(p => p.id !== validatedProject.id);
          return [validatedProject, ...filtered];
        });
        setActiveProjectId(validatedProject.id);
        triggerToast(`Projeto "${validatedProject.settings.title}" importado com sucesso!`);
      } catch (err: any) {
        alert(`Erro na importação: ${err.message || "Formato de arquivo inválido."}`);
      }
    };
    reader.readAsText(file);
  };

  // Secure API trigger helper passed to child modules
  const handleTriggerAiService = async (action: string, payload: any): Promise<string> => {
    try {
      const res = await fetch("/api/ai/creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          prompt: payload.prompt,
          projectContext: {
            title: activeProject.settings.title,
            format: activeProject.settings.format,
            genre: activeProject.settings.genre,
            style: activeProject.settings.style,
            premise: activeProject.settings.premise,
            theme: activeProject.settings.theme,
            characters: activeProject.characters && activeProject.characters.length > 0
              ? activeProject.characters.map(c => `${c.name} (${c.archetype}): ${c.objective}`).join("; ")
              : undefined,
            world: activeProject.world 
              ? `Era: ${activeProject.world.era}, Tecnologia: ${activeProject.world.technology}, Regras do Mundo: ${activeProject.world.worldRules}`
              : undefined
          }
        })
      });
      const data = await res.json();
      if (data.success && data.text) {
        return data.text;
      }
      throw new Error(data.error || "Erro ao consultar servidor de assistência.");
    } catch (e: any) {
      alert(`Serviço de IA Indisponível: ${e.message}`);
      return "Sinto muito, não consegui sugestões complementares no momento.";
    }
  };

  const sidebarTabs = [
    { value: "HOME", label: "Início", icon: Home },
    { value: "SCRIPT", label: "Estúdio de Decupagem", icon: Layout },
    { value: "STRUCTURE", label: "Estrutura Guiada", icon: BookOpen },
    { value: "CHARACTERS", label: "Elenco", icon: Users },
    { value: "WORLD", label: "Ambientação", icon: Globe },
    { value: "STORYBOARD", label: "Visualização & Layout", icon: Monitor },
    { value: "ANALYZER", label: "Análise Narrativa (IA)", icon: BarChart2 },
    { value: "EDU", label: "Escola de Quadrinhos", icon: GraduationCap },
    { value: "EXPORT", label: "Exportador Profissional", icon: Download }
  ];

  return (
    <div id="narrativa-app-container" className="min-h-screen bg-art-bg flex flex-col font-sans text-art-charcoal border-t-4 border-art-charcoal animate-fade-in text-[14px]">
      
      {/* 1. Global Clean Header */}
      <header className="bg-art-card border-b border-art-border py-4 px-6 shadow-xs sticky top-0 z-40">
        <div className="max-w-[1450px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex items-center gap-3">
            <img 
              src="/icon-192.png" 
              alt="Logo Narrativa Gráfica Pro" 
              className="h-10 w-10 rounded object-cover border border-art-border"
            />
            <div>
              <h1 className="text-xl font-serif font-medium text-art-charcoal tracking-wide leading-tight uppercase">
                Narrativa Gráfica Pro
              </h1>
              <p className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest leading-none mt-1">
                Estúdio de Roteiros HQs & Tirinhas • Curadoria
              </p>
            </div>
          </div>

          {/* Quick interactive Project Selector dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-art-sidebar border border-art-border py-2 px-3.5 rounded shadow-xs">
              <FolderOpen className="h-4 w-4 text-stone-600" />
              <select
                id="select-project-global"
                value={activeProjectId}
                onChange={(e) => {
                  setActiveProjectId(e.target.value);
                  setShowWizard(false);
                  triggerToast(`Ativando roteiro: ${projectList.find(p=>p.id===e.target.value)?.settings.title}`);
                }}
                className="font-sans text-xs bg-transparent border-none text-art-charcoal font-bold focus:outline-none uppercase tracking-wider cursor-pointer"
              >
                {projectList.map((p) => (
                  <option key={p.id} value={p.id}>{p.settings.title}</option>
                ))}
              </select>
            </div>

            <button
              id="btn-app-new-project"
              onClick={() => {
                setShowWizard(true);
                setActiveTab("HOME");
              }}
              className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2.5 px-5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Novo Quadrinho
            </button>

            <button
              id="btn-app-reset-presets"
              onClick={handleResetToPresets}
              className="p-2.5 border border-art-border hover:border-art-charcoal bg-art-card hover:bg-art-sidebar rounded transition-all cursor-pointer"
              title="Restaurar roteiros iniciais originais"
            >
              <RotateCcw className="h-4 w-4 text-stone-600" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Horizontal Navigation Bar */}
      {!showWizard && (
        <nav className="bg-art-card border-b border-art-border sticky top-[73px] z-30 shadow-2xs">
          <div className="max-w-[1450px] mx-auto px-4 md:px-6 flex flex-wrap items-center justify-between gap-4 py-1">
            <div className="flex flex-wrap gap-1">
              {sidebarTabs.map((tb) => {
                const IconComp = tb.icon;
                const isActive = activeTab === tb.value;
                return (
                  <button
                    id={`sidemenu-tab-${tb.value}`}
                    key={tb.value}
                    onClick={() => {
                      setActiveTab(tb.value as any);
                      setShowWizard(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "border-art-charcoal bg-art-sidebar text-art-charcoal font-bold opacity-100"
                        : "border-transparent text-art-charcoal opacity-60 hover:opacity-100 hover:bg-art-sidebar/30"
                    }`}
                  >
                    <IconComp className="h-4.5 w-4.5" />
                    <span className="uppercase tracking-wider">{tb.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Espinha da Obra inline summary widget */}
            {activeTab !== "HOME" && (
              <div className="hidden lg:flex items-center gap-2 max-w-md bg-art-sidebar/40 border border-art-border py-1.5 px-3 rounded shadow-3xs text-[11px] text-stone-600">
                <span className="font-mono font-bold text-[9px] uppercase tracking-wider text-stone-500 shrink-0">Espinha:</span>
                <p className="truncate italic font-serif">"{activeProject.settings.premise || "Nenhuma premissa anotada."}"</p>
              </div>
            )}
          </div>
        </nav>
      )}

      {/* 3. Global Toast Notification bar */}
      {globalMessage && (
        <div className="fixed bottom-6 right-6 bg-art-charcoal text-art-bg py-3 px-6 rounded shadow-xl flex items-center gap-2.5 z-50 text-xs font-semibold uppercase tracking-wider border border-art-border max-w-sm animate-slide-in">
          <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
          {globalMessage}
        </div>
      )}

      {/* 4. Main Workspace Scaffold wrapper */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        
        {showWizard ? (
          /* Create new project Wizard Board container */
          <div className="w-full">
            <div className="flex justify-between items-center max-w-2xl mx-auto mb-4 px-2">
              <button
                id="btn-cancel-wizard"
                onClick={() => setShowWizard(false)}
                className="text-xs text-stone-600 hover:text-art-charcoal font-semibold flex items-center gap-1 transition-all uppercase tracking-wider cursor-pointer"
              >
                ← Cancelar e Voltar para a Área de Escrita
              </button>
            </div>
            <ProjectWizard onComplete={handleCreateNewProject} />
          </div>
        ) : (
          /* Standard workspace wide panel (col-span-12 equivalent) */
          <div className="w-full">
            {activeTab === "HOME" && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Greeting Board */}
                <div className="bg-art-sidebar border-2 border-art-border rounded p-8 text-center relative overflow-hidden shadow-xs">
                  <div className="absolute top-[-50px] right-[-50px] p-4 opacity-5 pointer-events-none">
                    <GraduationCap className="h-64 w-64 text-art-charcoal" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-art-bg bg-art-charcoal uppercase tracking-widest px-3 py-1 rounded">
                    Mesa de Trabalho Principal
                  </span>
                  <h2 className="text-3xl font-serif font-bold text-art-charcoal mt-4 mb-2">
                    Narrativa Gráfica Pro
                  </h2>
                  <p className="text-stone-605 text-xs max-w-xl mx-auto italic font-serif leading-relaxed">
                    "Transformar ideias em narrativas gráficas profissionais através de uma experiência intuitiva, visual e educativa."
                  </p>
                </div>

                {/* Dashboard Grid Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Card 1: Novo Quadrinho */}
                  <div className="bg-art-card border border-art-border p-6 rounded shadow-sm hover:border-art-charcoal transition-all flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-art-charcoal uppercase tracking-wide">Novo Roteiro</h3>
                      <p className="text-stone-500 text-xs mt-2 leading-relaxed font-serif">
                        Inicie o processo estrutural de criação. O Wizard guiará você pelas premissas, gênero, quantidade de páginas e estilo estético.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowWizard(true)}
                      className="mt-6 w-full bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-3 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-3xs transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      Novo Roteiro
                    </button>
                  </div>

                  {/* Card 2: Continuar Roteiro */}
                  <div className="bg-art-card border border-art-border p-6 rounded shadow-sm hover:border-art-charcoal transition-all flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-art-charcoal uppercase tracking-wide">Meus Projetos</h3>
                      <p className="text-stone-500 text-xs mt-2 leading-relaxed font-serif mb-3">
                        Selecione e continue escrevendo uma de suas histórias salvas localmente neste navegador.
                      </p>
                      
                      {projectList.length > 0 && (
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                          {projectList.slice(0, 4).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setActiveProjectId(p.id);
                                setActiveTab("SCRIPT");
                                triggerToast(`Retomando: ${p.settings.title}`);
                              }}
                              className="w-full text-left p-2.5 bg-art-sidebar/30 hover:bg-art-sidebar border border-art-border/40 hover:border-art-border rounded text-[11px] font-semibold text-art-charcoal truncate block uppercase tracking-wide"
                            >
                              📁 {p.settings.title} ({p.settings.format.replace("_", " ")})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={() => {
                          setActiveTab("SCRIPT");
                          triggerToast(`Retomando roteiro ativo: ${activeProject.settings.title}`);
                        }}
                        className="flex-1 border border-art-border hover:border-art-charcoal hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-xs py-3 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-3xs transition-all cursor-pointer"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Abrir Ativo
                      </button>
                      
                      <label className="border border-art-border hover:border-art-charcoal hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-[10px] py-3 px-3 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-3xs transition-all cursor-pointer shrink-0">
                        <Download className="h-4 w-4 rotate-180 text-art-charcoal" />
                        Importar
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportProjectJson}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Card 3: Escola & Referências */}
                  <div className="bg-art-card border border-art-border p-6 rounded shadow-sm hover:border-art-charcoal transition-all flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-art-charcoal uppercase tracking-wide">Escola de Quadrinhos</h3>
                      <p className="text-stone-500 text-xs mt-2 leading-relaxed font-serif">
                        Estude os fundamentos clássicos da nona arte. Conheça as teorias de Will Eisner, Scott McCloud, Robert McKee e outros grandes autores.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("EDU")}
                      className="mt-6 w-full border border-art-border hover:border-art-charcoal hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-xs py-3 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-3xs transition-all cursor-pointer"
                    >
                      <GraduationCap className="h-4.5 w-4.5" />
                      Acessar Didática
                    </button>
                  </div>
                </div>

                {/* Quick Info / Config Section */}
                <div className="bg-art-card border border-art-border rounded p-6 shadow-3xs space-y-4">
                  <div className="border-b border-art-border pb-3">
                    <h4 className="text-xs font-mono font-bold text-art-charcoal uppercase tracking-wider">Configurações e Presets do Sistema</h4>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <p className="text-stone-600 font-serif leading-relaxed">
                      Se você cometer algum erro ou quiser recomeçar com os projetos padrões de exemplo (Beco das Sombras, Deuses do Cosmos e Tirinha de Tico & Juju), você pode restaurar os presets originais a qualquer momento.
                    </p>
                    <button
                      onClick={handleResetToPresets}
                      className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2.5 px-5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restaurar Presets
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "SCRIPT" && (
              <div className="animate-fade-in">
                <ScriptEditor
                  project={activeProject}
                  onChange={handleUpdateProject}
                  onTriggerAi={handleTriggerAiService}
                />
              </div>
            )}

            {activeTab === "STRUCTURE" && (
              <div className="animate-fade-in">
                <NarrativeStructure
                  project={activeProject}
                  onChange={handleUpdateProject}
                  onTriggerAi={handleTriggerAiService}
                  onTriggerToast={triggerToast}
                  method={activeProject.structureMethod}
                  guidedStructure={activeProject.guidedStructure}
                  structureAnswers={activeProject.structureAnswers}
                  onMethodChange={(met) => handleUpdateProject({ ...activeProject, structureMethod: met })}
                  onGuidedChange={(guided) => handleUpdateProject({ ...activeProject, guidedStructure: guided })}
                  onAnswersChange={(ans) => handleUpdateProject({ ...activeProject, structureAnswers: ans })}
                />
              </div>
            )}

            {activeTab === "CHARACTERS" && (
              <div className="animate-fade-in">
                <CharacterManager
                  characters={activeProject.characters}
                  onChange={(updatedChars) => handleUpdateProject({ ...activeProject, characters: updatedChars })}
                  onTriggerAi={handleTriggerAiService}
                />
              </div>
            )}

            {activeTab === "WORLD" && (
              <div className="animate-fade-in">
                <WorldBuilder
                  world={activeProject.world}
                  onChange={(updatedWorld) => handleUpdateProject({ ...activeProject, world: updatedWorld })}
                  onTriggerAi={handleTriggerAiService}
                />
              </div>
            )}

            {activeTab === "STORYBOARD" && (
              <div className="animate-fade-in">
                <StoryboardLayout
                  project={activeProject}
                  onChange={handleUpdateProject}
                />
              </div>
            )}

            {activeTab === "ANALYZER" && (
              <div className="animate-fade-in">
                <NarrativeAnalyzer project={activeProject} />
              </div>
            )}

            {activeTab === "EDU" && (
              <div className="animate-fade-in">
                <EduCenter 
                  onApplyReference={(ref) => {
                    // Append style details with this referential philosophy
                    const currentStyle = activeProject.settings.style;
                    handleUpdateProject({
                      ...activeProject,
                      settings: {
                        ...activeProject.settings,
                        style: (currentStyle ? currentStyle + " | " : "") + `Filosofia: ${ref}`
                      }
                    });
                    triggerToast(`Estilo de roteiro atualizado com referências de: ${ref}`);
                  }}
                />
              </div>
            )}

            {activeTab === "EXPORT" && (
              <div className="animate-fade-in">
                <ExportPanel project={activeProject} onChange={handleUpdateProject} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="bg-art-sidebar border-t border-art-border py-8 mt-12 text-center text-xs text-stone-550">
        <div className="max-w-[1450px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-serif text-stone-600">© 2026 Narrativa Gráfica Pro. Elegância e Rigor no Idioma dos Quadrinhos.</p>
          <div className="flex gap-4 font-mono text-[10px] uppercase tracking-wider text-stone-500">
            <span className="hover:text-art-charcoal transition-all">Will Eisner & Scott McCloud Model</span>
            <span>•</span>
            <span className="hover:text-art-charcoal transition-all">Curadoria de Roteiro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
