import React, { useState } from "react";
import { Project, ScriptPage, Panel } from "../types";
import { 
  Play, Plus, Trash2, Layout, Sliders, Type, HelpCircle, 
  Sparkles, MessageSquare, Mic, BookOpen, Layers, Camera, ArrowRightLeft, Eye, X
} from "lucide-react";

interface ScriptEditorProps {
  project: Project;
  onChange: (updatedProject: Project) => void;
  onTriggerAi?: (type: string, payload: any) => Promise<string>;
}

export default function ScriptEditor({ project, onChange, onTriggerAi }: ScriptEditorProps) {
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [activePanelIdx, setActivePanelIdx] = useState<number | null>(0);
  const [writeMode, setWriteMode] = useState<"SIMPLE" | "PROFESSIONAL" | "VISUAL" | "STRIP">("PROFESSIONAL");
  
  const [showCompositionInfo, setShowCompositionInfo] = useState(false);
  const [selectedCompTechnique, setSelectedCompTechnique] = useState<number | null>(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSelectedField, setAiSelectedField] = useState<"dialogue" | "sfx" | "description">("dialogue");

  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const activePage = project.pages[activePageIdx] || project.pages[0];

  const handleUpdatePanel = (panelId: string, fields: Partial<Panel>) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          panels: p.panels.map((pnl) => (pnl.id === panelId ? { ...pnl, ...fields } : pnl))
        };
      }
      return p;
    });
    onChange({ ...project, pages: updatedPages });
  };

  const handleUpdatePageNotes = (notes: string) => {
    const updatedPages = project.pages.map((p) => 
      p.id === activePage.id ? { ...p, rhythmNotes: notes } : p
    );
    onChange({ ...project, pages: updatedPages });
  };

  const handleAddPage = () => {
    const newPage: ScriptPage = {
      id: "page-" + Date.now(),
      pageNumber: project.pages.length + 1,
      rhythmNotes: "Ação constante.",
      panels: [
        {
          id: "panel-" + Date.now() + "-1",
          panelNumber: 1,
          framing: "Plano médio",
          visualDescription: "Rascunhe os primeiros movimentos físicos da cena aqui...",
          dialogue: "",
          narration: "",
          soundEffects: "",
          emotions: "Curiosidade",
          cameraMovement: "Estática",
          timeOfScene: "Tarde",
          artistNotes: "Foque na clareza do enredo."
        }
      ]
    };
    onChange({ ...project, pages: [...project.pages, newPage] });
    setActivePageIdx(project.pages.length);
    setActivePanelIdx(0);
  };

  const handleDeletePage = (pageId: string) => {
    if (project.pages.length <= 1) return;
    const filtered = project.pages.filter((p) => p.id !== pageId);
    // Recalculate page numbers to prevent desync
    const renumbered = filtered.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    onChange({ ...project, pages: renumbered });
    setActivePageIdx(0);
    setActivePanelIdx(0);
  };

  const handleAddPanel = () => {
    const nextNum = activePage.panels.length + 1;
    const newPanel: Panel = {
      id: "panel-" + Date.now() + "-" + nextNum,
      panelNumber: nextNum,
      framing: "Plano médio",
      visualDescription: `Nova descrição visual para o quadro ${nextNum}...`,
      dialogue: "",
      narration: "",
      soundEffects: "",
      emotions: "Intensidade",
      cameraMovement: "Estática",
      timeOfScene: "Dia",
      artistNotes: "Use enquadramentos limpos."
    };

    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          panels: [...p.panels, newPanel]
        };
      }
      return p;
    });
    onChange({ ...project, pages: updatedPages });
    setActivePanelIdx(activePage.panels.length);
  };

  const handleDeletePanel = (panelId: string) => {
    if (activePage.panels.length <= 1) return;
    const filteredPanels = activePage.panels.filter((p) => p.id !== panelId);
    const renumbered = filteredPanels.map((p, i) => ({ ...p, panelNumber: i + 1 }));
    
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          panels: renumbered
        };
      }
      return p;
    });
    onChange({ ...project, pages: updatedPages });
    setActivePanelIdx(0);
  };

  const handleAiDialogueImprove = async (activePanel: Panel) => {
    if (!onTriggerAi) return;
    setAiLoading(true);
    try {
      if (aiSelectedField === "dialogue") {
        const result = await onTriggerAi("dialogues", {
          prompt: activePanel.dialogue || "Reescreva de forma natural: HEROI: Eu preciso vencer você agora de qualquer jeito!"
        });
        handleUpdatePanel(activePanel.id, { dialogue: result });
      } else if (aiSelectedField === "sfx") {
        const result = await onTriggerAi("ideas", {
          prompt: `Sugerira 3 onomatopeias expressivas para a seguinte ação física no quadrinho: "${activePanel.visualDescription}". Me de apenas as onomatopeias em soco e curtas separados por virgula.`
        });
        handleUpdatePanel(activePanel.id, { soundEffects: result });
      } else {
        const result = await onTriggerAi("framing", {
          prompt: activePanel.visualDescription || "Um herói saltando contra hordas alienígenas interestelares."
        });
        handleUpdatePanel(activePanel.id, { artistNotes: result });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const cameraPresetFraming = [
    { name: "Plano geral", desc: "Mostra o cenário inteiro e localiza os personagens de longe." },
    { name: "Plano médio", desc: "Mostra os personagens da cintura para cima. Perfeito para diálogo normal." },
    { name: "Close-up", desc: "Fecha no rosto do personagem para destacar expressões sutis e sentimentos." },
    { name: "Close extremo", desc: "Foca em um detalhe crucial (olhos arregalados, gatilho, copo caindo)." },
    { name: "Plano americano", desc: "Enquadramento dos joelhos para cima, inspirado no ritmo de duelos Western." },
    { name: "Plongée", desc: "Câmera dita de cima para baixo, transmitindo fragilidade, pequenez ou opressão." },
    { name: "Contra-plongée", desc: "Câmera dita de baixo para cima, dando gigantismo, poder e heroísmo." },
    { name: "Dutch angle", desc: "Câmera levemente inclinada de lado, projetando caos, pânico ou desorientação intelectual." },
    { name: "POV", desc: "Ponto de Vista: Câmera simula o olhar exato do próprio personagem." },
    { name: "Over shoulder", desc: "Sobre o Ombro: Enquadra a cena sobre o ombro de um personagem focando no outro." }
  ];

  const compositionTechniques = [
    { name: "Regra dos terços", desc: "Divida a imagem em uma grade 3x3 e posicione o foco principal nos pontos de interseção para dinamismo.", promptAdd: "Composição baseada na regra dos terços, focando o objeto de interesse nas interseções." },
    { name: "Linhas-guia", desc: "Use caminhos, cabos, ruas ou cercas no cenário que direcionem os olhos do leitor para o foco central.", promptAdd: "Composição com linhas-guia cenográficas apontando para o personagem central." },
    { name: "Silhueta", desc: "Posicione o personagem contra um fundo extremamente iluminado para destacar seu contorno misterioso ou dramático.", promptAdd: "Alto contraste expressionista com silhueta escura do personagem contra a luz de fundo." },
    { name: "Peso visual", desc: "Distribua elements maiores ou mais escuros em um canto para criar um desequilíbrio emocional ou calmaria.", promptAdd: "Composição desequilibrada com forte peso visual no canto inferior para dar peso dramático." },
    { name: "Direção do olhar", desc: "Alinhe as falas e posições dos personagens para criar um fluxo visual natural da esquerda para a direita.", promptAdd: "Desenho estruturado seguindo a direção do olhar natural da leitura ocidental." },
    { name: "Contraste", desc: "Coloque elementos muito claros ao lado de formas pretas densas para atrair atenção imediata no painel.", promptAdd: "Contraste dramático profundo (Chiaroscuro) enfatizando a iluminação da cena." },
    { name: "Profundidade", desc: "Adicione elementos muito próximos da câmera desfocados e outros distantes para simular três dimensões.", promptAdd: "Profundidade de campo com primeiro plano desfocado e cenário de fundo nítido." },
    { name: "Composição triangular", desc: "Posicione três elementos chaves formando um triângulo, dando estabilidade clássica ou clímax à cena.", promptAdd: "Disposição dos personagens formando um triângulo composicional estável." },
    { name: "Composição simétrica", desc: "Divida o quadro igualmente ao meio para transmitir paz, divindade, rigidez ou suspense ritual.", promptAdd: "Composição simétrica centralizada perfeita, transmitindo imponência e suspensão temporal." },
    { name: "Composição dinâmica", desc: "Incline o horizonte (linhas diagonais ativas) para dar sensação de velocidade extrema, queda ou colisão.", promptAdd: "Perspectiva hiperdinâmica com linhas de fuga diagonais ativas e horizonte inclinado." }
  ];

  const mcCloudTransitions = [
    { name: "Momento-a-Momento", desc: "Mudança ínfima de tempo entre quadros (ex: fechar de olhos). Requer muita paciência de leitura." },
    { name: "Ação-a-Ação", desc: "Mostra um personagem realizando uma ação linear continuada (soco -> queda). Muito fluido." },
    { name: "Tema-a-Tema", desc: "Muda o foco de personagem ou objeto dentro da mesmíssima cena (ex: quem fala -> quem escuta)." },
    { name: "Cena-a-Cena", desc: "Grandes saltos de tempo ou espaço físico com elipses necessárias." },
    { name: "Aspecto-a-Aspecto", desc: "Mostra detalhes independentes do local para fixar clima, atmosfera ou lugar (comum em mangás)." }
  ];

  const activePanel = (activePage?.panels && activePanelIdx !== null && activePage.panels[activePanelIdx])
    ? activePage.panels[activePanelIdx]
    : activePage?.panels?.[0];

  return (
    <div id="script-editor-studio" className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1550px] mx-auto text-xs">
      
      {/* 1. Sidebar Panel: Page List Tree / Rhythm Notes */}
      <div className="lg:col-span-3 bg-art-card border border-art-border rounded p-4 h-fit space-y-4 shadow-3xs">
        <div className="flex justify-between items-center border-b border-art-border pb-3">
          <h3 className="font-serif font-bold text-xs text-art-charcoal uppercase tracking-wider flex items-center gap-1.5">
            <Layout className="h-4.5 w-4.5 text-art-charcoal" />
            Estrutura Pág.
          </h3>
          <button
            id="btn-add-page"
            onClick={handleAddPage}
            className="text-[10px] bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold uppercase tracking-wider py-1.5 px-3 rounded flex items-center gap-1 transition-all cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            Adicionar
          </button>
        </div>

        {/* List of Pages */}
        <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
          {project.pages.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => {
                setActivePageIdx(idx);
                setActivePanelIdx(0);
              }}
              className={`p-2.5 rounded border transition-all flex justify-between items-center cursor-pointer ${
                activePageIdx === idx
                  ? "bg-art-sidebar border-art-border text-art-charcoal font-bold"
                  : "bg-art-card border-transparent hover:bg-art-sidebar/20 text-stone-600"
              }`}
            >
              <span className="font-serif italic font-medium">Página {p.pageNumber}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono bg-art-charcoal text-art-bg font-bold px-1.5 py-0.5 rounded uppercase">
                  {p.panels.length} {p.panels.length === 1 ? "Quadro" : "Quadros"}
                </span>
                {project.pages.length > 1 && (
                  <button
                    id={`btn-del-page-${p.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(p.id);
                    }}
                    className="text-stone-400 hover:text-art-charcoal p-1 rounded transition-all"
                    title="Excluir página"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pacing description per page */}
        <div className="bg-art-sidebar/25 p-3.5 border border-art-border rounded space-y-2">
          <label className="block text-[9px] font-mono font-bold text-stone-555 uppercase tracking-widest leading-none">
            Controle de Ritmo (Pacing) • Pág {activePage?.pageNumber}
          </label>
          <textarea
            id="input-page-pacing-notes"
            rows={3}
            value={activePage?.rhythmNotes || ""}
            onChange={(e) => handleUpdatePageNotes(e.target.value)}
            placeholder="Ex: Ritmo tenso. Cenas alongadas que explodem no último quadro com gancho de mistério..."
            className="w-full text-xs font-serif p-2 bg-art-card border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal placeholder-stone-400"
          />
        </div>

        {/* Theory advice widget */}
        <div className="p-3 bg-art-sidebar/40 rounded border border-art-border space-y-1.5">
          <h4 className="text-[10px] font-mono font-bold text-art-charcoal flex items-center gap-1 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            Dica de McCloud:
          </h4>
          <p className="text-[10px] text-stone-705 italic leading-relaxed font-serif">
            "O tamanho e a largura do quadro controlam diretamente a quantidade de tempo que o leitor descansa os olhos e processa a ação."
          </p>
        </div>
      </div>

      {writeMode === "STRIP" ? (
        /* ==================== MODO TIRINHA HORIZONTAL ==================== */
        <div className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center bg-art-card border border-art-border p-4 rounded shadow-3xs">
            <div>
              <span className="text-[9px] font-mono font-bold text-art-bg bg-art-charcoal px-2.5 py-1 rounded">
                PÁGINA {activePage?.pageNumber} • MODO TIRINHA (PÁGINA DE {project.pages.length})
              </span>
              <h3 className="text-sm font-serif font-bold text-art-charcoal mt-2.5 uppercase tracking-wide">Módulo Tirinha Horizontal</h3>
            </div>

            <div className="flex gap-2">
              <button
                id="btn-add-panel-strip"
                onClick={handleAddPanel}
                className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded flex items-center gap-1 shadow-3xs transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Inserir Quadro
              </button>
            </div>
          </div>

          {/* Horizontal Strip Row of Panels */}
          <div className="bg-art-sidebar/20 border border-art-border p-5 rounded grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activePage?.panels.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => setActivePanelIdx(idx)}
                className={`bg-art-card border-2 rounded p-4 flex flex-col justify-between transition-all hover:border-art-charcoal cursor-pointer relative ${
                  activePanelIdx === idx ? "border-art-charcoal shadow-sm scale-[1.02]" : "border-art-border"
                }`}
              >
                <div className="flex justify-between items-center border-b border-art-border pb-2.5 mb-2.5">
                  <span className="h-5 w-5 rounded bg-art-charcoal text-art-bg text-[9.5px] font-mono font-bold flex items-center justify-center">
                    Q{p.panelNumber}
                  </span>
                  <span className="text-[9px] font-mono bg-stone-700 text-art-bg px-2 py-0.5 rounded uppercase tracking-wider">
                    {p.framing}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5">
                  <p className="text-xs text-stone-850 font-serif italic">"{p.visualDescription}"</p>
                  {p.dialogue && (
                    <div className="p-2 bg-art-sidebar/30 rounded border-l-2 border-art-charcoal text-[11px] leading-relaxed italic text-stone-700 font-serif">
                      "{p.dialogue}"
                    </div>
                  )}
                  {p.soundEffects && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-red-750 block">💥 {p.soundEffects}</span>
                  )}
                </div>
                <div className="flex justify-between items-center border-t border-art-border pt-2.5 mt-2.5">
                  <span className="text-[9px] font-mono text-stone-400">Sarjeta</span>
                  {activePage.panels.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePanel(p.id);
                      }}
                      className="text-stone-400 hover:text-red-700 transition-all p-1"
                      title="Excluir quadro"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Active Panel Details Editor below row */}
          {activePanel && (
            <div className="bg-art-card border border-art-border rounded p-6 shadow-3xs space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-art-border pb-3">
                <div>
                  <h3 className="font-serif font-bold text-sm text-art-charcoal">
                    Editor do Quadro {activePanel.panelNumber}
                  </h3>
                  <p className="text-[9px] text-stone-550 uppercase font-mono tracking-widest mt-0.5">
                    Modo Tirinha Horizontal
                  </p>
                </div>

                <div className="flex bg-art-sidebar p-0.5 rounded border border-art-border">
                  <button onClick={() => setWriteMode("SIMPLE")} className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${writeMode === "SIMPLE" ? "bg-art-charcoal text-art-bg" : "text-stone-550"}`}>Simples</button>
                  <button onClick={() => setWriteMode("PROFESSIONAL")} className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${writeMode === "PROFESSIONAL" ? "bg-art-charcoal text-art-bg" : "text-stone-550"}`}>Pro</button>
                  <button onClick={() => setWriteMode("VISUAL")} className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${writeMode === "VISUAL" ? "bg-art-charcoal text-art-bg" : "text-stone-550"}`}>Visual</button>
                  <button onClick={() => setWriteMode("STRIP")} className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${writeMode === "STRIP" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550"}`}>Tirinha</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Column Left: Visuals & Framing */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5">Descrição Visual da Imagem</label>
                    <textarea
                      rows={3}
                      value={activePanel.visualDescription}
                      onChange={(e) => handleUpdatePanel(activePanel.id, { visualDescription: e.target.value })}
                      placeholder="O que acontece na imagem..."
                      className="w-full text-xs font-sans p-2.5 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal placeholder-stone-400 leading-relaxed"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Enquadramento</label>
                      <select
                        value={activePanel.framing}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { framing: e.target.value })}
                        className="w-full font-sans text-xs p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal"
                      >
                        {cameraPresetFraming.map((f) => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Movimento da Câmera</label>
                      <input
                        type="text"
                        value={activePanel.cameraMovement}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { cameraMovement: e.target.value })}
                        placeholder="Ex: Estática"
                        className="w-full text-xs font-sans p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Notas ao Ilustrador</label>
                    <textarea
                      rows={2}
                      value={activePanel.artistNotes}
                      onChange={(e) => handleUpdatePanel(activePanel.id, { artistNotes: e.target.value })}
                      placeholder="Instruções de desenho..."
                      className="w-full text-xs font-serif p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal"
                    />
                  </div>
                </div>

                {/* Column Right: Audio & Dialogs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Falas / Balões</label>
                    <textarea
                      rows={3}
                      value={activePanel.dialogue}
                      onChange={(e) => handleUpdatePanel(activePanel.id, { dialogue: e.target.value })}
                      placeholder="MANOEL: E agora?..."
                      className="w-full text-xs font-serif p-2.5 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Recordatório</label>
                      <textarea
                        rows={2}
                        value={activePanel.narration}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { narration: e.target.value })}
                        placeholder="Ex: Exclusivo..."
                        className="w-full text-xs font-serif p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">Onomatopeia / Som</label>
                      <textarea
                        rows={2}
                        value={activePanel.soundEffects}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { soundEffects: e.target.value })}
                        placeholder="Ex: BAM!"
                        className="w-full text-xs font-mono p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none text-art-charcoal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ==================== MODO COMUM (SIMPLE / PRO / VISUAL) ==================== */
        <>
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-between items-center bg-art-card border border-art-border p-4 rounded shadow-3xs">
              <div>
                <span className="text-[9px] font-mono font-bold text-art-bg bg-art-charcoal px-2.5 py-1 rounded">
                  PÁGINA {activePage?.pageNumber} DE {project.pages.length}
                </span>
                <h3 className="text-sm font-serif font-bold text-art-charcoal mt-2.5 uppercase tracking-wide">
                  {writeMode === "VISUAL" ? "Visualizador do Quadro" : "Quadros / Decupagem"}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  id="btn-add-panel"
                  onClick={handleAddPanel}
                  className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded flex items-center gap-1 shadow-3xs transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Inserir Quadro
                </button>
              </div>
            </div>

            {writeMode === "VISUAL" && activePanel ? (
              /* Visual Thumbnail Wireframe mockup card */
              <div className="bg-art-sidebar/30 border-2 border-art-border rounded p-6 text-center space-y-4 min-h-[350px] flex flex-col justify-between shadow-inner relative overflow-hidden animate-fade-in">
                <div className="absolute top-3 left-3 bg-art-charcoal text-art-bg text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  Quadro {activePanel.panelNumber}
                </div>
                <div className="absolute top-3 right-3 bg-stone-750 text-art-bg text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {activePanel.framing || "Plano Geral"}
                </div>
                
                {/* SVG Visual Wireframe representation */}
                <div className="my-auto border border-dashed border-art-border p-8 rounded-lg bg-art-card flex flex-col items-center justify-center space-y-4 shadow-3xs">
                  <Camera className="h-10 w-10 text-stone-400 animate-pulse" />
                  <p className="text-xs font-serif italic text-stone-750 max-w-sm leading-relaxed">
                    "{activePanel.visualDescription || "Descreva a cena para gerar o escopo visual do quadro..."}"
                  </p>
                  {activePanel.soundEffects && (
                    <span className="bg-art-sidebar border-2 border-art-charcoal px-4 py-1.5 text-xs font-mono font-bold text-art-charcoal uppercase tracking-widest scale-105 shadow-2xs rotate-[-2deg]">
                      💥 {activePanel.soundEffects}
                    </span>
                  )}
                </div>

                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">
                  Câmera: {activePanel.cameraMovement || "Estática"} • Clima: {activePanel.emotions || "Sensação"}
                </div>
              </div>
            ) : (
              /* Standard panels vertical list in simple/pro modes */
              <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
                {activePage?.panels.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => setActivePanelIdx(idx)}
                    className={`p-4 rounded border-2 transition-all cursor-pointer relative bg-art-card ${
                      activePanelIdx === idx
                        ? "border-art-charcoal shadow-xs"
                        : "border-art-border/50 hover:border-art-charcoal/50"
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-art-border pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded bg-art-charcoal text-art-bg text-[10px] font-mono font-bold flex items-center justify-center">
                          {p.panelNumber}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-art-bg bg-stone-700 px-2 py-0.5 rounded uppercase tracking-wider">
                          {p.framing || "Plano médio"}
                        </span>
                      </div>
                      {activePage.panels.length > 1 && (
                        <button
                          id={`btn-del-panel-${p.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePanel(p.id);
                          }}
                          className="text-stone-400 hover:text-art-charcoal p-1 rounded hover:bg-art-sidebar/45 transition-all"
                          title="Excluir quadro"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-xs text-stone-850 leading-relaxed font-sans">
                        <strong className="font-mono text-[9px] text-stone-500 uppercase tracking-widest mr-1.5 block md:inline">IMAGEM:</strong>
                        {p.visualDescription || <span className="text-stone-350 italic">Sem descrição ainda...</span>}
                      </p>
                      {p.dialogue && (
                        <div className="p-3 bg-art-sidebar/20 rounded border-l-2 border-art-charcoal leading-relaxed italic font-serif text-stone-700 select-all">
                          <span className="font-mono not-italic font-bold text-[9px] text-stone-555 uppercase tracking-widest mr-2 block mb-1">FALAS:</span>
                          "{p.dialogue}"
                        </div>
                      )}
                      {p.soundEffects && (
                        <p className="text-[10px] text-stone-800 font-bold uppercase tracking-widest font-mono">
                          ✦ ONOMATOPEIA: <span className="underline decoration-double">{p.soundEffects}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Right Panel: Active Panel Details Editor Panel */}
          <div className="lg:col-span-4 bg-art-card border border-art-border rounded p-5 shadow-3xs h-fit space-y-5">
            {activePanel ? (
              <div className="space-y-5 animate-fade-in">
                <div className="flex justify-between items-center border-b border-art-border pb-3">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-art-charcoal">
                      Módulo Quadro {activePanel.panelNumber}
                    </h3>
                    <p className="text-[9px] text-stone-550 uppercase font-mono tracking-widest mt-0.5">
                      Decupagem Detalhada
                    </p>
                  </div>

                  <div className="flex bg-art-sidebar p-0.5 rounded border border-art-border">
                    <button
                      id="btn-mode-simple"
                      onClick={() => setWriteMode("SIMPLE")}
                      className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        writeMode === "SIMPLE" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
                      }`}
                    >
                      Simple
                    </button>
                    <button
                      id="btn-mode-prof"
                      onClick={() => setWriteMode("PROFESSIONAL")}
                      className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        writeMode === "PROFESSIONAL" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
                      }`}
                    >
                      Pro
                    </button>
                    <button
                      id="btn-mode-visual"
                      onClick={() => setWriteMode("VISUAL")}
                      className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        writeMode === "VISUAL" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
                      }`}
                    >
                      Vis
                    </button>
                    <button
                      id="btn-mode-strip"
                      onClick={() => setWriteMode("STRIP")}
                      className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                        writeMode === "STRIP" ? "bg-art-charcoal text-art-bg shadow-3xs" : "text-stone-550 hover:text-art-charcoal"
                      }`}
                    >
                      Strip
                    </button>
                  </div>
                </div>

                {/* Active Project Color Palette widget */}
                {project.world.colorPalette && project.world.colorPalette.length > 0 && (
                  <div className="bg-art-sidebar/20 p-3 rounded border border-art-border space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest leading-none">
                        Paleta de Cores do Projeto
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 font-bold uppercase tracking-wider leading-none">
                        Clique para copiar hex
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {project.world.colorPalette.map((col, idx) => (
                        <button
                          id={`btn-copy-pal-${idx}`}
                          key={idx}
                          onClick={() => handleCopyColor(col)}
                          className="relative h-6 w-11 rounded border border-art-charcoal/25 flex items-center justify-center transition-all hover:scale-105 hover:border-art-charcoal cursor-pointer shadow-3xs hover:shadow-2xs shrink-0"
                          style={{ backgroundColor: col }}
                          title={`Clique para copiar ${col.toUpperCase()}`}
                        >
                          <span className="bg-black/50 text-[7px] text-white font-mono font-bold px-1 py-0.5 rounded scale-90 leading-none">
                            {copiedColor === col ? "Copied" : col.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core common script inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5 flex justify-between items-center mt-0.5">
                      <span>Descrição Visual da Imagem</span>
                      <span className="text-[8px] tracking-wider text-art-charcoal bg-art-sidebar px-1.5 py-0.5 rounded font-mono font-bold uppercase">Direção de Arte</span>
                    </label>
                    <textarea
                      id="input-desc-pnl"
                      rows={writeMode === "VISUAL" ? 5 : 3}
                      value={activePanel.visualDescription}
                      onChange={(e) => handleUpdatePanel(activePanel.id, { visualDescription: e.target.value })}
                      placeholder="Descreva o que acontece fisicamente no quadro estrutural..."
                      className="w-full text-xs font-sans p-2.5 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal placeholder-stone-400 leading-relaxed"
                    />
                  </div>

                  {writeMode !== "VISUAL" && (
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5 flex justify-between items-center mt-0.5">
                        <span>Diálogos e Falas</span>
                        <span className="text-[8px] tracking-wider text-art-charcoal bg-art-sidebar px-1.5 py-0.5 rounded font-mono font-bold uppercase">Expressividade</span>
                      </label>
                      <textarea
                        id="input-dialogue-pnl"
                        rows={2}
                        value={activePanel.dialogue}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { dialogue: e.target.value })}
                        placeholder="EX: MANOEL: Não dê mais um passo!"
                        className="w-full text-xs font-serif p-2.5 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal placeholder-stone-400 leading-relaxed"
                      />
                    </div>
                  )}

                  {writeMode !== "VISUAL" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5 leading-none">
                          Narrador (Texto)
                        </label>
                        <textarea
                          id="input-narration-pnl"
                          rows={2}
                          value={activePanel.narration}
                          onChange={(e) => handleUpdatePanel(activePanel.id, { narration: e.target.value })}
                          placeholder="Ex: Aquela noite..."
                          className="w-full text-xs font-serif p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono font-bold text-stone-555 uppercase tracking-widest mb-1.5 leading-none">
                          Onomatopeia / Som
                        </label>
                        <textarea
                          id="input-sfx-pnl"
                          rows={2}
                          value={activePanel.soundEffects}
                          onChange={(e) => handleUpdatePanel(activePanel.id, { soundEffects: e.target.value })}
                          placeholder="Ex: CRASH!"
                          className="w-full text-xs font-mono p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional/Visual expanded outputs (Câmera, Composição etc.) */}
                {(writeMode === "PROFESSIONAL" || writeMode === "VISUAL") && (
                  <div className="border-t border-art-border pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                          Dinâmica da Câmera
                        </label>
                        <input
                          id="input-camera-pnl"
                          type="text"
                          value={activePanel.cameraMovement}
                          onChange={(e) => handleUpdatePanel(activePanel.id, { cameraMovement: e.target.value })}
                          placeholder="Ex: Panorâmica lenta"
                          className="w-full text-xs font-sans p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                          Clima / Emoção
                        </label>
                        <input
                          id="input-emotion-pnl"
                          type="text"
                          value={activePanel.emotions}
                          onChange={(e) => handleUpdatePanel(activePanel.id, { emotions: e.target.value })}
                          placeholder="Ex: Suspense noir"
                          className="w-full text-xs font-sans p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                        />
                      </div>
                    </div>

                    {/* Camera Framing Preset Selector chips */}
                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5 block">
                        Enquadramentos Sequenciais
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto p-1.5 border border-art-border rounded bg-art-sidebar/10 scrollbar-thin scrollbar-thumb-stone-300">
                        {cameraPresetFraming.map((frm) => (
                          <button
                            id={`btn-frame-chip-${frm.name}`}
                            key={frm.name}
                            onClick={() => handleUpdatePanel(activePanel.id, { framing: frm.name })}
                            className={`px-2 py-1 text-[9px] font-sans font-bold uppercase rounded transition-all cursor-pointer ${
                              activePanel.framing === frm.name
                                ? "bg-art-charcoal text-art-bg shadow-3xs"
                                : "bg-art-card text-stone-600 hover:text-art-charcoal border border-art-border"
                            }`}
                            title={frm.desc}
                          >
                            {frm.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Visual Composition Techniques Accordion */}
                    <div className="border-t border-art-border/40 pt-4">
                      <button
                        id="btn-toggle-composition"
                        onClick={() => setShowCompositionInfo(!showCompositionInfo)}
                        className="w-full flex justify-between items-center text-[10px] font-mono font-bold text-stone-555 uppercase tracking-widest cursor-pointer bg-art-sidebar/30 py-1.5 px-2.5 border border-art-border rounded"
                      >
                        <span>✦ Composição Visual ({showCompositionInfo ? "Ocultar" : "Mostrar"})</span>
                        <span>{showCompositionInfo ? "▲" : "▼"}</span>
                      </button>
                      {showCompositionInfo && (
                        <div className="mt-3 space-y-2 max-h-[220px] overflow-y-auto pr-1 border border-art-border rounded p-2.5 bg-art-sidebar/15 scrollbar-thin">
                          {compositionTechniques.map((tech, idx) => (
                            <div key={idx} className="border-b border-art-border/40 pb-2 last:border-none">
                              <button
                                onClick={() => setSelectedCompTechnique(selectedCompTechnique === idx ? null : idx)}
                                className="w-full text-left font-serif font-bold text-xs text-art-charcoal hover:underline flex justify-between items-center cursor-pointer uppercase tracking-wide text-[10.5px]"
                              >
                                <span>{tech.name}</span>
                                <span className="font-sans text-xs">{selectedCompTechnique === idx ? "−" : "+"}</span>
                              </button>
                              {selectedCompTechnique === idx && (
                                <div className="mt-2 space-y-2 pl-1 animate-fade-in">
                                  <p className="text-[10px] text-stone-605 leading-normal font-serif italic">{tech.desc}</p>
                                  <button
                                    onClick={() => {
                                      handleUpdatePanel(activePanel.id, {
                                        artistNotes: (activePanel.artistNotes ? activePanel.artistNotes + " | " : "") + tech.promptAdd
                                      });
                                    }}
                                    className="bg-art-charcoal hover:bg-stone-850 text-art-bg text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded transition-all cursor-pointer inline-block"
                                  >
                                    Adicionar Nota Técnica
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                        <Sliders className="h-3.5 w-3.5 text-art-charcoal" />
                        Notas e Recomendações de Ilustração
                      </label>
                      <textarea
                        id="input-artist-notes"
                        rows={2}
                        value={activePanel.artistNotes}
                        onChange={(e) => handleUpdatePanel(activePanel.id, { artistNotes: e.target.value })}
                        placeholder="Instrua tons, luzes, referências de enquadramento Will Eisner ou Scott McCloud..."
                        className="w-full text-xs font-serif italic p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Quick AI Help block */}
                {onTriggerAi && (
                  <div className="bg-art-sidebar/25 border border-dashed border-art-border rounded p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-art-charcoal uppercase tracking-widest flex items-center gap-1 leading-none">
                        <Sparkles className="h-3.5 w-3.5 text-art-charcoal animate-pulse" />
                        Assistente IA de Imagem e Voz
                      </span>
                      
                      <select
                        id="select-ai-action"
                        value={aiSelectedField}
                        onChange={(e) => setAiSelectedField(e.target.value as any)}
                        className="text-[9px] font-sans bg-art-card border border-art-border rounded p-1 focus:outline-none text-art-charcoal cursor-pointer font-bold uppercase tracking-wider"
                      >
                        <option value="dialogue">Polir Diálogo</option>
                        <option value="sfx">Sugerir Onomatopeia</option>
                        <option value="description">Instruções para Desenhista</option>
                      </select>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        id="btn-trigger-ai-action"
                        disabled={aiLoading}
                        onClick={() => handleAiDialogueImprove(activePanel)}
                        className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-[9px] uppercase tracking-widest py-1.5 px-3 rounded flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {aiLoading ? "Consultando IA..." : "Invocar Auxílio de IA"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-stone-400 font-serif italic">
                Selecione ou crie um quadro na coluna central para iniciar a decupagem.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
