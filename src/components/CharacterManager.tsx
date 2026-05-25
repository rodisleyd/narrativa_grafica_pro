import React, { useState } from "react";
import { Character } from "../types";
import { Users, Plus, Trash2, Edit3, HelpCircle, Save, Sparkles, UserCircle } from "lucide-react";

interface CharacterManagerProps {
  characters: Character[];
  onChange: (updatedChars: Character[]) => void;
  onTriggerAi?: (type: string, payload: any) => Promise<string>;
}

export default function CharacterManager({ characters, onChange, onTriggerAi }: CharacterManagerProps) {
  const [selectedChar, setSelectedChar] = useState<Character | null>(
    characters.length > 0 ? characters[0] : null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Form Temp State
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [fear, setFear] = useState("");
  const [weakness, setWeakness] = useState("");
  const [personality, setPersonality] = useState("");
  const [archetype, setArchetype] = useState("");
  const [appearance, setAppearance] = useState("");
  const [expressions, setExpressions] = useState("");
  const [bodyLanguage, setBodyLanguage] = useState("");
  const [relations, setRelations] = useState("");
  const [emotionalJourney, setEmotionalJourney] = useState("");

  const archetypeSuggestions = [
    "Herói Relutante", "Mentor Sábio", "Oponente Sombra", "Aliado Protetor",
    "Malandro / Estilo Trapaceiro", "Arauto da Mudança", "Guardião do Limiar"
  ];

  const handleSelect = (char: Character) => {
    setSelectedChar(char);
    setName(char.name);
    setObjective(char.objective);
    setFear(char.fear);
    setWeakness(char.weakness);
    setPersonality(char.personality);
    setArchetype(char.archetype);
    setAppearance(char.appearance);
    setExpressions(char.expressions);
    setBodyLanguage(char.bodyLanguage);
    setRelations(char.relations);
    setEmotionalJourney(char.emotionalJourney);
    setIsEditing(false);
  };

  const handleAddNewChar = () => {
    const newChar: Character = {
      id: "char-" + Date.now(),
      name: "Novo Personagem",
      objective: "O que ele deseja conquistar?",
      fear: "Qual seu maior medo?",
      weakness: "Qual sua fraqueza profunda?",
      personality: "Ex: Intrépido, misterioso...",
      archetype: "Herói Relutante",
      appearance: "Roupas, marcas físicas...",
      expressions: "Como são seus olhares normais?",
      bodyLanguage: "Como ele se move ou posiciona?",
      relations: "Aliados e rivais...",
      emotionalJourney: "Como ele muda psicologicamente até o fim?"
    };

    const list = [...characters, newChar];
    onChange(list);
    handleSelect(newChar);
    setIsEditing(true);
  };

  const handleDeleteChar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const list = characters.filter((c) => c.id !== id);
    onChange(list);
    if (selectedChar?.id === id) {
      setSelectedChar(list.length > 0 ? list[0] : null);
    }
  };

  const handleSave = () => {
    if (!selectedChar) return;
    const updated: Character = {
      ...selectedChar,
      name: name || "Sem Nome",
      objective,
      fear,
      weakness,
      personality,
      archetype,
      appearance,
      expressions,
      bodyLanguage,
      relations,
      emotionalJourney
    };

    const newList = characters.map((c) => (c.id === selectedChar.id ? updated : c));
    onChange(newList);
    setSelectedChar(updated);
    setIsEditing(false);
  };

  const handleGenAiCharacter = async () => {
    if (!onTriggerAi) return;
    setAiLoading(true);
    try {
      const response = await onTriggerAi("ideas", {
        prompt: `Crie um perfil detalhado de personagem coadjuvante ou oponente para um quadrinho de gênero e contexto livre de forma criativa. Me devolva no seguinte formato de chaves simples:
Nome: [Nome Sugerido]
Arquétipo: [Um de nossa lista]
Objetivo: [Seu desejo focado]
Medo: [Seu fantasma íntimo]
Fraqueza: [Sua falha moral]
Personalidade: [Suas reações]
Aparência: [Gesto físico ou trajes]
Foco na jornada emocional.`
      });

      // Parse fields loosely
      const lines = response.split("\n");
      const tempName = lines.find(l => l.startsWith("Nome:"))?.replace("Nome:", "").trim() || "Aliado Espontâneo";
      const tempArch = lines.find(l => l.startsWith("Arquétipo:"))?.replace("Arquétipo:", "").trim() || "Aliado Protetor";
      const tempObj = lines.find(l => l.startsWith("Objetivo:"))?.replace("Objetivo:", "").trim() || "";
      const tempFear = lines.find(l => l.startsWith("Medo:"))?.replace("Medo:", "").trim() || "";
      const tempWeak = lines.find(l => l.startsWith("Fraqueza:"))?.replace("Fraqueza:", "").trim() || "";

      // Fill automatically
      setName(tempName);
      setArchetype(tempArch);
      setObjective(tempObj || "Viver em paz longe das guerras locais");
      setFear(tempFear || "Ser abandonado pelas pessoas próximas");
      setWeakness(tempWeak || "Teimosia excessiva em cooperar");
      setPersonality("Enigmático mas profundamente leal se provado");
      setAppearance("Manto surrado com capuz e botas cinzentas cobertas de argila");
      setExpressions("Sobrancelhas sempre franzidas e sorriso irônico de lado");
      setBodyLanguage("Caminhar silencioso e braços sempre cruzados no peito");
      setRelations("Respeito distante pelo protagonista");
      setEmotionalJourney("Aprender que dividir fardos não é fragilidade");
      setIsEditing(true);
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div id="character-manager" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto shadow-sm text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-border pb-4 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal flex items-center gap-2">
            <Users className="h-5 w-5 text-art-charcoal" />
            Módulo de Gestão de Elenco
          </h2>
          <p className="text-stone-605 text-xs italic mt-1 font-serif">
            Planeje biografias, motivações secretas, arquétipos dramáticos e arcos de mudança de quem habita os quadros.
          </p>
        </div>
        <div className="flex gap-2.5">
          {onTriggerAi && (
            <button
              id="btn-ai-gen-char"
              disabled={aiLoading}
              onClick={handleGenAiCharacter}
              className="bg-art-sidebar hover:bg-stone-300 text-art-charcoal font-sans font-bold text-xs py-2 px-3.5 rounded border border-art-border flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-art-charcoal" />
              {aiLoading ? "Criando biografia..." : "Sugerir com IA"}
            </button>
          )}
          <button
            id="btn-add-char"
            onClick={handleAddNewChar}
            className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2 px-3.5 rounded flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Adicionar Membro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Cards Deck */}
        <div className="md:col-span-4 space-y-2">
          <h3 className="text-[10px] font-mono font-bold tracking-widest text-stone-550 uppercase mb-2 pl-1">
            Lista do Elenco
          </h3>
          {characters.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-art-border rounded text-stone-500 font-serif italic text-xs">
              Nenhum personagem registrado nesta obra. Clique em Adicionar acima!
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-stone-300">
              {characters.map((char) => (
                <button
                  id={`btn-char-item-${char.id}`}
                  key={char.id}
                  onClick={() => handleSelect(char)}
                  className={`w-full text-left p-3.5 rounded border flex justify-between items-center transition-all cursor-pointer ${
                    selectedChar?.id === char.id
                      ? "bg-art-sidebar border-art-border text-art-charcoal font-bold shadow-3xs"
                      : "bg-art-card border-art-border/50 hover:bg-art-sidebar/20 text-stone-650"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded bg-art-charcoal text-art-bg flex items-center justify-center font-mono font-bold text-sm">
                      {char.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-xs uppercase tracking-wide text-art-charcoal leading-tight">
                        {char.name}
                      </h4>
                      <p className="text-[10px] font-mono text-stone-500 mt-1 uppercase tracking-wide">{char.archetype || "Sem arquétipo"}</p>
                    </div>
                  </div>
                  <button
                    id={`btn-char-delete-${char.id}`}
                    onClick={(e) => handleDeleteChar(char.id, e)}
                    className="text-stone-400 hover:text-art-charcoal p-1.5 rounded hover:bg-art-card transition-all cursor-pointer"
                    title="Excluir personagem"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected character Deep profile inspector */}
        <div className="md:col-span-8 bg-art-sidebar/10 border border-art-border rounded p-6">
          {selectedChar ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-art-border pb-4">
                <div className="flex items-center gap-3">
                  <UserCircle className="h-10 w-10 text-art-charcoal" />
                  <div>
                    {isEditing ? (
                      <input
                        id="input-char-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="font-sans font-bold text-sm p-1.5 border border-art-border rounded bg-art-card focus:outline-none focus:border-art-charcoal text-art-charcoal"
                        placeholder="Nome do Personagem"
                      />
                    ) : (
                      <h3 className="text-lg font-serif font-bold text-art-charcoal uppercase tracking-wide">{selectedChar.name}</h3>
                    )}
                    <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase mt-1 block">
                      Assoc. ID: {selectedChar.id}
                    </span>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    id="btn-char-edit"
                    onClick={() => handleSelect(selectedChar)}
                    className="bg-art-card hover:bg-art-sidebar text-art-charcoal font-sans font-bold text-xs py-2 px-3 border border-art-border rounded flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer uppercase tracking-wider"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Editar Ficha
                  </button>
                ) : (
                  <button
                    id="btn-char-save"
                    onClick={handleSave}
                    className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2 px-4.5 rounded flex items-center gap-1.5 transition-all shadow-xs cursor-pointer uppercase tracking-wider"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Salvar Mudanças
                  </button>
                )}
              </div>

              {/* Dynamic Profiles fields inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Archetype selector/input */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1.5">
                    Arquétipo Psicológico (McCloud e Truby)
                  </label>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <select
                        id="select-char-archetype"
                        value={archetype}
                        onChange={(e) => setArchetype(e.target.value)}
                        className="w-full font-sans text-xs p-2.5 bg-art-card border border-art-border rounded focus:outline-none text-art-charcoal focus:border-art-charcoal font-semibold"
                      >
                        {archetypeSuggestions.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <input
                        id="input-char-archetype-custom"
                        type="text"
                        value={archetype}
                        onChange={(e) => setArchetype(e.target.value)}
                        placeholder="Algum outro arquétipo personalizado..."
                        className="w-full font-sans text-xs p-2.5 bg-art-card border border-art-border rounded focus:outline-none focus:border-art-charcoal text-art-charcoal"
                      />
                    </div>
                  ) : (
                    <p className="bg-art-card border border-art-border p-3 text-xs text-art-charcoal font-mono uppercase tracking-wide rounded">
                      {selectedChar.archetype || "Operante sem arquétipo definido"}
                    </p>
                  )}
                </div>

                {/* Profile detail fields */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Desejo Conectado (Objetivo)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-objective"
                      rows={2}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.objective}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Fraqueza Interna (Falha Moral)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-weakness"
                      rows={2}
                      value={weakness}
                      onChange={(e) => setWeakness(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.weakness}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    O Fantasma Íntimo (Medo profundo)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-fear"
                      rows={2}
                      value={fear}
                      onChange={(e) => setFear(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.fear}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Personalidade Geral (Traços)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-personality"
                      rows={2}
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.personality}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Aparência Corporal e Trajes Visualizados
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-appearance"
                      rows={2}
                      value={appearance}
                      onChange={(e) => setAppearance(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.appearance}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Gesticulação Corporal (Acting)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-body"
                      rows={2}
                      value={bodyLanguage}
                      onChange={(e) => setBodyLanguage(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.bodyLanguage || "Não detalhado na curadoria corporal."}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Expressões Faciais Marcantes
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-expressions"
                      rows={2}
                      value={expressions}
                      onChange={(e) => setExpressions(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.expressions || "Não delimitado estatisticamente."}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Relações com o Elenco (Aliados, Rivais e Dinâmicas)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-relations"
                      rows={2}
                      value={relations}
                      onChange={(e) => setRelations(e.target.value)}
                      placeholder="Descreva as conexões com outros personagens, aliados, rivais..."
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.relations || "Sem conexões declaradas com outros membros."}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase tracking-widest mb-1">
                    Mudança Interna (Arco Dramático)
                  </label>
                  {isEditing ? (
                    <textarea
                      id="input-char-journey"
                      rows={2}
                      value={emotionalJourney}
                      onChange={(e) => setEmotionalJourney(e.target.value)}
                      className="w-full font-sans text-xs p-2.5 border border-art-border rounded bg-art-card text-art-charcoal focus:outline-none focus:border-art-charcoal"
                    />
                  ) : (
                    <p 
                      onClick={() => setIsEditing(true)}
                      className="bg-art-card border border-art-border p-3 text-xs text-stone-750 font-serif leading-relaxed rounded min-h-[50px] shadow-3xs cursor-pointer hover:border-art-charcoal hover:bg-art-sidebar/10 transition-all"
                      title="Clique para editar este campo"
                    >
                      {selectedChar.emotionalJourney || "Sem transformações assinaladas."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-stone-500 text-center font-serif italic">
              <UserCircle className="h-12 w-12 text-stone-300 mb-2" />
              <p className="text-sm font-bold text-art-charcoal">Nenhum integrante selecionado</p>
              <p className="text-xs text-stone-500 mt-1">Cadastre a ficha de seus heróis e vilões na barra esquerda para vê-la aqui em profundidade.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
