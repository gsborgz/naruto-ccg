import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S27 — Hero's Ascension, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s27-heros-ascension.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 * Palavras-chave: Revitalize = Revitalizar; Inherit = Herança; Desperation = Desespero;
 * Burst = Explosão; Flashpoint = Ponto Crítico.
 */
export const S27_HEROS_ASCENSION_PTBR: CardTranslations = {
  // ── NINJA ──
  "s27-n-1553": {
    text: [
      "[O PODER DA COMIDA]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "Quando este Ninja Atacar, ele ganha +2/+0 durante este turno.",
    ],
    flavor: "\"Ugh...! Cala a boca e fica de olho aberto!\"",
  },
  "s27-n-1554": {
    text: [
      "[ATITUDE ÁSPERA]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "Válido: O Ninja Líder do Time deste Ninja não pode ser alvo dos efeitos de Ninja do seu oponente.",
    ],
    flavor: "\"Você... ficou louco?!\"",
  },
  "s27-n-1555": {
    text: [
      "[ESPECIALISTA TREINADA]",
      "Enquanto o Ninja Líder do Time deste Ninja for um Ninja \"Genin\" que não seja este Ninja, esse Ninja não pode receber Dano",
    ],
  },
  "s27-n-1556": {
    text: [
      "[INFILTRADO]",
      "Quando este Ninja for colocado em jogo, você pode remover 1 marcador de cada Missão Permanente que o seu oponente controla.",
      "Válido: Todos os cards de Missão do seu oponente ganham +1 de Custo de Entrada.",
    ],
    flavor: "\"Caramba... Treine direito o seu pessoal!\"",
  },
  "s27-n-1557": {
    text: [
      "[OPONENTE FORMIDÁVEL]",
      "Este Ninja ganha +1/+0 para cada Chakra de Terra que você tiver.",
    ],
    flavor: "\"Agora eu entendi.\"",
  },
  "s27-n-1558": {
    text: [
      "[MODELO DE TÁTICA]",
      "Enquanto este Ninja for enfrentado, se estiver Bloqueando, o Ninja Líder do Time que enfrenta este Ninja usa o Suporte dele em vez do Combate durante o Showdown.",
    ],
    flavor: "\"Só uma palavra a mais...\"",
  },
  "s27-n-1559": {
    text: [
      "[PERSONALIDADE TÍMIDA]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "Válido: Quando este Ninja Bloquear, coloque um Marcador de Crescimento nele.",
    ],
    flavor: "\"Estou com medo.\"",
  },
  "s27-n-1560": {
    text: [
      "[DUPLA PERSONALIDADE]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, você pode colocar em jogo uma moeda de Zetsu Branco e uma moeda de Zetsu Negro com o seguinte: \"[Poder: 1/1 (Saudável e Ferido)]\".",
    ],
    flavor: "\"Não... tenha paciência.\"",
  },
  "s27-n-1561": {
    text: [
      "[SOCO DE NOCAUTE]",
      "Revitalizar (Quando este card for ser movido para a Pilha de Descartes, em vez disso, mova-o para o fundo do seu Deck.)",
      "Quando este Ninja for colocado em jogo, você pode descartar o Ninja alvo que não seja \"Folha\" com Custo de Entrada 2 ou menos.",
    ],
    flavor: "\"Eu não me preocuparia mais com o seu corpo.\"",
  },
  "s27-n-1562": {
    text: [
      "[GÊNIO DOS HYUGA]",
      "Válido: Quando este Ninja for receber qualquer Dano, você pode mover até essa mesma quantidade de cards de Terra da sua Pilha de Descartes para o fundo do seu Deck. Nesse caso, em vez disso, reduza esse Dano pelo número de cards que você moveu por este efeito.",
    ],
    flavor: "\"São muitos!\"",
  },
  "s27-n-1563": {
    text: [
      "[ISCA EXPLOSIVA]",
      "Revitalizar (Quando este card for ser movido para a Pilha de Descartes, em vez disso, mova-o para o fundo do seu Deck.)",
      "Quando este Ninja receber Dano por causa do Showdown, você pode causar 1 Dano ao Ninja adversário alvo.",
    ],
    flavor: "\"Agora sim, esta é a minha maior obra-prima!!\"",
  },
  "s27-n-1564": {
    name: "O 3º Tsuchikage",
    text: [
      "[POÇO GRAVITACIONAL]",
      "Quando qualquer um dos Ninjas do seu oponente receber Dano, você pode retirar esse Ninja do Time dele. Nesse caso, esse Ninja não pode ser enviado para a Batalha durante o próximo turno.",
    ],
  },
  "s27-n-1565": {
    text: [
      "[JUVENTUDE TEIMOSA]",
      "Enquanto este Ninja for enfrentado por um Time com apenas 1 Ninja, este Ninja ganha +2/+0.",
    ],
  },
  "s27-n-1566": {
    name: "Gato Cavalheiro",
    text: [
      "[PAPO AMIGÁVEL]",
      "Válido: Enquanto este Ninja for enfrentado, ele ganha +X/+0, onde X = o Poder Mental total somado do Time adversário.",
    ],
    flavor: "\"Posso me juntar a vocês?\"",
  },
  "s27-n-1567": {
    text: [
      "[DESPREVENIDO]",
      "Válido: Quando este Ninja for descartado, você pode comprar 1 card.",
    ],
  },
  "s27-n-1568": {
    name: "Sr. Avestruz",
    text: [
      "[INDOMÁVEL]",
      "Desespero (Se o seu oponente tiver 5 ou mais Prêmios de Batalha, as Habilidades Ativadas deste card podem ser ativadas até duas vezes por turno.)",
      "[Válido | Atacante | Troca de Jutsu] (0): Este Ninja ganha +1/+0 durante este turno.",
    ],
    flavor: "\"Vou derrotar você e ser livre de verdade!\"",
  },
  "s27-n-1569": {
    text: [
      "[A MELHOR TRILHA]",
      "Este Ninja não pode ser Bloqueado por um Time com 1 ou mais Ninjas \"Genin\".",
    ],
    flavor: "\"Feh! Me dá um tempo! Para de fingir!\"",
  },
  "s27-n-1570": {
    text: [
      "[PRIVILÉGIO DE GÊNIO]",
      "Desespero (Se o seu oponente tiver 5 ou mais Prêmios de Batalha, as Habilidades Ativadas deste card podem ser ativadas até duas vezes por turno.)",
      "[Troca de Jutsu] Descarte 1 dos seus Prêmios de Batalha: Este Ninja ganha +2/+0 durante este turno.",
    ],
    flavor: "\"Eu não ligo...\"",
  },
  "s27-n-1571": {
    text: [
      "[HORA DE AGIR]",
      "Desespero",
      "[Atacante | Troca de Jutsu] (Fogo|1): Fira este Ninja e o Ninja adversário alvo. Se este efeito foi usado duas vezes neste turno, mova este Ninja para a sua mão.",
    ],
    flavor: "\"O segredo é manter o autocontrole!\"",
  },
  "s27-n-1572": {
    text: [
      "[UM PRESSENTIMENTO SOMBRIO]",
      "Quando 1 dos seus Ninjas \"Akatsuki\" for ser descartado por um efeito, você pode, em vez disso, movê-lo para a sua mão.",
    ],
    flavor: "\"Agora, vamos recuar.\"",
  },
  "s27-n-1573": {
    text: [
      "[VIDA ETERNA]",
      "Quando este card de Ninja for usado para pagar o Custo de Mão de um card de Ninja \"Akatsuki\", você pode colocar este card de Ninja em jogo.",
    ],
    flavor: "\"...Que piada...\"",
  },
  "s27-n-1574": {
    text: [
      "[EXAUSTO]",
      "Herança",
      "Os cards de Jutsu usados por este Ninja podem ter o custo pago descartando cards do topo do seu Deck (Qualquer Símbolo específico conta como 1 para este efeito).",
    ],
    flavor: "\"Não vou me segurar!\"",
  },
  "s27-n-1575": {
    name: "Kakashi Hatake (Garoto)",
    text: [
      "[HERDEIRO DA PRESA]",
      "Quando este Ninja for colocado em jogo, você pode revelar os 3 cards do topo do seu Deck. Nesse caso, mova para a sua mão os cards de Jutsu revelados dessa forma que este Ninja poderia usar e depois mova o resto dos cards revelados para a sua Pilha de Descartes.",
    ],
    flavor: "\"Eu vou detê-los...\"",
  },
  "s27-n-1576": {
    text: [
      "[EXPERIENTE]",
      "Herança (Válido: Quando este Ninja for ser descartado, em vez disso, remova-o do jogo. Nesse caso, o Ninja alvo que você controla ganha o texto de efeito deste card de Ninja (exceto Herança) enquanto esse Ninja continuar em jogo.)",
      "Quando este Ninja Atacar sozinho, ele não pode ser Bloqueado por um Ninja que não tenha o Atributo de Combate deste Ninja.",
    ],
    flavor: "\"Esta é a minha tarefa.\"",
  },
  "s27-n-1577": {
    text: [
      "[CONTINUAÇÃO DA LINHAGEM]",
      "No início do seu turno, você pode mover 1 card de Ninja com \"Uchiha\" no nome da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Tome cuidado...\"",
  },
  "s27-n-1578": {
    name: "Homem Mascarado",
    text: [
      "[CONTROLE DAS BESTAS COM CAUDAS]",
      "Desespero",
      "[Atacante | Troca de Jutsu] (3): Coloque em jogo 1 card de Ninja \"Besta com Caudas\" da sua mão ou do seu Baralho de Reforço. Esse Ninja tem o texto de efeito negado durante este turno.",
    ],
  },
  "s27-n-1579": {
    text: [
      "[IDEAIS HEROICOS]",
      "Válido: Enquanto este Ninja for enfrentado por um Ninja com Custo de Entrada 2 ou mais, ele ganha +2/+0.",
    ],
    flavor: "\"Lembre-se de mim!!!\"",
  },
  "s27-n-1580": {
    text: [
      "[DESAFIO]",
      "Ponto Crítico ([Atacante | Missão] (0): Remova este Ninja do jogo. No início do seu próximo turno, mova este card de Ninja para a sua Vila.)",
      "Válido: Quando este Ninja for colocado em jogo sem ser baixado, se ele Atacar, só pode ser enfrentado pelo Ninja alvo durante este turno.",
    ],
    flavor: "\"O quêêê!\"",
  },
  "s27-n-1581": {
    text: [
      "[MASCOTE DO ESTRATEGISTA]",
      "Válido: Os Times não podem fazer Batalhas Mentais.",
      "Válido: Os seus cards de Ninja Kakashi Hatake ganham -2 de Custo de Entrada.",
    ],
  },
  "s27-n-1582": {
    text: [
      "[SURTO DE PODER]",
      "[Válido | Troca de Jutsu] (Raio): Este Ninja ganha +2/+0 durante este turno. Cause 1 Dano a este Ninja no final deste turno.",
    ],
    flavor: "\"Hii-yah!\"",
  },
  "s27-n-1583": {
    text: [
      "[RECIPIENTE DA FERA]",
      "Ponto Crítico",
      "Quando este Ninja for retirado de jogo, você pode colocar em jogo 1 card de Ninja \"Besta com Caudas\" da sua mão. Nesse caso, remova esse Ninja \"Besta com Caudas\" do jogo no final deste turno.",
    ],
    flavor: "\"Naruto...\"",
  },
  "s27-n-1584": {
    text: [
      "[GUARDA DO PORTÃO]",
      "Quando você colocar em jogo outro Ninja \"Folha\", pode colocar um Marcador +1/+1 nesse Ninja.",
      "[Troca de Jutsu] Remova 3 Marcadores +1/+1 de Ninjas que você controla: Compre 1 card.",
    ],
    flavor: "\"Por que eu não pude ir com o Kotetsu!?\"",
  },
  "s27-n-1585": {
    text: [
      "[FRAÇÃO DO PODER]",
      "Quando este Ninja for colocado em jogo, se você tiver 1 ou mais cards de Ninja \"Besta com Caudas\" na sua área de Chakra, você pode ferir este Ninja.",
      "Válido: Todos os seus cards de Ninja \"Besta com Caudas\" ganham -1 de Custo de Mão.",
    ],
    flavor: "\"Não mexa comigo!\"",
  },
  "s27-n-1586": {
    text: [
      "[UMA NOVA TÉCNICA]",
      "Ponto Crítico",
      "Quando este Ninja for colocado em jogo sem ser baixado, você pode procurar no seu Deck 1 card de Jutsu cujo nome inclua \"Rasengan\", revelá-lo e depois embaralhar o seu Deck. Depois, coloque o card procurado no topo do seu Deck.",
    ],
    flavor: "\"Eu queria vingança.\"",
  },
  "s27-n-1587": {
    text: [
      "[CALIGRAFIA SUPREMA]",
      "Ponto Crítico",
      "Quando este Ninja for colocado em jogo, você pode revelar os 3 cards do topo do seu Deck, remover do jogo 1 card de Jutsu revelado dessa forma e descartar o resto. Este Ninja pode usar esse card de Jutsu durante este turno, independentemente dos Requerimentos dele. Descarte os outros cards revelados por este efeito.",
    ],
    flavor: "\"Pode tentar.\"",
  },
  "s27-n-1588": {
    name: "Killer Bee (Forma de Besta com Caudas)",
    text: [
      "[RELAÇÃO SIMBIÓTICA]",
      "Quando este Ninja for Bloqueado, você pode ganhar 1 Prêmio de Batalha. Nesse caso, o Time deste Ninja não pode causar Dano por causa do Showdown durante este turno.",
    ],
    flavor: "\"Uhuuuuuu!!!!\"",
  },
  "s27-n-1589": {
    name: "Killer Bee (Versão 2)",
    text: [
      "[FORÇA DAS FERAS]",
      "Sacrifício: Killer Bee",
      "[Troca de Jutsu] (0): Mova o Ninja Líder do Time adversário para o topo do Deck do Dono Original dele.",
    ],
  },
  "s27-n-1590": {
    name: "O 4º Hokage",
    text: [
      "[VERDADEIRO LÍDER]",
      "Ponto Crítico",
      "Quando este Ninja for colocado em jogo, todos os seus Ninjas ganham +2/+2 durante este turno. Além disso, quando qualquer um dos seus Times conseguir uma Vitória Espetacular durante este turno, você ganha 1 Prêmio de Batalha.",
    ],
  },
  "s27-n-1591": {
    text: [
      "[GRANDE EQUALIZADOR]",
      "Quando este Ninja for colocado em jogo, você pode remover o Ninja alvo do jogo. Nesse caso, no final deste turno, coloque esse Ninja de volta em jogo e depois fira-o.",
    ],
    flavor: "\"Saindo agora mesmo!!\"",
  },
  "s27-n-1592": {
    text: [
      "[BRAÇO FORTE]",
      "Explosão | Desespero",
      "[Troca de Jutsu] (1): Se o card do topo do seu Deck for um card de Jutsu revelado, mova-o para a sua mão. Depois, este Ninja ganha +1/+0 durante este turno.",
    ],
    flavor: "\"Eles são meus.\"",
  },
  "s27-n-1593": {
    text: [
      "[AUTOPRESERVAÇÃO]",
      "Válido: No final do seu turno, se este Ninja estiver ferido, cure-o.",
    ],
    flavor: "\"O que você está fazendo...?!\"",
  },
  "s27-n-1594": {
    text: [
      "[FORMA AQUOSA]",
      "Desespero",
      "[Troca de Jutsu] (Água): Da próxima vez que este Ninja receber Dano durante este turno, reduza esse Dano em 1.",
    ],
    flavor: "\"Ele não é do tipo que ouve palavras...\"",
  },
  "s27-n-1595": {
    text: [
      "[EM HARMONIA COM A NATUREZA]",
      "Explosão | Desespero",
      "[Troca de Jutsu] (1): Se o card do topo do seu Deck for um card de Missão revelado, mova-o para a sua mão. Depois, este Ninja ganha +2/+0 durante este turno.",
    ],
    flavor: "\"Hmm...\"",
  },
  "s27-n-1596": {
    text: [
      "[DUPLO DO ESPELHO]",
      "[Troca de Jutsu] (Água|Água): Coloque na sua Vila uma cópia do Ninja alvo que você controla, exceto este Ninja. Essa cópia tem Não Único. No final deste turno, remova a cópia do jogo.",
    ],
    flavor: "\"Preciso chegar ao próximo espelho!\"",
  },
  "s27-n-1597": {
    text: [
      "[ONDA ESTALANTE]",
      "Quando este Ninja for colocado em jogo, você pode mover para a mão do Dono Original dele o Ninja alvo com Custo de Entrada menor que X. X = o número de Ninjas \"Névoa\" que você controla.",
    ],
    flavor: "\"Hunf! Não, obrigado!\"",
  },
  "s27-n-1598": {
    text: [
      "[MESTRE DA REANIMAÇÃO]",
      "Explosão",
      "[Troca de Jutsu] (Água): Se o card do topo do seu Deck for um card de Ninja revelado, coloque-o no Time deste Ninja, em qualquer posição. No final deste turno, descarte esse Ninja.",
    ],
    flavor: "\"Eu luto com você quando quiser.\"",
  },
  "s27-n-1599": {
    text: [
      "[RUGIDO DO DEMÔNIO]",
      "Desespero",
      "[Válido | Troca de Jutsu] (0): Este Ninja ganha +4/+0 durante este turno. No final deste turno, mova este Ninja para a sua área de Chakra.",
    ],
    flavor: "\"Mostre do que você é capaz!\"",
  },
  "s27-n-1600": {
    text: [
      "[CONTROLE DE CHAKRA]",
      "Quando este Ninja usar um Jutsu, você pode descartar X Chakras do seu oponente. X = o custo total do Jutsu (Símbolos Específicos contam como 1 para fins de custo total).",
    ],
    flavor: "\"Peço desculpas, mas você precisa alimentar a Samehada.\"",
  },
  "s27-n-1601": {
    text: [
      "[CAMPO DE BATALHA DE OSSOS]",
      "Quando um jogador baixar um Ninja, ele pode pagar (2). Se não pagar, fira esse Ninja.",
    ],
    flavor: "\"Não me resta escolha...\"",
  },
  "s27-n-1602": {
    text: [
      "[BUSCA INTELECTUAL]",
      "[Atacante | Missão] Remova do jogo 1 Ninja que você controla: Coloque em jogo 1 Ninja da sua Pilha de Descartes.",
    ],
  },
  "s27-n-1603": {
    text: [
      "[FUSÃO]",
      "Sacrifício: Kisame Hoshigake",
      "Válido: Quando este Ninja for enfrentado, descarte 1 dos Chakras do seu oponente para cada Ninja que enfrenta este Ninja e tem Combate menor que o deste Ninja.",
    ],
  },
  "s27-n-1604": {
    text: [
      "[DEFESA REATIVA]",
      "Revitalizar",
      "Quando qualquer um dos seus Ninjas com Revitalizar se tornar alvo de um Jutsu, você pode comprar 1 card.",
    ],
    flavor: "\"Eu cuido disso.\"",
  },
  "s27-n-1605": {
    text: [
      "[TIME COMPLETO]",
      "Revitalizar",
      "Quando este Ninja for colocado em jogo, se você controlar Sasuke Uchiha, compre 1 card.",
      "Enquanto você controlar Naruto Uzumaki, este Ninja ganha +2/+1.",
    ],
    flavor: "\"De novo não!\"",
  },
  "s27-n-1606": {
    text: [
      "[MARIONETE ARMADA]",
      "Quando você colocar em jogo um Ninja \"Marionete\", pode colocar um Marcador +1/+1 nesse Ninja.",
      "[Troca de Jutsu] (1): Remova um Marcador +1/+1 de um Ninja \"Marionete\" que você controla para ferir o Ninja alvo que enfrenta esse Ninja e tem Custo de Entrada igual ao desse Ninja \"Marionete\".",
    ],
    flavor: "\"Ah, olha. Outro pirralho.\"",
  },
  "s27-n-1607": {
    text: [
      "[RAJADA FURIOSA]",
      "Quando este Ninja for colocado em jogo, você pode descartar a Missão Permanente alvo.",
    ],
    flavor: "\"Hmm... bem legal!\"",
  },
  "s27-n-1608": {
    text: [
      "[SITUAÇÃO DE EMERGÊNCIA]",
      "No final do seu turno, se você tiver 1 Chakra ou menos, pode curar o Ninja alvo.",
    ],
    flavor: "\"Parem com isso.\"",
  },
  "s27-n-1609": {
    text: [
      "[DECISÃO CALCULADA]",
      "Revitalizar",
      "Quando este Ninja for colocado em jogo, você pode ver a mão de um jogador. Nesse caso, você pode escolher um card da mão desse jogador, movê-lo para o fundo do Deck dele e fazer esse jogador comprar 1 card.",
    ],
  },
  "s27-n-1610": {
    text: [
      "[ATITUDE OUSADA]",
      "Quando este Ninja Atacar sozinho, ele só pode ser enfrentado por um Time com 1 Ninja.",
    ],
    flavor: "\"Nada mal.\"",
  },
  "s27-n-1611": {
    text: [
      "[TRANSFERÊNCIA DE FORÇA]",
      "[Troca de Jutsu] (1), este Ninja recebe -2/-2 durante este turno: O Ninja alvo ganha +2/+2 durante este turno.",
    ],
  },
  "s27-n-1612": {
    text: [
      "[GRANDE CONQUISTA]",
      "Revitalizar",
      "Válido: Quando este Ninja sair de jogo, você pode colocar em jogo até 2 Ninjas \"Marionete\" da sua Pilha de Descartes com Custo de Entrada 2 ou menos.",
    ],
  },
  "s27-n-1613": {
    text: [
      "[PROTEÇÃO DA CONSELHEIRA]",
      "Revitalizar",
      "Válido: Quando um dos seus Ninjas for ser descartado por causa de Dano, você pode, em vez disso, descartar este Ninja.",
    ],
    flavor: "\"Você não consegue mais se mexer...\"",
  },
  "s27-n-1614": {
    text: [
      "[ESPECIALISTA MÉDICA]",
      "[Bloqueador | Missão] (Vento): Cure o Ninja alvo. Esse Ninja não pode ser enviado para a Batalha durante este turno.",
    ],
    flavor: "\"Isto é ruim...\"",
  },
  "s27-n-1615": {
    text: [
      "[CONTROLANDO OS SENTIDOS]",
      "No início do turno do oponente, você pode dizer Ninja, Jutsu ou Missão. Nesse caso, o oponente deve revelar da mão um card do tipo dito. Se ele não fizer isso, o oponente fere 1 Ninja que controla.",
    ],
    flavor: "\"E agora?\"",
  },
  "s27-n-1616": {
    text: [
      "[QUEBRANDO O SELO]",
      "[Válido | Troca de Jutsu] Fira 1 Ninja que você controla: Cure o Ninja alvo. Nesse caso, se esse Ninja estiver num Time no Campo de Batalha e o seu oponente o controlar, esse Ninja passa a ser um Ninja Reserva.",
    ],
  },
  "s27-n-1617": {
    text: [
      "[ARTES DE COSTURA]",
      "No início do seu turno, você pode remover do jogo 1 card de Ninja da sua Pilha de Descartes. Nesse caso, este Ninja ganha o texto de efeito desse Ninja durante este turno.",
    ],
    flavor: "\"Não tão rápido...\"",
  },
  "s27-n-1618": {
    name: "Naruto Uzumaki (Modo Sábio)",
    text: [
      "[HERÓI DA FOLHA]",
      "Senjutsu | Ponto Crítico",
      "Quando este Ninja for colocado em jogo, mude o Poder de até 3 Ninjas alvo para 0/0 e negue o texto de efeito deles durante este turno.",
    ],
  },
  "s27-n-1619": {
    name: "Pain (Caminho Deva)",
    text: [
      "[EM BUSCA DO PODER]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Troca de Jutsu] Recue o seu Marcador de Turnos em X: o Ninja adversário alvo com Custo de Entrada X passa a ser um Ninja Reserva.",
      "Válido: O seu Marcador de Turnos é considerado ao mesmo tempo ímpar e par.",
    ],
  },
  "s27-n-1620": {
    text: [
      "[O SÁBIO ORIGINAL]",
      "Válido: Enquanto você controlar 2 ou mais outros Ninjas com Senjutsu, este Ninja ganha +3/+3, Senjutsu e \"Sapo Ninja\".",
    ],
    flavor: "\"Claro, eu também não sou mais exatamente humano!!\"",
  },
  // ── JUTSU ──
  "s27-j-1000": {
    name: "Estilo Vento: Rasen Shuriken",
    text: [
      "Requerimentos: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Descarte o alvo.",
      "Especialista [Senjutsu]: Descarte 1 Ninja.",
    ],
    flavor: "\"O meu novo jutsu vai acabar com isso numa tacada só!!\"",
  },
  "s27-j-1001": {
    name: "A Mente de Pain",
    text: [
      "Requerimentos: \"Rinnegan\" + \"Ninjutsu\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Remova do jogo um card aleatório da mão do seu oponente. Se o Custo de Entrada desse card for maior ou igual ao do alvo, descarte o alvo. Se não, fira o alvo. No final deste turno, mova o card que foi removido do jogo para a mão do Dono Original dele.",
    ],
    flavor: "\"Não se mexa... ou esta mulher morre.\"",
  },
  "s27-j-972": {
    name: "Transferência de Mente, Jutsu Maldição da Marionete",
    text: [
      "Requerimentos: \"Mente\" + Custo de Entrada 3 ou mais",
      "Efeito: Se você não baixou um Ninja neste turno, procure no Deck do seu oponente um card de Ninja com Custo de Entrada igual ou menor que o do Usuário e mova-o para o Time do Usuário, em qualquer posição. O texto de efeito desse Ninja é negado durante este turno. Agora você controla esse Ninja.",
    ],
    flavor: "\"Você precisa vigiar o meu corpo.\"",
  },
  "s27-j-973": {
    name: "Ninjutsu de Barreira",
    text: [
      "Efeito: Diga um Símbolo. O Usuário não pode se tornar alvo de cards de Jutsu com o Símbolo dito durante este turno.",
    ],
    flavor: "\"Argh... Eu devia ter imaginado...\"",
  },
  "s27-j-974": {
    name: "Interrogatório",
    text: [
      "Alvo: Todos os Ninjas que enfrentam o Usuário",
      "Efeito: O alvo passa a ser um Ninja Reserva se o Poder Mental dele for menor que o do Usuário.",
    ],
    flavor: "\"Uaah! Eu também sou uma vítima!!\"",
  },
  "s27-j-975": {
    name: "Fome Avassaladora",
    text: [
      "Alvo: 1 Ninja \"Animal\"",
      "Efeito: Descarte o alvo e depois cure o Usuário.",
    ],
    flavor: "\"N-não, de jeito nenhum!!\"",
  },
  "s27-j-976": {
    text: [
      "Requerimentos: Sasuke Uchiha + Custo de Entrada 4 ou mais, ou Kakashi Hatake",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 2 Dano ao alvo. Se o alvo for descartado por este efeito, você pode comprar 1 card.",
    ],
  },
  "s27-j-977": {
    name: "Ameaçar",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O seu oponente escolhe e aplica 1 dos efeitos a seguir:",
      "1) O alvo passa a ser um Ninja 0/0 durante este turno.",
      "2) Descartar 1 card, e o oponente dele compra 1 card.",
    ],
    flavor: "\"Você não se importa com o que acontece com o seu pirralho?\"",
  },
  "s27-j-978": {
    name: "Deslocamento Instantâneo",
    text: [
      "Requerimentos: Madara Uchiha ou Tobi ou Homem Mascarado",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Remova o alvo e o Usuário do jogo. Depois, mova o Usuário para 1 dos seus Times no Campo de Batalha, em qualquer posição. Mova o alvo para a Vila do Dono Original dele e depois fira-o.",
    ],
    flavor: "\"Não há esperança para você!!\"",
  },
  "s27-j-979": {
    name: "Selo da Morte do Ceifador",
    text: [
      "Requerimentos: O 4º Hokage ou O 3º Hokage",
      "Efeito: Remova do jogo qualquer número de Ninjas que enfrentam o Usuário. Nesse caso, o seu oponente ganha 1 Prêmio de Batalha para cada Ninja removido dessa forma. Depois, remova o Usuário do jogo.",
    ],
    flavor: "\"Vamos acreditar nesta criança.\"",
  },
  "s27-j-980": {
    name: "Facada nas Costas",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se o alvo tiver o menor Custo de Entrada do Time dele, cause 1 Dano a ele. Se não, fira o alvo.",
    ],
  },
  "s27-j-981": {
    name: "Inversão de Papéis",
    text: [
      "Efeito: O Usuário pode usar qualquer card de Jutsu durante este turno, independentemente dos Requerimentos.",
    ],
    flavor: "\"Os nossos papéis poderiam ter sido invertidos.\"",
  },
  "s27-j-982": {
    name: "Lançamento de Lápis",
    text: [
      "Alvo: 1 Jutsu com 1 ou menos Símbolos Específicos no custo",
      "Efeito: Se o custo total do alvo for 2 ou menos, negue o alvo (Símbolos específicos contam como 1 para fins de custo total).",
    ],
    flavor: "\"Um lápis?!!\"",
  },
  "s27-j-983": {
    text: [
      "Enquanto este Jutsu estiver na Sequência, ele não pode ser alvo dos cards de Jutsu do seu oponente.",
      "Requerimentos: A ou Killer Bee",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Mova o alvo para a sua área de Prêmios de Batalha, com a face para baixo. Se Killer Bee e A estiverem no Time do Usuário, descarte cada um dos outros Ninjas do Time do alvo.",
    ],
    flavor: "\"DOUBLE LARIAT!!!\"",
  },
  "s27-j-984": {
    name: "Destravando o Selo",
    text: [
      "Efeito: O Usuário ganha +X/+X durante este turno. Depois, se X for 3 ou menos, o Usuário ganha o seguinte texto de efeito durante este turno: \"Válido: Quando este Ninja conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha\".",
    ],
    flavor: "\"Não tá vendo que eu tô de boca cheia?\"",
  },
  "s27-j-985": {
    name: "Kunai Especial",
    text: [
      "Efeito: Mova o Usuário para 1 dos seus Times no Campo de Batalha, em qualquer posição; depois, o Usuário ganha +2/+2 durante este turno.",
      "Especialista [O 4º Hokage]: Cause 1 Dano a 1 Ninja que enfrenta o Usuário.",
    ],
    flavor: "\"Não vou deixar você destruir este lugar!\"",
  },
  "s27-j-986": {
    text: [
      "Requerimentos: Naruto Uzumaki + Estado de Clone, Konohamaru + Estado de Clone, O 4º Hokage ou Jiraiya",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 2 Dano ao alvo. Se o alvo for descartado por este efeito, você pode mover até 2 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
  },
  "s27-j-987": {
    name: "Jutsu Dança do Tubarão na Prisão de Água",
    text: [
      "Requerimentos: Kisame Hoshigaki",
      "Efeito: Anexe este Jutsu ao Usuário. Enquanto este Jutsu estiver anexado, o Poder de todos os Ninjas que não sejam de Água no Time do Usuário e que enfrentam o Usuário é 0/0 e não pode ser alterado nem mudado.",
    ],
    flavor: "\"Você não pode escapar do suiton.\"",
  },
  "s27-j-988": {
    name: "Controle Esquelético",
    text: [
      "Requerimentos: Kimimaro",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Revele os 3 cards do topo do seu Deck. Se o Custo de Entrada total somado dos cards revelados for maior que o do alvo, descarte o alvo. Depois, mova os cards revelados para o topo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Sim... Isso mesmo.\"",
  },
  "s27-j-989": {
    name: "Jutsu de Invocação: Reanimação",
    text: [
      "Requerimentos: Orochimaru ou Kabuto Yakushi + Custo de Entrada 5 ou mais",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Descarte o alvo. Nesse caso, coloque em jogo 1 card de Ninja da Pilha de Descartes de qualquer jogador no Time do Usuário, em qualquer posição.",
    ],
    flavor: "Jutsu de Invocação: Reanimação.",
  },
  "s27-j-990": {
    name: "Jutsu Prisão de Água",
    text: [
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Poder do alvo é 0/0 e o texto de efeito dele é negado durante este turno.",
    ],
    flavor: "\"Esta água pesada...\"",
  },
  "s27-j-991": {
    name: "Apetite Voraz",
    text: [
      "Efeito: Escolha um número. Descarte todos os Chakras de todos os jogadores cujo Custo de Entrada seja igual ao número escolhido.",
    ],
    flavor: "\"Ele simplesmente não vai conseguir devorar tanto chakra...\"",
  },
  "s27-j-992": {
    name: "Disfarce Simples",
    text: [
      "Efeito: O Usuário não pode ser alvo de cards de Jutsu durante este turno.",
    ],
    flavor: "\"Ah, bem... parece que eles perceberam.\"",
  },
  "s27-j-993": {
    name: "Leque Gigantesco",
    text: [
      "Efeito: Todos os Ninjas do Time do Usuário e do Time que o enfrenta passam a ser Ninjas Reserva.",
    ],
  },
  "s27-j-994": {
    name: "Cura pelas Palmas",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Cure o alvo. Nesse caso, se o alvo estiver no Campo de Batalha, ele passa a ser um Ninja Reserva.",
      "Especialista [\"Médico\"]: Compre 1 card.",
    ],
    flavor: "\"Rápido, estanque o sangramento!\"",
  },
  "s27-j-995": {
    name: "Poder Fúngico",
    text: [
      "Alvo: 1 Ninja que você controla",
      "Efeito: O Usuário ganha +3/+0 durante este turno. No final do turno, coloque um Marcador -1/-1 no alvo.",
    ],
    flavor: "\"...?!!\"",
  },
  "s27-j-996": {
    name: "Pele de Tubarão",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: O Usuário ganha +4/+0 durante este turno.",
      "Especialista [Kisame Hoshigaki]: Descarte 2 Chakras do seu oponente.",
      "Especialista [Killer Bee]: Mova até 2 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Muito prazer, depois do fato.\"",
  },
  "s27-j-997": {
    name: "A Paixão da Juventude",
    text: [
      "Efeito: O Usuário ganha +2/+2 durante este turno. Depois, se o Usuário for um Ninja \"Genin\", ele ganha mais +2/+2 durante este turno.",
    ],
    flavor: "\"Lute comigo, Kakashi!\"",
  },
  "s27-j-998": {
    name: "Empurrão Onipotente",
    text: [
      "Se o Usuário deste Jutsu for Pain (Caminho Deva), reduza o custo deste Jutsu para (X).",
      "Requerimentos: \"Rinnegan\" + \"Ninjutsu\"",
      "Efeito: Aplique os efeitos a seguir conforme o seu Marcador de Turnos:",
      "Ímpar: X Ninjas no Campo de Batalha passam a ser Ninjas Reserva.",
      "Par: Mova X cards do topo e do fundo do seu Deck para a sua mão.",
    ],
    flavor: "\"Em-purrão Onipotente!\"",
  },
  "s27-j-999": {
    name: "Olhos do Sábio",
    text: [
      "Requerimentos: Senjutsu ou \"Sapo Ninja\"",
      "Efeito: O Usuário ganha +3/+3 durante este turno.",
      "Especialista [Naruto Uzumaki (Modo Sábio)]: 1 Ninja que enfrenta o Usuário recebe -3/-3 durante este turno. (Se o Usuário deste Jutsu for [X], aplique este efeito quando o Jutsu for resolvido.)",
    ],
  },
  // ── MISSÃO ──
  "s27-m-943": {
    name: "Reconstruindo a Vila",
    text: [
      "Efeito: Mova até 2 cards de Missão da sua Pilha de Descartes para a sua mão.",
    ],
  },
  "s27-m-944": {
    name: "Grande Elogio",
    text: [
      "Alvo: 1 Ninja que você controla",
      "Efeito: Veja os X cards do topo do seu Deck e depois mova 1 deles para a sua mão. Devolva o resto e embaralhe o seu Deck. X = o Custo de Entrada do alvo.",
    ],
    flavor: "\"Fica solitário quando você não está por perto.\"",
  },
  "s27-m-945": {
    name: "O Poder do Trio",
    text: [
      "Permanente (3)",
      "Efeito: Quando você colocar em jogo um Ninja \"Mente\", \"Sombra\" ou \"Comida\", você pode procurar no seu Deck um card de Ninja com qualquer uma dessas Características, revelar esse card de Ninja e movê-lo para a sua mão. Se fizer isso, embaralhe o seu Deck depois.",
    ],
  },
  "s27-m-946": {
    name: "Uma Pechincha Difícil",
    text: [
      "Efeito: Escolha e aplique 1 dos seguintes:",
      "1) O seu oponente descarta 1 card aleatório.",
      "2) Você compra 2 cards.",
    ],
    flavor: "\"Que tal este preço pelo maço?\"",
  },
  "s27-m-947": {
    name: "O Futuro Hokage?",
    text: [
      "Permanente",
      "Efeito: Quando um Ninja \"Satoosa\" que você controla for retirado de jogo, você pode procurar no seu Deck 1 card de Ninja \"Satoosa\", revelá-lo e movê-lo para a sua Vila. Depois, embaralhe o seu Deck.",
    ],
  },
  "s27-m-948": {
    name: "Selo Amaldiçoado Descontrolado",
    text: [
      "Permanente (3)",
      "Alvo: 1 Ninja",
      "Efeito: No início do turno do controlador do alvo, esse jogador pode descartar 2 Chakras. Nesse caso, o alvo ganha +3/+0 durante este turno. Se não, o alvo não pode ser enviado para a Batalha durante este turno.",
    ],
    flavor: "\"Finalmente eu entendo. Eu sou um vingador.\"",
  },
  "s27-m-949": {
    name: "O Caminho do Vingador",
    text: [
      "Anulação",
      "Alvo: 1 Ninja que o seu oponente controla",
      "Efeito: Remova do jogo X cards de Ninja da sua Pilha de Descartes, onde X = o Custo de Entrada do alvo. Nesse caso, descarte o alvo.",
    ],
    flavor: "\"Estou trilhando um caminho que o resto de vocês não pode seguir.\"",
  },
  "s27-m-950": {
    name: "A Sombra da Folha",
    text: [
      "Anulação",
      "Alvo: 1 Missão",
      "Efeito: Negue e descarte o alvo. Nesse caso, se você controlar Sasuke Uchiha com Custo de Entrada 4 ou mais, fira até 2 dos Ninjas do seu oponente.",
    ],
    flavor: "\"Você pode substituí-la. Isso vai dar muito certo.\"",
  },
  "s27-m-951": {
    name: "A Intervenção do Jonin",
    text: [
      "Permanente (2)",
      "Alvo: 1 card de Ninja \"Jonin\" na sua mão.",
      "Efeito: Quando esta Missão for colocada em jogo, coloque o alvo em jogo.",
      "Efeito: Quando esta Missão for retirada de jogo, descarte o alvo se ele ainda estiver em jogo.",
    ],
    flavor: "\"Como você caiu, Sasuke.\"",
  },
  "s27-m-952": {
    name: "Exaustão",
    text: [
      "Efeito: Os dois jogadores descartam os seus Chakras. Compre 1 card para cada jogador que descartou 3 ou mais Chakras por este efeito.",
    ],
  },
  "s27-m-953": {
    name: "O Agrado de um Mestre",
    text: [
      "Efeito: Embaralhe a sua Pilha de Descartes e depois coloque-a no topo do seu Deck.",
    ],
    flavor: "\"Para mim, o Sábio Tarado era insubstituível. Ele era da família.\"",
  },
  "s27-m-954": {
    name: "O Desastre da Raposa de Nove Caudas",
    text: [
      "Você pode descartar 2 cards de Raio em vez de pagar o Custo de Entrada deste card.",
      "Efeito: Fira todos os Ninjas.",
    ],
    flavor: "\"Raar!!\"",
  },
  "s27-m-955": {
    name: "O Amor de Pais",
    text: [
      "Permanente",
      "Alvo: (1) 1 Ninja que você controla (2) 1 Ninja que você controla, além do alvo (1)",
      "Efeito: Enquanto o alvo (1) continuar em jogo, o alvo (2) não pode ser retirado de jogo por causa de Dano.",
    ],
    flavor: "\"...Eu ainda... consigo...\"",
  },
  "s27-m-956": {
    name: "Destravando o Poder",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, compre 1 card.",
      "Efeito: Você pode carregar Chakra durante a Troca de Jutsu.",
    ],
    flavor: "\"Não adianta hesitar.\"",
  },
  "s27-m-957": {
    name: "O Mal Interior",
    text: [
      "Alvo: (1) 1 Ninja que você controla (2) 1 Ninja que o seu oponente controla com o mesmo nome do alvo (1).",
      "Efeito: Descarte os dois alvos.",
    ],
    flavor: "\"Eles não eram todos simplesmente nojentos...?\"",
  },
  "s27-m-958": {
    name: "A Fera sem Cauda",
    text: [
      "Permanente (3)",
      "Efeito: No início do turno de cada jogador, esse jogador descarta X Chakras. X = o número de marcadores nesta Missão.",
    ],
    flavor: "\"Lá vou eu!\"",
  },
  "s27-m-959": {
    name: "Um Novo Mestre",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: No início do seu turno, o jogador com mais Chakras passa a controlar o alvo.",
    ],
    flavor: "\"Qual é o problema?\"",
  },
  "s27-m-960": {
    name: "Aspirações Sombrias",
    text: [
      "Efeito: Os dois jogadores descartam a mão e depois movem até 2 cards da Pilha de Descartes deles para a mão.",
    ],
    flavor: "\"Hora de colocar o meu plano em ação.\"",
  },
  "s27-m-961": {
    name: "Aliança do Mal",
    text: [
      "Enquanto o seu oponente tiver 8 ou mais Chakras, este card de Missão ganha -2 de Custo de Entrada e -1 de Custo de Mão.",
      "Efeito: Descarte os Chakras de todos os jogadores.",
    ],
    flavor: "\"Vamos começar com os cumprimentos...\"",
  },
  "s27-m-962": {
    name: "Uma Demonstração de Poder",
    text: [
      "Efeito: O seu oponente causa 1 Dano a 1 Ninja que controla, descarta 1 card e descarta 2 dos Chakras dele.",
    ],
    flavor: "\"Esta apresentação é dedicada a você.\"",
  },
  "s27-m-963": {
    name: "Persuasão à Força",
    text: [
      "Efeito: Escolha um número, e o seu oponente revela a mão. Mova todos os cards com Custo de Entrada igual ao número escolhido para a área de Chakra do oponente.",
    ],
    flavor: "\"I-Isto é...\"",
  },
  "s27-m-964": {
    name: "As Lágrimas de Sakura",
    text: [
      "Efeito: Escolha um card de Missão na sua Pilha de Descartes e aplique o efeito dele (escolha os alvos antes de aplicar o efeito, se necessário). Depois, remova esta Missão do jogo.",
    ],
    flavor: "\"Eu vou dar um jeito de fazer isso acontecer, eu prometo!\"",
  },
  "s27-m-965": {
    name: "Companheiros Ociosos",
    text: [
      "Anulação",
      "Alvo: 1 Ninja",
      "Efeito: Remova o alvo do jogo. No final deste turno, mova o alvo para a Vila do Dono Original dele.",
    ],
    flavor: "\"Eles não vão se levantar tão cedo.\"",
  },
  "s27-m-966": {
    name: "O que Poderia Ter Sido",
    text: [
      "Permanente (2)",
      "Alvo: 1 Ninja que você controla",
      "Efeito: Remova do jogo 1 card de Ninja da sua Pilha de Descartes e depois escolha uma Característica do card de Ninja removido. O alvo ganha a Característica escolhida.",
    ],
    flavor: "\"Eu estive perigosamente perto de virar Hokage.\"",
  },
  "s27-m-967": {
    name: "Remendar",
    text: [
      "Efeito: Descarte um card de Missão ou de Ninja da sua mão e depois procure no seu Deck um card de Missão ou de Ninja com Custo de Entrada menor que o do card descartado, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
  },
  "s27-m-968": {
    name: "Colhendo Ervas",
    text: [
      "Efeito: Compre 1 card. Depois, o seu oponente pode comprar 1 card. Se ele fizer isso, compre 1 card.",
    ],
    flavor: "\"Ginseng Energético!\"",
  },
  "s27-m-969": {
    name: "Excluído",
    text: [
      "Efeito: Cada jogador escolhe um Ninja que controla. Depois, os jogadores trocam simultaneamente o controle desses Ninjas.",
    ],
    flavor: "\"Os aldeões rejeitavam o Mestre Bee repetidas vezes...\"",
  },
  "s27-m-970": {
    name: "A Reunião dos Senhores",
    text: [
      "Efeito: Revele os 5 cards do topo do seu Deck. Você pode mover 1 card de Ninja revelado para a sua mão. Depois, devolva o resto ao topo do seu Deck e embaralhe-o.",
    ],
    flavor: "\"Posso sugerir que decidam agora, nobres senhores...?\"",
  },
  "s27-m-971": {
    name: "Treino de Luta",
    text: [
      "Permanente (3)",
      "Efeito: No final do seu turno, se 1 ou mais dos seus Times conseguiram qualquer Vitória, compre 1 card.",
    ],
  },
  "s27-m-972": {
    name: "A Espiral da Dor",
    text: [
      "Permanente (2)",
      "Efeito: Quando o seu Marcador de Turnos for movido, você pode comprar 1 card.",
      "[Missão] Mova esta Missão para a sua área de Chakra: Ignore o Sacrifício do próximo Ninja de Vazio que você baixar durante este turno.",
    ],
    flavor: "\"Como você enfrentaria este ódio para criar a paz?\"",
  },
  "s27-m-973": {
    name: "Campo de Treino do Sábio",
    text: [
      "Efeito: Procure no seu Deck um card de Ninja Naruto Uzumaki, revele-o e depois mova-o para a sua mão. Depois, embaralhe o seu Deck. Se você controlar um Ninja com Senjutsu, compre 1 card.",
    ],
    flavor: "\"O teu treino começa agora.\"",
  },
  "s27-m-974": {
    name: "Batalha Exaustiva",
    text: [
      "Permanente (Quando você jogar esta Missão, ela continua em jogo.)",
      "Efeito: No final do seu turno, se você não tiver Chakras, pode comprar 1 card.",
    ],
    flavor: "\"Certo... Consegui.\"",
  },
  "s27-m-975": {
    name: "O Arauto de Pain",
    text: [
      "Efeito: Se você controlar apenas Ninjas \"Rinnegan\", \"Chuva\" e/ou \"Akatsuki\", mova 3 cards do fundo do seu Deck para a sua mão.",
    ],
    flavor: "\"A partir daqui, o mundo vai conhecer a dor...\"",
  },
  // ── CLIENTE ──
  "s27-c-060": {
    text: [
      "[Atacante | Missão] Recue o seu Marcador de Turnos em 1: Você pode baixar um Ninja de Vazio ignorando o Sacrifício dele.",
      "No final do seu turno, se o seu Marcador de Turnos for 0, você pode comprar 1 card.",
    ],
    flavor: "\"Muito bem... então eu declaro guerra a todos vocês... a quarta grande guerra ninja.\"",
  },
};
