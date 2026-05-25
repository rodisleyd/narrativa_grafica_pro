import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { BarChart2, Sparkles, Shield, AlertTriangle, Eye, Activity, Award, CheckCircle } from "lucide-react";

interface NarrativeAnalyzerProps {
  project: Project;
}

interface AIAnalysisResult {
  dramaticStructure: string;
  pacingScore: number;
  pacingFeedback: string;
  textDensity: "Baixa" | "Média" | "Alta";
  textDensityFeedback: string;
  balanceRatio: string;
  visualClarity: string;
  emotionalCurve: number[];
  recommendations: string[];
}

export default function NarrativeAnalyzer({ project }: NarrativeAnalyzerProps) {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Raw Client-Side Statistics Calculation
  const [stats, setStats] = useState({
    totalPages: 0,
    totalPanels: 0,
    panelsWithDialogue: 0,
    dialogueRatio: 50, // % of panels with dialogue
    actionRatio: 50,   // % of panels with action/silent
    wordCount: 0,
    averagePanelsPerPage: 0,
    textDensityLabel: "Média"
  });

  useEffect(() => {
    let pagesCount = project.pages.length;
    let panelsCount = 0;
    let panelsDialogueCount = 0;
    let words = 0;

    project.pages.forEach((p) => {
      panelsCount += p.panels.length;
      p.panels.forEach((pnl) => {
        if (pnl.dialogue && pnl.dialogue.trim().length > 0) {
          panelsDialogueCount++;
          words += pnl.dialogue.split(/\s+/).length;
        }
        if (pnl.narration && pnl.narration.trim().length > 0) {
          words += pnl.narration.split(/\s+/).length;
        }
      });
    });

    const dialoguePct = panelsCount > 0 ? Math.round((panelsDialogueCount / panelsCount) * 100) : 0;
    const actionPct = 100 - dialoguePct;

    let dens = "Baixa";
    if (words > 200) dens = "Média";
    if (words > 500) dens = "Alta";

    setStats({
      totalPages: pagesCount,
      totalPanels: panelsCount,
      panelsWithDialogue: panelsDialogueCount,
      dialogueRatio: dialoguePct,
      actionRatio: actionPct,
      wordCount: words,
      averagePanelsPerPage: pagesCount > 0 ? parseFloat((panelsCount / pagesCount).toFixed(1)) : 0,
      textDensityLabel: dens
    });
  }, [project]);

  const handleFetchAiReview = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Build package for analysis
      const scriptData = {
        format: project.settings.format,
        genre: project.settings.genre,
        premise: project.settings.premise,
        style: project.settings.style,
        pages: project.pages.map((p) => ({
          pageNumber: p.pageNumber,
          rhythmNotes: p.rhythmNotes,
          panels: p.panels.map((pnl) => ({
            panelNumber: pnl.panelNumber,
            framing: pnl.framing,
            visualDescription: pnl.visualDescription,
            dialogue: pnl.dialogue,
            soundEffects: pnl.soundEffects
          }))
        }))
      };

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scriptData })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else {
        setErrorMsg(data.error || "Erro ao receber análise. Configure sua chave API no Studio para habilitar.");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg("Falha na conexão com o servidor de inteligência narrativa.");
    } finally {
      setLoading(false);
    }
  };

  // Generate responsive points for our tension curve SVG chart display
  const draftCurve = analysisResult?.emotionalCurve && analysisResult.emotionalCurve.length > 0
    ? analysisResult.emotionalCurve
    : [3, 5, -2, 7, 8, -4, 9]; // fallback curve values representing page tension progression

  const getSvgCoordinates = (values: number[]) => {
    const width = 600;
    const height = 150;
    const step = width / (values.length - 1 || 1);
    
    // Scale value (-10 to 10) to fits within 0 - 150 range nicely
    return values.map((val, i) => {
      const x = i * step;
      // center point is y=75. -10 is top (y=15), 10 is bottom (y=135). Scale factor 6
      const y = 75 - (val * 6);
      return `${x},${y}`;
    }).join(" ");
  };

  return (
    <div id="narrative-analyzer" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto space-y-6 text-xs shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 mb-2 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-art-charcoal" />
            Módulo de Análise de Pacing e Ritmo
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Avalie proporções de ação e balões, densidade textual acumulada e a curva de tensão sugerida por página.
          </p>
        </div>

        <button
          id="btn-fetch-ai-script-analysis"
          disabled={loading}
          onClick={handleFetchAiReview}
          className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2.5 px-5 rounded flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer uppercase tracking-wider shadow-3xs"
        >
          <Sparkles className="h-4 w-4 text-stone-300 animate-pulse" />
          {loading ? "Revisando Métricas..." : "Fazer Varredura por IA"}
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-art-sidebar/20 text-art-charcoal text-xs rounded border border-art-border flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quantitative Stats Row (Calculated fully on client side) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-art-sidebar/10 border border-art-border p-4.5 rounded space-y-1 shadow-3xs">
          <span className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1">Mapeamento Págs</span>
          <p className="text-2xl font-serif font-bold text-art-charcoal">{stats.totalPages}</p>
          <p className="text-[11px] text-stone-500 leading-tight font-serif italic">Média de {stats.averagePanelsPerPage} quadros por página.</p>
        </div>

        <div className="bg-art-sidebar/10 border border-art-border p-4.5 rounded space-y-1 shadow-3xs">
          <span className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1">Total Quadros</span>
          <p className="text-2xl font-serif font-bold text-art-charcoal">{stats.totalPanels}</p>
          <p className="text-[11px] text-stone-500 leading-tight font-serif italic">{stats.panelsWithDialogue} quadros contêm falas.</p>
        </div>

        <div className="bg-art-sidebar/10 border border-art-border p-4.5 rounded space-y-1 shadow-3xs">
          <span className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1">Ação vs Diálogos</span>
          <div className="flex justify-between text-[11px] font-bold text-stone-700 mt-1.5 font-mono">
            <span>Mímica: {stats.actionRatio}%</span>
            <span>Estática: {stats.dialogueRatio}%</span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-art-sidebar rounded overflow-hidden mt-1.5 border border-art-border">
            <div className="h-full bg-art-charcoal rounded" style={{ width: `${stats.dialogueRatio}%` }}></div>
          </div>
          <p className="text-[10px] text-stone-500 leading-tight mt-1 bg-art-card p-1 text-[9px] rounded font-serif italic border border-art-border/50">Recomenda-se: 45%-65% de ação pura.</p>
        </div>

        <div className="bg-art-sidebar/10 border border-art-border p-4.5 rounded space-y-1 shadow-3xs">
          <span className="text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-1">Densidade Símbolo</span>
          <p className="text-2xl font-serif font-bold text-art-charcoal">{stats.textDensityLabel}</p>
          <p className="text-[11px] text-stone-500 leading-tight font-serif italic">Cerca de {stats.wordCount} palavras totais.</p>
        </div>
      </div>

      {/* Tension Curve visualization and IA Analysis details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tension curve SVG widget */}
        <div className="lg:col-span-6 bg-art-sidebar/5 border border-art-border rounded p-5 space-y-4 shadow-3xs">
          <div className="flex justify-between items-center pb-2 border-b border-art-border">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wide text-art-charcoal flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-art-charcoal" />
              Gráfico de Intensidade Dramática (Tensão)
            </h3>
            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold">Por Página</span>
          </div>

          <div className="bg-stone-900 border border-art-charcoal p-4 rounded flex flex-col justify-end min-h-[170px] relative overflow-hidden shadow-sm">
            <svg width="100%" height="150" viewBox="0 0 600 150" className="overflow-visible">
              {/* Grid guide line */}
              <line x1="0" y1="75" x2="600" y2="75" stroke="#374151" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="5" y="70" fill="#9ca3af" className="text-[9px] font-mono uppercase tracking-wider font-bold">Linha Neutra McCloud</text>

              {/* Curve path representation */}
              <polyline
                fill="none"
                stroke="#e5e5e7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={getSvgCoordinates(draftCurve)}
                className="animate-fade-in"
              />

              {/* Nodes dots on points */}
              {draftCurve.map((val, idx) => {
                const width = 600;
                const step = width / (draftCurve.length - 1 || 1);
                const x = idx * step;
                const y = 75 - (val * 6);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#111"
                    stroke="#fff"
                    strokeWidth="2.5"
                    title={`Pág ${idx+1}: Intensidade ${val}`}
                  />
                );
              })}
            </svg>
            <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-2 lowercase font-bold tracking-wide">
              <span>introdução / respiro</span>
              <span>confronto intermediário</span>
              <span>clímax / ápice físico</span>
            </div>
          </div>

          <p className="text-[10px] text-stone-650 leading-relaxed bg-art-card border border-art-border p-3 rounded shadow-3xs font-serif italic">
            <strong>Como avaliar:</strong> Picos representam embates mecânicos, ação pesada, ou clímax espirituais decisivos. Vales mapeiam pausas, respiração ocular do leitor, paisagens contemplativas ou contextualização analógica. Equilibre para preservar a atenção de quem fita o papel.
          </p>
        </div>

        {/* Detailed AI Report Showcase */}
        <div className="lg:col-span-6 bg-art-sidebar/10 border border-art-border rounded p-5 flex flex-col justify-between shadow-3xs">
          {analysisResult ? (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
              <div className="border-b border-art-border pb-2">
                <h3 className="text-sm font-serif font-bold text-art-charcoal uppercase tracking-wide">Relatório Analítico Consolidado</h3>
                <p className="text-[10px] text-stone-500 font-mono mt-0.5 uppercase tracking-wider font-bold">Índice Geral de Performance: {analysisResult.pacingScore} / 100</p>
              </div>

              <div className="space-y-3">
                <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
                  <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider mb-1">Morfologia de Enredo</h4>
                  <p className="text-xs text-stone-655 leading-relaxed font-serif italic">{analysisResult.dramaticStructure}</p>
                </div>

                <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
                  <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider mb-1">Dinâmica de Pacing</h4>
                  <p className="text-xs text-stone-655 leading-relaxed font-serif italic">{analysisResult.pacingFeedback}</p>
                </div>

                <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
                  <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider mb-1">Nitidez das sarjetas (Espaço)</h4>
                  <p className="text-xs text-stone-655 leading-relaxed font-serif italic">{analysisResult.visualClarity}</p>
                </div>

                <div className="bg-art-sidebar/20 p-4 border border-art-border rounded space-y-2">
                  <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-4 w-4 text-art-charcoal flex-shrink-0" />
                    Regras de Curation para Escritores
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5 font-serif">
                        <CheckCircle className="h-4 w-4 text-art-charcoal shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 p-8 text-center my-auto min-h-[300px]">
              <Sparkles className="h-10 w-10 text-art-charcoal animate-pulse mb-2" />
              <p className="text-sm font-serif font-bold text-art-charcoal uppercase tracking-wide">Crítico Didático Inteligente</p>
              <p className="text-xs text-stone-505 mt-1 max-w-sm font-serif">
                Envie suas descrições de imagens, falas e pacing para obter notas em tempo real sobre transições de quadrinhos e harmonia de narrativa sequencial.
              </p>
              {loading && (
                <div className="mt-4 p-2 bg-art-charcoal text-art-bg rounded text-[10px] uppercase font-mono font-bold tracking-widest animate-pulse border border-art-border">
                  Compilando Dados Literários...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
