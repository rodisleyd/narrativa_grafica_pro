import { Project } from "../types";

export const PROJECT_TEMPLATES: Project[] = [
  {
    id: "temp-noir",
    settings: {
      title: "O Beco das Sombras",
      format: "GRAPHIC_NOVEL",
      genre: "Noir",
      targetAudience: "Adulto",
      totalPages: 12,
      style: "Alto contraste, monólogo poético duro, sombras expressivas",
      premise: "Um detetive particular desgastado confronta seu passado sob a chuva torrencial de uma metrópole corrompida.",
      theme: "Redenção e a inevitabilidade das escolhas sombrias."
    },
    guidedStructure: {
      protagonist: "Manoel 'Noir' Reis, ex-policial de olhos cansados.",
      desire: "Encontrar a pista definitiva sobre o desaparecimento de sua parceira.",
      obstacle: "A rede de corrupção controlada pelo seu antigo chefe de polícia.",
      mainConflict: "Uma testemunha-chave oferece as provas em troca de proteção contra assassinos de aluguel.",
      risk: "A morte física da única testemunha e a perda moral definitiva de sua dignidade.",
      emotionalTransformation: "De um niilismo destrutivo para um sacrifício heróico de redenção silenciosa."
    },
    structureMethod: "THREE_ACTS",
    structureAnswers: {
      "act1": "Manoel recebe a testemunha em seu escritório sob a fumaça de um cigarro. O beco lá fora chora.",
      "act2": "Perseguição nos telhados sob a chuva. Manoel é encurralado pelos capangas, mas usa a escuridão como escudo.",
      "act3": "Confronto final nas docas. Ele salva a testemunha, elimina as provas que o incriminavam, mas escolhe sumir nas sombras."
    },
    characters: [
      {
        id: "char-manoel",
        name: "Manoel Reis",
        objective: "Redimir-se de um erro do passado protegendo a verdade.",
        fear: "Tornar-se tão corrupto quanto aqueles que ele investiga.",
        weakness: "Alcoolismo sutil e um cinismo amargo que o isola do mundo.",
        personality: "Taciturno, observador profundo, fala pausada com gírias curtas.",
        archetype: "Herói Trágico / Detetive Noir",
        appearance: "Capa de chuva comprida (trenchcoat) ensopada, chapéu abaixado ocultando os olhos, barba de três dias.",
        expressions: "Olhar cortante sob as sombras do chapéu, rosto esculpido por linhas de fadiga.",
        bodyLanguage: "Postura curvada sob a chuva de ombros largos, mãos sempre escondidas nos bolsos da capa.",
        relations: "Sua oponente principal é a cidade em si e seu antigo mentor corrupto.",
        emotionalJourney: "Recuperar o sentido de justiça sacrificando sua segurança."
      }
    ],
    world: {
      era: "Anos 50 alternativo distópico.",
      technology: "Análoga rústica, telefones pesados de baquelite, iluminação urbana amarela piscante.",
      culture: "Ceticismo generalizado, Jazz melancólico tocando em portas de cabarés escuros.",
      politics: "A polícia e o submundo são faces da mesma moeda corporativa.",
      worldRules: "A chuva nunca para; a noite é eterna; a verdade custa caro de ser mantida viva.",
      visualClimate: "Névoa espessa, ruas de paralelepípedos refletindo as luzes de neon enfumaçadas.",
      architecture: "Gótica industrial opressiva, becos claustrofóbicos e escadas de incêndio de metal escuro.",
      references: "Sin City de Frank Miller, O Falcão Maltês, Metrópolis.",
      colorPalette: ["#000000", "#1e293b", "#475569", "#94a3b8", "#ffffff"]
    },
    pages: [
      {
        id: "page-1",
        pageNumber: 1,
        rhythmNotes: "Silêncio ensurdecedor. Ritmo lento para estabelecer angústia e focar no clima úmido.",
        panels: [
          {
            id: "panel-1-1",
            panelNumber: 1,
            framing: "Plano Geral (Splash Page ou Plano de ambientação silencioso)",
            visualDescription: "Um close panorâmico aéreo do beco claustrofóbico de paralelepípedos. A chuva bate forte no chão, criando respingos brancos que quebram o breu total. Uma única silhueta com capa comprida e chapéu fuma sob um poste de luz que pisca fraco.",
            dialogue: "",
            narration: "A cidade não chora por você. Ela chora para afogar os gritos que ninguém quer ouvir.",
            soundEffects: "CHUUUUUUU... TAC... TAC... (pingos persistentes)",
            emotions: "Isolamento, melancolia profunda",
            cameraMovement: "Plongée extremo estático nos dando a sensação de teto opressivo.",
            timeOfScene: "02:14 da madrugada sob neblina pesada.",
            artistNotes: "Use contraste de preto e branco puro (chiaroscuro) no estilo clássico de Frank Miller. Sem tons cinzentos intermediários. Deixe as gotas de chuva desenhadas como linhas brancas afiadas cortando os blocos de preto."
          },
          {
            id: "panel-1-2",
            panelNumber: 2,
            framing: "Close (Foco na expressão escondida)",
            visualDescription: "Foco fechado no perfil de Manoel. A aba do chapéu corta seu rosto ao meio com uma sombra densa. Apenas o brilho fraco e cilíndrico de um cigarro aceso ilumina os lábios serrados e uma cicatriz na bochecha esquerda.",
            dialogue: "",
            narration: "E no beco das sombras, cada gota fria carrega o gosto de um segredo engolido há dez anos.",
            soundEffects: "TSZZZ... (brasa do cigarro)",
            emotions: "Tensão reprimida, amargura",
            cameraMovement: "Panorâmica horizontal bem rente ao rosto.",
            timeOfScene: "Instantes seguintes.",
            artistNotes: "A fumaça do cigarro deve subir em espirais abstratas e estilizadas, funcionando quase como um elemento gráfico que direciona o olhar do leitor para o canto superior direito do quadrinho."
          }
        ]
      }
    ]
  },
  {
    id: "temp-cosmic",
    settings: {
      title: "Deuses do Cosmos",
      format: "HQ_CLASSICA",
      genre: "Ficção científica",
      targetAudience: "Jovem / Geral",
      totalPages: 24,
      style: "Perspectivas explosivas, energia estalante, composições hiperdinâmicas",
      premise: "Duas entidades estelares duelam nos limites de uma galáxia em colapso espiritual.",
      theme: "O preço do orgulho cósmico diante do infinito."
    },
    guidedStructure: {
      protagonist: "Orion, o Tecno-Vanguardista da Nebulosa de Prata.",
      desire: "Acessar a fonte da Matriz Ancestral para restaurar seu sol.",
      obstacle: "O tirano Kronar, que consome sois para alimentar sua armadura negra.",
      mainConflict: "Um choque de energias míticas que pode explodir os quadrantes galácticos.",
      risk: "O esquecimento eterno de bilhões de estrelas e a escravidão cósmica.",
      emotionalTransformation: "De um guerreiro orgulhoso arrogante para um protetor humilde do equilíbrio estelar."
    },
    structureMethod: "HEROS_JOURNEY",
    structureAnswers: {
      "act1": "Orion descobre o colapso e empunha sua Manopla Estelar.",
      "act2": "Incursão nos templos vazios de Kronar, enfrentando hordas cinéticas.",
      "act3": "O choque estelar supremo, onde Orion abre mão de sua própria energia divina para salvar a nebulosa."
    },
    characters: [
      {
        id: "char-orion",
        name: "Orion da Nebulosa",
        objective: "Restaurar os núcleos térmicos de sua constelação de origem.",
        fear: "Estar fadado a flutuar no vácuo eterno como poeira inútil.",
        weakness: "O impeto e orgulho de herói divino que o faz subestimar armadilhas táticas.",
        personality: "Impulsivo, retumbante, autoconfiante extremo, fala altiva e teatral.",
        archetype: "Guerreiro Eterno Estilo Kirby",
        appearance: "Armadura futurista brilhante com linhas douradas expressivas, elmo geométrico vazado de onde emana energia cósmica azulada nos olhos.",
        expressions: "Olhar elétrico de determinação inalcançável, sorriso audaz.",
        bodyLanguage: "Gestos heroicos amplos, escorço dramático com mãos gigantes estendidas para frente projetando fogo de energia.",
        relations: "Arqui-inimigo de Kronar, o devorador de energias.",
        emotionalJourney: "Compreender que o verdadeiro brilho vem de proteger os indefesos, não do poder militar."
      }
    ],
    world: {
      era: "Futuro cósmico místico imemorial.",
      technology: "Tecnologia divina que molda o próprio espaço-tempo com circuitos celestes flutuantes.",
      culture: "Sociedades estelares rituais baseadas no culto térmico das estrelas.",
      politics: "Grandes feudos estelares lutando pela energia remanescente do universo primitivo.",
      worldRules: "As leis da gravidade são elásticas; estrelas moribundas sussurram as profecias do amanhã.",
      visualClimate: "Psicodélico, nebulosas multicoloridas estalando com flashes galácticos.",
      architecture: "Mega-monólitos colossais flutuando no vácuo espacial com símbolos rúnicos iluminados por luz estelar.",
      references: "Jack Kirby (Novos Deuses), Quarteto Fantástico clássico, Stan Lee.",
      colorPalette: ["#0b0410", "#240046", "#3c096c", "#ffd700", "#ffffff"]
    },
    pages: [
      {
        id: "page-1",
        pageNumber: 1,
        rhythmNotes: "Super explosivo, ação de alta octanagem com saltos dinâmicos nos painéis geométricos.",
        panels: [
          {
            id: "panel-2-1",
            panelNumber: 1,
            framing: "Plano Americano / Contra-Plongée dinâmico",
            visualDescription: "Orion salta em direção ao leitor desafiando a gravidade. Sua mão direita, empunhando a Manopla Cósmica, está pesadamente projetada para frente em um escorço extremo e hiperbólico que ultrapassa as bordas físicas do painel. Faíscas e círculos negros de pura energia cósmica (Kirby crackles) cercam sua armadura tectônica.",
            dialogue: "ORION: PELO PODER QUE ARDE NO NÚCLEO CONSTELAR, SEU REINADO ESCURO TERMINA HOJE, KRONAR!",
            narration: "A energia das estrelas mortas explode em uma fúria incompreensível para mentes mortais.",
            soundEffects: "KRAA-BOOOOOMM!!!",
            emotions: "Fúria divina, poder dinâmico, aventura heróica",
            cameraMovement: "Contra-plongée ousado movendo o foco de baixo para cima.",
            timeOfScene: "Colisão sobre o mar de chamas frias da anã branca.",
            artistNotes: "Use a famosa técnica de 'Kirby Crackles' (pequenas esferas pretas que flutuam densamente aglomeradas para representar energia quântica/cósmica extrema). A mão e o soco devem dar a ilusão física de que estão quebrando a página."
          }
        ]
      }
    ]
  },
  {
    id: "temp-strip",
    settings: {
      title: "As Travessuras de Tico e Juju",
      format: "TIRINHAS",
      genre: "Humor",
      targetAudience: "Infantil / Livre",
      totalPages: 1,
      style: "Expressivo, traços leves e arredondados, leitura linear rápida de impacto imediato",
      premise: "Juju tenta ensinar seu gato Tico a se exercitar, mas o animal encontra um atalho preguiçoso.",
      theme: "O eterno pragmatismo sarcástico dos animais domésticos."
    },
    guidedStructure: {
      protagonist: "Juju, uma menina tagarela de 8 anos cheia de energia, e Tico, seu gato gordo e cinza.",
      desire: "Juju quer transformar Tico em um atleta saudável de corrida.",
      obstacle: "A resistência física absoluta do gato em fazer qualquer esforço dinâmico.",
      mainConflict: "Colocar o felino sedentário em movimento usando uma esteira improvisada ou brinquedos.",
      risk: "Tico continuar dormindo 22 horas por dia nas almofadas favoritas da sala.",
      emotionalTransformation: "De mentora empolgada para uma resignação engraçada diante da inteligência preguiçosa dos felinos."
    },
    structureMethod: "STRIP_STRUCTURE",
    structureAnswers: {
      "act1": "Juju introduz a esteira elétrica de brinquedos e amarra um barbante para motivar o gato.",
      "act2": "Tico apenas boceja, encarando o barbante com desdém olímpico.",
      "act3": "Tico dorme deitado sobre a própria esteira flutuando no rolamento lento, divertindo a leitora."
    },
    characters: [
      {
        id: "char-juju",
        name: "Juju",
        objective: "Ensinar hábitos saudáveis e ativos para o seu gato preguiçoso.",
        fear: "Seu gato ficar tão pesado que não consiga mais pular no colo.",
        weakness: "Tagarelice crônica e empolgação desmedida por teorias que lê em livros de escola.",
        personality: "Hiperativa, mandona com ternura, cheia de gestos gesticulantes, ingênua.",
        archetype: "Criança Curiosa Brasileira (Estilo Mônica/Maluquinho)",
        appearance: "Cabelinho castanho amarrado em marias-chiquinhas desgrenhadas, vestido verde limão largo com meias coloridas listradas desalinhadas.",
        expressions: "Sobrancelhas arqueadas de entusiasmo, boca bem aberta ao pregar suas regras.",
        bodyLanguage: "Braços apontados com as mãos na cintura, olhos esbugalhados de paixão pura pelos animais.",
        relations: "Tutora dedicada do gato gordo Tico.",
        emotionalJourney: "Aprender a aceitar as peculiaridades hilárias de seu amado felino."
      }
    ],
    world: {
      era: "Brasil contemporâneo ensolarado.",
      technology: "Utensílios domésticos comuns, brinquedos de plástico coloridos na sala de estar.",
      culture: "Brincadeiras infantis de quintal livre, amor sincero e caloroso pelos pets domésticos.",
      politics: "Amistosa familiar sem grandes burocracias opressivas.",
      worldRules: "As leis da física dos desenhos facilitam tombos leves que apenas geram riso, sem danos corporais.",
      visualClimate: "Luminoso, sombras suaves de aquarela amarela e azul celeste nas bordas da sala confortável.",
      architecture: "Casinha aconchegante de bairro residencial arborizado do interior.",
      references: "Turma da Mônica de Mauricio de Sousa, Menino Maluquinho de Ziraldo.",
      colorPalette: ["#ff7b93", "#ffe770", "#aff8db", "#111111", "#ffffff"]
    },
    pages: [
      {
        id: "page-1",
        pageNumber: 1,
        rhythmNotes: "Exatamente 3 quadros de tamanho idêntico arranjados horizontalmente. Ritmo simples com piada visual no último quadro (punchline).",
        panels: [
          {
            id: "panel-3-1",
            panelNumber: 1,
            framing: "Plano Médio (Estabelecendo a cena com clareza)",
            visualDescription: "Juju está de pé ao lado de uma esteira ergométrica enorme na sala de estar. Ela aponta para o aparelho com um papel enrolado como se fosse uma treinadora esportiva. O gordo gato Tico está sentado no chão, olhando para o aparelho com as pálpebras entediadas pela metade.",
            dialogue: "JUJU: CHEGA DE COCHILAR, TICO! HOJE COMEÇA NOSSO TREINO PARA O GRANDE CAMPEONATO DE CORRIDA DO BAIRRO!",
            narration: "",
            soundEffects: "",
            emotions: "Determinação inocente contra preguiça felina absoluta",
            cameraMovement: "Focalizado de frente no nível dos olhos dos personagens.",
            timeOfScene: "Tarde de sábado ensolarada na sala de estar.",
            artistNotes: "Mantenha o traço do desenho arredondado, limpo, de cores chapadas de giz ou guache para emular a simplicidade terna da escola de Mauricio de Sousa. Os olhos de Juju devem expressar paixão pura."
          },
          {
            id: "panel-3-2",
            panelNumber: 2,
            framing: "Plano Médio (Conflito secundário silencioso)",
            visualDescription: "Juju aperta o botão liga-desliga do aparelho com entusiasmo. A esteira começa a rodar devagar, fazendo barulho metálico 'vruuumm'. Ela coloca Tico na plataforma de borracha em movimento rápida.",
            dialogue: "JUJU: É SÓ SE MANTER EM MOVIMENTO! AS PERNINHAS VÃO FLUIDAS, IGUAL AOS ATLETAS DE ELITE QUE VI NA TV!",
            narration: "",
            soundEffects: "VRUUMMMMM... VRUUMM...",
            emotions: "Esforço inicial, indiferença",
            cameraMovement: "Plano idêntico ao quadro anterior para manter o ritmo sequencial geométrico das tirinhas clássicas.",
            timeOfScene: "Segundos após.",
            artistNotes: "Mostre linhas de vibração suaves indicando que a borracha da esteira está em movimento lento."
          },
          {
            id: "panel-3-3",
            panelNumber: 3,
            framing: "Plano Médio (Punchline visual / Conclusão cômica)",
            visualDescription: "Tico está completamente estendido de barriga para cima deitado na borracha rolante da esteira, sendo levado calmamente em direção à parte traseira do aparelho de forma hilária sem dar um único passo, segurando um biscoito com a pata. Juju está com as mãos na cabeça, com os olhos esbugalhados de frustração cômica enquanto o gato desliza suavemente para fora.",
            dialogue: "JUJU: TICO!!! ISSO SE CHAMA ESPORTISMO, NÃO TAPETE-ROLANTE-PREGUIÇOSO DE COLO!",
            narration: "",
            soundEffects: "FLUP (gato deslizando flácido para o chão)",
            emotions: "Frustração cômica, satisfação folgada do pet",
            cameraMovement: "Plano estático mantendo o eixo horizontal.",
            timeOfScene: "Final da tentativa.",
            artistNotes: "O gato deve estar desenhado de maneira totalmente flácida e fofa, com uma carinha de absoluta felicidade e paz de quem burlou o sistema físico esportivo com maestria felina."
          }
        ]
      }
    ]
  }
];
