import React, { useState } from "react";
import { AUTHORS_DATA } from "../data/authors";
import { AuthorProfile } from "../types";
import { BookOpen, Award, Sparkles, HelpCircle, Layers, Quote, GraduationCap, Search, X } from "lucide-react";

interface EduCenterProps {
  onApplyReference?: (theory: string) => void;
}

export default function EduCenter({ onApplyReference }: EduCenterProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorProfile>(AUTHORS_DATA[0]);
  const [activeTab, setActiveTab] = useState<"THEORISTS" | "LESSONS">("THEORISTS");
  const [selectedLesson, setSelectedLesson] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const microLessons = [
    {
      title: "Como planejar o Ritmo da Página (Pacing)",
      category: "Estrutura Visual",
      authorLink: "Will Eisner & Brian Michael Bendis",
      desc: "O ritmo da leitura é controlado pelo número e tamanho dos quadros. Saiba como dilatar o tempo visual.",
      steps: [
        "Mais quadros por página aceleram a velocidade que o cérebro interpreta o tempo decorrido.",
        "Quadros maiores e panorâmicos forçam o leitor a desacelerar a vista para contemplar detalhes.",
        "A Descompressão Narrativa consiste em dar páginas silenciosas completas a momentos cruciais de tensão.",
        "Em momentos de ação de tirar o fôlego, use grades verticais desalinhadas para criar instabilidade."
      ],
      tip: "Deixe pelo menos uma página dupla ou Splash Page para o clímax emocional da história, permitindo que a arte fale mais alto que o diálogo."
    },
    {
      title: "Como criar ganchos dramáticos (Cliffhangers)",
      category: "Narrativa Técnica",
      authorLink: "Blake Snyder & Frank Miller",
      desc: "Fazer o leitor virar a página com ansiedade é o principal trabalho de um escritor de quadrinhos periódicos.",
      steps: [
        "Termine sempre as páginas ímpares (que ficam na direita de quem lê) com uma pergunta visual, choque ou revelação inacabada.",
        "Em tirinhas de humor de 3 ou 4 quadros, o terceiro quadro funciona como preparação e o quarto como Punchline rápida.",
        "Introduza um elemento misterioso ou perigo iminente bem no último painel antes da virada da fone.",
        "Diferencie ganchos físicos (ameaças e explosões) de ganchos emocionais (traições e descobertas morais)."
      ],
      tip: "Pense na virada física da página de papel ou na rolagem da tela como o clique mais importante do seu storytelling."
    },
    {
      title: "O uso magistral do Silêncio Narrativo",
      category: "Storytelling Emocional",
      authorLink: "Frank Miller & Scott McCloud",
      desc: "Quase todos os roteiristas profissionais escrevem balões demais. Experimente deixar a imagem trabalhar autonomamente.",
      steps: [
        "O silêncio absoluto aumenta a sensação de solidão, claustrofobia, mistério ou violência súbita.",
        "Transições 'Momento-a-Momento' silenciosas ajudam a descrever ações delicadas ou passagens curtas de segundos.",
        "Sons ambientes devem ser representados como onomatopeias integradas ao cenário de forma gráfica para preencher o silêncio sem necessitar de narradores escritos.",
        "Substitua monólogos internos óbvios por ações simples do personagem (ex: em vez de dizer 'estou triste', mostre-o encarando um copo vazio)."
      ],
      tip: "Desafie-se a escrever pelo menos uma sequência de 4 quadros seguidos onde o texto seja absolutamente zero, deixando que a decupagem de closes descreva a emoção."
    },
    {
      title: "Como diagramar uma cena de Humor e Sensibilidade",
      category: "Identidade Popular",
      authorLink: "Mauricio de Sousa & Ziraldo",
      desc: "Histórias leves exigem clareza imediata e empatia com expressões infantis.",
      steps: [
        "A clareza narrativa vem em primeiro lugar: evite diagramações complexas de quadros sobrepostos; prefira grades lineares limpas.",
        "Trabalhe exaustivamente as expressões faciais exageradas: olhos bem arregalados, bocas em caracol e bochechas coradas.",
        "Integre letras rítmicas e gags físicas nas quais os brinquedos ou tombos parecem elásticos e engraçados.",
        "Dê leveza ao conflito concentrando-se nos afetos cotidianos reais e fáceis de reconhecer por toda a família."
      ],
      tip: "O humor das crianças surge da enorme importância que elas dão a pequenos problemas da rotina (um brinquedo quebrado, um banho omitido)."
    },
    {
      title: "Como escrever uma boa página",
      category: "Estrutura Literária",
      authorLink: "Brian Michael Bendis & Alan Moore",
      desc: "A página é a unidade básica de medida do quadrinho. Entenda como dosar a quantidade de eventos, quadros e texto para não sobrecarregar o leitor.",
      steps: [
        "Não passe de 5 ou 6 quadros por página para manter a clareza e o impacto visual da narrativa.",
        "Mantenha o limite de 35 palavras por balão e no máximo 150 palavras totais por página.",
        "Cada página deve focar em um único evento dramático ou progressão clara de ação.",
        "Garanta que a primeira e a última ação da página criem uma conexão de causa e efeito imediata."
      ],
      tip: "Se uma página tem diálogo demais, ela perde poder visual. Se tem ação demais, pode ficar confusa. Busque o equilíbrio perfeito entre o verbal e o visual."
    },
    {
      title: "Como criar suspense",
      category: "Storytelling Emocional",
      authorLink: "Alfred Hitchcock & Neil Gaiman",
      desc: "O suspense nos quadrinhos é a arte de controlar a informação visual. Dê ao leitor mais informação do que os personagens possuem.",
      steps: [
        "Use transições Momento-a-Momento para desacelerar o tempo e criar uma contagem regressiva visual.",
        "Reduza a iluminação e use sombras pesadas (Chiaroscuro) para esconder detalhes cruciais nos cantos dos quadros.",
        "Mostre a ameaça se aproximando em um plano geral enquanto o personagem está de costas em Close-up.",
        "Aproveite a sarjeta (espaço entre quadros) para sugerir que algo terrível aconteceu no intervalo de tempo."
      ],
      tip: "O verdadeiro suspense não está na revelação do monstro, mas nos quadros que mostram a sombra dele crescendo na parede sob o olhar aterrorizado da vítima."
    },
    {
      title: "Como criar impacto visual",
      category: "Técnica de Composição",
      authorLink: "Jack Kirby & Frank Miller",
      desc: "Aprenda a guiar a visão do leitor para o centro dinâmico do painel usando perspectiva exagerada e linhas de força.",
      steps: [
        "Use linhas de ação diagonais ativas para sugerir velocidade, colisão e impacto físico.",
        "Desenhe elementos ou personagens saindo das bordas dos quadros (sangramento) para invadir o espaço de leitura.",
        "Aplique silhuetas de alto contraste para dar dramaticidade e isolar formas geométricas marcantes.",
        "Explore o contra-plongée (câmera baixa olhando para cima) para dar imponência e gigantismo ao foco do quadro."
      ],
      tip: "O impacto visual forte nasce do contraste. Se todos os quadros forem explosivos, nenhum será. Guarde a energia máxima para os quadros de página inteira (Splash Pages)."
    },
    {
      title: "Como diagramar uma cena",
      category: "Estrutura Visual",
      authorLink: "Will Eisner & Scott McCloud",
      desc: "A diagramação dos quadros define a ordem e a velocidade da leitura. Monte layouts que facilitem o fluxo visual natural de quem lê.",
      steps: [
        "Mantenha um fluxo de leitura em 'Z' (esquerda para a direita, cima para baixo) para evitar que o leitor se perca.",
        "Use sarjetas mais largas para indicar passagens maiores de tempo, ou elimine-as para dar velocidade e simultaneidade.",
        "Incline as divisórias dos quadros (sarjetas diagonais) para transmitir dinamismo e urgência em cenas de ação.",
        "Posicione os balões de fala de forma a criar um ziguezague que guie os olhos do leitor através da arte do quadro."
      ],
      tip: "A moldura do quadro não é uma parede de concreto. Deixe que elementos da arte (como uma mão ou uma espada) cruzem os limites do quadro para unificar a página."
    }
  ];

  const filteredAuthors = AUTHORS_DATA.filter((author) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      author.name.toLowerCase().includes(query) ||
      author.famousWork.toLowerCase().includes(query) ||
      author.theoryTitle.toLowerCase().includes(query) ||
      author.philosophy.toLowerCase().includes(query) ||
      author.details.toLowerCase().includes(query) ||
      author.fundamentals.some((fund) => fund.toLowerCase().includes(query))
    );
  });

  const filteredLessons = microLessons.filter((lesson) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.category.toLowerCase().includes(query) ||
      lesson.authorLink.toLowerCase().includes(query) ||
      lesson.desc.toLowerCase().includes(query) ||
      lesson.steps.some((step) => step.toLowerCase().includes(query)) ||
      lesson.tip.toLowerCase().includes(query)
    );
  });

  const currentAuthorData = (selectedAuthor && filteredAuthors.some((a) => a.name === selectedAuthor.name))
    ? selectedAuthor
    : filteredAuthors[0] || null;

  const currentLessonData = (selectedLesson !== null && filteredLessons.some((l) => l.title === microLessons[selectedLesson]?.title))
    ? microLessons[selectedLesson]
    : filteredLessons[0] || null;

  return (
    <div id="edu-center" className="bg-art-card border border-art-border rounded p-6 max-w-7xl mx-auto shadow-sm text-xs">
      {/* Target header info to explain purpose */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-art-border pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-art-charcoal tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-art-charcoal" />
            Sistema Educacional & Clássicos do Roteiro
          </h2>
          <p className="text-stone-600 text-xs italic mt-1 font-serif">
            Estude os fundamentos da nona arte e as teorias dos maiores dramaturgos e quadrinistas enquanto cria sua história profissional.
          </p>
        </div>
        <div className="flex bg-art-sidebar p-1 rounded border border-art-border">
          <button
            id="tab-theorists"
            onClick={() => setActiveTab("THEORISTS")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === "THEORISTS" 
                ? "bg-art-charcoal text-art-bg shadow-sm" 
                : "text-stone-600 hover:text-art-charcoal"
            }`}
          >
            Enciclopédia de Referências
          </button>
          <button
            id="tab-lessons"
            onClick={() => setActiveTab("LESSONS")}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === "LESSONS" 
                ? "bg-art-charcoal text-art-bg shadow-sm" 
                : "text-stone-600 hover:text-art-charcoal"
            }`}
          >
            Microaulas Práticas
          </button>
        </div>
      </div>

      {/* Unified Search Bar */}
      <div id="educenter-search-box" className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-stone-500" />
        </div>
        <input
          id="educenter-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeTab === "THEORISTS"
              ? "Pesquisar artistas, obras ou teorias..."
              : "Pesquisar microaulas, técnicas, categorias..."
          }
          className="w-full text-xs pl-9 pr-8 py-2.5 bg-art-sidebar/40 border border-art-border rounded focus:outline-hidden focus:ring-1 focus:ring-art-charcoal/50 text-stone-900 placeholder:text-stone-500/75 shadow-3xs transition-all font-sans"
        />
        {searchQuery && (
          <button
            id="btn-clear-educenter-search"
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-art-charcoal cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {activeTab === "THEORISTS" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Selector Sidebar */}
          <div className="lg:col-span-4 max-h-[550px] overflow-y-auto pr-2 space-y-1.5 scrollbar-thin scrollbar-thumb-stone-300">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-stone-550 uppercase mb-2 pl-2 flex justify-between items-center">
              <span>Teóricos e Artistas</span>
              {searchQuery && (
                <span className="text-[9px] lowercase font-normal italic text-stone-500">
                  {filteredAuthors.length} resultados
                </span>
              )}
            </h3>
            {filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => {
                const originalIndex = AUTHORS_DATA.findIndex((a) => a.name === author.name);
                const isSelected = currentAuthorData?.name === author.name;
                return (
                  <button
                    id={`btn-author-${originalIndex}`}
                    key={author.name}
                    onClick={() => setSelectedAuthor(author)}
                    className={`w-full text-left p-2.5 rounded transition-all flex items-center justify-between border-l-2 cursor-pointer ${
                      isSelected
                        ? "border-art-charcoal bg-art-sidebar text-art-charcoal font-bold shadow-xs"
                        : "border-transparent text-stone-600 hover:bg-art-sidebar/50 hover:text-art-charcoal"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? "bg-art-charcoal text-art-bg"
                          : "bg-art-sidebar text-art-charcoal border border-art-border"
                      }`}>
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-sans font-semibold text-xs uppercase tracking-wider leading-tight text-art-charcoal">{author.name}</h4>
                        <p className="text-[10px] font-serif text-stone-500 italic mt-0.5 leading-none">
                          {author.isComicSpecific ? "Mestre de Quadrinhos" : "Teórico de Storytelling"}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-art-charcoal"></span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-stone-500 bg-art-sidebar/10 border border-dashed border-art-border rounded italic font-serif text-xs">
                Nenhum teórico ou artista encontrado para esta busca.
              </div>
            )}
          </div>

          {/* Theoretical Deep-Dive Showcase */}
          <div className="lg:col-span-8 bg-art-sidebar/20 border border-art-border rounded p-6 flex flex-col justify-between min-h-[400px]">
            {currentAuthorData ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest uppercase bg-art-charcoal text-art-bg">
                      {currentAuthorData.isComicSpecific ? "Fundamento de Quadrinhos" : "Fundamento Dramático"}
                    </span>
                    <h3 className="text-2.5xl font-serif font-bold text-art-charcoal mt-2.5 leading-tight">{currentAuthorData.name}</h3>
                    <p className="text-stone-600 text-xs italic mt-1 flex items-center gap-1.5 font-serif">
                      <BookOpen className="h-3.5 w-3.5 inline text-stone-550" />
                      Obra Célebre: <strong className="text-art-charcoal">{currentAuthorData.famousWork}</strong>
                    </p>
                  </div>
                  <div className="hidden sm:flex h-12 w-12 bg-art-card rounded border border-art-border items-center justify-center text-art-charcoal">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                {/* Central Quote box */}
                <div className="bg-art-card border border-art-border rounded p-5 shadow-3xs relative overflow-hidden pl-10 pr-6 py-4">
                  <Quote className="h-6 w-6 text-stone-300 absolute left-3 top-3" />
                  <p className="text-stone-750 italic text-sm leading-relaxed relative z-10 font-serif">
                    "{currentAuthorData.philosophy}"
                  </p>
                </div>

                {/* Fundamentals checklist */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-art-charcoal tracking-widest uppercase flex items-center gap-1.5">
                    <Layers className="h-4 w-4" />
                    Conceitos e Pilares Fundamentais:
                  </h4>
                  <ul className="space-y-2.5">
                    {currentAuthorData.fundamentals.map((fund, i) => (
                      <li key={i} className="text-xs text-stone-750 flex items-start gap-2.5">
                        <span className="h-4 w-4 rounded-full bg-art-charcoal text-art-bg font-mono font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{fund}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deep research text representation */}
                <div className="border-t border-art-border pt-4 mt-2">
                  <h4 className="text-[10px] font-mono font-bold text-stone-550 tracking-widest uppercase mb-2">
                    Diretriz de Aplicação Curatorial:
                  </h4>
                  <p className="text-xs text-stone-650 leading-relaxed bg-art-card border border-art-border p-3 rounded font-serif italic">
                    {currentAuthorData.details}
                  </p>
                </div>

                {/* Quick action button */}
                {onApplyReference && (
                  <div className="mt-6 pt-4 border-t border-art-border flex justify-end">
                    <button
                      id="btn-apply-theory"
                      onClick={() => onApplyReference(`${currentAuthorData.name} - ${currentAuthorData.theoryTitle}`)}
                      className="bg-art-charcoal hover:bg-stone-850 text-art-bg font-sans font-bold text-xs py-2.5 px-5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                      Aplicar Filosofia de {currentAuthorData.name} no Projeto Ativo
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-stone-450 p-8">
                <HelpCircle className="h-12 w-12 text-stone-300 mb-2 animate-bounce" />
                <p className="text-sm font-serif italic text-stone-550">Selecione ou pesquise um teórico válido.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Lessons View */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-3">
            <h3 className="text-[10px] font-mono font-bold tracking-widest text-stone-550 uppercase mb-2 flex justify-between items-center">
              <span>Selecione uma Microaula:</span>
              {searchQuery && (
                <span className="text-[9px] lowercase font-normal italic text-stone-500">
                  {filteredLessons.length} resultados
                </span>
              )}
            </h3>
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => {
                const originalIdx = microLessons.findIndex((l) => l.title === lesson.title);
                const isSelected = currentLessonData?.title === lesson.title;
                return (
                  <button
                    id={`btn-lesson-${originalIdx}`}
                    key={lesson.title}
                    onClick={() => setSelectedLesson(originalIdx)}
                    className={`w-full text-left p-4 rounded transition-all border cursor-pointer ${
                      isSelected
                        ? "bg-art-sidebar border-art-charcoal text-art-charcoal font-semibold shadow-xs"
                        : "bg-art-card border-art-border text-stone-650 hover:bg-art-sidebar/50 hover:text-art-charcoal"
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-art-bg bg-art-charcoal px-2 py-0.5 rounded">
                      {lesson.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm mt-3 text-art-charcoal leading-tight">{lesson.title}</h4>
                    <p className="text-xs text-stone-500 mt-1.5 line-clamp-2">{lesson.desc}</p>
                    <span className="text-[10px] font-serif italic text-stone-500 mt-2 block col-span-full">
                      Referencial: {lesson.authorLink}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-stone-500 bg-art-sidebar/10 border border-dashed border-art-border rounded italic font-serif text-xs">
                Nenhuma microaula prática encontrada para esta busca.
              </div>
            )}
          </div>

          {/* Lesson Deep Dive content Card */}
          <div className="md:col-span-7 bg-art-sidebar/10 border border-art-border rounded p-6">
            {currentLessonData ? (
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-art-bg bg-art-charcoal px-2.5 py-0.5 rounded">
                  {currentLessonData.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-art-charcoal mt-2">
                  {currentLessonData.title}
                </h3>
                <p className="text-xs text-stone-500 italic mt-0.5 leading-relaxed font-serif">
                  Doutrina visual: {currentLessonData.authorLink}
                </p>

                <p className="text-xs text-stone-700 leading-relaxed bg-art-card border border-art-border p-4 rounded font-serif italic">
                  {currentLessonData.desc}
                </p>

                <div className="space-y-3 mt-4">
                  <h4 className="text-[10px] font-mono font-bold text-art-charcoal tracking-widest uppercase">
                    Etapas e Passos Técnicos de Prática:
                  </h4>
                  {currentLessonData.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex gap-2.5 items-start bg-art-card p-3 rounded border border-art-border">
                      <div className="h-5 w-5 rounded bg-art-charcoal text-art-bg font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {stepIdx + 1}
                      </div>
                      <p className="text-xs text-stone-750 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-art-sidebar border border-art-border rounded mt-4">
                  <h5 className="text-[10px] font-mono font-bold text-art-charcoal flex items-center gap-1.5 mb-1.5 uppercase tracking-wide">
                    <Sparkles className="h-3.5 w-3.5 text-stone-700" />
                    Dica de Ouro de Curadoria:
                  </h5>
                  <p className="text-xs text-stone-800 italic leading-relaxed font-serif">
                    "{currentLessonData.tip}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 p-8">
                <GraduationCap className="h-12 w-12 text-stone-300 mb-2 animate-pulse" />
                <p className="text-sm">Selecione uma microaula para ler os detalhes técnicos de estruturação.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
