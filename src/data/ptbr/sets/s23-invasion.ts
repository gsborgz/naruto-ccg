import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S23 — Invasion, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s23-invasion.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Mission | EOJ]` viram `[Válido | Atacante | Missão | Troca de Jutsu]`.
 */
export const S23_INVASION_PTBR: CardTranslations = {
  // ── NINJA ──
  "s23-n-1270": {
    text: [
      "[CAPTURA DE SOMBRA]",
      "Quando este Ninja for colocado em jogo, o Ninja alvo que estiver sozinho num Time passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Nada disso! De jeito nenhum.\"",
  },
  "s23-n-1271": {
    text: [
      "[FÚRIA CALÓRICA]",
      "Quando este Ninja for colocado em jogo, você pode descartar qualquer número de cards anexados aos seus Ninjas.",
    ],
    flavor: "\"Shikamaru... Me solta!\"",
  },
  "s23-n-1272": {
    text: [
      "[CIFRA]",
      "[Atacante | Missão] (0): Compre 1 card. Depois, mova 1 card da sua mão para o topo do seu Deck.",
    ],
    flavor: "\"Aham.\"",
  },
  "s23-n-1273": {
    text: [
      "[HERDEIRA DOS HYUGA]",
      "[Válido | Troca de Jutsu] (0): Mova este Ninja para a sua área de Chakra e depois negue o Jutsu alvo, a menos que o Dono Original dele descarte 1 Chakra.",
    ],
    flavor: "\"Irmão Neji...\"",
  },
  "s23-n-1274": {
    text: [
      "[PODER DA KUNOICHI]",
      "Válido: Enquanto este Ninja estiver Em Combate contra um Ninja \"Feminino\", este Ninja ganha +1/+1.",
      "[Troca de Jutsu] Mova 1 card da sua mão para a sua área de Chakra: Se este Ninja for enfrentado por um Ninja \"Feminino\", compre 1 card.",
    ],
    flavor: "\"O que... O que diabos é você?\"",
  },
  "s23-n-1275": {
    text: [
      "[GÊNIO AMALDIÇOADO]",
      "Válido: Enquanto o seu oponente controlar um Hinata Hyuga ou Hiashi Hyuga, este Ninja recebe -1/-1.",
    ],
    flavor: "\"Você previu a sua própria derrota!!\"",
  },
  "s23-n-1276": {
    text: [
      "[PALAVRAS TORTURADAS]",
      "Quando este Ninja for colocado em jogo, você pode revelar qualquer número de cards de Ninja \"Examinador\" da sua mão. Nesse caso, coloque um Marcador +1/+1 neste Ninja para cada card revelado dessa forma.",
    ],
    flavor: "\"Se essa é a sua atitude, então vou fazer você querer falar.\"",
  },
  "s23-n-1277": {
    text: [
      "[ÉGIDE DE AÇO]",
      "Quando este Ninja usar um Jutsu com custo de apenas (1) ou (2), você pode remover do jogo todos os cards de Jutsu da sua Pilha de Descartes com o mesmo nome desse Jutsu. Durante este turno, você pode jogar esses cards de Jutsu de graça, com este Ninja como Usuário.",
    ],
  },
  "s23-n-1278": {
    text: [
      "[PROTETOR DA VONTADE]",
      "[Missão | Troca de Jutsu] (Terra|Terra), diga um Símbolo: o Ninja alvo que você controla não pode ser alvo de cards de Jutsu com o Símbolo dito.",
    ],
    flavor: "\"Eu leio você como um livro quando jogamos shogi.\"",
  },
  "s23-n-1279": {
    text: [
      "[DESTRUIÇÃO MENTAL]",
      "[Atacante | Missão] (Terra|Terra): Coloque um Marcador de \"Mente\" no Ninja alvo.",
      "O Combate dos Ninjas com Marcador de \"Mente\" é 0.",
    ],
    flavor: "\"Entendi...\"",
  },
  "s23-n-1280": {
    text: [
      "[AMPLIADO]",
      "Válido: X = o número de Ninjas de Terra que você controla, mais 2.",
    ],
    flavor: "\"Ali!\"",
  },
  "s23-n-1281": {
    text: [
      "[IRA FLAMEJANTE]",
      "[Atacante | Missão] (Terra) ou (Fogo): Descarte 1 Ninja que você controla. Se o Custo de Entrada desse Ninja era 4 ou menos, você ganha 1 Prêmio de Batalha. Se não, você ganha 2 Prêmios de Batalha.",
    ],
  },
  "s23-n-1282": {
    text: [
      "[JUSTIÇA AFIADA]",
      "[Troca de Jutsu] Remova do jogo 1 dos seus Jutsus: Durante este turno, você pode jogar esse Jutsu de graça.",
    ],
    flavor: "\"Cara, você é bom.\"",
  },
  "s23-n-1283": {
    text: [
      "[MORTE?]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, se ele não tiver um Marcador de \"Fantasma\", mova este card de Ninja para a sua Vila com um Marcador de \"Fantasma\".",
      "Válido: Quando este Ninja for ser descartado por causa do Showdown, se ele tiver um Marcador de \"Fantasma\", em vez disso, remova-o do jogo.",
    ],
    flavor: "\"O quê?! Onde?!\"",
  },
  "s23-n-1284": {
    name: "Sasuke Uchiha (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, mova os 2 cards do topo do Deck do seu oponente para a Pilha de Descartes dele.",
      "Quando este Ninja for movido para a sua área de Chakra pelo efeito de CRESCIMENTO, você pode colocar um Marcador de Crescimento em 1 dos seus Ninjas.",
    ],
    flavor: "\"Jutsu Clone é brincadeira de criança.\"",
  },
  "s23-n-1285": {
    text: [
      "[PORTADOR DA VINGANÇA]",
      "Válido: Quando este Ninja for enviado para Atacar, coloque um Marcador +1/+1 neste Ninja.",
    ],
    flavor: "\"Certo...\"",
  },
  "s23-n-1286": {
    text: [
      "[SUPERVISOR]",
      "[Troca de Jutsu] (0): Escolha novas posições para todos os Ninjas de 1 Time e depois mova este Ninja para a área de Chakra do Dono Original dele.",
    ],
    flavor: "\"Comecem!!\"",
  },
  "s23-n-1287": {
    name: "Rei Macaco Enma",
    text: [
      "[FÚRIA CARNAL]",
      "Quando este Ninja atacar sozinho, fira este Ninja. Depois, este Ninja ganha +4/+0 durante este turno.",
    ],
  },
  "s23-n-1288": {
    text: [
      "[COVARDIA]",
      "Válido: Quando este Ninja for retirado de jogo, compre 1 card.",
      "Quando este Ninja se tornar alvo de um card de Jutsu ou de um efeito, mova este Ninja para a mão do Dono Original dele.",
    ],
    flavor: "\"Oh! Você está vivo!\"",
  },
  "s23-n-1289": {
    text: [
      "[ANÁTEMA]",
      "[Válido | Atacante | Missão] Descarte este Ninja: Os dois jogadores ganham 1 Prêmio de Batalha.",
    ],
    flavor: "\"E com cara de durão, também.\"",
  },
  "s23-n-1290": {
    name: "Elite da Anbu",
    text: [
      "[TRABALHO EM EQUIPE]",
      "Válido: Todos os seus Ninjas \"Anbu\" ganham o seguinte texto de efeito: \"[Troca de Jutsu] Descarte este Ninja: o Ninja \"Anbu\" alvo ganha +2/+2 durante este turno.\"",
    ],
    flavor: "\"E então? Conseguimos?\"",
  },
  "s23-n-1291": {
    name: "Kakashi Hatake (Garoto)",
    text: [
      "[CARREGADO!]",
      "Válido: No final do seu turno, se este Ninja não Atacou, coloque um Marcador de \"Carga\" neste Ninja.",
      "[Troca de Jutsu] Remova 2 Marcadores de \"Carga\" deste Ninja: Este Ninja ganha +5/+0 durante este turno. Qualquer Ninja adversário que receber Dano durante o Showdown neste turno recebe 1 Dano adicional.",
    ],
    flavor: "\"Eu estou bem.\"",
  },
  "s23-n-1292": {
    text: [
      "[PRESA BRANCA]",
      "Válido: O seu Kakashi Hatake ganha +1/+1.",
      "Válido: Quando este Ninja ganhar qualquer Prêmio de Batalha, descarte 1 dos Ninjas do seu oponente com Custo de Entrada 3 ou menos.",
    ],
  },
  "s23-n-1293": {
    text: [
      "[ASSASSINAR]",
      "Quando este Ninja for baixado, você pode pagar X Chakras. Nesse caso, descarte o Ninja alvo com Custo de Entrada menor que X.",
    ],
    flavor: "Agora!",
  },
  "s23-n-1294": {
    name: "Sanguessuga de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "Quando este Ninja for colocado em jogo, você pode mover os 3 cards do topo do seu Deck para a sua área de Chakra.",
    ],
  },
  "s23-n-1295": {
    text: [
      "[ELO DE CHAKRA]",
      "Quando este Ninja for colocado em jogo, se o seu oponente tiver mais Chakras que você, você pode procurar um card no seu Deck e movê-lo para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "Deve ser isso...",
  },
  "s23-n-1296": {
    text: [
      "[COMPROMISSO DE HONRA]",
      "Válido: Este Ninja só pode ser enviado para a Batalha sozinho.",
      "Válido: Este Ninja só pode ser bloqueado por um Ninja que esteja sozinho num Time.",
    ],
    flavor: "\"Certo!!!\"",
  },
  "s23-n-1297": {
    name: "Cobra de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "Quando este Ninja for colocado em jogo, mova até X cards da sua Pilha de Descartes para a sua área de Chakra, X = o número dos seus Ninjas \"Tinta\".",
    ],
  },
  "s23-n-1298": {
    text: [
      "[FORA DE CONTROLE]",
      "Válido: Todos os seus cards de Jutsu de Raio custam (1) a menos para jogar.",
    ],
    flavor: "\"RAAAGH!!\"",
  },
  "s23-n-1299": {
    text: [
      "[MEMÓRIA MUSCULAR]",
      "Válido: Quando outro efeito for mudar o Poder deste Ninja, em vez disso, negue esse efeito, e este Ninja ganha +4/+0 durante este turno.",
    ],
    flavor: "\"Entendido!\"",
  },
  "s23-n-1300": {
    text: [
      "[MEMBRO DA RAIZ]",
      "Quando este Ninja for colocado em jogo, se você tiver um Ninja de Fogo, coloque um Marcador -1/-1 no Ninja alvo.",
      "Quando este Ninja for colocado em jogo, se você tiver um Ninja de Vento, pode comprar 1 card.",
    ],
    flavor: "\"Sai, não é?\"",
  },
  "s23-n-1301": {
    text: [
      "[COZINHEIRA DOS SAPOS]",
      "Senjutsu",
      "Quando este Ninja for colocado em jogo, procure no seu Deck um card de Ninja Fukasaku, revele-o e depois mova-o para a sua mão.",
      "Quando este Ninja for colocado em jogo, cure 1 dos seus Ninjas de Raio.",
    ],
    flavor: "\"Vou arranjar uns ingredientes frescos para nós.\"",
  },
  "s23-n-1302": {
    text: [
      "[TREINO DE SÁBIO]",
      "Senjutsu",
      "Quando este Ninja for colocado em jogo, procure no seu Deck um card de Ninja Shima, revele-o e depois mova-o para a sua mão.",
      "Válido: Quando este Ninja for Sacrificado, compre 2 cards.",
    ],
    flavor: "\"Para os animais, ficar parado é a coisa mais difícil de fazer.\"",
  },
  "s23-n-1303": {
    text: [
      "[RONDÓ DA DESTRUIÇÃO]",
      "[Válido | Troca de Jutsu] Descarte 1 card de Ninja: compre 1 card, e depois este Ninja ganha +X/+0 durante este turno, onde X = o Custo de Entrada do card descartado.",
    ],
  },
  "s23-n-1304": {
    text: [
      "[ABERTURA DOS PORTÕES]",
      "Válido: Enquanto este Ninja estiver sozinho num Time, ele ganha +1/+0 para cada Prêmio de Batalha do seu oponente.",
    ],
    flavor: "\"Primeiro Portão: Portão da Abertura. Liberar!\"",
  },
  "s23-n-1305": {
    text: [
      "[ESCRITOR ÉPICO]",
      "Válido: Quando este Ninja conseguir qualquer Vitória, você ganha 2 Prêmios de Batalha. Quando este Ninja sofrer qualquer Derrota, o seu oponente ganha 1 Prêmio de Batalha.",
    ],
  },
  "s23-n-1306": {
    text: [
      "[CHUVA MALÉVOLA]",
      "[Atacante | Missão] (1): O seu oponente descarta 1 dos Chakras dele.",
    ],
    flavor: "\"Aqueles caras...\"",
  },
  "s23-n-1307": {
    text: [
      "[CHAKRA VISCOSO]",
      "Quando este Ninja for colocado em jogo, se não houver Marcadores \"Grudento\" em jogo, coloque um Marcador \"Grudento\" em 2 Ninjas alvo que o seu oponente controla.",
      "Válido: Durante a Fase de Organização do seu oponente, os Ninjas com Marcador \"Grudento\" devem ser organizados no mesmo Time, se possível.",
    ],
    flavor: "\"O quê? Tem outro?\"",
  },
  "s23-n-1308": {
    text: [
      "[CINESTESIA DE CHAKRA]",
      "[Missão | Troca de Jutsu] Remova um marcador do Ninja alvo: coloque um Marcador -1/-1 nesse Ninja.",
    ],
    flavor: "A sensação deste chakra...",
  },
  "s23-n-1309": {
    text: [
      "[CONTROLANDO A RAIVA]",
      "[Atacante | Missão] (0): Se você tiver Sasuke Uchiha ou Kimimaro na sua Vila, fira este Ninja.",
    ],
    flavor: "\"Já começou.\"",
  },
  "s23-n-1310": {
    text: [
      "[IMPARCIAL]",
      "No início do turno de cada jogador, esse jogador descarta 1 dos Chakras dele.",
    ],
    flavor: "\"Livre, finalmente...\"",
  },
  "s23-n-1311": {
    text: [
      "[HABILIDADES TALENTOSAS]",
      "Quando este Ninja for colocado em jogo, coloque um Marcador de \"Espelho\" neste Ninja.",
      "[Troca de Jutsu] Remova 1 Marcador de \"Espelho\" deste Ninja: Mude o alvo de um Jutsu para outro alvo válido.",
    ],
    flavor: "\"Quero lutar com ele do meu jeito...\"",
  },
  "s23-n-1312": {
    text: [
      "[ATITUDE ATREVIDA]",
      "Quando este Ninja ganhar qualquer Prêmio de Batalha, descarte 2 Chakras do seu oponente.",
    ],
    flavor: "\"Lá vem!\"",
  },
  "s23-n-1313": {
    text: [
      "[SEM EMOÇÕES]",
      "Quando este Ninja for colocado em jogo, cada jogador descarta Chakras até ficar com apenas 3 cards na área de Chakra.",
    ],
    flavor: "\"Naturalmente, não vou forçar você.\"",
  },
  "s23-n-1314": {
    name: "Jirobo (Estado 2)",
    text: [
      "[SUPER DRENO]",
      "Sacrifício: Jirobo (Estado 1)",
      "Válido: Quando este Ninja Atacar, descarte 1 dos Chakras do seu oponente e coloque um Marcador de \"Dreno\" neste Ninja.",
      "[Missão | Troca de Jutsu] Remova um Marcador de \"Dreno\" deste Ninja: Mova 1 card do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Quanto chakra. Me sinto uma criança numa loja de doces.\"",
  },
  "s23-n-1315": {
    text: [
      "[ESPADACHIM DA NÉVOA]",
      "Quando este Ninja for colocado em jogo, se ele foi colocado em jogo a partir da sua mão, descarte 3 Chakras do seu oponente.",
      "Válido: Os cards de Jutsu do seu oponente custam (1) a mais para jogar.",
    ],
    flavor: "\"Agora você entendeu.\"",
  },
  "s23-n-1316": {
    text: [
      "[MÃO DIREITA DA COBRA]",
      "[Troca de Jutsu] (2), descarte um card: negue o Jutsu alvo.",
    ],
    flavor: "\"Ela é forte!\"",
  },
  "s23-n-1317": {
    text: [
      "[AMARRAS NEGRAS]",
      "Este Ninja ganha +3/+0 se você controlar um Ninja de Fogo.",
      "Este Ninja não pode ser bloqueado por Ninjas feridos.",
    ],
    flavor: "\"Só sobrou você.\"",
  },
  "s23-n-1318": {
    text: [
      "[A COBRA BRANCA]",
      "Quando um Ninja for descartado, você pode colocar um Marcador +1/+1 neste Ninja.",
      "[Atacante | Missão] (2), remova um Marcador +1/+1 deste Ninja: Veja os 3 cards do topo do seu Deck, mova 1 deles para a sua mão e devolva o resto em qualquer ordem.",
    ],
    flavor: "\"Chega dessa conversa fiada de velhos.\"",
  },
  "s23-n-1319": {
    text: [
      "[TITEREIRO DA AREIA]",
      "[Troca de Jutsu] (1): Mova o Ninja \"Marionete\" alvo que estiver em 1 dos seus outros Times no Campo de Batalha para o Time deste Ninja, em qualquer posição.",
    ],
    flavor: "\"C-Com licença!\"",
  },
  "s23-n-1320": {
    name: "Sakura Haruno (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, revele o card do topo do seu Deck. Se esse card for um card de Ninja, mova-o para a sua mão.",
      "Quando este Ninja for movido para a sua área de Chakra pelo efeito de CRESCIMENTO, você pode colocar um Marcador de Crescimento em 1 dos seus Ninjas.",
    ],
    flavor: "\"Não atrapalhe a concentração do Sasuke!\"",
  },
  "s23-n-1321": {
    name: "Corvo",
    text: [
      "[MARIONETE]",
      "Válido: Enquanto você não tiver um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "[Válido | Troca de Jutsu] (Vento): Se este Ninja estiver num Time com um Ninja \"Manipulação\", cause 1 Dano ao Ninja adversário alvo e depois descarte este Ninja.",
    ],
  },
  "s23-n-1322": {
    name: "Formiga Negra",
    text: [
      "[MARIONETE]",
      "Válido: Enquanto você não tiver um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "[Troca de Jutsu] (Vento|Vento): Se este Ninja estiver num Time com um Ninja \"Manipulação\", o Ninja adversário alvo passa a ser um Ninja Reserva. Depois, mova este Ninja para a área de Chakra do Dono Original dele.",
    ],
  },
  "s23-n-1323": {
    text: [
      "[BARRAGEM DE INSETOS]",
      "[Válido | Missão] (2): Coloque em jogo uma moeda de Ninja Inseto 0/0.",
      "Válido: Quando um Ninja Inseto for retirado de jogo, veja os 2 cards do topo do Deck do seu oponente e devolva-os ao topo ou ao fundo, em qualquer ordem.",
    ],
  },
  "s23-n-1324": {
    text: [
      "[TRÊS ESTRELAS]",
      "Quando você jogar um Jutsu cujo alvo seja \"1 Jutsu\", compre 2 cards e depois descarte 1 card.",
    ],
    flavor: "\"Boa pegada.\"",
  },
  "s23-n-1325": {
    name: "Salamandra",
    text: [
      "[MARIONETE]",
      "Válido: Enquanto você não tiver um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "[Troca de Jutsu] (2): Se este Ninja estiver num Time com um Ninja \"Manipulação\", quando o Ninja alvo for receber qualquer Dano durante este turno, em vez disso, negue esse Dano.",
    ],
  },
  "s23-n-1326": {
    text: [
      "[CONTROLE PERFEITO]",
      "No final do turno em que este Ninja foi colocado em jogo, mova para a sua área de Chakra todos os cards que foram movidos para a sua Pilha de Descartes durante este turno.",
    ],
    flavor: "\"Certo!\"",
  },
  "s23-n-1327": {
    text: [
      "[ATAQUE E DEFESA]",
      "[Atacante | Missão] (2), mova um Ninja que você controla para a mão do Dono Original dele: Mova para a mão dele o Ninja alvo que o seu oponente controla com Custo de Entrada igual ao do Ninja que você moveu.",
    ],
    flavor: "\"Eu cuido disso.\"",
  },
  "s23-n-1328": {
    text: [
      "[CONTROLE DE MARIONETES]",
      "[Troca de Jutsu] (1): Mova 1 Ninja \"Marionete\" que você controla e que não esteja no Time deste Ninja para o Time deste Ninja, em qualquer posição.",
    ],
    flavor: "\"Você é bom... Mas...\"",
  },
  "s23-n-1329": {
    text: [
      "[ANJO DE ORIGAMI]",
      "Enquanto o seu oponente tiver menos cards na mão que você, todos os Ninjas que enfrentam este Ninja recebem -2/-2.",
    ],
    flavor: "\"Onde está Naruto Uzumaki?\"",
  },
  "s23-n-1330": {
    name: "Sasori (Modo Marionete)",
    text: [
      "[PARADIGMA DAS MARIONETES]",
      "Sacrifício: Sasori + Custo de Entrada 5 ou mais",
      "Quando este Ninja for colocado em jogo, mova todos os cards de Ninja \"Marionete\" da sua Pilha de Descartes para a sua Vila. Os cards de Ninja movidos dessa forma são movidos como se fossem Não Únicos.",
    ],
  },
  "s23-n-1331": {
    name: "Centopeia Gigante",
    text: [
      "[FÚRIA]",
      "Não Único",
      "Este Ninja ganha +1/+1 para cada um dos seus outros Ninjas com \"Animal\" + \"Rinnegan\".",
    ],
  },
  "s23-n-1332": {
    name: "Pain (Caminho Animal)",
    text: [
      "[RENASCIDO]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Todos os seus Ninjas \"Rinnegan\" + \"Animal\" ganham +1/+1.",
      "Válido: Quando 1 dos seus Ninjas \"Rinnegan\" + \"Animal\" for ser retirado de jogo, você pode, em vez disso, movê-lo para a sua mão.",
    ],
    flavor: "\"Afinal, que dor é essa de que você fala?\"",
  },
  "s23-n-1333": {
    name: "Estátua Herética",
    text: [
      "[REJUVENESCER]",
      "No início do seu turno, você pode remover este Ninja do jogo. Nesse caso, mova da sua Pilha de Descartes para a sua Vila 1 card de Ninja com \"Pain\" no nome e Custo de Entrada menor ou igual ao seu Marcador de Turnos, ignorando o Requerimento de Sacrifício dele.",
      "Válido: No início do seu turno, cure 1 dos seus Ninjas \"Rinnegan\".",
    ],
  },
  "s23-n-1334": {
    name: "Pain (Caminho Asura)",
    text: [
      "[FORMA VERDADEIRA]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Quando este Ninja Atacar no mesmo Time que 2 ou mais outros Ninjas \"Rinnegan\" e/ou \"Akatsuki\", fira o Ninja alvo e coloque um Marcador -1/-1 nesse Ninja.",
    ],
  },
  // ── JUTSU ──
  "s23-j-865": {
    name: "Rocha Humana",
    text: [
      "Requerimentos: \"Comida\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Poder do alvo passa a ser 0/0 durante este turno. Se o card usado para pagar este Jutsu tinha Símbolo de Água, mova 1 card da sua Pilha de Descartes para o topo do seu Deck.",
      "Combinação (\"Comida\"): Cause 2 Dano ao alvo.",
    ],
    flavor: "\"Agora!\"",
  },
  "s23-j-866": {
    name: "Estilo Terra, Muralha de Lama",
    text: [
      "Alvo: 1 Jutsu de Fogo",
      "Efeito: Negue e descarte o alvo.",
    ],
    flavor: "\"Estilo Terra, Muralha de Lama!\"",
  },
  "s23-j-867": {
    name: "Jutsu de Expansão Parcial",
    text: [
      "Efeitos: Mova X cards da sua Pilha de Descartes para o fundo do seu Deck, em qualquer ordem. O Usuário ganha +X/+0 durante este turno.",
      "Combinação (\"Comida\"): Veja os 3 cards do topo do seu Deck, mova 1 para a sua mão e o resto para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Menos um...\"",
  },
  "s23-j-868": {
    name: "Kunai com Bomba de Fumaça",
    text: [
      "Efeito: Os Ninjas não podem causar Dano durante este turno. Se Raio foi usado para pagar este Jutsu, os seus Ninjas não são afetados por este efeito.",
    ],
    flavor: "\"Isso é...\"",
  },
  "s23-j-869": {
    name: "Costura de Sombra",
    text: [
      "Requerimentos: \"Sombra\" + Custo de Entrada 2 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Remova o alvo do jogo. O controlador do alvo pode comprar 2 cards.",
    ],
    flavor: "\"Professora Kurenai, pode se afastar?\"",
  },
  "s23-j-870": {
    name: "Lâmina de Relâmpago",
    text: [
      "Requerimentos: Kakashi Hatake",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Usuário ganha +Y/+0 durante este turno, onde Y = X vezes 2. Se Raio foi usado para pagar este Jutsu, cause 2 Dano ao alvo.",
    ],
    flavor: "\"Lâmina de Relâmpago!\"",
  },
  "s23-j-871": {
    text: [
      "Requerimentos: Kakashi Hatake ou Itachi Uchiha",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Cause 2 Dano ao alvo. Depois, se o seu oponente tiver mais Ninjas que você, mova este Jutsu para a sua mão.",
    ],
  },
  "s23-j-872": {
    name: "Estilo Fogo, Jutsu Disparo de Biscoitos",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: No final do turno, se o alvo foi ferido ou recebeu Dano durante o Showdown, descarte-o.",
    ],
    flavor: "\"Nós cuidamos do cachorro!\"",
  },
  "s23-j-873": {
    name: "Presa sobre Presa",
    text: [
      "Requerimentos: \"Animal\"",
      "Efeito: O seu oponente move X cards do topo do Deck dele para a Pilha de Descartes dele. Enquanto X for maior que 5, este Jutsu não pode ser negado nem afetado por Jutsus.",
    ],
    flavor: "\"Presa sobre Presa!\"",
  },
  "s23-j-874": {
    name: "Jutsu Corrida da Fera Relâmpago",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Efeito: Coloque este card no Time do Usuário, em qualquer posição, com o seguinte: \"[Poder: 3/3 (Saudável e Ferido)][Válido: Quando este Ninja for retirado de jogo, cause 1 Dano a 1 Ninja][Válido: No final do turno, mova este Ninja para a área de Chakra do Dono Original dele]\".",
    ],
    flavor: "Como você vai rebater isso?",
  },
  "s23-j-875": {
    name: "Arte do Sábio, Jutsu Anfíbio",
    text: [
      "Efeito: Descarte 1 dos seus Ninjas. Coloque X Marcadores +1/+1 no Usuário, onde X = o Custo de Entrada do Ninja descartado. Depois, se X for maior que 3, compre 2 cards.",
    ],
    flavor: "\"Significa simplesmente ficar levemente preso ao seu ombro ou às suas costas.\"",
  },
  "s23-j-876": {
    name: "Corrente de Ferro",
    text: [
      "Requerimentos: \"Arma\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O alvo recebe -3/-3, e o texto de efeito dele é negado.",
    ],
    flavor: "Entendi! Essa é a habilidade dele!",
  },
  "s23-j-877": {
    name: "Clone das Sombras do Estilo Raio",
    text: [
      "Efeito: Se o Usuário for receber qualquer Dano durante este turno, em vez disso, previna esse Dano. Depois, fira 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "Um Clone das Sombras do Estilo Raio!",
  },
  "s23-j-878": {
    name: "Estilo Raio, Armadilha dos Quatro Pilares",
    text: [
      "Alvo: Todos os Ninjas não enfrentados",
      "Efeito: O alvo não pode ganhar nenhum Prêmio de Batalha durante este turno. Se o alvo estiver sozinho num Time, fira-o.",
    ],
  },
  "s23-j-879": {
    text: [
      "Requerimentos: Jiraiya ou O Quarto Hokage ou Naruto Uzumaki + \"Estado de Clone\" ou Konohamaru + \"Estado de Clone\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Usuário ganha +X/+0 durante este turno, onde X = o Custo de Entrada do alvo. Depois, mova o alvo para o topo do Deck do Dono Original dele.",
    ],
    flavor: "\"Rasengan!\"",
  },
  "s23-j-880": {
    name: "Chakra Líquido",
    text: [
      "Requerimentos: \"Ninjutsu\"",
      "Alvo: 2 Ninjas do mesmo Time",
      "Efeito: O Combate de 1 dos alvos passa a ser 0 e o Suporte do outro passa a ser 0 durante este turno.",
    ],
    flavor: "\"Como você pode ver, até o meu Chakra é podre.\"",
  },
  "s23-j-881": {
    name: "Chicote de Água",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário.",
      "Efeito: O seu oponente descarta 1 card aleatório da mão. O alvo recebe -X/-X durante este turno, onde X = o Custo de Entrada do card descartado (Jutsus são considerados como tendo Custo de Entrada 0).",
    ],
    flavor: "\"Não podemos deixar a vila esperando mais.\"",
  },
  "s23-j-882": {
    name: "Teia Grudenta",
    text: [
      "Enquanto este card estiver na sua Pilha de Descartes, ele pode ser jogado como se estivesse na sua mão.",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O alvo recebe -2/-2 durante este turno. Se este Jutsu foi jogado da sua Pilha de Descartes, remova-o do jogo.",
    ],
    flavor: "\"Corda bamba de aranha gigante?\"",
  },
  "s23-j-883": {
    name: "Arte Ninja, Chuva do Rancor",
    text: [
      "Efeito: Cada jogador descarta 1 Chakra para cada Ninja que tiver no Campo de Batalha.",
    ],
    flavor: "\"Arte Ninja, Chuva do Rancor.\"",
  },
  "s23-j-884": {
    name: "Lâmina de Vento",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo. Se Água foi usada para pagar este Jutsu, o Poder do alvo passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Jutsu Lâmina de Vento!\"",
  },
  "s23-j-885": {
    name: "Varredura Mental",
    text: [
      "Alvo: 1 Jutsu",
      "Efeito: O seu oponente revela a mão. Se ele revelar um card que não seja de Ninja e que compartilhe um Símbolo com o alvo, negue o alvo e devolva-o à mão do Dono Original dele. Depois, compre 1 card.",
    ],
    flavor: "\"O Inoichi é mesmo incrível!\"",
  },
  "s23-j-886": {
    name: "Transmissão de Chakra de Cura",
    text: [
      "Requerimentos: \"Médico\"",
      "Efeito: Coloque um Marcador +1/+1 em cada um dos seus Ninjas Saudáveis. Depois, cure todos os seus Ninjas feridos.",
      "Especialista (Tsunade): Compre 1 card para cada Ninja que você curou por este efeito.",
    ],
    flavor: "O estrago é devastador...",
  },
  "s23-j-887": {
    name: "Golpe de Misericórdia",
    text: [
      "Requerimentos: \"Rinnegan\" + \"Ninjutsu\" + Custo de Entrada 2 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se o alvo estiver ferido, remova-o do jogo. Se não, fira o alvo.",
    ],
    flavor: "\"Hunf... Conheça a dor.\"",
  },
  "s23-j-888": {
    name: "Empurrão Onipotente",
    text: [
      "Requerimentos: Pain (Caminho Deva)",
      "Alvo: X Ninjas",
      "Efeito: Devolva o alvo à mão do Dono Original dele.",
    ],
    flavor: "\"Este mundo vai conhecer a dor...\"",
  },
  "s23-j-889": {
    name: "Barreira de Absorção",
    text: [
      "Requerimentos: \"Rinnegan\"",
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo se o custo dele for X ou menos. Depois, o Usuário ganha +X/+X durante o turno.",
    ],
    flavor: "\"Esse cara... Ele absorveu o Jutsu!\"",
  },
  // ── MISSÃO ──
  "s23-m-817": {
    name: "Encurralado!",
    text: [
      "Efeito: Se o seu oponente tiver mais Ninjas que você, você pode procurar no seu Deck um card de Ninja de Terra com Custo de Entrada menor que o seu Marcador de Turnos, revelá-lo e movê-lo para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"O-O que é aquilo?!\"",
  },
  "s23-m-818": {
    name: "Extração de Informações",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Anexe esta Missão ao alvo. Quando o alvo for retirado de jogo, o controlador do alvo descarta 2 cards.",
    ],
    flavor: "\"Vou soltar a sua língua.\"",
  },
  "s23-m-819": {
    name: "Humor Sombrio",
    text: [
      "Permanente (2)",
      "Alvo: 1 Ninja",
      "Efeito: Quando esta Missão for colocada em jogo, compre 1 card.",
      "Efeito: Todos os Ninjas do Time do alvo recebem -2/-2.",
    ],
    flavor: "\"Não fique tão deprimido.\"",
  },
  "s23-m-820": {
    name: "Traição",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Descarte o alvo. Nesse caso, compre X cards. X = o Custo de Entrada do alvo.",
    ],
    flavor: "\"Nós queremos que o Shikamaru vença. Não importa como.\"",
  },
  "s23-m-821": {
    name: "Decifrando a Mensagem",
    text: [
      "Permanente (3)",
      "[Atacante | Missão] Diga um tipo de card e depois revele o card do topo do seu Deck: Se o card revelado for do tipo dito, mova-o para a sua mão.",
    ],
    flavor: "\"Você não disse uma palavra. Está vendo alguma coisa, não está?\"",
  },
  "s23-m-822": {
    name: "Postura Defensiva",
    text: [
      "Permanente",
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Anexe esta Missão ao alvo. O alvo ganha +1/+1.",
      "[Troca de Jutsu] (Terra): Da próxima vez que o alvo for receber Dano durante este turno, em vez disso, cause essa mesma quantidade de Dano, menos 1.",
    ],
    flavor: "\"Abaixe-se!\"",
  },
  "s23-m-823": {
    name: "O Homem que Morreu Duas Vezes",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Anexe esta Missão ao alvo. Quando o alvo for ser retirado de jogo, em vez disso, mova-o para a sua mão. Depois, se o alvo tinha Custo de Entrada 5 ou mais, cause 1 Dano a 1 Ninja.",
    ],
    flavor: "\"A sua casa pegou fogo faz um bom tempo.\"",
  },
  "s23-m-824": {
    name: "Patriarca",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Procure no seu Deck 1 Ninja que compartilhe um Atributo de Combate com o alvo, revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Bem... Pai...\"",
  },
  "s23-m-825": {
    name: "Lampejo de Vida",
    text: [
      "Permanente (2)",
      "Efeito: Quando um Ninja for colocado em jogo, fira-o.",
    ],
    flavor: "Bem... parece que para mim também acabou.",
  },
  "s23-m-826": {
    name: "Momentos Finais",
    text: [
      "Permanente",
      "Efeito: Quando 1 dos seus Ninjas for descartado por causa do Showdown, você pode comprar 1 card.",
    ],
    flavor: "Eu não consegui.",
  },
  "s23-m-827": {
    name: "O Falcão de Guerra",
    text: [
      "Efeito: O seu oponente ganha 2 Prêmios de Batalha. Nesse caso, compre 4 cards.",
    ],
    flavor: "\"Eles são tão inúteis.\"",
  },
  "s23-m-828": {
    name: "Discussão Acalorada",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Anexe esta Missão ao alvo. O alvo ganha +1/+1 para cada outro Ninja que você controla. Quando esta Missão for retirada de jogo, compre 2 cards.",
    ],
    flavor: "\"O quê?! O que você está fazendo?!\"",
  },
  "s23-m-829": {
    name: "Imóvel",
    text: [
      "Permanente",
      "Efeito: Quando um jogador jogar um card de Jutsu, mova esta Missão para a área de Chakra do Dono Original dela. Nesse caso, o oponente desse jogador compra 3 cards.",
    ],
    flavor: "\"Naruto... Eu nem percebi ele.\"",
  },
  "s23-m-830": {
    name: "O Sábio Retorna",
    text: [
      "Efeito: Procure no seu Deck 1 Ninja \"Sapo Ninja\", revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck. Se você controlar um Ninja com Senjutsu e o Custo de Entrada desse Ninja for menor que o seu Marcador de Turnos, coloque-o em jogo.",
    ],
  },
  "s23-m-831": {
    name: "Lámen Ichiraku",
    text: [
      "Anulação",
      "Efeito: Os seus Ninjas e Missões não podem ser retirados de jogo pelos efeitos do seu oponente durante este turno.",
    ],
    flavor: "\"Tio, mais uma, por favor!\"",
  },
  "s23-m-832": {
    name: "Recepção de Herói",
    text: [
      "Efeito: Cada jogador escolhe aleatoriamente 1 dos Ninjas dele e o retira do Time. Os dois Ninjas devem ser enviados para a Batalha sozinhos durante este turno e devem ser enfrentados. Quando qualquer um desses Ninjas conseguir qualquer Vitória neste turno, o controlador desse Ninja compra 2 cards e ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Você mostrou ao Sasuke direitinho!\"",
  },
  "s23-m-833": {
    name: "O Tesouro do Senhor Feudal",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: O alvo ganha +2/+2.",
      "[Troca de Jutsu] Mova esta Missão para a área de Chakra do Dono Original dela: O alvo ganha +5/+5 durante este turno.",
    ],
    flavor: "\"Não acredito que eles roubaram uma coisa idiota dessas.\"",
  },
  "s23-m-834": {
    name: "Aposta",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: O alvo deve ser bloqueado neste turno. Se o alvo conseguir qualquer Vitória durante este turno, você pode comprar 2 cards. Se o alvo sofrer qualquer Derrota, descarte 1 card.",
    ],
    flavor: "\"Quem vocês acham que vai ganhar, rapazes?\"",
  },
  "s23-m-835": {
    name: "Luta",
    text: [
      "Anulação",
      "Alvo: 1 Missão não Permanente",
      "Efeito: Copie o efeito do alvo (Escolha novos alvos válidos, se houver).",
    ],
    flavor: "\"Por que você está rangendo tanto os dentes?\"",
  },
  "s23-m-836": {
    name: "Personagens Suspeitos",
    text: [
      "Efeito: Procure no seu Deck 4 cards de Ninja com nomes diferentes e revele-os. O seu oponente escolhe 2 desses cards. Mova os cards escolhidos para a sua mão e descarte os outros. Depois, embaralhe o seu Deck.",
    ],
    flavor: "É o bando de ladrões!",
  },
  "s23-m-837": {
    name: "Escondido",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Anexe esta Missão ao alvo. O alvo recebe -3/-3. Quando o alvo for retirado de jogo, o controlador dele descarta 2 Chakras.",
    ],
    flavor: "\"Vamos nos dividir em dois times e esperar por eles de tocaia.\"",
  },
  "s23-m-838": {
    name: "Contemplação",
    text: [
      "Permanente",
      "Efeito: Quando um Ninja for descartado, o controlador dele descarta 2 Chakras.",
      "Efeito: Enquanto o seu oponente não tiver Chakras, os seus cards de Jutsu custam (1) a menos.",
    ],
    flavor: "\"Esse lugar é reservado para mim.\"",
  },
  "s23-m-839": {
    name: "Os Foras da Lei se Reúnem",
    text: [
      "Efeito: Revele os 4 cards do topo do seu Deck. Mova para a sua mão os cards de Ninja \"Ninjas Renegados\" revelados. Mova o resto para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Então, qual é o plano?\"",
  },
  "s23-m-840": {
    name: "Vingança",
    text: [
      "Permanente",
      "Efeito: Anexe esta Missão ao Ninja do seu oponente que tiver o maior Custo de Entrada entre os Ninjas dele.",
      "Efeito: Quando o Ninja anexado for retirado de jogo, compre 3 cards.",
    ],
    flavor: "\"Não, parece ser uma vingança.\"",
  },
  "s23-m-841": {
    name: "Flutuando",
    text: [
      "Permanente (3)",
      "Efeito: Quando esta Missão for colocada em jogo, compre 1 card.",
      "Efeito: Quando você for comprar um card durante a sua Fase Inicial, em vez disso, veja os 2 cards do topo do seu Deck, mova 1 deles para a sua mão e o outro para o fundo do seu Deck.",
    ],
    flavor: "\"Uau...\"",
  },
  "s23-m-842": {
    name: "Arrependimento",
    text: [
      "Permanente (2)",
      "Efeito: Quando qualquer um dos seus Ninjas for retirado de jogo, procure no seu Deck um card de Ninja com o mesmo nome desse Ninja, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"O que eu estou dizendo é que você é quem deveria ser Hokage.\"",
  },
  "s23-m-843": {
    name: "A Morte de um Mestre",
    text: [
      "Efeito: Compre 3 cards.",
    ],
  },
  "s23-m-844": {
    name: "Laudo da Autópsia",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Quando o alvo ganhar qualquer Prêmio de Batalha, o controlador dele compra 1 card.",
    ],
    flavor: "\"Um receptor, ou eles usam isso para transmitir chakra uns aos outros.\"",
  },
  "s23-m-845": {
    name: "Os Seis Caminhos",
    text: [
      "Permanente (3)",
      "Efeito: Quando você Sacrificar um Ninja, coloque um marcador nesta Missão.",
      "Efeito: O tamanho máximo de Time de cada jogador é 1.",
    ],
    flavor: "\"Aja antes que fique mais difícil.\"",
  },
  "s23-m-846": {
    name: "Invasão",
    text: [
      "Efeito: Compre 1 card. Depois, compre 1 card para cada Ninja com Sacrifício que você tiver.",
    ],
    flavor: "\"Dispersar!\"",
  },
};
