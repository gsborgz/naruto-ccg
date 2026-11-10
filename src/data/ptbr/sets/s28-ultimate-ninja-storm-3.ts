import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S28 — Ultimate Ninja Storm 3, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s28-ultimate-ninja-storm-3.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Blocker | Mission | EOJ]` viram `[Válido | Atacante | Bloqueador | Missão | Troca de Jutsu]`.
 * Palavras-chave: Revitalize = Revitalizar; Desperation = Desespero; Burst = Explosão; Flashpoint = Ponto Crítico.
 */
export const S28_ULTIMATE_NINJA_STORM_3_PTBR: CardTranslations = {
  // ── NINJA ──
  "s28-n-1621": {
    text: [
      "[FUTURO LÍDER DO CLÃ]",
      "Revitalizar",
      "Válido: Quando o seu oponente ganhar qualquer Prêmio de Batalha, coloque essa quantidade de Marcadores +1/+1 neste Ninja.",
    ],
    flavor: "\"Estou com medo.\"",
  },
  "s28-n-1622": {
    text: [
      "[ACUIDADE MENTAL]",
      "[Atacante | Missão] Remova um marcador de um card que você controla: Coloque um Marcador +1/+1 no Ninja alvo que não seja esse card, ou um marcador na Missão alvo que você controla que não seja esse card. Depois, se o alvo tiver 3 ou mais marcadores, compre 1 card e descarte 1 card.",
    ],
    flavor: "\"É melhor vocês, meninos, não amarelarem.\"",
  },
  "s28-n-1623": {
    text: [
      "[RECUPERAÇÃO]",
      "Revitalizar",
      "Quando este Ninja for baixado, você pode descartar 1 card de Terra da sua mão. Nesse caso, mova 1 card de Missão Permanente da sua área de Chakra para a sua mão.",
    ],
    flavor: "\"Mais reforços!\"",
  },
  "s28-n-1624": {
    text: [
      "[FORÇA ASSISTIDA]",
      "Explosão",
      "Válido: Quando você colocar em jogo este Ninja ou outro Ninja \"Taijutsu\", coloque um Marcador +1/+1 nele.",
    ],
    flavor: "\"Você está bem?!\"",
  },
  "s28-n-1625": {
    text: [
      "[RACIOCÍNIO DEDUTIVO]",
      "Durante o Showdown, enquanto este Ninja for enfrentado, se você controlar 2 ou mais Missões Permanentes, o Time deste Ninja e o Time adversário fazem uma Batalha Mental.",
    ],
    flavor: "\"Que chato.\"",
  },
  "s28-n-1626": {
    name: "Duas Caudas",
    text: [
      "[FERA FELINA]",
      "Enquanto o seu oponente não tiver cards na mão, este card de Ninja ganha -5 de Custo de Entrada.",
      "Quando este Ninja for colocado em jogo sem ser baixado, você pode mover 1 card da sua Pilha de Descartes para a sua mão.",
    ],
  },
  "s28-n-1627": {
    text: [
      "[PONTO FRACO NA ARMADURA]",
      "Explosão",
      "Válido: Os Marcadores +1/+1 nos Ninjas que você controla dão +1/+0 adicional.",
    ],
    flavor: "\"É... desculpa.\"",
  },
  "s28-n-1628": {
    text: [
      "[COLADO]",
      "Válido: Quando um marcador for removido de uma Missão Permanente que você controla, você pode colocar um Marcador +1/+1 neste Ninja.",
    ],
    flavor: "\"Uhuu!\"",
  },
  "s28-n-1629": {
    text: [
      "[CARTA CORINGA]",
      "[Válido | Missão] Remova X marcadores de Missões e/ou Ninjas que você controla: Negue e descarte a Missão alvo com Custo de Entrada X ou menos.",
    ],
    flavor: "\"Você está sendo tolo!\"",
  },
  "s28-n-1630": {
    name: "O 3º Tsuchikage",
    text: [
      "[OS DOIS PRATOS DA BALANÇA]",
      "Revitalizar",
      "[Válido | Missão] Remova 1 marcador de uma Missão que você controla: Coloque um Marcador -1/-1 no Ninja alvo e depois retire esse Ninja do Time dele.",
    ],
    flavor: "\"Eu vou!!\"",
  },
  "s28-n-1631": {
    name: "Kakashi Hatake (Garoto)",
    text: [
      "[INFÂNCIA]",
      "[Válido | Atacante | Missão] Mova este Ninja para a área de Chakra do Dono Original dele: Se o seu Marcador de Turnos for 4 ou mais, você pode colocar em jogo 1 card de Ninja Kakashi Hatake da sua mão e depois colocar um Marcador +1/+1 nesse Ninja.",
    ],
    flavor: "\"Você está atrasado...\"",
  },
  "s28-n-1632": {
    text: [
      "[CHAMANDO A ATENÇÃO]",
      "Quando este Ninja Atacar, se o oponente controlar 2 ou mais Times, este Ninja deve ser Bloqueado durante este turno.",
    ],
    flavor: "\"Vou fazer o meu nome nesta guerra.\"",
  },
  "s28-n-1633": {
    text: [
      "[CORAÇÃO DO TIME]",
      "Desespero",
      "[Válido | Troca de Jutsu] (1): O Ninja Líder alvo que enfrenta este Ninja recebe -X/-0 durante este turno. X = o número de Símbolos do alvo.",
    ],
    flavor: "\"Não vai ser inútil...\"",
  },
  "s28-n-1634": {
    name: "Quatro Caudas",
    text: [
      "[FERA MACACO]",
      "Enquanto o seu oponente controlar 2 ou mais Ninjas feridos, este card de Ninja ganha -6 de Custo de Entrada.",
      "Quando este Ninja for colocado em jogo sem ser baixado, o seu oponente descarta 1 Ninja ferido que controla.",
    ],
  },
  "s28-n-1635": {
    text: [
      "[COMANDANTE DAS FORÇAS SHINOBI ALIADAS]",
      "[Atacante | Missão] (2): Coloque em jogo da sua mão 1 card de Ninja que não seja de Vazio com Custo de Entrada 2 ou menos. No final deste turno, se esse Ninja estiver em jogo, descarte-o.",
    ],
    flavor: "\"A maré virou.\"",
  },
  "s28-n-1636": {
    text: [
      "[ESCURIDÃO INTERIOR]",
      "Válido: O custo dos cards de Jutsu de Fogo usados por este Ninja é reduzido em (Fogo).",
      "Todos os números no texto de efeito dos cards de Jutsu de Fogo usados por este Ninja aumentam em 1.",
    ],
  },
  "s28-n-1637": {
    text: [
      "[IDEAIS RADICAIS]",
      "Desespero",
      "[Atacante | Missão] (Fogo|Fogo): Mova 1 card de Ninja da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"Perfeito...\"",
  },
  "s28-n-1638": {
    text: [
      "[PLANOS BEM TRAÇADOS]",
      "Desespero",
      "[Troca de Jutsu] Dê 1 Prêmio de Batalha ao seu oponente: Remova o Ninja alvo do jogo. No final deste turno, coloque esse Ninja de volta em jogo e depois fira-o.",
    ],
  },
  "s28-n-1639": {
    text: [
      "[FLORESCENDO DUAS VEZES]",
      "Explosão | Ponto Crítico",
      "Quando este Ninja for colocado em jogo, o Ninja alvo que não seja este Ninja ganha +2/+2 durante este turno.",
    ],
    flavor: "\"Não tenha medo.\"",
  },
  "s28-n-1640": {
    text: [
      "[APOIO SUPREMO]",
      "Explosão | Ponto Crítico",
      "Quando este Ninja for colocado em jogo, você pode curar o Ninja ferido alvo.",
    ],
    flavor: "\"Suspiro... guerra, hein.\"",
  },
  "s28-n-1641": {
    text: [
      "[TREINO COM A BESTA COM CAUDAS]",
      "Explosão",
      "Válido: Quando você aplicar o efeito de Explosão, pode mover 1 card da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"O mundo virou de cabeça para baixo de novo.\"",
  },
  "s28-n-1642": {
    text: [
      "[IMAGINAÇÃO]",
      "Ponto Crítico",
      "Quando você colocar em jogo este Ninja ou um Ninja \"Tinta\", pode mover o card do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Pode tentar.\"",
  },
  "s28-n-1643": {
    text: [
      "[UMA NOVA ARMA]",
      "Válido: Quando este Ninja Atacar, você pode descartar 1 dos Chakras do seu oponente. Nesse caso, este Ninja ganha +X/+0 durante este turno, onde X = o número de Símbolos do Chakra descartado.",
    ],
    flavor: "\"Se estiver pronto, me dá o sinal!\"",
  },
  "s28-n-1644": {
    text: [
      "[COMANDANTE DAS FORÇAS SHINOBI ALIADAS]",
      "Válido: O primeiro card de Jutsu que o seu oponente jogar a cada turno custa (X) a mais para jogar, onde X = o número de Símbolos desse card de Jutsu.",
    ],
    flavor: "\"Ah-haha. Desculpa.\"",
  },
  "s28-n-1645": {
    name: "O 4º Raikage",
    text: [
      "[AÇÃO RÁPIDA]",
      "Quando este Ninja for colocado em jogo, você pode ferir 1 Ninja cujo Combate seja menor que o deste Ninja.",
    ],
    flavor: "\"Tenha um pouco de respeito!\"",
  },
  "s28-n-1646": {
    name: "Naruto Uzumaki (Manto de 9 Caudas)",
    text: [
      "[PODER RECÉM-DESCOBERTO]",
      "Válido: Quando este Ninja for baixado, cause 1 Dano a todos os outros Ninjas. Depois, você ganha 1 Prêmio de Batalha para cada Ninja do seu oponente descartado por este efeito.",
    ],
  },
  "s28-n-1647": {
    text: [
      "[MANTENDO O EXÉRCITO]",
      "Válido: Este Ninja ganha +1 de Custo de Entrada para cada card de Ninja [REENCARNAÇÃO IMPURA] na sua Pilha de Descartes.",
      "Válido: Você pode ignorar os custos de Sacrifício dos seus cards de Ninja [REENCARNAÇÃO IMPURA].",
    ],
    flavor: "\"E se eu disser não...?\"",
  },
  "s28-n-1648": {
    name: "Três Caudas",
    text: [
      "[FERA TARTARUGA]",
      "Enquanto o seu oponente tiver 8 ou mais Chakras, este card de Ninja ganha -6 de Custo de Entrada.",
      "Quando este Ninja for colocado em jogo sem ser baixado, descarte os Chakras do seu oponente.",
    ],
  },
  "s28-n-1649": {
    text: [
      "[ESPADACHIM DA NÉVOA]",
      "Quando este Ninja for baixado, coloque 2 Marcadores +1/+1 nele.",
      "[Troca de Jutsu] Remova 1 Marcador +1/+1 deste Ninja: Este Ninja ganha +2/+2 durante este turno.",
    ],
    flavor: "\"S-sim, senhora!\"",
  },
  "s28-n-1650": {
    text: [
      "[DRENANDO A FORÇA]",
      "Enquanto um jogador não tiver Chakras, os Ninjas que esse jogador controla não podem ser curados.",
      "Quando este Ninja for bloqueado, se o seu oponente não tiver Chakras, você pode ferir o Ninja Líder alvo que enfrenta este Ninja.",
    ],
    flavor: "\"O que quer dizer que você e eu somos os dois depravados.\"",
  },
  "s28-n-1651": {
    text: [
      "[TRAÇO ROUBADO]",
      "Válido: Os Ninjas que não sejam de Água e que enfrentam este Ninja têm o texto de efeito negado.",
    ],
    flavor: "\"Quem são esses dois?!\"",
  },
  "s28-n-1652": {
    name: "Cinco Caudas",
    text: [
      "[FERA GOLFINHO]",
      "Enquanto o seu oponente tiver 7 ou mais Prêmios de Batalha, este card de Ninja ganha -7 de Custo de Entrada.",
      "Válido: O Time deste Ninja pode bloquear qualquer número de Times.",
    ],
  },
  "s28-n-1653": {
    name: "O 5º Mizukage",
    text: [
      "[NÉVOA CONTROLADA]",
      "No início do turno do seu oponente, se ele controlar mais Ninjas que você, ele descarta 1 Ninja que controla.",
    ],
    flavor: "\"Diga para eles se apressarem também!\"",
  },
  "s28-n-1654": {
    text: [
      "[INSETOS DA DESTRUIÇÃO]",
      "Revitalizar",
      "Quando este card for movido para o fundo do seu Deck, coloque na sua Vila uma moeda de Inseto 0/0 com Não Único.",
    ],
    flavor: "\"É preciso evitar comportamentos chamativos.\"",
  },
  "s28-n-1655": {
    text: [
      "[DIAGNÓSTICO PRÉVIO]",
      "[Missão] Mova 1 card de Ninja da Pilha de Descartes ou da área de Chakra de qualquer jogador para o fundo do Deck dele: Fira ou cure o Ninja alvo com o mesmo nome do card movido.",
    ],
  },
  "s28-n-1656": {
    text: [
      "[CAPITÃO DA UNIDADE DE ASSALTO]",
      "[Troca de Jutsu] (Vento), revele este card da sua mão: Se você controlar menos Ninjas que o seu oponente, coloque este card de Ninja em 1 dos seus Times no Campo de Batalha, em qualquer posição. No final deste turno, se este Ninja estiver em jogo, mova-o para a mão do Dono Original dele.",
    ],
    flavor: "\"Recuamos ao meu sinal, entendido?\"",
  },
  "s28-n-1657": {
    name: "Seis Caudas",
    text: [
      "[FERA LESMA]",
      "Enquanto o seu oponente controlar 2 ou mais Ninjas com 2 ou mais Símbolos, este card de Ninja ganha -7 de Custo de Entrada.",
      "Quando este Ninja for colocado em jogo sem ser baixado, o Ninja alvo não pode ser enviado para a Batalha durante este turno.",
    ],
  },
  "s28-n-1658": {
    name: "Sete Caudas",
    text: [
      "[FERA INSETO]",
      "Enquanto o seu oponente controlar 5 ou mais Times, este card de Ninja ganha -8 de Custo de Entrada.",
      "Válido: Os Ninjas que o seu oponente controla com Custo de Entrada 2 ou menos têm o texto de efeito negado.",
    ],
  },
  "s28-n-1659": {
    text: [
      "[FORÇA DO VENDAVAL]",
      "Quando este Ninja for baixado, o seu oponente revela a mão. Você pode remover do jogo 1 card de Missão não Permanente revelado dessa forma e descartar 1 card de Vento da sua mão. Nesse caso, aplique o efeito desse card de Missão.",
    ],
    flavor: "\"O que está acontecendo?\"",
  },
  "s28-n-1660": {
    name: "O 5º Kazekage",
    text: [
      "[COMANDANTE SUPREMO]",
      "Se você controlar outro Ninja \"Areia\", este Ninja ganha +1/+0 e o custo dos cards de Jutsu usados por este Ninja é reduzido em (Vento). O mesmo vale para \"Folha\", \"Nuvem\", \"Pedra\" e \"Névoa\".",
    ],
    flavor: "\"Não precisava se levantar.\"",
  },
  "s28-n-1661": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Quando este Ninja for baixado, você pode remover do jogo 1 card de Ninja Haku da Pilha de Descartes de qualquer jogador. Nesse caso, você pode baixar 1 Ninja adicional durante este turno.",
    ],
    flavor: "\"Por favor, deixe-os comigo.\"",
  },
  "s28-n-1662": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Seis Caudas da sua mão.",
    ],
  },
  "s28-n-1663": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Sete Caudas da sua mão.",
    ],
  },
  "s28-n-1664": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Jinin Akebino da Pilha de Descartes de qualquer jogador: O Ninja adversário alvo recebe -4/-4 durante este turno. Se esse Ninja for um Ninja \"Arma\", cause 1 Dano a ele.",
    ],
    flavor: "\"A lâmina cega, Kabutowari, a Racha-Elmos, e o seu portador...\"",
  },
  "s28-n-1665": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Jinpachi Munashi da Pilha de Descartes de qualquer jogador: No início do Showdown, se o Ninja alvo que enfrenta este Ninja não usou um Jutsu durante este turno, cause 1 Dano a ele.",
    ],
    flavor: "\"A lâmina explosiva, Shibuki, a Respingo, e o seu portador...\"",
  },
  "s28-n-1666": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Ameyuri Ringo da Pilha de Descartes de qualquer jogador: Fira o Ninja Líder alvo que enfrenta este Ninja. Cada Ninja de Apoio que enfrenta este Ninja recebe -3/-3 durante este turno.",
    ],
    flavor: "\"As lâminas relâmpago, Kiba, a Presa, e a sua portadora...\"",
  },
  "s28-n-1667": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Kushimaru Kuriarare da Pilha de Descartes de qualquer jogador: Mova o Ninja alvo que o seu oponente controla para o Time que enfrenta este Ninja, em qualquer posição, e depois cause 1 Dano a ele.",
    ],
    flavor: "\"A espada longa, Nuibari, a Agulha de Costura, e o seu portador...\"",
  },
  "s28-n-1668": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Atacante | Missão | Troca de Jutsu] (0): Este Ninja ganha o texto de efeito de 1 card de Ninja \"Arma\" da sua Pilha de Descartes durante este turno.",
    ],
  },
  "s28-n-1669": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Válido: Quando este Ninja Atacar, se estiver ferido, você pode remover do jogo 1 card de Ninja Zabuza Momochi da Pilha de Descartes de qualquer jogador. Nesse caso, cure este Ninja, e este Ninja ganha +3/+0 durante este turno.",
    ],
    flavor: "\"Cale a boca...\"",
  },
  "s28-n-1670": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Atacante | Missão] Remova do jogo 1 card de Ninja Fuguki Suikazan da Pilha de Descartes de qualquer jogador: Se o seu oponente não tiver Chakras, ele descarta 1 Ninja que controla.",
    ],
    flavor: "\"Um antigo portador da grande lâmina Samehada, a Pele de Tubarão...\"",
  },
  "s28-n-1671": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Válido: Enquanto este Ninja tiver 1 ou mais Marcadores +1/+1, ele ganha \"Besta com Caudas\".",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Kinkaku da Pilha de Descartes de qualquer jogador: Fira o Ninja alvo que enfrenta este Ninja e depois coloque 2 Marcadores +1/+1 neste Ninja.",
    ],
    flavor: "\"Vamos nessa, Ginkaku.\"",
  },
  "s28-n-1672": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Válido: Enquanto este Ninja tiver 1 ou mais Marcadores +1/+1, ele ganha \"Besta com Caudas\".",
      "[Válido | Troca de Jutsu] Remova do jogo 1 card de Ninja Ginkaku da Pilha de Descartes de qualquer jogador: Fira o Ninja alvo que enfrenta este Ninja e depois coloque 2 Marcadores +1/+1 neste Ninja.",
    ],
    flavor: "\"Pode deixar, Kinkaku!\"",
  },
  "s28-n-1673": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Quando este Ninja for baixado, você pode remover do jogo 1 card de Ninja Asuma Sarutobi da Pilha de Descartes de qualquer jogador. Nesse caso, procure no seu Deck até 2 cards de Ninja [REENCARNAÇÃO IMPURA] e mova-os para a sua Pilha de Descartes. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Acabem comigo!!\"",
  },
  "s28-n-1674": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Duas Caudas da sua mão.",
    ],
  },
  "s28-n-1675": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Cinco Caudas da sua mão.",
    ],
  },
  "s28-n-1676": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Quatro Caudas da sua mão.",
    ],
  },
  "s28-n-1677": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Troca de Jutsu] Remova do jogo 1 card de Ninja Itachi Uchiha da Pilha de Descartes de qualquer jogador: O Ninja alvo que enfrenta este Ninja passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Eu achava que sabia mais que você.\"",
  },
  "s28-n-1678": {
    text: [
      "[MESTRE DO IAIDO]",
      "Válido: Os Ninjas que enfrentam este Ninja não podem usar cards de Jutsu e têm o texto de efeito negado.",
    ],
  },
  "s28-n-1679": {
    name: "O 2º Tsuchikage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Este Ninja não pode ser bloqueado por um Time que inclua um Ninja com Custo de Entrada menor que o deste Ninja.",
    ],
    flavor: "\"Eu o louvo, seja você quem for...\"",
  },
  "s28-n-1680": {
    name: "O 3º Raikage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "Válido: Este Ninja não pode receber Dano nem ser retirado de jogo por causa de Dano.",
      "Válido: Quando um Jutsu que este Ninja estiver usando for negado, se este Ninja estiver ferido, descarte-o.",
    ],
    flavor: "\"Eu teria gostado de lutar com todos vocês.\"",
  },
  "s28-n-1681": {
    name: "O 4º Kazekage",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Atacante | Missão] (X): Negue o Jutsu alvo, a menos que o Dono Original dele descarte X Chakras.",
    ],
    flavor: "\"Eu sou o Quarto Kazekage.\"",
  },
  "s28-n-1682": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Válido | Atacante | Missão] Descarte este Ninja: Coloque em jogo 1 card de Ninja Três Caudas da sua mão.",
    ],
  },
  "s28-n-1683": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "No início do seu turno, você pode remover do jogo 1 card de Ninja Nagato da Pilha de Descartes de qualquer jogador. Nesse caso, o seu oponente organiza os Times dele até haver apenas 1 Ninja em cada Time.",
    ],
  },
  "s28-n-1684": {
    name: "Hanzo, a Salamandra",
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Troca de Jutsu] Remova do jogo X cards de Ninja Hanzo das Pilhas de Descartes de qualquer jogador: Cause X Dano a cada Ninja que enfrenta este Ninja e depois descarte este Ninja.",
    ],
    flavor: "\"Já cansei de você!\"",
  },
  "s28-n-1685": {
    text: [
      "[REENCARNAÇÃO IMPURA]",
      "Sacrifício: 1 Ninja",
      "[Troca de Jutsu] Remova do jogo 1 card de Ninja Madara Uchiha da Pilha de Descartes de qualquer jogador: Distribua 2 Dano entre até 2 Ninjas alvo.",
    ],
  },
  // ── JUTSU ──
  "s28-j-1002": {
    name: "Técnica do Golem",
    text: [
      "Requerimentos: \"Pedra\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O Poder do alvo passa a ser o valor impresso e não pode ser mudado durante este turno. Depois, se o alvo estiver Saudável, fira-o.",
    ],
  },
  "s28-j-1003": {
    name: "Estilo Lava: Jutsu Solidificação de Cal Viva",
    text: [
      "Requerimentos: Kurotsuchi",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O alvo recebe -5/-5 durante este turno. Se o custo maior deste Jutsu foi pago, descarte o alvo, e todos os outros Ninjas do Time do alvo recebem -5/-5 durante este turno.",
    ],
  },
  "s28-j-1004": {
    name: "Estilo Partícula: Desmantelamento Atômico",
    text: [
      "Requerimentos: \"Pedra\" + \"Satoosa\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: O oponente descarta o alvo e descarta X cards da mão. Depois, você compra X cards, onde X = o número de Símbolos do alvo.",
    ],
  },
  "s28-j-1005": {
    name: "8 Trigramas 64 Palmas",
    text: [
      "Requerimentos: \"Byakugan\"",
      "Alvo: Todos os Ninjas que enfrentam o Usuário",
      "Efeito: Jogue a Moeda Ninja até tirar coroa. Depois, distribua X Dano entre os alvos, onde X = o número de caras tiradas por este efeito, mais 1.",
    ],
  },
  "s28-j-1006": {
    name: "Tigela de Fogo do Gato",
    text: [
      "Requerimentos: Duas Caudas",
      "Alvo: 2 Ninjas que enfrentam o Usuário",
      "Efeito: O seu oponente descarta 1 dos alvos e move o outro para a mão dele.",
    ],
  },
  "s28-j-1007": {
    name: "Céu Despedaçado",
    text: [
      "Requerimentos: Madara Uchiha + Custo de Entrada 7 ou mais",
      "Efeito: Descarte todos os Ninjas, exceto o Usuário, e depois mova o Usuário para a mão do Dono Original dele.",
    ],
  },
  "s28-j-1008": {
    name: "Grande Erupção Flamejante",
    text: [
      "Requerimentos: Quatro Caudas",
      "Efeito: Descarte os 10 cards do topo do Deck do oponente. Fira todos os Ninjas cujo nome seja o mesmo de um card descartado do Deck deles por este efeito.",
    ],
  },
  "s28-j-1009": {
    name: "Espada de Controle das Chamas",
    text: [
      "Requerimentos: Sasuke Uchiha + Custo de Entrada 5 ou mais",
      "Efeito: Cause 1 Dano a todos os Ninjas que enfrentam o Usuário, ou cause 2 Dano a 1 Ninja que enfrenta o Usuário.",
    ],
  },
  "s28-j-1010": {
    text: [
      "Requerimentos: Itachi Uchiha ou Madara Uchiha ou Sasuke Uchiha + Custo de Entrada 5 ou mais, ou Susano'o ou Susano'o (Sasuke)",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Depois, se o custo maior deste Jutsu foi pago, cause 1 Dano a todos os outros Ninjas que enfrentam o Usuário.",
    ],
  },
  "s28-j-1011": {
    name: "Invocação: Estátua Gedo",
    text: [
      "Como custo adicional para jogar este card, remova do jogo 9 cards de Ninja \"Besta com Caudas\" da sua Pilha de Descartes.",
      "Requerimentos: Tobi + Custo de Entrada 6 ou mais, ou Homem Mascarado",
      "Efeito: Coloque uma moeda de Estátua Gedo no Time do Usuário, em qualquer posição, com o seguinte: \"[Poder: 20/20 (Saudável e Ferido)] [\"Quando este Ninja conseguir uma Vitória Espetacular, mova todos os Ninjas que enfrentam este Ninja para a sua área de Prêmios de Batalha, com a face para baixo. \"]",
    ],
  },
  "s28-j-1012": {
    text: [
      "Este Jutsu não pode ser negado.",
      "Requerimentos: Might Guy",
      "Efeito: Os dois jogadores revelam a mão e descartam todos os cards de Jutsu revelados dessa forma. Depois, distribua X Dano entre os Ninjas do seu oponente, onde X = o número de cards de Jutsu descartados por este efeito, mais 1.",
    ],
    flavor: "\"Esse é o golpe dos Oito Portões Internos do Guy, o Hirudora, o Tigre da Tarde!\"",
  },
  "s28-j-1013": {
    name: "Estocada Infernal: Mão-Lança de Um Dedo",
    text: [
      "Requerimentos: O 3º Raikage",
      "Efeito: Aplique 1 dos efeitos a seguir conforme o número de cards na sua mão:",
      "3+) Cause 1 Dano a 1 Ninja que enfrenta o Usuário",
      "2) Negue e descarte o Jutsu alvo",
      "1) Descarte o Ninja alvo que enfrenta o Usuário e depois compre 2 cards.",
    ],
  },
  "s28-j-1014": {
    name: "Bomba da Besta com Caudas",
    text: [
      "Requerimentos: Naruto Uzumaki (Manto de 9 Caudas) ou \"Besta com Caudas\"",
      "Efeito: Descarte 1 Ninja ou Missão OU negue e descarte 1 Jutsu.",
    ],
  },
  "s28-j-1015": {
    name: "Estilo Vendaval: Caçada Negra",
    text: [
      "Requerimentos: Darui",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo. No início do Showdown, se o alvo não usou um Jutsu durante este turno, cause 1 Dano ao alvo.",
    ],
    flavor: "\"Estilo Raio! Pantera Negra!\"",
  },
  "s28-j-1016": {
    name: "O Poder do Bashosen",
    text: [
      "Efeito: Aplique 1 dos efeitos a seguir conforme os Símbolos dos Chakras usados para pagar este Jutsu:",
      "Terra) 1 Ninja que enfrenta o Usuário passa a ser um Ninja Reserva.",
      "Fogo) Fira 1 Ninja que enfrenta o Usuário.",
      "Raio) O Usuário ganha +3/+3 durante este turno.",
      "Água) Negue 1 Jutsu e mova-o para a mão do Dono Original dele.",
      "Vento) Compre 1 card e depois descarte 1 card.",
    ],
  },
  "s28-j-1017": {
    name: "O Poder do Benihisago",
    text: [
      "Alvo: 1 Ninja ferido que enfrenta o Usuário",
      "Efeito: Mova o alvo para a sua área de Prêmios de Batalha, com a face para baixo.",
    ],
  },
  "s28-j-1018": {
    name: "Salto das Cinco Montanhas",
    text: [
      "Requerimentos: Cinco Caudas",
      "Efeito: Mova 1 dos Prêmios de Batalha do seu oponente para a sua mão. Depois, se o seu oponente tiver 5 ou mais Prêmios de Batalha, mova mais 1 dos Prêmios de Batalha dele para a sua mão.",
    ],
  },
  "s28-j-1019": {
    name: "Espuma do Mar Revolto",
    text: [
      "Requerimentos: Três Caudas",
      "Efeito: O seu oponente move a mão dele para a área de Chakra dele e depois move 2 cards da área de Chakra dele para a mão.",
    ],
  },
  "s28-j-1020": {
    name: "Arte Ninja: Jutsu Névoa de Foices",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: O Usuário ganha +3/+3 durante este turno. Depois, o Usuário ganha +3/+3 durante este turno para cada card de Jutsu com o mesmo nome deste Jutsu na sua Pilha de Descartes.",
    ],
    flavor: "\"Você luta bem, para um fraco homem da paz.\"",
  },
  "s28-j-1021": {
    name: "Invocação: Reanimação",
    text: [
      "Requerimentos: Kabuto Yakushi + Custo de Entrada 6 ou mais",
      "Efeito: Escolha até 3 cards de Ninja [REENCARNAÇÃO IMPURA] na sua Pilha de Descartes. Mova 1 dos cards de Ninja escolhidos para o Time do Usuário, em qualquer posição, ignorando o Sacrifício, e depois mova os outros 2 para a sua mão.",
    ],
    flavor: "\"Primeiro, temos...\"",
  },
  "s28-j-1022": {
    name: "Bolhas de Carga",
    text: [
      "Requerimentos: Seis Caudas",
      "Alvo: Todos os outros Jutsus",
      "Efeito: Cause 1 Dano ao(s) Usuário(s) do alvo e depois negue e descarte o alvo.",
    ],
  },
  "s28-j-1023": {
    name: "Explosão de Fósforo",
    text: [
      "Requerimentos: Sete Caudas",
      "Alvo: Todos os Ninjas",
      "Efeito: Se o Custo de Entrada do alvo for 2 ou menos, descarte-o. Se não, se o Custo de Entrada do alvo for 4 ou menos, o Poder do alvo é 0/0 durante este turno.",
    ],
  },
  "s28-j-1024": {
    name: "Tsunami de Areia",
    text: [
      "Requerimentos: Gaara of the Desert + Custo de Entrada 4 ou mais, ou O 4º Kazekage",
      "Alvo: 1 Ninja Líder que enfrenta o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Se o alvo for descartado por este efeito, cause 1 Dano a 1 outro Ninja do Time do Usuário. Se esse Ninja for descartado por este efeito, descarte o Time do alvo.",
    ],
  },
  "s28-j-1025": {
    name: "Jutsu Secreto: Pântano de Insetos",
    text: [
      "Requerimentos: \"Inseto\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Coloque em jogo uma moeda de Ninja Inseto 0/0 com Não Único para cada Ninja Inseto e Ninja \"Inseto\" que você controla. Depois, se você controlar mais Ninjas \"Inseto\" e/ou Inseto que o Custo de Entrada do alvo, descarte o alvo.",
    ],
  },
  "s28-j-1026": {
    name: "Florada Plena: Choque da Flor de Cerejeira",
    text: [
      "Requerimentos: Sakura Haruno + \"Chunin\" ou Hierarquia superior, ou Tsunade",
      "Alvo: 1 Ninja Líder que enfrenta o Usuário",
      "Efeito: Descarte o alvo. Depois, você pode causar 1 Dano a 1 Ninja de Apoio que enfrenta o Usuário.",
    ],
  },
  "s28-j-1027": {
    name: "O Espírito do Samurai",
    text: [
      "Enquanto este Jutsu estiver na Sequência, cards de Jutsu não podem ser jogados.",
      "Requerimentos: Mifune",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Descarte o alvo.",
    ],
    flavor: "\"Eu desejo lutar com você!\"",
  },
  "s28-j-1028": {
    name: "Investida da Racha-Elmos",
    text: [
      "Requerimentos: \"Arma\"",
      "Alvo: 1 Ninja que não seja \"Taijutsu\" e que enfrenta o Usuário",
      "Efeito: O Poder do alvo é 0/0 e não pode ser mudado durante este turno.",
      "Especialista [Jinin Akebino]: O alvo passa a ser um Ninja Reserva.",
    ],
  },
  "s28-j-1029": {
    name: "Investida da Presa",
    text: [
      "Requerimentos: \"Arma\"",
      "Efeito: O seu oponente revela a mão. Escolha e descarte 1 card revelado dessa forma. O Usuário ganha +X/+0 durante este turno, onde X = o Custo de Entrada do card descartado.",
      "Especialista [Ameyuri Ringo]: Você pode descartar 1 Ninja com o mesmo nome do card de Ninja descartado.",
    ],
  },
  "s28-j-1030": {
    name: "Investida da Agulha de Costura",
    text: [
      "Requerimentos: \"Arma\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo e depois fira 1 Ninja do Time do alvo que compartilhe 1 ou mais Símbolos com o alvo.",
      "Especialista [Kushimaru Kuriarare]: Descarte o alvo.",
    ],
  },
  "s28-j-1031": {
    name: "Mestre das 7 Espadas",
    text: [
      "Requerimentos: Mangetsu Hozuki",
      "Efeito: Mova da sua Pilha de Descartes para a sua mão todos os cards de Jutsu com \"Arma\" nos Requerimentos. O Usuário pode usar cards de Jutsu com \"Arma\" nos Requerimentos de graça durante este turno.",
    ],
  },
  "s28-j-1032": {
    name: "Senbon de Agulha",
    text: [
      "Requerimentos: Fuguki Suikazan",
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Jogue a Moeda Ninja. Se der cara, mova o alvo para a área de Chakra do Dono Original dele. Se não, cause 1 Dano ao alvo.",
    ],
  },
  "s28-j-1033": {
    name: "Investida da Respingo",
    text: [
      "Requerimentos: \"Arma\"",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Fira o alvo. O Usuário ganha +3/+0 durante este turno.",
      "Especialista [Jinpachi Munashi]: Cause X Dano a 1 Ninja que enfrenta o Usuário, onde X = o número de outros Jutsus na Sequência.",
    ],
  },
  // ── MISSÃO ──
  "s28-m-976": {
    name: "Exército de Zetsu",
    text: [
      "Permanente | Revitalizar",
      "Efeito: Se algum marcador for colocado num Ninja ou numa Missão que você controla, você pode colocar nesse card um marcador adicional do mesmo tipo.",
    ],
    flavor: "\"...cem mil.\"",
  },
  "s28-m-977": {
    name: "Tamanho Gigante!",
    text: [
      "Permanente (2)",
      "Efeito: Os seus Ninjas ganham +1/+1 e +1 de Custo de Entrada.",
      "Efeito: No final do seu turno, você pode jogar a Moeda Ninja. Se der cara, coloque um marcador nesta Missão.",
    ],
  },
  "s28-m-978": {
    name: "Seleção de Linhagem",
    text: [
      "Permanente (3)",
      "Efeito: Todos os Ninjas e Missões que você controla e que não têm Revitalizar ganham Revitalizar.",
      "Efeito: Quando qualquer card for movido para o fundo do seu Deck, você pode comprar 1 card.",
    ],
  },
  "s28-m-979": {
    name: "Usuário Magistral",
    text: [
      "Anulação | Revitalizar",
      "Efeito: Remova qualquer quantidade de marcadores de qualquer número de Ninjas e/ou Missões que você controla. Nesse caso, remova do jogo 1 Ninja ou Missão com Custo de Entrada igual ao número de marcadores removidos por este efeito.",
    ],
  },
  "s28-m-980": {
    name: "Cavando a Própria Cova",
    text: [
      "Permanente (2)",
      "[Missão] Mova esta Missão para a sua área de Chakra: Negue e descarte a Missão alvo OU negue o texto de efeito do Ninja alvo durante este turno.",
    ],
  },
  "s28-m-981": {
    name: "A Força da Convicção",
    text: [
      "Permanente (3)",
      "[Missão] (0): Veja os X cards do topo do seu Deck e devolva-os em qualquer ordem. Depois, você pode remover um marcador desta Missão para comprar 1 card. X = o número de marcadores nesta Missão.",
    ],
  },
  "s28-m-982": {
    name: "Dupla Destrutiva",
    text: [
      "Enquanto o seu oponente tiver 5 ou mais Prêmios de Batalha, este card pode ser jogado da sua Pilha de Descartes.",
      "Efeito: Descarte os 2 cards do topo do Deck de um jogador e compre 1 card. Depois, se este card foi jogado da sua Pilha de Descartes, remova este card do jogo.",
    ],
  },
  "s28-m-983": {
    name: "Espírito Vingativo",
    text: [
      "Efeito: Descarte os 5 cards do topo do Deck do seu oponente e compre 1 card. Depois, se o seu oponente tiver 5 ou mais Prêmios de Batalha, você pode causar 1 Dano a 1 Ninja com o mesmo nome de um card descartado por este efeito.",
    ],
  },
  "s28-m-984": {
    name: "Espírito Heroico",
    text: [
      "Permanente (3)",
      "Efeito: Todos os seus cards de Ninja e Ninjas que você controla sem Explosão ganham Explosão.",
      "Efeito: Quando você aplicar o efeito de Explosão, se o valor aplicado for 2 ou mais, você pode comprar 1 card do fundo do seu Deck.",
    ],
  },
  "s28-m-985": {
    name: "Oito Portões Internos",
    text: [
      "Permanente",
      "Efeito: No início do seu turno, remova do jogo cards do topo do seu Deck até remover um card de Jutsu; depois, aplique 1 dos efeitos a seguir conforme quantos cards você removeu:",
      "3+) 1 Ninja ganha +3/+0 durante este turno.",
      "6+) Descarte 1 Ninja.",
      "8+) Os seus Ninjas não podem ser alvo de cards de Jutsu durante este turno.",
    ],
  },
  "s28-m-986": {
    name: "Choque de Ideais",
    text: [
      "Efeito: Aplique os efeitos a seguir conforme o nome dos cards usados para pagar o Custo de Mão deste card:",
      "Naruto Uzumaki) Mova 2 dos Prêmios de Batalha do seu oponente para a sua mão.",
      "Sasuke Uchiha) Você ganha 1 Prêmio de Batalha, e o seu oponente descarta 2 cards.",
    ],
  },
  "s28-m-987": {
    name: "Velocidade do Relâmpago",
    text: [
      "Alvo: 1 Ninja com Explosão ou Ponto Crítico",
      "Efeito: O valor de Combate do alvo é triplicado, e o alvo deve ser enfrentado se Atacar durante este turno.",
      "Efeito: Quando o alvo conseguir uma Vitória Espetacular por uma diferença de 8 ou mais de Poder do Time, descarte todos os Ninjas que enfrentam o alvo.",
    ],
  },
  "s28-m-988": {
    name: "Eixo do Mal",
    text: [
      "Enquanto o seu oponente tiver 5 ou mais Prêmios de Batalha, todos os números no texto de efeito deste card aumentam em 1.",
      "Efeito: Procure 1 card no seu Deck e mova-o para a sua Pilha de Descartes. Depois, embaralhe o seu Deck e compre 1 card.",
    ],
    flavor: "\"Vamos... a guerra começa!!",
  },
  "s28-m-989": {
    name: "Limite de Linhagem",
    text: [
      "Permanente (3)",
      "Efeito: Todos os Ninjas que você controla sem Desespero ganham Desespero.",
      "Efeito: Quando você ativar um efeito ativado duas vezes num mesmo turno, pode comprar 1 card.",
    ],
  },
  "s28-m-990": {
    name: "Escondido na Névoa",
    text: [
      "Permanente (3) | Desespero",
      "[Troca de Jutsu] (0): Negue o Jutsu alvo e mova-o para a mão do Dono Original dele. No final do turno, mova esta Missão para a sua área de Chakra.",
    ],
    flavor: "\"Ninpo Kirigakure no Jutsu!\"",
  },
  "s28-m-991": {
    name: "Força Indomável",
    text: [
      "Permanente (3)",
      "Alvo: 1 Ninja \"Feminino\"",
      "Efeito: O alvo ganha +2/+0, +2 de Custo de Entrada e +2 de Poder Mental.",
      "Efeito: Quando o alvo conseguir qualquer Vitória ou ganhar qualquer Prêmio de Batalha, você pode comprar 1 card.",
    ],
  },
  "s28-m-992": {
    name: "Discurso Apaixonado",
    text: [
      "Permanente (3)",
      "Efeito: Todos os Ninjas que você controla sem Ponto Crítico ganham Ponto Crítico.",
      "Efeito: Quando você colocar em jogo um Ninja sem ser baixando-o, pode comprar 1 card.",
    ],
    flavor: "\"Eu quero proteger esse amigo, e este mundo!\"",
  },
  "s28-m-993": {
    name: "Esquadrão de 4",
    text: [
      "Permanente (3)",
      "Efeito: O tamanho máximo dos seus Times é 4.",
      "[Bloqueador | Missão] (1): Organize os seus Times.",
    ],
    flavor: "\"Então cuidem das costas de vocês também!\"",
  },
  "s28-m-994": {
    name: "Tempestade Furiosa",
    text: [
      "Alvo: 1 Ninja \"Masculino\" que o seu oponente controla",
      "Efeito: Compre 2 cards. Depois, aplique 1 dos efeitos a seguir conforme os Símbolos dos cards usados para pagar o Custo de Mão desta Missão:",
      "Vento) Retire o alvo do Time dele.",
      "Água) O Poder do alvo é 0/0 durante este turno.",
    ],
  },
  "s28-m-995": {
    name: "Transformação em Besta com Caudas",
    text: [
      "Alvo: 1 Ninja \"Jinchuriki\" que você controla",
      "Efeito: Mova o alvo para a sua mão e depois procure no seu Deck um card de Ninja com o mesmo nome do alvo e mova-o para a sua Vila. Depois, embaralhe o seu Deck.",
    ],
  },
  "s28-m-996": {
    name: "Reunindo as Feras",
    text: [
      "Efeito: Procure no seu Deck 3 cards de Ninja e revele-os. Nesse caso, o seu oponente escolhe e move 1 dos cards revelados para a sua mão e descarta o resto. Se você controlar um Ninja [REENCARNAÇÃO IMPURA], em vez disso, você escolhe. Depois, embaralhe o seu Deck.",
    ],
  },
  "s28-m-997": {
    name: "Os Maiores Espadachins da Névoa",
    text: [
      "Permanente | Desespero",
      "Efeito: Você pode ignorar os custos de Sacrifício dos seus cards de Ninja [REENCARNAÇÃO IMPURA].",
      "[Atacante | Missão] Descarte 1 card de Ninja [REENCARNAÇÃO IMPURA]: Compre 1 card.",
    ],
    flavor: "\"Isto é inacreditável.\"",
  },
  "s28-m-998": {
    name: "Aliança Ninja",
    text: [
      "Efeito: Você vence o jogo se controlar Ninjas com \"Folha\", \"Névoa\", \"Areia\", \"Pedra\" e \"Nuvem\", e também tiver cards de Terra, Fogo, Raio, Água e Vento na sua área de Chakra. (Cards com vários Símbolos e/ou Vilas contam para todos esses Símbolos e/ou Vilas)",
    ],
    flavor: "\"Todos que sentem o mesmo que eu, sigam-me!\"",
  },
};
