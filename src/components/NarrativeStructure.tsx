import React, { useState, useEffect } from "react";
import { NarrativeStructureMethod, GuidedStructure, Project, ScriptPage, Panel } from "../types";
import { BookOpen, Sparkles, AlertCircle, Award, CheckCircle, ChevronRight, HelpCircle, RefreshCw, Trash2, Plus, ArrowDown, ArrowUp, Wand2 } from "lucide-react";

interface NarrativeStructureProps {
  project: Project;
  onChange: (updatedProject: Project) => void;
  onTriggerAi?: (action: string, payload: any) => Promise<string>;
  onTriggerToast?: (msg: string) => void;
  method: NarrativeStructureMethod;
  guidedStructure: GuidedStructure;
  structureAnswers: Record<string, string>;
  onMethodChange: (met: NarrativeStructureMethod) => void;
  onGuidedChange: (guided: GuidedStructure) => void;
  onAnswersChange: (ans: Record<string, string>) => void;
}

interface LocalPageBeat {
  pageNumber: number;
  beatName: string;
  intensity: "Baixa" | "Média" | "Alta" | "Clímax";
  description: string;
}

export default function NarrativeStructure({
  project,
  onChange,
  onTriggerAi,
  onTriggerToast,
  method,
  guidedStructure,
  structureAnswers,
  onMethodChange,
  onGuidedChange,
  onAnswersChange
}: NarrativeStructureProps) {
  const [activePane, setActivePane] = useState<"QUESTIONS" | "METHODS" | "PLOTTER">("QUESTIONS");

  // Estados do Decupador de Páginas
  const [plotterPages, setPlotterPages] = useState<LocalPageBeat[]>([]);
  const [argumentText, setArgumentText] = useState(project?.settings?.premise || "");
  const [plotterTotalPages, setPlotterTotalPages] = useState(project?.settings?.totalPages || 12);
  const [plotterMethod, setPlotterMethod] = useState<NarrativeStructureMethod>(method);
  const [aiLoading, setAiLoading] = useState(false);
  const [argumentAiLoading, setArgumentAiLoading] = useState(false);

  const handleImproveArgument = async () => {
    if (!onTriggerAi || !argumentText.trim()) return;
    setArgumentAiLoading(true);
    try {
      const prompt = `Você é um assistente de roteiro de quadrinhos. Melhore o argumento (sinopse/enredo corrido em prosa) abaixo de forma que a narrativa fique fluida, literária, interessante e de fácil visualização em quadros de HQs.
REGRAS CRÍTICAS:
1. TEMPO PRESENTE DO INDICATIVO (OBRIGATÓRIO): Descreva toda a ação no tempo presente (ex: "Um detetive particular caminha sob a chuva..." em vez de "caminhava").
2. TEXTO EM PROSA LITERÁRIA: Escreva o argumento como um texto contínuo em prosa (um ou dois parágrafos corridos), sem listas, sem bullet points, sem diálogos diretos estruturados e sem divisões de páginas/quadros. Mantenha o formato de prosa clássica.
3. CONCISÃO E IMPACTO: Elimine clichês fracos, adicione mais tensionamento visual e foque na progressão da premissa.

Argumento original:
"${argumentText}"`;

      const responseText = await onTriggerAi("custom", { prompt });
      if (responseText && responseText.trim()) {
        setArgumentText(responseText.trim());
        if (onTriggerToast) {
          onTriggerToast("Argumento aprimorado com IA!");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao consultar a IA para aprimorar o argumento.");
    } finally {
      setArgumentAiLoading(false);
    }
  };

  // Sincronizar dados ao carregar outro projeto
  useEffect(() => {
    if (project) {
      setArgumentText(project.settings.premise || "");
      setPlotterTotalPages(project.settings.totalPages || 12);
      setPlotterMethod(project.structureMethod || "THREE_ACTS");
      // Se o projeto já tem páginas cadastradas, podemos tentar inicializar o plotter com elas
      if (project.pages && project.pages.length > 0) {
        const loaded: LocalPageBeat[] = project.pages.map(p => {
          let beatName = "Batida";
          let intensity: "Baixa" | "Média" | "Alta" | "Clímax" = "Média";
          let description = p.rhythmNotes || "";

          // Tentar decodificar [Intensidade: X] e [Batida]
          const intMatch = description.match(/^\[Intensidade:\s*(BAIXA|MÉDIA|ALTA|CLÍMAX)\]/i);
          if (intMatch) {
            intensity = intMatch[1].toUpperCase() as any;
            description = description.replace(intMatch[0], "").trim();
          }

          const beatMatch = description.match(/^\[(.*?)\]/);
          if (beatMatch) {
            beatName = beatMatch[1];
            description = description.replace(beatMatch[0], "").trim();
          }

          return {
            pageNumber: p.pageNumber,
            beatName,
            intensity,
            description: description || "Descrição de cena a ser detalhada."
          };
        });
        setPlotterPages(loaded);
      } else {
        setPlotterPages([]);
      }
    }
  }, [project?.id]);

  // Métodos do Decupador
  const generateLocalDecupage = () => {
    const sentences = argumentText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 5);

    const pagesCount = plotterTotalPages;
    const result: LocalPageBeat[] = [];

    let beats: { name: string; defaultDesc: string; relativePosition: number; intensity: "Baixa" | "Média" | "Alta" | "Clímax" }[] = [];

    if (plotterMethod === "THREE_ACTS") {
      beats = [
        { name: "Ato I: Introdução & Status Quo", defaultDesc: "Apresentação dos personagens principais e do ambiente.", relativePosition: 0.15, intensity: "Baixa" },
        { name: "Ato I: Incidente Incitador", defaultDesc: "Ocorre o evento inicial que desequilibra o status quo.", relativePosition: 0.28, intensity: "Média" },
        { name: "Ato II: Entrada no Conflito", defaultDesc: "O protagonista aceita o desafio e entra no conflito.", relativePosition: 0.42, intensity: "Média" },
        { name: "Ato II: Ponto Médio (Ascensão)", defaultDesc: "As complicações aumentam, dobrando os riscos da jornada.", relativePosition: 0.60, intensity: "Alta" },
        { name: "Ato II: Crise / Fundo do Poço", defaultDesc: "O momento mais difícil antes da virada decisiva.", relativePosition: 0.78, intensity: "Média" },
        { name: "Ato III: Clímax Dramático", defaultDesc: "O embate final e ápice dramático onde tudo se resolve.", relativePosition: 0.92, intensity: "Clímax" },
        { name: "Ato III: Resolução", defaultDesc: "O novo equilíbrio se estabelece após os acontecimentos.", relativePosition: 1.0, intensity: "Baixa" }
      ];
    } else if (plotterMethod === "SAVE_THE_CAT") {
      beats = [
        { name: "Opening Image (Planta)", defaultDesc: "A primeira impressão visual do mundo inicial.", relativePosition: 0.1, intensity: "Baixa" },
        { name: "Theme Stated (Tema)", defaultDesc: "O tema central da história é sugerido.", relativePosition: 0.2, intensity: "Baixa" },
        { name: "Catalyst (Incitador)", defaultDesc: "O evento que desestabiliza a vida do herói.", relativePosition: 0.3, intensity: "Média" },
        { name: "Debate (Hesitação)", defaultDesc: "Dúvidas e medos sobre embarcar na jornada.", relativePosition: 0.4, intensity: "Baixa" },
        { name: "Break into Two", defaultDesc: "Decisão de entrar no novo mundo e iniciar a jornada.", relativePosition: 0.5, intensity: "Média" },
        { name: "Midpoint (Giro Central)", defaultDesc: "Grande revelação ou falsa vitória que muda os rumos.", relativePosition: 0.65, intensity: "Alta" },
        { name: "All is Lost (Fundo do Poço)", defaultDesc: "O fracasso máximo onde tudo parece perdido.", relativePosition: 0.8, intensity: "Alta" },
        { name: "Finale (O Clímax)", defaultDesc: "O herói une forças e executa o plano final resolvendo o conflito.", relativePosition: 0.95, intensity: "Clímax" },
        { name: "Final Image (Imagem Final)", defaultDesc: "A imagem final mostrando a transformação sofrida.", relativePosition: 1.0, intensity: "Baixa" }
      ];
    } else if (plotterMethod === "HEROS_JOURNEY") {
      beats = [
        { name: "1. Mundo Comum", defaultDesc: "Introdução ao cotidiano comum do protagonista.", relativePosition: 0.08, intensity: "Baixa" },
        { name: "2. Chamado à Aventura", defaultDesc: "Um convite ou problem surge.", relativePosition: 0.16, intensity: "Média" },
        { name: "3. Recusa do Chamado", defaultDesc: "Hesitação ou negação de seguir em frente.", relativePosition: 0.24, intensity: "Baixa" },
        { name: "4. Encontro com o Mentor", defaultDesc: "Conselhos ou ajuda de alguém experiente.", relativePosition: 0.32, intensity: "Baixa" },
        { name: "5. Travessia do Primeiro Limiar", defaultDesc: "Entrada definitiva no mundo extraordinário.", relativePosition: 0.40, intensity: "Média" },
        { name: "6. Testes, Aliados e Inimigos", defaultDesc: "Desafios iniciais e novos relacionamentos.", relativePosition: 0.52, intensity: "Média" },
        { name: "7. Caverna Oculta", defaultDesc: "Preparação para o desafio central.", relativePosition: 0.64, intensity: "Média" },
        { name: "8. Provação Suprema", defaultDesc: "O confronto central de vida ou morte.", relativePosition: 0.74, intensity: "Alta" },
        { name: "9. Recompensa", defaultDesc: "O tesouro ou elixir conquistado.", relativePosition: 0.82, intensity: "Alta" },
        { name: "10. Caminho de Volta", defaultDesc: "Retorno enfrentando perigos residuais.", relativePosition: 0.90, intensity: "Média" },
        { name: "11. Ressurreição", defaultDesc: "O clímax final de teste de transformação extrema.", relativePosition: 0.96, intensity: "Clímax" },
        { name: "12. Retorno com Elixir", defaultDesc: "Retorno ao lar transformado.", relativePosition: 1.0, intensity: "Baixa" }
      ];
    } else if (plotterMethod === "JOHN_TRUBY") {
      beats = [
        { name: "1. Fraqueza e Fome", defaultDesc: "A falha de caráter ou necessidade interna do protagonista.", relativePosition: 0.15, intensity: "Baixa" },
        { name: "2. Desejo", defaultDesc: "O objetivo concreto que mobiliza a ação.", relativePosition: 0.3, intensity: "Média" },
        { name: "3. Oponente", defaultDesc: "Apresentação de quem disputa o mesmo prêmio.", relativePosition: 0.45, intensity: "Média" },
        { name: "4. Plano", defaultDesc: "As estratégias criadas pelo herói.", relativePosition: 0.6, intensity: "Baixa" },
        { name: "5. Batalha", defaultDesc: "O grande choque de forças entre herói e oponente.", relativePosition: 0.75, intensity: "Alta" },
        { name: "6. Autorrevelação Moral", defaultDesc: "O protagonista percebe seu erro e cresce moralmente.", relativePosition: 0.9, intensity: "Clímax" },
        { name: "7. Novo Equilíbrio", defaultDesc: "Restauração da paz interna e externa.", relativePosition: 1.0, intensity: "Baixa" }
      ];
    } else if (plotterMethod === "EPISODIC") {
      beats = [
        { name: "1. Status Quo", defaultDesc: "Situação inicial deste episódio.", relativePosition: 0.2, intensity: "Baixa" },
        { name: "2. Incidente Incitador", defaultDesc: "Um fator inesperado quebra a calmaria.", relativePosition: 0.4, intensity: "Média" },
        { name: "3. Complicações", defaultDesc: "Obstáculos e ações físicas crescentes.", relativePosition: 0.6, intensity: "Alta" },
        { name: "4. Clímax", defaultDesc: "Ponto de maior tensionamento dramático do capítulo.", relativePosition: 0.85, intensity: "Clímax" },
        { name: "5. Gancho / Resolução", defaultDesc: "Resolução provisória e gancho para o próximo capítulo.", relativePosition: 1.0, intensity: "Baixa" }
      ];
    } else {
      // STRIP_STRUCTURE (Tirinhas)
      if (pagesCount === 1) {
        beats = [
          { name: "Quadro Único: Gag / Piada Rápida", defaultDesc: "Premissa e punchline imediata.", relativePosition: 1.0, intensity: "Clímax" }
        ];
      } else if (pagesCount === 2) {
        beats = [
          { name: "Quadro 1: Situação Inicial / Premissa", defaultDesc: "Apresenta os personagens e prepara o gancho.", relativePosition: 0.5, intensity: "Baixa" },
          { name: "Quadro 2: Punchline / Desfecho", defaultDesc: "A quebra de expectativa ou piada final.", relativePosition: 1.0, intensity: "Clímax" }
        ];
      } else if (pagesCount === 3) {
        beats = [
          { name: "Quadro 1: Situação Inicial / Premissa", defaultDesc: "Apresenta o contexto comum e os personagens da tira.", relativePosition: 0.33, intensity: "Baixa" },
          { name: "Quadro 2: Complicação / Preparação", defaultDesc: "Introduz a quebra de expectativa ou ação rápida.", relativePosition: 0.66, intensity: "Média" },
          { name: "Quadro 3: Punchline / Resolução", defaultDesc: "A revelação cômica ou irônica final.", relativePosition: 1.0, intensity: "Clímax" }
        ];
      } else {
        beats = [];
        for (let i = 1; i <= pagesCount; i++) {
          const rel = i / pagesCount;
          if (i === 1) {
            beats.push({ name: "Quadro 1: Premissa Inicial", defaultDesc: "Configuração do cenário e introdução da piada.", relativePosition: rel, intensity: "Baixa" });
          } else if (i === pagesCount) {
            beats.push({ name: `Quadro ${i}: Punchline / Resolução`, defaultDesc: "Desfecho engraçado ou reviravolta expressiva.", relativePosition: rel, intensity: "Clímax" });
          } else if (i === pagesCount - 1) {
            beats.push({ name: `Quadro ${i}: Complicação / Ápice`, defaultDesc: "O momento que gera suspense para a piada.", relativePosition: rel, intensity: "Alta" });
          } else {
            beats.push({ name: `Quadro ${i}: Desenvolvimento`, defaultDesc: "Diálogo secundário ou progressão física dos personagens.", relativePosition: rel, intensity: "Média" });
          }
        }
      }
    }

    for (let pNum = 1; pNum <= pagesCount; pNum++) {
      const fraction = pNum / pagesCount;
      const beat = beats.find(b => b.relativePosition >= fraction) || beats[beats.length - 1];
      
      let customText = "";
      if (sentences.length > 0) {
        const sentenceIdx = Math.min(
          Math.floor((pNum - 1) / pagesCount * sentences.length),
          sentences.length - 1
        );
        
        // Calcula o índice do bloco da página anterior.
        // A frase do argumento só é incluída no início de cada novo bloco (quando o índice muda).
        const prevSentenceIdx = pNum > 1
          ? Math.min(Math.floor((pNum - 2) / pagesCount * sentences.length), sentences.length - 1)
          : -1;
          
        if (sentenceIdx !== prevSentenceIdx || sentences.length >= pagesCount) {
          customText = sentences[sentenceIdx];
        }
      }

      const description = customText 
        ? `${customText}. ${beat.defaultDesc}`
        : beat.defaultDesc;

      result.push({
        pageNumber: pNum,
        beatName: beat.name,
        intensity: beat.intensity,
        description
      });
    }

    setPlotterPages(result);
    if (onTriggerToast) {
      const unitLabel = plotterMethod === "STRIP_STRUCTURE" ? "quadros" : "páginas";
      onTriggerToast(`Decupagem de ${pagesCount} ${unitLabel} gerada com a fórmula rápida!`);
    }
  };

  const generateAiDecupage = async () => {
    if (!onTriggerAi) return;
    setAiLoading(true);
    try {
      const isStrip = plotterMethod === "STRIP_STRUCTURE";
      const unitLabel = isStrip ? "quadros" : "páginas";
      const unitName = isStrip ? "Quadro" : "Página";
      const unitNameUpper = isStrip ? "QUADRO" : "PÁGINA";

      const prompt = `Gere uma decupagem detalhada de ${isStrip ? "tirinha (comic strip)" : "roteiro de quadrinhos"} com base nas informações abaixo.
Argumento da história: "${argumentText}"
Número de ${isStrip ? "Quadros" : "Páginas"} desejado: ${plotterTotalPages}
Estrutura Narrativa base de roteiro: ${plotterMethod}

DIRETRIZES IMPORTANTES PARA A DESCRIÇÃO DE CADA ${unitNameUpper}:
1. TEMPO PRESENTE OBRIGATÓRIO: Toda descrição de ação nos quadros/páginas deve ser escrita estritamente no tempo presente (ex: "Juju segura o tapete", e não "Juju segurava" ou "estendeu").
2. INSTANTÂNEO VISUAL ESTÁTICO (FOTOGRAFIA): Quadrinhos/HQs são formados por imagens estáticas. Cada descrição de ${unitName} deve retratar um ÚNICO instante congelado no tempo, focado no que o desenhista/ilustrador deve ilustrar naquela única cena. NÃO descreva uma sucessão temporal de ações dinâmicas contínuas (ex: evite "Juju estende o tapete, depois aponta com entusiasmo e em seguida chama o gato Tico", pois isso descreve múltiplos momentos dinâmicos de animação ou filme; prefira descrever o arranjo visual estático unificado: "Juju, sorridente em roupas de ginástica, aponta com entusiasmo para o tapete de yoga estendido no chão da sala de estar, chamando pelo gato Tico que a observa deitado sob o sofá com tédio").
3. CONCISO E VISUAL: Foque nas expressões faciais, pose/posição física dos personagens no ambiente, enquadramento implícito e objetos ao redor.

Por favor, gere exatamente ${plotterTotalPages} ${unitLabel}.
Retorne sua resposta estritamente no seguinte formato estruturado de texto, repetido para cada ${unitName} (sem introdução nem conclusão na resposta):

${unitNameUpper} X: [Nome da Batida] (Intensidade: [Baixa/Média/Alta/Clímax])
Descrição: [Escreva a descrição estática da cena no tempo presente seguindo as diretrizes acima]

Exemplo para ${unitName} 1:
${unitNameUpper} 1: ${isStrip ? "Situação Inicial / Premissa" : "Introdução & Status Quo"} (Intensidade: Baixa)
Descrição: ${isStrip ? "Juju, sorridente em roupas de ginástica, aponta para o tapete de yoga colorido estendido na sala de estar, enquanto o gato Tico a observa deitado no sofá com desinteresse." : "O detetive Manoel, com olhar cansado, observa a chuva caindo do lado de fora da janela de vidro do seu escritório escuro, segurando uma caneca de café com fumaça."}`;

      const responseText = await onTriggerAi("custom", { prompt });
      const pages: LocalPageBeat[] = [];
      const lines = responseText.split("\n").map(l => l.trim()).filter(Boolean);
      
      let currentPage: Partial<LocalPageBeat> = {};
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const pageMatch = line.match(/^(?:[#\*\-\s]*)(?:PÁGINA|PAGINA|QUADRO)\s+(\d+)[:\-\s\*\(\)]*(.*)$/i);
        if (pageMatch) {
          if (currentPage.pageNumber) {
            pages.push(currentPage as LocalPageBeat);
          }
          
          const pNum = parseInt(pageMatch[1], 10);
          let remainder = pageMatch[2].trim();
          
          let beatName = "Batida";
          let intensity: "Baixa" | "Média" | "Alta" | "Clímax" = "Média";
          
          const intensityMatch = remainder.match(/\((?:Intensidade|Intensity)[:\s]*(Baixa|Média|Alta|Clímax|Low|Medium|High|Climax)\)/i);
          if (intensityMatch) {
            const val = intensityMatch[1].toLowerCase();
            if (val.includes("baix") || val === "low") intensity = "Baixa";
            else if (val.includes("méd") || val.includes("med") || val === "medium") intensity = "Média";
            else if (val.includes("alt") || val === "high") intensity = "Alta";
            else if (val.includes("clí") || val.includes("cli") || val === "climax") intensity = "Clímax";
            
            remainder = remainder.replace(intensityMatch[0], "").trim();
          }
          
          beatName = remainder.replace(/^[:\-\s]+|[:\-\s]+$/g, "").trim();
          if (!beatName) beatName = `${unitName} ${pNum}`;
          
          currentPage = {
            pageNumber: pNum,
            beatName: beatName,
            intensity: intensity,
            description: ""
          };
        } else if (/^(?:[#\*\-\s]*)(?:descrição|descricao)[:\-\s\*\(\)]*(.*)$/i.test(line)) {
          const descMatch = line.match(/^(?:[#\*\-\s]*)(?:descrição|descricao)[:\-\s\*\(\)]*(.*)$/i);
          const descText = descMatch ? descMatch[1].trim() : "";
          if (currentPage.pageNumber) {
            currentPage.description = descText;
          }
        } else {
          if (currentPage.pageNumber) {
            if (currentPage.description) {
              currentPage.description += " " + line;
            } else {
              currentPage.description = line;
            }
          }
        }
      }
      
      if (currentPage.pageNumber) {
        pages.push(currentPage as LocalPageBeat);
      }
      
      if (pages.length === 0) {
        generateLocalDecupage();
        return;
      }

      const cleanedPages = pages.map((p, idx) => ({
        ...p,
        pageNumber: idx + 1,
        intensity: p.intensity || "Média",
        description: p.description || "Descrição de cena a ser detalhada."
      })).slice(0, plotterTotalPages);
      
      setPlotterPages(cleanedPages);
      if (onTriggerToast) {
        onTriggerToast(`Decupagem de ${cleanedPages.length} ${unitLabel} gerada por IA com sucesso!`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Erro ao consultar Gemini para gerar a decupagem. Gerando com a fórmula rápida local offline.");
      generateLocalDecupage();
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddPlotterPage = (afterPageNumber: number) => {
    const newPages = [...plotterPages];
    const insertIdx = afterPageNumber;
    
    const isStrip = plotterMethod === "STRIP_STRUCTURE";
    const unitName = isStrip ? "Quadro" : "Página";

    const newPage: LocalPageBeat = {
      pageNumber: afterPageNumber + 1,
      beatName: isStrip ? "Novo Quadro" : "Nova Transição / Batida",
      intensity: "Média",
      description: isStrip 
        ? "Descreva o que acontece visualmente neste quadro da tirinha..." 
        : "Descreva a ação ou desenvolvimento de enredo para esta nova página..."
    };
    
    newPages.splice(insertIdx, 0, newPage);
    
    const renumbered = newPages.map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));
    
    setPlotterPages(renumbered);
    setPlotterTotalPages(renumbered.length);
  };

  const handleDeletePlotterPage = (pageNumber: number) => {
    if (plotterPages.length <= 1) return;
    const filtered = plotterPages.filter(p => p.pageNumber !== pageNumber);
    const renumbered = filtered.map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));
    setPlotterPages(renumbered);
    setPlotterTotalPages(renumbered.length);
  };

  const handleUpdatePlotterPage = (pageNumber: number, fields: Partial<LocalPageBeat>) => {
    setPlotterPages(prev => prev.map(p => p.pageNumber === pageNumber ? { ...p, ...fields } : p));
  };

  const handleApplyDecupage = () => {
    if (plotterPages.length === 0) {
      alert("Gere uma decupagem antes de aplicar ao roteiro.");
      return;
    }

    const isStrip = plotterMethod === "STRIP_STRUCTURE";
    const totalCurrentPages = project.pages.length;
    
    let confirmMsg = "";
    if (isStrip) {
      confirmMsg = `Esta ação substituirá TODAS as ${totalCurrentPages} páginas atuais do roteiro "${project.settings.title}" por uma única página contendo a tirinha de ${plotterPages.length} quadros decupados. Seu progresso anterior será sobrescrito. Deseja prosseguir?`;
    } else {
      confirmMsg = `Esta ação substituirá TODAS as ${totalCurrentPages} páginas atuais do roteiro "${project.settings.title}" pela nova decupagem de ${plotterPages.length} páginas. Seu progresso de diálogos e quadros anteriores será sobrescrito. Deseja prosseguir?`;
    }

    const conf = confirm(confirmMsg);
    if (!conf) return;

    let newPages: ScriptPage[] = [];

    if (isStrip) {
      // Cria UMA ÚNICA página contendo N painéis (quadros) correspondentes a plotterPages
      const panels: Panel[] = plotterPages.map((lp, idx) => ({
        id: "panel-" + Date.now() + "-lp-" + lp.pageNumber,
        panelNumber: idx + 1,
        framing: idx === plotterPages.length - 1 ? "Close-up" : "Plano médio",
        visualDescription: lp.description,
        dialogue: "",
        narration: "",
        soundEffects: "",
        emotions: lp.intensity === "Clímax" ? "Cômico/Expressivo" : "Curiosidade",
        cameraMovement: "Estática",
        timeOfScene: "Dia",
        artistNotes: `[${lp.beatName}]`
      }));

      newPages = [{
        id: "page-" + Date.now() + "-1",
        pageNumber: 1,
        rhythmNotes: `Tirinha completa com ${plotterPages.length} quadros decupados.`,
        panels: panels
      }];
    } else {
      // Lógica padrão: Cria N páginas, cada uma com 1 painel
      newPages = plotterPages.map(lp => ({
        id: "page-" + Date.now() + "-" + lp.pageNumber,
        pageNumber: lp.pageNumber,
        rhythmNotes: `[Intensidade: ${lp.intensity.toUpperCase()}] [${lp.beatName}] ${lp.description}`,
        panels: [
          {
            id: "panel-" + Date.now() + "-lp-" + lp.pageNumber,
            panelNumber: 1,
            framing: "Plano médio",
            visualDescription: lp.description || "Rascunhe os primeiros movimentos físicos da cena baseando-se no ritmo acima...",
            dialogue: "",
            narration: "",
            soundEffects: "",
            emotions: lp.intensity === "Clímax" ? "Tensão Máxima" : "Mistério",
            cameraMovement: "Estática",
            timeOfScene: "Dia",
            artistNotes: ""
          }
        ]
      }));
    }

    const updatedProject: Project = {
      ...project,
      settings: {
        ...project.settings,
        totalPages: newPages.length,
        premise: argumentText
      },
      structureMethod: plotterMethod,
      pages: newPages
    };

    onChange(updatedProject);
    if (onTriggerToast) {
      if (isStrip) {
        onTriggerToast(`Tirinha com ${plotterPages.length} quadros aplicada ao roteiro ativo com sucesso!`);
      } else {
        onTriggerToast(`Decupagem de ${plotterPages.length} páginas aplicada ao roteiro ativo com sucesso!`);
      }
    }
  };

  const guidedQuestions = [
    { key: "protagonist", label: "Quem conduz a narrativa (Protagonista)?", placeholder: "Ex: Manoel Reis, um ex-policial de olhos cansados pela névoa...", ref: "Robert McKee: Desejos paralelos e vulnerabilidades profundas" },
    { key: "desire", label: "O que ele persegue ardentemente (Objetivo consciente)?", placeholder: "Ex: Salvar sua sobrinha desaparecida a qualquer custo...", ref: "John Truby: O desejo é o imã que dá tração mecânica ao roteiro" },
    { key: "obstacle", label: "O que impede a conquista (Oponente principal)?", placeholder: "Ex: Uma milícia local controladora de dados e sua própria fobia de multidões...", ref: "Robert McKee: Leis e barreiras implacáveis do plano do mundo" },
    { key: "mainConflict", label: "Qual o cerne do conflito na obra?", placeholder: "Ex: Uma testemunha perigosa detém provas secretas, mas exige resgate armado...", ref: "William Eisner: Dramaturgia humana expressa em ambientes limitados" },
    { key: "risk", label: "O que desmorona se ele sucumbir?", placeholder: "Ex: A impunidade corporativa se consagra e a testemunha é silenciada...", ref: "Blake Snyder: Elevar o valor do prejuízo final da falha" },
    { key: "emotionalTransformation", label: "Qual a mudança existencial no desfecho?", placeholder: "Ex: De um apático conformista rústico a um mentor ciente de sua responsabilidade ética...", ref: "John Truby: A autorrevelação espiritual no clímax final" }
  ];

  const methodsList = [
    {
      value: "THREE_ACTS",
      label: "A Estrutura de 3 Atos (Robert McKee)",
      desc: "Excelente para roteiros dramáticos longos. Equilíbrio de causas e consequências morais.",
      beats: [
        { id: "act1", name: "Ato I: Status Comum & Desencadeador", placeholder: "Insira a ambientação e o incidente incitador que rompe o equilíbrio cotidiano." },
        { id: "act2", name: "Ato II: Complicações & Encruzilhada", placeholder: "A rota se preenche de forças opostas. Tentativas simplistas geram maiores perigos." },
        { id: "act3", name: "Ato III: Resolução Dramática & Revelação", placeholder: "O grande confronto conceitual da trama, exigindo superação da fraqueza fundamental." }
      ]
    },
    {
      value: "SAVE_THE_CAT",
      label: "O Beat Sheet de Blake Snyder",
      desc: "Perfeito para andamentos rápidos de alta ação e reviravoltas rítmicas encadeadas.",
      beats: [
        { id: "opening", name: "Opening Image (Planta Inicial)", placeholder: "Página 1. Capture visualmente as regras do ambiente degradado inicial." },
        { id: "theme", name: "Theme Stated (Declaração do Tema)", placeholder: "Alguém ou um acontecimento expressa discretamente o aprendizado exigido da obra." },
        { id: "catalyst", name: "Catalyst (Incitador do Conflito)", placeholder: "O telefone toca, as mentiras vêm à tona, a aventura força passagem." },
        { id: "debate", name: "Debate (Momento de Resistência)", placeholder: "O herói duvida de suas forças. Tentativas de recuo e recusa dramática." },
        { id: "break2", name: "Break into Two (Início do Ato II)", placeholder: "Cruzar a grande soleira mística ou prática. Nova arena de ação." },
        { id: "midpoint", name: "Midpoint (O Giro Central)", placeholder: "Falsa vitória ou grande derrota que dobra os riscos para o elenco." },
        { id: "alllost", name: "All is Lost (Fundo do Poço)", placeholder: "O fracasso material máximo. Aliados rompem e o vilão detém o trunfo." },
        { id: "finale", name: "Finale (O Clímax Final)", placeholder: "Reunificação de propósitos, clareza existencial e reconciliação ética no embate." }
      ]
    },
    {
      value: "JOHN_TRUBY",
      label: "Os 7 Passos Orgânicos de John Truby",
      desc: "Foco profundo na moralidade do protagonista, amarrada às ações do oponente.",
      beats: [
        { id: "weakness", name: "1. Fraqueza e Fome (Weakness/Need)", placeholder: "A paralisia íntima inicial que assola e adoece o cotidiano do protagonista." },
        { id: "desire", name: "2. Desejo Primordial (Desire)", placeholder: "O propósito claro que empurra a mecânica física da história à frente." },
        { id: "opponent", name: "3. Oponente Crucial (Opponent)", placeholder: "Quem tensiona o mesmo prêmio, testando os valores do herói." },
        { id: "plan", name: "4. Diretrizes e Tática (Plan)", placeholder: "As decisões táticas pensadas pelo herói para contornar barreiras." },
        { id: "battle", name: "5. Batalha Central (Battle)", placeholder: "A colisão de forças no ato posterior, dividindo as certezas do grupo." },
        { id: "reveal", name: "6. Autorrevelação Moral (Self-Revelation)", placeholder: "O vislumbre ético interno. O herói se reconhece culpado e remodela sua face moral." },
        { id: "newstatus", name: "7. Novo Equilíbrio (Equilibrium)", placeholder: "Harmonia externa restaurada, mas estruturada em bases éticas reformadas." }
      ]
    },
    {
      value: "HEROS_JOURNEY",
      label: "A Jornada do Herói (Mito/Campbell)",
      desc: "Ideal para jornadas transformadoras profundas e grandes aventuras fantásticas.",
      beats: [
        { id: "call", name: "1. Chamado à Aventura", placeholder: "O evento que intima o herói a sair de sua zona de conforto comum." },
        { id: "refusal", name: "2. Recusa do Chamado", placeholder: "O herói hesita ou expressa medo perante o perigo ou dever solicitado." },
        { id: "mentor", name: "3. Encontro com o Mentor", placeholder: "Alguém concede sabedoria, conselho ou um artefato místico/técnico para a travessia." },
        { id: "threshold", name: "4. Travessia do Primeiro Limiar", placeholder: "O herói se compromete e entra de fato no mundo extraordinário." },
        { id: "tests", name: "5. Testes, Aliados e Inimigos", placeholder: "A exploração das regras do novo mundo através de pequenos desafios e formação de laços." },
        { id: "approach", name: "6. Aproximação da Caverna Oculta", placeholder: "O herói e seus aliados preparam-se para o maior desafio no núcleo da arena." },
        { id: "ordeal", name: "7. Provação Suprema", placeholder: "O momento crítico de morte e renascimento (físico ou espiritual) enfrentando a maior fobia." },
        { id: "reward", name: "8. Recompensa (Elixir/Espada)", placeholder: "O herói toma posse do tesouro, conhecimento ou trunfo após sobreviviver à provação." },
        { id: "roadback", name: "9. Caminho de Volta", placeholder: "As forças inimigas remanescentes perseguem o herói enquanto ele tenta retornar." },
        { id: "resurrection", name: "10. Ressurreição", placeholder: "O último teste severo de vida ou morte que prova se os aprendizados foram de fato consolidados." },
        { id: "returnelixir", name: "11. Retorno com o Elixir", placeholder: "O herói volta ao mundo comum transformado, usando seu aprendizado para curar a comunidade." }
      ]
    },
    {
      value: "EPISODIC",
      label: "Estrutura Episódica (Séries/Webcomics)",
      desc: "Excelente para narrativas em capítulos, webcomics com arcos contínuos ou tramas procedurais.",
      beats: [
        { id: "status_quo", name: "1. Status Quo Inicial", placeholder: "Como o episódio ou capítulo começa. A rotina estabelecida no momento atual." },
        { id: "inciting", name: "2. Incidente Desestabilizador", placeholder: "A quebra inesperada que força o início do conflito imediato deste capítulo." },
        { id: "complications", name: "3. Complicações & Picos de Tensão", placeholder: "Os obstáculos crescentes que os personagens enfrentam ao longo do episódio." },
        { id: "climax", name: "4. Clímax do Episódio", placeholder: "O ponto culminante da tensão dramática e resolução das forças ativas imediatas." },
        { id: "cliffhanger", name: "5. Novo Status Quo & Gancho", placeholder: "A calmaria temporária e a revelação que deixa a pergunta aberta para o próximo capítulo." }
      ]
    },
    {
      value: "STRIP_STRUCTURE",
      label: "Estrutura de Tirinhas (1 a 4 Quadros)",
      desc: "Perfeito para andamentos rápidos de tirinhas curtas com resoluções de humor imediato.",
      beats: [
        { id: "strip_intro", name: "Quadro 1: Situação Inicial / Premissa", placeholder: "Apresenta o contexto comum, os personagens e estabelece a rotina normal." },
        { id: "strip_dev", name: "Quadro 2: Desenvolvimento / Complicação", placeholder: "Adiciona uma quebra de expectativa ou introduz a complicação de forma rápida." },
        { id: "strip_punchline", name: "Quadro 3: Punchline / Resolução", placeholder: "A piada final, revelação irônica ou gag visual que desconstrói a premissa." }
      ]
    }
  ];

  const activeMethodDetails = methodsList.find(m => m.value === method) || methodsList[0];

  const handleGuidedInput = (key: string, val: string) => {
    onGuidedChange({
      ...guidedStructure,
      [key]: val
    });
  };

  const handleBeatInput = (key: string, val: string) => {
    onAnswersChange({
      ...structureAnswers,
      [key]: val
    });
  };

  return (
    <div id="narrative-structure" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-art-charcoal" />
            Módulo de Arquitetura Narrativa
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Alinhamento do esqueleto dramático com as regras conceituais dos consagrados analistas de roteiro.
          </p>
        </div>

        {/* Top-level Pane Switcher */}
        <div className="flex bg-art-sidebar p-1 rounded border border-art-border">
          <button
            id="panel-btn-guided-q"
            onClick={() => setActivePane("QUESTIONS")}
            className={`px-3.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activePane === "QUESTIONS" 
                ? "bg-art-charcoal text-art-bg shadow-3xs" 
                : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Sondagem Guiada
          </button>
          <button
            id="panel-btn-methods-b"
            onClick={() => setActivePane("METHODS")}
            className={`px-3.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activePane === "METHODS" 
                ? "bg-art-charcoal text-art-bg shadow-3xs" 
                : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Batidas Dramáticas
          </button>
          <button
            id="panel-btn-plotter"
            onClick={() => setActivePane("PLOTTER")}
            className={`px-3.5 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activePane === "PLOTTER" 
                ? "bg-art-charcoal text-art-bg shadow-3xs" 
                : "text-stone-550 hover:text-art-charcoal"
            }`}
          >
            Decupador de Argumento
          </button>
        </div>
      </div>

      {activePane === "QUESTIONS" ? (
        /* Perguntas Guiadas de Roteiro */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-5">
            <div className="bg-art-sidebar/25 p-4 border border-art-border rounded mb-2 shadow-3xs">
              <h3 className="text-xs font-serif font-bold text-art-charcoal tracking-wider uppercase flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-4 w-4 text-art-charcoal animate-pulse" />
                Como funciona a sondagem de premissas?
              </h3>
              <p className="text-stone-650 leading-relaxed font-serif">
                Antes de estipular enquadramentos conceituais ou diálogos soltos na sarjeta, o autor modela a fundação de causa, efeito e lição moral. Responda com clareza literária para firmar a retórica do seu roteiro.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guidedQuestions.map((q) => (
                <div key={q.key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-serif font-bold text-art-charcoal uppercase tracking-wider pl-1 font-medium leading-tight">
                      {q.label}
                    </label>
                  </div>
                  <textarea
                    id={`input-guided-q-${q.key}`}
                    rows={3}
                    value={(guidedStructure as any)[q.key] || ""}
                    onChange={(e) => handleGuidedInput(q.key, e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full text-xs font-serif p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal leading-relaxed placeholder-stone-400 shadow-3xs"
                  />
                  <span className="text-[9px] font-mono font-bold text-stone-500 block pl-1 uppercase tracking-wide">
                    ✦ Fundamentação: {q.ref}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Summary box */}
          <div className="md:col-span-4 bg-art-sidebar/10 border border-art-border rounded p-5 space-y-4 h-fit">
            <h4 className="text-[10px] font-mono font-bold text-art-charcoal uppercase tracking-widest leading-none">
              Resumo da Arquitetura Guiada
            </h4>
            <div className="space-y-3.5 divide-y divide-art-border">
              <div className="pt-0">
                <span className="text-[9px] font-mono text-stone-550 uppercase tracking-widest font-bold">Condução Ativa (Protagonista)</span>
                <p className="text-xs font-serif italic text-stone-850 mt-1 line-clamp-3">
                  {guidedStructure.protagonist || "Elemento pendente de registro..."}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[9px] font-mono text-stone-550 uppercase tracking-widest font-bold">Motor Litúrgico (Desejo)</span>
                <p className="text-xs font-serif italic text-stone-850 mt-1 line-clamp-3">
                  {guidedStructure.desire || "Agitador dramático ainda não definido..."}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[9px] font-mono text-stone-550 uppercase tracking-widest font-bold">Resistência (Conflito de Espaço)</span>
                <p className="text-xs font-serif italic text-stone-850 mt-1 line-clamp-3">
                  {guidedStructure.mainConflict || "Ponto de resistência sem especificação..."}
                </p>
              </div>

              <div className="pt-3">
                <span className="text-[9px] font-mono text-stone-550 uppercase tracking-widest font-bold">Destino Moral (Arco de Mudança)</span>
                <p className="text-xs font-serif italic text-stone-850 mt-1 line-clamp-3">
                  {guidedStructure.emotionalTransformation || "Desenlace comportamental por configurar..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : activePane === "METHODS" ? (
        /* Batidas de Métodos (McKee, Snyder, Truby) */
        <div className="space-y-6">
          {/* Method selector menu card */}
          <div className="bg-art-sidebar/15 border border-art-border p-5 rounded">
            <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-3 leading-none">
              Escola Estrutural Teórica Ativa:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {methodsList.map((m) => (
                <button
                  id={`btn-method-sel-${m.value}`}
                  key={m.value}
                  onClick={() => onMethodChange(m.value as NarrativeStructureMethod)}
                  className={`p-3.5 rounded text-left border transition-all cursor-pointer ${
                    method === m.value
                      ? "bg-art-charcoal text-art-bg border-art-charcoal shadow-3xs"
                      : "bg-art-card border-art-border text-stone-605 hover:border-art-charcoal"
                  }`}
                >
                  <h4 className="font-serif font-bold text-xs uppercase tracking-wide">{m.label.split(" - ")[0]}</h4>
                  <p className="text-[10px] text-stone-500 italic leading-tight mt-1.5 font-serif">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active beats outputs list */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest pl-1 leading-none">
              Quadro de Escrita Integrada ({activeMethodDetails.label})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMethodDetails.beats.map((bt) => (
                <div key={bt.id} className="bg-art-card border border-art-border rounded p-4.5 space-y-2.5 shadow-3xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-serif font-bold text-art-bg bg-art-charcoal px-2.5 py-0.5 rounded uppercase tracking-wide">
                      {bt.name}
                    </span>
                    <p className="text-[10px] text-stone-500 italic mt-2 pl-1 font-serif">
                      Incidência: {bt.placeholder}
                    </p>
                  </div>
                  <textarea
                    id={`input-beat-text-${bt.id}`}
                    rows={3}
                    value={structureAnswers[bt.id] || ""}
                    onChange={(e) => handleBeatInput(bt.id, e.target.value)}
                    placeholder="Escreva sua fone, rascunho de roteiro ou notas para essa batida específica..."
                    className="w-full text-xs font-serif p-2.5 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal mt-2 text-art-charcoal placeholder-stone-400 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Decupador de Argumento (PLOTTER) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Coluna Esquerda: Configuração */}
          <div className="lg:col-span-4 space-y-5 bg-art-sidebar/10 border border-art-border rounded p-5 h-fit shadow-3xs">
            <div>
              <h3 className="text-xs font-serif font-bold text-art-charcoal tracking-wider uppercase flex items-center gap-1.5 mb-1">
                <Sparkles className="h-4 w-4 text-art-charcoal" />
                Configurar Decupagem
              </h3>
              <p className="text-stone-650 leading-relaxed font-serif text-[11px] italic">
                Insira o argumento geral e configure a estrutura de páginas desejada para distribuição automática.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest">
                    Argumento da História
                  </label>
                  {onTriggerAi && (
                    <button
                      type="button"
                      onClick={handleImproveArgument}
                      disabled={argumentAiLoading || !argumentText.trim()}
                      className="text-[9px] font-mono font-bold text-yellow-850 bg-yellow-50 hover:bg-yellow-100 border border-yellow-250 py-1 px-2.5 rounded transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1 shrink-0 uppercase tracking-wider"
                      title="Melhorar argumento em prosa (tempo presente) com IA"
                    >
                      <Sparkles className={`h-3 w-3 ${argumentAiLoading ? "animate-spin text-yellow-600" : "text-yellow-650"}`} />
                      {argumentAiLoading ? "Aprimorando..." : "Polir Argumento"}
                    </button>
                  )}
                </div>
                <textarea
                  id="plotter-argument-input"
                  rows={6}
                  value={argumentText}
                  onChange={(e) => setArgumentText(e.target.value)}
                  placeholder="Escreva a sinopse ou o argumento completo da sua história aqui..."
                  className="w-full text-xs font-serif p-3 bg-art-card border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal leading-relaxed placeholder-stone-400 shadow-3xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                  {plotterMethod === "STRIP_STRUCTURE" ? "Quantidade de Quadros" : "Quantidade de Páginas"}: {plotterTotalPages}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={plotterMethod === "STRIP_STRUCTURE" ? 1 : 2}
                    max={plotterMethod === "STRIP_STRUCTURE" ? 8 : 200}
                    value={plotterTotalPages}
                    onChange={(e) => setPlotterTotalPages(parseInt(e.target.value, 10))}
                    className="flex-1 accent-art-charcoal cursor-pointer"
                  />
                  <input
                    type="number"
                    min={plotterMethod === "STRIP_STRUCTURE" ? 1 : 2}
                    max={plotterMethod === "STRIP_STRUCTURE" ? 8 : 300}
                    value={plotterTotalPages}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setPlotterTotalPages(val);
                    }}
                    className="w-14 text-center text-xs font-mono font-bold p-1 bg-art-card border border-art-border rounded focus:outline-none focus:border-art-charcoal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5">
                  Estrutura Teórica de Foco
                </label>
                <select
                  value={plotterMethod}
                  onChange={(e) => setPlotterMethod(e.target.value as NarrativeStructureMethod)}
                  className="w-full font-sans text-xs p-2.5 bg-art-card border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                >
                  <option value="THREE_ACTS">3 Atos (Robert McKee)</option>
                  <option value="SAVE_THE_CAT">Beat Sheet (Save the Cat)</option>
                  <option value="HEROS_JOURNEY">Jornada do Herói (Joseph Campbell)</option>
                  <option value="JOHN_TRUBY">7 Passos Orgânicos (John Truby)</option>
                  <option value="EPISODIC">Estrutura Episódica (Séries)</option>
                  <option value="STRIP_STRUCTURE">Estrutura de Tirinhas (1-4 Quadros)</option>
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  id="btn-plotter-generate-local"
                  onClick={generateLocalDecupage}
                  className="w-full bg-art-card hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-xs py-2.5 px-4 border border-art-border rounded flex items-center justify-center gap-2 transition-all shadow-3xs cursor-pointer uppercase tracking-widest"
                >
                  <RefreshCw className="h-4 w-4" />
                  Decupar (Fórmula Rápida)
                </button>

                {onTriggerAi && (
                  <button
                    id="btn-plotter-generate-ai"
                    onClick={generateAiDecupage}
                    disabled={aiLoading}
                    className="w-full bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-3 px-4 rounded flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer uppercase tracking-widest disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando com Gemini...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 text-yellow-300" />
                        Decupar com IA (Gemini)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Lista de Páginas/Quadros Decupados */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center bg-art-card border border-art-border p-4 rounded shadow-3xs">
              <div>
                <span className="text-[9px] font-mono font-bold text-art-bg bg-art-charcoal px-2.5 py-1 rounded">
                  ESTRUTURA DE DESENVOLVIMENTO
                </span>
                <h3 className="text-sm font-serif font-bold text-art-charcoal mt-2.5 uppercase tracking-wide">
                  {plotterMethod === "STRIP_STRUCTURE" ? "Quadros Decupados e Distribuídos" : "Páginas Decupadas e Distribuídas"}
                </h3>
              </div>

              {plotterPages.length > 0 && (
                <button
                  onClick={() => setPlotterPages([])}
                  className="text-stone-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 transition-all uppercase tracking-wider cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </button>
              )}
            </div>

            {plotterPages.length === 0 ? (
              <div className="bg-art-card border-2 border-dashed border-art-border rounded-lg p-12 text-center text-stone-500 space-y-4">
                <BookOpen className="h-12 w-12 text-stone-300 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-art-charcoal uppercase">
                    Nenhum {plotterMethod === "STRIP_STRUCTURE" ? "quadro" : "página"} decupado
                  </h4>
                  <p className="text-xs text-stone-500 font-serif italic max-w-md mx-auto leading-relaxed">
                    Escreva seu argumento, defina o número de {plotterMethod === "STRIP_STRUCTURE" ? "quadros" : "páginas"} na barra lateral e clique em gerar para distribuir seu enredo passo a passo!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List of generated pages */}
                <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
                  {plotterPages.map((page) => (
                    <div
                      key={page.pageNumber}
                      className="bg-art-card border border-art-border rounded p-4.5 flex flex-col gap-3 shadow-3xs relative transition-all hover:border-art-charcoal"
                    >
                      {/* Header of page card */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-art-border/50 pb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <span className="h-6 px-2 bg-art-charcoal text-art-bg rounded text-[10px] font-mono font-bold flex items-center justify-center uppercase tracking-wide">
                            {plotterMethod === "STRIP_STRUCTURE" ? "Quadro" : "Pág"} {page.pageNumber}
                          </span>
                          <input
                            type="text"
                            value={page.beatName}
                            onChange={(e) => handleUpdatePlotterPage(page.pageNumber, { beatName: e.target.value })}
                            placeholder={plotterMethod === "STRIP_STRUCTURE" ? "Nome do Quadro / Função Narrativa" : "Nome do Momento / Batida Dramática"}
                            className="text-xs font-serif font-bold bg-transparent border-b border-dashed border-stone-300 focus:outline-none focus:border-art-charcoal flex-1 uppercase tracking-wider text-art-charcoal py-0.5"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[9px] font-mono font-bold text-stone-555 uppercase tracking-wider">
                            Intensidade:
                          </label>
                          <select
                            value={page.intensity}
                            onChange={(e) => handleUpdatePlotterPage(page.pageNumber, { intensity: e.target.value as any })}
                            className="font-sans text-[10px] font-bold p-1 bg-art-sidebar border border-art-border rounded focus:outline-none text-art-charcoal uppercase tracking-wider cursor-pointer"
                          >
                            <option value="Baixa">🟢 Baixa</option>
                            <option value="Média">🟡 Média</option>
                            <option value="Alta">🟠 Alta</option>
                            <option value="Clímax">🔴 Clímax</option>
                          </select>

                          <div className="flex items-center border border-art-border rounded bg-art-sidebar/20">
                            <button
                              onClick={() => handleAddPlotterPage(page.pageNumber)}
                              className="p-1 hover:bg-art-sidebar hover:text-art-charcoal transition-all text-stone-400"
                              title={plotterMethod === "STRIP_STRUCTURE" ? "Inserir quadro após este" : "Inserir página após esta"}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                            {plotterPages.length > 1 && (
                              <button
                                onClick={() => handleDeletePlotterPage(page.pageNumber)}
                                className="p-1 hover:bg-art-sidebar hover:text-red-700 transition-all text-stone-400 border-l border-art-border"
                                title={plotterMethod === "STRIP_STRUCTURE" ? "Excluir este quadro" : "Excluir esta página"}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Text area description */}
                      <textarea
                        rows={2}
                        value={page.description}
                        onChange={(e) => handleUpdatePlotterPage(page.pageNumber, { description: e.target.value })}
                        placeholder={plotterMethod === "STRIP_STRUCTURE" ? "O que acontece neste quadro da tirinha..." : "O que acontece nesta página..."}
                        className="w-full text-xs font-serif p-2.5 bg-art-sidebar/25 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal leading-relaxed placeholder-stone-400"
                      />
                    </div>
                  ))}
                </div>

                {/* Apply Button */}
                <div className="bg-art-sidebar/10 border border-art-border rounded p-5 space-y-3.5 shadow-3xs">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-[11px] text-stone-605 italic font-serif leading-relaxed text-center sm:text-left">
                      Ao aplicar, os quadros estruturados serão transferidos para o seu **Estúdio de Decupagem**. {plotterMethod === "STRIP_STRUCTURE" ? "Uma única página será criada com todos estes quadros distribuídos." : "Suas notas de ritmo serão atualizadas com o conteúdo estruturado acima."}
                    </p>
                    <button
                      id="btn-plotter-apply-to-project"
                      onClick={handleApplyDecupage}
                      className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-3 px-6 rounded flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer uppercase tracking-widest whitespace-nowrap shrink-0"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aplicar Decupagem ao Roteiro Ativo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
