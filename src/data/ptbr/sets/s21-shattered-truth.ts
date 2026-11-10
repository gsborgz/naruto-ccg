import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S21 — Shattered Truth, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s21-shattered-truth.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Mission | EOJ]` viram `[Válido | Atacante | Missão | Troca de Jutsu]`.
 */
export const S21_SHATTERED_TRUTH_PTBR: CardTranslations = {
  // ── NINJA ──
  "s21-n-1102": {
    text: [
      "[PUNHO FLAMEJANTE]",
      "Enquanto este Ninja estiver Em Combate contra um Ninja de Raio, este Ninja ganha +2/+0 durante o turno e não é afetado por efeitos de Ninjas de Raio.",
    ],
    flavor: "\"Não dizem que não há nada mais assustador que rancor por causa de comida?\"",
  },
  "s21-n-1103": {
    name: "Deidara (Juventude)",
    text: [
      "[TERRORISTA]",
      "[Válido | Atacante | Missão] (2): Jogue a Moeda Ninja. Se der cara, cause 1 Dano a 1 dos Ninjas do seu oponente. Se não, o seu oponente causa 1 Dano a 1 dos seus Ninjas.",
      "Válido: Os cards de Ninja \"Deidara\" na sua mão ganham \"Crescimento\".",
    ],
    flavor: "\"Não zombe de mim... nem da minha arte!\"",
  },
  "s21-n-1104": {
    name: "Tenzo (Época da Anbu)",
    text: [
      "[DIAS PASSADOS]",
      "Não Único",
      "Válido: Durante o Showdown, enquanto você não tiver baixado um Ninja neste turno, este Ninja ganha +2/+1 durante este turno.",
    ],
    flavor: "\"Não foi nada.. cof cof... Estou bem... cof...\"",
  },
  "s21-n-1105": {
    name: "Deidara (Forma C0)",
    text: [
      "[O FIM]",
      "Sacrifício: \"Deidara\" e 3 dos seus Marcadores de Crescimento",
      "[Válido | Atacante | Missão] (Terra|Terra|Terra): Coloque um Marcador de \"Argila\" em 1 dos seus Ninjas.",
      "[Válido | Atacante | Missão] Descarte este Ninja: Cause 2 Dano a todos os Ninjas sem Marcador de \"Argila\" e depois remova do jogo todos os Marcadores de \"Argila\".",
    ],
    flavor: "\"Chore até cansar!!!\"",
  },
  "s21-n-1106": {
    text: [
      "[COMERCIANTE]",
      "[Atacante | Missão] Descarte este Ninja: Ninjas podem ser baixados da sua Pilha de Descartes durante este turno.",
      "Este Ninja ganha +1/+0 para cada um dos seus Ninjas.",
    ],
    flavor: "\"Trouxe presentes, miau?\"",
  },
  "s21-n-1107": {
    text: [
      "[COMERCIANTE]",
      "[Atacante | Missão] Descarte este card da sua mão: Descarte uma Missão ou um Cliente.",
      "Este Ninja ganha +1/+0 para cada um dos seus Ninjas.",
    ],
    flavor: "\"O que te traz aqui, miau?\"",
  },
  "s21-n-1108": {
    text: [
      "[AMEAÇA CRESCENTE]",
      "Não Único",
      "[Atacante | Missão] Coloque este card de Ninja em jogo a partir da sua mão: Todos os seus Ninjas \"Anbu\" ganham +1/+1 durante este turno.",
    ],
    flavor: "\"Não devíamos dar apoio?\"",
  },
  "s21-n-1109": {
    name: "O Terceiro Hokage (Juventude)",
    text: [
      "[O PROFESSOR]",
      "Quando este Ninja for colocado em jogo, coloque 3 Marcadores -1/-1 neste Ninja.",
      "Válido: Quando qualquer um dos seus Ninjas se tornar o Usuário de um Jutsu, remova um Marcador -1/-1 deste Ninja. Nesse caso, coloque um Marcador -1/-1 em 1 dos Ninjas do seu oponente.",
    ],
    flavor: "\"Talvez o que falte a você seja um propósito...\"",
  },
  "s21-n-1110": {
    text: [
      "[AMEAÇA OCULTA]",
      "Não Único",
      "[Atacante | Missão] Coloque este card de Ninja em jogo a partir da sua mão: Todos os seus Ninjas \"Anbu\" não podem receber Dano durante este turno.",
    ],
    flavor: "\"Não tão comum assim, hein?\"",
  },
  "s21-n-1111": {
    text: [
      "[IMORTAL?]",
      "Válido: Este Ninja não pode ser bloqueado por Ninjas com Marcadores -1/-1",
    ],
  },
  "s21-n-1112": {
    name: "Kakashi Hatake (Época da Anbu)",
    text: [
      "[AÇÕES PASSADAS]",
      "[Atacante | Troca de Jutsu] Baixe este card de Ninja da sua mão: Se você tiver 2 ou mais Ninjas \"Anbu\", mova este Ninja para qualquer um dos seus Times, em qualquer posição (Isso conta como o seu Ninja baixado no turno).",
    ],
  },
  "s21-n-1113": {
    text: [
      "[O ESCUDO SUPREMO]",
      "[Válido | Troca de Jutsu] Dê 3 Prêmios de Batalha ao seu oponente: Coloque em jogo 1 card de Ninja \"Susano'o\" do seu Baralho de Reforço.",
      "Válido: Enquanto você tiver \"Susano'o\" em jogo, este Ninja não pode receber Dano nem ser ferido pelos efeitos do seu oponente.",
    ],
    flavor: "\"Vou mostrar a você o meu último trunfo...\"",
  },
  "s21-n-1114": {
    text: [
      "[DEFESA IMPENETRÁVEL]",
      "Válido: O seu oponente não pode vencer o jogo por Prêmios de Batalha e você não pode perder o jogo por Prêmios de Batalha. Este efeito não pode ser negado.",
    ],
  },
  "s21-n-1115": {
    text: [
      "[VIRTUOSO]",
      "Quando este Ninja for colocado em jogo, você pode comprar 1 card para cada Ninja \"Tinta\" e Ninja de Invocação de Tinta que você tiver.",
    ],
  },
  "s21-n-1116": {
    text: [
      "[CUIDADO MATERNO]",
      "Válido: Enquanto você tiver um \"Naruto Uzumaki\", este Ninja ganha +1/+1.",
      "Válido: Todos os seus cards de Ninja \"Besta com Caudas\" e cards de Ninja \"Animal\" com Custo de Entrada impresso 7 ou mais ganham -2 de Custo de Entrada e -1 de Custo de Mão.",
    ],
    flavor: "\"Naruto... É um nome maravilhoso.\"",
  },
  "s21-n-1117": {
    text: [
      "[ALUNO EXEMPLAR]",
      "Válido: Enquanto 3 ou mais Jutsus tiverem sido jogados neste turno, os seus cards de Jutsu não podem ser negados.",
    ],
    flavor: "\"O que foi, Mestre Guy?\"",
  },
  "s21-n-1118": {
    text: [
      "[POTENCIAL MÁXIMO]",
      "Válido: Quando este Ninja for colocado em jogo pelo efeito de Crescimento, coloque um Marcador de Crescimento adicional neste Ninja.",
      "Válido: Este Ninja pode Crescer mesmo que já tenha um Marcador de Crescimento.",
    ],
    flavor: "\"Isso acaba agora!!\"",
  },
  "s21-n-1119": {
    text: [
      "[O SÁBIO GALANTE]",
      "Válido: Quando este Ninja for colocado em jogo, procure no seu Deck 1 card de Ninja \"Sapo Ninja\", revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Naruto, você é a criança da profecia.\"",
  },
  "s21-n-1120": {
    text: [
      "[APRENDIZ DA COBRA]",
      "Válido: Os seus Chakras de Água são considerados como tendo também Símbolo de Raio.",
      "Válido: Os seus Chakras de Raio são considerados como tendo também Símbolo de Água.",
    ],
    flavor: "\"O que foi?\"",
  },
  "s21-n-1121": {
    name: "Corporação Ninja Konohamaru",
    text: [
      "[LÍDERES DO FUTURO]",
      "Válido: Enquanto um card de Ninja na sua Pilha de Descartes tiver Maestria, este Ninja é considerado como tendo Maestria.",
    ],
  },
  "s21-n-1122": {
    text: [
      "[O RELÂMPAGO AMARELO]",
      "[Válido | Troca de Jutsu] (1): Cause 1 Dano ao Ninja alvo Em Combate contra este Ninja. Depois, este Ninja passa a ser um Ninja Reserva.",
    ],
  },
  "s21-n-1123": {
    name: "Naruto Uzumaki & O Quarto Hokage",
    text: [
      "[PAI E FILHO]",
      "Válido: Quando este Ninja for colocado em jogo, cause 1 Dano a todos os Ninjas do seu oponente.",
      "Válido: Quando este Ninja for retirado de jogo por causa do Showdown, cure todos os Ninjas do seu oponente.",
    ],
    flavor: "\"Eu acredito em você.\" \"Sou filho do Quarto Hokage... eu dou conta.\"",
  },
  "s21-n-1124": {
    text: [
      "[ESPIÃ LUMINESCENTE]",
      "Quando este Ninja conseguir qualquer Vitória, o seu oponente revela um card aleatório da mão.",
      "Nesse caso, se esse card tiver Símbolo de Vento, descarte-o.",
    ],
    flavor: "\"Você é idiota!?\"",
  },
  "s21-n-1125": {
    text: [
      "[LÂMINA AFIADA]",
      "[Válido | Troca de Jutsu] (*): Este Ninja ganha +1/+0 durante este turno para cada Chakra de Água que você tiver.",
    ],
    flavor: "\"Vocês não deviam nos subestimar.\"",
  },
  "s21-n-1126": {
    text: [
      "[VIGOR RANCOROSO]",
      "Válido: Quando este Ninja receber qualquer Dano ou for ferido, coloque um Marcador de Crescimento nele.",
    ],
    flavor: "\"Pare com isso.\"",
  },
  "s21-n-1127": {
    name: "Sakon (Estado 1)",
    text: [
      "[PUNHO DA ESQUERDA]",
      "Quando este Ninja for colocado em jogo, você pode descartar um card. Nesse caso, procure no seu Deck um card de Ninja \"Os Quatro Ninjas do Som\", revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Sente o poder?\"",
  },
  "s21-n-1128": {
    name: "Ukon (Estado 1)",
    text: [
      "[PUNHO DA DIREITA]",
      "Quando este Ninja for colocado em jogo, se você controlar outro Ninja \"Os Quatro Ninjas do Som\", pode colocar em jogo 1 card de Ninja \"Os Quatro Ninjas do Som\" com Custo de Entrada 3 ou menos da sua área de Chakra.",
    ],
    flavor: "\"Dois contra dois. Por mim, tudo bem.\"",
  },
  "s21-n-1129": {
    text: [
      "[VINGANÇA AVASSALADORA]",
      "[Atacante | Missão] (0): Você pode descartar X Chakras para descartar X Chakras do seu oponente.",
    ],
  },
  "s21-n-1130": {
    text: [
      "[INAMOVÍVEL]",
      "Não Único",
      "Válido: Este Ninja não pode ser enviado para Atacar.",
      "Válido: Quando 1 dos seus Ninjas \"Os Quatro Ninjas do Som\" for receber Dano, você pode descartar este card de Ninja. Nesse caso, reduza esse Dano a 0.",
    ],
    flavor: "\"Bum!\"",
  },
  "s21-n-1131": {
    name: "Sakon & Ukon (Estado 2)",
    text: [
      "[PROBLEMA EM DOBRO]",
      "Sacrifício: Sakon (Estado 1) e Ukon (Estado 1)",
      "[Atacante | Missão] (*)(*), escolha 1 dos Ninjas do seu oponente e 1 dos seus Ninjas \"Os Quatro Ninjas do Som\": Retire os Ninjas escolhidos dos seus Times. Esses Ninjas devem ser enviados para a Batalha sozinhos e devem enfrentar um ao outro durante este turno.",
    ],
    flavor: "\"Alfa!\" \"Ômega!\"",
  },
  "s21-n-1132": {
    text: [
      "[REMOÇÃO DE BESTA COM CAUDAS]",
      "[Válido | Atacante | Missão] Descarte este Ninja: Mova o Ninja \"Animal\" alvo com Custo de Entrada 7 ou mais para a sua Vila. Agora você controla esse Ninja.",
    ],
    flavor: "\"Um ninja nunca foge de uma batalha que precisa ser travada.\"",
  },
  "s21-n-1133": {
    text: [
      "[MURALHA DE BOLHAS]",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 Chakras de Vento. Nesse caso, compre 2 cards.",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 Chakras de Água. Nesse caso, descarte 2 Chakras do seu oponente e compre 1 card.",
    ],
    flavor: "\"Você está brincando comigo?\"",
  },
  "s21-n-1134": {
    text: [
      "[O SEGREDO DOS TSUCHIGUMO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja. Se der cara, compre 1 card. Se der coroa, coloque um Marcador de Crescimento neste Ninja.",
    ],
    flavor: "\"Eu quero ficar forte.\"",
  },
  "s21-n-1135": {
    text: [
      "[BRINCALHONA]",
      "[Válido | Atacante | Missão] Fira este Ninja, descarte 1 card de Vento: Compre 1 card, e este Ninja ganha o seguinte texto de efeito durante este turno: \"Válido: No final do turno, cure este Ninja\".",
    ],
    flavor: "\"Este chakra parece...\"",
  },
  "s21-n-1136": {
    name: "Konan (Infância)",
    text: [
      "[ORIGAMI]",
      "[Válido | Troca de Jutsu] Fira este Ninja: Fira o Ninja adversário alvo com Custo de Entrada igual ao Custo de Entrada deste Ninja.",
    ],
    flavor: "\"Ele estava morrendo...\"",
  },
  "s21-n-1137": {
    name: "Salamandra",
    text: [
      "[GUERREIRO DE AÇO]",
      "Não Único",
      "Enquanto o Time deste Ninja tiver um Ninja \"Manipulação\", este Ninja ganha os seguintes efeitos:",
      "\"O valor de Combate deste Ninja também é considerado o valor de Suporte dele.\"",
      "\"Quando qualquer um dos seus Ninjas for ser ferido ou receber Dano, você pode, em vez disso, causar 1 Dano a este Ninja.\"",
    ],
  },
  "s21-n-1138": {
    text: [
      "[VENTOS FEROZES]",
      "Quando este Ninja for baixado, mova 1 Ninja \"Arma\" da sua Pilha de Descartes para a sua mão.",
      "Válido: Os Ninjas \"Arma\" ganham +1/+0.",
    ],
    flavor: "\"Nós vamos!\"",
  },
  "s21-n-1139": {
    text: [
      "[GUERREIRO DA GUARDA VERMELHA]",
      "Quando este Ninja for colocado em jogo, se você tiver um Ninja \"Manipulação\", pode retirar dois Ninjas alvo do seu oponente dos Times atuais deles e formar um novo Time com eles.",
    ],
    flavor: "\"É a marionete favorita do Sasori.\"",
  },
  "s21-n-1140": {
    text: [
      "[TÉCNICAS SECRETAS]",
      "Válido: Este Ninja só pode formar Times com Ninjas \"Marionete\".",
      "[Troca de Jutsu] (1): Se você tiver 5 ou mais cards na mão, troque os valores de Combate e de Suporte de 1 dos Ninjas do seu oponente durante este turno.",
    ],
    flavor: "\"Vamos começar?\"",
  },
  "s21-n-1141": {
    name: "O 3º Kazekage",
    text: [
      "[MARIONETE PRECIOSA]",
      "Válido: Quando um Ninja do oponente for ser movido para a mão dele por um efeito, você pode, em vez disso, movê-lo para a sua área de Prêmios de Batalha, com a face para baixo.",
    ],
    flavor: "\"Fuuush!\"",
  },
  "s21-n-1142": {
    text: [
      "[RÉQUIEM]",
      "O Suporte e o Poder Mental dos Ninjas do seu oponente com Custo de Entrada igual ao número de cards na sua mão são 0.",
      "Válido: X é igual ao número de cards na sua mão.",
      "Válido: Você não tem tamanho máximo de mão.",
    ],
    flavor: "\"Se você vai jogar desse jeito, acho que não me deixa escolha.\"",
  },
  "s21-n-1143": {
    name: "Seis Caudas",
    text: [
      "[SEIS CAUDAS]",
      "Válido: X = o número de cards na sua mão. Este efeito não pode ser negado.",
      "Válido: No início do seu turno, compre 2 cards.",
    ],
  },
  "s21-n-1144": {
    name: "Panda Gigante",
    text: [
      "[CRIA DE PAIN]",
      "Válido: Quando qualquer um dos seus Ninjas \"Vazio\" for ser ferido ou receber qualquer Dano, você pode, em vez disso, causar 1 Dano a este Ninja.",
      "Válido: Quando este Ninja Bloquear, este Ninja ganha +1/+1 durante este turno.",
    ],
  },
  "s21-n-1145": {
    text: [
      "[ANEL DIREITO DE GAI]",
      "Quando este Ninja for colocado em jogo ou retirado de jogo, veja a mão do seu oponente.",
    ],
    flavor: "\"A única coisa em que você tem fé é você mesmo.\"",
  },
  "s21-n-1146": {
    text: [
      "[AURORA DA VINGANÇA]",
      "Quando este Ninja for colocado em jogo, procure no seu Deck 1 card com \"Mundo\" no nome, revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"Ei! Você está vivo!\"",
  },
  "s21-n-1147": {
    text: [
      "[ANEL DIREITO DE BYA]",
      "Quando um Ninja de Vazio for Sacrificado, coloque em jogo 1 card de Ninja de Vazio da sua mão com Custo de Entrada menor que o do Ninja Sacrificado.",
    ],
    flavor: "\"Eu também vou acreditar em você.\"",
  },
  "s21-n-1148": {
    text: [
      "[ANEL ESQUERDO DE GYOKU]",
      "Quando este Ninja for colocado em jogo, você pode trocar X cards de Vazio da sua mão por X cards do fundo do seu Deck.",
    ],
    flavor: "\"Faz mesmo um bom tempo... desde a última vez que usei a mim mesmo.\"",
  },
  "s21-n-1149": {
    text: [
      "[ANEL DIREITO DE AOI]",
      "[Atacante | Missão] (2): Se você tiver apenas Ninjas de Vazio, cause 1 Dano a 1 dos Ninjas do seu oponente, a menos que o seu oponente avance o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Você está prestes a se tornar a minha maior obra-prima!\"",
  },
  "s21-n-1150": {
    text: [
      "[ANEL ESQUERDO DE NAN]",
      "Quando este Ninja Atacar num Time só com Ninjas de Vazio, você pode remover do jogo até 2 Chakras alvo. Depois, se o seu oponente tiver menos Chakras que você, avance o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Saber que é você quem dá as ordens facilita o meu trabalho.\"",
  },
  "s21-n-1151": {
    text: [
      "[ANEL DIREITO DE SHU]",
      "[Válido | Troca de Jutsu] Recue o seu Marcador de Turnos em X: negue 1 Jutsu com custo X.",
    ],
    flavor: "\"...é isso.\"",
  },
  "s21-n-1152": {
    name: "Pain (Caminho Deva)",
    text: [
      "[ANEL DIREITO DE REI]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Quando este Ninja conseguir qualquer Vitória, avance o seu Marcador de Turnos em 1 e recue o Marcador de Turnos do seu oponente em 1.",
      "Válido: Enquanto o seu Marcador de Turnos for par, o seu oponente só pode jogar 1 card de Jutsu durante o turno.",
    ],
    flavor: "\"E então se compreende a dor.\"",
  },
  "s21-n-1153": {
    text: [
      "[ANEL ESQUERDO DE HOKU]",
      "[Troca de Jutsu] (1): Aplique os efeitos a seguir conforme os Símbolos dos Chakras usados para pagar este efeito:",
      "Raio - Este Ninja ganha +2/+2 durante este turno.",
      "Vento - Cure o Ninja alvo.",
      "Outro - Este Ninja não pode receber Dano durante este turno.",
    ],
    flavor: "\"Só tome cuidado, ou você vai morrer.\"",
  },
  "s21-n-1154": {
    text: [
      "[ANEL ESQUERDO DE SAN]",
      "Quando um Ninja receber Dano do Time deste Ninja, coloque um Marcador -1/-1 nesse Ninja.",
    ],
    flavor: "\"Mas não é possível... hein?!\"",
  },
  // ── JUTSU ──
  "s21-n-1162": {
    name: "O 1º Hokage",
  },
  "s21-j-802": {
    name: "Arte Ninja: Shuriken de Telha",
    text: [
      "Este card de Jutsu custa (1) a menos para cada um dos seus Ninjas sem texto de efeito.",
      "Alvo: 1 Ninja",
      "Efeito: Anexe este card ao alvo. O texto de efeito do Ninja anexado é negado.",
    ],
    flavor: "\"Arte Ninja: Shuriken de Telha!\"",
  },
  "s21-j-803": {
    name: "Estilo Terra: Bomba do Dragão de Terra",
    text: [
      "Este card de Jutsu custa (1) a menos para cada um dos seus Ninjas sem texto de efeito.",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Fira o alvo. Depois, se o alvo não tiver texto de efeito ou tiver o texto de efeito negado, ele passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Estilo Terra! Bomba do Dragão de Terra!\"",
  },
  "s21-j-804": {
    name: "Andorinha Voadora",
    text: [
      "Requerimentos: Ninja sem texto de efeito",
      "Efeito: O Time do Usuário e o Time Em Combate contra o Usuário fazem uma Batalha Mental durante este turno.",
      "Combinação [Ninja sem texto de efeito]: O Usuário ganha +X de Poder Mental, onde X = o número dos seus Ninjas sem texto de efeito.",
    ],
  },
  "s21-j-805": {
    name: "Clone de Argila Autodestrutivo",
    text: [
      "Requerimentos: Deidara",
      "Efeito: Mova todos os Marcadores de Crescimento dos seus outros Ninjas para o Usuário. Depois, cause 1 Dano a cada Ninja adversário com menos Marcadores de Crescimento que o Usuário.",
    ],
    flavor: "\"Desta vez, acabou de verdade!\"",
  },
  "s21-j-806": {
    name: "Estilo Terra: Jutsu Caçador de Cabeças",
    text: [
      "Requerimentos: Deidara",
      "Efeito: Todos os Ninjas de Apoio do Time do Usuário e do Time Em Combate contra o Usuário passam a ser Ninjas Reserva. Depois, coloque 2 Marcadores de Crescimento no Usuário.",
    ],
    flavor: "\"Desta vez, acabou de verdade!\"",
  },
  "s21-j-807": {
    name: "Estilo Fogo: Jutsu Bola de Fogo",
    text: [
      "Se 1 dos Ninjas do seu oponente tiver se tornado o Usuário de um Jutsu durante este turno, reduza o custo deste card para (0).",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Se um Chakra de Fogo foi descartado para pagar este Jutsu, cause 1 Dano ao alvo. Se não, fira o alvo.",
    ],
    flavor: "\"Estilo Fogo! Jutsu Bola de Fogo!\"",
  },
  "s21-j-808": {
    name: "Envio da Anbu",
    text: [
      "Este card de Jutsu custa (1) a menos para cada um dos seus Ninjas \"Anbu\".",
      "Efeito: Coloque em jogo 1 card de Ninja \"Anbu\" da sua Pilha de Descartes no Time do Usuário, em qualquer posição.",
    ],
  },
  "s21-j-809": {
    name: "O Olho de Madara",
    text: [
      "Requerimentos: \"Olho Sharingan\"",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Coloque 2 Marcadores -1/-1 no alvo. Depois, se o Combate do alvo for 0 ou menos, compre 2 cards.",
    ],
  },
  "s21-j-810": {
    name: "Estilo Fogo: Jutsu Grandes Chamas do Dragão",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Depois, o seu oponente descarta os 5 cards do topo do Deck dele.",
      "Especialista [Sasuke Uchiha]: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Estilo Fogo! Arte da Chama do Dragão!\"",
  },
  "s21-j-811": {
    name: "Poder Avassalador",
    text: [
      "Requerimentos: Combate 6 ou mais",
      "Efeito: Você ganha 1 Prêmio de Batalha.",
    ],
  },
  "s21-j-812": {
    name: "Fúria Selvagem",
    text: [
      "Reduza o custo deste card de Jutsu em X, onde X = o Custo de Entrada do Usuário.",
      "Alvo: 1 Ninja",
      "Efeito: Cause 2 Dano ao alvo.",
    ],
    flavor: "\"Mas eu te imploro, me ajude\"",
  },
  "s21-j-813": {
    name: "Armadilha de Arame",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: O Poder do alvo passa a ser igual ao do Usuário durante este turno.",
    ],
  },
  "s21-j-814": {
    text: [
      "Você só pode jogar este card de Jutsu enquanto não tiver Chakras.",
      "Requerimento: Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Cause 2 Dano ao alvo. Enquanto este Jutsu estiver na Sequência, os jogadores não podem jogar cards.",
    ],
    flavor: "\"Desapareça com o trovão...\"",
  },
  "s21-j-815": {
    text: [
      "Requerimentos: Sasuke Uchiha",
      "Alvo: Até 2 Ninjas com Custo de Entrada menor que o do Usuário",
      "Efeito: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Haah!!\"",
  },
  "s21-j-816": {
    name: "Espada Serpente",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Efeito: Qualquer Ninja adversário que receber Dano por causa do Showdown neste turno recebe 1 Dano adicional.",
    ],
    flavor: "\"O bloqueio que você escolheu estava errado\"",
  },
  "s21-j-817": {
    name: "Estilo Água: Ondas Furiosas",
    text: [
      "Alvo: Os Ninjas do seu oponente com Custo de Entrada menor que o Custo de Entrada do Usuário.",
      "Efeito: O alvo não pode somar o seu Poder ao Poder do Time durante este turno.",
    ],
    flavor: "\"Estilo Água: Ondas Furiosas!\"",
  },
  "s21-j-818": {
    name: "Estilo Tsuchigumo: Liberação do Jutsu Proibido - Big Bang",
    text: [
      "Efeito: Carregue 1 card. Nesse caso, compre 2 cards.",
    ],
    flavor: "\"Estilo Tsuchigumo: Liberação do Jutsu Proibido!\"",
  },
  "s21-j-819": {
    name: "Jutsu Camaleão",
    text: [
      "Alvo: Usuário",
      "Efeito: Jogue a Moeda Ninja. Se der cara, o Usuário ganha +0/+4 durante este turno. Se der coroa, o Usuário ganha +0/+2 durante este turno e você compra 1 card.",
    ],
    flavor: "\"A Névoa Oculta?\"",
  },
  "s21-j-820": {
    name: "Abraço Infinito",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Jogue a Moeda Ninja. Se der cara, mova o alvo para a área de Chakra do Dono Original dele. Se der coroa, mova o alvo para a mão do Dono Original dele e compre 1 card.",
    ],
    flavor: "\"Você caiu nessa.\"",
  },
  "s21-j-821": {
    name: "Jutsu Barreira de Bolhas",
    text: [
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Negue e descarte o alvo, a menos que o seu oponente deixe você comprar 2 cards.",
    ],
  },
  "s21-j-822": {
    name: "Rajada de Senbon Envenenados",
    text: [
      "Requerimentos: \"Marionete\" ou \"Mestre de Marionetes\"",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Depois, jogue a Moeda Ninja. Se der cara, o alvo passa a ser um Ninja Reserva. Se der coroa, compre 1 card.",
      "Especialista [Hiruko]: Em vez disso, você escolhe o resultado da Moeda Ninja.",
    ],
    flavor: "\"Pakka kakka.\"",
  },
  "s21-j-823": {
    text: [
      "Requerimentos: \"Olho Sharingan\"",
      "Alvo: 1 Ninja",
      "Efeito: Fira o alvo. Depois, anexe este card ao alvo. O Ninja anexado ganha o seguinte texto de efeito: \"Válido: No início do seu turno, mova os 2 cards do topo do seu Deck para a sua Pilha de Descartes.\"",
    ],
    flavor: "\"Afinal, o que é essa coisa?\"",
  },
  "s21-j-824": {
    text: [
      "Requerimentos: \"Olho Sharingan\" + Custo de Entrada 5 ou mais",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Mova o alvo para o topo do Deck do Dono Original dele.",
      "Especialista [Itachi Uchiha]: Mova X cards do topo do Deck do seu oponente para a Pilha de Descartes dele, onde X = o Marcador de Turnos dele dividido por 2 (arredondado para baixo).",
    ],
    flavor: "\"Tsukuyomi, o reino dos pesadelos!\"",
  },
  "s21-j-825": {
    name: "Holograma",
    text: [
      "Requerimentos: \"Akatsuki\"",
      "Efeito: Procure no seu Deck 1 card de Ninja \"Akatsuki\" com Custo de Entrada menor que o seu Marcador de Turnos e mova-o para o Time do Usuário, em qualquer posição. Depois, mova o Usuário para o fundo do Deck do Dono Original dele.",
    ],
  },
  "s21-j-826": {
    name: "Jutsu de Selamento: Nove Dragões Fantasmas",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Remova o alvo do jogo. Depois, aplique os efeitos a seguir conforme o seu Marcador de Turnos:",
      "(3+) Descarte aleatoriamente 2 cards da mão do seu oponente.",
      "(6+) Descarte 2 Prêmios de Batalha do seu oponente.",
      "(9+) Você ganha 2 Prêmios de Batalha.",
    ],
  },
  // ── MISSÃO ──
  "s21-m-749": {
    name: "A Bênção de Raigo",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja sem texto de efeito com Custo de Entrada menor que o número total dos seus Ninjas sem texto de efeito, revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"O que você achou da técnica do Chiriku?\"",
  },
  "s21-m-750": {
    name: "Céu Limpo",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja de Terra com Custo de Entrada maior que o número de cards na mão do seu oponente, revele-o e mova-o para a sua mão.",
    ],
  },
  "s21-m-751": {
    name: "Time Guy",
    text: [
      "Permanente",
      "Efeito: No início do seu turno, revele o card do topo do seu Deck. Se for um Ninja sem texto de efeito, mova-o para a sua mão. Este efeito não pode ser duplicado.",
      "Efeito: Os seus Ninjas sem texto de efeito ganham +1/+0 e +1 de Poder Mental.",
    ],
  },
  "s21-m-752": {
    text: [
      "Permanente (1)",
      "Efeito: Quando esta Missão for colocada em jogo, coloque 1 marcador nela para cada um dos seus Ninjas sem texto de efeito.",
      "Efeito: O texto de efeito de todos os Ninjas que não sejam de Reforço nem de Esquadrão é negado.",
    ],
  },
  "s21-m-753": {
    name: "Mundo da Terra",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Terra, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique 1 dos efeitos a seguir conforme o número de marcadores removidos:",
      "1) O seu oponente revela um card aleatório da mão. Se for um card de Jutsu, descarte-o.",
      "6) Diga um tipo de card: o seu oponente revela a mão e descarta todos os cards do tipo dito.",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-754": {
    name: "Ataque da Anbu",
    text: [
      "Permanente",
      "Efeito: No final do seu turno, se você não baixou um Ninja neste turno, coloque um Marcador \"Anbu\" nesta Missão.",
      "Enquanto esta Missão tiver 2 ou mais Marcadores \"Anbu\", você pode baixar Ninjas durante a Troca de Jutsu.",
    ],
  },
  "s21-m-755": {
    name: "Mundo do Fogo",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Fogo, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique 1 dos efeitos a seguir conforme o número de marcadores removidos:",
      "1) O jogador alvo move os 2 cards do topo do Deck dele para a Pilha de Descartes dele.",
      "6) O jogador alvo move a metade de cima do Deck dele para a Pilha de Descartes dele. (arredondado para baixo).",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-756": {
    name: "Jardim dos Amassos",
    text: [
      "Efeito: Procure no seu Deck até 2 cards de Ninja com Custo de Entrada 1 ou menos, revele-os e mova-os para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Você acha que eu passei esse tempo todo só dormindo sem fazer nada?\"",
  },
  "s21-m-757": {
    name: "O Trono dos Uchiha",
    text: [
      "Efeito: O seu oponente move 1 card do topo do Deck dele para a Pilha de Descartes dele para cada card na área de Chakra dele.",
    ],
    flavor: "\"Quanto você consegue realmente ver?\"",
  },
  "s21-m-758": {
    name: "Últimas Palavras",
    text: [
      "Permanente",
      "Efeito: No final do seu turno, coloque um Marcador -1/-1 em 1 dos Ninjas do seu oponente.",
      "Efeito: No final do seu turno, você pode mover esta Missão para a sua área de Chakra. Nesse caso, descarte todos os Ninjas com 3 ou mais Marcadores -1/-1.",
    ],
    flavor: "\"É isso.\"",
  },
  "s21-m-759": {
    name: "Mundo do Raio",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Raio, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique 1 dos efeitos a seguir conforme o número de marcadores removidos:",
      "3) Coloque um Marcador +1/+1 em cada um dos seus Ninjas.",
      "6) Quando qualquer um dos seus Times conseguir qualquer Vitória durante este turno, você ganha 1 Prêmio de Batalha.",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-760": {
    name: "Olhar Nefasto",
    text: [
      "Permanente",
      "Efeito: No início do seu turno, revele o card do topo do seu Deck. Nesse caso, se o card revelado for um card de Ninja com Custo de Entrada impresso 6 ou mais, coloque esse card de Ninja em jogo. Mova esse Ninja para a sua mão no final deste turno. Se não, mova o card revelado para o fundo do seu Deck.",
    ],
  },
  "s21-m-761": {
    name: "Destinos que se Cruzam",
    text: [
      "Permanente",
      "Efeito: Todos os seus Ninjas de Raio ganham +1/+0.",
      "Efeito: [Atacante | Missão] (1): Mova até 3 cards de uma Pilha de Descartes para o fundo do Deck do Dono Original deles, em qualquer ordem.",
    ],
  },
  "s21-m-762": {
    name: "Existência Amaldiçoada",
    text: [
      "Efeito: No início do Showdown, você ganha 1 Prêmio de Batalha para cada um dos seus Times que tiver um Ninja com Custo de Entrada 7 ou mais.",
    ],
  },
  "s21-m-763": {
    name: "Novos Membros",
    text: [
      "Efeito: Descarte a sua mão e depois compre essa mesma quantidade de cards, mais 1.",
    ],
  },
  "s21-m-764": {
    name: "A Defesa do Rashomon",
    text: [
      "Permanente",
      "Efeito: Durante este turno, quando qualquer Batalha de um dos seus Times for terminar em Empate, em vez disso, ela é considerada uma Vitória para esse Time e uma Derrota para o Time Em Combate contra ele.",
      "Efeito: Quando 1 dos seus Times conseguir uma Vitória, mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Pum!\"",
  },
  "s21-m-765": {
    name: "A Maldição de Sasuke",
    text: [
      "Permanente (3)",
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Quando o alvo for receber qualquer Dano, em vez disso, passe esse Dano para 1 dos seus outros Ninjas.",
    ],
  },
  "s21-m-766": {
    name: "Jutsu Serpente de Oito Cabeças",
    text: [
      "Efeito: Mova 10 cards do topo do seu Deck para a sua Pilha de Descartes. Nesse caso, coloque em jogo até 2 cards de Ninja \"Cobra\" da sua Pilha de Descartes.",
    ],
    flavor: "\"Este é o Jutsu da Serpente de Oito Cabeças do Orochimaru.\"",
  },
  "s21-m-767": {
    name: "O Objetivo de Orochimaru",
    text: [
      "Permanente",
      "Efeito: Durante a sua Fase de Missão, você pode aplicar 1 dos efeitos a seguir conforme o número dos seus Ninjas \"Os Quatro Ninjas do Som\".",
      "2+) Todos os seus Ninjas \"Os Quatro Ninjas do Som\" ganham +1/+1 durante este turno.",
      "3+) Mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
      "4+) Mova um card de Missão de Água da sua área de Chakra para a sua mão.",
    ],
    flavor: "\"É isto que eu estava esperando!\"",
  },
  "s21-m-768": {
    name: "Mundo da Água",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Água, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique 1 dos efeitos a seguir conforme o número de marcadores removidos:",
      "1) Mova 1 card de Ninja da sua Pilha de Descartes para a sua área de Chakra.",
      "5) Descarte todos os Chakras de cada jogador.",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-769": {
    name: "Mundo do Vento",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Vento, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique 1 dos efeitos a seguir conforme o número de marcadores removidos:",
      "1) Veja os 3 cards do topo do seu Deck e devolva-os em qualquer ordem.",
      "5) O Time do Ninja alvo não pode ser bloqueado durante este turno.",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-770": {
    name: "Infestação de Lesmas!",
    text: [
      "Permanente (X + 1)",
      "Efeito: Quando esta Missão for colocada em jogo, você pode procurar no seu Deck 1 card de Ninja \"Lesma\", revelá-lo e movê-lo para a sua mão.",
      "Efeito: Os Ninjas \"Lesma\" ganham +3/+1.",
    ],
    flavor: "\"Mas o quê...!?\"",
  },
  "s21-m-771": {
    name: "Sonhando Acordado",
    text: [
      "Permanente",
      "Efeito: Compre 2 cards. Depois, jogue a Moeda Ninja. Se der cara, você pode curar 1 Ninja. Se der coroa, coloque 1 Marcador de Crescimento em um Ninja.",
      "Efeito: O tamanho máximo da sua mão aumenta em 2.",
    ],
  },
  "s21-m-772": {
    name: "Sonhos do Passado",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, compre 1 card.",
      "Efeito: Quando você jogar a Moeda Ninja, pode ignorar o resultado e jogá-la de novo. Este efeito pode ser usado duas vezes por turno.",
    ],
  },
  "s21-m-773": {
    name: "Mundo do Vazio",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja de Vazio, coloque 1 marcador nesta Missão.",
      "[Atacante | Missão] Remova qualquer número de marcadores desta Missão: Aplique os efeitos a seguir conforme o número de marcadores removidos:",
      "2+) Mova o card do fundo do seu Deck para a sua mão.",
      "10+) Mova o Marcador de Turnos do seu oponente para 0.",
      "Esta Missão não pode ser afetada pelos cards de Missão do seu oponente.",
    ],
  },
  "s21-m-774": {
    name: "O Símbolo do Ninja Renegado",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja \"Ninjas Renegados\" que compartilhe um Símbolo com o card usado para pagar o Custo de Mão deste card, revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"Me desculpe.\"",
  },
  "s21-m-775": {
    name: "Selo de Chakra",
    text: [
      "Anulação Permanente (2)",
      "Alvo: 1 Ninja",
      "Efeito: O alvo não pode ser enviado para a Batalha.",
    ],
    flavor: "\"Isto vai selar o chakra imediatamente...\"",
  },
};
