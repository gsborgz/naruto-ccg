import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * TP3 — Tournament Pack 3, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/tp3-tournament-pack-3.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. As marcações de momento
 * `[Valid | Attacker | Mission | EOJ]` viram `[Válido | Atacante | Missão | Troca de Jutsu]`.
 */
export const TP3_TOURNAMENT_PACK_3_PTBR: CardTranslations = {
  // ── NINJA ──
  "tp3-n-1170": {
    text: [
      "[LINHAGEM HYUGA]",
      "Válido: Enquanto o seu oponente tiver menos cards na mão que você, este Ninja ganha +1/+1.",
    ],
    flavor: "\"Hã... oi...\"",
  },
  "tp3-n-1171": {
    text: [
      "[SEGREDOS DO CLÃ NARA]",
      "Válido: Quando este Ninja for descartado por causa do Showdown, você pode procurar no seu Deck 1 card de Missão Permanente, revelá-lo e movê-lo para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Que pé no saco.\"",
  },
  "tp3-n-1172": {
    text: [
      "[DEFESA ABSOLUTA]",
      "Válido: Enquanto o seu oponente tiver menos cards na mão que você, este Ninja não pode receber Dano por causa do Showdown.",
    ],
    flavor: "\"Tudo isso soa muito triste.\"",
  },
  "tp3-n-1173": {
    text: [
      "[LÂMINAS DE CHAKRA]",
      "Válido: Este Ninja ganha +1/+1 para cada card de Jutsu com \"Arma\" nos Requerimentos na sua Pilha de Descartes.",
    ],
    flavor: "\"Que praga.\"",
  },
  "tp3-n-1174": {
    name: "O 1º Hokage",
    text: [
      "[REBROTAR]",
      "Válido: Quando este Ninja ou card de Ninja for ser movido para a Pilha de Descartes, em vez disso, embaralhe-o no Deck do Dono Original dele.",
    ],
    flavor: "\"Não importa a era...\"",
  },
  "tp3-n-1175": {
    text: [
      "[ELITE DO TIME 8]",
      "Enquanto você tiver Naruto Uzumaki, este Ninja ganha +1/+1.",
      "Enquanto você tiver Sakura Haruno, este Ninja ganha +1/+1.",
    ],
    flavor: "\"Só não me atrapalhem...\"",
  },
  "tp3-n-1176": {
    text: [
      "[CÓPIA DO SHARINGAN]",
      "Válido: Quando este Ninja for ferido por um efeito, cause 1 Dano a 1 dos Ninjas do seu oponente.",
    ],
    flavor: "\"Os meus sonhos para o futuro não são da sua conta...\"",
  },
  "tp3-n-1177": {
    text: [
      "[VINGANÇA]",
      "Válido: Os seus outros Ninjas \"Anbu\" ganham +1/+1.",
      "Válido: No início do seu turno, se você tiver 5 ou mais Ninjas \"Anbu\", você ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Nenhum.\"",
  },
  "tp3-n-1178": {
    name: "O 3º Hokage",
    text: [
      "[O NÍVEL DE HOKAGE]",
      "Válido: Quando este Ninja usar um Jutsu de Fogo, esse Jutsu ganha o seguinte: \"Especialista [\"Satoosa\"]: Cause 1 Dano a 1 Ninja adversário.\"",
    ],
    flavor: "\"Bem, então...\"",
  },
  "tp3-n-1179": {
    text: [
      "[CLONE DAS SOMBRAS]",
      "Válido: Quando este Ninja Atacar, coloque em jogo 1 moeda de Ninja Clone das Sombras com o seguinte: \"[Poder: 0/0 (Saudável e Ferido)][Não Único]\".",
    ],
    flavor: "\"Que droga!\"",
  },
  "tp3-n-1180": {
    text: [
      "[ESPECIALISTA EM TAIJUTSU]",
      "No início do seu turno, você pode ver o card do topo do seu Deck e pode revelá-lo. Se o card revelado for um card de Ninja \"Taijutsu\", coloque um Marcador de Crescimento neste Ninja.",
    ],
    flavor: "\"Eu vou proteger você com a minha vida.\"",
  },
  "tp3-n-1181": {
    text: [
      "[LAÇO ETERNO]",
      "Válido: Quando este Ninja for colocado em jogo, você pode mover até 2 cards do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"É um nome maravilhoso.\"",
  },
  "tp3-n-1182": {
    text: [
      "[TRANSFORMAÇÃO]",
      "Válido: Quando este Ninja for colocado em jogo, você pode procurar no seu Deck 1 card de Ninja Oito Caudas, revelá-lo e movê-lo para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Lá vem o oitavo, mano!\"",
  },
  "tp3-n-1183": {
    text: [
      "[PALAVRAS GENTIS?]",
      "Válido: Todos os cards de Jutsu custam (1) a mais para jogar.",
    ],
    flavor: "\"Eu gostaria de trocar uma palavra com você.\"",
  },
  "tp3-n-1184": {
    name: "Naruto Uzumaki (Forma de Besta com Caudas)",
    text: [
      "[RAIVA LIBERTADA]",
      "[Válido | Atacante | Missão] (X|X): Cause 2 Dano ao Ninja alvo com Custo de Entrada X.",
    ],
  },
  "tp3-n-1185": {
    text: [
      "[PODER ESMAGADOR]",
      "Válido: Enquanto este Ninja estiver Em Combate sozinho, o Poder de ferido dele é tratado como o Poder de saudável.",
    ],
    flavor: "\"Conto com você.\"",
  },
  "tp3-n-1186": {
    name: "Oito Caudas",
    text: [
      "[COMO UM SÓ]",
      "Sacrifício: Killer Bee",
      "Válido: No início do Showdown, se a diferença de Poder do Time entre o Time deste Ninja e o Time adversário for 10 ou mais, você ganha 2 Prêmios de Batalha.",
    ],
    flavor: "♪\"Agora olha pra mim enquanto eu te faço molhar as calças, suas formiguinhas.\"♪",
  },
  "tp3-n-1187": {
    text: [
      "[ÁGUA EM PESSOA]",
      "Válido: Enquanto você tiver 2 ou mais Chakras de Água, este Ninja ganha +1/+1.",
    ],
    flavor: "\"Está comigo aqui.\"",
  },
  "tp3-n-1188": {
    text: [
      "[INFLUÊNCIA PSICÓTICA]",
      "Válido: No início do seu turno, jogue a Moeda Ninja. Se der cara, fira este Ninja, e este Ninja ganha o seguinte texto de efeito durante este turno: \"Válido: No final do turno, cure este Ninja\".",
    ],
    flavor: "\"Na mosca!\"",
  },
  "tp3-n-1189": {
    text: [
      "[TRANSFERÊNCIA]",
      "[Troca de Jutsu] Enquanto este Ninja estiver no Campo de Batalha, dê -2/-2 a este Ninja durante este turno: O Ninja alvo ganha +2/+2 durante este turno.",
    ],
    flavor: "\"Anda logo e me morde.\"",
  },
  "tp3-n-1190": {
    text: [
      "[INICIADO DA AKATSUKI]",
      "Válido: Enquanto este Ninja estiver Em Combate sozinho, ele ganha +1/+1 para cada um dos seus Chakras de Água.",
    ],
    flavor: "\"Heh... Não acredito...\"",
  },
  "tp3-n-1191": {
    text: [
      "[CURA AMALDIÇOADA]",
      "[Válido | Troca de Jutsu] Fira este Ninja: Cure o Ninja alvo.",
    ],
    flavor: "\"Mas por muito pouco.\"",
  },
  "tp3-n-1192": {
    text: [
      "[MANGEKYO DESPERTADO]",
      "Válido: Este Ninja pode usar cards de Jutsu com \"Requerimentos: Itachi Uchiha\".",
    ],
    flavor: "\"Eu não quero uma paz comprada com a vida do Itachi.\"",
  },
  "tp3-n-1193": {
    text: [
      "[COBRA ENTRE AS NUVENS]",
      "[Atacante | Missão] Descarte 1 dos seus outros Ninjas: Mova este Ninja para a Vila do seu oponente.",
      "Válido: No início do seu turno, o seu oponente ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Você é meu...\"",
  },
  "tp3-n-1194": {
    name: "Sasuke Uchiha (Estado 2)",
    text: [
      "[ESTADO 2]",
      "Sacrifício: Sasuke Uchiha + Custo de Entrada 4 ou mais",
      "Quando este Ninja usar um Jutsu de Água, descarte 2 Chakras do seu oponente.",
      "Quando este Ninja usar um Jutsu de Fogo, cause 1 Dano ao Ninja adversário alvo.",
    ],
    flavor: "\"A cobra é presa porque aquele pássaro é um falcão...\"",
  },
  "tp3-n-1195": {
    text: [
      "[CATANDO FERRAMENTAS]",
      "Válido: Quando este Ninja for colocado em jogo, procure no seu Deck até 2 cards de Jutsu que tenham \"Arma\" nos Requerimentos e mova-os para a sua Pilha de Descartes. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"O objetivo da missão...\"",
  },
  "tp3-n-1196": {
    text: [
      "[CAIXÃO DE AREIA]",
      "Quando este Ninja for colocado em jogo, você pode pagar 1 de Vento. Nesse caso, fira o Ninja \"Genin\" alvo com Custo de Entrada 1 ou menos.",
    ],
    flavor: "\"Cala a boca...\"",
  },
  "tp3-n-1197": {
    text: [
      "[ILUSÃO]",
      "Enquanto este Ninja estiver Bloqueando, o seu oponente não pode jogar cards de Jutsu com o mesmo nome de qualquer card de Jutsu na Pilha de Descartes dele.",
    ],
    flavor: "\"Podemos acabar logo com isso?\"",
  },
  "tp3-n-1198": {
    text: [
      "[TEMPESTADE DE PAPEL]",
      "[Atacante | Missão] Remova do jogo X cards da sua mão: Retire do Time dele o Ninja alvo com Custo de Entrada X ou menos. No final do turno, mova para a sua mão os cards removidos do jogo por este efeito.",
    ],
    flavor: "\"Nagato...\"",
  },
  "tp3-n-1199": {
    name: "Pain (Caminho Animal)",
    text: [
      "[A VOZ DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Atacante | Missão] Descarte 1 card: Coloque em jogo o card de Ninja \"Rinnegan\" + \"Animal\" alvo da sua área de Chakra ou Pilha de Descartes (o Custo de Entrada deve ser pago).",
    ],
    flavor: "\"Chikushodo.\"",
  },
  "tp3-n-1200": {
    name: "Pain (Caminho Preta)",
    text: [
      "[A MÃO DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Os cards de Jutsu com Símbolos específicos no custo custam (1) a mais para jogar.",
    ],
    flavor: "\"Gakido.\"",
  },
  "tp3-n-1201": {
    name: "Pain (Caminho Naraka)",
    text: [
      "[A MENTE DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Válido: O número de Prêmios de Batalha de que você precisa para vencer o jogo diminui em 1.",
    ],
    flavor: "\"Jigokudo.\"",
  },
  "tp3-n-1202": {
    name: "Pain (Caminho Humano)",
    text: [
      "[A ALMA DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Válido: O seu oponente joga com a mão revelada. O texto de efeito dos cards em jogo do seu oponente com o mesmo nome de qualquer card na mão dele é negado.",
    ],
    flavor: "\"Ningendo.\"",
  },
  "tp3-n-1203": {
    name: "Pain (Caminho Asura)",
    text: [
      "[O ROSTO DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Válido][Troca de Jutsu] Coloque X Marcadores -1/-1 neste Ninja: Fira o Ninja adversário alvo com Custo de Entrada igual a X.",
      "Válido: No final do turno, se este Ninja tiver 7 ou mais Marcadores -1/-1, descarte-o.",
    ],
    flavor: "\"Shurado.\"",
  },
  "tp3-n-1204": {
    name: "Pain (Caminho Deva)",
    text: [
      "[O CORPO DE PAIN]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Troca de Jutsu] (1): Se este Ninja estiver Em Combate sozinho, o Ninja adversário alvo passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Tendo.\"",
  },
  "tp3-n-1205": {
    text: [
      "[OS SEIS CAMINHOS DE PAIN]",
      "Válido: X = o número dos seus Ninjas \"Rinnegan\".",
      "[Válido | Atacante | Missão] (3): Troque 1 dos seus Ninjas de Vazio por um card de Ninja \"Rinnegan\" da sua mão, ignorando o Sacrifício dele (o Custo de Entrada deve ser pago).",
    ],
  },
  // ── JUTSU ──
  "tp3-j-827": {
    name: "Treino de Escalar Árvores",
    text: [
      "Efeito: Mova o card do topo do seu Deck para a sua área de Chakra. Nesse caso, durante este turno, o Usuário não é afetado pelo efeito de nenhum Jutsu do seu oponente cujo Símbolo corresponda a qualquer Símbolo dos cards na sua área de Chakra.",
    ],
  },
  "tp3-j-828": {
    name: "Sozinho",
    text: [
      "Efeito: Durante o Showdown deste turno, se o Usuário estiver Em Combate sozinho, o resultado do Showdown dele é Empate, independentemente do Poder do Time ou do Poder Mental do Time.",
      "Especialista [\"Byakugan\"]: O Usuário não pode receber nenhum Dano durante este turno.",
    ],
    flavor: "\"No fim, só existe um corpo de verdade.\"",
  },
  "tp3-j-829": {
    name: "Estilo Fogo: Jutsu Bola de Fogo",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Cause 1 Dano ao alvo. Durante este turno, quando o alvo for ser retirado de jogo por causa de Dano, em vez disso, mova-o para a sua área de Prêmios de Batalha.",
    ],
  },
  "tp3-j-830": {
    text: [
      "Requerimentos: Sasuke Uchiha ou Kakashi Hatake",
      "Alvo: Todos os Ninjas Em Combate contra o Usuário",
      "Efeito: O alvo recebe -2/-2 durante este turno. Depois, compre 1 card para cada alvo com Suporte 0.",
    ],
    flavor: "\"Chidori: mil pássaros...?\"",
  },
  "tp3-j-831": {
    name: "Estilo Vento: Rasen Shuriken",
    text: [
      "Requerimentos: \"Estado de Clone\" + Custo de Entrada 3 ou mais",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Compre 1 card para cada Símbolo do alvo. Depois, mova o alvo para a sua área de Prêmios de Batalha.",
    ],
    flavor: "\"Se aquilo me acertar... vai ser ruim...\"",
  },
  "tp3-j-832": {
    name: "Artes de Batalha de Barreira",
    text: [
      "Efeito: Durante o próximo turno, quando um Ninja for ser colocado em jogo, se ele tiver texto de efeito, em vez disso, ele é colocado em jogo ferido.",
    ],
    flavor: "\"Agora que ele ficou invisível, temos que usar as Artes de Batalha de Barreira.\"",
  },
  "tp3-j-833": {
    name: "Corpo Deformável",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O Suporte do alvo passa a ser 0 durante este turno. Se o Usuário conseguir qualquer Vitória durante este turno, mova até 2 cards da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Agora eu preciso cuidar de vocês rapidinho.\"",
  },
  "tp3-j-834": {
    name: "Lâmina do Deus do Trovão",
    text: [
      "Requerimentos: \"Jonin\" ou Hierarquia superior",
      "Alvo: 2 Ninjas Em Combate contra o Usuário",
      "Efeito: O seu oponente causa 1 Dano a 1 dos alvos, e o Poder do outro alvo passa a ser 0/0 durante este turno.",
    ],
    flavor: "\"Lamento informar, mas esta Espada de Raijin corta qualquer coisa.\"",
  },
  "tp3-j-835": {
    name: "Golpe Atordoante",
    text: [
      "Enquanto este Jutsu estiver na Sequência, os jogadores não podem jogar cards nem ativar efeitos.",
      "Alvo: 1 Ninja",
      "Efeito: O alvo não pode se tornar o Usuário de cards de Jutsu durante este turno.",
      "Especialista [\"Feminino\"]: O Usuário ganha +3/+3 durante este turno.",
    ],
    flavor: "\"Este dedo vai bastar.\"",
  },
  "tp3-j-836": {
    name: "Medo de Sangue",
    text: [
      "Alvo: 1 Ninja no Campo de Batalha",
      "Efeito: Se o alvo estiver ferido, mova-o para a mão do Dono Original dele.",
    ],
    flavor: "\"Você tem medo de sangue, não tem?\"",
  },
  "tp3-j-837": {
    name: "Treino de Manipulação de Chakra",
    text: [
      "Efeito: Anexe este card ao Usuário. Os cards de Jutsu que compartilham um Símbolo com o Ninja anexado custam (1) a menos quando usados pelo Ninja anexado.",
    ],
    flavor: "\"Muito bem! Eu vou conseguir!!\"",
  },
  "tp3-j-838": {
    name: "Estilo Dinheiro: Jutsu Clones das Sombras",
    text: [
      "Efeito: Descarte o Usuário. Nesse caso, revele os 6 cards do topo do seu Deck. Se entre os cards revelados houver cards de Ninja com Custo de Entrada até 1 a mais que o do Usuário, mova 1 deles para a sua Vila. Depois, descarte o resto.",
    ],
    flavor: "\"Vai!\"",
  },
  // ── MISSÃO ──
  "tp3-m-776": {
    name: "Invocando Armas",
    text: [
      "Permanente",
      "Efeito: [Troca de Jutsu] (2): Procure no seu Deck 1 card de Jutsu que tenha \"Arma\" nos Requerimentos, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Não pode ser!\"",
  },
  "tp3-m-777": {
    name: "Depois da Batalha",
    text: [
      "Efeito: Descarte 1 card. Nesse caso, compre 3 cards.",
    ],
    flavor: "\"Velho...\"",
  },
  "tp3-m-778": {
    name: "Velhos Rostos, Novos Problemas",
    text: [
      "Efeito: Descarte os 4 cards do topo do seu Deck. Depois, compre 2 cards.",
    ],
    flavor: "\"Olá, princesa. Faz muito tempo...\"",
  },
  "tp3-m-779": {
    name: "Olhos de Demônio",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Coloque um Marcador -1/-1 no alvo. Depois, você pode remover qualquer número de Marcadores -1/-1 dos Ninjas do seu oponente para comprar o mesmo número de cards.",
    ],
    flavor: "\"...Você deve ser o lendário demônio Raposa de Nove Caudas...\"",
  },
  "tp3-m-780": {
    name: "Treino de Clones",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Anexe este card ao alvo. O alvo ganha +1/+0, \"Estado de Clone\" e pode ser o Usuário de cards de Jutsu que tenham \"Naruto Uzumaki\" nos Requerimentos.",
    ],
  },
  "tp3-m-781": {
    name: "Pensamento Desajeitado",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Coloque um Marcador de Crescimento no alvo. Depois, você pode remover qualquer número de Marcadores de Crescimento dos seus Ninjas para comprar o mesmo número de cards.",
    ],
    flavor: "\"Ah... Entendi!\"",
  },
  "tp3-m-782": {
    name: "Pouca Energia",
    text: [
      "Permanente",
      "Alvo: 1 Ninja",
      "Efeito: Quando o alvo for enviado para a Batalha, ele não pode ser enviado para a Batalha durante o próximo turno.",
    ],
  },
  "tp3-m-783": {
    name: "Observador",
    text: [
      "Efeito: O seu oponente revela 2 cards aleatórios da mão. Depois, você compra 1 card para cada Símbolo diferente entre os cards revelados por este efeito.",
    ],
    flavor: "\"Eu ainda não entendi...\"",
  },
  "tp3-m-784": {
    name: "Sob a Lua que Nasce",
    text: [
      "Alvo: 1 Ninja",
      "Efeito: Retire o alvo do Time dele. Depois, compre 1 card.",
    ],
    flavor: "\"...O que você quer...?\"",
  },
  "tp3-m-785": {
    name: "Boas Lembranças",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, compre 1 card.",
      "Efeito: [Missão] Mova esta Missão para a sua área de Chakra: Você decide o resultado da Moeda Ninja durante este turno.",
    ],
  },
  "tp3-m-786": {
    name: "O Tolo & A Elite",
    text: [
      "Permanente (3)",
      "Efeito: Quando um jogador jogar um Jutsu que aumente o Combate ou o Suporte de qualquer um dos Ninjas dele, esse jogador compra 1 card.",
    ],
  },
  "tp3-m-787": {
    name: "Estilo Dinheiro: Jutsu \"Me Ajudem\"",
    text: [
      "Efeito: Procure no seu Deck 1 card de Cliente, revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck e compre 1 card para cada um dos seus Clientes.",
    ],
    flavor: "\"O que vocês estão fazendo? Eu tenho muito dinheiro, então me salvem!\"",
  },
};
