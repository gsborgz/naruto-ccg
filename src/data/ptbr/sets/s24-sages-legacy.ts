import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S24 — Sage's Legacy, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s24-sages-legacy.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 */
export const S24_SAGES_LEGACY_PTBR: CardTranslations = {
  // ── NINJA ──
  "s24-n-1358": {
    text: [
      "[ESTÔMAGO SEM FIM]",
      "Válido: Quando este Ninja Atacar, ele ganha +1/+0 durante este turno para cada 5 cards na sua Pilha de Descartes.",
    ],
    flavor: "\"Então deixe que eu cubra a sua parte.\"",
  },
  "s24-n-1359": {
    name: "Shikamaru Nara (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, mova 3 cards da sua Pilha de Descartes para o topo do seu Deck e depois embaralhe-o.",
      "Quando este Ninja for movido para a sua área de Chakra pelo efeito de CRESCIMENTO, você pode colocar 1 Marcador de Crescimento no Ninja alvo.",
    ],
    flavor: "\"Nem pensar.\"",
  },
  "s24-n-1360": {
    text: [
      "[ESPÍRITO INABALÁVEL]",
      "Válido: Enquanto o seu oponente tiver 4 cards ou menos na mão, este Ninja ganha +1/+1.",
    ],
    flavor: "Aqui!",
  },
  "s24-n-1361": {
    text: [
      "[PRESENTE DE MELHORAS]",
      "Válido: No início da Fase de Organização do seu oponente, você pode organizar os seus Times.",
    ],
    flavor: "\"Parece que agora você entende mais de flores.\"",
  },
  "s24-n-1362": {
    text: [
      "[EMPRÉSTIMO DE AÇO]",
      "[Troca de Jutsu] (1): Se este Ninja não estiver no Campo de Batalha, o Ninja alvo ganha +X/+0 durante este turno, onde X = o Combate deste Ninja.",
    ],
    flavor: "\"Parece que ele não mudou nada.\"",
  },
  "s24-n-1363": {
    text: [
      "[ADAPTABILIDADE]",
      "Durante o Showdown, se o seu oponente tiver 4 ou mais cards na mão, o Time deste Ninja e o Time que o enfrenta fazem uma Batalha Mental.",
    ],
    flavor: "\"...Não estou numa posição em que eu possa simplesmente fazer o que quiser.\"",
  },
  "s24-n-1364": {
    text: [
      "[OBSERVADOR MISTERIOSO]",
      "[Bloqueador | Missão] (0): Se o Ninja alvo Atacar durante este turno, o texto de efeito dele é negado.",
    ],
    flavor: "\"Precisamos avisar o Tobi. Vamos.\"",
  },
  "s24-n-1365": {
    name: "Duas Caudas",
    text: [
      "[FERA CAÇADA]",
      "Quando este Ninja for colocado em jogo, você pode revelar um card de Ninja \"Besta com Caudas\" da sua mão. Nesse caso, avance o seu Marcador de Turnos em 1.",
      "Válido: Enquanto um Ninja \"Besta com Caudas\" estiver Em Combate sozinho, esse Ninja ganha +1/+0 para cada Ninja \"Besta com Caudas\" Em Combate sozinho.",
    ],
  },
  "s24-n-1366": {
    text: [
      "[ARMADILHA DE TRANSFERÊNCIA DE CORPO]",
      "Válido: Quando este Ninja for descartado por causa do Showdown sem estar sozinho num Time, você pode mover para a sua Vila o Ninja alvo com Custo de Entrada menor que o deste card de Ninja.",
    ],
    flavor: "\"Seria um golpe de sorte se ele caísse nessa.\"",
  },
  "s24-n-1367": {
    text: [
      "[VONTADE DE SOBREVIVER]",
      "[Troca de Jutsu] (Terra): Descarte este Ninja e depois negue e remova do jogo todos os Jutsus. Se você negou um Jutsu com custo 3 ou mais, coloque este card de Ninja em jogo e depois fira-o.",
    ],
  },
  "s24-n-1368": {
    text: [
      "[AMARRADO]",
      "Quando este Ninja ganhar qualquer Prêmio de Batalha, o seu oponente não pode enviar nenhum Ninja para Atacar durante o próximo turno dele.",
    ],
    flavor: "\"Este lugar deve servir bem.\"",
  },
  "s24-n-1369": {
    text: [
      "[DEMOLIÇÃO CONTROLADA]",
      "Válido: Os jogadores não podem jogar mais de 1 card de Jutsu durante a Troca de Jutsu.",
    ],
    flavor: "\"O que acha da minha criação artística, hmmm?\"",
  },
  "s24-n-1370": {
    name: "O 1º Hokage",
    text: [
      "[RESSURGIMENTO]",
      "Enquanto você tiver 3 ou mais cards na sua Pilha de Descartes, os jogadores só podem Atacar com Times que incluam um Ninja \"Árvore\".",
      "Válido: No início do seu turno, se você tiver 3 ou mais cards na sua Pilha de Descartes, mova 3 deles para o fundo do seu Deck, em qualquer ordem.",
    ],
  },
  "s24-n-1371": {
    name: "Gato Guarda",
    text: [
      "[CURIOSIDADE]",
      "Válido: Quando um card for descartado da sua área de Chakra, este Ninja ganha +1/+0 durante este turno.",
    ],
    flavor: "\"Eu não reconheço vocês.\"",
  },
  "s24-n-1372": {
    text: [
      "[IMPOSTOR]",
      "[Troca de Jutsu] (1): Este Ninja é considerado como tendo o nome impresso do Ninja alvo durante este turno.",
    ],
    flavor: "\"Eu tomei a identidade dele e mandei ele e a esposa, que tinha acabado de dar à luz, para um esconderijo.\"",
  },
  "s24-n-1373": {
    text: [
      "[ATITUDE SOLITÁRIA]",
      "Este Ninja só pode ser enviado para a Batalha sozinho.",
    ],
    flavor: "\"Eu não sou como eles.\"",
  },
  "s24-n-1374": {
    text: [
      "[INSTINTO COMPARTILHADO]",
      "Quando este Ninja for colocado em jogo, você pode procurar no seu Deck um card de Ninja Akamaru, revelá-lo e mover esse card para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Bem que eu achei que conhecia esse cheiro!\"",
  },
  "s24-n-1375": {
    text: [
      "[COMPANHEIRO]",
      "Válido: Quando este Ninja for enviado para a Batalha, se ele estiver no mesmo Time que um Ninja com Inuzuka no nome, o seu oponente revela a mão.",
    ],
    flavor: "\"Au!!\"",
  },
  "s24-n-1376": {
    text: [
      "[OLFATO]",
      "[Bloqueador | Missão] (0): Negue e descarte a Missão alvo. No final deste turno, descarte este Ninja.",
    ],
  },
  "s24-n-1377": {
    text: [
      "[PLANTANDO OS EXPLOSIVOS]",
      "[Troca de Jutsu] Fira este Ninja: Coloque um Marcador -1/-1 no Ninja adversário alvo.",
    ],
    flavor: "\"É, foi o que eu pensei.\"",
  },
  "s24-n-1378": {
    name: "Sasuke Uchiha (Estado 2)",
    text: [
      "[SOMBRA DO MAL]",
      "Quando este Ninja for colocado em jogo, coloque um Marcador -1/-1 em cada Ninja do seu oponente que tiver um Marcador -1/-1.",
    ],
    flavor: "\"Parece que não tenho tempo a perder.\"",
  },
  "s24-n-1379": {
    name: "Lobo de Duas Cabeças",
    text: [
      "[PRESAS GÊMEAS]",
      "Sacrifício: Kiba Inuzuka e Akamaru",
      "Quando qualquer Ninja que enfrenta este Ninja receber Dano por causa do Showdown, esses Ninjas recebem 1 Dano adicional.",
    ],
  },
  "s24-n-1380": {
    text: [
      "[VETERANO DE GUERRA]",
      "Quando este Ninja for colocado em jogo, ele ganha o seguinte efeito durante este turno:",
      "\"Válido: Quando este Ninja conseguir qualquer Vitória, você pode comprar 2 cards.\"",
    ],
    flavor: "\"Heh... impaciente como sempre, hein...\"",
  },
  "s24-n-1381": {
    text: [
      "[PLANO PERIGOSO]",
      "Quando este Ninja for colocado em jogo, procure qualquer card no seu Deck e mova-o para a sua mão. Depois, descarte um card aleatório da sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Para sobreviver, nós nos agarramos a tudo o que conhecemos e entendemos.\"",
  },
  "s24-n-1382": {
    name: "Hidan (Modo Maldição)",
    text: [
      "[DESTINO LIGADO]",
      "Sacrifício: Hidan",
      "Válido: Este Ninja não pode ser retirado de jogo por causa de Dano.",
      "Válido: Quando este Ninja receber qualquer Dano, os dois jogadores ganham 1 Prêmio de Batalha.",
      "[Válido | Atacante | Missão] (2): Cause 1 Dano a este Ninja.",
    ],
    flavor: "\"Dói gostoso, né?!\"",
  },
  "s24-n-1383": {
    name: "O 6º Hokage",
    text: [
      "[GOVERNANDO COM PUNHO DE FERRO]",
      "[Troca de Jutsu] Fira 1 Ninja que você controla: Cause 1 Dano ao Ninja alvo com Custo de Entrada igual ao do Ninja que você feriu.",
    ],
  },
  "s24-n-1384": {
    name: "Naruto Uzumaki (Infância)",
    text: [
      "[TREINO NA ACADEMIA]",
      "Válido: Quando este Ninja for colocado em jogo ou retirado de jogo, mova o card do topo do seu Deck para a sua área de Chakra.",
      "Quando este Ninja for movido para a sua área de Chakra pelo efeito de CRESCIMENTO, você pode colocar 1 Marcador de Crescimento no Ninja alvo.",
    ],
    flavor: "\"Puxa! Esse Sasuke sempre se acha!\"",
  },
  "s24-n-1385": {
    text: [
      "[ROUBANDO A LINHAGEM OCULTA]",
      "[Válido | Atacante | Missão | Troca de Jutsu] Remova do jogo 1 card de Ninja de qualquer Pilha de Descartes: Se esse Ninja tinha \"Byakugan\" ou \"Olho Sharingan\", este Ninja ganha essa Característica durante este turno.",
    ],
    flavor: "\"Eles estão vindo atrás de nós?\"",
  },
  "s24-n-1386": {
    name: "Peixe de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "[Atacante | Missão] (3): Coloque este card de Ninja em jogo a partir da sua mão.",
      "Válido: Quando este Ninja for colocado em jogo, compre 1 card.",
    ],
  },
  "s24-n-1387": {
    text: [
      "[ATITUDE OUSADA]",
      "Válido: Enquanto este Ninja for enfrentado por um Time que inclua 1 ou mais Ninjas com Custo de Entrada 3 ou mais, este Ninja ganha +2/+0.",
    ],
    flavor: "\"O irmão mais velho é meu rival!! Por isso eu não vou escolher uma rota de fuga!!\"",
  },
  "s24-n-1388": {
    text: [
      "[FÚRIA SELVAGEM]",
      "Válido: Quando este Ninja receber qualquer Dano ou for ferido, mova os 2 cards do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Grr...\"",
  },
  "s24-n-1389": {
    text: [
      "[COMBINAÇÃO MORTAL]",
      "Válido: Enquanto você tiver Omoi, este Ninja ganha +2/+0.",
    ],
    flavor: "\"Cala a boca! Já chega.\"",
  },
  "s24-n-1390": {
    text: [
      "[COMBINAÇÃO MORTAL]",
      "Todos os seus outros Ninjas \"Arma\" ganham +1/+1.",
      "Válido: Enquanto você tiver Karui, este Ninja ganha +2/+0.",
    ],
    flavor: "\"E se o Lorde Raikage ainda estiver chorando e as lágrimas dele virarem uma lagoa, e depois um lago? E se, quando a gente voltar para a vila, o lugar estiver úmido como a Chuva Oculta? O que a gente vai fazer?\"",
  },
  "s24-n-1391": {
    name: "Águia de Tinta",
    text: [
      "[PERGAMINHO DE FERAS]",
      "Não Único",
      "[Atacante | Missão] (3): Coloque este card de Ninja em jogo a partir da sua mão.",
      "[Atacante | Missão] Descarte 3 dos seus Ninjas \"Tinta\": Você ganha 1 Prêmio de Batalha. Você pode usar este efeito quantas vezes quiser.",
    ],
  },
  "s24-n-1392": {
    text: [
      "[ESPECIALISTA EM KENJUTSU]",
      "Quando um Jutsu que tenha \"Arma\" nos Requerimentos for resolvido com sucesso, se este Ninja era o Usuário, você pode aplicar o efeito desse Jutsu duas vezes.",
    ],
    flavor: "\"Vamos, vocês dois, a nossa missão está só começando.\"",
  },
  "s24-n-1393": {
    text: [
      "[CONTRATO]",
      "Este card de Ninja não pode ser colocado em jogo a menos que você tenha um Ninja \"Óleo\".",
    ],
  },
  "s24-n-1394": {
    text: [
      "[DESCANSANDO]",
      "Válido: No final do seu turno, se este Ninja não foi enviado para a Batalha, cure todos os seus Ninjas.",
    ],
  },
  "s24-n-1395": {
    name: "Naruto Uzumaki (Modo Sábio)",
    text: [
      "[ASCENDIDO]",
      "Sacrifício: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "Senjutsu",
      "Válido: A sua Pilha de Descartes é considerada como estando na sua área de Chakra. Quando você jogar um Jutsu, mova todos os Chakras usados para pagar esse Jutsu para o fundo do seu Deck.",
    ],
  },
  "s24-n-1396": {
    name: "Naruto Uzumaki (Seis Caudas)",
    text: [
      "[SEIS CAUDAS]",
      "[Válido | Atacante | Missão] Descarte 1 Naruto Uzumaki [QUATRO CAUDAS] da sua Vila: Se você tiver 15 ou mais Chakras, coloque este card de Ninja em jogo.",
      "Válido: Quando este Ninja for colocado em jogo, descarte todos os outros Ninjas.",
      "Válido: No final de cada turno, cure este Ninja.",
    ],
    flavor: "\"GRRROOOWWR!!!\"",
  },
  "s24-n-1397": {
    text: [
      "[VALENTÃO]",
      "Enquanto este Ninja for enfrentado por um Ninja ferido, este Ninja ganha +2/+0.",
    ],
    flavor: "\"Que cruel, Hibachi.\"",
  },
  "s24-n-1398": {
    text: [
      "[INVOCAÇÃO]",
      "Válido: Enquanto você tiver um Ninja \"Animal\", este Ninja ganha +2/+1.",
    ],
    flavor: "\"Desista, pirralho da Folha.\"",
  },
  "s24-n-1399": {
    text: [
      "[PAIXONITE]",
      "No final do seu turno, você pode pagar (*|*). Nesse caso, mova 1 card de Água da sua Pilha de Descartes para o topo do seu Deck.",
    ],
    flavor: "\"O que foi, Sasuke?\"",
  },
  "s24-n-1400": {
    text: [
      "[SELO AMALDIÇOADO]",
      "Quando este Ninja for enviado para a Batalha, se você não tiver cards na mão, compre 1 card.",
    ],
    flavor: "\"A parte difícil é não poder usar o nosso corpo por um tempo...\"",
  },
  "s24-n-1401": {
    text: [
      "[PROGENITOR]",
      "[Válido | Troca de Jutsu] Descarte 1 dos seus Prêmios de Batalha: O Ninja alvo ganha +4/+0 durante este turno.",
    ],
    flavor: "\"A-Andem logo e tranquem a porta!!\"",
  },
  "s24-n-1402": {
    text: [
      "[DESIDRATADO]",
      "[Atacante | Missão] (1): O texto de efeito do Ninja alvo é negado durante este turno.",
    ],
    flavor: "\"Por que você está juntando um time?\"",
  },
  "s24-n-1403": {
    text: [
      "[ESPELHOS DE GELO]",
      "[Atacante | Troca de Jutsu] (2): O Ninja alvo recebe -1/-1 para cada card na mão do controlador dele.",
    ],
    flavor: "\"Os seus olhos nunca vão ver a verdade.\"",
  },
  "s24-n-1404": {
    name: "Cinco Caudas",
    text: [
      "[ACELERADO]",
      "Quando 1 dos seus Ninjas \"Besta com Caudas\" conseguir qualquer Vitória, compre 1 card.",
    ],
  },
  "s24-n-1405": {
    name: "Kimimaro (Estado 2)",
    text: [
      "[AUMENTO]",
      "Sacrifício: Kimimaro + Custo de Entrada 4 ou mais",
      "[Válido | Troca de Jutsu] (0): Troque as posições de um Ninja de Apoio e de um Ninja Líder que enfrentam este Ninja.",
    ],
  },
  "s24-n-1406": {
    text: [
      "[SORRISO DE TUBARÃO]",
      "Quando este Ninja for baixado, o seu oponente embaralha no Deck dele todos os cards da área de Chakra dele e depois move a mesma quantidade, menos 2, do topo do Deck dele para a área de Chakra dele.",
    ],
    flavor: "\"Não tenho interesse em lutar com você...\"",
  },
  "s24-n-1407": {
    text: [
      "[VITÓRIA A QUALQUER CUSTO]",
      "[Troca de Jutsu] (0): Descarte qualquer número de cards da sua mão; depois, o seu oponente descarta 1 card para cada 2 cards que você descartou dessa forma.",
    ],
    flavor: "\"Lembre-se de com quem você está falando!\"",
  },
  "s24-n-1408": {
    text: [
      "[DECISÕES TÁTICAS]",
      "[Missão | Troca de Jutsu] (1): Negue o texto de efeito do Ninja alvo se ele não foi colocado em jogo durante este turno. Se esse Ninja for enviado para Atacar durante este turno, o controlador dele descarta 2 Chakras.",
    ],
  },
  "s24-n-1409": {
    name: "O 2º Hokage",
    text: [
      "[TORRENTE]",
      "[Atacante | Missão] (X), descarte 1 card: Retire X Ninjas alvo dos Times deles.",
    ],
  },
  "s24-n-1410": {
    text: [
      "[LEITURA DE MENTE]",
      "Quando este Ninja for colocado em jogo, o seu oponente revela a mão. Nesse caso, se ele revelou um card de Missão, você pode comprar 1 card e depois mover 1 card da sua mão para a sua área de Chakra.",
    ],
    flavor: "\"Você é idiota?\"",
  },
  "s24-n-1411": {
    text: [
      "[PESQUISA]",
      "Quando este Ninja for colocado em jogo, você pode ver os 3 cards do topo do seu Deck, mover qualquer um deles para o fundo e depois o resto para o topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"O que você está fazendo com as preciosas flores jofuku?!\"",
  },
  "s24-n-1412": {
    text: [
      "[SUBSTITUIÇÃO POR INSETOS]",
      "Quando este Ninja receber Dano por causa do Showdown, coloque em jogo uma moeda de Inseto 0/0.",
    ],
    flavor: "\"Não tem como você sobreviver a um ataque dessa magnitude...\"",
  },
  "s24-n-1413": {
    text: [
      "[FLOR DE CEREJEIRA]",
      "[Troca de Jutsu] (0): Descarte qualquer número de cards da sua mão e depois fira o Ninja alvo com Custo de Entrada igual ao número de cards que você descartou.",
    ],
    flavor: "Eu consigo!",
  },
  "s24-n-1414": {
    text: [
      "[DISCÍPULA DA AREIA]",
      "Enquanto você tiver outro Ninja \"Areia\" em jogo, todos os seus Ninjas \"Areia\" ganham +1/+1.",
    ],
    flavor: "\"Não me subestime.\"",
  },
  "s24-n-1415": {
    name: "Pai & Mãe",
    text: [
      "[CRIAÇÕES ORIGINAIS]",
      "Válido: Enquanto você não tiver um Ninja \"Manipulação\", o Poder deste Ninja é 0/0. Este efeito não pode ser negado.",
      "[Troca de Jutsu] (1): Se este Ninja estiver no mesmo Time que um Ninja \"Manipulação\", este Ninja ganha +5/-3 durante este turno.",
    ],
  },
  "s24-n-1416": {
    text: [
      "[AGULHAS ENVENENADAS]",
      "Quando este Ninja for colocado em jogo, você pode dizer um número. Nesse caso, durante o próximo turno do seu oponente, se ele colocar em jogo um Ninja com esse Custo de Entrada, fira esse Ninja.",
    ],
    flavor: "\"Você acha que a minha equipe não dá conta?\"",
  },
  "s24-n-1417": {
    text: [
      "[NANOINSETOS]",
      "Quando um Ninja que enfrenta este Ninja receber Dano por causa do Showdown, descarte esse Ninja.",
    ],
    flavor: "\"Vou extraí-los agora mesmo.\"",
  },
  "s24-n-1418": {
    text: [
      "[PODER DE 10]",
      "Válido: No final do seu turno, se os seus Ninjas \"Marionete\" tiverem Custo de Entrada somado de 10 ou mais, você ganha 2 Prêmios de Batalha.",
      "[Atacante | Missão] (0): Se você tiver 2 Chakras ou menos, mova até 2 cards de Ninja \"Marionete\" da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Será mesmo?\"",
  },
  "s24-n-1419": {
    text: [
      "[SENTIDOS CAPTURADOS]",
      "[Válido | Missão | Troca de Jutsu] (1): Negue o efeito ativado alvo.",
    ],
    flavor: "\"Quero resolver isso do meu jeito.\"",
  },
  "s24-n-1420": {
    text: [
      "[MESTRE DAS MARIONETES]",
      "Quando 1 dos seus Ninjas usar um Jutsu que tenha \"Marionete\" nos Requerimentos, o Ninja alvo que enfrenta esse Ninja passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Agora, vamos lá.\"",
  },
  "s24-n-1421": {
    text: [
      "[FORÇA SEM RIVAL]",
      "Enquanto o Combate deste Ninja for 10 ou mais, este Ninja não pode ser alvo de cards de Jutsu ou de Missão que o seu oponente controla.",
      "[Troca de Jutsu] (1): Este Ninja ganha +3/-3 durante este turno.",
    ],
  },
  "s24-n-1422": {
    name: "Pain (Caminho Deva)",
    text: [
      "[YIN E YANG]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Troca de Jutsu] (2): Mova o Ninja alvo para 1 dos Times do Dono Original dele no Campo de Batalha, em qualquer posição.",
    ],
  },
  // ── JUTSU ──
  "s24-j-895": {
    name: "Selamento da Besta com Caudas",
    text: [
      "Alvo: 1 Ninja \"REFORÇO\"",
      "Efeito: Remova o alvo do jogo.",
    ],
    flavor: "\"Um jutsu de selamento?!\"",
  },
  "s24-j-896": {
    name: "Punho Gentil",
    text: [
      "Requerimentos: \"Byakugan\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O seu oponente descarta um card aleatório. Se o Custo de Entrada desse card for 2 ou mais, cause 1 Dano ao alvo (Cards de Jutsu são considerados como tendo Custo de Entrada 0).",
    ],
  },
  "s24-j-897": {
    name: "Bravura",
    text: [
      "Efeito: Se o Usuário estiver bloqueando, ele ganha +5/+0 e não pode receber Dano durante este turno.",
    ],
    flavor: "\"Estou aqui porque eu quero estar.\"",
  },
  "s24-j-898": {
    name: "Passo Gentil: Punhos de Leões Gêmeos",
    text: [
      "Requerimentos: Hinata Hyuga + \"Chunin\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Descarte o alvo. Nesse caso, o seu oponente revela a mão. Descarte todos os cards revelados dessa forma com Custo de Entrada igual ao do alvo (Cards de Jutsu são considerados como tendo 0).",
    ],
  },
  "s24-j-899": {
    text: [
      "Requerimentos: Kakashi Hatake ou Itachi Uchiha ou Madara Uchiha ou Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Se o alvo for descartado por causa desse Dano, você pode causar 1 Dano a 1 outro Ninja.",
    ],
    flavor: "\"Mangekyo Sharingan... Este olho é especial...\"",
  },
  "s24-j-900": {
    name: "Moinho de Vento das Sombras",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: O Usuário ganha +4/+0 e o seguinte texto de efeito durante este turno: \"Válido: Quando este Ninja for conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha\".",
    ],
  },
  "s24-j-901": {
    name: "Clone de Corvos",
    text: [
      "Requerimentos: \"Genjutsu\" + Custo de Entrada 4 ou mais",
      "Efeito: Troque quais Times os Times Em Combate do seu oponente estão enfrentando.",
    ],
  },
  "s24-j-902": {
    text: [
      "Este card de Jutsu pode ser jogado da sua Pilha de Descartes.",
      "Requerimentos: Itachi Uchiha ou Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se este card foi jogado da Pilha de Descartes, cause 1 Dano ao alvo e depois remova este Jutsu do jogo. Se não, cause 2 Dano ao alvo.",
    ],
    flavor: "\"Não pode ser!\"",
  },
  "s24-j-903": {
    name: "Arte do Sábio: Chamado do Sapo",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: O alvo passa a ser 0/0 durante este turno.",
      "Especialista [Senjutsu]: Cause 1 Dano ao alvo.",
    ],
  },
  "s24-j-904": {
    name: "Jutsu do Sábio: Barragem de Rasengan",
    text: [
      "Requerimentos: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 2 Dano ao alvo",
      "Especialista (Naruto (Sage Mode)): Cause 1 Dano a 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "\"Barragem de Rasengan!\"",
  },
  "s24-j-905": {
    name: "Kumite do Sapo",
    text: [
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo.",
      "Especialista [Senjutsu]: Compre 1 card para cada Símbolo do alvo.",
    ],
  },
  "s24-j-906": {
    name: "Arte do Sábio: Rasengan Gigante",
    text: [
      "Requerimentos: Naruto Uzumaki + Custo de Entrada 3 ou mais, ou Jiraiya",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 1 Dano ao alvo.",
      "Especialista (Senjutsu): Mova até 2 cards de Raio da sua Pilha de Descartes para a sua área de Chakra.",
    ],
  },
  "s24-j-907": {
    name: "Estilo Vento: Rasen Shuriken",
    text: [
      "Requerimentos: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja",
      "Efeito: Descarte o alvo.",
      "Especialista [Naruto Uzumaki (Modo Sábio)]: Descarte o Time do alvo.",
    ],
    flavor: "\"Cala a boca!!!\"",
  },
  "s24-j-908": {
    name: "Lança Chidori",
    text: [
      "Requerimentos: Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Veja os X cards do topo do seu Deck, onde X = o Custo de Entrada do alvo. Mova qualquer um deles para o fundo do seu Deck e o resto para o topo, em qualquer ordem; depois, fira o alvo. Se Raio foi usado para pagar este Jutsu, cause 1 Dano ao alvo e depois compre 1 card.",
    ],
    flavor: "\"Por que não acabamos com essa farsa?\"",
  },
  "s24-j-909": {
    name: "Golpe da Serpente das Sombras",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo. Nesse caso, cure o Usuário.",
    ],
    flavor: "\"Golpe da Serpente das Sombras!\"",
  },
  "s24-j-910": {
    name: "Estilo Água: Onda de Choque de Água Explosiva",
    text: [
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Efeito: Mova qualquer quantidade de cards da sua Pilha de Descartes para a sua área de Chakra. No final deste turno, descarte cards da sua área de Chakra até ficar com apenas 2.",
    ],
    flavor: "\"A minha dor é muito maior que a sua!\"",
  },
  "s24-j-911": {
    name: "Selamento de Chakra",
    text: [
      "Efeito: Durante este turno e o próximo, os jogadores não podem jogar cards de Jutsu.",
      "Especialista [\"Akatsuki\"]: Mova 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
    ],
    flavor: "\"Vai levar três dias. Preparem-se.\"",
  },
  "s24-j-912": {
    name: "Escudo de Insetos",
    text: [
      "Efeito: Coloque este card no Time do Usuário, em qualquer posição, como um Ninja Inseto com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)/Custo de Entrada: 0], [Não Único], [Válido: Quando qualquer Ninja do Time deste Ninja for receber qualquer Dano, este Ninja o recebe em vez dele.]\"",
    ],
  },
  "s24-j-913": {
    name: "Bisturi de Chakra",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Troque os valores de Combate e de Suporte do alvo durante este turno.",
    ],
    flavor: "\"Aha...! Isto é impressionante...\"",
  },
  "s24-j-914": {
    name: "Estilo Vento: Dano por Pressão",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Mova o alvo e o Usuário para a mão do Dono Original deles.",
    ],
    flavor: "\"Choji! Cuidado!\"",
  },
  "s24-j-915": {
    name: "Cura pelas Palmas",
    text: [
      "Alvo: Todos os Ninjas do Time do Usuário",
      "Efeito: Cure o alvo e compre 1 card.",
    ],
    flavor: "\"Os ferimentos dele estão demorando para curar...\"",
  },
  "s24-j-916": {
    name: "Imobilizado",
    text: [
      "Requerimentos: Vazio",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Anexe este Jutsu ao alvo. Enquanto este Jutsu estiver anexado, o Poder do alvo é 0/0.",
    ],
    flavor: "\"Isso te domou um pouco, Nove Caudas?\"",
  },
  "s24-j-917": {
    name: "Perturbação de Chakra",
    text: [
      "Efeito: Todos os cards da área de Chakra do seu oponente ficam sem Símbolos durante este turno e o próximo.",
    ],
    flavor: "\"Pain é bem habilidoso.\"",
  },
  "s24-j-918": {
    name: "Dreno de Chakra",
    text: [
      "Requerimentos: Vazio",
      "Efeito: Descarte até 2 Chakras do seu oponente. O Usuário ganha +2/+0 para cada card descartado dessa forma.",
    ],
    flavor: "O que está acontecendo? Estou perdendo as forças...",
  },
  "s24-j-919": {
    name: "Construção Planetária Catastrófica",
    text: [
      "Requerimentos: Pain (Caminho Deva)",
      "Efeito: Mova todos os Ninjas do seu oponente com Custo de Entrada X ou menos para 1 dos Times dele no Campo de Batalha, em qualquer posição. Depois, o Poder de todos os Ninjas desse Time com Custo de Entrada X ou menos é 0/0 durante este turno.",
    ],
    flavor: "\"Construção Planetária Catastrófica!!\"",
  },
  "s24-j-920": {
    name: "Dragão Demoníaco",
    text: [
      "Requerimentos: Nagato + Custo de Entrada 6 ou mais",
      "Alvo: Todos os Ninjas que enfrentam o Usuário",
      "Efeito: Descarte o alvo.",
    ],
    flavor: "\"Se aquilo encostar em nós, estamos mortos!\"",
  },
  // ── MISSÃO ──
  "s24-m-855": {
    name: "O Clã Hyuga",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas com Hyuga no nome ganham +1/+1.",
      "Efeito: No final do seu turno, se você ganhou 2 ou mais Prêmios de Batalha neste turno, o seu oponente descarta 1 card aleatório.",
    ],
  },
  "s24-m-856": {
    name: "Determinação de Proteger",
    text: [
      "Permanente (1)",
      "Efeito: Os Ninjas não podem ser enviados para a Batalha.",
    ],
    flavor: "\"Fuja! Você não tem como vencer...\"",
  },
  "s24-m-857": {
    name: "Uma Questão de Amor",
    text: [
      "Efeito: O seu oponente escolhe um dos Ninjas dele, e você passa a controlá-lo.",
    ],
    flavor: "\"Porque... eu amo você...\"",
  },
  "s24-m-858": {
    name: "Sinal Preocupante",
    text: [
      "Anulação",
      "Efeito: Diga um Símbolo. Os seus Ninjas não podem ser alvo de cards de Jutsu ou de Missão com o Símbolo dito durante este turno.",
    ],
    flavor: "\"Isto é...!\"",
  },
  "s24-m-859": {
    name: "O Clã Nara",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas \"Sombra\" ganham +1/+1 e +2 de Poder Mental.",
      "[Troca de Jutsu] (Terra|1): O Time do Ninja \"Sombra\" alvo e o Time que o enfrenta (se houver) fazem uma Batalha Mental durante o Showdown deste turno.",
    ],
  },
  "s24-m-860": {
    name: "Treino Hyuga",
    text: [
      "Permanente (3)",
      "Alvo: 1 Ninja",
      "Efeito: O alvo ganha \"Taijutsu\" e \"Byakugan\". Quando o alvo ganhar qualquer Prêmio de Batalha, o seu oponente descarta 1 card da mão.",
    ],
    flavor: "\"Quero me tornar uma grande ninja... forte como o Pai e gentil como a Mãe.\"",
  },
  "s24-m-861": {
    name: "O Clã Inuzuka",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas com Inuzuka no nome ganham +1/+1.",
      "Efeito: Quando qualquer um dos seus Ninjas \"Animal\" for ser descartado, em vez disso, mova-o para a sua mão.",
    ],
  },
  "s24-m-862": {
    name: "Líder dos Gatos",
    text: [
      "Efeito: Coloque em jogo 1 card de Ninja \"Animal\" da sua Pilha de Descartes com Custo de Entrada menor ou igual ao seu Marcador de Turnos.",
    ],
    flavor: "\"Então você vai mesmo atrás do Itachi?\"",
  },
  "s24-m-863": {
    name: "O Clã Uchiha",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas com Uchiha no nome ganham +1/+1.",
      "[Atacante | Missão] (Fogo|Fogo): Coloque um Marcador -1/-1 no Ninja alvo.",
    ],
  },
  "s24-m-864": {
    name: "Insanidade",
    text: [
      "Efeito: Compre 4 cards e depois descarte 2 cards aleatórios.",
    ],
    flavor: "\"Sasuke! Você é a minha nova luz!\"",
  },
  "s24-m-865": {
    name: "O Mais Forte",
    text: [
      "Efeito: Se você baixou um Ninja neste turno, cada jogador descarta todos os Ninjas que controla, exceto 1.",
    ],
    flavor: "\"Um dos fundadores da Vila da Folha Oculta. O primeiro homem a possuir o Mangekyo Sharingan.\"",
  },
  "s24-m-866": {
    name: "Guardiões da Vila",
    text: [
      "Permanente",
      "Efeito: O tamanho máximo da sua mão é 3 e não pode ser reduzido mais.",
      "Efeito: Quando você colocar um Ninja em jogo, compre um card.",
    ],
  },
  "s24-m-867": {
    name: "Reflexões de um Eremita",
    text: [
      "Efeito: Veja os 5 cards do topo do seu Deck. Você pode revelar um card que não seja de Raio e movê-lo para a sua mão. Depois, mova os outros cards para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Mas eu tenho fé que vai chegar o dia em que as pessoas vão poder se entender de verdade.\"",
  },
  "s24-m-868": {
    name: "Pose Nice Guy",
    text: [
      "Alvo: 2 Ninjas",
      "Efeito: Compre 1 card e depois coloque um Marcador +1/+1 no alvo.",
    ],
    flavor: "\"Você quebrou o antigo recorde do Quarto Hokage!\"",
  },
  "s24-m-869": {
    name: "O Fardo do Ódio",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Cause 1 Dano ao alvo para cada Ninja com o mesmo nome dele na Pilha de Descartes ou na área de Chakra do controlador dele.",
    ],
    flavor: "\"Pensando bem... finalmente entendi o que o Sábio Tarado quis dizer.\"",
  },
  "s24-m-870": {
    name: "Um Pai em Tempos Sombrios",
    text: [
      "Como custo adicional para jogar este card, pague X Chakras.",
      "Efeito: Revele os X cards do topo do seu Deck. Mova todos os cards de Ninja revelados dessa forma para a sua mão e depois embaralhe o resto no seu Deck.",
    ],
    flavor: "\"Afinal, você é meu filho.\"",
  },
  "s24-m-871": {
    name: "Sombras do Passado",
    text: [
      "Alvo: 1 Ninja que você controla.",
      "Efeito: Compre X cards e depois descarte Y cards, onde X = o Combate do alvo, e Y = o Suporte do alvo.",
    ],
    flavor: "\"Vovô... Ele não te lembra aqueles dois?\"",
  },
  "s24-m-872": {
    name: "Enfurecendo a Fera",
    text: [
      "Alvo: (1) 1 dos seus Ninjas \"Besta com Caudas\" (2) 1 dos Ninjas do seu oponente",
      "Efeito: Retire os alvos dos Times deles. Os dois alvos devem ser enviados para a Batalha sozinhos durante este turno e só podem ser enfrentados um pelo outro.",
      "Enquanto este card de Missão estiver no seu Chakra, todos os seus cards de Ninja \"Besta com Caudas\" ganham -1 de Custo de Entrada.",
    ],
    flavor: "\"Vem cá!! Vou te fazer em pedaços!!!\"",
  },
  "s24-m-873": {
    name: "Organização da Paz",
    text: [
      "Efeito: Para cada Símbolo diferente entre os cards da área de Chakra do seu oponente, ele descarta 1 card. Depois, descarte Chakras do seu oponente até ele ficar com 2 cards na área de Chakra. Se ele tiver menos de 2 cards na área de Chakra, descarte todos os Chakras dele.",
    ],
    flavor: "\"As pessoas aprovavam os nossos esforços de construir a paz sem o uso da força.\"",
  },
  "s24-m-874": {
    name: "Uma Situação Impossível",
    text: [
      "Alvo: 1 Ninja que o seu oponente controla",
      "Efeito: O seu oponente pode ferir o alvo. Se ele não fizer isso, compre 2 cards.",
    ],
    flavor: "\"Você! O ruivo. Use isso para matar o Yahiko.\"",
  },
  "s24-m-875": {
    name: "Adeus Final",
    text: [
      "Permanente",
      "Efeito: Quando um Ninja for descartado, o Dono Original desse card de Ninja procura no Deck, na mão e na Pilha de Descartes dele qualquer card com o mesmo nome desse card de Ninja e os remove do jogo.",
    ],
    flavor: "\"Adeus, Chibi.\"",
  },
  "s24-m-876": {
    name: "Treino na Chuva",
    text: [
      "Alvo: 1 Ninja que você controla",
      "Efeito: O próximo card de Ninja que você jogar neste turno tem o Custo de Entrada reduzido em X, onde X = o Custo de Entrada do alvo.",
    ],
    flavor: "\"Daqui em diante, vocês estão por conta própria.\"",
  },
  "s24-m-877": {
    name: "Relembrar",
    text: [
      "Efeito: Compre X cards, onde X = o número de cards na mão do seu oponente.",
    ],
  },
  "s24-m-878": {
    name: "O Clã Aburame",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas \"Inseto\" e Ninjas Inseto ganham +1/+1.",
      "Efeito: Quando 1 dos seus Ninjas \"Inseto\" for ser descartado, mova-o para a sua área de Chakra e coloque em jogo uma moeda de Ninja Inseto 0/0 com o seguinte: [Não Único]",
    ],
  },
  "s24-m-879": {
    name: "Transmissão de Chakra",
    text: [
      "Permanente",
      "[Troca de Jutsu] (2): Fira 1 dos seus Ninjas Saudáveis e depois cure outro Ninja.",
    ],
    flavor: "\"Ela já liberou o Jutsu de Regeneração Mitótica e deu todo o Chakra dela à Senhora Katsuyu.\"",
  },
  "s24-m-880": {
    name: "Livro Secreto",
    text: [
      "Anulação",
      "Alvo: 1 Missão",
      "Efeito: Negue o alvo e mova-o para o topo do Deck do Dono Original dele.",
    ],
    flavor: "\"O Sai dava muito valor a este livro ilustrado...\"",
  },
  "s24-m-881": {
    name: "Gedo: Arte do Renascimento Rinne",
    text: [
      "Efeito: Os dois jogadores, começando por você, movem 1 card de Ninja da Pilha de Descartes para a Vila, ignorando o Sacrifício. Repita este efeito até os dois jogadores passarem seguidamente.",
    ],
    flavor: "\"O poder ocular do Nagato é o jutsu que controla a vida e a morte.\"",
  },
  "s24-m-882": {
    name: "O Verdadeiro Pain",
    text: [
      "Permanente",
      "Efeito: Quando você colocar esta Missão em jogo, compre 1 card.",
      "Efeito: Quando você Sacrificar um Ninja, mova-o para a sua área de Chakra.",
    ],
    flavor: "\"A dor vai gerar uma paz momentânea.\"",
  },
  "s24-m-883": {
    name: "Despertar",
    text: [
      "Permanente",
      "Efeito: Quando o seu oponente ganhar qualquer Prêmio de Batalha, coloque essa quantidade de marcadores nesta Missão.",
      "Efeito: No início do seu turno, se esta Missão tiver 4 ou mais marcadores, descarte-a. Nesse caso, se você tiver 5 cards ou menos na mão, compre até ficar com 6 cards na mão.",
    ],
    flavor: "\"Arghhhhhh!!!\"",
  },
};
