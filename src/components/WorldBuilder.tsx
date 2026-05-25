import React, { useState, useEffect } from "react";
import { WorldBuilding } from "../types";
import { Globe, Save, HelpCircle, Landmark, Sparkles, Sliders } from "lucide-react";

interface WorldBuilderProps {
  world: WorldBuilding;
  onChange: (updatedWorld: WorldBuilding) => void;
  onTriggerAi?: (type: string, payload: any) => Promise<string>;
}

export default function WorldBuilder({ world, onChange, onTriggerAi }: WorldBuilderProps) {
  const [era, setEra] = useState(world.era);
  const [technology, setTechnology] = useState(world.technology);
  const [culture, setCulture] = useState(world.culture);
  const [politics, setPolitics] = useState(world.politics);
  const [worldRules, setWorldRules] = useState(world.worldRules);
  const [visualClimate, setVisualClimate] = useState(world.visualClimate);
  const [architecture, setArchitecture] = useState(world.architecture);
  const [references, setReferences] = useState(world.references);
  const [colorPalette, setColorPalette] = useState<string[]>(
    world.colorPalette || ["#000000", "#ffffff"]
  );
  const [customColor, setCustomColor] = useState("#94a3b8");

  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "SAMPLES">("SETTINGS");

  useEffect(() => {
    setEra(world.era);
    setTechnology(world.technology);
    setCulture(world.culture);
    setPolitics(world.politics);
    setWorldRules(world.worldRules);
    setVisualClimate(world.visualClimate);
    setArchitecture(world.architecture);
    setReferences(world.references);
    setColorPalette(world.colorPalette || ["#000000", "#ffffff"]);
  }, [world]);

  const handleSave = () => {
    onChange({
      era,
      technology,
      culture,
      politics,
      worldRules,
      visualClimate,
      architecture,
      references,
      colorPalette
    });
  };

  const palettePresets = [
    { id: "noir", name: "Noir Clássico", colors: ["#000000", "#1e293b", "#475569", "#94a3b8", "#ffffff"] },
    { id: "cyber", name: "Cyberpunk Glow", colors: ["#020617", "#ec4899", "#06b6d4", "#8b5cf6", "#facc15"] },
    { id: "sepia", name: "Sépia Vintage", colors: ["#2d1d11", "#4f3420", "#845c42", "#c69e82", "#eee3cb"] },
    { id: "pop", name: "Silver Age Pop", colors: ["#dc2626", "#2563eb", "#eab308", "#171717", "#ffffff"] },
    { id: "pastel", name: "Fantasia Pastel", colors: ["#fecdd3", "#ffedd5", "#ecfccb", "#ccfbf1", "#dbeafe"] },
    { id: "gothic", name: "Terror Gótico", colors: ["#180808", "#3f0a0a", "#1c1917", "#78716c", "#d6d3d1"] }
  ];

  const handleAddColor = () => {
    let cleanHex = customColor.trim();
    if (!cleanHex.startsWith("#")) {
      cleanHex = "#" + cleanHex;
    }
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    if (!hexRegex.test(cleanHex)) {
      alert("Por favor, digite um código Hexadecimal válido no formato #RRGGBB.");
      return;
    }
    if (colorPalette.includes(cleanHex.toLowerCase())) {
      return; // prevent duplicates
    }
    setColorPalette([...colorPalette, cleanHex.toLowerCase()]);
  };

  const handleRemoveColor = (index: number) => {
    setColorPalette(colorPalette.filter((_, i) => i !== index));
  };

  const handleLoadPreset = (colors: string[]) => {
    setColorPalette(colors);
  };

  const handleAiWorldGen = async () => {
    if (!onTriggerAi) return;
    setAiLoading(true);
    try {
      const response = await onTriggerAi("ideas", {
        prompt: `Sugerira regras físicas e clima estético visual inovador para um quadrinho de fantasia/ficção científica com as seguintes palavras-chave preliminares. Retorne como tópicos curtos cobrindo:
Época: [Sua sugestão]
Regras do Mundo: [Por ex, gravidade, magia ou pactos]
Estética Visual: [Paleta de cores e atmosfera]
Arquétipo de Arquitetura: [Tipos de construções]`
      });

      // Split or display as reference directly
      setReferences(prev => (prev ? prev + "\n" : "") + "Sugerido por IA:\n" + response);
      setActiveTab("SETTINGS");
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const sections = [
    { label: "Época / Linha do Tempo", value: era, setter: setEra, placeholder: "Ex: Anos 80 vaporwave alternativo, futuro pós-solar...", icon: Globe },
    { label: "Nível Tecnológico", value: technology, setter: setTechnology, placeholder: "Ex: Baquelite análogo rústico, circuitos orgânicos...", icon: Sliders },
    { label: "Cultura e Tradições", value: culture, setter: setCulture, placeholder: "Ex: Silêncio sagrado nas ruas, coletores de poeira...", icon: Globe },
    { label: "Organização Social e Política", value: politics, setter: setPolitics, placeholder: "Ex: Corporações feudais cooperativas de mineração...", icon: Landmark },
    { label: "Regras do Mundo (Leis físicas ou místicas)", value: worldRules, setter: setWorldRules, placeholder: "Ex: A gravidade enfraquece ao meio-dia, as memórias evaporam com sol forte...", icon: Sliders },
    { label: "Clima Visual (Paleta, luzes e sombras)", value: visualClimate, setter: setVisualClimate, placeholder: "Ex: Névoa densa púrpura marcada por flashes de relâmpagos amarelos frios...", icon: Globe },
    { label: "Estilo Arquitetônico", value: architecture, setter: setArchitecture, placeholder: "Ex: Mega teto de betão industrial bruto misturado com favelas de fios luminescentes...", icon: Landmark },
    { label: "Ancoras de Referências Culturais", value: references, setter: setReferences, placeholder: "Ex: Blade Runner, Akira, gravuras de Gustave Doré...", icon: Globe }
  ];

  return (
    <div id="world-builder" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <Globe className="h-5 w-5 text-art-charcoal" />
            Módulo de Ambientação (Worldbuilding)
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Defina cronologias, costumes, tecnologias e as regras estruturais que asseguram a coerência espacial do seu quadrinho.
          </p>
        </div>
        <div className="flex gap-2.5">
          {onTriggerAi && (
            <button
              id="btn-ai-gen-world"
              disabled={aiLoading}
              onClick={handleAiWorldGen}
              className="bg-art-sidebar hover:bg-stone-300 text-art-charcoal font-sans font-bold text-xs py-2.5 px-3.5 rounded border border-art-border flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-art-charcoal animate-pulse" />
              {aiLoading ? "Inspirando..." : "Inspirar Lore com IA"}
            </button>
          )}
          <button
            id="btn-world-save"
            onClick={handleSave}
            className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2.5 px-5 rounded flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer uppercase tracking-wider"
          >
            <Save className="h-4 w-4" />
            Salvar Crônicas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Settings Form Fields */}
        <div className="md:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((sec, idx) => {
              const IconComp = sec.icon;
              return (
                <div key={idx} className={idx === 4 || idx === 5 ? "sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <IconComp className="h-3.5 w-3.5 text-art-charcoal" />
                    {sec.label}
                  </label>
                  <textarea
                    id={`input-world-sec-${idx}`}
                    rows={idx === 4 || idx === 5 ? 3 : 2}
                    value={sec.value}
                    onChange={(e) => sec.setter(e.target.value)}
                    placeholder={sec.placeholder}
                    className="w-full font-serif text-xs p-3 bg-art-sidebar/20 border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal leading-relaxed placeholder-stone-400"
                  />
                </div>
              );
            })}
          </div>

          {/* Paleta de Cores do Projeto Section */}
          <div className="border-t border-art-border pt-6 mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-serif font-bold text-art-charcoal uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-art-charcoal block animate-pulse"></span>
                Paleta de Cores da Obra
              </h3>
              <p className="text-stone-600 font-serif leading-relaxed text-xs">
                Selecione ou adicione os matizes dominantes da sua novela gráfica. Essas cores garantem a constância de iluminação sob as sarjetas e figurinos do elenco.
              </p>
            </div>

            <div className="bg-art-sidebar/10 p-4 border border-art-border rounded space-y-4 shadow-3xs">
              <div>
                <span className="text-[9px] font-mono font-bold text-stone-550 uppercase tracking-widest block mb-2 leading-none">
                  Tons Selecionados
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPalette.map((color, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-art-card p-1.5 border border-art-border rounded-lg group hover:border-art-charcoal transition-all relative shrink-0 shadow-3xs"
                    >
                      <span
                        className="h-5 w-5 rounded border border-art-charcoal/20 shadow-3xs"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-[10px] font-mono text-art-charcoal uppercase select-all font-semibold">
                        {color}
                      </span>
                      <button
                        id={`btn-remove-color-${index}`}
                        onClick={() => handleRemoveColor(index)}
                        className="opacity-60 hover:opacity-100 text-stone-400 hover:text-red-700 transition-all font-sans font-bold text-[9px] cursor-pointer pl-1 shrink-0"
                        title="Remover cor"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {colorPalette.length === 0 && (
                    <span className="text-stone-400 font-serif italic text-xs pl-1 block">Nenhuma cor definida. Carregue um preset ou use o seletor.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-3 border-t border-art-border/40">
                {/* Custom input */}
                <div className="sm:col-span-5 space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest block leading-none">
                    Adicionar Cor Manual
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-10 border border-art-border rounded overflow-hidden hover:border-art-charcoal transition-all cursor-pointer">
                      <input
                        id="color-picker-input"
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      />
                      <div
                        className="h-full w-full"
                        style={{ backgroundColor: customColor }}
                      ></div>
                    </div>
                    
                    <input
                      id="color-hex-text-input"
                      type="text"
                      value={customColor.toUpperCase()}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-20 text-[10px] font-mono p-1 border border-art-border rounded uppercase focus:outline-none focus:border-art-charcoal font-semibold text-center"
                      placeholder="#94A3B8"
                    />

                    <button
                      id="btn-add-custom-color"
                      onClick={handleAddColor}
                      className="bg-art-charcoal hover:bg-stone-850 text-art-bg text-[9.5px] font-sans font-bold uppercase tracking-wider py-1.5 px-3 rounded transition-all cursor-pointer shadow-3xs hover:shadow-2xs shrink-0"
                    >
                      Incluir
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div className="sm:col-span-7 space-y-1.5">
                  <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest block leading-none">
                    Presets Recomendados
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {palettePresets.map((preset) => (
                      <button
                        id={`btn-preset-pal-${preset.id}`}
                        key={preset.id}
                        onClick={() => handleLoadPreset(preset.colors)}
                        className="px-2 py-1 text-[9px] font-bold text-stone-605 bg-art-card hover:border-art-charcoal border border-art-border rounded transition-all flex items-center gap-1 cursor-pointer hover:bg-art-sidebar/20"
                        title={preset.colors.join(", ")}
                      >
                        <span className="flex items-center gap-0.5 pointer-events-none">
                          {preset.colors.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full border border-black/10"
                              style={{ backgroundColor: c }}
                            ></span>
                          ))}
                        </span>
                        <span className="font-serif font-bold text-[8.5px] uppercase tracking-wide">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-art-card border border-art-border p-3.5 rounded">
              <span className="text-[10px] font-mono font-bold text-art-charcoal uppercase tracking-widest block mb-1">
                ✦ Integração com Notas de Arte
              </span>
              <p className="text-[10.5px] text-stone-650 font-serif leading-relaxed">
                As cores inseridas aqui serão disponibilizadas diretamente no <strong className="font-semibold">Estúdio de Decupagem</strong>. Ao redigir as descrições dos quadros e notas ao desenhista, clique sobre as cores ativas para copiar rapidamente seus códigos Hex e manter o rigor cromático idealizado para cada cena.
              </p>
            </div>
          </div>
        </div>

        {/* Theoretical Educational Help Sidebar */}
        <div className="md:col-span-4 bg-art-sidebar/10 border border-art-border rounded p-5 space-y-4">
          <div className="border-b border-art-border pb-3 flex items-center gap-2">
            <Globe className="h-5 w-5 text-art-charcoal" />
            <h3 className="font-serif font-bold text-xs text-art-charcoal uppercase tracking-wider">Mecanismos do Espaço Narrativo</h3>
          </div>

          <div className="space-y-3.5">
            <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
              <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider">1. Gestão do Clima Visual</h4>
              <p className="text-[10px] text-stone-650 leading-relaxed mt-1 font-serif">
                Como os quadrinhos transferem o pacing temporal ao leitor, utilizar névoas, chuvas pesadas ou poeiras foca o olhar e estipula o tempo de assimilação psicológica dos quadros.
              </p>
            </div>

            <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
              <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider">2. O Ambiente Vivo (Eisner)</h4>
              <p className="text-[10px] text-stone-650 leading-relaxed mt-1 font-serif">
                Will Eisner ensinou que construções externam anseios espirituais das personagens. Sarjetas profundas e janelas enclausuradas projetam solidão existencial de forma orgânica.
              </p>
            </div>

            <div className="bg-art-card p-3 rounded border border-art-border shadow-3xs">
              <h4 className="text-[11px] font-serif font-bold text-art-charcoal uppercase tracking-wider">3. Semiótica dos Artefatos</h4>
              <p className="text-[10px] text-stone-650 leading-relaxed mt-1 font-serif">
                O desenho de mecanismos locais altera a relação do leitor: painéis luminosos pesados ecoam Kirby e Otomo, enquanto engrenagens manuais transmitem o calor do trabalho analógico.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
