import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * TP1 — Tournament Pack 1, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/tp1-tournament-pack-1.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas.
 */
export const TP1_TOURNAMENT_PACK_1_PTBR: CardTranslations = {
  // ── NINJA ──
  "tp1-n-019": {
    text: [
      "[IMPOSTOR!]",
      "Válido: Quando este Ninja for receber qualquer Dano, jogue a Moeda Ninja; se der cara, reduza o Dano em 1.",
    ],
    flavor: "\"He-he! Você está confiante demais, Professor! Foi por isso que não estava pronto para um Ataque de Clones das Sombras, o meu melhor jutsu!\"",
  },
  "tp1-n-024": {
    text: [
      "[DEMÔNIO DA VILA DA NUVEM]",
      "Enquanto este Ninja for o Ninja Líder, descarte todos os Ninjas que receberem Dano do Time deste Ninja.",
    ],
    flavor: "\"Eu sou Zabuza Momochi... 'O Demônio da Névoa Oculta'!!\"",
  },
  "tp1-n-114": {
    text: [
      "[ENCANTADORA DO VENTO]",
      "Os cards de Jutsu do seu oponente que tiverem como alvo um Ninja do Time deste Ninja custam (1) a mais para jogar.",
    ],
    flavor: "\"Não foi grande coisa como luta ... Meio chato...\"",
  },
  "tp1-n-122": {
    text: [
      "[DESCOBRINDO UM PLANO]",
      "Durante a Fase de Missão do seu oponente, você pode negar e descartar 1 card de Missão que esteja sendo jogado. Nesse caso, descarte este Ninja no final do turno.",
    ],
    flavor: "\"Não acredito nisso ...!\"",
  },
  "tp1-n-202": {
    text: [
      "[HOMEM MISTERIOSO DO VALE DA NÉVOA OCULTA]",
      "Válido: Quando este Ninja for enviado para Atacar, você pode descartar até 2 Chakras do seu oponente no final do turno.",
    ],
    flavor: "\"Eu sou Kisame Hoshigaki ... Prazer em conhecê-lo.\"",
  },
  "tp1-n-333": {
    text: [
      "[DIAS DE ANBU]",
      "Quando este Ninja for colocado em jogo, você pode escolher até 2 cards de Ninja \"Cão Ninja\" da sua área de Chakra e/ou Pilha de Descartes e colocá-los em jogo.",
      "Quando este Ninja for enviado para a Batalha, ele ganha +1/+1 para cada um dos seus Ninjas \"Cão Ninja\" durante este turno.",
    ],
    flavor: "\"Vão!\"",
  },
  "tp1-n-336": {
    text: [
      "[NOIVA]",
      "No final do turno do seu oponente, você pode mover 1 card de Ninja \"Prisioneiro\" da sua área de Chakra ou Pilha de Descartes para o topo do Deck do Dono Original dele.",
    ],
    flavor: "\"Por favor, volte a ser quem você era... Mizuki...\"",
  },
  "tp1-n-371": {
    name: "O Quarto Hokage",
    text: [
      "[VELOCIDADE DO RELÂMPAGO]",
      "Válido: Quando o Time deste Ninja ganhar qualquer Prêmio de Batalha, você pode ganhar 1 Prêmio de Batalha adicional.",
      "Válido: Enquanto este Ninja estiver Ferido, o Time deste Ninja não pode ser bloqueado por um Time com apenas 1 Ninja.",
    ],
    flavor: "Um jovem líder que sacrificou a vida para proteger a vila de um desastre. A sua figura corajosa cruzava o campo de batalha veloz como um relâmpago.",
  },
  "tp1-n-382": {
    text: [
      "[TEMPO CONGELADO]",
      "Quando você ganhar qualquer Prêmio de Batalha por causa do Time deste Ninja, o seu oponente deve descartar 1 card da mão.",
    ],
    flavor: "\"Preciso fazer o tempo do meu irmão voltar a correr...\"",
  },
  "tp1-n-384": {
    text: [
      "[RESGATE DO FUNDO DO MAR]",
      "Quando este Ninja for enviado para Bloquear, você pode revelar o card do fundo do seu Deck. Se for um card de Ninja, mova-o para a sua mão. Se não, devolva-o e embaralhe o seu Deck.",
    ],
    flavor: "\"Eu só estava passando por lá...\"",
  },
  "tp1-n-451": {
    text: [
      "[KUNOICHI MÉDICA]",
      "Durante a sua Fase de Missão, você pode descartar o card do topo do seu Deck. Nesse caso, cure 1 dos seus Ninjas feridos, e este Ninja não pode ser enviado para a Batalha durante este turno.",
    ],
    flavor: "\"Deixe-me tratar os seus ferimentos!\"",
  },
  "tp1-n-511": {
    text: [
      "[GUERREIROS INSETOS]",
      "Quando este Ninja for colocado em jogo, coloque em jogo 1 moeda (que simboliza uma moeda de Inseto) com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)] [Válido: Este Ninja não pode ser o Usuário de cards de Jutsu. Este efeito não pode ser negado.]\"",
    ],
    flavor: "\"Se você lutar comigo, não vai conseguir se recuperar. Desista e retire-se.\"",
  },
  "tp1-n-571": {
    text: [
      "[PUNHO BÊBADO]",
      "Válido: Durante a Fase de Missão, você pode jogar a Moeda Ninja. Se der cara, dobre o valor de Combate impresso (Saudável e Ferido) deste Ninja durante este turno. Se der coroa, o valor de Combate impresso (Saudável e Ferido) deste Ninja passa a ser 0 durante este turno.",
    ],
    flavor: "\"Lá vou euuuuuu!!\"",
  },
  "tp1-n-595": {
    text: [
      "[PRESSA]",
      "Quando este Ninja for colocado em jogo, você pode revelar os 2 cards do topo do seu Deck. Se houver 1 ou mais cards de Ninja entre eles, coloque 1 deles na sua mão, devolva o resto e embaralhe o Deck. Se não, devolva-os ao topo ou ao fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Vamos! Ele mandou a gente se apressar!\"",
  },
  "tp1-n-600": {
    text: [
      "[LINHA-DURA]",
      "Quando este Ninja for colocado em jogo, o seu oponente move todos os cards da mão dele para o fundo do Deck dele, em qualquer ordem. Depois, ele compra uma quantidade de cards igual à quantidade movida, menos um.",
    ],
    flavor: "\"Isso já foi resolvido.\"",
  },
  "tp1-n-622": {
    text: [
      "[DISCÍPULA DE OROCHIMARU]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, você pode procurar no seu Deck 1 card de Ninja \"Orochimaru\", revelá-lo e colocá-lo na sua mão. Depois, embaralhe o Deck.",
    ],
    flavor: "\"Lorde Orochimaru...\"",
  },
  "tp1-n-631": {
    text: [
      "[SEDUÇÃO]",
      "Os Ninjas \"Masculino\" do seu oponente com Custo de Entrada 2 ou menos recebem -2/+0.",
    ],
    flavor: "\"Oi!.. Faz muito tempo que eu queria te conhecer, Neji... Então.. oi!\"",
  },
  "tp1-n-640": {
    text: [
      "[ENTRADA DINÂMICA]",
      "Quando este Ninja for colocado em jogo, você pode remover do jogo 1 dos Ninjas feridos do seu oponente. Nesse caso, compre 1 card.",
      "Válido: Enquanto este Ninja estiver no mesmo Time que 1 ou mais outros Ninjas com o Atributo de Combate \"Taijutsu\", este Ninja ganha +0/+5.",
    ],
    flavor: "\"A Nobre Fera Azul da Vila da Folha!\"",
  },
  "tp1-n-864": {
    name: "Choji Akimichi (Infância)",
    text: [
      "[HORA DO LANCHE]",
      "Quando este Ninja for enviado para Atacar, você pode mover 1 card da sua Pilha de Descartes para o fundo do seu Deck. Nesse caso, este Ninja ganha +1/+1 durante este turno.",
    ],
    flavor: "\"Ei, sabe, eu trouxe uns salgadinhos. Quer dividir?\"",
  },
  "tp1-n-865": {
    name: "Hinata Hyuga (Infância)",
    text: [
      "[FOFA]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, em vez disso, mova-o para a sua área de Chakra. Nesse caso, descarte 1 card aleatório da mão do seu oponente.",
    ],
    flavor: "\"Hã??\"",
  },
  "tp1-n-866": {
    name: "Shikamaru Nara (Infância)",
    text: [
      "[SONHANDO COM AS NUVENS À DERIVA]",
      "No início do seu turno, você pode descartar 1 card da sua mão. Nesse caso, compre 1 card no final deste turno. Se você não descartou um card com Símbolo de Terra por este efeito, este Ninja não pode ser enviado para Atacar durante este turno.",
    ],
    flavor: "\"Ei... as nuvens são bem legais vistas daqui de baixo, quer deitar e olhar comigo?\"",
  },
  "tp1-n-867": {
    name: "Anbu (Capitão)",
    text: [
      "[CAPITÃO DA ANBU]",
      "Válido: Os seus outros Ninjas \"Anbu\" ganham +0/+1 e +1 de Poder Mental.",
      "O seu oponente não pode jogar cards de Missão com Custo de Entrada menor que o número dos seus Ninjas \"Anbu\" em jogo.",
    ],
    flavor: "\"Vamos, temos que dar apoio ao Lorde Hokage! Cuidado com as armadilhas!\"",
  },
  "tp1-n-868": {
    name: "Itachi Uchiha (Época da Anbu)",
    text: [
      "[FORÇA POLICIAL DA FOLHA]",
      "Quando este Ninja for baixado, você pode descartar todos os cards em jogo que não sejam de Ninja.",
      "Enquanto este card de Ninja estiver na sua Pilha de Descartes, se o seu oponente tiver mais cards na Pilha de Descartes que no Deck, você pode baixar este card de Ninja durante a sua Fase de Missão sem pagar o Custo de Mão dele.",
    ],
    flavor: "\"Irmãozinho tolo, quase tenho pena de você... Mangekyo Sharingan!\"",
  },
  "tp1-n-869": {
    name: "Kiba Inuzuka (Infância)",
    text: [
      "[HORA DE BRINCAR]",
      "Quando este Ninja for enviado para Atacar, você pode descartar 2 cards do topo ou do fundo do Deck do seu oponente. Nesse caso, este Ninja ganha +1/+0 durante este turno.",
    ],
    flavor: "\"Puxa, muito obrigado, carinha.\"",
  },
  "tp1-n-870": {
    text: [
      "[LÍDER DO CLÃ GAMA]",
      "Quando este Ninja for colocado em jogo, você pode mover até X cards da sua mão para a sua área de Chakra. Depois, mova a mesma quantidade de cards do topo do seu Deck para a sua mão. X = o número dos seus Ninjas com Símbolo de \"Raio\".",
      "Válido: Enquanto o seu oponente tiver menos Chakras que você, este Ninja e o seu Marcador de Turnos não são afetados pelos efeitos de Ninja e de Jutsu do seu oponente.",
    ],
    flavor: "\"Eu sou o sábio e poderoso Lorde Gamabunta, o Chefe dos Sapos! .. E você é um idiota!\"",
  },
  "tp1-n-871": {
    name: "Esquadrão Ninja Konohamaru",
    text: [
      "[SUCESSORES DA VONTADE DO FOGO]",
      "Quando este Ninja for colocado em jogo, revele o card do topo do seu Deck. Depois, mova esse card para a sua mão.",
      "Válido: Os outros Ninjas \"Folha\" do Time deste Ninja não podem ser afetados pelos efeitos dos Ninjas do seu oponente.",
    ],
    flavor: "\"Jutsu Sexy das Duas Garotas!\" \"Você está bem, Konohamaru?!\" \"O que você está fazendo na frente de nós, moças...?!\"",
  },
  "tp1-n-872": {
    name: "Rock Lee (Infância)",
    text: [
      "[LEMA DO ESFORÇO]",
      "Válido: Enquanto você tiver menos Prêmios de Batalha que o seu oponente, este Ninja ganha +1/+1.",
    ],
    flavor: "\"Quero mostrar que eu também posso ser um Ninja divertido. Mesmo sem Ninjutsu nem Genjutsu. Quero provar isso para o mundo inteiro!\"",
  },
  "tp1-n-873": {
    name: "Aranha Gigante",
    text: [
      "[CHUVA DE ARANHAS]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, você pode remover todos os marcadores de 1 card de Ninja ou de Missão.",
    ],
    flavor: "\"Eu avisei, garoto: por mais fortes que sejam as suas defesas, eu acho um jeito de contorná-las. Espalhem-se!\"",
  },
  "tp1-n-874": {
    text: [
      "[MURALHA]",
      "Durante a Troca de Jutsu, você pode descartar 2 dos seus Chakras com Símbolo de Água. Nesse caso, durante este turno, quando o seu oponente conseguir uma Vitória Espetacular/um Prêmio de Batalha Espetacular, em vez disso, ele passa a ser uma Vitória/um Prêmio de Batalha, respectivamente.",
      "Válido: Este Ninja não pode ser enviado para Atacar e não pode ser incluído num Time com qualquer outro Ninja.",
    ],
    flavor: "\"O Rashomon é a nossa maior defesa para o Lorde Orochimaru.\"",
  },
  "tp1-n-875": {
    name: "Zabuza Momochi (Juventude)",
    text: [
      "[SEM EMOÇÕES]",
      "Quando o Time deste Ninja conseguir qualquer Vitória, você pode ferir 1 Ninja de Apoio adversário.",
      "Quando o Time deste Ninja ganhar qualquer Prêmio de Batalha, você pode descartar 1 card em jogo que não seja de Ninja.",
    ],
    flavor: "\"Amizade, conforto, encorajamento: eu não preciso dessas coisas, nem você deve esperá-las de mim.\"",
  },
  "tp1-n-876": {
    text: [
      "[MENTOR]",
      "Quando este Ninja for baixado, procure no seu Deck 1 card de Ninja que tenha \"Infância\" no nome, revele-o e coloque-o na sua mão. Depois, embaralhe o seu Deck.",
      "Quando você colocar um Ninja em jogo por \"Crescimento\", cure-o.",
    ],
    flavor: "\"Vou te ensinar a andar... sobre a água.\"",
  },
  "tp1-n-877": {
    name: "Gaara of the Desert (Infância)",
    text: [
      "[SOLIDÃO]",
      "Quando este Ninja for colocado em jogo, compre 1 card.",
      "Válido: Quando este Ninja for descartado por causa do Showdown, descarte 1 card da sua mão.",
    ],
    flavor: "\"Como é sentir dor? Sabe, eu nunca me machuquei de verdade, e estava curioso para saber como é.\"",
  },
  "tp1-n-878": {
    text: [
      "[CRIANDO A OBRA-PRIMA]",
      "Quando um dos Ninjas do seu oponente for ser descartado, você pode descartar X dos seus Chakras, onde X é o Custo de Entrada desse Ninja. Nesse caso, em vez disso, mova esses cards de Ninja para a sua Vila.",
      "Válido: Durante a sua Fase de Missão, você pode descartar este Ninja. Nesse caso, você pode colocar em jogo 1 card de Ninja \"Mestre de Marionetes\" do seu Baralho de Reforço.",
    ],
    flavor: "\"Arte é algo que permanece belo... por muito tempo, até o futuro distante. A beleza eterna é a arte!\"",
  },
  "tp1-n-879": {
    text: [
      "[PARA QUEM ELA ADMIRA]",
      "Válido: Quando o seu oponente procurar ou comprar qualquer card por um efeito, o seu oponente descarta 1 card da mão. Depois, você pode comprar 1 card e descartar 1 card da sua mão.",
    ],
    flavor: "\"Por muito tempo... eu treinei o máximo que pude para que o Naruto reconhecesse a minha habilidade.\"",
  },
  "tp1-n-880": {
    text: [
      "[O PODER DO PRIMEIRO HOKAGE]",
      "Enquanto este Ninja estiver no Campo de Batalha, você pode escolher 1 Ninja Em Combate. Nesse caso, o Ninja escolhido passa a ser um Ninja Reserva, a menos que o seu oponente descarte 1 card da mão.",
    ],
    flavor: "\"Tem certeza de que está pronto para isso? Você saiu do hospital ontem.\"",
  },
  "tp1-n-881": {
    text: [
      "[ORIGEM DA BANDANA DA FOLHA]",
      "No final do seu turno, se você não tiver Clientes na sua Vila, você pode procurar no seu Deck 1 Cliente e baixá-lo. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Quem aprimora a concentração é um verdadeiro grande ninja.\"",
  },
  "tp1-n-882": {
    text: [
      "[JOVEM AMBICIOSO]",
      "Válido: Quando qualquer um dos seus Ninjas ou Missões com Símbolo de \"Raio\" for ser retirado de jogo pelos efeitos do seu oponente, você pode mover este Ninja para a sua área de Chakra. Nesse caso, mova 1 desses cards para a mão do Dono Original dele.",
    ],
    flavor: "\"Eu vou ser o Sétimo Hokage.\"",
  },
  "tp1-n-us006": {
    text: [
      "[UMA DUPLA PERSONALIDADE]",
      "Durante a Troca de Jutsu, você pode trocar todos os cards da sua mão pelo mesmo número de cards do topo do seu Deck.",
    ],
    flavor: "\"Uma garota tem que ser durona se quiser sobreviver a uma coisa dessas!\"",
  },
  "tp1-n-us015": {
    text: [
      "[FLEXIBILIDADE]",
      "Enquanto você tiver 5 ou mais cards na mão, o Time deste Ninja e o Time Em Combate contra ele fazem uma Batalha Mental. Enquanto você tiver 4 cards ou menos na mão, o Time deste Ninja e o Time Em Combate contra ele não podem fazer uma Batalha Mental.",
    ],
    flavor: "\"Então, vamos lá.\"",
  },
  "tp1-n-us027": {
    text: [
      "[ENSINO DA TÉCNICA OCULTA]",
      "Durante a sua Fase de Missão, se você tiver \"Naruto Uzumaki\" em jogo, pode mover 1 card de Jutsu da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Vou te ensinar uma técnica matadora.\"",
  },
  "tp1-n-us035": {
    text: [
      "[CAMUFLAGEM]",
      "Durante a Fase de Missão ou a Troca de Jutsu, você pode ferir outro Ninja do Time deste Ninja. Nesse caso, esse Ninja não pode ser alvo dos cards de Jutsu do seu oponente durante este turno. Cure esse Ninja ferido no final do turno.",
    ],
    flavor: "\"Se eu não tivesse intervindo, você estaria morto agora ... disso eu tenho certeza.\"",
  },
  "tp1-n-us072": {
    text: [
      "[O PRIMOGÊNITO DO CLÃ GAMA]",
      "Válido: Durante a sua Fase de Missão, você pode descartar 2 dos seus Prêmios de Batalha. Nesse caso, você pode colocar em jogo 1 card de Ninja \"Sapo Ninja\" da sua mão, ignorando os requisitos de Entrada.",
      "Válido: Este Ninja não pode ser o Usuário de cards de Jutsu.",
    ],
    flavor: "\"Bem, seja o que for, espero que você tenha trazido uns petiscos.\"",
  },
  "tp1-n-us106": {
    text: [
      "[ESPECIALISTA EM GENJUTSU]",
      "Enquanto este Ninja estiver Em Combate, todos os Ninjas do Time deste Ninja e todos os Ninjas Em Combate contra este Ninja recebem -1/-1 se não tiverem o Atributo de Combate \"Genjutsu\".",
    ],
    flavor: "\"Certo... Vamos acabar com isso!\"",
  },
  // ── JUTSU ──
  "tp1-j-696": {
    text: [
      "Alvo: 1 dos Prêmios de Batalha do seu oponente",
      "Efeito: Vire o alvo com a face para cima. Depois, descarte aleatoriamente até X cards da mão do seu oponente. X = o número de Símbolos do alvo. (O alvo continua com a face para cima)",
    ],
    flavor: "\"Achei! Tem um numa pedra a uns 500 metros a nordeste daqui...\"",
  },
  "tp1-j-697": {
    name: "Jutsu de Expansão: Super Tapa!",
    text: [
      "Alvo: 1 Ninja com valor de Combate menor ou igual ao valor de Combate do Usuário",
      "Efeito: O alvo passa a ser um Ninja Reserva. Depois, se o Usuário tiver Símbolo de Terra, ele não é afetado pelos cards de Jutsu do seu oponente durante este turno.",
    ],
    flavor: "\"Jutsu de Expansão! Super Tapa!\"",
  },
  "tp1-j-698": {
    name: "Estilo Fogo: Jutsu Bola de Fogo",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Depois, se o Usuário tiver Símbolo de Fogo, descarte 4 cards do topo ou do fundo do Deck do seu oponente.",
    ],
    flavor: "\"Rato, Tigre, Cão, Boi, Lebre, Tigre! Estilo Fogo: Jutsu Bola de Fogo!!\"",
  },
  "tp1-j-699": {
    name: "Corte Único da Lâmina de Relâmpago",
    text: [
      "Requerimento: Custo de Entrada impresso 4 ou mais",
      "Alvo: 1 Ninja",
      "Efeito: O alvo recebe -4/-4 durante este turno. Se o Time do Usuário conseguir qualquer Vitória durante este turno, você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Uma após a outra, uma nova geração vai nos suceder.\"",
  },
  "tp1-j-700": {
    name: "Arte Ninja: Pergaminho da Super Fera \"Leão\"",
    text: [
      "Alvo: Usuário",
      "Efeito: Você pode trocar todos os cards da sua mão pelo mesmo número de cards do topo do seu Deck. Depois, revele a sua mão; o alvo ganha +1/+0 para cada card de Jutsu revelado.",
    ],
  },
  "tp1-j-701": {
    name: "Furacão da Folha",
    text: [
      "Alvo: Usuário",
      "Efeito: O alvo ganha +2/+0 durante este turno. O próximo card de Jutsu que o alvo usar durante este turno não pode ser afetado pelos efeitos do seu oponente.",
    ],
    flavor: "\"Furacão da Folha!\"",
  },
  "tp1-j-702": {
    name: "Jutsu Clone de Água",
    text: [
      "Alvo: Card de Jutsu sendo jogado ou o texto de efeito de 1 Ninja",
      "Efeito: O seu oponente joga a Moeda Ninja duas vezes. Se ele tirar coroa só uma vez, negue o alvo. Este card de Jutsu pode ser usado enquanto estiver na sua área de Chakra.",
    ],
    flavor: "\"Mas a sua decisão foi a certa. Eu sou... poderoso.\"",
  },
  "tp1-j-703": {
    name: "Jutsu Prisão de Água",
    text: [
      "Alvo: 1 Ninja de Apoio Em Combate contra o Usuário",
      "Efeito: O Poder e o Poder Mental do alvo não podem ser somados ao Time dele durante o Showdown deste turno. Este card de Jutsu pode ser usado enquanto estiver na sua área de Chakra.",
    ],
    flavor: "\"Não consigo me mexer...\" \"Não consigo respirar...\"",
  },
  "tp1-j-704": {
    name: "Ninjutsu de Reanimação",
    text: [
      "Alvo: 1 Ninja ferido",
      "Efeito: Cure o alvo ou compre 1 card. Depois, se o Usuário tiver o Atributo de Combate \"Medicina\", você pode mover 1 card da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"É um Ninjutsu que permite trazer um morto de volta à vida em troca da sua própria...\"",
  },
  "tp1-j-705": {
    name: "Lâminas de Chakra",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: O alvo ganha +0/+3.",
    ],
    flavor: "\"Para ativá-lo, imagine o seu Chakra se dividindo em dois...\"",
  },
  // ── MISSÃO ──
  "tp1-m-665": {
    name: "Aula de Shogi",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: O Time do alvo e o Time Em Combate contra ele fazem uma Batalha Mental durante este turno. No final deste turno, se o alvo foi enviado para a Batalha neste turno e ainda estiver na sua Vila, compre 2 cards.",
    ],
    flavor: "\"Heh! Quando você joga Shogi o bastante com alguém, aprende a ler a pessoa como um livro.\"",
  },
  "tp1-m-666": {
    name: "Táticas dos Amassos",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja ou de Cliente com Custo de Entrada menor que o número de cards na sua área de Chakra, revele-o e coloque-o na sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"De jeito nenhum!!\"",
  },
  "tp1-m-667": {
    name: "Rivais Ferozes",
    text: [
      "Efeito: O Combate, o Suporte e o Poder Mental de todos os Ninjas passam a ser 0 e não podem ser mudados pelo efeito de cards que não sejam de Jutsu durante este turno. No final deste turno, compre 1 card para cada um dos seus Times que conseguiu uma Vitória ou um Prêmio de Batalha durante este turno.",
    ],
    flavor: "\"A verdade é que você e eu somos amigos.\" \"Para mim não é insignificante, não há dúvida: você era o meu amigo mais próximo.\"",
  },
  "tp1-m-668": {
    name: "Desidratação",
    text: [
      "Anulação Permanente (3)",
      "Alvo: 1 Ninja",
      "Efeito: Anexe este card ao alvo. O texto de efeito do alvo é negado.",
      "Efeito: Quando o seu oponente comprar 1 ou mais cards por um efeito, compre 1 card.",
    ],
    flavor: "\"Ei, a gente pode descansar um pouco?\"",
  },
  "tp1-m-669": {
    name: "Laços de Amizade",
    text: [
      "Efeito: Compre 2 cards. Depois, mova 1 card da sua mão para a sua área de Chakra.",
      "Efeito: Durante a sua Fase de Missão, se este card estiver na sua área de Chakra, você pode removê-lo do jogo. Nesse caso, coloque 1 Marcador de Crescimento num Ninja \"Areia\" ou \"Folha\".",
    ],
    flavor: "\"Gaara...\" \"Naruto...\"",
  },
};
