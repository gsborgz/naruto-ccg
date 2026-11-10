import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * TP4 — Tournament Pack 4, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/tp4-tournament-pack-4.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 */
export const TP4_TOURNAMENT_PACK_4_PTBR: CardTranslations = {
  // ── NINJA ──
  "tp4-n-1335": {
    text: [
      "[ARSENAL SEM FIM]",
      "No início do seu turno, você pode descartar um card. Nesse caso, compre 1 card. Se o card que você descartou não for um card de Terra, mova os 3 cards do topo do seu Deck para a sua Pilha de Descartes.",
    ],
    flavor: "\"Parem com isso!\"",
  },
  "tp4-n-1336": {
    text: [
      "[TENKETSU]",
      "Quando este Ninja for colocado em jogo, diga o nome de um Ninja.",
      "Válido: Os efeitos ativados do Ninja dito não podem ser ativados.",
    ],
    flavor: "\"Tenho a impressão de que ele só está sendo feito de bobo.\"",
  },
  "tp4-n-1337": {
    text: [
      "[UMA EXPLOSÃO]",
      "Válido: Quando este Ninja for colocado em jogo ou descartado, você pode causar 1 Dano ao Ninja alvo.",
    ],
  },
  "tp4-n-1338": {
    text: [
      "[O GENIN MAIS FORTE]",
      "Válido: Enquanto o seu oponente tiver 1 ou mais Ninjas \"Genin\" feridos, este Ninja ganha +1/+0.",
    ],
    flavor: "\"Eu tenho o meu próprio caminho.\"",
  },
  "tp4-n-1339": {
    text: [
      "[DESPREOCUPADO]",
      "Quando este Ninja ganhar qualquer Prêmio de Batalha, cause 1 Dano a este Ninja.",
      "Válido: Quando este Ninja for ser retirado de jogo, em vez disso, mova-o para a sua mão.",
    ],
    flavor: "\"O Tobi é um bom menino...\"",
  },
  "tp4-n-1340": {
    text: [
      "[USANDO O PODER DA FERA]",
      "[Válido | Troca de Jutsu] Mova os 3 cards do topo do seu Deck para a sua Pilha de Descartes: Este Ninja ganha +1/+0 durante este turno. Este efeito pode ser usado até três vezes por turno.",
    ],
  },
  "tp4-n-1341": {
    text: [
      "[MESTRE DO ESFORÇO]",
      "Quando este Ninja Atacar, você pode mover 1 card de Ninja da sua mão para a sua área de Chakra. Nesse caso, este Ninja ganha +2/+0 durante este turno. Se o card for um card de Ninja \"Taijutsu\", em vez disso, este Ninja ganha +3/+0.",
    ],
    flavor: "\"Eu estava falando sério.\"",
  },
  "tp4-n-1342": {
    text: [
      "[ALMA ZELOSA]",
      "Válido: Quando 1 dos seus Ninjas \"Genin\" for receber qualquer Dano, você pode negá-lo e, em vez disso, causar 1 Dano a este Ninja.",
    ],
    flavor: "\"Boa sorte.\"",
  },
  "tp4-n-1343": {
    text: [
      "[COMPANHEIRO PRECIOSO]",
      "Válido: Enquanto você tiver um Ninja Naruto Uzumaki, este Ninja ganha +1/+1.",
      "Válido: Enquanto você tiver um Ninja Sakura Haruno, este Ninja ganha +2/+0.",
    ],
    flavor: "\"...hora de começar a minha verdadeira missão.\"",
  },
  "tp4-n-1344": {
    text: [
      "[APARIÇÃO REPENTINA]",
      "Enquanto o seu oponente tiver 6 ou mais Prêmios de Batalha, este card de Ninja ganha -6 de Custo de Entrada.",
      "Válido: Quando este Ninja for colocado em jogo, se você tiver 3 cards ou menos na mão, compre até ficar com 4 cards na mão.",
    ],
    flavor: "\"Mas você não pode pular essa parte.\"",
  },
  "tp4-n-1345": {
    name: "O 4º Hokage",
    text: [
      "[MANIPULAÇÃO DO ESPAÇO]",
      "Quando este Ninja for colocado em jogo, coloque um Marcador de \"Clarão\" em 1 dos seus Ninjas.",
      "[Válido | Troca de Jutsu] (0): Mova este Ninja para o Time de um Ninja que tenha um Marcador de \"Clarão\", em qualquer posição.",
    ],
    flavor: "\"Então eu estava pensando...\"",
  },
  "tp4-n-1346": {
    text: [
      "[UMA CRIANÇA A PROTEGER]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, você pode descartar 1 dos Chakras do seu oponente.",
    ],
    flavor: "\"Eu descobri para onde voltar.\"",
  },
  "tp4-n-1347": {
    text: [
      "[PERFECCIONISTA]",
      "No final do seu turno, você pode pagar (1). Nesse caso, cure o Ninja ferido alvo.",
    ],
    flavor: "\"...a morte vai ser a última das minhas preocupações.\"",
  },
  "tp4-n-1348": {
    text: [
      "[PROTETOR]",
      "[Missão][Troca de Jutsu] (*): O Ninja alvo que você controla não pode ser alvo dos efeitos de Ninja do seu oponente durante este turno.",
    ],
    flavor: "\"Achei que você já tinha se juntado a eles.\"",
  },
  "tp4-n-1349": {
    text: [
      "[SONAR]",
      "[Missão] (0): Veja o card do topo do Deck de qualquer jogador. Este efeito pode ser ativado qualquer número de vezes por turno.",
    ],
    flavor: "\"Você é esperto!\"",
  },
  "tp4-n-1350": {
    text: [
      "[BARREIRA DE CRISTAL]",
      "[Bloqueador | Missão] (Terra|Terra) ou (Água|Água): O Ninja alvo não pode ser enviado para Atacar nem formar Times durante este turno.",
    ],
  },
  "tp4-n-1351": {
    text: [
      "[CONSTRIÇÃO]",
      "Quando o seu oponente jogar um Jutsu ou um Ninja, ele pode pagar (1). Se não pagar, compre 1 card.",
    ],
    flavor: "\"Ora, ora, ora...\"",
  },
  "tp4-n-1352": {
    text: [
      "[CURANDEIRA DO TIME]",
      "Os Ninjas não podem ganhar Prêmios de Batalha durante o turno em que forem colocados em jogo.",
    ],
    flavor: "\"e isto é meu.\"",
  },
  "tp4-n-1353": {
    text: [
      "[TREINO NA ÁGUA]",
      "[Atacante | Missão| Troca de Jutsu] (1): Procure no seu Deck um card sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Se você não consegue nem fazer isso, não pode ser meu aluno.\"",
  },
  "tp4-n-1354": {
    text: [
      "[GUARDIÃO DO NETO]",
      "Quando este Ninja for colocado em jogo, você pode colocar em jogo um card de Ninja Konohamaru da sua mão.",
    ],
    flavor: "\"Parece que você se acostumou demais a ter tudo do seu jeito.\"",
  },
  "tp4-n-1355": {
    text: [
      "[SOCO CONCENTRADO]",
      "[Troca de Jutsu] (2): Este Ninja ganha +3/+3 durante este turno. Além disso, quando este Ninja conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha.",
    ],
  },
  "tp4-n-1356": {
    text: [
      "[ASSISTENTE DO HOKAGE]",
      "Válido: Quando você colocar em jogo um Ninja \"Satoosa\" ou de Hierarquia superior, mova aleatoriamente 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
    ],
    flavor: "\"O que foi?\"",
  },
  "tp4-n-1357": {
    text: [
      "[O PODER DO KAZEKAGE]",
      "Quando este Ninja Atacar, você pode revelar os 3 cards do topo do seu Deck. Nesse caso, mova para a sua mão 1 card de Jutsu de Vento ou card de Missão de Vento revelado e depois devolva o resto ao topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Muito bem.\"",
  },
  "tp4-n-pr-us010": {
    text: [
      "[EU CONSIGO]",
      "[Troca de Jutsu] Se este Ninja for enfrentado, fira este Ninja: O Time deste Ninja e o Time que o enfrenta fazem uma Batalha Mental.",
    ],
    flavor: "\"Nada funciona contra isto!\"",
  },
  // ── JUTSU ──
  "tp4-j-890": {
    name: "Time Formidável",
    text: [
      "Efeito: Se o Time do Usuário tiver um Ninja \"Sombra\", 1 Ninja que enfrenta o Usuário passa a ser 0/0 durante este turno. Se o Time do Usuário tiver um Ninja \"Comida\", fira 1 Ninja que enfrenta o Usuário. Se o Time do Usuário tiver um Ninja \"Mente\", 1 Ninja que enfrenta o Usuário passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Incríveis são os meus amigos, que acreditam em mim.\"",
  },
  "tp4-j-891": {
    name: "Subjugar",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se o Combate do alvo for menor que o do Usuário, fira o alvo e depois coloque um Marcador -1/-1 no alvo.",
    ],
  },
  "tp4-j-892": {
    name: "Traje de Taijutsu",
    text: [
      "Efeito: Se o Usuário for um Ninja \"Taijutsu\", ele ganha +5/+0 durante o turno. Se não, o Usuário ganha +2/+0 e \"Taijutsu\" durante este turno.",
    ],
    flavor: "\"Nada mal, hein?\"",
  },
  "tp4-j-893": {
    name: "Espada Devoradora de Chakra",
    text: [
      "Efeito: Descarte 3 Chakras do seu oponente.",
      "Especialista [Kisame Hoshigaki]: Mova da sua Pilha de Descartes para a sua área de Chakra o mesmo número de cards que você descartou por este efeito. Se você moveu 3 ou mais cards dessa forma, fira o Ninja adversário alvo.",
    ],
    flavor: "\"A minha espada longa se chama Samehada! Quer dizer pele de tubarão! Ela não fatia... ela te reduz a tiras!\"",
  },
  "tp4-j-894": {
    name: "Cura",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Cure o alvo. Além disso, se o alvo for receber Dano de um Jutsu durante este turno, em vez disso, passe esse Dano para o Usuário desse Jutsu.",
    ],
    flavor: "\"Eu conserto os seus braços... mas, em troca, deixe a vila em paz.\"",
  },
  // ── MISSÃO ──
  "tp4-m-847": {
    name: "Gerações",
    text: [
      "Permanente (3)",
      "Efeito: Os Ninjas que compartilham o nome com outro Ninja não podem ser enviados para Atacar.",
    ],
    flavor: "\"Você vai entender quando for mais velho.\"",
  },
  "tp4-m-848": {
    name: "A Decisão de Shikamaru",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Procure no seu Deck um card de Ninja com Custo de Entrada menor ou igual a X, revele-o e mova-o para a sua mão. X = o Poder Mental do alvo. Se o alvo for Shikamaru Nara, em vez disso, procure qualquer card de Ninja. Depois, compre 1 card se você procurou um Ninja \"Feminino\".",
    ],
    flavor: "\"Não deixe o que o Asuma disse te afetar.\"",
  },
  "tp4-m-849": {
    name: "Olhos do Traidor",
    text: [
      "Efeito: Compre 1 card e depois remova esta Missão do jogo. Nesse caso, jogue um turno extra depois deste. Você não pode jogar Missões nesse turno extra.",
    ],
  },
  "tp4-m-850": {
    name: "Corrida!",
    text: [
      "Permanente",
      "Efeito: Quando o Marcador de Turnos de um jogador chegar a 5 ou mais, mova esta Missão para a área de Chakra do Dono Original dela; depois, esse jogador compra 3 cards.",
    ],
    flavor: "\"Eu não vou desistir até o final!\"",
  },
  "tp4-m-851": {
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Compre 1 card e depois mova até 3 cards da sua Pilha de Descartes para a sua área de Chakra. O alvo ganha +1/+1 durante este turno para cada card movido dessa forma.",
    ],
    flavor: "\"Konoha tem o melhor dango.\"",
  },
  "tp4-m-852": {
    name: "Guerreiro Misterioso",
    text: [
      "Efeito: Compre 2 cards e descarte 1 card. Depois, se o seu oponente tiver mais cards na mão que você, mova esta Missão para a sua mão.",
    ],
  },
  "tp4-m-853": {
    name: "Membros Entrelaçados",
    text: [
      "Permanente",
      "Quando esta Missão for colocada em jogo, compre 1 card.",
      "[Missão | Troca de Jutsu] (1): 1 dos seus Ninjas ganha -1/+1 ou +1/-1 durante este turno. Você pode usar este efeito quantas vezes quiser.",
    ],
    flavor: "\"Você baixou a guarda.\"",
  },
  "tp4-m-854": {
    name: "Adepto do Genjutsu",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: O alvo ganha \"Genjutsu\" e o seguinte efeito: \"Os Ninjas que não sejam \"Genjutsu\" e que enfrentam este Ninja recebem -0/-2.\"",
    ],
  },
};
