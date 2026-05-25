import { AuthorProfile } from "../types";

export const AUTHORS_DATA: AuthorProfile[] = [
  {
    name: "Robert McKee",
    isComicSpecific: false,
    famousWork: "Story: Substância, Estrutura, Estilo e os Princípios da Escrita de Roteiro",
    theoryTitle: "Teoria da Estrutura Dramática",
    fundamentals: [
      "Estrutura dramática clássica baseada em conflitos crescentes.",
      "O protagonista é motivado por um desejo consciente e um desejo inconsciente.",
      "Pontos de virada (Inciting Incident, Climax, Resolution) mudam o valor da vida do personagem do positivo para o negativo, ou vice-versa.",
      "Progressão emocional do público depende do ritmo e causalidade das cenas.",
      "Princípio da causa e efeito: eventos casuais devem gerar consequências inevitáveis."
    ],
    philosophy: "A história não é uma fuga da realidade, mas uma busca para encontrar a ordem no caos da existência.",
    details: "McKee foca na profundidade literária do arco dramático. Ele propõe que cada cena deve conter uma mudança de 'valor' para ser considerada narrativa útil. Se uma cena começa em estado neutro ou feliz e termina sem alteração, ela é descritiva e não dramática. Aplicado às HQs, isso ensina que cada página da história deve movimentar a jornada do herói ou alterar as dinâmicas de poder e sentimentos a cada quadro.",
    imageAlt: "Robert McKee"
  },
  {
    name: "Blake Snyder",
    isComicSpecific: false,
    famousWork: "Save the Cat! (Salve o Gato!) - A Última Palavra Sobre Escrita de Roteiros",
    theoryTitle: "O Beat Sheet Simplificado",
    fundamentals: [
      "Fórmula de 15 pontos de batidas (Beat Sheet) para organizar narrativas dinâmicas.",
      "A cena 'Save the Cat' estabelece empatia imediata pelo protagonista (fazendo-o agir de forma nobre).",
      "Estrutura rígida de 3 atos divididos com marcos temporais previsíveis.",
      "Momentos-chave: Catalyst, Break into Two, Midpoint, All is Lost e Dark Night of the Soul.",
      "Estímulo ao ritmo comercial e ganchos constantes."
    ],
    philosophy: "Escrever roteiro é como desenhar um projeto de engenharia; se as fundações são sólidas, a casa inteira se sustenta.",
    details: "Blake Snyder estruturou um mapa ágil que é perfeito para criar roteiros dinâmicos no formato de 3 atos. Em quadrinhos, as batidas como 'Opening Image' (primeira página, estabelecendo o tom inicial) e o 'Catalyst' (o incidente incitador que quebra a rotina) são ferramentas cruciais para capturar o leitor e planejar o número e ritmo de páginas necessárias antes do desenhista iniciar a arte.",
    imageAlt: "Blake Snyder"
  },
  {
    name: "John Truby",
    isComicSpecific: false,
    famousWork: "A Anatomia da História: 22 Passos para Se Tornar um Roteirista de Sucesso",
    theoryTitle: "Desenvolvimento Orgânico e Rede de Personagens",
    fundamentals: [
      "Rejeição da fórmula mecânica de 3 atos em prol de um crescimento orgânico interno da trama.",
      "União intrínseca entre o Tema, a Moral e o Design dos Personagens.",
      "Rede de Personagens: Cada antagonista e coadjuvante existe para forçar o protagonista a encarar sua fraqueza moral.",
      "O conflito nasce de desejos incompatíveis entre o herói e seus oponentes.",
      "Autorrevelação (Self-Revelation): O clímax é caracterizado por um aprendizado ético brutal por parte do herói."
    ],
    philosophy: "Uma grande história é um organismo vivo que cresce a partir de um núcleo moral e se expande através das escolhas dos personagens.",
    details: "Truby propõe que o herói deve começar com uma Fraqueza (Weakness) e uma Necessidade psicológica e moral (Need). O oponente principal (Opponent) deve competir pelo mesmo Objetivo (Goal) que o herói. No planejamento de HQs e canais longos (Graphic Novels), as ferramentas de Truby ajudam a estruturar o simbolismo visual oculto por trás do design e a criar redes ricas de interação entre herói, aliados e vilões.",
    imageAlt: "John Truby"
  },
  {
    name: "Scott McCloud",
    isComicSpecific: true,
    famousWork: "Desvendando os Quadrinhos (Understanding Comics)",
    theoryTitle: "Linguagem e Transições entre Quadros",
    fundamentals: [
      "Definição da 'Arte Sequencial' e o mecanismo psicológico do Fechamento (Closure) no 'sarjeta' (espaço entre os quadros).",
      "As seis categorias de transições de quadros: Momento-a-Momento, Ação-a-Ação, Tema-a-Tema, Cena-a-Cena, Aspecto-a-Aspecto, Non-sequitur.",
      "Teoria do Tempo Visual: O tamanho, a forma e a disposição física dos painéis controlam o tempo de leitura.",
      "Relação sinérgica de simbiose entre imagem e texto (dupla narrativa).",
      "Iconografia e simplificação como caminho para a empatia universal."
    ],
    philosophy: "Quadrinhos são um meio visual onde o espaço físico é convertido diretamente em tempo mental.",
    details: "Scott McCloud revolucionou a didática das HQs explicando como o leitor preenche as lacunas entre quadros (Sarlejas/Gutters). Ao escolher o tipo de transição mais adequado, o roteirista dita se a leitura será rápida (Ação para Ação) ou contemplativa e atmosférica (Aspecto para Aspecto, comum em mangás). Compreender essas transições é a base para o controle refinado do pacing e ritmo de leitura.",
    imageAlt: "Scott McCloud"
  },
  {
    name: "Will Eisner",
    isComicSpecific: true,
    famousWork: "Narrativas Gráficas e Quadrinhos (Graphic Storytelling and Visual Narrative)",
    theoryTitle: "Narrativa Sequencial e Encenação Visual",
    fundamentals: [
      "Criação e consolidação do termo 'Graphic Novel' como literatura de arte sequencial.",
      "Composição de página revolucionária: uso de elementos cenográficos como molduras de quadros (janelas, escadas, chuva).",
      "Direção de olhar ativa do leitor usando diagonais e peso de tintas na diagramação.",
      "Expressividade gráfica humana: anatomia e linguagem corporal dramáticas para substituir redundâncias nos textos.",
      "O uso da ambientação urbana e arquitetônica como projeção psicológica do drama dos personagens."
    ],
    philosophy: "O quadrinho não é apenas um casamento de imagem e texto, mas um idioma inteiramente novo que exige leitura sequencial integrada.",
    details: "Eisner ensina a usar a página inteira como uma unidade visual expressiva. Suas inovações em 'The Spirit' provaram que os limites do quadrinho são flexíveis e elásticos. Um bom roteiro eisneriano fornece instruções claras ao desenhista sobre como a própria moldura e a arquitetura das cenas podem atuar no storytelling emocional e guiar o foco dos olhos do leitor.",
    imageAlt: "Will Eisner"
  },
  {
    name: "Brian Michael Bendis",
    isComicSpecific: true,
    famousWork: "Words for Pictures: The Art and Business of Writing Comics and Graphic Novels",
    theoryTitle: "Escrita Prática e Descompressão Narrativa",
    fundamentals: [
      "Diálogos realistas e rítmicos marcados por hesitações, interrupções e gírias modernas.",
      "A importância extrema das linhas de comunicação claras entre o roteirista e o artista gráfico no roteiro completo.",
      "Uso de 'Descompressão Narrativa' (decompression), desacelerando o tempo e dedicando páginas adicionais a momentos de tensão silenciosa ou ação silenciosa.",
      "Economia expressiva de diálogos: permitir que os rostos dos personagens substituam longas recapitulações de texto.",
      "Roteiro no formato Full Script americano."
    ],
    philosophy: "O melhor texto em um quadrinho é aquele que sabe quando abrir espaço e deixar o artista desenhar de forma espetacular.",
    details: "Bendis prioriza a química naturalista e o ritmo acelerado das palavras. Seu trabalho na Marvel e DC provou que diálogos repletos de subtexto atraem leitores modernos. O 'Bendis Speak' foca na oralidade espontânea. Ele define o papel do roteirista de HQ como um co-criador responsável por alimentar o artista com ações cênicas fáceis de traduzir em arte impactante.",
    imageAlt: "Brian Michael Bendis"
  },
  {
    name: "Frank Miller",
    isComicSpecific: true,
    famousWork: "Sin City, Batman: Batman - O Cavaleiro das Trevas, Demolidor",
    theoryTitle: "Narrativa Noir, Alto Contraste e Ritmo Intenso",
    fundamentals: [
      "Visual dominado por silhuetas e forte contraste noir (claro-escuro/chiaroscuro).",
      "Utilização de monólogos internos poéticos e duros no estilo 'Hard-Boiled'.",
      "Narrativa visual silenciosa de ritmo frenético com sequências de ação limpas e cinéticas.",
      "Interseção ativa da linguagem de quadrinhos com técnicas de montagem cinematográfica.",
      "Desconstrução de mitos através de tons adultos, dramáticos e satíricos."
    ],
    philosophy: "A verdade se esconde nas sombras. O visual deve arrancar tudo que é calmo e deixar apenas a violência dramática do preto e do branco.",
    details: "Miller moldou a linguagem da HQ adulta nos anos 80. Ele dominou a técnica de expressar angústia e suspense usando grids geométricos de quadros repetitivos ritmados por pequenas mudanças de ângulo de câmera. Seus roteiros são quase partituras de ritmo visual, guiando o silêncio dramático, o impacto bruto e o foco cerrado.",
    imageAlt: "Frank Miller"
  },
  {
    name: "Stan Lee",
    isComicSpecific: true,
    famousWork: "A Criação do Universo Marvel (Homem-Aranha, X-Men, Quarteto Fantástico, Vingadores)",
    theoryTitle: "O Método Marvel (Marvel Method) e Criação Dinâmica",
    fundamentals: [
      "Invenção do 'Método Marvel': Roteirista fornece apenas a sinopse/plot básico; desenhista planeja e desenha as páginas de forma fluida; o roteirista escreve os balões por cima da arte final.",
      "Personagens profundamente falhos e humanizados com problemas reais do cotidiano.",
      "Diálogos melodramáticos e expressivos, engajando diretamente com os leitores.",
      "Foco na ação dinâmica e flexibilidade extrema durante o processo colaborativo.",
      "Construção orgânica do universo compartilhado expandido."
    ],
    philosophy: "Com grandes poderes vêm grandes responsabilidades. E heróis de verdade comem, choram, têm contas a pagar e brigam perto de casa.",
    details: "Stan Lee mudou a indústria ao descentralizar a criação rígida do roteiro. O 'Método Marvel' permitiu que gênios visuais como Jack Kirby e Steve Ditko fizessem a decupagem de quadros com liberdade máxima. Isso gerou um estilo dinâmico onde o desenhista co-escrevia as páginas com posicionamento ativo, dando mais velocidade à produção de quadrinhos da era de prata.",
    imageAlt: "Stan Lee"
  },
  {
    name: "Jack Kirby",
    isComicSpecific: true,
    famousWork: "O Rei dos Quadrinhos (Quarteto Fantástico, Novos Deuses, Thor)",
    theoryTitle: "Narrativa Visual Explosiva e Composições Cósmicas",
    fundamentals: [
      "Design de quadros focado no máximo impacto visual e escorço exagerado dos corpos em movimento.",
      "Criação das 'Kirby Crackles' e representações gráficas abstratas de pura energia cósmica e ficção tecnológica.",
      "Composição triangular e perspectivas forçadas que parecem saltar para fora da página física.",
      "Ritmo sequencial furioso focado em ação em escala mítica e gigantismo cenográfico.",
      "Ação com saltos espaciais dramáticos e perspectivas heroicas épicas."
    ],
    philosophy: "Você precisa colocar todo seu coração, músculo e energia no papel para fazer cada imagem berrar força vital ao leitor.",
    details: "Conhecido como 'O Rei', Jack Kirby estabeleceu os códigos visuais das lutas e da espacialidade heróica nas HQs americanas. Ele não desenhava focado apenas no realismo anatômico ordinário, mas usava distorções musculares dramáticas e perspectivas dinâmicas e forçadas para dar às lutas e voos um senso de movimento que nenhuma câmera cinematográfica conseguia imitar na época.",
    imageAlt: "Jack Kirby"
  },
  {
    name: "Mauricio de Sousa",
    isComicSpecific: true,
    famousWork: "Turma da Mônica",
    theoryTitle: "Narrativa Popular Brasileira e Acessibilidade",
    fundamentals: [
      "Desenvolvimento de uma linguagem visual extremamente simples, limpa e legível (clonabilidade de traços e legibilidade universal).",
      "Humor caracterizado pela expressividade facial rápida baseada no folclore e infância brasileira.",
      "Leitura acessível e natural para públicos de todas as idades, com foco didático e no letramento informal.",
      "Criação de marcas e perfis de personalidade fortes altamente memoráveis.",
      "Equilíbrio clássico entre textos e gags de ação rápidas de quatro quadros ou histórias longas divertidas."
    ],
    philosophy: "Contar histórias simples que toquem o coração da família de forma imediata, servindo como uma porta aberta de amor pela leitura cotidianizadora.",
    details: "Mauricio de Sousa fundou um império de entretenimento e educação infantojuvenil no Brasil baseando-se na consistência e na empatia imediata. Suas histórias possuem um ritmo narrativo linear perfeito para iniciantes, onde a linguagem corporal, as piadas expressivas e os conflitos ordinários de bairro geram uma enorme proximidade e diversão atemporal de forma didática.",
    imageAlt: "Mauricio de Sousa"
  },
  {
    name: "Ziraldo",
    isComicSpecific: true,
    famousWork: "O Menino Maluquinho, Flicts, Turma do Pererê",
    theoryTitle: "Sensibilidade, Poesia Visual e Integração Texto-Desenho",
    fundamentals: [
      "Narrativa infantil brasileira lírica e afetuosa com traços soltos e expressivos.",
      "Quebra criativa da barreira rígida entre o texto escrito (letras manuscritas rítmicas) e a ilustração conceitual.",
      "Storytelling focado em emoções fundamentais: solidão, amor, pertencimento, alegria lúdica e sensibilidade de infância.",
      "Humor terno de alto impacto poético e intelectual e design revolucionário de layouts gráficos livres.",
      "Valorização do folclore nativo e da brasilidade de forma inventiva e calorosa."
    ],
    philosophy: "A arte para crianças deve ser livre de amarras estritas, poética e focar na expansão da imaginação através de cores e humor terno.",
    details: "Ziraldo foi o criador de uma das primeiras revistas em quadrinhos brasileiras escritas e desenhadas por um único autor (Turma do Pererê). Ele misturava reflexão filosófica e design gráfico vanguardista nas páginas de forma natural. Com 'O Menino Maluquinho', provou que o quadrinho infantil pode fundir-se com a prosa poética de forma inovadora, oferecendo layouts expressivos onde balões, ilustrações, personagens e cenários se entrelaçam poeticamente no papel.",
    imageAlt: "Ziraldo"
  }
];
