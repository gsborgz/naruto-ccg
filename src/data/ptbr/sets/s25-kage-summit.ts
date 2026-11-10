import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S25 — Kage Summit, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s25-kage-summit.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 */
export const S25_KAGE_SUMMIT_PTBR: CardTranslations = {
  // ── NINJA ──
  "s25-n-1423": {
    text: [
      "[PROTEGENDO O PLANO]",
      "Quando 1 das suas Missões Permanentes de Terra for ser retirada de jogo por um efeito, você pode, em vez disso, mover este Ninja para a sua área de Chakra e essa Missão para a sua mão.",
    ],
    flavor: "\"Só não estou tão interessado.\"",
  },
  "s25-n-1424": {
    text: [
      "[MENTE INABALÁVEL]",
      "Os Ninjas que enfrentam o Time deste Ninja com Poder Mental menor que o deste Ninja recebem -2/-0.",
    ],
    flavor: "\"Se cuida.\"",
  },
  "s25-n-1425": {
    text: [
      "[MAIS ESPERTO]",
      "[Troca de Jutsu] Mova 1 card da sua mão para o fundo do seu Deck: Se este Ninja estiver sozinho num Time, o Time deste Ninja e o Time que o enfrenta fazem uma Batalha Mental durante este turno.",
    ],
    flavor: "\"Na verdade, as coisas ficaram meio complicadas.\"",
  },
  "s25-n-1426": {
    text: [
      "[TROCA DE ARMAS]",
      "[Atacante | Missão] (Terra), (Fogo) ou (Vento): Procure no seu Deck um card de Terra, Fogo ou Vento sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Certo!\"",
  },
  "s25-n-1427": {
    text: [
      "[FORÇA INTERIOR]",
      "Válido: Este Ninja ganha +1/+0 para cada Missão Permanente.",
      "[Troca de Jutsu] Mova uma Missão Permanente que você controla para o fundo do seu Deck: Este Ninja ganha +2/+0 durante este turno.",
    ],
    flavor: "\"...Entendi...\"",
  },
  "s25-n-1428": {
    text: [
      "[GUARDIÃO DA VONTADE]",
      "[Atacante | Missão] (1): Se você controlar outro Ninja de Terra, embaralhe no seu Deck até 3 cards da sua Pilha de Descartes. Depois, se você controlar outro Ninja de Fogo, descarte os 2 cards do topo do Deck do seu oponente.",
    ],
    flavor: "\"Não somos mais crianças.\"",
  },
  "s25-n-1429": {
    text: [
      "[VONTADE DE PROTEGER]",
      "Quando você colocar em jogo uma Missão de Terra Permanente (X), coloque um marcador adicional nessa Missão.",
    ],
    flavor: "\"Eu... só estou sendo egoísta...\"",
  },
  "s25-n-1430": {
    text: [
      "[ESPOROS INFECCIOSOS]",
      "Quando este Ninja for colocado em jogo, coloque 2 Marcadores +1/+1 nele.",
      "[Válido | Missão] Remova um Marcador +1/+1 deste Ninja ou um marcador de uma Missão Permanente que você controla: Coloque um marcador na Missão Permanente alvo ou coloque um Marcador +1/+1 neste Ninja.",
    ],
    flavor: "\"Mas esta é uma situação de crise...\"",
  },
  "s25-n-1431": {
    text: [
      "[TÉCNICA EXPLOSIVA]",
      "Válido: Quando um marcador for removido de 1 das suas Missões Permanentes, você pode colocar um Marcador de \"Bomba\" no Ninja alvo que não tenha Marcadores de \"Bomba\".",
      "[Válido | Missão | Troca de Jutsu] (2): Cause 1 Dano ao Ninja alvo que tenha um Marcador de \"Bomba\". Depois, remova esse Marcador de \"Bomba\" do jogo.",
    ],
    flavor: "\"Então pare de se achar!\"",
  },
  "s25-n-1432": {
    text: [
      "[GUARDA-COSTAS DA PEDRA]",
      "Quando este Ninja for colocado em jogo, se você controlar outro Ninja de Vento, retire o Ninja alvo do Time dele.",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja de Fogo, fira o Ninja alvo cujo Custo de Entrada seja menor que o deste Ninja.",
    ],
    flavor: "\"Agora vamos andando.\"",
  },
  "s25-n-1433": {
    text: [
      "[ESTILO ÚNICO]",
      "Quando este Ninja for colocado em jogo, procure no seu Deck um card de Missão Permanente de Terra com Custo de Entrada menor ou igual ao número de Missões Permanentes que você controla e coloque-o em jogo.",
      "Válido: Quando uma das suas Missões Permanentes de Terra for ser retirada de jogo, em vez disso, embaralhe-a no seu Deck e compre 1 card.",
    ],
    flavor: "\"Fique parado.\"",
  },
  "s25-n-1434": {
    text: [
      "[GUARDA-COSTAS DA PEDRA]",
      "Válido: No início do seu turno, se você controlar outro Ninja de Terra, coloque um marcador na Missão Permanente (X) alvo que você controla.",
      "Válido: No início do seu turno, se você controlar outro Ninja de Fogo, pode descartar 1 card. Nesse caso, compre 1 card.",
    ],
    flavor: "\"Para que adiar a glória?\"",
  },
  "s25-n-1435": {
    name: "O 3º Tsuchikage",
    text: [
      "[A SOMBRA DA TERRA]",
      "Quando 1 ou mais Ninjas que você controla e que compartilham um Símbolo com este Ninja se tornarem alvo de um Jutsu, você pode pagar (1). Nesse caso, negue esse Jutsu e mova-o para o topo do Deck do Dono Original dele; depois, o Usuário dele passa a ser um Ninja Reserva.",
    ],
  },
  "s25-n-1436": {
    name: "Gato Barman",
    text: [
      "[ANOTANDO PEDIDOS]",
      "[Atacante | Missão] (Fogo), (Raio) ou (Água): Procure no seu Deck um card de Fogo, Raio ou Água sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"A sua bebida de Matatabi, senhorita.\"",
  },
  "s25-n-1437": {
    text: [
      "[GUARDA-COSTAS]",
      "Este Ninja ganha +1/+0 para cada marcador nos Ninjas do seu oponente.",
    ],
    flavor: "\"Você não me parece familiar.\"",
  },
  "s25-n-1438": {
    text: [
      "[SELAMENTO DE ALMA]",
      "[Bloqueador | Missão] Remova do jogo este card de Ninja que está na sua mão: Negue o texto de efeito do Ninja alvo durante este turno.",
    ],
    flavor: "\"Você não é tão forte assim.\"",
  },
  "s25-n-1439": {
    text: [
      "[GÊNIO INIGUALÁVEL]",
      "Os Ninjas do seu oponente que não sejam \"Taijutsu\" e tenham Custo de Entrada 2 ou menos não podem ser enviados para Atacar no turno em que forem colocados em jogo.",
    ],
    flavor: "\"Venha comigo.\"",
  },
  "s25-n-1440": {
    text: [
      "[PRESA DUPLA]",
      "[Atacante | Missão] (1): Se você controlar outro Ninja de Fogo, remova um marcador da Missão Permanente alvo e depois coloque um Marcador -1/-1 no Ninja alvo. Depois, se você controlar outro Ninja de Raio, negue o texto de efeito dessa Missão durante este turno.",
    ],
    flavor: "\"Eu vou detê-lo.\"",
  },
  "s25-n-1441": {
    text: [
      "[ADIÇÃO DESAJEITADA]",
      "Quando este Ninja for baixado, procure um card no seu Deck e remova-o do jogo.",
      "Válido: Quando este Ninja for ser retirado de jogo, em vez disso, mova para a sua mão o card que você removeu do jogo com este efeito e depois mova este Ninja para os Prêmios de Batalha do seu oponente.",
    ],
    flavor: "\"Estamos prontos para ir!\"",
  },
  "s25-n-1442": {
    text: [
      "[ALMA IMORTAL]",
      "Válido: Quando este Ninja for ser removido do jogo, em vez disso, mova-o para a sua Pilha de Descartes.",
      "[Atacante | Missão] Dê 1 Prêmio de Batalha ao seu oponente: Se o seu Marcador de Turnos for igual ou maior que o Custo de Entrada deste card de Ninja, coloque este card de Ninja em jogo a partir da sua Pilha de Descartes. (Este efeito só pode ser ativado a partir da Pilha de Descartes.)",
    ],
    flavor: "\"Senhor Jashin, contemple!\"",
  },
  "s25-n-1443": {
    text: [
      "[BATALHA LENDÁRIA]",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja de Raio, todos os seus Ninjas ganham +2/+0 durante este turno.",
      "Quando este Ninja for colocado em jogo, se você controlar outro Ninja de Água, você pode ver os 4 cards do topo do seu Deck, mover qualquer um deles para o fundo do seu Deck e depois mover o resto para o topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Não esquenta.\"",
  },
  "s25-n-1444": {
    text: [
      "[LÂMINA DE RELÂMPAGO]",
      "No início do seu turno, se você controlar outro Ninja de Fogo, pode colocar um Marcador -1/-1 no Ninja alvo.",
      "Válido: Quando 1 dos seus outros Ninjas for ferido, se você controlar outro Ninja de Raio, coloque um Marcador +1/+1 nesse Ninja ferido.",
    ],
    flavor: "\"Bem corajoso.\"",
  },
  "s25-n-1445": {
    text: [
      "[UNIVERSO ALTERADO]",
      "Quando este Ninja for baixado, se você controlar 4 ou mais Ninjas \"Genjutsu\", coloque em jogo uma moeda de Ninja \"Clone do Itachi\" 6/3 (Saudável), 0/0 (Ferido) com o seguinte: [\"Genjutsu\"].",
      "[Troca de Jutsu] Remova um Ninja \"Clone do Itachi\" do jogo: O seu oponente não pode ganhar nenhum Prêmio de Batalha durante este turno.",
    ],
    flavor: "\"Ele está morrendo.\"",
  },
  "s25-n-1446": {
    name: "O 3º Hokage",
    text: [
      "[A SOMBRA DO FOGO]",
      "Quando este Ninja for enfrentado, você pode colocar um Marcador -1/-1 em cada Ninja adversário e descartar 2 Chakras do seu oponente. Nesse caso, se este Ninja conseguir qualquer Vitória durante este turno, você ganha 1 Prêmio de Batalha.",
    ],
  },
  "s25-n-1447": {
    name: "Quatro Caudas",
    text: [
      "[FLUXO DE LAVA]",
      "Válido: Quando um Ninja \"Besta com Caudas\" que você controla for receber Dano por causa do Showdown, você pode causar 1 Dano a 1 Ninja que enfrenta esse Ninja.",
      "Quando um Ninja \"Besta com Caudas\" que você controla for receber qualquer Dano ou ser retirado de jogo por um Jutsu, cause 1 Dano ao Usuário desse Jutsu.",
    ],
  },
  "s25-n-1448": {
    text: [
      "[CRIADOR DE ARMAS]",
      "Quando você colocar em jogo outro Ninja \"Arma\", coloque um Marcador +1/+1 nele.",
      "Quando um Time que você controla conseguir uma Vitória Espetacular, se esse Time tiver 1 ou mais Ninjas \"Arma\" com 1 ou mais Marcadores +1/+1, você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Eu tenho uma coisa grande!\"",
  },
  "s25-n-1449": {
    text: [
      "[ASSISTENTE DO MESTRE DE ARMAS]",
      "[Atacante | Missão] Remova do jogo este card de Ninja que está na sua mão: Mova da sua Pilha de Descartes para a sua mão 1 card de Jutsu com \"Arma\" nos Requerimentos.",
    ],
    flavor: "\"É, que chato, professor.\"",
  },
  "s25-n-1450": {
    text: [
      "[A FERA VERDE]",
      "[Atacante | Missão] (1): Se você controlar outro Ninja de Raio, pode colocar um Marcador +1/+1 em 1 dos seus Ninjas que não tenha marcadores. Depois, se você controlar outro Ninja de Vento, pode ver o card do topo do Deck do seu oponente e movê-lo para o topo ou para o fundo do Deck dele.",
    ],
    flavor: "\"De volta ao seu velho jeito.\"",
  },
  "s25-n-1451": {
    text: [
      "[SECRETÁRIA DA NUVEM]",
      "[Atacante | Missão] (Raio), (Água) ou (Vento): Procure no seu Deck um card de Raio, Água ou Vento sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"De novo não!\"",
  },
  "s25-n-1452": {
    name: "Rato de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "[Atacante | Missão] (3): Coloque este card de Ninja em jogo a partir da sua mão.",
      "[Atacante | Missão] Descarte este Ninja: Todos os seus Chakras de Raio contam como 2 de Raio durante este turno.",
    ],
  },
  "s25-n-1453": {
    text: [
      "[ORGULHO PRÓPRIO]",
      "Válido: Este Ninja recebe -1/-0 para cada outro Ninja que você controla. Este efeito não pode ser negado.",
    ],
    flavor: "\"Ele ainda não percebeu...!\"",
  },
  "s25-n-1454": {
    text: [
      "[SÁBIO DA TINTA]",
      "Quando este Ninja for baixado, coloque em jogo até 2 cards de Ninja \"Tinta\" com Custo de Entrada 4 ou menos da sua Pilha de Descartes ou área de Chakra.",
    ],
    flavor: "\"Não vou deixar você ir mais longe.\"",
  },
  "s25-n-1455": {
    text: [
      "[GUARDA-COSTAS DA NUVEM]",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja de Água, o Combate do Ninja alvo passa a ser 0 durante este turno.",
      "Quando este Ninja for colocado em jogo, se você controlar outro Ninja de Vento, remova do jogo o card do topo do seu Deck. Se o card removido não for um card de Ninja, você pode jogá-lo como se estivesse na sua mão durante este turno.",
    ],
    flavor: "\"Pare de tagarelar e vamos!\"",
  },
  "s25-n-1456": {
    text: [
      "[A FERA AZUL]",
      "[Válido | Troca de Jutsu] Dê 2 Prêmios de Batalha ao seu oponente: Cause 2 Dano ao Ninja adversário alvo.",
    ],
    flavor: "\"O quê?!\"",
  },
  "s25-n-1457": {
    text: [
      "[GUARDA-COSTAS DA NUVEM]",
      "Válido: No início do seu turno, se você controlar outro Ninja de Raio, coloque um Marcador +1/+1 no Ninja alvo.",
      "Válido: Enquanto você controlar outro Ninja de Água, todos os efeitos ativados do seu oponente custam (1) a mais para ativar.",
    ],
    flavor: "\"Claaaro.\"",
  },
  "s25-n-1458": {
    name: "Morcego de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "[Atacante | Missão] (5): Coloque este card de Ninja em jogo a partir da sua mão.",
      "Válido: Todos os seus Ninjas sem \"Tinta\" ganham \"Tinta\".",
    ],
  },
  "s25-n-1459": {
    name: "O 4º Raikage",
    text: [
      "[A SOMBRA DO RAIO]",
      "[Troca de Jutsu] (2): Se este Ninja estiver sozinho num Time, ele ganha +5/+0 e o Suporte de todos os Ninjas adversários passa a ser 0 durante este turno. Depois, compre 1 card.",
    ],
  },
  "s25-n-1460": {
    name: "O Espírito da Raposa de Nove Caudas",
    text: [
      "[DESASTRE ANCESTRAL]",
      "[Válido | Atacante | Missão] Descarte 1 Naruto Uzumaki (Seis Caudas) da sua Vila: Coloque este card de Ninja em jogo.",
      "Quando este Ninja for colocado em jogo, você vence o jogo.",
    ],
    flavor: "\"Destrua tudo.\"",
  },
  "s25-n-1461": {
    name: "Anbu da Névoa",
    text: [
      "[ATAQUE OCULTO]",
      "Não Único",
      "[Atacante | Missão] Mova 3 cards da Pilha de Descartes do seu oponente para a área de Chakra dele: Coloque este card de Ninja em jogo a partir da sua mão.",
    ],
  },
  "s25-n-1462": {
    text: [
      "[A VINGANÇA DA CHUVA]",
      "[Atacante | Missão] Mova 1 card do topo do Deck do seu oponente para a área de Chakra dele: Se o seu oponente tiver 3 ou mais Chakras, este Ninja ganha +2/+0 durante este turno.",
    ],
  },
  "s25-n-1463": {
    text: [
      "[PUNHO DE ARHAT]",
      "[Atacante | Troca de Jutsu] Mova 1 card da Pilha de Descartes do seu oponente para a área de Chakra dele: Este Ninja ganha +1/+0 durante este turno. Quando este Ninja ganhar qualquer Prêmio de Batalha durante este turno, se o seu oponente tiver 3 ou mais Chakras, descarte 1 dos Prêmios de Batalha do seu oponente.",
    ],
    flavor: "\"Jirobo do Portão Sul.\"",
  },
  "s25-n-1464": {
    text: [
      "[SINFONIA]",
      "[Atacante | Missão] (1): Se você controlar outro Ninja de Água, nenhum Time pode fazer uma Batalha Mental durante este turno. Depois, se você controlar outro Ninja de Terra, troque 1 card da sua mão por 1 dos Prêmios de Batalha com a face para baixo do seu oponente.",
    ],
    flavor: "\"Tayuya do Portão Norte.\"",
  },
  "s25-n-1465": {
    text: [
      "[ENTRANDO NO JOGO]",
      "[Atacante | Missão] (Água), (Terra) ou (Fogo): Procure no seu Deck um card de Água, Terra ou Fogo sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Kidomaru do Portão Leste.\"",
  },
  "s25-n-1466": {
    text: [
      "[MULTIPUNHO]",
      "Válido: Enquanto o seu oponente tiver 5 ou mais Chakras, se este Ninja ganhar qualquer Prêmio de Batalha, você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Sakon do Portão Oeste.\"",
  },
  "s25-n-1467": {
    name: "Jugo (Estado 1)",
    text: [
      "[GOSTO DO PODER]",
      "[Válido | Atacante | Troca de Jutsu] Mova 1 card da Pilha de Descartes do seu oponente para a área de Chakra dele: Este Ninja ganha +1/+0 durante este turno. Este efeito pode ser usado até três vezes por turno.",
    ],
    flavor: "\"Ah-ha!!!!\"",
  },
  "s25-n-1468": {
    text: [
      "[LIQUEFAZER]",
      "Enquanto o seu oponente tiver 8 ou mais Chakras, este Ninja ganha +2/+0, e qualquer Dano que este Ninja receber é reduzido em 1.",
    ],
    flavor: "\"Minha pobre lâmina do carrasco!!\"",
  },
  "s25-n-1469": {
    text: [
      "[GUARDA-COSTAS DA NÉVOA]",
      "Válido: Quando este Ninja for colocado em jogo, se você controlar outro Ninja de Terra, compre 1 card e depois mova 1 card da sua mão para o fundo do seu Deck.",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja de Fogo, o seu oponente descarta os 3 cards do topo do Deck dele, a menos que ele dê a você 1 Prêmio de Batalha.",
    ],
    flavor: "\"...Espero...\"",
  },
  "s25-n-1470": {
    text: [
      "[GUARDA-COSTAS DA NÉVOA]",
      "Válido: No início do seu turno, se você controlar outro Ninja de Terra, o seu oponente revela 1 card aleatório da mão.",
      "Válido: No início do seu turno, se você controlar outro Ninja de Água, pode ver o card do topo do seu Deck. Nesse caso, se for um card de Missão, revele-o e mova-o para a sua mão. Se não, embaralhe o seu Deck.",
    ],
    flavor: "\"Eu passo conselhos valiosos nas minhas palestras, sabia?\"",
  },
  "s25-n-1471": {
    name: "O 5º Mizukage",
    text: [
      "[A SOMBRA DA ÁGUA]",
      "[Missão] (2): Negue o texto de efeito de 2 Ninjas alvo durante este turno. Quando esses Ninjas receberem Dano durante este turno, descarte-os, e o seu oponente descarta os 4 cards do topo do Deck dele.",
    ],
  },
  "s25-n-1472": {
    text: [
      "[AMARRA DE SERPENTE]",
      "Válido: Enquanto o seu oponente tiver 10 ou mais Chakras, você pode jogar cards de Jutsu de Água da sua Pilha de Descartes como se estivessem na sua mão. Os cards de Jutsu jogados dessa forma são removidos do jogo depois de resolvidos.",
    ],
    flavor: "\"A hora é agora...\"",
  },
  "s25-n-1473": {
    text: [
      "[TRANQUILIZANTE]",
      "[Bloqueador | Missão] Remova do jogo este card de Ninja que está na sua mão: O Ninja alvo não pode formar Times nem ser enviado para Atacar durante este turno.",
    ],
    flavor: "\"Alvo localizado.\"",
  },
  "s25-n-1474": {
    name: "Oficial de Prevenção de Epidemias",
    text: [
      "[JUTSU DE CURA]",
      "[Missão | Troca de Jutsu] Remova do jogo este card de Ninja que está na sua mão: Cure o Ninja ferido alvo.",
    ],
    flavor: "\"Alvo capturado!\"",
  },
  "s25-n-1475": {
    text: [
      "[MASCOTE DA LÍDER]",
      "Quando este Ninja for colocado em jogo, jogue a Moeda Ninja. Se der cara, procure no seu Deck um card de Ninja Shizune, revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
  },
  "s25-n-1476": {
    text: [
      "[SEGUINDO UM RASTRO]",
      "[Atacante | Missão (Vento), (Terra) ou (Raio): Procure no seu Deck um card de Vento, Terra ou Raio sem \"EMBOSCADA\" e mova-o para a sua área de Chakra. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Deixe ele comigo.\"",
  },
  "s25-n-1477": {
    text: [
      "[ESTUDANTE DE MEDICINA]",
      "[Atacante | Missão] (1): Se você controlar outro Ninja de Vento, pode curar o Ninja alvo. Depois, se você controlar outro Ninja de Água, pode fazer 1 Ninja usar o Poder de ferido durante este turno.",
    ],
    flavor: "\"Eu faço o que você quiser.\"",
  },
  "s25-n-1478": {
    text: [
      "[VENDAVAL]",
      "[Troca de Jutsu] (Vento|Vento): Negue o Jutsu alvo e devolva-o, junto com este Ninja, à mão do Dono Original deles.",
    ],
    flavor: "\"S-Sim, senhor!\"",
  },
  "s25-n-1479": {
    name: "Anbu da Areia",
    text: [
      "[ATAQUE SURPRESA]",
      "Não Único",
      "Os cards de Ninja \"Marionete\" na sua área de Chakra ganham \"EMBOSCADA\".",
      "[Atacante | Missão] (0): Se você controlar 4 ou mais Ninjas \"Marionete\", pode colocar este card de Ninja em jogo a partir da sua mão.",
    ],
  },
  "s25-n-1480": {
    text: [
      "[BUROCRATA]",
      "Quando este Ninja for baixado, você pode remover do jogo este Ninja e um Ninja Tonton que você controla. Nesse caso, você pode colocar em jogo um card de Ninja Tsunade da sua mão, Pilha de Descartes ou área de Chakra.",
    ],
    flavor: "\"Não me diga...?!\"",
  },
  "s25-n-1481": {
    text: [
      "[GUARDA-COSTAS DA AREIA]",
      "Quando este Ninja for colocado em jogo, se você controlar outro Ninja de Terra, descarte 1 dos Prêmios de Batalha do seu oponente.",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja de Raio, mova um card de Jutsu da sua Pilha de Descartes para o topo do seu Deck.",
    ],
    flavor: "\"Repete isso, velho?!!\"",
  },
  "s25-n-1482": {
    name: "Escorpião",
    text: [
      "[EX-AKATSUKI]",
      "Válido: Enquanto você não tiver um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "Quando este Ninja for colocado em jogo, se você controlar um Ninja \"Mestre de Marionetes\", procure no seu Deck 1 card de Jutsu com \"Marionete\" nos Requerimentos e depois mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
  },
  "s25-n-1483": {
    name: "Sete Caudas",
    text: [
      "[SETE CAUDAS]",
      "Quando um Ninja \"Besta com Caudas\" que você controla conseguir qualquer Vitória, se ele estiver sozinho num Time, você ganha 1 Prêmio de Batalha.",
      "[Válido | Atacante | Missão] (1): Você pode jogar um card de Missão Enfurecendo a Fera da sua área de Chakra como se estivesse na sua mão. Se fizer isso, remova-o do jogo depois.",
    ],
  },
  "s25-n-1484": {
    text: [
      "[GUARDA-COSTAS DA AREIA]",
      "Válido: No início do seu turno, se você controlar outro Ninja de Raio, pode mover o card do topo do seu Deck para a sua área de Chakra.",
      "Válido: Quando você jogar uma Missão, se você controlar outro Ninja de Vento, compre 1 card.",
    ],
    flavor: "\"O que devemos fazer?\"",
  },
  "s25-n-1485": {
    name: "O 5º Kazekage",
    text: [
      "[A SOMBRA DO VENTO]",
      "Os outros Ninjas que você controla não podem ser alvo dos efeitos de Ninja do seu oponente.",
      "[Troca de Jutsu] (1): Negue o Jutsu alvo. Depois, mova da sua Pilha de Descartes para a sua área de Chakra uma quantidade de cards igual ao custo do alvo.",
    ],
  },
  "s25-n-1486": {
    text: [
      "[ESQUADRÃO IDEAL]",
      "Quando você jogar um card, se esse card for um card de Terra, fira o Ninja alvo. Se não, o Ninja alvo passa a ser 0/0 durante este turno.",
    ],
  },
  "s25-n-1487": {
    text: [
      "[LAÇOS DE SANGUE]",
      "Válido: Quando este Ninja Atacar, fira o Ninja alvo com Custo de Entrada menor que o deste Ninja.",
      "O seu oponente só pode jogar 1 card de Jutsu durante o turno em que este Ninja Bloquear.",
    ],
  },
  // ── JUTSU ──
  "s25-j-921": {
    name: "Jutsu Esporulação",
    text: [
      "Efeito: Remova do jogo X cards de Ninja da Pilha de Descartes do seu oponente. Nesse caso, coloque em jogo X moedas de Ninja Esporo \"Não Único\" 0/0 (Saudável e Ferido).",
    ],
    flavor: "\"O quê!?\"",
  },
  "s25-j-922": {
    name: "Estilo Madeira: Jutsu Casa dos Quatro Pilares",
    text: [
      "Requerimentos: \"Árvore\"",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: O alvo passa a ser um Ninja Reserva. Se o custo maior deste Jutsu foi pago, todos os outros Ninjas do Time do alvo passam a ser Ninjas Reserva.",
    ],
    flavor: "\"Você fica bem quietinho aí.\"",
  },
  "s25-j-923": {
    name: "Estilo Lava: Monstro de Lava",
    text: [
      "Requerimentos: Terra + Fogo",
      "Alvo: Todos os Ninjas de Apoio que enfrentam o Usuário",
      "Efeito: O alvo passa a ser um Ninja Reserva. Depois, fira o alvo.",
      "Especialista [Mei Terumi]: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Estilo Lava! Jutsu Monstro de Lava!\"",
  },
  "s25-j-924": {
    name: "Técnica do Golem",
    text: [
      "Requerimentos: Terra + Custo de Entrada 4 ou mais",
      "Efeito: Coloque uma moeda de Ninja Golem 3/3 (Saudável e Ferido) no Time do Usuário, em qualquer posição, com o seguinte: [Quando qualquer outro Ninja do Time deste Ninja for receber qualquer Dano, reduza esse Dano em 1.]",
    ],
    flavor: "\"Rurk.\"",
  },
  "s25-j-925": {
    name: "Estilo Terra: Jutsu Rocha Pesada",
    text: [
      "Efeito: Aumente em 1 o Custo de Entrada dos cards de Ninja na mão do seu oponente durante este turno e o próximo.",
    ],
    flavor: "\"Estilo Terra! Jutsu Rocha Pesada!\"",
  },
  "s25-j-926": {
    name: "Estilo Partícula: Jutsu de Desmantelamento Atômico",
    text: [
      "Requerimentos: \"Satoosa\"",
      "Alvo: 1 Ninja",
      "Efeito: Todos os outros Ninjas do Time do alvo passam a ser Ninjas Reserva, e remova o alvo do jogo. Depois, compre 2 cards.",
      "Especialista [\"Gravidade\"]: Cause 2 Dano a todos os Ninjas que passaram a ser Ninjas Reserva por este efeito.",
    ],
    flavor: "\"Estilo Partícula! Jutsu de Desmantelamento Atômico!\"",
  },
  "s25-j-927": {
    name: "O Selo de Danzo",
    text: [
      "Efeito: Diga o nome de um card. Durante este turno e o próximo, o seu oponente não pode jogar o card dito.",
    ],
    flavor: "\"Todos nós da Raiz carregamos um.\"",
  },
  "s25-j-928": {
    name: "Lâmina de Relâmpago",
    text: [
      "Requerimentos: Kakashi Hatake",
      "Alvo: 1 Ninja",
      "Efeito: O Usuário ganha +3/+3 durante este turno. Depois, jogue a Moeda Ninja. Se der cara, cause 2 Dano ao alvo; se não, cause 1 Dano ao alvo.",
    ],
    flavor: "\"...você é mesmo rápido.\"",
  },
  "s25-j-929": {
    text: [
      "Reduza o custo deste card em (1) para cada Ninja \"Genjutsu\" que você controla.",
      "Requerimento: \"Genjutsu\" + Custo de Entrada 5 ou mais",
      "Efeito: Você controla o próximo turno do seu oponente (você vê todos os cards que esse jogador veria, toma todas as decisões por ele e joga os cards dele por ele).",
    ],
    flavor: "\"I-isso... só pode ser genjutsu.\"",
  },
  "s25-j-930": {
    name: "Escudo de Amaterasu",
    text: [
      "Requerimentos: Itachi Uchiha ou Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Efeito: Quando o seu oponente for ganhar qualquer Prêmio de Batalha durante este turno, em vez disso, você ganha a mesma quantidade.",
    ],
    flavor: "\"Um escudo de chamas negras!\"",
  },
  "s25-j-931": {
    name: "Estilo Inferno: Controle das Chamas",
    text: [
      "Requerimentos: Sasuke Uchiha + Custo de Entrada 5 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 2 Dano ao alvo. Depois, se o Usuário estiver bloqueando, cause 1 Dano a todos os Ninjas que compartilham um Símbolo com o alvo.",
    ],
    flavor: "\"Estilo Inferno! Controle das Chamas!\"",
  },
  "s25-j-932": {
    name: "Estilo Vendaval: Circo de Laser",
    text: [
      "Enquanto X for 3 ou mais, este Jutsu não pode ser alvo dos efeitos do seu oponente.",
      "Requerimentos: Raio + Custo de Entrada 3 ou mais, ou Vento + Custo de Entrada 3 ou mais",
      "Efeito: Aplique os efeitos a seguir conforme X: 1+) Cause 1 Dano a 1 Ninja que enfrenta o Usuário 2+) Fira 1 Ninja",
    ],
    flavor: "\"Estilo Vendaval! Circo de Laser!\"",
  },
  "s25-j-933": {
    name: "Ilusão de Raio: Pilar de Clarão",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Durante este turno e o próximo, o alvo não pode usar Jutsus.",
    ],
    flavor: "\"Ilusão de Raio! Pilar de Clarão!\"",
  },
  "s25-j-934": {
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Alvo: 1 Ninja que o seu oponente controla no Campo de Batalha",
      "Efeito: Mova o alvo para o Time que enfrenta o Usuário, como Ninja Líder, e depois fira o alvo. Se o Usuário conseguir qualquer Vitória durante este turno, compre 1 card.",
      "Especialista [A]: Negue todos os outros Jutsus na Sequência. Os jogadores não podem jogar cards de Jutsu durante este turno.",
    ],
    flavor: "\"Liger Bomb!!\"",
  },
  "s25-j-935": {
    name: "Armadura do Estilo Raio",
    text: [
      "Efeito: O alvo de qualquer card de Jutsu que o Usuário usar pode ser mudado para \"1 Ninja\" durante este turno.",
      "Especialista [A]: Devolva este card à sua mão.",
    ],
    flavor: "\"Estou impressionado que você tenha conseguido me tocar.\"",
  },
  "s25-j-936": {
    name: "Estilo Raio: Onda de Emoção",
    text: [
      "Requerimentos: Água + Custo de Entrada 5 ou mais, ou Raio + Custo de Entrada 5 ou mais",
      "Efeito: Cause 1 Dano ao Ninja alvo que enfrenta o Usuário para cada Chakra de Raio usado para pagar este Jutsu; depois, cause essa mesma quantidade de Dano a 1 outro Ninja que enfrenta o Usuário para cada Chakra de Água usado para pagar este Jutsu.",
    ],
    flavor: "\"Estilo Raio! Onda de Emoção!\"",
  },
  "s25-j-937": {
    name: "Estilo Água: Muralha de Água",
    text: [
      "Efeito: Durante este turno e o próximo, os jogadores não podem jogar cards de Missão.",
    ],
    flavor: "\"Estilo Água! Muralha de Água!\"",
  },
  "s25-j-938": {
    name: "Rajada de Chakra do Selo Amaldiçoado",
    text: [
      "Requerimentos: \"Estado 2\" ou Jugo + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja no Campo de Batalha com mais Suporte que o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Depois, você pode ferir o Usuário. Nesse caso, cause 1 Dano ao alvo.",
    ],
    flavor: "\"Mwa-ha ha!\"",
  },
  "s25-j-939": {
    name: "Espada Dupla Hiramekarei: Martelo",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: Você pode pagar (2). Nesse caso, o Usuário ganha +4/+4 durante este turno. Depois, você pode fazer 1 Ninja que enfrenta o Usuário passar a ser um Ninja Reserva, se o Combate dele for menor que o do Usuário.",
    ],
    flavor: "\"Liberar Hiramekarei!\"",
  },
  "s25-j-940": {
    name: "Estilo Vapor: Jutsu Névoa Sólida",
    text: [
      "Requerimentos: Água + Fogo",
      "Alvo: Todos os Ninjas que enfrentam o Usuário",
      "Efeito: Se o Custo de Entrada do alvo for igual ou menor que o do Usuário, fira o alvo.",
      "Especialista [Mei Terumi]: Descarte todos os Ninjas feridos que enfrentam o Usuário.",
    ],
    flavor: "\"Estilo Vapor! Jutsu Névoa Sólida!\"",
  },
  "s25-j-941": {
    name: "Escudo de Areia",
    text: [
      "Efeito: Durante este turno e o próximo, os Ninjas não podem receber Dano.",
    ],
    flavor: "\"...Parece que a sua defesa absoluta continua firme.\"",
  },
  "s25-j-942": {
    name: "Jutsu Foice de Vento",
    text: [
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo.",
      "Especialista [Temari]: Mova o Usuário do alvo para a mão do Dono Original dele.",
    ],
    flavor: "\"Jutsu Foice de Vento!\"",
  },
  "s25-j-943": {
    name: "Técnica Secreta Vermelha: Tríade de Marionetes!",
    text: [
      "Reduza o custo deste card em (1) para cada Ninja \"Marionete\" e Ninja \"Mestre de Marionetes\" que você controla.",
      "Requerimentos: \"Marionete\"",
      "Alvo: Todos os Ninjas que o seu oponente controla no Campo de Batalha",
      "Efeito: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Técnica Secreta Vermelha! Tríade de Marionetes!\"",
  },
  "s25-j-944": {
    name: "Barragem de Chuva de Areia",
    text: [
      "Requerimentos: Gaara of the Desert + Custo de Entrada 2 ou mais",
      "Alvo: 1 Ninja",
      "Efeito: Escolha e aplique 1 dos seguintes: 1) O Poder do alvo passa a ser 0/0 durante este turno. 2) Fira o alvo.",
      "Especialista [\"Satoosa\"]: Descarte 1 Ninja ferido.",
    ],
    flavor: "\"Barragem de Chuva de Areia!\"",
  },
  "s25-j-945": {
    name: "Muralha de Areia",
    text: [
      "Requerimentos: Gaara of the Desert + Custo de Entrada 4 ou mais",
      "Alvo: Todos os Ninjas de 1 dos Times do seu oponente no Campo de Batalha",
      "Efeito: Fira o alvo.",
      "Especialista [\"Satoosa\"]: Descarte todos os Ninjas feridos do seu oponente.",
    ],
    flavor: "\"Obrigado...\"",
  },
  // ── MISSÃO ──
  "s25-m-884": {
    name: "Mensageiros",
    text: [
      "Permanente (2)",
      "Efeito: Quando esta Missão for colocada em jogo, se você controlar outra Missão Permanente, coloque um marcador adicional nesta Missão.",
      "Efeito: Quando você remover 1 ou mais marcadores desta Missão, compre 1 card.",
    ],
    flavor: "\"Que hora ruim.\"",
  },
  "s25-m-885": {
    name: "O Conselho da Pedra",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir:",
      "1) Mova 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
      "2) O Ninja alvo que você controla só pode ser bloqueado por Ninjas que compartilham um Símbolo com ele.",
      "3) Embaralhe a sua mão no seu Deck e depois compre o mesmo número de cards que você moveu por este efeito, mais 1.",
    ],
    flavor: "\"Olha só os jovens fazendo farra sem a menor consideração.\"",
  },
  "s25-m-886": {
    name: "Cúpula dos Cinco Kage",
    text: [
      "Enquanto este card estiver na sua área de Chakra, ele é considerado como tendo todos os Símbolos.",
      "Permanente (1)",
      "Efeito: Os Ninjas com Custo de Entrada 5 ou menos não podem ser enviados para a Batalha.",
    ],
    flavor: "\"Os Gokage se reúnem aqui hoje.\"",
  },
  "s25-m-887": {
    name: "Espólios de Guerra",
    text: [
      "Permanente (2)",
      "Alvo: 1 Ninja",
      "Efeito: Remova do jogo 1 card de Ninja da Pilha de Descartes do seu oponente. O texto de efeito do alvo é substituído pelo texto de efeito do card de Ninja removido.",
    ],
    flavor: "\"O meu olho direito também é um precioso espólio de guerra.\"",
  },
  "s25-m-888": {
    name: "Exaustão",
    text: [
      "Permanente (4)",
      "[Atacante | Missão] Remova um marcador desta Missão: Remova 2 Chakras do jogo.",
      "Quando esta Missão for retirada de jogo, devolva todos os cards removidos do jogo por este card à área de Chakra do Dono Original deles.",
    ],
    flavor: "\"Falar é fácil...\"",
  },
  "s25-m-889": {
    name: "Destruição Indescritível",
    text: [
      "Permanente (5)",
      "[Atacante | Missão] Remova X marcadores desta Missão: Remova do jogo o Ninja alvo com Custo de Entrada X ou menos. X não pode ser 0.",
      "Quando esta Missão for retirada de jogo, devolva todos os cards removidos do jogo por este efeito à Vila do Dono Original deles.",
    ],
    flavor: "\"O que você fez...\"",
  },
  "s25-m-890": {
    name: "Batalha de Desgaste",
    text: [
      "Permanente",
      "[Troca de Jutsu] Descarte 2 Ninjas que você controla: Depois desta Fase de Batalha, há uma Fase de Batalha adicional.",
    ],
    flavor: "\"O-o quê?!\"",
  },
  "s25-m-891": {
    name: "Novas Ordens",
    text: [
      "Anulação",
      "Alvo: 1 Missão",
      "Efeito: Negue e descarte o alvo. Se o Custo de Entrada do alvo for 4 ou mais, compre 1 card.",
    ],
    flavor: "\"Sim, mestre?\"",
  },
  "s25-m-892": {
    name: "O Conselho da Folha",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir:",
      "1) Procure no seu Deck 1 Ninja de Fogo com Custo de Entrada menor que o seu Marcador de Turnos, revele-o e depois mova-o para a sua mão.",
      "2) Baixe 1 card de Ninja da sua Pilha de Descartes.",
      "3) Compre 2 cards e depois mova 1 card da sua mão para a sua área de Chakra.",
    ],
    flavor: "\"Eu sei.\"",
  },
  "s25-m-893": {
    name: "Negociações Tensas",
    text: [
      "Efeito: O seu oponente escolhe 1 dos seguintes, e você o aplica:",
      "1) Você ganha 1 Prêmio de Batalha.",
      "2) O seu oponente descarta 1 dos Ninjas dele.",
    ],
    flavor: "\"Recuem.\"",
  },
  "s25-m-894": {
    name: "Uma Conversa Franca",
    text: [
      "Efeito: Os dois jogadores revelam a mão. O jogador que revelar o card de Ninja com o maior Custo de Entrada compra 2 cards. Se houver empate, os dois jogadores compram 1.",
    ],
    flavor: "\"Quer conversar?\"",
  },
  "s25-m-895": {
    name: "O Poder da Sugestão",
    text: [
      "Anulação",
      "Efeito: No final deste turno, se o seu oponente não jogou uma Missão durante este turno, retire todos os Ninjas do seu oponente dos Times deles.",
    ],
    flavor: "\"Tem alguma coisa que não está certa...\"",
  },
  "s25-m-896": {
    name: "A Proteção do Guarda-Costas",
    text: [
      "Permanente",
      "[Missão | Troca de Jutsu] Mova esta Missão para a sua área de Chakra: O Ninja alvo não pode receber Dano durante este turno.",
    ],
  },
  "s25-m-897": {
    name: "Exagero",
    text: [
      "Permanente (2)",
      "Efeito: Quando um Ninja for receber qualquer Dano, aumente esse Dano em 1. Quando um jogador for ganhar qualquer Prêmio de Batalha, aumente esse número em 1. Quando um jogador for comprar qualquer card, aumente esse número em 1.",
    ],
    flavor: "\"O que eu faço se todos vierem atrás de mim?\"",
  },
  "s25-m-898": {
    name: "Pela Vingança",
    text: [
      "Alvo: 1 Ninja que o seu oponente controla",
      "Efeito: No final deste turno, se o alvo não foi enviado para Bloquear durante este turno, cause 1 Dano ao alvo.",
    ],
    flavor: "\"Desce do salto!!\"",
  },
  "s25-m-899": {
    name: "O Conselho da Nuvem",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir:",
      "1) Coloque um Marcador +1/+1 em cada um dos seus Ninjas.",
      "2) Revele os 5 cards do topo do seu Deck. Você pode mover 1 card de Ninja entre eles para a sua mão e depois embaralhar o resto no seu Deck.",
      "3) Compre 2 cards.",
    ],
    flavor: "\"Vamos!\"",
  },
  "s25-m-900": {
    name: "Uma Saída Única",
    text: [
      "Efeito: Coloque em jogo um card de Ninja da sua mão com o texto de efeito negado. No final deste turno, se esse Ninja ainda estiver em jogo, remova-o do jogo.",
      "Enquanto este card de Missão estiver na sua área de Chakra, quando um Ninja que você controla for ser retirado de jogo por um efeito do oponente, você pode, em vez disso, remover este card de Missão do jogo e mover esse Ninja para a sua mão.",
    ],
    flavor: "\"Eu vou de escada, como gente normal...\"",
  },
  "s25-m-901": {
    name: "Uma Súplica",
    text: [
      "Efeito: O seu oponente escolhe 1 dos seguintes, e você o aplica:",
      "1) Procure no seu Deck um card de Jutsu, revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck.",
      "2) Coloque 1 Marcador de Crescimento em cada um dos seus Ninjas.",
    ],
    flavor: "\"Por favor!!\"",
  },
  "s25-m-902": {
    name: "Uma Mensagem Sombria",
    text: [
      "Efeito: Veja os 2 cards do topo do seu Deck, mova qualquer um deles para o fundo do seu Deck e mova o resto para o topo do seu Deck, em qualquer ordem. Depois, compre 1 card.",
    ],
    flavor: "\"Ora, olá...!\"",
  },
  "s25-m-903": {
    name: "O Conselho da Névoa",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir:",
      "1) Descarte 3 Chakras do seu oponente.",
      "2) Os dois jogadores escolhem e descartam 1 dos Ninjas deles.",
      "3) Escolha 2 cards da mão do seu oponente. O seu oponente revela 1 deles. Escolha 1 desses cards e descarte-o.",
    ],
    flavor: "\"Juro pelo meu título de Mizukage cumprir os meus deveres com brilhantismo.\"",
  },
  "s25-m-904": {
    text: [
      "Permanente",
      "Efeito: Quando qualquer Ninja que o seu oponente controla receber qualquer Dano por causa do Showdown, descarte esse Ninja.",
      "[Troca de Jutsu] Mova esta Missão para a sua área de Chakra: O Ninja alvo recebe -2/-2 durante este turno.",
    ],
    flavor: "\"Depois de tanto me avisar para não matar ninguém!\"",
  },
  "s25-m-905": {
    name: "Os Assassinos de Kage",
    text: [
      "Permanente (3)",
      "Alvo: 1 Ninja \"Satoosa\"",
      "Efeito: O alvo não pode formar Times, tem o texto de efeito negado e deve ser enviado para a Batalha sozinho a cada turno.",
    ],
    flavor: "\"Vou acabar com você!!\"",
  },
  "s25-m-906": {
    name: "Arrogância",
    text: [
      "Efeito: Descarte o Ninja com o maior Combate. Se houver Ninjas empatados, em vez disso, cause 1 Dano a esses Ninjas.",
    ],
    flavor: "\"Eu tenho uma defesa absoluta ainda maior que a sua.\"",
  },
  "s25-m-907": {
    name: "Líder da Névoa Sangrenta",
    text: [
      "Permanente",
      "[Troca de Jutsu] Descarte 1 dos seus Ninjas: O Ninja alvo ganha +X/+0 durante este turno, onde X = o Combate do Ninja descartado.",
    ],
    flavor: "\"O Três Caudas do antigo Mizukage.\"",
  },
  "s25-m-908": {
    name: "Com Nojo",
    text: [
      "Efeito: Coloque em jogo 2 moedas de Ninja \"Inseto\" com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)] [Não Único]\"",
      "Enquanto este card de Missão estiver na sua área de Chakra, todos os seus Ninjas \"Inseto\" ganham +1/+1.",
    ],
    flavor: "\"Você escolheu a pessoa errada.\"",
  },
  "s25-m-909": {
    name: "Guarda Pessoal",
    text: [
      "Alvo: 1 Ninja \"Satoosa\" que você controla",
      "Efeito: Procure no seu Deck um card de Ninja que compartilhe pelo menos 1 Símbolo com o alvo e tenha Custo de Entrada menor que o do alvo, revele-o e mova-o para a sua Vila. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Confio no seu discernimento.\"",
  },
  "s25-m-910": {
    name: "O Conselho da Areia",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir:",
      "1) Procure no seu Deck 1 card de Ninja com Custo de Entrada igual ou menor que o do Ninja alvo que você controla. Coloque o Ninja procurado em jogo e descarte o Ninja alvo.",
      "2) Todos os Times enfrentados fazem uma Batalha Mental durante este turno.",
      "3) Mova 1 card de Raio da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Estamos indo.\"",
  },
  "s25-m-911": {
    name: "Coração Puro",
    text: [
      "Permanente",
      "Efeito: Quando você for comprar um card, pode, em vez disso, colocar um Marcador de \"Coração\" nesta Missão.",
      "[Atacante | Missão] Remova 3 Marcadores de \"Coração\" desta Missão: Procure qualquer card no seu Deck, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Que criança de coração puro...\"",
  },
  "s25-m-912": {
    name: "Ataque Furtivo",
    text: [
      "Anulação",
      "Alvo: 1 Ninja",
      "Efeito: Procure no seu Deck X cards de Ninja \"Marionete\" e mova-os para a sua Pilha de Descartes. Nesse caso, descarte o alvo. X = o Custo de Entrada do alvo.",
    ],
  },
  "s25-m-913": {
    name: "Heróis da Vila",
    text: [
      "Efeito: Escolha qualquer número de cards que você controla e coloque nesses cards outro marcador de um tipo que o card já tenha.",
    ],
    flavor: "\"Você também é um dos heróis de Konoha!\"",
  },
};
