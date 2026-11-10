import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S22 — Weapons of War, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s22-weapons-of-war.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Mission | EOJ]` viram `[Válido | Atacante | Missão | Troca de Jutsu]`.
 */
export const S22_WEAPONS_OF_WAR_PTBR: CardTranslations = {
  // ── NINJA ──
  "s22-n-1206": {
    text: [
      "[SAIU PARA ALMOÇAR]",
      "Quando este Ninja for colocado em jogo, se o seu Marcador de Turnos for 6 ou mais, coloque 2 Marcadores de Crescimento neste Ninja, e ele ganha o seguinte efeito: \"Válido: Este Ninja não pode ser alvo de cards de Jutsu de Água.\"",
    ],
    flavor: "\"Eu sou agradavelmente fofinho!\"",
  },
  "s22-n-1207": {
    name: "Hinata Hyuga (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, o seu oponente deve descartar 1 card. Se der coroa, cause 1 Dano a 1 dos seus Ninjas.",
    ],
    flavor: "\"É... hã...\"",
  },
  "s22-n-1208": {
    name: "Tenten (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, compre 1 card e depois descarte 1 card. Se der coroa, mova os 3 cards do topo do seu Deck para a sua Pilha de Descartes.",
    ],
    flavor: "\"Parem com isso!\"",
  },
  "s22-n-1209": {
    name: "Ino Yamanaka (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, retire 1 Ninja com Custo de Entrada 1 ou menos do Time dele. Se der coroa, o seu oponente coloca um Marcador de Crescimento em 1 dos Ninjas dele.",
    ],
    flavor: "\"Ainda bem...\"",
  },
  "s22-n-1210": {
    text: [
      "[VISÃO ABSOLUTA]",
      "Válido: O seu oponente joga com o card do topo do Deck revelado.",
    ],
    flavor: "\"Ho ho... Assim é até mais divertido...\"",
  },
  "s22-n-1211": {
    text: [
      "[FARPAS DE SOMBRA]",
      "[Troca de Jutsu | Missão] (Terra): Quando o Ninja alvo receber qualquer Dano durante este turno, reduza esse Dano em 1.",
    ],
    flavor: "\"Lerdos.\"",
  },
  "s22-n-1212": {
    text: [
      "[AMIGO DE LONGA DATA]",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Terra. Nesse caso, coloque um Marcador de Crescimento neste Ninja, e este Ninja ganha o seguinte efeito: \"Este Ninja não pode ser alvo de cards de Jutsu de Raio.\"",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Fogo. Nesse caso, fira 1 Ninja com Custo de Entrada menor que o Custo de Entrada deste Ninja.",
    ],
    flavor: "\"Eu vou.\"",
  },
  "s22-n-1213": {
    text: [
      "[VISÃO ILIMITADA]",
      "Válido: Quando este Ninja for colocado em jogo, escolha um Símbolo. O seu oponente não pode jogar cards com esse Símbolo durante este turno.",
    ],
    flavor: "\"Finalmente chegou.\"",
  },
  "s22-n-1214": {
    text: [
      "[FABRICANTE DE BOMBAS]",
      "Válido: No início do turno de cada jogador, esse jogador descarta 1 Ninja que não seja de Reforço, que ele controle, com 2 ou mais Símbolos (se houver).",
    ],
    flavor: "\"Faça você!\"",
  },
  "s22-n-1215": {
    text: [
      "[RECONSTRUÇÃO]",
      "Válido: Quando uma Missão Permanente for colocada em jogo, compre 1 card.",
    ],
    flavor: "\"Não vou deixar você machucá-los.\"",
  },
  "s22-n-1216": {
    name: "O 1º Hokage",
    text: [
      "[SUPREMACIA]",
      "Quando este Ninja for baixado, mova 2 Prêmios de Batalha do seu oponente para a sua mão. Depois, embaralhe no seu Deck qualquer número de cards da sua Pilha de Descartes.",
    ],
  },
  "s22-n-1217": {
    text: [
      "[TENACIDADE]",
      "Válido: No final do seu turno, se este Ninja não foi enviado para a Batalha durante este turno, o seu oponente move o card do topo do Deck dele para a Pilha de Descartes dele.",
    ],
    flavor: "\"Au au!!\"",
  },
  "s22-n-1218": {
    text: [
      "[TÁTICA AFIADA]",
      "[Atacante | Missão] (Fogo|1): O seu oponente move os 5 cards do topo do Deck dele para a Pilha de Descartes dele.",
    ],
    flavor: "\"Então desta vez eu não vou me segurar!!\"",
  },
  "s22-n-1219": {
    text: [
      "[HABILIDADES OCULARES]",
      "Quando este Ninja for colocado em jogo, você pode remover do jogo qualquer marcador de um card em jogo. Nesse caso, compre 1 card.",
    ],
    flavor: "\"Acho que é isso...\"",
  },
  "s22-n-1220": {
    text: [
      "[CÉREBRO ACIMA DOS MÚSCULOS]",
      "Quando o seu oponente mover cards do topo do Deck dele para a Pilha de Descartes dele, se algum desses cards não for um card de Ninja, ele move mais 1 card.",
    ],
    flavor: "\"Não se atreva a me chamar de 'cachorrinho fofo'!\"",
  },
  "s22-n-1221": {
    text: [
      "[FORÇA DE ELITE]",
      "Não Único",
      "Quando este Ninja for colocado em jogo, mova 1 dos seus Ninjas de Fogo para a sua mão.",
    ],
    flavor: "\"Hayate...\"",
  },
  "s22-n-1222": {
    text: [
      "[ETERNO RIVAL]",
      "Enquanto você tiver 5 ou mais Chakras, os cards de Jutsu chamados Chidori usados por este Ninja podem ser jogados de graça.",
    ],
    flavor: "\"Vou dizer mais uma vez.\"",
  },
  "s22-n-1223": {
    text: [
      "[DESTEMIDO]",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Fogo. Nesse caso, o seu oponente move os 5 cards do topo do Deck dele para a Pilha de Descartes dele. Para cada card de Jutsu movido dessa forma, coloque 1 Marcador de Crescimento neste Ninja.",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Vento. Nesse caso, remova 1 outro Ninja do jogo. No final do turno, mova esse Ninja para a Vila do Dono Original dele.",
    ],
    flavor: "\"Certo... vamos lá!\"",
  },
  "s22-n-1224": {
    text: [
      "[PALHAÇO]",
      "Válido: Quando este Ninja for colocado em jogo, você pode revelar a sua mão. Nesse caso, se você não revelou um card de Jutsu, compre 1 card.",
    ],
    flavor: "\"E agora, do que vamos brincar?\"",
  },
  "s22-n-1225": {
    text: [
      "[PESQUISA]",
      "Sacrifício: 1 Ninja \"Olho Sharingan\"",
      "Válido: Quando este Ninja for colocado em jogo, coloque X Marcadores de Crescimento neste Ninja, onde X = o Custo de Entrada do Ninja Sacrificado, e este Ninja ganha as Características do Ninja Sacrificado.",
    ],
    flavor: "\"Não venha com sorrisos falsos assim na minha frente.\"",
  },
  "s22-n-1226": {
    text: [
      "[EXISTÊNCIA AMALDIÇOADA]",
      "[Válido | Atacante | Missão] (*|*): Cause 1 Dano a este Ninja e fira o Ninja alvo que o seu oponente controla.",
    ],
    flavor: "\"Queria que alguém me matasse de uma vez.\"",
  },
  "s22-n-1227": {
    text: [
      "[DOR COMPREENDIDA]",
      "[Atacante | Missão] Remova todos os Marcadores -1/-1 do Ninja alvo: Se você removeu 1 ou mais Marcadores -1/-1, cause 1 Dano a esse Ninja.",
    ],
    flavor: "\"Você está acabado.\"",
  },
  "s22-n-1228": {
    text: [
      "[ELITE UCHIHA]",
      "Este Ninja não pode receber Dano enquanto for enfrentado por Ninjas com qualquer Marcador -1/-1.",
      "[Troca de Jutsu] (*): O Ninja adversário alvo recebe -1/-1 durante este turno para cada marcador nele.",
    ],
    flavor: "\"Então, o que você quer saber?\"",
  },
  "s22-n-1229": {
    name: "O 3º Hokage",
    text: [
      "[SUPREMACIA]",
      "[Troca de Jutsu] (1), remova do jogo 4 cards da sua Pilha de Descartes: Cause 1 Dano ao Ninja adversário alvo.",
    ],
  },
  "s22-n-1230": {
    text: [
      "[LINHAGEM SARUTOBI]",
      "Válido: No final do seu turno, se você tiver 8 ou mais Chakras, pode comprar 1 card.",
    ],
    flavor: "\"Suas habilidades rivalizam com as minhas!!\"",
  },
  "s22-n-1231": {
    text: [
      "[ETERNO RIVAL]",
      "Válido: Enquanto você tiver 8 ou mais Chakras, os cards de Jutsu chamados Rasengan usados por este Ninja podem ser jogados de graça.",
    ],
    flavor: "\"Ao ataque!!\"",
  },
  "s22-n-1232": {
    name: "Leão de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "[Atacante | Missão] (1): Coloque este card de Ninja em jogo a partir da sua mão.",
      "Válido: Quando este Ninja for colocado em jogo, todos os seus outros Ninjas \"Tinta\" ganham +1/+1 durante este turno.",
    ],
  },
  "s22-n-1233": {
    text: [
      "[FOLHA DANÇANTE]",
      "[Válido | Troca de Jutsu] (2): Este Ninja ganha +3/+0 durante este turno. Você pode usar este efeito quantas vezes quiser.",
    ],
    flavor: "\"Bem... lá vamos nós!\"",
  },
  "s22-n-1234": {
    text: [
      "[CLONE]",
      "Não Único",
      "Quando este Ninja for colocado em jogo, você pode procurar no seu Deck 1 card de Ninja com \"Uzumaki\" no nome, revelá-lo e movê-lo para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Desembucha! Quem é você?\"",
  },
  "s22-n-1235": {
    text: [
      "[POSICIONAMENTO ESTRATÉGICO]",
      "Válido: Quando este Ninja for colocado em jogo, compre 1 card.",
      "Quando você baixar um Ninja de Raio, se este card de Ninja estiver na sua Pilha de Descartes, você pode pagar 1 de Raio. Nesse caso, mova este card de Ninja para a sua mão.",
    ],
    flavor: "\"Pega eles.\"",
  },
  "s22-n-1236": {
    text: [
      "[CRIAÇÃO DE TINTA]",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Raio. Nesse caso, coloque 1 Marcador de Crescimento neste Ninja e avance o seu Marcador de Turnos em 1.",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Terra. Nesse caso, mova 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
    ],
    flavor: "\"Você é... bem fraco.\"",
  },
  "s22-n-1237": {
    text: [
      "[O OITAVO, MANO]",
      "[Atacante | Missão] (0): Mova 1 card da sua Pilha de Descartes para a sua área de Chakra. Se você tiver 8 ou mais Chakras, quando este Ninja ganhar qualquer Prêmio de Batalha durante este turno, você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "♪\"Yo, primeiro eu esmago vocês, plaft-plaft.\"♪",
  },
  "s22-n-1238": {
    name: "Anko Mitarashi (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, coloque um Marcador de Crescimento em 1 dos seus Ninjas. Se der coroa, descarte 2 dos seus Chakras.",
    ],
    flavor: "\"Você não ia querer que eu me metesse em encrenca, ia?\"",
  },
  "s22-n-1239": {
    text: [
      "[CELERIDADE]",
      "Quando este Ninja for colocado em jogo, remova do jogo os 5 cards do fundo do seu Deck. Os cards de Jutsu com \"Requerimentos: \"Taijutsu\"\" removidos dessa forma podem ser jogados de graça, como se estivessem na sua mão.",
    ],
    flavor: "\"Espero que vocês consigam me acompanhar!!\"",
  },
  "s22-n-1240": {
    text: [
      "[INSTRUTOR]",
      "Senjutsu",
      "[Atacante | Missão] (0): Se você tiver um Naruto Uzumaki, mova 1 card de Jutsu de Raio da sua Pilha de Descartes para o topo do seu Deck.",
    ],
    flavor: "\"Isso pode ser ruim...\"",
  },
  "s22-n-1241": {
    name: "O 4º Hokage",
    text: [
      "[SUPREMACIA]",
      "[Troca de Jutsu] Descarte 2 cards de Raio e coloque este card de Ninja da sua mão em 1 dos seus Times Em Combate: Fira 1 Ninja adversário. No final do turno, mova este Ninja para a sua mão.",
    ],
  },
  "s22-n-1242": {
    name: "Oito Caudas",
    text: [
      "[LANÇA]",
      "Sacrifício: Killer Bee",
      "Válido: Quando o Ninja de um jogador for ser retirado de jogo por causa do Showdown, em vez disso, ele o move para a área de Prêmios de Batalha do oponente dele, com a face para baixo.",
    ],
    flavor: "♪\"Nasci pra espetar meus rivais, sou o chifrudo dos chifrudos mais.\"♪",
  },
  "s22-n-1243": {
    text: [
      "[SELADO]",
      "Válido: Este Ninja não pode ser o Usuário de cards de Jutsu. Este efeito não pode ser negado.",
      "Válido: Quando os seus oponentes forem ganhar qualquer número de Prêmios de Batalha, em vez disso, cause esse número de Dano a este Ninja.",
    ],
    flavor: "\"Velho maluco!!\"",
  },
  "s22-n-1244": {
    text: [
      "[DUPLICIDADE]",
      "[Missão] (0): Remova do jogo 1 card da área de Chakra de cada jogador. Depois, no final do turno, devolva os cards removidos à área de Chakra dos Donos Originais deles.",
    ],
    flavor: "\"Lorde Orochimaru!!\"",
  },
  "s22-n-1245": {
    text: [
      "[ABSORÇÃO]",
      "[Válido | Troca de Jutsu | Missão] Mova 1 card da Pilha de Descartes do seu oponente para a área de Chakra dele: Cure 1 dos seus outros Ninjas.",
    ],
    flavor: "\"Que distração mais chamativa.\"",
  },
  "s22-n-1246": {
    text: [
      "[EXAMINADORA]",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Água. Nesse caso, compre 2 cards e depois mova 2 cards da sua mão para o topo do seu Deck, em qualquer ordem.",
      "Válido: Quando este Ninja for colocado em jogo, você pode pagar 2 de Raio. Nesse caso, compre 1 card para cada 2 Chakras que você tiver.",
    ],
    flavor: "\"Peguei você!\"",
  },
  "s22-n-1247": {
    text: [
      "[ESPADACHIM DA AKATSUKI]",
      "Quando este Ninja Atacar, descarte 1 dos Chakras do seu oponente.",
      "Quando este Ninja Bloquear, veja o card do topo do seu Deck e mova-o para o topo ou para o fundo do seu Deck.",
    ],
    flavor: "\"Ele está me dando nos nervos...\"",
  },
  "s22-n-1248": {
    name: "Jugo (Estado 1)",
    text: [
      "[FORÇA TOTAL]",
      "Válido: Enquanto o seu oponente tiver 2 Chakras ou menos, este Ninja ganha +2/+2.",
    ],
    flavor: "\"Afaste-se.\"",
  },
  "s22-n-1249": {
    text: [
      "[DEMÔNIO DA NÉVOA]",
      "[Válido | Atacante | Troca de Jutsu] (0): Quando este Ninja conseguir qualquer Vitória durante este turno, mova 1 dos Ninjas Reserva do seu oponente para a mão do Dono Original dele.",
    ],
  },
  "s22-n-1250": {
    text: [
      "[O FALCÃO]",
      "Quando o seu oponente jogar um Jutsu, você pode revelar o card do topo do seu Deck. Nesse caso, se o card revelado for um card de Jutsu ou de Missão, negue o Jutsu que o seu oponente jogou e mova-o para a mão dele.",
    ],
  },
  "s22-n-1251": {
    name: "O 2º Hokage",
    text: [
      "[SUPREMACIA]",
      "[Atacante | Missão] (3): Mova 1 card da sua Pilha de Descartes para a sua área de Chakra, ou 1 card de Missão da sua Pilha de Descartes para a sua mão.",
    ],
  },
  "s22-n-1252": {
    name: "Sakura Haruno (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, compre 1 card. Se der coroa, este Ninja passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Sim, senhora?\"",
  },
  "s22-n-1253": {
    text: [
      "[TROCA DE MARIONETES]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, mova este card de Ninja para a sua mão. Nesse caso, procure no seu Deck um card de Ninja \"Marionete\", revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"Heh... então vem!\"",
  },
  "s22-n-1254": {
    text: [
      "[MASCOTE DA ASSISTENTE]",
      "Válido: Enquanto você tiver 6 ou mais cards na mão, este Ninja ganha +0/+2.",
    ],
    flavor: "\"Oinc.\"",
  },
  "s22-n-1255": {
    text: [
      "[RELAÇÃO SIMBIÓTICA]",
      "[Troca de Jutsu | Missão] Remova 1 Marcador de Crescimento deste Ninja: Coloque em jogo 1 moeda de Ninja Inseto com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)] [Não Único]\".",
    ],
    flavor: "\"E isso, meu amigo, é um verdadeiro plano reserva.\"",
  },
  "s22-n-1256": {
    text: [
      "[CONTROLE DE CHAKRA]",
      "[Atacante | Missão] (Vento): Mova 1 card da sua Pilha de Descartes para a sua área de Chakra. Se o card movido for um card de Vento, cure 1 dos seus Ninjas.",
    ],
    flavor: "\"Se for uma armadilha... então nós lutamos!\"",
  },
  "s22-n-1257": {
    name: "Shizune (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, todos os seus Ninjas \"Feminino\" ganham +1/+1 durante este turno. Se der coroa, descarte 1 dos seus Ninjas \"Masculino\".",
    ],
    flavor: "\"Estou aqui para servir você.\"",
  },
  "s22-n-1258": {
    text: [
      "[MESTRA DO GENJUTSU]",
      "[Troca de Jutsu] (3): Mude o(s) alvo(s) de 1 Jutsu para outro(s) alvo(s) válido(s). Se pelo menos 1 dos novos alvos for 1 dos seus Ninjas, compre 1 card.",
    ],
    flavor: "\"Isso faz sentido.\"",
  },
  "s22-n-1259": {
    name: "O 5º Hokage",
    text: [
      "[SUPREMACIA]",
      "[Válido | Troca de Jutsu] (1): Cure o Ninja alvo e compre 1 card.",
    ],
  },
  "s22-n-1260": {
    name: "Kurenai Yuhi (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "Válido: Quando este Ninja for colocado em jogo, jogue a Moeda Ninja.",
      "Válido: Quando você jogar a Moeda Ninja por causa de 1 dos seus efeitos, se der cara, todos os Ninjas \"Masculino\" não podem se tornar o Usuário de cards de Jutsu durante este turno. Se der coroa, todos os jogadores compram 1 card.",
    ],
    flavor: "\"Bom dia.\"",
  },
  "s22-n-1261": {
    name: "Tsunade (Quimono)",
    text: [
      "[GAROTAS DE QUIMONO]",
      "[Atacante | Missão] (1): Jogue a Moeda Ninja.",
      "[Atacante | Missão] (0): Se você tiver 3 ou mais outros Ninjas \"Feminino\", mova 1 card de Jutsu de Vento da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Aonde você pensa que vai?\"",
  },
  // ── JUTSU ──
  "s22-n-1262": {
    name: "Jirobo (Estado 1)",
  },
  "s22-j-839": {
    text: [
      "Requerimentos: \"Byakugan\"",
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo. Nesse caso, procure na Pilha de Descartes e no Deck do seu oponente todas as cópias do alvo e mova-as para a Pilha de Descartes do Dono Original delas.",
    ],
    flavor: "\"Eu com certeza vou encontrar!\"",
  },
  "s22-j-840": {
    name: "Desvio",
    text: [
      "Efeito: Diga um Símbolo. O Time do Usuário não pode ser afetado pelos efeitos de cards de Jutsu com o Símbolo dito.",
    ],
    flavor: "\"Você achou que tinha me vencido?\"",
  },
  "s22-j-841": {
    name: "Jutsu Transferência de Mente",
    text: [
      "Alvo: 1 Ninja com menos Poder Mental que o Usuário",
      "Efeito: Mova o alvo para o Time do Usuário, em qualquer posição. No final do turno, mova o alvo para a Vila do seu oponente.",
      "Especialista [\"Mente\"]: Em vez disso, mova o alvo para a Vila do seu oponente no final do seu próximo turno.",
    ],
    flavor: "\"Cuide do meu corpo enquanto eu estiver fora.\"",
  },
  "s22-j-842": {
    name: "Jutsu de Expansão Parcial",
    text: [
      "Efeito: O Usuário ganha +2/+2 durante este turno. Se o Usuário conseguir qualquer Vitória durante este turno, o seu oponente move 1 card da mão para o topo do Deck dele.",
    ],
    flavor: "\"Lá vou eu, gorducho.\"",
  },
  "s22-j-843": {
    name: "Jutsu Possessão da Sombra",
    text: [
      "Alvo: Todos os Ninjas Em Combate contra o Usuário",
      "Efeito: Revele o card do topo do seu Deck. Se o Custo de Entrada do alvo for menor ou igual ao do card revelado, o Poder desse Ninja passa a ser 0/0 durante este turno. (Cards de Jutsu são considerados como tendo Custo de Entrada 0.)",
    ],
    flavor: "\"Brincadeirinha.\"",
  },
  "s22-j-844": {
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O alvo recebe -3/-3 durante este turno.",
    ],
    flavor: "*Fiuu*",
  },
  "s22-j-845": {
    name: "Pancada",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Fira o alvo. Depois, se o seu oponente tiver 20 ou mais cards na Pilha de Descartes dele, cause 1 Dano ao alvo.",
    ],
    flavor: "*Tum*",
  },
  "s22-j-846": {
    name: "Olho Sharingan",
    text: [
      "Requerimentos: \"Olho Sharingan\"",
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo e remova-o do jogo. Se você pagou o custo deste Jutsu com um Chakra de Água, descarte 2 Chakras do seu oponente.",
    ],
    flavor: "\"Sharingan!\"",
  },
  "s22-j-847": {
    text: [
      "Requerimentos: Kakashi Hatake, Itachi Uchiha ou Sasuke Uchiha",
      "Alvo: 1 Ninja",
      "Efeito: Cause 2 Dano ao alvo. O seu oponente pode negar este Jutsu enquanto ele estiver na Sequência dando a você 1 Prêmio de Batalha.",
    ],
    flavor: "*Shkiin*",
  },
  "s22-j-848": {
    name: "Estilo Fogo: Jutsu Chamas do Dragão",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Cause 2 Dano ao alvo e 1 Dano ao Usuário.",
    ],
    flavor: "\"Você está dispensado do serviço!\"",
  },
  "s22-j-849": {
    name: "Jizo de Agulhas",
    text: [
      "Efeito: O Usuário ganha +3/+3 durante este turno.",
    ],
    flavor: "\"Eu prevejo que a Folha Oculta sairá vitoriosa desta batalha.\"",
  },
  "s22-j-850": {
    name: "Impacto Duplo",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: O Usuário ganha +2/+2 e o alvo recebe -2/-2 durante este turno.",
    ],
    flavor: "\"Quer parar de tagarelar no meu ouvido!\"",
  },
  "s22-j-851": {
    name: "Dança das Sete Espadas",
    text: [
      "Quando este Jutsu for jogado, mova todos os cards de Jutsu com o mesmo nome deste card de Jutsu da sua Pilha de Descartes para a Sequência, com o mesmo Usuário.",
      "Efeito: O Usuário ganha +3/+0 durante este turno.",
      "Especialista [Killer Bee]: Cause 1 Dano a 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "\"Vou te dar uma provinha do meu gancho.\"",
  },
  "s22-j-852": {
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo. Nesse caso, compre 2 cards.",
      "Especialista [Killer Bee ou A]: Cause 2 Dano a 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "\"Lariat!!!\"",
  },
  "s22-j-853": {
    name: "Canhão de Chakra",
    text: [
      "Requerimentos: \"Besta com Caudas\" ou \"Animal\" + Custo de Entrada 7 ou mais",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Cause 1 Dano ao alvo. Depois, avance o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Yo, não vou deixar vocês escaparem a essa altura do jogo, seus tolos, seus tolos!\"",
  },
  "s22-j-854": {
    name: "Furacão da Folha",
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Efeito: O Usuário ganha +3/+0 durante este turno. Se o Usuário conseguir qualquer Vitória durante este turno, avance o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Mestre Guy!\"",
  },
  "s22-j-855": {
    name: "Estilo Água: Onda Demoníaca",
    text: [
      "Efeito: Anexe este card ao Usuário. O Ninja anexado ganha +1/+1 para cada card de Água em todas as áreas de Chakra. Quando o Ninja anexado for retirado de jogo, mova este card para a área de Chakra do Dono Original dele.",
    ],
    flavor: "*Splash*",
  },
  "s22-j-856": {
    name: "Andando sobre a Água",
    text: [
      "Efeito: Cada jogador move o card do topo do Deck dele para a área de Chakra dele. Se o card que você moveu tiver Custo de Entrada maior que o card que o seu oponente moveu, procure um card no seu Deck e mova-o para a sua área de Chakra.",
    ],
    flavor: "\"Viu? Olha, Senhor Utakata!\"",
  },
  "s22-j-857": {
    name: "Lança Chidori",
    text: [
      "Enquanto este Jutsu estiver na Sequência, se o seu oponente tiver 2 Chakras ou menos, este Jutsu não pode ser negado.",
      "Requerimentos: Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Fira o alvo. Depois, o alvo passa a ser um Ninja Reserva.",
    ],
  },
  "s22-j-858": {
    name: "Espada Serpente",
    text: [
      "Requerimentos: Custo de Entrada impresso 5 ou mais",
      "Alvo: Todos os Ninjas que enfrentam o Usuário",
      "Efeito: Devolva o alvo à mão do Dono Original dele.",
    ],
    flavor: "\"Splechh.\"",
  },
  "s22-j-859": {
    name: "Barreira do Estilo Terra: Prisão da Cúpula de Terra",
    text: [
      "Efeito: Descarte 2 Chakras do seu oponente. Depois, mova até 2 cards da sua Pilha de Descartes para a sua área de Chakra.",
      "Especialista [Jirobo]: Se o seu oponente tiver 3 Chakras ou menos, compre 1 card.",
    ],
    flavor: "\"Preciso recuperar a minha energia.\"",
  },
  "s22-j-860": {
    name: "Jutsu Inseto Parasita",
    text: [
      "Requerimentos: \"Inseto\"",
      "Alvo: 1 Ninja do Time do Usuário ou do Time adversário",
      "Efeito: Descarte o alvo. O controlador do Ninja descartado coloca em jogo X moedas de Ninja Inseto, onde X = o Suporte do Ninja descartado, com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)][Não Único]\".",
    ],
    flavor: "\"Vamos enfrentá-los com força total!\"",
  },
  "s22-j-861": {
    name: "Vasculhar a Mente",
    text: [
      "Efeito: Veja os 3 cards do topo do seu Deck, coloque qualquer um deles no fundo do seu Deck e o resto no topo do seu Deck, em qualquer ordem.",
      "Especialista [\"Médico\"]: Você compra 1 card.",
    ],
    flavor: "\"Jutsu de Volta ao Passado.\"",
  },
  "s22-j-862": {
    name: "Peteleco",
    text: [
      "Alvo: 1 Jutsu com 2 ou mais Símbolos específicos no custo",
      "Efeito: Negue o alvo e descarte-o. Mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Tsunade-sama...\"",
  },
  "s22-j-863": {
    name: "Jutsu do Mestre de Marionetes",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Mova o alvo para o Time do Usuário, em qualquer posição.",
      "Especialista [\"Mestre de Marionetes\"]: Devolva este card à sua mão.",
    ],
    flavor: "\"Vou ser breve.\"",
  },
  "s22-j-864": {
    name: "Lança-Chamas",
    text: [
      "Este Jutsu não pode ser negado.",
      "Alvo: 1 Ninja",
      "Efeito: Cause 1 Dano ao alvo. Se o alvo for descartado por este efeito, compre 1 card.",
    ],
    flavor: "\"Qual é o problema?\"",
  },
  // ── MISSÃO ──
  "s22-m-788": {
    name: "A Ira da Duas Caudas",
    text: [
      "Permanente",
      "[Bloqueador | Troca de Jutsu] (0): Descarte esta Missão. O Ninja Em Combate alvo recebe -2/-2 durante este turno. Se o Combate dele for 0 ou menos, descarte-o.",
    ],
    flavor: "\"Você só pode estar brincando!!\"",
  },
  "s22-m-789": {
    name: "Esquadrão da Folha Formado!",
    text: [
      "Efeito: Revele os 5 cards do topo do seu Deck. O seu oponente escolhe 2 dos Ninjas revelados dessa forma (se houver). Escolha 1 desses cards de Ninja e mova-o para a sua mão. Mova o resto dos cards revelados para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"É melhor a gente começar logo.\"",
  },
  "s22-m-790": {
    name: "Docinho",
    text: [
      "Permanente",
      "[Missão] (2): O Ninja alvo ganha +2/+2 durante este turno.",
    ],
  },
  "s22-m-791": {
    name: "Armas de Guerra",
    text: [
      "Efeito: Cada jogador embaralha no próprio Deck todos os cards da mão, da área de Chakra e da Pilha de Descartes. Depois, os dois compram 6 cards e removem esta Missão do jogo.",
    ],
    flavor: "\"Eu sei.\"",
  },
  "s22-m-792": {
    name: "12 Ninjas Guardiões",
    text: [
      "Permanente",
      "Efeito: Quando os Ninjas do seu oponente forem ganhar qualquer Prêmio de Batalha, em vez disso, cause essa quantidade de Dano a 1 dos seus Ninjas.",
      "No início do seu turno, se você não tiver Ninjas, descarte esta Missão.",
    ],
    flavor: "\"Para proteger um país, é preciso proteger quem está no topo, o Senhor Feudal.\"",
  },
  "s22-m-793": {
    name: "Areia Movediça",
    text: [
      "Anulação",
      "Alvo: 1 Ninja que foi colocado em jogo neste turno",
      "Efeito: O alvo não pode formar Time com outros Ninjas durante este turno.",
    ],
    flavor: "\"Isso não é brinquedo seu ... sabia ...\"",
  },
  "s22-m-794": {
    name: "Almofada",
    text: [
      "Permanente",
      "Efeito: Quando qualquer um dos seus Ninjas for receber qualquer Dano por causa do Showdown, você pode, em vez disso, mover este card para a sua área de Chakra e reduzir esse Dano a 0.",
    ],
    flavor: "\"É bem macio e fofinho.\"",
  },
  "s22-m-795": {
    name: "Orientação",
    text: [
      "Anulação",
      "Efeito: O seu oponente ganha 2 Prêmios de Batalha. No início do seu próximo turno, mova 2 Prêmios de Batalha do seu oponente para a sua mão. Se o seu Marcador de Turnos for 5 ou mais, compre 1 card.",
    ],
  },
  "s22-m-796": {
    text: [
      "Alvo: Todos os Ninjas \"Genin\"",
      "Efeito: Retire o alvo do Time dele. O alvo não pode formar Times, não pode receber Dano por causa do Showdown e deve ser enviado para a Batalha durante este turno. Só o alvo pode ser enviado para a Batalha durante este turno. Quando um Time conseguir qualquer Vitória durante este turno, ele ganha 1 Prêmio de Batalha e o controlador dele compra 1 card.",
    ],
    flavor: "\"É por isso que... vencer você tem significado.\"",
  },
  "s22-m-797": {
    name: "Monumento dos Hokages",
    text: [
      "Permanente",
      "Efeito: No início do seu turno, se você tiver 5 ou menos Marcadores de Crescimento entre os seus Ninjas, coloque um Marcador de Crescimento em 1 dos seus Ninjas. Depois, se você tiver 6 ou mais Marcadores de Crescimento, compre um card. Depois, se você tiver 10 ou mais Marcadores de Crescimento, você vence o jogo.",
    ],
  },
  "s22-m-798": {
    name: "Toque que Desvanece",
    text: [
      "Permanente",
      "Efeito: Os jogadores não podem jogar cards que não sejam de Ninja com o mesmo nome de um card da sua Pilha de Descartes.",
      "Efeito: No início do turno de cada jogador, esse jogador remove do jogo 2 cards da Pilha de Descartes dele.",
    ],
    flavor: "\"São os meus olhos... Meus...\"",
  },
  "s22-m-799": {
    name: "Irmandade",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja com \"Uchiha\" no nome, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Não vamos ter tanto tempo só para nós.\"",
  },
  "s22-m-800": {
    name: "Treino de Sábio",
    text: [
      "Efeito: Mova 1 card de Raio, 1 card de Fogo e 1 card de Vento da sua Pilha de Descartes e/ou área de Chakra para a sua mão.",
    ],
    flavor: "\"O quê? Mais treino não!\"",
  },
  "s22-m-801": {
    name: "Um Bom Livro",
    text: [
      "Permanente",
      "[Troca de Jutsu | Missão] Remova do jogo um card da sua mão: Mova da sua Pilha de Descartes para a sua área de Chakra até 2 cards que compartilhem pelo menos 1 Símbolo com o card removido.",
    ],
    flavor: "\"Eu acho essa história maravilhosa.\"",
  },
  "s22-m-802": {
    name: "Habilidades Insanas",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja \"Nuvem\", revele-o e mova-o para a sua mão. Depois, se você tiver um Ninja \"Nuvem\" em jogo, mova até 3 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Mordi a língua.\"",
  },
  "s22-m-803": {
    name: "Abandonado",
    text: [
      "Permanente (1)",
      "Efeito: Quando qualquer Ninja receber Dano por causa do Showdown, descarte-o.",
    ],
    flavor: "\"O quê?!\"",
  },
  "s22-m-804": {
    name: "O Desastre da Raposa de Nove Caudas",
    text: [
      "Efeito: Compre 2 cards. Depois, se você tiver um Ninja com Custo de Entrada 7 ou mais, compre 2 cards.",
    ],
    flavor: "\"As Bijuu são feras demoníacas lendárias com caudas.\"",
  },
  "s22-m-805": {
    name: "Como Aquele Herói",
    text: [
      "Efeito: Descarte qualquer número dos seus Ninjas \"Animal\" e/ou \"Besta com Caudas\". Nesse caso, procure no seu Deck 1 card de Ninja com Custo de Entrada menor que o Custo de Entrada total de todos os Ninjas descartados por este efeito, revele-o e mova-o para a sua Vila. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Ele não te lembra aqueles dois?\"",
  },
  "s22-m-806": {
    name: "Choque Feroz",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: O alvo não pode ser bloqueado por Ninjas com Combate menor que o dele durante este turno.",
    ],
    flavor: "\"Que golpes são esses?!\"",
  },
  "s22-m-807": {
    text: [
      "Permanente",
      "[Atacante | Missão] (1): Veja os 3 cards do topo do seu Deck e mova qualquer número deles para a sua Pilha de Descartes. Depois, devolva o resto ao topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Não tenho tempo para cochilar!\"",
  },
  "s22-m-808": {
    name: "Emboscada",
    text: [
      "Alvo: 1 card de Ninja na sua área de Chakra.",
      "Efeito: O alvo ganha EMBOSCADA (EMBOSCADA: Durante a sua Fase de Missão, se um card de Ninja com esta Característica estiver na sua área de Chakra, você pode baixá-lo. Isso conta como um Ninja baixado. Os Custos de Entrada e de Mão devem ser pagos, e a regra de \"1 Ninja por turno\" se aplica).",
    ],
    flavor: "\"Eles ainda não acharam a nossa localização exata...\"",
  },
  "s22-m-809": {
    name: "Rito de Sucessão",
    text: [
      "Alvo: 1 dos seus Ninjas de Água com Custo de Entrada 3 ou mais",
      "Efeito: Descarte o alvo e 1 dos Ninjas do seu oponente.",
    ],
    flavor: "\"Talvez eu devesse te fatiar.\"",
  },
  "s22-m-810": {
    name: "Mestre e Discípulo",
    text: [
      "Efeito: Compre 2 cards. Depois, se o seu oponente tiver 2 Chakras ou menos, compre 1 card.",
    ],
    flavor: "\"Mesmo que as pessoas da vila não tenham laços de sangue...\"",
  },
  "s22-m-811": {
    name: "Pesquisa",
    text: [
      "Permanente (2)",
      "Efeito: Quando um Ninja for descartado por causa do Showdown, o oponente do controlador desse Ninja deve descartar 1 dos Ninjas dele.",
      "No final do turno, se não houver Ninjas em jogo, descarte esta Missão.",
    ],
    flavor: "\"Eu estava desenvolvendo... uma nova técnica.\"",
  },
  "s22-m-812": {
    name: "A Página em Branco",
    text: [
      "Alvo: 1 dos Ninjas do seu oponente",
      "Efeito: Se o Custo de Entrada do alvo for menor que o número de cards na sua mão, retire o alvo do Time dele.",
    ],
    flavor: "\"Por que será que ele deixou em branco?\"",
  },
  "s22-m-813": {
    name: "Barreira de Selamento",
    text: [
      "Permanente (3)",
      "Efeito: Os jogadores só podem enviar 1 Time para Atacar a cada turno.",
    ],
    flavor: "\"Você baixou a guarda no último instante.\"",
  },
  "s22-m-814": {
    name: "Ignorância",
    text: [
      "Alvo: 1 dos Ninjas do seu oponente",
      "Efeito: O alvo não pode ser enviado para a Batalha durante este turno. Depois, compre 1 card.",
    ],
    flavor: "\"Eu também não tinha percebido...\"",
  },
  "s22-m-815": {
    name: "Um Presente",
    text: [
      "Efeito: Compre 3 cards. Depois, mova 1 card da sua mão para o fundo do seu Deck.",
    ],
  },
  "s22-m-816": {
    name: "Kage da Folha",
    text: [
      "Permanente",
      "Efeito: Quando você colocar em jogo um Ninja \"Satoosa\", procure no seu Deck 1 card de Jutsu, revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"A partir de hoje, sou eu quem vai comandar esta vila...\"",
  },
};
