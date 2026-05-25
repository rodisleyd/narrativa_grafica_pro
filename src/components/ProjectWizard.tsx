import React, { useState } from "react";
import { ProjectFormat, ProjectSettings } from "../types";
import { Sparkles, ArrowRight, Layout, Palette, Users, BookOpen } from "lucide-react";

interface ProjectWizardProps {
  onComplete: (settings: ProjectSettings) => void;
}

export default function ProjectWizard({ onComplete }: ProjectWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [format, setFormat] = useState<ProjectFormat>("HQ_CLASSICA");
  const [genre, setGenre] = useState("Ação");
  const [targetAudience, setTargetAudience] = useState("Jovem Adulto");
  const [totalPages, setTotalPages] = useState(24);
  const [style, setStyle] = useState("");
  const [premise, setPremise] = useState("");
  const [theme, setTheme] = useState("");

  const formats = [
    { value: "HQ_CLASSICA", label: "HQ Clássica", desc: "Formato tradicional americano ou franco-belga. Páginas organizadas sob grades de painéis dinâmicos." },
    { value: "MANGA", label: "Mangá", desc: "Quadrinho japonês de leitura oriental. Ritmo focado na descompressão dramática e painéis deslumbrantes." },
    { value: "TIRINHAS", label: "Tirinhas", desc: "Estrutura rápida horizontal de 1 a 4 quadros. Foco extremo no humor rápido, ironia e punchline." },
    { value: "GRAPHIC_NOVEL", label: "Graphic Novel", desc: "Narrativa literária longa e fechada. Permite experimentar ritmos densos e artes experimentais complexas." },
    { value: "WEBCOMIC", label: "Webcomic", desc: "Criado para leitura de scroll infinito em telas verticais de celulares. Ritmo verticalizado contínuo." },
    { value: "STORYBOARD", label: "Storyboard", desc: "Planejamento estruturado audiovisual de cenas, câmeras e fluxos temporais para cinema ou animações." }
  ];

  const genres = [
    "Ação", "Aventura", "Fantasia", "Ficção científica", "Terror", "Noir",
    "Infantil", "Drama", "Romance", "Super-herói", "Slice of life",
    "Suspense", "Humor", "Cyberpunk", "Pós-apocalíptico"
  ];

  const handleNext = () => {
    if (!title.trim()) return;
    setStep(2);
  };

  const handleSubmit = () => {
    onComplete({
      title,
      format,
      genre,
      targetAudience,
      totalPages,
      style: style || "Estilo gráfico limpo padrão",
      premise: premise || "Uma jornada extraordinária...",
      theme: theme || "Dilemas humanos universais",
      author: author || "Autor não registrado"
    });
  };

  return (
    <div id="project-wizard" className="bg-art-card border border-art-border rounded p-8 max-w-2xl mx-auto my-12 shadow-sm">
      {/* Tracker of steps */}
      <div className="flex justify-between items-center mb-8 border-b border-art-border pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold text-art-bg bg-art-charcoal uppercase tracking-widest px-2.5 py-1 rounded">
            Design de Obra • Etapa Inicial
          </span>
          <h2 className="text-xl font-serif font-bold text-art-charcoal mt-2.5">
            {step === 1 ? "Configure o Formato e Detalhes de Produção" : "Premissa Temática e Conceito Visual"}
          </h2>
        </div>
        <div className="text-[10px] font-mono font-bold text-stone-600 bg-art-sidebar px-3 py-1 rounded">
          Passo {step} de 2
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          {/* Title and Author row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2">
                Título Provisório do Roteiro *
              </label>
              <input
                id="input-project-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: O Corvo de Ferro, O Beijo das Sombras..."
                className="w-full text-sm font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal transition-all text-art-charcoal"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2">
                Roteirista(s) / Autor(es)
              </label>
              <input
                id="input-project-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Will Eisner, Alan Moore..."
                className="w-full text-sm font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal transition-all text-art-charcoal"
              />
            </div>
          </div>

          {/* Formats Grid */}
          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-3">
              Selecione o Formato Metodológico
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formats.map((f) => (
                <button
                  id={`btn-format-${f.value}`}
                  key={f.value}
                  type="button"
                  onClick={() => {
                    setFormat(f.value as ProjectFormat);
                    if (f.value === "TIRINHAS") {
                      setTotalPages(1);
                      setGenre("Humor");
                    } else if (f.value === "GRAPHIC_NOVEL") {
                      setTotalPages(64);
                    } else {
                      setTotalPages(24);
                    }
                  }}
                  className={`text-left p-4 rounded border transition-all flex flex-col justify-between cursor-pointer ${
                    format === f.value
                      ? "border-art-charcoal bg-art-sidebar text-art-charcoal shadow-3xs"
                      : "border-art-border hover:border-art-charcoal bg-art-card text-stone-600"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layout className="h-4 w-4 text-art-charcoal" />
                    <span className="font-serif font-bold text-xs uppercase tracking-wider">{f.label}</span>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1.5">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Genre and Target Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2">
                Gênero Literário
              </label>
              <select
                id="select-project-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-stone-700 text-xs"
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2">
                Público-Alvo Proposto
              </label>
              <input
                id="input-project-audience"
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Jovem Adulto, Geral, Colecionador..."
                className="w-full font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal text-xs"
              />
            </div>
          </div>

          {/* Page Target bar */}
          {format !== "TIRINHAS" && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest">
                  Volume de Páginas Planejado (Pacing)
                </label>
                <span className="text-[10px] font-mono font-bold bg-art-charcoal text-art-bg px-2 py-0.5 rounded">
                  {totalPages} páginas
                </span>
              </div>
              <input
                id="slider-project-pages"
                type="range"
                min="1"
                max="120"
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value))}
                className="w-full accent-art-charcoal cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1">
                <span>1 pág (Strip)</span>
                <span>48 págs (Formato Padrão)</span>
                <span>120 págs (Álbum Fechado)</span>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              id="btn-wizard-next"
              type="button"
              disabled={!title.trim()}
              onClick={handleNext}
              className={`font-sans font-bold text-xs uppercase tracking-widest py-3 px-6 rounded flex items-center gap-1.5 transition-all ${
                title.trim()
                  ? "bg-art-charcoal hover:bg-stone-850 text-art-bg cursor-pointer shadow-sm"
                  : "bg-art-sidebar text-stone-400 cursor-not-allowed border border-art-border"
              }`}
            >
              Passo Seguinte
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Wizard step 2 details (Premise, Theme, Estilo Narrativo) */
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-stone-605" />
              Premissa Narrativa do Roteiro (Espinha Dorsal)
            </label>
            <textarea
              id="input-project-premise"
              rows={3}
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="Ex: Em uma São Paulo assolada por neblina perpétua, uma detetive que fala com espectros de gizes de cera busca desvendar o roubo de uma obra de arte viva..."
              className="w-full font-serif p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-stone-850 text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-stone-605" />
              Coração Moral (O que a obra discute?)
            </label>
            <input
              id="input-project-theme"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: A alienação cultural diante do progresso tecnológico frio e desalmado..."
              className="w-full font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal text-xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-stone-605" />
              Filosofia e Visual Estético Planejado
            </label>
            <input
              id="input-project-style"
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Ex: Aquarelas orgânicas com tons terrosos, ou alto contraste expressionista noir brut..."
              className="w-full font-sans p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal text-xs"
            />
          </div>

          <div className="pt-4 flex justify-between gap-4">
            <button
              id="btn-wizard-back"
              type="button"
              onClick={() => setStep(1)}
              className="font-sans text-xs uppercase tracking-wider text-stone-600 hover:text-art-charcoal hover:border-art-charcoal bg-art-card py-3 px-6 border border-art-border rounded transition-all cursor-pointer shadow-3xs"
            >
              Voltar ao Passo 1
            </button>
            <button
              id="btn-wizard-submit"
              type="button"
              onClick={handleSubmit}
              className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs uppercase tracking-widest py-3 px-8 rounded flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              Criar Estúdio & Iniciar Obra
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
