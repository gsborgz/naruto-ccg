import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S29 — Shinobi's Dream, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s29-shinobis-dream.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 * Palavras-chave: Revitalize = Revitalizar; Inherit = Herança; Desperation = Desespero; Burst = Explosão;
 * Sensor = Sensor; Ascendant = Ascendente; Shield = Escudo; Evasive = Evasivo; Crush = Esmagar;
 * Infiltrate = Infiltrar; Masked = Mascarado; Companion = Companheiro.
 */
export const S29_SHINOBIS_DREAM_PTBR: CardTranslations = {
  // ── NINJA ──
  "s29-n-5000": {
    name: "O 2º Mizukage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Quando este Ninja for baixado, descarte a sua mão. Nesse caso, mova até 2 cards da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Claro, você quer tirar do caminho primeiro os oponentes mais fortes. Mas, não importa como você olhe, o mais forte aqui sou eu!\"",
  },
  "s29-n-5001": {
    name: "Choji Akimichi (Modo Borboleta)",
    text: [
      "[ASCENDIDO]",
      "Sacrifício: Choji Akimichi + \"Chunin\" ou Hierarquia superior",
      "Válido: Quando este Ninja for colocado em jogo, você pode causar 1 Dano ao Ninja alvo com Custo de Entrada menor que o seu Marcador de Turnos. Se o Custo de Entrada desse Ninja for 2 ou menos, em vez disso, cause 2 Dano a ele. Nesse caso, fira este Ninja no final deste turno.",
    ],
    flavor: "\"Eu, Choji Akimichi, como protetor dos clãs Yamanaka e Nara e como protetor da vila da Folha, agora deixo a crisálida como borboleta... e ascendo!\"",
  },
  "s29-n-5002": {
    name: "Cinco Tubarões Famintos",
    text: [
      "[INVOCAÇÃO DE ÁGUA]",
      "Não Único",
      "Quando este card de Ninja for descartado da sua mão, o seu oponente descarta 1 Chakra.",
      "Enquanto você controlar 3 ou mais Ninjas de Água, você pode baixar este card de Ninja da sua Pilha de Descartes.",
    ],
    flavor: "\"Jutsu de Invocação: Cinco Tubarões Famintos!\"",
  },
  "s29-n-5003": {
    text: [
      "[MESTRE DO SILÊNCIO]",
      "Sensor",
      "[Missão | Troca de Jutsu] Remova do jogo este card de Ninja que está na sua mão: Negue o efeito ativado alvo. Nesse caso, se o alvo foi ativado a partir da mão, remova esse card do jogo.",
    ],
  },
  "s29-n-5004": {
    text: [
      "[O CLÃ ABURAME]",
      "Este card de Ninja ganha -1 de Custo de Entrada para cada 2 Ninjas \"Inseto\" e/ou Inseto que você controla.",
      "[Válido | Atacante | Missão] Remova 1 marcador de um card: Coloque em jogo uma moeda de Ninja Inseto com o seguinte: [Poder: 0/0 (Saudável e Ferido) / Não Único]",
    ],
    flavor: "\"Nunca subestime o seu oponente... Por menor que ele pareça.",
  },
  "s29-n-5005": {
    text: [
      "[IMPASSE DE TRÊS LADOS]",
      "Herança",
      "Quando este Ninja Atacar sozinho, você pode pagar (2). Nesse caso, descarte 1 dos Ninjas do seu oponente que esteja sozinho num Time.",
    ],
    flavor: "\"Vou te mostrar o que é... o dever.\"",
  },
  "s29-n-5006": {
    text: [
      "[REFORÇO]",
      "Senjutsu | Sensor",
      "Enquanto este card estiver no seu Deck, ele é considerado como tendo \"Nome: Fukasaku\".",
      "Válido: Quando este Ninja for colocado em jogo, mova 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
    ],
    flavor: "\"Precisamos ganhar tempo para o menino Naruto, Mãe!\"",
  },
  "s29-n-5007": {
    text: [
      "[FORÇA POLICIAL DA FOLHA]",
      "Sensor",
      "[Válido | Troca de Jutsu] Remova do jogo 2 cards de Ninja \"Olho Sharingan\" da sua Pilha de Descartes: Mude o efeito do Jutsu alvo para o seguinte: \"Remova do jogo os 3 cards do topo do seu Deck para cada Ninja do Time do Usuário.\"",
    ],
    flavor: "\"Itachi... Prometa que vai cuidar do Sasuke.\"",
  },
  "s29-n-5008": {
    name: "Bandido (1)",
  },
  "s29-n-5009": {
    name: "Bandido (2)",
  },
  "s29-n-5010": {
    name: "Bandido (3)",
  },
  "s29-n-5011": {
    name: "Bandido (4)",
  },
  "s29-n-5012": {
    name: "Bandido (5)",
  },
  "s29-n-5013": {
    text: [
      "[PRESO AO DEVER]",
      "Explosão | Herança",
      "Válido: Enquanto ferido, se este Ninja for descartado e você controlar 3 ou mais Ninjas \"Taijutsu\", você pode causar 2 Dano ao Ninja adversário alvo. Se não, você pode causar 1 Dano ao alvo.",
    ],
    flavor: "\"Você vive apenas para proteger a Senhorita Hinata e preservar o poder da casa principal do nosso clã.\"",
  },
  "s29-n-5014": {
    text: [
      "[O MEU NINDO]",
      "Explosão | Herança",
      "Válido: Quando você aplicar o efeito de Explosão, pode comprar 1 card.",
    ],
    flavor: "\"Eu não vou voltar atrás na minha palavra... porque esse é o meu nindo. O meu jeito ninja...\"",
  },
  "s29-n-5015": {
    text: [
      "[DIAS DE FELICIDADE]",
      "Quando este Ninja for colocado em jogo, você pode colocar em jogo 1 card de Ninja Naruto Uzumaki com \"Juramento\" da sua mão.",
      "Enquanto este Ninja estiver no mesmo Time que outro Ninja \"Juramento\", todos os Ninjas \"Juramento\" ganham Evasivo.",
    ],
    flavor: "\"Irmão Neji... Eu vou me casar!\"",
  },
  "s29-n-5016": {
    text: [
      "[PELO CLÃ HYUGA]",
      "[Atacante | Missão] (0): Revele os 6 cards do topo do seu Deck. Se houver 1 ou mais cards de Ninja com \"Taijutsu\" e Custo de Entrada 1 ou menos, você pode descartar este Ninja. Nesse caso, coloque 1 deles em jogo e devolva o resto. Depois, embaralhe o seu Deck.",
    ],
  },
  "s29-n-5017": {
    text: [
      "[O ITACHI UCHIHA DE KONOHA]",
      "Sensor",
      "Enquanto você controlar 5 ou mais cards com \"Uchiha\" no nome, os Ninjas e Clientes que não tenham \"Uchiha\" no nome têm o texto de efeito negado.",
    ],
  },
  "s29-n-5018": {
    text: [
      "[NO LIMITE]",
      "Quando você descartar um card da sua mão por um efeito de card seu, você pode comprar 1 card.",
      "[Válido | Atacante | Missão] (Água), (Água), (Água): Descarte este Ninja. Nesse caso, coloque em jogo 1 card de Ninja Jugo (Estado 2) do seu Baralho de Reforço.",
    ],
  },
  "s29-n-5019": {
    name: "Jirobo (Estado 1)",
    text: [
      "[VONTADE FORTE]",
      "Quando este card de Ninja for descartado da sua mão, você pode colocá-lo em jogo.",
      "Quando este Ninja for colocado em jogo, você pode descartar 1 dos Chakras do seu oponente.",
    ],
    flavor: "\"Parece que deixaram o fracote sozinho.\"",
  },
  "s29-n-5020": {
    text: [
      "[INVOCAÇÃO DE SAPOS]",
      "Ascendente",
      "Quando este Ninja for baixado, você pode colocar em jogo 1 card de Ninja \"Sapo Ninja\" com o efeito [IMPASSE DE TRÊS LADOS] da sua Pilha de Descartes, área de Chakra ou área de Removidos do Jogo.",
    ],
  },
  "s29-n-5021": {
    name: "Jiraiya (Modo Sábio)",
    text: [
      "[O SÁBIO DOS SAPOS]",
      "Senjutsu | Escudo | Sensor",
      "Válido: Todos os números no texto de efeito e no alvo dos cards de Jutsu usados por este Ninja aumentam em 1.",
      "Este Ninja ganha Evasivo enquanto você controlar \"Fukasaku\" e \"Shima\".",
    ],
    flavor: "\"Lá vai...\"",
  },
  "s29-n-5022": {
    text: [
      "[ÓRFÃOS DE AME]",
      "Quando um Ninja de Vazio for Sacrificado, você pode colocar em jogo da sua mão 1 card de Ninja de Vazio com Custo de Entrada menor que o seu Marcador de Turnos.",
    ],
  },
  "s29-n-5023": {
    text: [
      "[PODER INESGOTÁVEL]",
      "Quando este card de Ninja for descartado da sua mão por um efeito, você pode movê-lo para a sua mão.",
      "O efeito de [PODER INESGOTÁVEL] só pode ser usado uma vez por turno.",
    ],
    flavor: "\"Não tenho interesse em lutar com você...\"",
  },
  "s29-n-5024": {
    name: "Kidomaru (Estado 2)",
    text: [
      "[FIM DE JOGO]",
      "Sacrifício: Kidomaru (Estado 1)",
      "Desespero",
      "[Troca de Jutsu] Descarte 2 cards de Água: Mova o card de Água alvo da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Fim de jogo...\"",
  },
  "s29-n-5025": {
    text: [
      "[IMPASSE DE TRÊS LADOS]",
      "[Válido | Troca de Jutsu] (Vento): Enquanto este Ninja estiver no Campo de Batalha, cure o Ninja alvo, e ele ganha Escudo durante o turno.",
    ],
    flavor: "\"Sim, senhora.\"",
  },
  "s29-n-5026": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Rastreamento | Sensor",
      "Quando este Ninja for baixado, você pode mover até 2 cards do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Quando você pega o ritmo, percebe como vencer.\"",
  },
  "s29-n-5027": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Mascarado (O Custo de Mão deste card pode ser pago com qualquer Símbolo.)",
      "Quando este Ninja for colocado em jogo, você pode mover 1 card em jogo que não seja de Ninja para a área de Chakra do Dono Original dele. Nesse caso, cause 1 Dano a 1 Ninja ferido ou fira 1 Ninja.",
    ],
    flavor: "\"Morrer você sempre pode. Viver é que exige coragem de verdade.\"",
  },
  "s29-n-5028": {
    text: [
      "[GOUKA MEKKYAKU / JUKAI KOTAN]",
      "Sacrifício: 1 Ninja",
      "[Troca de Jutsu] (Fogo), (Fogo), (Fogo): Cause 2 Dano ao Ninja adversário alvo. Nesse caso, cause 1 Dano a 1 Ninja adversário.",
      "[Troca de Jutsu] (Terra), (Terra): Todos os Ninjas do Time deste Ninja e do Time que o enfrenta passam a ser Ninjas Reserva.",
    ],
  },
  "s29-n-5029": {
    text: [
      "[O CLÃ ABURAME]",
      "Rastreamento | Sensor (O Time deste Ninja pode Bloquear Ninjas com Infiltrar. Nesse caso, ele ganha +1/+1 durante o turno.)",
      "Quando este Ninja for baixado, você pode procurar no seu Deck 1 card com \"Aburame\" no nome, revelá-lo e movê-lo para a sua mão.",
    ],
    flavor: "\"Zaji... afaste-se dele rápido.\"",
  },
  "s29-n-5030": {
    text: [
      "[GOLPE VELOZ]",
      "Quando este Ninja Atacar, você pode mover 1 card de Jutsu com \"Requerimentos: 'Samurai'\" da sua Pilha de Descartes para a sua mão.",
      "Os seus outros Ninjas \"Samurai\" ganham +1/+1.",
    ],
  },
  "s29-n-5031": {
    name: "Menma Uzumaki (Manto)",
    text: [
      "[BESTA NEGRA DE NOVE CAUDAS]",
      "Sacrifício: Menma Uzumaki",
      "Esmagar | Escudo",
      "Válido: Ganha o texto de efeito do Ninja Sacrificado.",
    ],
    flavor: "\"Preciso consertar o mal que há dentro de você...\"",
  },
  "s29-n-5032": {
    text: [
      "[HOMEM MASCARADO]",
      "Este Ninja pode se tornar o Usuário de cards de Jutsu com \"Naruto Uzumaki\" nos Requerimentos e pagar cada Símbolo específico dos custos deles com Chakras de Vento.",
    ],
    flavor: "\"Você é fraco e não pertence a este mundo.\"",
  },
  "s29-n-5033": {
    name: "Homem Mascarado",
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Desespero",
      "[Troca de Jutsu] (3): Enquanto você tiver 4 Ninjas Samurai, cause 2 Dano ao Ninja adversário alvo. Nesse caso, descarte este Ninja no final do turno.",
    ],
  },
  "s29-n-5034": {
    text: [
      "[IMPASSE DE TRÊS LADOS]",
      "Esmagar (Quando este Ninja conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha.)",
      "Quando este Ninja for colocado em jogo, você pode mover 1 dos Ninjas do seu oponente para o fundo do Deck do Dono Original dele.",
    ],
    flavor: "\"Ssssss...\"",
  },
  "s29-n-5035": {
    text: [
      "[COMPANHEIRO CONFIÁVEL]",
      "Sensor",
      "No final do seu turno, se 5 ou mais cards de Terra sem Revitalizar foram descartados do topo do seu Deck, você pode mover 1 desses cards para a sua mão.",
    ],
    flavor: "\"Mesmo que o meu inimigo seja muito mais forte... Mesmo que o meu corpo me falhe... Eu não posso perder!!!\"",
  },
  "s29-n-5036": {
    text: [
      "[ACREDITE EM MIM]",
      "Explosão | Ascendente",
      "[Válido | Atacante | Missão] (2): Descarte 1 dos Chakras do seu oponente e compre 1 card. Se você controlar 5 ou mais Ninjas \"Taijutsu\", em vez disso, descarte 2 dos Chakras do seu oponente e compre 2 cards.",
    ],
  },
  "s29-n-5037": {
    text: [
      "[DIAS DE JURAMENTOS]",
      "Quando este Ninja for colocado em jogo, você pode colocar em jogo 1 card de Ninja Hinata Hyuga com \"Juramento\" da sua mão.",
      "Enquanto este Ninja estiver no mesmo Time que outro Ninja \"Juramento\", se o Time deste Ninja conseguir uma Vitória, em vez disso, ela passa a ser uma Vitória Espetacular.",
    ],
    flavor: "\"Certo, pronta para ir?\"",
  },
  "s29-n-5038": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Sacrifício: Naruto Uzumaki + \"Samurai\"",
      "Infiltrar",
      "Quando este Ninja for colocado em jogo, mova até 3 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"No mundo das velhas memórias, há espaço para visitantes.\"",
  },
  "s29-n-5039": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "[Válido | Atacante | Missão] Descarte os 3 cards do topo do seu Deck: Se 1 ou mais cards de Ninja \"Samurai\" foram descartados dessa forma, coloque um Marcador +1/+1 em 1 dos seus outros Ninjas \"Samurai\".",
    ],
  },
  "s29-n-5040": {
    text: [
      "[DIGNIDADE E VALOR]",
      "Este Ninja não é afetado pelos efeitos de Ninja e de Missão do seu oponente.",
      "[Válido | Bloqueador | Missão] (2): Se você controlar mais Ninjas saudáveis que Ninjas feridos, compre 2 cards e depois compre 1 card. Se não, só Times com 1 ou mais Ninjas feridos podem ser enviados para a Batalha durante este turno.",
      "Válido: Enquanto ferido, este Ninja ganha Evasivo.",
    ],
    flavor: "\"Eu ainda vou ser Hokage, pode acreditar!\" \"Naruto, esse seu sonho impossível... Eu não quero ver ele destruído!\"",
  },
  "s29-n-5041": {
    text: [
      "[COMBINAÇÃO]",
      "Senjutsu",
      "Válido: Todos os seus cards de Ninja \"Sapo Ninja\" ganham -3 de Custo de Entrada.",
      "Válido: Todos os seus outros Ninjas \"Sapo Ninja\" ganham +2/+2.",
    ],
    flavor: "\"Certo, vão ser medidas um tanto duras, mas vamos tentar.\" \"Isso vai ser moleza... pode acreditar!\"",
  },
  "s29-n-5042": {
    text: [
      "[INVOCAÇÃO DE COBRAS]",
      "Ascendente",
      "Quando este Ninja for baixado, você pode colocar em jogo 1 card de Ninja \"Cobra\" com o efeito [IMPASSE DE TRÊS LADOS] da sua Pilha de Descartes, área de Chakra ou área de Removidos do Jogo.",
    ],
  },
  "s29-n-5043": {
    text: [
      "[MESTRE DO IAIDO]",
      "Os efeitos dos seus outros Ninjas \"Samurai\" são Válidos.",
      "Os seus outros Ninjas \"Samurai\" ganham +1/+1.",
    ],
    flavor: "\"Eu escolho ser... ser...\"",
  },
  "s29-n-5044": {
    text: [
      "[FORÇA POLICIAL DA FOLHA]",
      "Quando este Ninja for baixado, você pode descartar 1 card de Fogo. Nesse caso, procure no seu Deck 1 card de Missão de Fogo que tenha \"Clã\" no nome, revele-o e mova-o para a sua mão.",
    ],
    flavor: "\"Não vai ser inútil...\"",
  },
  "s29-n-5045": {
    text: [
      "[PRESENÇA QUE SE DISSOLVE]",
      "Explosão",
      "[Atacante | Missão] (Raio): Aplique a Explosão do Ninja alvo.",
      "Válido: Quando o card do topo do seu Deck for removido, se ele estava revelado, você pode revelar o card seguinte até o final deste turno.",
    ],
    flavor: "\"Técnica de Disfarce de Chakra!\"",
  },
  "s29-n-5046": {
    text: [
      "[ESPÍRITO FORTE]",
      "Explosão",
      "[Atacante | Missão] (2): Se o card do topo do seu Deck for um card de Ninja \"Taijutsu\" com a face para cima, mova-o para a sua mão.",
      "Válido: Quando este Ninja Atacar, cada jogador joga com o card do topo do Deck revelado durante este turno.",
    ],
    flavor: "\"Eu... também fiquei forte!\"",
  },
  "s29-n-5047": {
    name: "Sasuke Uchiha (Infância)",
    text: [
      "[MEMÓRIA]",
      "Herança",
      "Válido: No final do turno, se este Ninja tiver \"Olho Sharingan\" e Custo de Entrada 2 ou mais, descarte os 2 cards do topo do Deck de um jogador ou coloque um Marcador -1/-1 num Ninja.",
    ],
    flavor: "\"Irmão... por que você sempre me trata como um estorvo?\"",
  },
  "s29-n-5047b": {
    name: "Sasuke Uchiha (Infância)",
    text: [
      "[MEMÓRIA]",
      "Herança",
      "Válido: No final do turno, se este Ninja tiver \"Olho Sharingan\" e Custo de Entrada 2 ou mais, descarte os 2 cards do topo do Deck de um jogador ou coloque um Marcador -1/-1 num Ninja.",
    ],
    flavor: "\"Irmão... aqui está o seu presente.\"",
  },
  "s29-n-5048": {
    text: [
      "[FIOS DE CHAKRA]",
      "Quando este Ninja for baixado, você pode mover para a sua Vila o Ninja alvo com Custo de Entrada 2 ou menos. Depois, esse Ninja ganha \"Marionete\".",
      "[Troca de Jutsu] (0): Mova o Ninja \"Marionete\" alvo que você controla para um Time, em qualquer posição.",
    ],
  },
  "s29-n-5049": {
    text: [
      "[FORÇA POLICIAL DA FOLHA]",
      "Esmagar (Quando este Ninja conseguir qualquer Vitória, você ganha 1 Prêmio de Batalha.)",
      "Enquanto você controlar 4 ou mais cards com \"Uchiha\" no nome, este Ninja ganha Evasivo.",
    ],
    flavor: "\"O que você acabou fazendo foi dar poder a tolos. Entregar-se a comportamentos idiotas... Nada de bom sai disso.\"",
  },
  "s29-n-5050": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Quando este Ninja Bloquear, você pode comprar 1 card.",
    ],
    flavor: "\"As novas eras não surgem por causa das espadas; elas são criadas pelas pessoas que as empunham.\"",
  },
  "s29-n-5051": {
    text: [
      "[O CLÃ ABURAME]",
      "Rastreamento | Sensor (O Time deste Ninja pode Bloquear Ninjas com Infiltrar. Nesse caso, ele ganha +1/+1 durante o turno.)",
      "Válido: Você pode ter até 3 nomes de Ninja Rastreados ao mesmo tempo. Quando este Ninja for retirado de jogo, aplique o efeito de Rastreamento.",
    ],
    flavor: "\"...\"",
  },
  "s29-n-5052": {
    text: [
      "[OLHO DA FOLHA]",
      "Sensor",
      "[Válido | Troca de Jutsu] (Fogo): Fira o Ninja adversário alvo. No início do Showdown, cure o alvo.",
      "Todos os seus cards de Ninja \"Anbu\" ganham -1 de Custo de Entrada.",
    ],
    flavor: "\"...Você é o meu melhor amigo e o único com quem eu posso contar. Proteja a vila... e o nome Uchiha.\"",
  },
  "s29-n-5053": {
    text: [
      "[DOIS ASES]",
      "Rastreamento | Sensor",
      "Quando este Ninja for colocado em jogo, você pode mover 1 card de Missão Inseto Gigante Parasita da sua Pilha de Descartes ou área de Chakra para a sua mão.",
      "Válido: Todos os cards de Missão Inseto Gigante Parasita na sua mão ganham -1 de Custo de Mão.",
    ],
    flavor: "\"Veja, ter um ás na manga é bom... Dois ases é melhor.\"",
  },
  "s29-n-5054": {
    text: [
      "[O CAMINHO DO SAMURAI]",
      "Herança",
      "Válido: Quando este Ninja for descartado, você pode descartar 1 dos Ninjas do seu oponente com Custo de Entrada 3 ou menos. Se um Ninja \"Samurai\" ganhar este efeito por Herança, ele também ganha Companheiro.",
    ],
  },
  "s29-n-5055": {
    text: [
      "[SENTIDO AGUÇADO]",
      "[Atacante | Missão] Mova 1 card do topo do Deck do seu oponente para a área de Chakra dele: Se o seu oponente tiver 4 ou mais Chakras, este Ninja ganha +0/+2 durante este turno.",
    ],
    flavor: "\" Fique sabendo que eu treinei com o grande professor Ebisu \"",
  },
  "s29-n-5056": {
    text: [
      "[SENTIDO AGUÇADO]",
      "Desespero",
      "[Atacante | Missão] (Água), mova 1 card do topo do Deck do seu oponente para a área de Chakra dele: Se o seu oponente tiver 5 ou mais Chakras, negue os textos de efeito do Ninja ou do Cliente alvo durante este turno.",
    ],
    flavor: "\" Eu vou proteger você \"",
  },
  "s29-n-5057": {
    name: "O Primeiro Hokage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Desespero | Senjutsu",
      "[Atacante | Missão] (3): Mova o card alvo da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Nós temos que lutar com você...\"",
  },
  "s29-n-5058": {
    text: [
      "[MESTRA DA INVOCAÇÃO DE ARMAS]",
      "Revitalizar",
      "[Troca de Jutsu] (X): Enquanto este Ninja estiver no Campo de Batalha, mova da sua Pilha de Descartes para a sua mão o card de Jutsu alvo com custo X que não tenha Símbolos específicos.",
    ],
    flavor: "\"Quero ser uma ninja grande e poderosa. Seguir os passos da kunoichi lendária, Tsunade!\"",
  },
  "s29-n-5059": {
    name: "Tayuya (Estado 1)",
    text: [
      "[SOM AMALDIÇOADO]",
      "[Atacante | Missão] (Água): Aplique 1 dos efeitos a seguir conforme o número de Chakras do seu oponente.",
      "5+) O seu oponente descarta 2 Chakras.",
      "0) Mova 2 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
  },
  "s29-n-5060": {
    text: [
      "[O CLÃ ABURAME]",
      "Sensor (O Time deste Ninja pode Bloquear Ninjas com Infiltrar. Nesse caso, este Ninja ganha +1/+1 durante o turno.)",
      "Todos os seus outros Ninjas \"Inseto\" e Ninjas Inseto ganham +1/+1.",
    ],
    flavor: "\"Acho que seria mais fácil um ladrão entrar no Orfanato.\"",
  },
  "s29-n-5061": {
    name: "O Segundo Hokage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Válido: Quando este Ninja se tornar o Usuário de um Jutsu de Água, reduza o custo dele em (Água), se possível.",
      "Quando este Ninja for colocado em jogo, se você tiver 3 cards ou menos na mão, compre card(s) até ficar com 4 cards na mão.",
    ],
    flavor: "\"Pronto, está decidido: achei um idiota ainda maior que o meu irmão.\"",
  },
  "s29-n-5062": {
    name: "O Terceiro Hokage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Atacante | Missão] Descarte 7 cards do topo do seu Deck: Cause 1 Dano ao Ninja adversário alvo. Você pode usar este efeito quantas vezes quiser.",
    ],
    flavor: "\"Bem, então...\"",
  },
  "s29-n-5063": {
    text: [
      "[LIMPEZA]",
      "[Missão | Troca de Jutsu] (1): Enquanto este Ninja tiver 2 ou menos Moedas Misteriosas, você pode remover do jogo 3 cards da Pilha de Descartes de um jogador. Nesse caso, coloque uma Moeda Misteriosa neste Ninja.",
      "Válido: Enquanto este Ninja tiver 3 ou mais Moedas Misteriosas, ele ganha \"Árvore\".",
    ],
  },
  "s29-n-5064": {
    text: [
      "[LANÇA DE ORIGAMI]",
      "Quando você for comprar qualquer card por causa de um Ninja, pode comprar 1 card adicional. Nesse caso, mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
      "[Válido | Troca de Jutsu] Descarte 1 card: Fira o Ninja adversário alvo, e ele passa a ser 0/0 durante o turno.",
    ],
  },
  "s29-n-5065": {
    text: [
      "[MESTRE DO IAIDO]",
      "O texto de efeito dos seus outros Ninjas \"Samurai\" não pode ser negado.",
      "Os seus outros Ninjas \"Samurai\" ganham +1/+1.",
    ],
    flavor: "\"...Sim, General.\"",
  },
  "s29-n-5066": {
    text: [
      "[INVOCAÇÃO DE LESMAS]",
      "Ascendente",
      "Quando este Ninja for baixado, você pode colocar em jogo 1 card de Ninja \"Lesma\" com o efeito [IMPASSE DE TRÊS LADOS] da sua Pilha de Descartes, área de Chakra ou área de Removidos do Jogo.",
    ],
  },
  "s29-n-5067": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Atacante | Missão] Descarte 1 dos seus Ninjas \"Inseto\" ou Inseto: Coloque um Marcador de Veneno no Ninja alvo. Se o Custo de Entrada do alvo for 2 ou menos, fira-o.",
    ],
    flavor: "\"Esses insetos de novo...\"",
  },
  "s29-n-5068": {
    name: "Tartaruga Ninja",
    text: [
      "[UMA ÚLTIMA LIÇÃO]",
      "Válido: Os seus outros Ninjas \"Taijutsu\" ganham +1/+1.",
      "Válido: Todos os seus Ninjas \"Taijutsu\" ganham \"Surto\".",
    ],
    flavor: "\"Eu ia dizer que é bom te ver... mas, sério, no meio do ar!?\"",
  },
  "s29-n-5069": {
    text: [
      "[CLÃ SENJU]",
      "Quando este Ninja for enviado para Atacar, você pode descartar 1 card. Nesse caso, mova até 2 cards de Água da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Os adultos são idiotas. Eles precisam se sentar juntos e chegar a uma trégua.\"",
  },
  // ── JUTSU ──
  "s29-j-5000": {
    name: "Estilo Terra: Queda de Lama",
    text: [
      "Requerimentos: Terra ou \"Anbu\"",
      "Alvo: 1 Ninja adversário ou 2 Ninjas Reserva",
      "Efeito: O alvo passa a ser um Ninja Reserva. Depois, coloque um Marcador Grudento no alvo. Os Ninjas com 1 ou mais Marcadores Grudentos devem ser organizados no mesmo Time, se possível. Times com 4 ou mais Ninjas com 1 ou mais Marcadores Grudentos não podem ser enviados para a batalha.",
    ],
    flavor: "\"Estilo Terra: Jutsu Queda de Lama!\"",
  },
  "s29-j-5001": {
    name: "Inseto Explosivo",
    text: [
      "Requerimentos: \"Inseto\"",
      "Alvo: 1 Ninja adversário",
      "Efeito: Descarte 1 dos seus Ninjas Inseto. Nesse caso, descarte o alvo.",
    ],
    flavor: "\"Quando encontra um hospedeiro, ele absorve chakra e cresce até inevitavelmente explodir.\"",
  },
  "s29-j-5002": {
    name: "Clarão",
    text: [
      "Requerimentos: \"Samurai\"",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Fira o alvo ou cause X Dano a ele, onde X = o número de cards de Jutsu com \"Requerimentos: 'Samurai'\" na sua Pilha de Descartes.",
    ],
    flavor: "\"Impostores!\"",
  },
  "s29-j-5003": {
    name: "Estilo Fogo: Cinzas Ardentes",
    text: [
      "Se o Usuário deste card de Jutsu for Asuma Sarutobi ou Konohamaru, você pode, em vez disso, pagar o custo dele com Chakras que compartilhem um Símbolo com o Usuário.",
      "Requerimentos: Fogo + Custo de Entrada 3 ou mais, ou Asuma Sarutobi, ou Konohamaru + \"Estado de Clone\"",
      "Alvo: 1 Ninja adversário",
      "Efeito: Remova o alvo do jogo.",
    ],
    flavor: "\"Eu aprendi essa com o meu tio Asuma!\"",
  },
  "s29-j-5004": {
    name: "Corte do Deus do Trovão Voador",
    text: [
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja adversário",
      "Efeito: Fira o alvo. Depois, você pode descartar 1 card. Nesse caso, cause 1 Dano ao alvo.",
      "Especialista [O Segundo Hokage]: Mude o alvo para \"1 Ninja no Campo de Batalha\".",
    ],
    flavor: "\"Corte do Deus do Trovão Voador!\"",
  },
  "s29-j-5005": {
    name: "Lâmina de Assalto",
    text: [
      "Requerimentos: Ninja sem texto de efeito",
      "Alvo: 1 Ninja adversário",
      "Efeito: Cause 1 Dano ao alvo. Se você controlar 3 ou mais Ninjas sem texto de efeito, o alvo passa a ser um Ninja Reserva.",
    ],
    flavor: "\"É isso. Por favor, morra.\"",
  },
  "s29-j-5006": {
    name: "Estilo Fogo: Grande Aniquilação de Fogo",
    text: [
      "Requerimentos: Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja adversário",
      "Efeito: Cause 2 Dano ao alvo.",
      "Especialista [Madara Uchiha]: Cause 1 Dano a todos os Ninjas que enfrentam o Usuário.",
    ],
    flavor: "\"Estilo Fogo: Grande Aniquilação de Fogo!\"",
  },
  "s29-j-5007": {
    text: [
      "Requerimentos: \"Samurai\"",
      "Alvo: 1 Jutsu",
      "Efeito: Negue o alvo.",
      "Especialista [Mifune]: O Poder do Usuário do alvo passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Sem os seus selos de mão, o seu Jutsu é inútil contra mim.",
  },
  "s29-j-5008": {
    name: "Deus Dragão da Folha",
    text: [
      "Requerimentos: \"Taijutsu\" + Explosão",
      "Alvo: 1 Ninja adversário",
      "Efeito: Cause 1 Dano ao alvo. Enquanto você controlar 4 ou mais Ninjas \"Taijutsu\", em vez disso, cause 2 Dano.",
    ],
    flavor: "\"Desista de ser Ninja!\"",
  },
  "s29-j-5009": {
    name: "Genjutsu Miragem",
    text: [
      "Requerimentos: Água",
      "Alvo: Usuário",
      "Efeito: O alvo ganha Evasivo até o final do turno.",
      "Especialista [The Second Mizukage]: Descarte 1 card. Nesse caso, mova este card de Jutsu para a sua mão.",
    ],
    flavor: "\"Por favor, escute com atenção.\"",
  },
  "s29-j-5010": {
    text: [
      "Requerimentos: \"Olho Sharingan\" + \"Anbu\" ou Hierarquia superior",
      "Alvo: 1 Ninja adversário",
      "Efeito: Mova o alvo para a sua Vila como um card que não é de Ninja, anexado ao Usuário. Enquanto esse card estiver em jogo, o Usuário ganha o texto de efeito dele. Quando ele for retirado de jogo, devolva-o à Vila do Dono Original dele.",
    ],
    flavor: "\"O meu amigo deu a vida para me salvar. Junto com as lágrimas de sangue dele, nasceu o mangekyo.\"",
  },
  "s29-j-5011": {
    name: "Modo Chakra da Nove Caudas",
    text: [
      "Este Jutsu custa 1 a menos para cada um dos seus Ninjas sem texto de efeito.",
      "Requerimentos: Ninja sem texto de efeito",
      "Efeito: Carregue 1 card. Nesse caso, compre 2 cards.",
    ],
    flavor: "\"É isso. Por favor, morra.\"",
  },
  "s29-j-5012": {
    name: "Punho Silencioso",
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Alvo: 1 Ninja adversário",
      "Efeito: O alvo passa a ser um Ninja Reserva e não pode ser enviado para a Batalha durante o próximo turno.",
    ],
    flavor: "\"Usando um chakra que só pode ser dominado pelo taijutsu, ele se cobriu com o mesmo tipo de penas.\"",
  },
  "s29-j-5013": {
    name: "Movimento Secreto Negro: Donzela de Ferro",
    text: [
      "Requerimentos: \"Mestre de Marionetes\" ou Kankuro + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja adversário",
      "Efeito: Remova o alvo do jogo. No final da Troca de Jutsu, o seu oponente joga a Moeda Ninja. Se der cara, mova o alvo para a Vila do Dono Original dele, com o texto de efeito negado durante o turno.",
    ],
    flavor: "\"Hmm... Estilo Raio...\"",
  },
  "s29-j-5014": {
    name: "Etiqueta de Selamento",
    text: [
      "Efeito: Se o custo maior deste Jutsu foi pago, negue e descarte 1 Jutsu. Se não, descarte 1 dos cards em jogo do seu oponente que não seja de Ninja.",
    ],
    flavor: "\"Isto pode combinar bem com você.\"",
  },
  "s29-j-5015": {
    name: "Espada do Sapo",
    text: [
      "Requerimentos: \"Sapo Ninja\"",
      "Alvo: 1 Ninja adversário",
      "Efeito: Fira o alvo.",
      "Especialista [Custo de Entrada 5 ou mais]: Cause 1 Dano ao alvo.",
    ],
    flavor: "\"Cuidado com as costas, Naruto!\"",
  },
  "s29-j-5016": {
    name: "Liberação de Vento: Esfera de Vento Espiral",
    text: [
      "Requerimentos: Vento + Custo de Entrada 2 ou mais",
      "Alvo: 1 Ninja adversário",
      "Efeito: Jogue a Moeda Ninja. Se der cara, mova o alvo para o topo do Deck do Dono Original dele. Se der coroa, mova o alvo para a mão do Dono Original dele e compre 1 card.",
    ],
    flavor: "\"Isto pode combinar bem com você.\"",
  },
  "s29-j-5017": {
    name: "Estilo Água: Ondas Furiosas",
    text: [
      "Enquanto você não tiver cards na mão, este card de Jutsu pode ser jogado da sua área de Chakra. Nesse caso, depois que o efeito deste Jutsu for aplicado, em vez disso, mova este card para o fundo do seu Deck.",
      "Requerimentos: Água",
      "Efeito: Cure o Usuário e depois o Usuário ganha +2/+2 durante este turno.",
    ],
    flavor: "\"Estilo Água: Ondas Furiosas!\"",
  },
  "s29-j-5018": {
    name: "Pistola de Água: Disparo Duplo",
    text: [
      "Requerimentos: Água + Custo de Entrada 2 ou mais",
      "Alvo: 1 Ninja adversário",
      "Efeito: Você pode pagar (2) para ferir o alvo. Depois, cause 1 Dano ao alvo.",
      "Especialista [Suigetsu Hozuki, Mangetsu Hozuki ou The Second Mizukage]: Mova este Jutsu para a sua mão.",
    ],
    flavor: "\"Sai da frente, Karin... ou não.\"",
  },
  // ── MISSÃO ──
  "s29-m-5000": {
    name: "Uma Nova Chegada",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja que compartilhe um Símbolo com o card usado para pagar o Custo de Mão deste card e tenha Custo de Entrada menor ou igual ao seu Marcador de Turnos. Depois, revele-o e mova-o para a sua mão. Nesse caso, compre 1 card se você procurou um Ninja sem Símbolo de Raio.",
    ],
    flavor: "\"Uau... esse é mesmo o Naruto?\"",
  },
  "s29-m-5001": {
    name: "Sempre Atrasado",
    text: [
      "Efeito: Revele os 5 cards do topo do seu Deck. O seu oponente escolhe 2 dos cards de Raio revelados dessa forma. Mova 1 desses cards para a sua mão. Depois, mova o resto dos cards revelados para o fundo do seu Deck, em qualquer ordem.",
    ],
    flavor: "\"Desculpem... Eu me atrasei.\"",
  },
  "s29-m-5002": {
    name: "Comandante da Quarta Divisão",
    text: [
      "Permanente",
      "Efeito: Quando você baixar um Ninja, aplique 1 dos efeitos a seguir conforme a Vila dele:",
      "Areia) Compre 1 card. Depois, mova 1 card da sua mão para o topo do seu Deck.",
      "Folha) Os seus Ninjas ganham +1/+1 durante este turno.",
      "Névoa) Descarte 1 dos Chakras do seu oponente.",
      "Nuvem) Mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
      "Pedra) Coloque um Marcador -1/-1 num Ninja.",
    ],
    flavor: "\"Esperem o meu sinal...\"",
  },
  "s29-m-5003": {
    name: "Artesanato",
    text: [
      "Efeito: Descarte 1 card de Ninja \"Marionete\" da sua mão. Nesse caso, compre 3 cards.",
    ],
    flavor: "\"Ele passava todo o tempo aperfeiçoando o seu ofício.\"",
  },
  "s29-m-5004": {
    name: "Laço Amaldiçoado",
    text: [
      "Efeito: Compre 2 cards e depois descarte 1 card. Nesse caso, compre 1 card.",
    ],
    flavor: "\"Talvez, se fundirmos as células do Jugo, a gente consiga salvá-lo.\"",
  },
  "s29-m-5005": {
    name: "Liberação do Edo Tensei",
    text: [
      "Anulação Permanente (3)",
      "Alvo: 1 Ninja",
      "Efeito: Negue o texto de efeito do alvo. Quando o seu oponente colocar um Ninja em jogo sem ser baixando-o, você pode comprar 1 card. Nesse caso, negue o texto de efeito desta Missão durante o turno.",
    ],
    flavor: "\"Parece que está na hora de ir.\"",
  },
  "s29-m-5006": {
    name: "Mundo das Gangues",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja ou card de Cliente \"Ladrão\" e mova-o para a sua mão.",
    ],
    flavor: "\"Nós só fazemos o que é melhor para nós.\"",
  },
  "s29-m-5007": {
    name: "Matando o Tempo",
    text: [
      "Efeito: Os dois jogadores podem carregar todos os cards, menos 1. Depois, cada jogador aplica os efeitos a seguir conforme o número de cards que carregou:",
      "1+) Compre 4 cards.",
      "2+) Mova 1 card da sua área de Chakra para a sua mão.",
    ],
    flavor: "\"Que tal matarmos o tempo enquanto os dois irmãos terminam...\"",
  },
  "s29-m-5008": {
    name: "Lembrança",
    text: [
      "Efeito: Compre 2 cards. Depois, se você controlar 2 ou mais Ninjas \"Inseto\", coloque em jogo 2 moedas de Ninja Inseto com o seguinte: \"[Poder: 0/0 (Saudável e Ferido) / Não Único]\".",
    ],
    flavor: "\"Você era como um irmão mais velho para mim. Eu queria uma lembrança sua, então cuidei e criei esses besouros venenosos.\"",
  },
  "s29-m-5009": {
    name: "Violência dos Amassos",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Coloque X Marcadores +1/+1 no alvo, onde X = o número de cards na sua Pilha de Descartes que tenham \"Amassos\" no nome. Se 2 ou mais desses cards tiverem nomes diferentes, compre 2 cards.",
    ],
    flavor: "\"MINHA NOSSA...\"",
  },
  "s29-m-5010": {
    name: "O Símbolo do Clã Orgulhoso",
    text: [
      "Permanente",
      "Efeito: Os seus Ninjas com \"Uchiha\" no nome ganham +1/+1. Além disso, os seus cards de Ninja com \"Uchiha\" no nome ganham -1 de Custo de Entrada. Este efeito não pode ser duplicado.",
    ],
    flavor: "\"Os Uchiha são shinobi fortes e orgulhosos.\"",
  },
  "s29-m-5011": {
    name: "Perseverança",
    text: [
      "Efeito: Procure no seu Deck 1 card de Ninja \"Taijutsu\".",
    ],
    flavor: "\"Já que nós dois buscamos dominar o taijutsu, por favor, lute comigo!\" \"Para ser sincero, eu queria lutar com você.\"",
  },
  "s29-m-5012": {
    name: "Inseto Gigante Parasita",
    text: [
      "Efeito: Coloque este card de Missão na sua Vila como um Ninja Inseto com o seguinte:",
      "\"[Poder 5/0 (Saudável e Ferido) / Custo de Entrada: 0 / Guardião / Não Único] [Válido: Quando este Ninja for retirado de jogo, você pode colocar em jogo 2 moedas de Ninja Inseto com o seguinte: \"[Poder: 0/0 (Saudável e Ferido) / Não Único]\"]\". Este efeito não pode ser duplicado.",
    ],
    flavor: "\"Vamos enfrentá-los com força total!\"",
  },
  "s29-m-5013": {
    name: "Gás Paralisante",
    text: [
      "Permanente (3)",
      "Efeito: Os Ninjas não podem ser curados.",
      "[Atacante | Missão] Fira 1 Ninja que você controla: O seu oponente fere 1 Ninja que controla.",
    ],
    flavor: "\"Esta máscara também me protege.  Mesmo com a minha resistência, eu não sairia ileso.\"",
  },
  "s29-m-5014": {
    name: "Samurais de Guarda",
    text: [
      "Efeito: Compre 1 card. Depois, se você pagou o Custo de Mão deste card com um card de Ninja \"Samurai\", compre 2 cards.",
    ],
    flavor: "\"O lugar está vigiado por todos os ângulos... Jugo, use os pássaros para achar uma brecha.\"",
  },
  "s29-m-5015": {
    name: "A Decisão de Shikaku",
    text: [
      "Efeito: Os seus Times com 3 ou mais de Poder Mental só podem ser bloqueados por Times com 3 ou mais de Poder Mental durante este turno.",
    ],
    flavor: "\"Não temos outra escolha, precisamos fazer isso pelos nossos filhos.\"",
  },
  "s29-m-5016": {
    name: "Divisão Sensora",
    text: [
      "Anulação Permanente (2)",
      "Efeito: Os jogadores não podem descartar cards da mão por efeitos de cards.",
    ],
    flavor: "\"Há uma enorme responsabilidade sobre os nossos ombros, porque somos os olhos das Forças Shinobi Aliadas!\"",
  },
  "s29-m-5017": {
    name: "Escória",
    text: [
      "Enquanto o seu oponente tiver 5 ou mais Prêmios de Batalha, este card de Missão ganha -1 de Custo de Mão.",
      "Efeito: Mova 2 cards do fundo do seu Deck para a sua mão. Depois, carregue 1 card. Se você carregou um card que não seja de Ninja por este efeito, coloque um Marcador -1/-1 em 1 Ninja.",
    ],
    flavor: "\"Neste mundo, quem quebra as regras é escória!\"",
  },
  "s29-m-5018": {
    name: "Time 1984",
    text: [
      "Anulação",
      "Efeito: Compre 2 cards. Depois, os dois jogadores podem apertar as mãos. Nesse caso, os dois jogadores compram 2 cards.",
    ],
    flavor: "\"Parabéns a Jared, Cody e Ethan pela vitória no Torneio 3v3.\"",
  },
  "s29-m-5019": {
    name: "O Retorno de um Demônio",
    text: [
      "Enquanto este card estiver na sua área de Chakra, todos os seus cards de Ninja \"Névoa\" ganham \"Emboscada\". Este card não pode ser procurado enquanto estiver no seu Deck.",
      "Alvo: 1 Ninja de Água + \"Chunin\" ou Hierarquia superior que você controla",
      "Efeito: Mova o alvo e 1 dos cards em jogo do seu oponente para a área de Chakra do Dono Original deles.",
    ],
    flavor: "\"Eu sabia que teria que lutar, mas não imaginei que seria contra você, Kakashi!\"",
  },
  "s29-m-5020": {
    name: "Visitando o Túmulo",
    text: [
      "Revitalizar",
      "Efeito: Embaralhe 5 cards da sua Pilha de Descartes no seu Deck. Nesse caso, se esses cards eram do mesmo tipo, compre 2 cards. Se não, compre 1 card.",
    ],
    flavor: "\"Deposite as flores no túmulo do seu pai.\"",
  },
  "s29-m-5021": {
    name: "Encrenqueiro",
    text: [
      "Efeito: Mova até 2 cards da sua área de Removidos do Jogo para a sua mão.",
    ],
    flavor: "\"Retire o que disse, Naruto!\"",
  },
  // ── CLIENTE ──
  "s29-c-5000": {
    text: [
      "Efeito: Quando você for Sacrificar este Cliente por um card de Ninja com Custo de Entrada 3 ou menos, em vez disso, mova este card para a sua mão.",
    ],
    flavor: "\"Se eu tiver que me sacrificar pela paz, que assim seja.\"",
  },
  "s29-c-5001": {
    text: [
      "Efeito: No início do seu turno, se você não tiver cards na mão, compre 1 card.",
      "No final do seu turno, se você tiver 8 ou mais Chakras, pode comprar 1 card.",
    ],
    flavor: "\"Eu só faço o que é certo para a minha Nação.\"",
  },
  "s29-c-5002": {
    name: "Haku (Garota)",
    text: [
      "Efeito: Quando este Cliente for colocado em jogo, jogue a Moeda Ninja; se der cara, você pode baixar 1 Ninja adicional durante o turno.",
    ],
    flavor: "\"Você tem alguém precioso para você?\"",
  },
  "s29-c-5003": {
    text: [
      "Quando você baixar um Ninja, se esse Ninja tiver \"Uchiha\" no nome, compre 1 card. Depois, você pode colocar um Marcador -1/-1 num Ninja ou descartar os 2 cards do topo do Deck de um jogador.",
    ],
    flavor: "\"Sempre foi o sonho dele se tornar Hokage.\"",
  },
  "s29-c-5004": {
    text: [
      "Efeito: Quando este Cliente for colocado em jogo, compre 1 card.",
      "Quando você colocar em jogo um Ninja \"Feminino\" sem ser baixando-o, pode comprar 1 card.",
    ],
    flavor: "\"Você não pode apagar o passado, mas pode ajudar a criar o futuro!\"",
  },
  "s29-c-5005": {
    name: "Líder dos Ladrões",
    text: [
      "[Atacante | Missão] Revele o card do topo do seu Deck: Se o card revelado tiver Símbolo de Terra ou de Fogo, coloque-o na sua mão. Nesse caso, descarte 1 card da sua mão. Se não, devolva-o ao topo do seu Deck.",
    ],
    flavor: "\"Se você me ajudar, vai ganhar muito dinheiro.\"",
  },
  "s29-c-5006": {
    name: "Ladrão",
    text: [
      "Quando você comprar qualquer card fora da sua Fase de Compra, pode carregar 1 card. Nesse caso, compre 1 card.",
    ],
    flavor: "\"O chefe disse que você quer nos ajudar.\"",
  },
  "s29-c-5007": {
    text: [
      "Efeito: Os cards na sua área de Chakra não podem ser afetados pelos efeitos dos cards de Ninja ou de Missão do seu oponente.",
    ],
    flavor: "\"Que desperdício... Eu estava com vontade de cortar alguma coisa.\"",
  },
};
