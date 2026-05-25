import React, { useState, useEffect } from "react";
import { Project, Panel, ScriptPage } from "../types";
import { 
  Play, ChevronUp, ChevronDown, Check, Columns, Shuffle, 
  HelpCircle, Sparkles, BookOpen, Monitor, Maximize, Eye, Move, X,
  Camera, History, Trash2, RotateCcw
} from "lucide-react";

interface LayoutSnapshot {
  id: string;
  timestamp: string;
  label: string;
  pages: ScriptPage[];
  gridCols: 2 | 3 | 4;
}

interface StoryboardLayoutProps {
  project: Project;
  onChange: (updatedProject: Project) => void;
}

export default function StoryboardLayout({ project, onChange }: StoryboardLayoutProps) {
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState(false);
  const [simPanelIdx, setSimPanelIdx] = useState(0);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [expandedPanelId, setExpandedPanelId] = useState<string | null>(null);

  // Snapshot System State
  const [snapshots, setSnapshots] = useState<LayoutSnapshot[]>([]);
  const [snapshotName, setSnapshotName] = useState("");

  const handleTakeSnapshot = () => {
    const label = snapshotName.trim() || `Layout ${snapshots.length + 1}`;
    const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    
    // Deep clone the pages array to preserve exactly this moment's layout structure
    const clonedPages = JSON.parse(JSON.stringify(project.pages));

    const newSnapshot: LayoutSnapshot = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString().slice(-4),
      timestamp: now,
      label,
      pages: clonedPages,
      gridCols,
    };

    setSnapshots([newSnapshot, ...snapshots]);
    setSnapshotName("");
  };

  const handleRestoreSnapshot = (snap: LayoutSnapshot) => {
    // Deep clone before restoring to prevent mutations
    const clonedPages = JSON.parse(JSON.stringify(snap.pages));
    onChange({
      ...project,
      pages: clonedPages,
    });
    setGridCols(snap.gridCols);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots(snapshots.filter(s => s.id !== id));
  };

  const [modalFraming, setModalFraming] = useState("");
  const [modalVisualDescription, setModalVisualDescription] = useState("");
  const [modalDialogue, setModalDialogue] = useState("");
  const [modalNarration, setModalNarration] = useState("");
  const [modalSoundEffects, setModalSoundEffects] = useState("");
  const [modalEmotions, setModalEmotions] = useState("");
  const [modalCameraMovement, setModalCameraMovement] = useState("");
  const [modalTimeOfScene, setModalTimeOfScene] = useState("");
  const [modalArtistNotes, setModalArtistNotes] = useState("");

  const activePage = project.pages[selectedPageIdx] || project.pages[0];
  const expandedPanel = activePage?.panels.find((p) => p.id === expandedPanelId);

  useEffect(() => {
    if (expandedPanel) {
      setModalFraming(expandedPanel.framing || "");
      setModalVisualDescription(expandedPanel.visualDescription || "");
      setModalDialogue(expandedPanel.dialogue || "");
      setModalNarration(expandedPanel.narration || "");
      setModalSoundEffects(expandedPanel.soundEffects || "");
      setModalEmotions(expandedPanel.emotions || "");
      setModalCameraMovement(expandedPanel.cameraMovement || "");
      setModalTimeOfScene(expandedPanel.timeOfScene || "MEDIO");
      setModalArtistNotes(expandedPanel.artistNotes || "");
    }
  }, [expandedPanelId, expandedPanel]);

  const handleSaveModal = () => {
    if (!expandedPanelId) return;
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          panels: p.panels.map((pnl) => {
            if (pnl.id === expandedPanelId) {
              return {
                ...pnl,
                framing: modalFraming,
                visualDescription: modalVisualDescription,
                dialogue: modalDialogue,
                narration: modalNarration,
                soundEffects: modalSoundEffects,
                emotions: modalEmotions,
                cameraMovement: modalCameraMovement,
                timeOfScene: modalTimeOfScene,
                artistNotes: modalArtistNotes,
              };
            }
            return pnl;
          })
        };
      }
      return p;
    });
    onChange({ ...project, pages: updatedPages });
    setExpandedPanelId(null);
  };

  const handleMovePanel = (panelId: string, direction: "UP" | "DOWN") => {
    const panels = [...activePage.panels];
    const index = panels.findIndex((p) => p.id === panelId);
    if (index === -1) return;

    const targetIdx = direction === "UP" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= panels.length) return;

    // Swap panels
    const temp = panels[index];
    panels[index] = panels[targetIdx];
    panels[targetIdx] = temp;

    // Renumber panels
    const renumbered = panels.map((p, i) => ({ ...p, panelNumber: i + 1 }));

    const updatedPages = project.pages.map((p) => 
      p.id === activePage.id ? { ...p, panels: renumbered } : p
    );

    onChange({ ...project, pages: updatedPages });
  };

  const handleUpdatePanelWeight = (panelId: string, scale: string) => {
    const updatedPages = project.pages.map((p) => {
      if (p.id === activePage.id) {
        return {
          ...p,
          panels: p.panels.map((pnl) => {
            if (pnl.id === panelId) {
              // Store scale inside cameraMovement or comments colloquially
              return { ...pnl, timeOfScene: scale };
            }
            return pnl;
          })
        };
      }
      return p;
    });
    onChange({ ...project, pages: updatedPages });
  };

  const [draggingPanelId, setDraggingPanelId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, panelId: string) => {
    setDraggingPanelId(panelId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", panelId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPanelId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggingPanelId;
    if (!sourceId || sourceId === targetPanelId) return;

    const panels = [...activePage.panels];
    const sourceIdx = panels.findIndex((p) => p.id === sourceId);
    const targetIdx = panels.findIndex((p) => p.id === targetPanelId);

    if (sourceIdx === -1 || targetIdx === -1) return;

    // Swap elements in list
    const [draggedPanel] = panels.splice(sourceIdx, 1);
    panels.splice(targetIdx, 0, draggedPanel);

    // Renumber panels
    const renumbered = panels.map((p, i) => ({ ...p, panelNumber: i + 1 }));

    const updatedPages = project.pages.map((p) => 
      p.id === activePage.id ? { ...p, panels: renumbered } : p
    );

    onChange({ ...project, pages: updatedPages });
    setDraggingPanelId(null);
  };

  const handleDragEnd = () => {
    setDraggingPanelId(null);
  };

  const getWeightClass = (timeVal: string, cols: number) => {
    switch (cols) {
      case 2:
        switch (timeVal) {
          case "PEQUENO": return "col-span-1";
          case "MEDIO": return "col-span-1";
          case "GRANDE": return "col-span-2";
          case "SPLASH": return "col-span-2 h-[280px] bg-art-sidebar/20";
          default: return "col-span-1";
        }
      case 3:
        switch (timeVal) {
          case "PEQUENO": return "col-span-1";
          case "MEDIO": return "col-span-2";
          case "GRANDE": return "col-span-3";
          case "SPLASH": return "col-span-3 h-[280px] bg-art-sidebar/20";
          default: return "col-span-1";
        }
      case 4:
      default:
        switch (timeVal) {
          case "PEQUENO": return "col-span-1";
          case "MEDIO": return "col-span-2";
          case "GRANDE": return "col-span-3";
          case "SPLASH": return "col-span-4 h-[280px] bg-art-sidebar/20";
          default: return "col-span-2";
        }
    }
  };

  const getGridColsClass = (cols: number) => {
    switch (cols) {
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4:
      default:
        return "grid-cols-4";
    }
  };

  const startSimulation = () => {
    setSimPanelIdx(0);
    setIsPlayingSimulation(true);
  };

  const nextSimulationStep = () => {
    if (simPanelIdx < activePage.panels.length - 1) {
      setSimPanelIdx(simPanelIdx + 1);
    } else {
      setIsPlayingSimulation(false);
    }
  };

  return (
    <div id="storyboard-layout" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto space-y-6 text-xs shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 mb-2 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <Monitor className="h-5 w-5 text-art-charcoal" />
            Módulo de Layout & Sequenciamento
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Mapeie o ritmo visual rearranjando quadros, alterando impactos dos tamanhos de sarjeta e simulando o caminhar de leitura.
          </p>
        </div>

        {/* Selected Page dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest leading-none">Página Ativa:</label>
          <select
            id="select-storyboard-page"
            value={selectedPageIdx}
            onChange={(e) => setSelectedPageIdx(parseInt(e.target.value))}
            className="font-sans text-xs p-2 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal font-bold cursor-pointer"
          >
            {project.pages.map((p, idx) => (
              <option key={p.id} value={idx}>Página {p.pageNumber}</option>
            ))}
          </select>

          <button
            id="btn-start-reading-simulation"
            onClick={startSimulation}
            className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2 px-4 rounded transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5 shadow-3xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            Simulador de Leitura
          </button>
        </div>
      </div>

      {/* Main layout creator panels workspace */}
      {!isPlayingSimulation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-stone-550 uppercase tracking-widest font-bold mb-1 pl-1">
              <span>Layout Geométrico dos Painéis ({gridCols} colunas)</span>
              
              {/* Grid Column Selector */}
              <div className="flex items-center gap-2">
                <span className="text-stone-500">Configuração de Grid:</span>
                <div className="flex bg-art-sidebar p-0.5 rounded border border-art-border shadow-3xs overflow-hidden">
                  {[2, 3, 4].map((cols) => (
                    <button
                      id={`btn-grid-cols-${cols}`}
                      key={cols}
                      onClick={() => setGridCols(cols as 2 | 3 | 4)}
                      className={`px-2.5 py-1 text-[9px] font-sans font-bold transition-all cursor-pointer rounded-xs ${
                        gridCols === cols
                          ? "bg-art-charcoal text-art-bg"
                          : "text-stone-605 hover:text-art-charcoal"
                      }`}
                    >
                      {cols} Colunas
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated interactive grid of comic panels representation */}
            <div className={`bg-art-sidebar/10 border border-art-border p-6 rounded grid gap-4 min-h-[400px] ${getGridColsClass(gridCols)}`}>
              {activePage?.panels.map((p) => {
                const scaleVal = p.timeOfScene || "MEDIO";
                return (
                  <div
                    key={p.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, p.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, p.id)}
                    onDragEnd={handleDragEnd}
                    className={`bg-art-card border-2 rounded p-4 flex flex-col justify-between transition-all hover:border-art-charcoal group relative ${
                      draggingPanelId === p.id
                        ? "opacity-30 border-dashed border-art-charcoal bg-art-sidebar/20"
                        : "border-art-border/80"
                    } ${getWeightClass(scaleVal, gridCols)}`}
                  >
                    {/* Panel metadata and moving commands */}
                    <div className="flex justify-between items-center border-b border-art-border pb-2.5 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded bg-art-charcoal text-art-bg text-[9.5px] font-mono font-bold flex items-center justify-center">
                          Q{p.panelNumber}
                        </span>
                        
                        <span 
                          className="text-stone-400 hover:text-art-charcoal cursor-grab active:cursor-grabbing p-0.5 rounded flex items-center justify-center"
                          title="Arraste para reordenar este quadro"
                        >
                          <Move className="h-3 w-3" />
                        </span>

                        <button
                          id={`btn-expand-panel-${p.id}`}
                          onClick={() => setExpandedPanelId(p.id)}
                          className="text-stone-555 hover:text-art-charcoal p-1 rounded hover:bg-art-sidebar/45 transition-all cursor-pointer inline-flex items-center justify-center"
                          title="Expandir Quadro para Ajuste de Foco"
                        >
                          <Maximize className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Moving arrows */}
                      <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-all">
                        <button
                          id={`btn-move-up-${p.id}`}
                          onClick={() => handleMovePanel(p.id, "UP")}
                          disabled={p.panelNumber === 1}
                          className="text-stone-500 hover:text-art-charcoal p-1 rounded hover:bg-art-sidebar/45 disabled:opacity-30 transition-all cursor-pointer"
                          title="Recuar sequência"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id={`btn-move-down-${p.id}`}
                          onClick={() => handleMovePanel(p.id, "DOWN")}
                          disabled={p.panelNumber === activePage.panels.length}
                          className="text-stone-500 hover:text-art-charcoal p-1 rounded hover:bg-art-sidebar/45 disabled:opacity-30 transition-all cursor-pointer"
                          title="Avançar sequência"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Schematized view representing sketch - CLICKABLE to expand and edit */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <button
                        id={`panel-sketch-click-${p.id}`}
                        onClick={() => setExpandedPanelId(p.id)}
                        className="w-full text-left bg-art-sidebar/25 hover:bg-art-sidebar/40 border border-art-border rounded flex flex-col items-center justify-center p-3.5 relative overflow-hidden transition-all group/sketch cursor-zoom-in min-h-[92px]"
                        title="Clique para Expandir o Quadro"
                      >
                        <div className="absolute inset-0 border border-dashed border-art-border/45 m-1.5 rounded-sm"></div>
                        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover/sketch:opacity-100 transition-opacity bg-art-charcoal text-art-bg text-[7.5px] font-mono tracking-wider px-1 rounded uppercase font-bold">
                          Foco Máximo
                        </div>
                        <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-art-charcoal relative z-10 block mb-1">
                          {p.framing || "Plano Geral"}
                        </span>
                        <p className="text-[9.5px] text-stone-550 font-serif italic line-clamp-2 relative z-10 block max-w-full text-center leading-normal px-1">
                          {p.visualDescription}
                        </p>
                      </button>

                      {/* Scale selection picker */}
                      <div className="flex justify-between items-center border-t border-art-border pt-2.5">
                        <span className="text-[9.5px] font-mono font-bold text-stone-500 uppercase tracking-widest leading-none">Impacto:</span>
                        <div className="flex gap-1">
                          {["PEQUENO", "MEDIO", "GRANDE", "SPLASH"].map((scale) => (
                            <button
                              id={`btn-scale-${p.id}-${scale}`}
                              key={scale}
                              onClick={() => handleUpdatePanelWeight(p.id, scale)}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer border ${
                                scaleVal === scale
                                  ? "bg-art-charcoal text-art-bg border-art-charcoal"
                                  : "bg-art-sidebar text-stone-605 hover:text-art-charcoal hover:bg-stone-200 border-art-border"
                              }`}
                            >
                              {scale.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar controls & education */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Snapshot Manager */}
            <div className="bg-art-sidebar/20 border-2 border-art-border rounded p-5 space-y-4">
              <div className="flex justify-between items-center border-b border-art-border pb-2.5 px-0.5">
                <h3 className="font-serif font-bold text-xs uppercase text-art-charcoal flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-art-charcoal" />
                  Snapshots de Layout
                </h3>
                <span className="text-[9px] font-mono font-bold bg-art-charcoal text-art-bg px-1.5 py-0.5 rounded uppercase">
                  {snapshots.length} salvos
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-stone-605 italic font-serif">
                  Salve o estado atual do layout (ordem dos quadros, tamanhos e configurações do grid) para restaurar a qualquer momento nesta sessão.
                </p>

                {/* Take Snapshot control */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      id="input-snapshot-name"
                      type="text"
                      placeholder="Nome do snapshot (ex: Layout Alternativo)"
                      value={snapshotName}
                      onChange={(e) => setSnapshotName(e.target.value)}
                      className="flex-1 text-[11px] p-2 bg-white border border-art-border rounded focus:outline-none focus:border-art-charcoal font-sans"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTakeSnapshot();
                        }
                      }}
                    />
                    <button
                      id="btn-save-snapshot"
                      onClick={handleTakeSnapshot}
                      className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-[10px] uppercase tracking-wider px-3 py-2 rounded transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-3xs"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Salvar
                    </button>
                  </div>
                </div>

                {/* Snapshots List */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {snapshots.length === 0 ? (
                    <div className="text-center py-4 border border-dashed border-art-border rounded bg-white/50 text-stone-550 font-serif italic text-[10px]">
                      Nenhum snapshot salvo nesta sessão.
                    </div>
                  ) : (
                    snapshots.map((snap) => (
                      <div 
                        key={snap.id}
                        className="bg-white border border-art-border p-2.5 rounded shadow-3xs flex justify-between items-center gap-2 hover:border-art-charcoal transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-sans font-bold text-[11px] text-art-charcoal truncate">
                            {snap.label}
                          </p>
                          <p className="text-[9px] font-mono text-stone-500 mt-0.5">
                            Salvo às {snap.timestamp} • Grid: {snap.gridCols} Col
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            id={`btn-restore-snap-${snap.id}`}
                            onClick={() => handleRestoreSnapshot(snap)}
                            className="bg-art-sidebar hover:bg-stone-200 text-art-charcoal border border-art-border p-1.5 rounded transition-all cursor-pointer"
                            title="Restaurar este Layout"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                          <button
                            id={`btn-delete-snap-${snap.id}`}
                            onClick={() => handleDeleteSnapshot(snap.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/55 p-1.5 rounded transition-all cursor-pointer"
                            title="Excluir Snapshot"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Educational Sidebar on Pacing Layout (Will Eisner / Jack Kirby) */}
            <div className="bg-art-sidebar/10 border border-art-border rounded p-5 space-y-4 h-fit">
              <h3 className="font-serif font-bold text-xs uppercase text-art-charcoal border-b border-art-border pb-2.5 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-art-charcoal" />
                Princípios Espaciais de Layout
              </h3>

              <div className="space-y-4">
                <div className="bg-art-card p-3.5 border border-art-border rounded shadow-3xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-art-charcoal bg-art-sidebar px-2 py-0.5 rounded tracking-wide">
                    A Splash Page (Jack Kirby style)
                  </span>
                  <p className="text-[10px] text-stone-650 font-serif leading-relaxed mt-1.5">
                    Reserve o impacto 'SPLASH' completo para momentos de culminação ou glória física. Permitir que objetos extrapolem a sarjeta exterior projeta vigor indestrutível sobre o leitor.
                  </p>
                </div>

                <div className="bg-art-card p-3.5 border border-art-border rounded shadow-3xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-art-charcoal bg-art-sidebar px-2 py-0.5 rounded tracking-wide">
                    O Espaço Anota o Tempo
                  </span>
                  <p className="text-[10px] text-stone-650 font-serif leading-relaxed mt-1.5">
                    Painéis 'PEQUENOS' aceleram a leitura dramática (segundos de reação corporal). Próximo ao clímax dramático, use pequenos planos recorrentes seguidos de um arranjo Splash apoteótico.
                  </p>
                </div>

                <div className="bg-art-card p-3.5 border border-art-border rounded shadow-3xs space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-art-charcoal bg-art-sidebar px-2 py-0.5 rounded tracking-wide">
                    O Trilhamento Ocular (Will Eisner)
                  </span>
                  <p className="text-[10px] text-stone-650 font-serif leading-relaxed mt-1.5">
                    Estruture os balões de falas e as sarjetas de modo que o olhar rastro rascunhe de cima para baixo. Conduza silhuetas físicas apontando na direção da sarjeta seguinte para garantir fluidez orgânica.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Reading flow simulation mode active */
        <div className="bg-art-card text-art-charcoal border border-art-border shadow-2xl rounded p-8 max-w-3xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 z-10">
            <button
              id="btn-close-simulation"
              onClick={() => setIsPlayingSimulation(false)}
              className="text-art-charcoal hover:bg-art-sidebar font-sans font-bold uppercase text-[9px] bg-art-card py-2 px-3.5 border border-art-border rounded transition-all cursor-pointer shadow-3xs"
            >
              Fechar Simulador
            </button>
          </div>

          <div className="border-b border-art-border pb-4">
            <span className="text-[10px] font-mono text-stone-550 uppercase tracking-widest pl-1 font-bold">
              Fluxograma sequencial • Página {activePage?.pageNumber}
            </span>
            <h3 className="text-xl font-serif font-bold text-art-charcoal mt-1 uppercase tracking-wide">
              Simulador de Travessia Sequencial
            </h3>
          </div>

          {/* Active simulated panel board */}
          {activePage?.panels[simPanelIdx] && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Visual Description Wireframe of Sketch */}
                <div className="md:col-span-7 bg-art-sidebar/20 border border-art-border rounded p-8 min-h-[250px] flex flex-col justify-between relative overflow-hidden shadow-3xs">
                  <div className="absolute top-3 left-3 bg-art-charcoal text-art-bg text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                    Quadro {activePage.panels[simPanelIdx].panelNumber} de {activePage.panels.length}
                  </div>
                  <div className="absolute top-3 right-3 bg-stone-700 text-art-bg text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {activePage.panels[simPanelIdx].framing || "Plano médio"}
                  </div>

                  <div className="my-auto text-center py-6 px-4">
                    <p className="text-sm text-art-charcoal leading-relaxed font-serif font-medium italic">
                      "{activePage.panels[simPanelIdx].visualDescription}"
                    </p>
                  </div>

                  {/* Sound FX/Onomatopoeias indicator inside visual canvas */}
                  {activePage.panels[simPanelIdx].soundEffects && (
                    <div className="text-center py-2">
                      <span className="text-lg font-mono font-bold text-art-charcoal uppercase tracking-widest bg-art-sidebar border-2 border-art-charcoal px-4 py-1.5 rounded-lg animate-bounce block w-fit mx-auto shadow-sm">
                        💥 {activePage.panels[simPanelIdx].soundEffects}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-art-border/60 pt-3 text-[10px] font-mono text-stone-550 font-bold uppercase tracking-wide">
                    Câmera: {activePage.panels[simPanelIdx].cameraMovement || "Estática"} • Clima: {activePage.panels[simPanelIdx].timeOfScene || "Dia"}
                  </div>
                </div>

                {/* Narrative Details and Dialog Balloons */}
                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  {/* Narration box */}
                  {activePage.panels[simPanelIdx].narration && (
                    <div className="bg-art-sidebar/15 border-l-4 border-art-charcoal p-4 rounded-r shadow-3xs">
                      <span className="text-[9.5px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1">
                        Recordatório (Narração)
                      </span>
                      <p className="text-xs text-stone-700 leading-relaxed italic font-serif">
                        "{activePage.panels[simPanelIdx].narration}"
                      </p>
                    </div>
                  )}

                  {/* Dialogue balloon representation */}
                  {activePage.panels[simPanelIdx].dialogue ? (
                    <div className="bg-art-sidebar/30 border border-art-border p-5 rounded relative">
                      <div className="absolute bottom-[-10px] left-8 w-4 h-4 bg-art-sidebar border-r border-b border-art-border transform rotate-45"></div>
                      <span className="text-[9.5px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1.5">
                        Balão de Fala
                      </span>
                      <p className="text-xs text-stone-750 font-serif italic leading-relaxed whitespace-pre-line">
                        {activePage.panels[simPanelIdx].dialogue}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center p-4 border border-dashed border-art-border rounded text-stone-500 font-serif italic text-xs">
                      Quadro de silêncio dramático. Sem diálogos inscritos.
                    </div>
                  )}

                  {/* Scott McCloud transition educational helper */}
                  <div className="bg-art-sidebar/10 p-3.5 rounded border border-art-border space-y-1">
                    <span className="text-[10px] font-mono text-art-charcoal block font-bold uppercase tracking-wider">Transição Estimada:</span>
                    <p className="text-[11px] font-serif text-stone-650 italic">
                      {simPanelIdx === 0 
                        ? "Ponto inicial de transição sequencial." 
                        : `Transição Q${simPanelIdx} para Q${simPanelIdx + 1}: Ação-para-Ação. Mantém o foco no movimento corporal continuado, dando dinamismo.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-art-border flex justify-between items-center">
                <span className="text-xs font-mono text-stone-500 font-bold uppercase tracking-widest">
                  Quadro {simPanelIdx + 1} de {activePage.panels.length}
                </span>

                <button
                  id="btn-next-sim-step"
                  onClick={nextSimulationStep}
                  className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs uppercase tracking-widest py-2.5 px-6 rounded flex items-center gap-1 transition-all shadow-md cursor-pointer"
                >
                  {simPanelIdx < activePage.panels.length - 1 ? "Próximo Quadro" : "Concluir Simulação"}
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Absolute Focus Modal for absolute panel adjustments */}
      {expandedPanel && (
        <div 
          id="modal-panel-focus"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-fade-in"
        >
          <div className="bg-white border-2 border-art-charcoal max-w-3xl w-full rounded shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-art-sidebar p-4 border-b border-art-charcoal flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-art-bg bg-art-charcoal px-2 py-0.5 rounded">
                  Foco Absoluto
                </span>
                <h3 className="text-base font-serif font-bold text-art-charcoal mt-1 flex items-center gap-2">
                  Ajustando Quadro {expandedPanel.panelNumber} • Página {activePage.pageNumber}
                </h3>
              </div>
              <button
                id="btn-close-modal-x"
                onClick={() => setExpandedPanelId(null)}
                className="text-stone-500 hover:text-art-charcoal p-1.5 rounded-full hover:bg-stone-200 transition-all cursor-pointer"
                title="Fechar"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs max-h-[calc(90vh-120px)] scrollbar-thin">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Visual metadata properties column */}
                <div className="md:col-span-12 lg:col-span-5 space-y-4">
                  <div className="p-3 bg-art-sidebar/20 rounded border border-art-border space-y-3.5">
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-550 border-b border-art-border pb-1 mb-2">
                      Ficha de Configurações Visuais
                    </h4>

                    {/* Framing field control */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        Enquadramento / Plano:
                      </label>
                      <select
                        id="modal-field-framing"
                        value={modalFraming}
                        onChange={(e) => setModalFraming(e.target.value)}
                        className="w-full p-2 bg-white border border-art-border rounded focus:outline-none focus:border-art-charcoal font-sans text-xs text-stone-850 font-bold cursor-pointer"
                      >
                        <option value="Plano Geral">Plano Geral (Grande angular / paisagem)</option>
                        <option value="Plano Inteiro">Plano Inteiro (Corpo inteiro no cenário)</option>
                        <option value="Plano Médio">Plano Médio (Da cintura para cima)</option>
                        <option value="Plano Americano">Plano Americano (Dos joelhos para cima)</option>
                        <option value="Primeiro Plano / Close-up">Primeiro Plano / Close-up (Expressão facial)</option>
                        <option value="Plano Detalhe">Plano Detalhe (Zoom em objeto/detalhe crucial)</option>
                        <option value="Splash Page">Splash Page (Quadro único monumental)</option>
                      </select>
                    </div>

                    {/* Impact weight of scene inside layout */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        Impacto Visual de Tamanho:
                      </label>
                      <div className="grid grid-cols-4 gap-1">
                        {["PEQUENO", "MEDIO", "GRANDE", "SPLASH"].map((scale) => (
                          <button
                            id={`btn-modal-scale-${scale}`}
                            key={scale}
                            onClick={() => setModalTimeOfScene(scale)}
                            className={`text-[9px] font-bold py-1.5 rounded transition-all cursor-pointer border ${
                              modalTimeOfScene === scale
                                ? "bg-art-charcoal text-art-bg border-art-charcoal"
                                : "bg-white text-stone-605 hover:text-art-charcoal border-art-border"
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Camera behavior tag */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        Movimento ou Ângulo:
                      </label>
                      <input
                        id="modal-field-camera"
                        type="text"
                        value={modalCameraMovement}
                        onChange={(e) => setModalCameraMovement(e.target.value)}
                        className="w-full p-2 bg-white border border-art-border rounded focus:outline-none focus:border-art-charcoal font-sans text-xs"
                        placeholder="Ex: Contra-plongée, Estática, Panorâmica"
                      />
                    </div>

                    {/* Emotional framing feel */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        Clima Emocional / Expressões:
                      </label>
                      <input
                        id="modal-field-emotions"
                        type="text"
                        value={modalEmotions}
                        onChange={(e) => setModalEmotions(e.target.value)}
                        className="w-full p-2 bg-white border border-art-border rounded focus:outline-none focus:border-art-charcoal font-sans text-xs"
                        placeholder="Ex: Tensão latente, Melancolia, Desespero"
                      />
                    </div>

                  </div>
                </div>

                {/* Script dialog content properties column */}
                <div className="md:col-span-12 lg:col-span-7 space-y-4">
                  <div className="space-y-4">

                    {/* Action description text label */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-art-charcoal uppercase tracking-wider font-bold flex items-center gap-1">
                        <span>Descrição da Ação / Cenografia:</span>
                      </label>
                      <textarea
                        id="modal-field-description"
                        rows={3}
                        value={modalVisualDescription}
                        onChange={(e) => setModalVisualDescription(e.target.value)}
                        className="w-full p-2.5 bg-art-sidebar/10 border border-art-border rounded focus:outline-none focus:border-art-charcoal font-serif text-xs leading-relaxed"
                        placeholder="O que o artista precisará desenhar neste painel..."
                      />
                    </div>

                    {/* Dialogue Balloon control */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-art-charcoal uppercase tracking-wider font-bold block">
                        Balões de Fala (Diálogos):
                      </label>
                      <textarea
                        id="modal-field-dialogue"
                        rows={2}
                        value={modalDialogue}
                        onChange={(e) => setModalDialogue(e.target.value)}
                        className="w-full p-2.5 bg-art-sidebar/10 border border-art-border rounded focus:outline-none focus:border-art-charcoal font-serif text-xs leading-relaxed italic text-stone-850"
                        placeholder="Ex: PERSONAGEM: 'Aonde você vai?'"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Narration recordatórios field */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-mono text-stone-550 uppercase tracking-wider font-bold block">
                          Recordatório / Narração:
                        </label>
                        <textarea
                          id="modal-field-narration"
                          rows={2}
                          value={modalNarration}
                          onChange={(e) => setModalNarration(e.target.value)}
                          className="w-full p-2 bg-art-sidebar/10 border border-art-border rounded focus:outline-none focus:border-art-charcoal font-serif text-[11px] leading-relaxed"
                          placeholder="Narração externa em caixa..."
                        />
                      </div>

                      {/* Sound effects onomatopoeia inputs */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-mono text-stone-550 uppercase tracking-wider font-bold block">
                          Efeitos de Som / Onomatopeias:
                        </label>
                        <textarea
                          id="modal-field-sfx"
                          rows={2}
                          value={modalSoundEffects}
                          onChange={(e) => setModalSoundEffects(e.target.value)}
                          className="w-full p-2 bg-art-sidebar/10 border border-art-border rounded focus:outline-none focus:border-art-charcoal font-mono text-[11px] font-bold text-red-700"
                          placeholder="Ex: POW!, CRASH!"
                        />
                      </div>
                    </div>

                    {/* Notes for illustrator */}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase tracking-wider font-bold block">
                        Análise de Direção do Roteirista / Notas ao Desenhista:
                      </label>
                      <textarea
                        id="modal-field-notes"
                        rows={2}
                        value={modalArtistNotes}
                        onChange={(e) => setModalArtistNotes(e.target.value)}
                        className="w-full p-2 bg-art-sidebar/10 border border-art-border rounded focus:outline-none focus:border-art-charcoal font-sans text-[11px] leading-relaxed"
                        placeholder="Recomendações de diagramação espacial, sarjeta ou composição emocional..."
                      />
                    </div>

                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer actions block wrapper */}
            <div className="bg-art-sidebar p-4 border-t border-art-border flex justify-end gap-3">
              <button
                id="btn-cancel-modal"
                onClick={() => setExpandedPanelId(null)}
                className="px-4 py-2 text-stone-605 border border-art-border hover:bg-stone-100 rounded font-sans font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer"
              >
                Voltar à Página
              </button>
              <button
                id="btn-save-modal"
                onClick={handleSaveModal}
                className="px-5 py-2 bg-art-charcoal text-art-bg hover:bg-stone-850 rounded font-sans font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer shadow-xs"
              >
                Confirmar Alterações
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
