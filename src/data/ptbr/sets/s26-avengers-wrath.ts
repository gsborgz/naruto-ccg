import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S26 — Avenger's Wrath, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s26-avengers-wrath.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 * Palavras-chave deste set: Revitalize = Revitalizar; Inherit = Herança; Desperation = Desespero;
 * Burst = Explosão; Flashpoint = Ponto Crítico.
 */
export const S26_AVENGERS_WRATH_PTBR: CardTranslations = {
  // ── NINJA ──
  "s26-n-1488": {
    text: [
      "[PODER EXPONENCIAL]",
      "Válido: Quando um card for movido para o fundo do seu Deck, este Ninja ganha +1/+0 durante o turno.",
    ],
    flavor: "\"Sozinho!?\"",
  },
  "s26-n-1489": {
    name: "Hinata Hyuga (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: Quando este Ninja Bloquear, este Ninja ganha +3/+0 durante este turno.",
    ],
    flavor: "\"É... hã...\"",
  },
  "s26-n-1490": {
    text: [
      "[GÊNIO TALENTOSO]",
      "[Atacante | Missão] (Terra|Terra): Todos os jogadores descartam 1 card.",
    ],
    flavor: "\"Chega...\"",
  },
  "s26-n-1491": {
    name: "Ino Yamanaka (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: No início do seu turno, se os Ninjas que você controla tiverem Poder Mental somado de 5 ou mais, você pode descartar os 3 cards do topo do seu Deck e depois comprar 1 card.",
    ],
    flavor: "\"Isso aqui é moleza.\"",
  },
  "s26-n-1492": {
    text: [
      "[GÂNGSTER DO MAGAKI]",
      "Válido: Os Jutsus usados por outros Ninjas do Time deste Ninja custam (Terra) ou (1) a menos para jogar.",
    ],
    flavor: "\"Ufa. Essa foi por pouco.\"",
  },
  "s26-n-1493": {
    text: [
      "[ARSENAL]",
      "Revitalizar (Válido: Quando este card for ser movido para a Pilha de Descartes, em vez disso, mova-o para o fundo do seu Deck.)",
      "Válido: Quando este Ninja for retirado de jogo, coloque um Marcador +1/+1 em 1 Ninja que você controla. Se esse Ninja for um Ninja \"Arma\", coloque um Marcador +1/+1 adicional nesse Ninja.",
    ],
    flavor: "\"Sem sorte.\"",
  },
  "s26-n-1494": {
    text: [
      "[ESTRATEGISTA SUPREMO]",
      "Revitalizar (Válido: Quando este card for ser movido para a Pilha de Descartes, em vez disso, mova-o para o fundo do seu Deck.)",
      "Válido: Quando este Ninja for enviado para a Batalha, revele o card do fundo do seu Deck. Se esse card tiver Revitalizar, mova-o para a sua mão. Se não, descarte os 3 cards do topo do seu Deck.",
    ],
    flavor: "\"Não somos mais crianças.\"",
  },
  "s26-n-1495": {
    text: [
      "[ATITUDE ALTRUÍSTA]",
      "[Missão | Troca de Jutsu] (Terra): Negue o efeito ativado alvo que tenha como alvo outro Ninja que você controla.",
    ],
    flavor: "\"Por favor, tenham muito cuidado na viagem.\"",
  },
  "s26-n-1496": {
    text: [
      "[OLHOS QUE TUDO VEEM]",
      "Válido: Quando este Ninja conseguir qualquer Vitória, se o Ninja Líder que enfrenta este Ninja tiver Custo de Entrada 3 ou mais, descarte 1 dos Prêmios de Batalha do seu oponente.",
    ],
    flavor: "\"Senhorita Hinata!\"",
  },
  "s26-n-1497": {
    text: [
      "[OLHAR PENETRANTE]",
      "Revitalizar",
      "Quando este card for movido para o fundo do seu Deck, o seu oponente remove do jogo um card da mão dele. O seu oponente move esse card para a mão dele no final deste turno.",
    ],
    flavor: "\"Ele sempre sabe o melhor jeito de dizer as coisas...\"",
  },
  "s26-n-1498": {
    text: [
      "[MENTOR DO FUTURO]",
      "Revitalizar",
      "No início do seu turno, você pode descartar os 2 cards do topo do seu Deck.",
      "Válido: Quando 1 ou mais cards forem movidos para o fundo do seu Deck, você pode comprar 1 card. O seu oponente pode negar este efeito descartando 1 card da mão.",
    ],
    flavor: "\"Bom trabalho.\"",
  },
  "s26-n-1499": {
    text: [
      "[O PODER INTERIOR]",
      "Revitalizar (Quando este card for ser movido para a Pilha de Descartes, em vez disso, mova-o para o fundo do seu Deck.)",
      "[Atacante | Missão] Revele este card da sua mão: Descarte os 5 cards do topo do seu Deck; depois, se você descartou 3 ou mais cards de Terra por este efeito, compre 1 card. Depois, descarte este card.",
    ],
    flavor: "\"Isto aqui agora é o meu território.\"",
  },
  "s26-n-1500": {
    name: "O 1º Hokage",
    text: [
      "[LÍDER DOS SENJU]",
      "Revitalizar",
      "Válido: Quando 1 ou mais cards forem movidos para o fundo do seu Deck, você pode retirar o Ninja alvo do Time dele, e esse Ninja não pode ser enviado para a Batalha durante este turno.",
    ],
  },
  "s26-n-1501": {
    text: [
      "[VALENTÃO]",
      "[Atacante | Missão] (1): Fira o Ninja alvo com Infância no nome.",
    ],
    flavor: "\"Esse cara é muito idiota!\"",
  },
  "s26-n-1502": {
    text: [
      "[VELHOS HÁBITOS]",
      "Quando este Ninja for baixado, mova o Ninja \"Cão Ninja\" alvo da Vila do seu oponente para a sua Vila.",
    ],
    flavor: "\"Eles são carpinteiros como eu.\"",
  },
  "s26-n-1503": {
    name: "Tamaki (Infância)",
    text: [
      "[LOJISTA DOS GATOS]",
      "Quando este Ninja for baixado, procure no seu Deck um card de Ninja \"Animal\" com Custo de Entrada 1 ou menos, revele-o, depois embaralhe o seu Deck e mova esse card para o topo do seu Deck.",
    ],
    flavor: "\"Que coisa grosseira de se dizer.\"",
  },
  "s26-n-1504": {
    text: [
      "[TRANSFORMAÇÃO HOMEM-FERA]",
      "[Atacante | Missão] (0): O Ninja alvo que você controla ganha \"Cão Ninja\" e o Poder impresso dele passa a ser 3/2 durante este turno.",
    ],
    flavor: "\"Você ia fazer isso sozinho?\"",
  },
  "s26-n-1505": {
    text: [
      "[OBSERVADOR ATENTO]",
      "[Missão] (Fogo): O Ninja alvo que você controla não pode ser alvo dos cards de Missão do seu oponente durante este turno.",
    ],
    flavor: "\"É...\"",
  },
  "s26-n-1506": {
    text: [
      "[PARA VINGAR O CLÃ]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "[Troca de Jutsu] (Fogo|Fogo): O Ninja alvo recebe -X/-0 durante este turno, onde X = o Custo de Entrada deste Ninja.",
    ],
    flavor: "\"Ei. Fracassado.\"",
  },
  "s26-n-1507": {
    text: [
      "[AKATSUKI NOVATO]",
      "Os outros Ninjas \"Akatsuki\" que você controla ganham +1/+1.",
      "Válido: Quando 1 dos seus Times conseguir qualquer Vitória, se esse Time tiver 2 ou mais Ninjas \"Akatsuki\", você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Agora tem uma vaga aberta...\"",
  },
  "s26-n-1508": {
    text: [
      "[VINGADOR DESESPERADO]",
      "Desespero",
      "[Missão] Remova do jogo 2 cards de Ninja da sua Pilha de Descartes: Coloque um Marcador +1/+1 neste Ninja. Se este efeito foi usado duas vezes neste turno, você pode descartar este Ninja e colocar em jogo 1 card de Ninja Susano'o (Sasuke) do seu Baralho de Reforço.",
    ],
    flavor: "\"Eu perguntei se é verdade!\"",
  },
  "s26-n-1509": {
    text: [
      "[LAÇO DE SANGUE]",
      "Válido: Quando este Ninja receber Dano, você pode causar 1 Dano ao Ninja adversário alvo com Custo de Entrada menor que o deste Ninja.",
    ],
    flavor: "\"Diz o fracote...\"",
  },
  "s26-n-1510": {
    text: [
      "[PARA PROTEGER OS COMPANHEIROS]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "[Troca de Jutsu] (Fogo): Negue e descarte o Jutsu alvo que esteja sendo usado por um Ninja adversário. Nesse caso, descarte este Ninja no final deste turno.",
    ],
    flavor: "\"Não faz sentido.\"",
  },
  "s26-n-1511": {
    text: [
      "[SITUAÇÃO TERRÍVEL]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "[Válido | Atacante | Missão] (0): Descarte 1 Ninja que você controla. Nesse caso, compre 2 cards.",
    ],
    flavor: "\"Já está na hora de você vir comigo...\"",
  },
  "s26-n-1512": {
    text: [
      "[PARA OBTER O PODER SUPREMO]",
      "Herança",
      "[Troca de Jutsu] Descarte 1 Ninja que você controla: Este Ninja não pode ser alvo dos cards de Jutsu do seu oponente durante este turno.",
    ],
  },
  "s26-n-1513": {
    name: "O 6º Hokage",
    text: [
      "[EM BUSCA DO PODER]",
      "Herança",
      "[Válido | Troca de Jutsu] (2): Todos os Ninjas no Campo de Batalha com Custo de Entrada menor que o deste Ninja passam a ser Ninjas Reserva. Nesse caso, descarte este Ninja no final deste turno.",
    ],
  },
  "s26-n-1514": {
    name: "O Sábio",
    text: [
      "[SABEDORIA DO SÁBIO]",
      "Explosão",
      "[Troca de Jutsu] Remova um Marcador +1/+1 do Ninja alvo que você controla: Compre 1 card.",
    ],
    flavor: "\"Sim... Eu sou o sábio que supervisiona as Terras de Honegami.\"",
  },
  "s26-n-1515": {
    text: [
      "[PROTÓTIPO OFENSIVO]",
      "[Atacante | Missão] Remova do jogo este card de Ninja que está na sua mão: Devolva o card em jogo alvo que não seja de Ninja à mão do Dono Original dele.",
    ],
    flavor: "\"Deixe ele comigo!\"",
  },
  "s26-n-1516": {
    text: [
      "[PROTÓTIPO DEFENSIVO]",
      "[Missão | Troca de Jutsu] Remova do jogo este card de Ninja que está na sua mão: Remova um marcador de qualquer tipo do Ninja ou da Missão alvo.",
    ],
    flavor: "\"Acertei ele?\"",
  },
  "s26-n-1517": {
    text: [
      "[TREINO DE COMBATE]",
      "Explosão (Quando este Ninja for colocado em jogo, revele o card do topo do seu Deck. Esse card fica com a face para cima até o final deste turno, enquanto continuar no topo do seu Deck. Nesse caso, este Ninja ganha +X/+X durante este turno, onde X = o Custo de Entrada do card revelado.)",
    ],
    flavor: "\"Ei!!\"",
  },
  "s26-n-1518": {
    text: [
      "[LÍDER DE ESQUADRÃO]",
      "Quando qualquer um dos seus Times que tiver 1 ou mais Ninjas com Combate 6 ou mais conseguir qualquer Vitória, você pode comprar 1 card.",
    ],
    flavor: "\"Apresentando-me!\"",
  },
  "s26-n-1519": {
    text: [
      "[ESPECIALISTA EM TAIJUTSU]",
      "Explosão",
      "Quando este Ninja conseguir qualquer Vitória, se o Combate deste Ninja for 7 ou mais, você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"É, vamos lá!\"",
  },
  "s26-n-1520": {
    text: [
      "[GUARDIÃO DO NOVE CAUDAS]",
      "Explosão",
      "[Válido | Atacante | Missão | Troca de Jutsu] (0): Se o Combate deste Ninja for 7 ou mais, descarte este Ninja e depois coloque em jogo 1 card de Ninja Naruto Uzumaki (Seis Caudas) do seu Baralho de Reforço.",
    ],
    flavor: "\"Isso é mentira...!!\"",
  },
  "s26-n-1521": {
    text: [
      "[DANGO ESPECIAL]",
      "Explosão (Quando este Ninja for colocado em jogo, revele o card do topo do seu Deck. Esse card fica com a face para cima durante este turno, enquanto continuar no topo do seu Deck. Nesse caso, este Ninja ganha +X/+X durante este turno, onde X = o Custo de Entrada do card revelado.)",
      "[Missão | Troca de Jutsu] (0): Compre 1 card. Depois, mova 1 card da sua mão para o topo do seu Deck.",
    ],
    flavor: "\"Nenhum de vocês está em posição de comemorar.\"",
  },
  "s26-n-1522": {
    text: [
      "[LIVRO MISTERIOSO]",
      "Explosão",
      "Enquanto o card do topo do seu Deck for um card de Jutsu revelado, este Ninja pode usá-lo como se estivesse na sua mão, com o custo reduzido para (0).",
    ],
    flavor: "\"Isso não vai acontecer.\"",
  },
  "s26-n-1523": {
    text: [
      "[JUTSU DE INVOCAÇÃO]",
      "Explosão",
      "[Atacante | Missão] (Raio|Raio): Se o card do topo do seu Deck for um card de Ninja \"Sapo Ninja\" revelado, coloque-o em jogo.",
    ],
    flavor: "\"Kuchiyose no Jutsu!\"",
  },
  "s26-n-1524": {
    text: [
      "[PODER ILIMITADO]",
      "Explosão",
      "[Troca de Jutsu] (Raio|Raio): Se este card estiver revelado no topo do seu Deck, coloque este card de Ninja em qualquer um dos seus Times Em Combate, em qualquer posição. No final deste turno, se este Ninja ainda estiver em jogo, mova-o para a mão do Dono Original dele.",
    ],
    flavor: "\"...LIBERAR!!!\"",
  },
  "s26-n-1525": {
    text: [
      "[ETERNOS RIVAIS]",
      "Quando este Ninja for colocado em jogo, há uma Fase de Batalha adicional depois da primeira Fase de Batalha deste turno.",
      "Válido: Quando este Ninja conseguir qualquer Vitória, cause 1 Dano ao Ninja alvo.",
    ],
  },
  "s26-n-1526": {
    text: [
      "[LÍDER DA GANGUE]",
      "Válido: Este Ninja ganha +3/+0 enquanto o seu oponente controlar um Ninja de Vento.",
    ],
    flavor: "\"Assim não dá!\"",
  },
  "s26-n-1527": {
    text: [
      "[CRIANÇA DESTEMIDA]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, veja os 2 cards do topo do seu Deck, mova 1 deles para o fundo do seu Deck e o outro para o topo.",
    ],
    flavor: "\"Tome cuidado.\"",
  },
  "s26-n-1528": {
    text: [
      "[SENTINDO A FRAQUEZA]",
      "Válido: Quando qualquer Ninja do Time deste Ninja ou do Time que enfrenta este Ninja receber qualquer Dano, aumente esse Dano em 1.",
    ],
    flavor: "\"Anda logo!\"",
  },
  "s26-n-1529": {
    text: [
      "[HABILIDADES ÚNICAS]",
      "Válido: Enquanto o seu oponente tiver 8 ou mais Chakras, os Jutsus usados pelos seus Ninjas não podem ser alvo dos cards de Jutsu nem dos efeitos de Ninja do seu oponente.",
    ],
    flavor: "\"Sim, eu tenho...\"",
  },
  "s26-n-1530": {
    text: [
      "[HERDEIRO DO DEMÔNIO]",
      "[Atacante | Missão | Troca de Jutsu] Remova um marcador de uma Missão: Este Ninja ganha +2/+0 e só pode ser bloqueado por Times de 2 ou mais Ninjas durante este turno.",
    ],
    flavor: "\"Ah, fazer o quê...\"",
  },
  "s26-n-1531": {
    text: [
      "[FÚRIA INEXTINGUÍVEL]",
      "Desespero",
      "[Válido | Troca de Jutsu] (Água): Este Ninja ganha +1/-1 durante o turno. Se este efeito foi usado duas vezes neste turno, você pode descartar este Ninja. Nesse caso, coloque em jogo um card de Ninja Jugo (Estado 2) do seu Baralho de Reforço no Time deste Ninja, como Ninja Líder.",
    ],
  },
  "s26-n-1532": {
    text: [
      "[COLETOR DE INFORMAÇÕES]",
      "[Atacante | Missão] Mova o card do topo do Deck do seu oponente para a área de Chakra dele: Compre 1 card. Depois, se o seu oponente tiver menos de 10 Chakras, mova 1 card da sua mão para o fundo do seu Deck.",
    ],
    flavor: "\"Que cara é essa?\"",
  },
  "s26-n-1533": {
    text: [
      "[MORDIDA DO DEMÔNIO]",
      "Enquanto o seu oponente tiver 8 ou mais Chakras, este Ninja não pode se tornar alvo dos cards de Jutsu do seu oponente.",
      "[Válido | Troca de Jutsu] Mova 1 card da Pilha de Descartes do seu oponente para a área de Chakra dele: Se o seu oponente tiver 8 ou mais Chakras, fira o Ninja de Apoio alvo que enfrenta este Ninja.",
    ],
    flavor: "\"Haku, você entende?\"",
  },
  "s26-n-1534": {
    text: [
      "[MONSTRO DA NÉVOA OCULTA]",
      "Desespero (Se o seu oponente tiver 5 ou mais Prêmios de Batalha, as Habilidades Ativadas deste card podem ser ativadas até duas vezes por turno.)",
      "[Atacante | Missão] (Água): Descarte 1 dos Chakras do seu oponente. Nesse caso, mova 1 card do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Mas, por favor, não se preocupe...\"",
  },
  "s26-n-1535": {
    name: "Jugo (Estado 2)",
    text: [
      "[RAIVA INCONTROLÁVEL]",
      "Desespero",
      "[Válido | Troca de Jutsu] (Água): Este Ninja ganha +2/+0 durante este turno. No final deste turno, se este Ninja conseguiu qualquer Vitória, descarte 1 Ninja que o seu oponente controla com o menor Custo de Entrada.",
    ],
    flavor: "\"Quem é o próximo?!!\"",
  },
  "s26-n-1536": {
    text: [
      "[ATAQUE OCULTO]",
      "Desespero",
      "[Atacante | Missão] Recue o seu Marcador de Turnos em 1: Cause 1 Dano ao Ninja alvo com Custo de Entrada menor ou igual ao seu Marcador de Turnos. Se este efeito foi usado duas vezes neste turno, você não pode avançar o seu Marcador de Turnos no final deste turno.",
    ],
    flavor: "\"Desista.\"",
  },
  "s26-n-1537": {
    text: [
      "[ESPÍRITO DA VINGANÇA]",
      "Desespero",
      "[Troca de Jutsu] Dê 1 Prêmio de Batalha ao seu oponente: O seu oponente descarta 1 card da mão, 1 Ninja que controla e 1 dos Chakras dele. Se este efeito foi usado duas vezes neste turno, fira este Ninja.",
    ],
  },
  "s26-n-1538": {
    name: "Shino Aburame (Infância)",
    text: [
      "[RASTREADOR EM TREINAMENTO]",
      "[Bloqueador | Troca de Jutsu] (0): Se este Ninja for um Ninja Reserva, mova-o para qualquer um dos seus Times Em Combate, em qualquer posição.",
    ],
    flavor: "\"Professor Iruka, você escolheu a pessoa errada.\"",
  },
  "s26-n-1539": {
    text: [
      "[TROCA DE IDENTIDADE]",
      "Ponto Crítico ([Atacante | Missão] (0): Remova este Ninja do jogo. No início do seu próximo turno, mova este card de Ninja para a sua Vila.)",
      "Quando este Ninja for retirado de jogo, você pode colocar em jogo 1 card de Ninja Sakura Interior do seu Baralho de Reforço.",
    ],
    flavor: "\"Seu tolo!\"",
  },
  "s26-n-1540": {
    text: [
      "[HERDEIRA DOS TSUCHIGUMO]",
      "Ponto Crítico ([Atacante | Missão] (0): Remova este Ninja do jogo. No início do seu próximo turno, mova este card de Ninja para a sua Vila.)",
      "Quando este Ninja for colocado em jogo, compre 1 card e depois descarte 1 card.",
    ],
    flavor: "\"Prometa isso para mim!\"",
  },
  "s26-n-1541": {
    text: [
      "[RECUO TÁTICO]",
      "Ponto Crítico",
      "Válido: Quando este Ninja for retirado de jogo, os cards de Jutsu do seu oponente custam (1) a mais para jogar durante este turno e o próximo.",
      "Este Ninja ganha +0/+1 enquanto estiver Bloqueando.",
    ],
    flavor: "\"Então você quer recuar de novo?\"",
  },
  "s26-n-1542": {
    text: [
      "[ELITE DA AREIA]",
      "Válido: Este Ninja ganha +1/+0 para cada outro Ninja \"Areia\" que você controla.",
    ],
    flavor: "\"Você é impaciente.\"",
  },
  "s26-n-1543": {
    name: "Sakura Interior",
    text: [
      "[FÚRIA INTERIOR]",
      "Válido: Quando este Ninja for colocado em jogo, você pode trocar todos os cards da sua mão pelo mesmo número de cards do topo do seu Deck.",
      "Válido: No final do turno do seu oponente, remova este Ninja do jogo. Este efeito não pode ser negado.",
    ],
    flavor: "\"Vou te matar por isso... depois!\"",
  },
  "s26-n-1544": {
    name: "Pai & Mãe",
    text: [
      "[DUPLA SINCRONIZADA]",
      "Válido: Enquanto você não controlar um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "[Troca de Jutsu] (Vento): Mova este Ninja para qualquer um dos seus Times Em Combate que tenha um Ninja \"Manipulação\", em qualquer posição.",
    ],
  },
  "s26-n-1545": {
    text: [
      "[TERROR VERDADEIRO]",
      "Ponto Crítico",
      "Quando este Ninja for colocado em jogo, retire do Time dele o Ninja alvo com Custo de Entrada menor que o deste Ninja.",
      "Quando este Ninja for colocado em jogo sem ser baixado, ele ganha +1 de Custo de Entrada e \"Mestre de Marionetes\" durante este turno.",
    ],
    flavor: "\"Falar é fácil.\"",
  },
  "s26-n-1546": {
    text: [
      "[ILUSÃO DEMONÍACA]",
      "[Bloqueador | Troca de Jutsu] Descarte 1 card da sua mão e coloque este card de Ninja em jogo a partir da sua mão: O seu oponente não pode ganhar Prêmios de Batalha durante este turno. Depois, se o seu Marcador de Turnos for menor que 4, remova este Ninja do jogo.",
    ],
    flavor: "\"Você está acabado.\"",
  },
  "s26-n-1547": {
    text: [
      "[ARTE ÚNICA DE MARIONETES]",
      "Ponto Crítico",
      "Válido: Quando este Ninja for colocado em jogo sem ser baixado, descarte 1 Ninja \"Marionete\" que você controla.",
      "Válido: Quando este Ninja for retirado de jogo, procure no seu Deck um Ninja \"Marionete\" com Custo de Entrada menor que o deste Ninja e mova-o para a sua Vila.",
    ],
    flavor: "\"Hora do show.\"",
  },
  "s26-n-1548": {
    text: [
      "[COMPANHEIROS]",
      "[Troca de Jutsu] (Terra|Terra) ou (Vento|Vento): O Ninja alvo com Custo de Entrada menor que o deste Ninja passa a ser um Ninja Reserva. Depois, compre 1 card.",
    ],
    flavor: "\"Kurenai, por que está demorando tanto?\" \"Bobo.\"",
  },
  "s26-n-1549": {
    text: [
      "[A ÚLTIMA BATALHA]",
      "Válido: Quando qualquer um dos seus Times com 1 ou mais Ninjas \"Marionete\" conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha e compra 1 card.",
    ],
    flavor: "\"Derrube-o!!\" \"Sim!!\"",
  },
  "s26-n-1550": {
    text: [
      "[FÚRIA DOS TSUCHIGUMO]",
      "Ponto Crítico ([Atacante | Missão] (0): Remova este Ninja do jogo. No início do seu próximo turno, mova este card de Ninja para a sua Vila.)",
      "Válido: Quando este Ninja for colocado em jogo sem ser baixado, mova o Ninja alvo com Custo de Entrada menor que o deste Ninja para o fundo do Deck do Dono Original dele.",
    ],
  },
  "s26-n-1551": {
    name: "Guerreiro Samurai",
    text: [
      "[LEGIÃO HONRADA]",
      "(Você pode jogar com quantas cópias deste card quiser no seu Deck.)",
      "Não Único (Este Ninja (card) pode ser colocado em jogo ou movido para uma Vila ou Campo de Batalha, mesmo que essa área já tenha 1 ou mais Ninjas com o mesmo nome deste Ninja (card))",
      "Todos os seus Ninjas Guerreiro Samurai ganham +1/+1.",
    ],
    flavor: "\"Nós poderíamos dizer o mesmo!!\"",
  },
  "s26-n-1552": {
    text: [
      "[MEDIADOR HABILIDOSO]",
      "[Atacante | Missão] (0): Procure no seu Deck ou na sua Pilha de Descartes 1 card de Jutsu com \"Arma\" nos Requerimentos, revele-o e mova-o para a sua mão. Se você procurou no seu Deck, embaralhe-o depois.",
    ],
    flavor: "\"Por favor, abstenham-se de comportamentos sem civilidade.\"",
  },
  // ── JUTSU ──
  "s26-j-946": {
    name: "Estilo Terra: Oculto nas Pedras",
    text: [
      "Alvo: Todos os Ninjas do Time do Usuário",
      "Efeito: O alvo não pode ser alvo dos cards de Jutsu do seu oponente durante este turno.",
      "Especialista [\"Árvore\"]: Todos os Times pulam o Showdown durante este turno.",
    ],
    flavor: "\"Bem, então...\"",
  },
  "s26-j-947": {
    name: "Estilo Terra: Onda de Lama",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se o Custo de Entrada do alvo for menor ou igual ao do Usuário, descarte-o. Nesse caso, o seu oponente pode mover 1 dos seus Prêmios de Batalha para a mão dele.",
    ],
    flavor: "\"Estilo Terra: Onda de Lama!\"",
  },
  "s26-j-948": {
    name: "Selo Explosivo",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Revele o card do topo do seu Deck. Se o Custo de Entrada do card revelado for maior ou igual ao do alvo, cause 1 Dano ao alvo.",
    ],
    flavor: "\"Exploda!\"",
  },
  "s26-j-949": {
    name: "Invocação Espontânea de Árvores",
    text: [
      "Se você tiver 15 cards ou menos no seu Deck, pode pagar (0) para jogar este card.",
      "Revitalizar",
      "Requerimentos: \"Árvore\"",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: O alvo passa a ser um Ninja Reserva e não pode ser enviado para a Batalha durante o próximo turno. Depois, se você tiver 10 cards ou menos no seu Deck, devolva este Jutsu à sua mão.",
    ],
    flavor: "\"Eu só consegui desviar o caminho dele...\"",
  },
  "s26-j-950": {
    name: "Esquiva por um Triz",
    text: [
      "Como custo adicional para jogar este card, remova do jogo os 8 cards do topo do seu Deck.",
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo e remova-o do jogo.",
    ],
  },
  "s26-j-951": {
    name: "Jutsu de Invocação",
    text: [
      "Requerimentos: Custo de Entrada 2 ou mais",
      "Efeito: Coloque em jogo 1 card de Ninja \"Animal\" da sua Pilha de Descartes com Custo de Entrada menor que o seu Marcador de Turnos.",
    ],
    flavor: "\"Um novo jutsu de invocação?\"",
  },
  "s26-j-952": {
    name: "Golpe Simultâneo",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 1 Dano ao Usuário e ao alvo. Compre 1 card para cada Ninja descartado por causa do Dano deste efeito.",
    ],
  },
  "s26-j-953": {
    text: [
      "Enquanto este Jutsu estiver na Sequência, os jogadores não podem jogar cards nem ativar efeitos.",
      "Requerimentos: \"Olho Sharingan\" + Custo de Entrada 5 ou mais",
      "Efeito: Negue e descarte 1 Jutsu OU negue todos os outros Jutsus na Sequência e encerre o turno atual (pule o resto da Fase de Batalha e o resto do turno do jogador atual).",
      "Especialista [Danzo]: Você pode remover do jogo 1 card de Ninja \"Olho Sharingan\" da sua Pilha de Descartes. Nesse caso, mova este Jutsu para a mão do Dono Original dele.",
    ],
    flavor: "\"Um genjutsu supremo lançado sobre si mesmo...\"",
  },
  "s26-j-954": {
    name: "Fazendo um Refém",
    text: [
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário com Custo de Entrada menor que o do Usuário",
      "Efeito: Quando o Usuário for receber Dano durante este turno, em vez disso, passe esse Dano para o alvo. Quando o Usuário for ser retirado de jogo durante este turno, em vez disso, descarte o alvo.",
    ],
    flavor: "\"Você, que exaltava o sacrifício, faria um refém?\"",
  },
  "s26-j-955": {
    name: "Ataque de Pânico",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O alvo não pode usar Jutsus durante este turno. Se o alvo tiver 2 ou mais Símbolos, fira-o.",
    ],
    flavor: "\"Naruto, aconteceu alguma coisa?\"",
  },
  "s26-j-956": {
    name: "Arte da Juba do Leão Furioso",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Efeito: Escolha 2 dos seguintes e aplique-os:",
      "1) O Usuário ganha +5/+0 durante este turno.",
      "2) Cause 1 Dano a 1 Ninja que enfrenta o Usuário.",
      "3) Negue 1 Jutsu com 2 ou mais Símbolos específicos no custo que esteja sendo usado por 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "\"Arte da Juba do Leão Furioso!\"",
  },
  "s26-j-957": {
    name: "Jutsu Clones das Sombras",
    text: [
      "Efeito: Coloque este card no Time do Usuário, em qualquer posição, como um Ninja com o seguinte: [Poder: 3/3 (Saudável e Ferido)][Válido: Quando qualquer Ninja do Time deste Ninja for ser retirado de jogo por um efeito, em vez disso, remova este Ninja.][Válido: Mova este Ninja para a área de Chakra do Dono Original dele no final do turno do seu oponente.]",
    ],
    flavor: "\"Eu não tenho taijutsu como o Sobrancelhudo.\"",
  },
  "s26-j-958": {
    name: "Barragem do Naruto Uzumaki",
    text: [
      "Requerimentos: Naruto Uzumaki + \"Estado de Clone\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Usuário ganha +3/+0 durante este turno. Jogue a Moeda Ninja X vezes. Aplique 1 dos efeitos a seguir conforme quantas caras você tirou:",
      "1+) Cause 1 Dano ao alvo.",
      "2+) Cause 2 Dano ao alvo.",
      "3+) Cause 1 Dano a todos os Ninjas do Time do alvo.",
    ],
    flavor: "\"Barragem do Naruto!\"",
  },
  "s26-j-959": {
    name: "Espada Chidori",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O seu oponente move o card do topo do Deck dele para a área de Chakra dele. Depois, se o seu oponente tiver 5 ou mais Chakras, mova o alvo para a área de Chakra do Dono Original dele. Se não, cause 1 Dano ao alvo.",
      "Especialista [Sasuke Uchiha]: Mova até 3 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
  },
  "s26-j-960": {
    name: "Sacrifício",
    text: [
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Efeito: Descarte um Ninja do Time do Usuário. Nesse caso, o seu oponente descarta 1 Ninja do Time adversário.",
      "Especialista [Sasuke Uchiha]: O Usuário ganha +X/+0 durante este turno, onde X = o Custo de Entrada do Ninja que o seu oponente descartou.",
    ],
    flavor: "\"Menos um...\"",
  },
  "s26-j-961": {
    name: "Transferência de Chakra",
    text: [
      "Efeito: Mova X cards da Pilha de Descartes do seu oponente para a área de Chakra dele. Depois, se o seu oponente tiver 10 ou mais Chakras, compre 2 cards.",
    ],
    flavor: "\"Anda logo! Me morde!\"",
  },
  "s26-j-962": {
    name: "Prisão da Névoa Mística",
    text: [
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: O seu oponente move o card do topo do Deck dele para a área de Chakra dele. Depois, negue o texto de efeito do alvo durante este turno. Depois, se o seu oponente tiver 3 ou mais Chakras, negue 1 Jutsu que esteja sendo usado pelo alvo.",
    ],
    flavor: "\"Genjutsu do Estilo Água! Prisão da Névoa Mística!\"",
  },
  "s26-j-963": {
    name: "Salvador",
    text: [
      "Efeito: Coloque em jogo 1 card de Ninja da sua mão com Custo de Entrada X ou menos no mesmo Time do Usuário, em qualquer posição. Depois, devolva o Usuário à mão do Dono Original dele. X = o Custo de Entrada do Usuário. Se o Usuário for um Ninja \"Feminino\", em vez disso, X = o Custo de Entrada do Usuário +1.",
    ],
  },
  "s26-j-964": {
    name: "Estilo Vento: Lâmina de Vácuo",
    text: [
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo. Depois, o Usuário ganha +2/+2 durante este turno para cada Símbolo específico no custo do alvo.",
      "Especialista [Danzo]: O Usuário ganha +2 de Custo de Entrada durante este turno.",
    ],
  },
  "s26-j-965": {
    name: "Estilo Vento: Balas de Vácuo",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O alvo passa a ser um Ninja Reserva. Depois, se o Custo de Entrada do alvo for menor ou igual ao do Usuário, fira o alvo.",
      "Especialista [\"Satoosa\"]: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Estilo Vento: Balas de Vácuo.\"",
  },
  "s26-j-966": {
    name: "Shuriken Aprimorada",
    text: [
      "Efeito: O Usuário ganha +2/+2 e o seguinte efeito durante este turno: \"Válido: Os cards de Jutsu usados por este Ninja não podem ser negados.\"",
    ],
  },
  "s26-j-967": {
    name: "Selo Paralisante",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Negue o texto de efeito do alvo durante este turno.",
      "Especialista [Danzo]: Fira o alvo, e o Poder dele passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Uma marca amaldiçoada de paralisia, hein...\"",
  },
  "s26-j-968": {
    name: "Estilo Vento: Rajada de Vácuo",
    text: [
      "X só pode ser pago com Chakras de Vento.",
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Usuário ganha +X de Custo de Entrada durante este turno. Depois, se o Custo de Entrada do alvo for menor que o do Usuário, devolva o alvo à mão do Dono Original dele.",
    ],
  },
  "s26-j-969": {
    name: "Jutsu de Selamento do Tetragrama Reverso",
    text: [
      "Este Jutsu não pode ser negado.",
      "Requerimentos: Custo de Entrada 5 ou mais",
      "Efeito: Remova o Usuário do jogo e depois remova do jogo qualquer número de Ninjas do seu oponente cujo Custo de Entrada total seja menor ou igual ao do Usuário.",
      "Especialista [Danzo]: Compre 2 cards.",
    ],
    flavor: "\"Este é um jutsu de selamento do tetragrama reverso!!\"",
  },
  "s26-j-970": {
    name: "Fluxo de Chakra",
    text: [
      "Requerimentos: \"Samurai\"",
      "Efeito: O Usuário ganha +X/+X durante este turno, onde X = o número de Ninjas \"Samurai\" que você controla.",
    ],
  },
  "s26-j-971": {
    name: "Armamento Pouco Ortodoxo",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: Descarte 1 card do topo do seu Deck. Aplique 1 dos efeitos a seguir conforme o tipo do card que você descartou:",
      "Ninja) O Usuário ganha +4/+0 durante este turno.",
      "Jutsu) Cause 1 Dano a 1 Ninja.",
      "Missão) Negue 1 Jutsu.",
    ],
    flavor: "\"Quando foi que você arrumou essas coisas!?\"",
  },
  // ── MISSÃO ──
  "s26-m-914": {
    name: "Um Dia Tranquilo",
    text: [
      "Anulação",
      "Permanente (1)",
      "Efeito: Negue o texto de efeito de todos os Ninjas.",
    ],
    flavor: "\"Quem e o que eu sou para você...?\"",
  },
  "s26-m-915": {
    name: "O Genin Mais Forte de Konoha",
    text: [
      "Permanente",
      "Alvo: 1 Ninja \"Genin\" que você controla",
      "Efeito: O Poder impresso do alvo muda para 6/4 (Saudável e Ferido), e ele ganha o seguinte texto de efeito: \"[Troca de Jutsu] (0): Envie o Ninja alvo que enfrenta este Ninja para o fundo do Deck do Dono Original dele. Nesse caso, descarte este Ninja no final deste turno.\"",
    ],
    flavor: "\"Este ano vai fazer cinquenta anos.\"",
  },
  "s26-m-916": {
    name: "História Intrigante",
    text: [
      "Como custo adicional para jogar esta Missão, pague (X).",
      "Efeito: Procure no seu Deck um card de Missão Permanente com Custo de Entrada X ou menos e coloque-o em jogo. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Ele participou das partes mais importantes, então não se preocupe.\"",
  },
  "s26-m-917": {
    name: "A Arma Suprema",
    text: [
      "Efeito: Revele os 5 cards do topo do seu Deck. Mova para a sua mão os cards de Jutsu com \"Arma\" nos Requerimentos e o resto para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Isto é o Jidanda?\"",
  },
  "s26-m-918": {
    name: "Conversa Consigo Mesmo",
    text: [
      "Anulação",
      "Alvo: 1 Missão",
      "Efeito: Negue o alvo e mova-o para o topo do Deck do Dono Original dele. Se você tiver 5 cards ou menos na sua Pilha de Descartes, em vez disso, descarte o alvo.",
    ],
    flavor: "\"Você gravou a batalha?\"",
  },
  "s26-m-919": {
    name: "Poder Desesperado",
    text: [
      "Efeito: Remova do jogo 1 card de Ninja \"Olho Sharingan\" com Herança da sua Pilha de Descartes. Nesse caso, aplique o efeito de Herança dele como se ele tivesse acabado de ser retirado de jogo.",
    ],
    flavor: "\"Que nojo!\"",
  },
  "s26-m-920": {
    name: "Dimensão de Bolso",
    text: [
      "Efeito: Remova do jogo todos os Ninjas que você controla. No final do turno, mova todos os cards de Ninja removidos por este efeito para a sua Vila.",
    ],
    flavor: "\"Você está bem, Sasuke?\"",
  },
  "s26-m-921": {
    name: "Frente a Frente",
    text: [
      "Efeito: O seu oponente descarta 1 Ninja que controla e depois você descarta 1 Ninja que controla. Se esses Ninjas tinham o mesmo Custo de Entrada, compre 1 card.",
    ],
    flavor: "\"Os descendentes dos dois irmãos continuaram a batalhar.\"",
  },
  "s26-m-922": {
    name: "O Senhor do Fogo",
    text: [
      "Efeito: Descarte 1 Ninja que você controla. Nesse caso, se o Custo de Entrada dele era 2 ou menos, compre 2 cards. Se não, compre 3 cards.",
    ],
    flavor: "\"Você não acha que devíamos esperar a Tsunade se recuperar?\"",
  },
  "s26-m-923": {
    name: "O Desafio de um Rival",
    text: [
      "Efeito: Mova 2 cards da sua Pilha de Descartes para a sua mão. Se você moveu 2 cards do mesmo tipo, o seu oponente compra 1 card. Depois, remova este card do jogo.",
    ],
    flavor: "\"Por quê!?\"",
  },
  "s26-m-924": {
    name: "Emoções Divergentes",
    text: [
      "Permanente",
      "Efeito: Quando um Time que você controla com 1 ou mais Ninjas com 1 ou mais Marcadores +1/+1 conseguir qualquer Vitória, você pode comprar 1 card. Este efeito não pode ser duplicado.",
    ],
    flavor: "\"Cha!\"",
  },
  "s26-m-925": {
    name: "Um Velho Amigo",
    text: [
      "Efeito: Revele o card do topo do seu Deck. Descarte 1 dos Ninjas do seu oponente com Custo de Entrada menor ou igual ao do card revelado (se houver).",
    ],
    flavor: "\"Ora, se não é o meu querido Jiraiya.\"",
  },
  "s26-m-926": {
    name: "Pílulas Medicinais",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, coloque 2 marcadores nela.",
      "[Troca de Jutsu] Remova 1 marcador desta Missão: Cure o Ninja alvo. Depois, se não houver marcadores nesta Missão, mova-a para a área de Chakra do Dono Original dela.",
    ],
    flavor: "\"Estas pílulas de ervas foram feitas com o meu suor, as minhas lágrimas e o meu amor!\"",
  },
  "s26-m-927": {
    name: "Empanturrado",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Coloque um Marcador +1/+1 no alvo e depois fira-o. Nesse caso, no final deste turno, cure o alvo.",
    ],
    flavor: "\"Não consigo evitar me afogar em comida.\"",
  },
  "s26-m-928": {
    name: "A Decisão de Inari",
    text: [
      "Efeito: Compre 2 cards. Depois, mova 1 card da sua mão para a sua área de Chakra. Se você moveu um card que não seja de Ninja por este efeito, coloque um Marcador +1/+1 em 1 Ninja que você controla.",
    ],
    flavor: "\"Todo mundo pronto para ir?\"",
  },
  "s26-m-929": {
    name: "Momento de Fraqueza",
    text: [
      "Efeito: Mova 1 dos Ninjas do seu oponente com o menor Custo de Entrada para a área de Chakra do Dono Original dele. Se esse Ninja tinha Custo de Entrada 0, mova esta Missão para a sua mão.",
    ],
    flavor: "\"O-os meus óculos!\"",
  },
  "s26-m-930": {
    name: "Jogo de Palavras",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir conforme o número de Prêmios de Batalha do seu oponente:",
      "0+) Descarte 1 card em jogo que não seja de Ninja",
      "0+) Mova o card do topo do seu Deck para a sua área de Chakra",
      "3+) Compre 2 cards",
      "5+) Você pode aplicar cada um dos efeitos acima",
    ],
    flavor: "\"Atrasada... para casar?\"",
  },
  "s26-m-931": {
    name: "Enjoo",
    text: [
      "Anulação Permanente (2)",
      "Alvo: 1 Ninja",
      "Efeito: O alvo recebe -X/-X, onde X = o número total de cards de Água nas áreas de Chakra de todos os jogadores.",
    ],
    flavor: "\"Ugh...\"",
  },
  "s26-m-932": {
    name: "Pânico do Esqueleto",
    text: [
      "Efeito: Revele os 4 cards do topo do seu Deck. O seu oponente descarta 1 dos cards revelados. Depois, você move 1 dos cards restantes para a sua mão. Mova o resto dos cards revelados para a sua área de Chakra.",
    ],
    flavor: "\"Quando você o encontra, começa a jornada final para a terra dos mortos.\"",
  },
  "s26-m-933": {
    name: "A Presa do Pescador",
    text: [
      "Permanente",
      "[Troca de Jutsu] (0): Mova 2 cards da Pilha de Descartes do seu oponente para a área de Chakra dele. Depois, se o seu oponente tiver 10 ou mais Chakras, veja os 2 cards do topo do seu Deck, mova qualquer número para o fundo e o resto para o topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Um monstro!\"",
  },
  "s26-m-934": {
    name: "O Jinchuriki Renegado",
    text: [
      "Efeito: Compre 1 card. Depois, você pode mover 2 cards da Pilha de Descartes do seu oponente para a área de Chakra dele. Nesse caso, compre 1 card.",
    ],
    flavor: "\"Esse lugar é reservado para mim...\"",
  },
  "s26-m-935": {
    name: "A Confissão de Sakura",
    text: [
      "Efeito: Veja os 4 cards do topo do seu Deck. Escolha 1 card e mova-o para a sua mão; depois, devolva o resto ao topo do seu Deck, em qualquer ordem. Depois, se você controlar Sakura Haruno, compre 1 card.",
    ],
    flavor: "\"Naruto... Eu disse que te amo!\"",
  },
  "s26-m-936": {
    name: "Atos Vergonhosos",
    text: [
      "Anulação",
      "Alvo: 1 Ninja que foi baixado durante este turno",
      "Efeito: Mova o alvo para a mão do Dono Original dele. Nesse caso, o seu oponente escolhe e aplica 1 dos efeitos a seguir:",
      "1) Comprar 2 cards",
      "2) Colocar em jogo 1 card de Ninja da mão com Custo de Entrada menor que o do alvo.",
    ],
    flavor: "\"Aha... você ia fazer todo mundo dormir com isso, não ia?\"",
  },
  "s26-m-937": {
    name: "Presente dos Alunos",
    text: [
      "Efeito: Compre 1 card para cada Ninja \"Genin\" e \"Estudante da Academia\" que você controla.",
    ],
    flavor: "\"P-Parabéns!\"",
  },
  "s26-m-938": {
    name: "O Encontro de Kakashi Hatake",
    text: [
      "Permanente (2)",
      "Alvo: 1) 1 Ninja \"Feminino\" que você controla 2) 1 Ninja \"Masculino\" que o seu oponente controla",
      "Efeito: O alvo (2) só pode ser enviado para a Batalha enquanto o alvo (1) estiver no Campo de Batalha.",
    ],
    flavor: "\"Você também está curioso?\"",
  },
  "s26-m-939": {
    name: "Flor Jofuku",
    text: [
      "Permanente (2)",
      "Alvo: 1 card de Ninja na área de Chakra de qualquer jogador",
      "Efeito: Este card é considerado uma cópia do alvo sem texto de efeito. Quando este card for ser retirado de jogo, em vez disso, mova-o para a área de Chakra do Dono Original dele.",
    ],
    flavor: "\"Esta é a flor jofuku?\"",
  },
  "s26-m-940": {
    text: [
      "Efeito: Compre 1 card. Depois, se você controlar apenas Ninjas \"Samurai\", compre 1 card.",
    ],
    flavor: "\"Cara, estou com vontade de cortar alguma coisa.\"",
  },
  "s26-m-941": {
    name: "A União Faz a Força",
    text: [
      "Permanente",
      "Efeito: Quando o seu oponente colocar em jogo um Ninja, se ele controlar mais Ninjas que você, você pode colocar em jogo 1 card de Ninja Guerreiro Samurai da sua mão.",
    ],
    flavor: "\"Em marcha.\"",
  },
  "s26-m-942": {
    name: "O Mediador",
    text: [
      "Permanente (2)",
      "Efeito: Quando esta Missão for colocada em jogo, procure no seu Deck 1 card de Ninja \"Samurai\", revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck.",
      "Efeito: Os cards de Jutsu custam (1) a mais para jogar.",
    ],
    flavor: "\"Estávamos aguardando a sua chegada.\"",
  },
};
