import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * S19 — Path of Pain, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/s19-path-of-pain.ts`.
 * Os títulos [..] seguem o impresso deste set, em maiúsculas. "Sacrifice" = "Sacrifício"; "Combination" = "Combinação".
 */
export const S19_PATH_OF_PAIN_PTBR: CardTranslations = {
  // ── NINJA ──
  "s19-n-1000": {
    name: "Pain (Caminho Deva)",
    text: [
      "[CAMINHO DEVA]",
      "Sacrifício: 1 Ninja ou Cliente",
      "No início do seu turno, você pode escolher 1 dos Ninjas do seu oponente. Nesse caso, se o seu Marcador de Turnos for par, esse Ninja deve ser enviado para a Batalha durante este turno. Se não, esse Ninja não pode ser enviado para a Batalha durante este turno.",
    ],
  },
  "s19-n-1001": {
    name: "Camaleão Gigante",
    text: [
      "[CRIA DO PAIN]",
      "se você não tiver um Ninja com \"Pain\" no nome, este Ninja recebe -2/-2.",
      "Válido: Quando você for \"Sacrificar\" este Ninja, mova-o para a sua mão em vez disso.",
    ],
    flavor: "\"Ssssssss!!!!!\"",
  },
  "s19-n-1002": {
    name: "Quimera Gigante",
    text: [
      "[CRIA DO PAIN]",
      "Quando o Time deste Ninja for Derrotado, você pode colocar em jogo 1 moeda (que simboliza um Ninja \"Quimera\") com o seguinte:",
      "\"[Poder: 2/0 (Saudável e Ferido) / Custo de Entrada: 0 / \"Animal\" / \"Rinnegan\"]",
    ],
    flavor: "\"Grrr...\"",
  },
  "s19-n-1003": {
    name: "Pain (Caminho Animal)",
    text: [
      "[CAMINHO ANIMAL]",
      "Sacrifício: 1 Ninja ou Cliente",
      "No início do turno, se o seu Marcador de Turnos for ímpar, você pode colocar em jogo 1 moeda (que simboliza um Ninja \"Cria do Pain\") com o seguinte: \"[Poder: 3/0 (Saudável e Ferido) / \"Animal\" / \"Rinnegan\"] [Válido: No final do turno, descarte este Ninja.]",
    ],
    flavor: "\"Sensei, você ainda é só um homem...\"",
  },
  "s19-n-1004": {
    name: "Pain (Caminho Preta)",
    text: [
      "[CAMINHO PRETA]",
      "Sacrifício: 1 Ninja ou Cliente",
      "Durante a Troca de Jutsu, se o seu Marcador de Turnos for ímpar, você pode negar 1 efeito de Ninja ou 1 Jutsu sendo jogado.",
    ],
  },
  "s19-n-1005": {
    text: [
      "[OLHOS DA SERPENTE]",
      "Válido: Quando os Ninjas do seu oponente receberem Dano ou forem feridos, mova-os para a área de Chakra do dono deles em vez disso.",
    ],
  },
  "s19-n-1006": {
    text: [
      "[PLANO FRUSTRADO]",
      "Válido: Quando o seu oponente baixar um Ninja por Emboscada, você pode colocar um Marcador de Crescimento sobre este Ninja.",
    ],
  },
  "s19-n-949": {
    name: "Lacaio de Argila Explosiva",
    text: [
      "[ARTE EXPLOSIVA]",
      "Durante a sua Fase de Missão, enquanto este card estiver na Pilha de Descartes, você pode carregar 1 card de Ninja Deidara da sua mão. Nesse caso, coloque este card de Ninja em jogo.",
    ],
    flavor: "\"Vou brincar com você mais um pouco!\"",
  },
  "s19-n-950": {
    text: [
      "[MENTE CALMA]",
      "Válido: Os seus Ninjas ganham +1 de Poder Mental para cada Marcador de Crescimento sobre eles.",
    ],
    flavor: "\"Vai com tudo!\"",
  },
  "s19-n-951": {
    text: [
      "[TÁTICA DA FLOR]",
      "Válido: Quando você virar um Prêmio de Batalha com a face para cima, este Ninja ganha +2/+0 durante este turno.",
    ],
    flavor: "\"Se vai ser mano a mano, eu nunca vou perder para um Ninja Renegado!\"",
  },
  "s19-n-952": {
    text: [
      "[TÁTICA DA ÁRVORE]",
      "Válido: Este Ninja ganha +1/+1 enquanto o seu oponente tiver 3 ou mais Prêmios de Batalha com a face para cima.",
      "Válido: No início do seu turno, você pode virar 1 dos Prêmios de Batalha do seu oponente com a face para cima.",
    ],
    flavor: "\"Deixe-me vingar o Kikunojou.\"",
  },
  "s19-n-953": {
    text: [
      "[RACIOCÍNIO RÁPIDO]",
      "Válido: Enquanto você tiver Ninjas com Poder Mental somado 10 ou mais, o Time deste Ninja usa o valor de Poder Mental em vez do valor de Poder do Time durante o Showdown.",
      "Válido: Os outros Ninjas do Time deste Ninja ganham +1 de Poder Mental.",
    ],
    flavor: "\"Pelos meus cálculos... para vocês dois, acabou.\"",
  },
  "s19-n-954": {
    text: [
      "[ESTOQUE DE ARMAS]",
      "Durante a sua Fase de Missão, você pode escolher 1 dos Prêmios de Batalha de Terra do seu oponente com a face para cima. Nesse caso, mova o card escolhido para a sua mão, e o seu oponente ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Não deu, ele escapou.\"",
  },
  "s19-n-955": {
    text: [
      "[MEDITAÇÃO]",
      "Enquanto você tiver Ninjas com Poder Mental somado 8 ou mais, o Time deste Ninja não pode ser afetado pelos cards de Jutsu do seu oponente.",
    ],
    flavor: "\"Não sei o que os traz aqui... mas deem meia-volta e vão para casa!\"",
  },
  "s19-n-956": {
    text: [
      "[PLANEJAMENTO]",
      "Durante a Troca de Jutsu, se você tiver Ninjas com Poder Mental somado 12 ou mais, pode mover 1 card de Jutsu ou de Missão da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"...Vejo que não posso mais me conter... Desculpe...\"",
  },
  "s19-n-957": {
    text: [
      "[ESTILO DE ARTE SUPERPLANA]",
      "Quando este Ninja se tornar o Usuário de um Jutsu, você pode colocar 1 Marcador de Crescimento sobre este Ninja. Durante a sua Fase de Missão, você pode retirar um Marcador de Crescimento deste Ninja. Nesse caso, cause 1 Dano a 1 Ninja.",
    ],
  },
  "s19-n-958": {
    text: [
      "[O ARTISTA E O IDIOTA]",
      "Válido: Quando este Ninja for colocado em jogo, procure no seu Deck até 2 cards com \"Deidara\" ou \"Tobi\" no nome.",
      "Válido: Durante a Troca de Jutsu, você pode descartar 1 card de Ninja Deidara ou Tobi da sua mão. Nesse caso, cause 1 Dano a 1 Ninja Em Combate contra este Ninja.",
    ],
    flavor: "\"Tobi, você sabe o que fazer, né?!!\" \"Sim, senhor, parceiro!\"",
  },
  "s19-n-959": {
    text: [
      "[RASTREADOR LÍDER]",
      "Rastreamento",
      "O Ninja Rastreado do seu oponente só pode ser enviado para Bloquear como Ninja Líder.",
    ],
    flavor: "\"Impossível.\"",
  },
  "s19-n-960": {
    text: [
      "[RASTREADOR CONCENTRADO]",
      "Válido: Quando o Time deste Ninja conseguir qualquer Vitória enquanto estiver Em Combate contra um Ninja Rastreado, o seu oponente descarta 1 card da mão.",
    ],
    flavor: "\"Vamos trabalhar juntos...\"",
  },
  "s19-n-961": {
    text: [
      "[RASTREADOR DA MATILHA]",
      "Rastreamento",
      "Válido: Enquanto o seu oponente tiver um Ninja Rastreado, este Ninja ganha +0/+1 para cada outro Ninja \"Cão Ninja\" do Time dele.",
    ],
    flavor: "\"Olá, Sakura.\"",
  },
  "s19-n-962": {
    text: [
      "[RASTREADOR ESTOICO]",
      "Quando o Time deste Ninja for bloqueado por um Time que inclua um Ninja Rastreado, você pode comprar 1 card e depois descartar 1 card.",
    ],
    flavor: "\"Eu vou fazer dupla com o Shino.\"",
  },
  "s19-n-963": {
    text: [
      "[TREINO ESPECIALIZADO]",
      "Quando este Ninja se tornar o Usuário de um Jutsu com \"Requerimentos: Taijutsu\", você pode escolher 1 Ninja Em Combate contra este Ninja. Nesse caso, o Ninja escolhido recebe -2/+0 durante este turno.",
    ],
    flavor: "\"Se você não vem até mim, eu vou até você!\"",
  },
  "s19-n-964": {
    text: [
      "[EXAMINADOR DE ELITE]",
      "Válido: Este Ninja não pode ser afetado por Jutsus com custo ① ou ②.",
    ],
    flavor: "\"Desculpe, mas o Exame Chunin acabou.\"",
  },
  "s19-n-965": {
    name: "Rei Macaco Enma",
    text: [
      "[REI DAS FERAS]",
      "Baixar os seus cards de Ninja \"Animal\" não conta para a restrição de \"1 Ninja por turno\".",
      "Válido: Enquanto este Ninja estiver no mesmo Time que \"O Terceiro Hokage\", ele ganha +2/+2.",
    ],
    flavor: "\"Orochimaru... então chegou a isto, afinal...\"",
  },
  "s19-n-966": {
    text: [
      "[OPONENTE PERIGOSO]",
      "Válido: Quando este Ninja se tornar o Usuário de um Jutsu, você pode colocar uma Moeda Ninja de -1/-1 sobre 1 Ninja Em Combate contra este Ninja.",
    ],
    flavor: "\"O Yamato me contou tudo. Sobre o Sasuke também.\"",
  },
  "s19-n-967": {
    text: [
      "[Emboscada: Durante a sua Fase de Missão, enquanto este card estiver na sua área de Chakra, você pode baixá-lo.]",
      "[Maestria: Válido: Quando o efeito de um Jutsu usado por este Ninja for aplicado, você pode pagar 1 Chakra que compartilhe um Símbolo com esse Jutsu. Nesse caso, devolva esse Jutsu à sua mão.]",
    ],
    flavor: "\"Não há pressa... descanse agora. Senão, deve demorar um bom tempo.\"",
  },
  "s19-n-968": {
    name: "O Terceiro Hokage",
    text: [
      "[PELO BEM MAIOR]",
      "Durante a Troca de Jutsu, você pode remover do jogo os 7 cards do topo do seu Deck. Nesse caso, cause 1 Dano a 1 Ninja Em Combate contra este Ninja. Você pode ativar este efeito quantas vezes quiser.",
    ],
  },
  "s19-n-969": {
    text: [
      "[O PORTÃO DA ALEGRIA]",
      "Válido: Os seus Ninjas \"Taijutsu\" podem usar o Surto quantas vezes quiserem num turno.",
    ],
    flavor: "\"Os 8 Portões Internos! O Sexto Portão! Keimon, LIBERAR!\"",
  },
  "s19-n-970": {
    text: [
      "[COMBINAÇÃO PERFEITA]",
      "Válido: Quando o Time deste Ninja conseguir qualquer Vitória, faça uma Fase de Batalha adicional depois desta. Nesse caso, só o Time deste Ninja pode ser enviado para Atacar.",
    ],
    flavor: "\"Lee!! Agora.. Exploda!!!\" \"Sim, senhor!!\"",
  },
  "s19-n-971": {
    text: [
      "[TRAJE ESPECIAL]",
      "Válido: Quando este Ninja se tornar o Usuário de um Jutsu com \"Requerimentos: Taijutsu\", você pode dar +2/+0 a este Ninja durante este turno.",
    ],
    flavor: "\"He He... Um shinobi lê os significados ocultos dentro dos significados ocultos.\"",
  },
  "s19-n-972": {
    text: [
      "[ATAQUE FURTIVO]",
      "Durante a Fase de Missão, você pode mover 1 card de Jutsu da sua Pilha de Descartes para a sua mão. Nesse caso, remova este Ninja do jogo.",
    ],
    flavor: "\"O que é esse cara, imortal?\"",
  },
  "s19-n-973": {
    text: [
      "[LIÇÃO UM: TRANSFORMAÇÃO]",
      "Válido: Durante a Troca de Jutsu, você pode pagar 1 Chakra de Raio. Nesse caso, troque os valores de Combate e de Suporte de 1 dos seus Ninjas.",
    ],
    flavor: "\"Hoje na aula vamos revisar a arte da transformação.\"",
  },
  "s19-n-974": {
    name: "Tartaruga Ninja",
    text: [
      "[FORÇA OCULTA]",
      "Válido: Todos os seus Ninjas \"Taijutsu\" ganham \"Surto\"",
      "[Surto: Válido: Durante a Troca de Jutsu, você pode descartar da sua mão 1 card de Ninja com o mesmo nome deste Ninja. Nesse caso, este Ninja ganha +2/+2 durante este turno.]",
    ],
    flavor: "\"Chega, Lee!\"",
  },
  "s19-n-975": {
    text: [
      "[A FERA QUE DESPERTA]",
      "Válido: Durante a sua Fase de Missão, enquanto você tiver 3 ou mais Chakras, pode descartar este Ninja. Nesse caso, coloque em jogo 1 card de Ninja [MANTO DA NOVE CAUDAS] do seu Baralho de Reforço.",
    ],
    flavor: "\"...Devolva...o Sasuke...!\"",
  },
  "s19-n-976": {
    name: "Naruto Uzumaki (Manto da Nove Caudas)",
    text: [
      "[MANTO DA NOVE CAUDAS]",
      "Válido: No início do seu turno, cada jogador move os 3 cards do topo do próprio Deck para a área de Chakra.",
      "Válido: Durante a sua Fase de Missão, enquanto você tiver 5 ou mais Chakras, pode descartar este Ninja. Nesse caso, coloque em jogo 1 card de Ninja [BESTA COM CAUDAS] do seu Baralho de Reforço.",
    ],
    flavor: "\"GRRRAAAR!!!\"",
  },
  "s19-n-977": {
    text: [
      "[MESTRE DOS SAPOS]",
      "Este Ninja é considerado com todos os Símbolos.",
    ],
    flavor: "\"Eu vim fazer um anúncio oficial.\"",
  },
  "s19-n-978": {
    name: "O Quarto Hokage",
    text: [
      "[TELETRANSPORTE]",
      "Válido: Durante a Troca de Jutsu, você pode remover este Ninja do jogo. Nesse caso, devolva este card de Ninja ao jogo no final do turno.",
    ],
  },
  "s19-n-979": {
    text: [
      "[OGROS PRESOS À TERRA]",
      "Rastreamento",
      "Quando o Ninja Rastreado do seu oponente for enviado para Atacar, você pode descartar 1 dos Chakras do seu oponente.",
    ],
  },
  "s19-n-980": {
    text: [
      "[GUARDIÃ DO ESCONDERIJO DO SUL]",
      "Válido: Cada jogador joga com o card do topo do próprio Deck revelado. Enquanto você tiver 2 ou menos cards na mão, se o card do topo do seu Deck for um card de Água, ele pode ser jogado como se estivesse na sua mão.",
    ],
    flavor: "\"Se você quer mesmo que eu vá, Sasuke... eu vou te seguir.\"",
  },
  "s19-n-981": {
    name: "Tayuya (Estado 1)",
    text: [
      "[A CANÇÃO DO PORTÃO NORTE]",
      "Quando uma Missão for jogada, você pode descartar o card do topo do seu Deck. Nesse caso, descarte 1 dos Chakras do seu oponente.",
    ],
    flavor: "\"Podem vir, pirralhos.\"",
  },
  "s19-n-982": {
    text: [
      "[O DEMÔNIO DO ESCONDERIJO DO LESTE]",
      "Quando um card for movido para a sua área de Chakra, este Ninja ganha +1/+0 durante este turno.",
    ],
    flavor: "\"Estou livre... enfim...\"",
  },
  "s19-n-983": {
    name: "Jugo (Estado 1)",
    text: [
      "[O PRISIONEIRO DO ESCONDERIJO DO NORTE]",
      "Válido: Quando o seu oponente colocar um Ninja em jogo, se você não tiver cards na mão, mova 1 card da sua Pilha de Descartes para a sua área de Chakra.",
    ],
    flavor: "\"Eu vou sair daqui. E quem ficar no meu caminho... morre!\"",
  },
  "s19-n-984": {
    text: [
      "[ENCANTADORA DE SERPENTES]",
      "Válido: Quando você colocar um Ninja em jogo, descarte 1 dos Chakras do seu oponente",
    ],
    flavor: "\"Este é o grupo que o Kakashi anda treinando, não é?\"",
  },
  "s19-n-985": {
    text: [
      "[VENENO DA SERPENTE]",
      "No início do seu turno, se o seu oponente não tiver Chakras, você pode comprar 1 card.",
    ],
    flavor: "\"Só mais um pouco... mais um pouquinho de paciência, e ele é meu!\"",
  },
  "s19-n-986": {
    text: [
      "[AS PRESAS DA COBRA]",
      "Quando este Ninja for enviado para Atacar, você pode mover 1 Chakra para o fundo do Deck do dono dele.",
      "Os jogadores sem Chakras não podem jogar cards de Missão.",
    ],
    flavor: "\"Eu tenho um objetivo. E um time pequeno vai me deixar chegar a ele mais rápido.\"",
  },
  "s19-n-987": {
    name: "Kabuto Yakushi (Modo Possuído)",
    text: [
      "[ALÉM DO OROCHIMARU]",
      "Sacrifício: \"Kabuto Yakushi\" ou \"Orochimaru\"",
      "Durante a sua Fase de Missão, enquanto você não tiver cards na mão, pode jogar 1 card de Missão da área de Chakra de qualquer jogador, ignorando o Custo de Mão. Depois, remova-o do jogo.",
      "Válido: Quando uma Missão for jogada, cure este Ninja.",
    ],
    flavor: "\"Vou usar o que eu absorvi do Orochimaru...\"",
  },
  "s19-n-988": {
    name: "Tayuya (Estado 2)",
    text: [
      "[A CANÇÃO DO SILÊNCIO]",
      "Sacrifício: \"Tayuya (Estado 1)\"",
      "Válido: Enquanto você não tiver cards na mão, os efeitos ativados dos Ninjas do seu oponente custam 1 a mais para usar.",
    ],
    flavor: "\"Nunca achei que fosse usar o segundo estado aqui.\"",
  },
  "s19-n-989": {
    name: "Kakuzu (Forma de Alma)",
    text: [
      "[OS FIOS DO PODER SUPREMO]",
      "Sacrifício: \"Kakuzu\" e 2 Ninjas",
      "Válido: Quando o Time deste Ninja conseguir qualquer Vitória, o seu oponente move para a área de Chakra todos os cards que compraria durante o próximo turno, em vez de comprá-los.",
    ],
  },
  "s19-n-990": {
    text: [
      "[FOICE DE VENTO]",
      "Válido: Quando um Ninja do Time deste Ninja se tornar o Usuário de um card de Jutsu, este Ninja ganha +1/+1 durante este turno.",
    ],
  },
  "s19-n-991": {
    text: [
      "[ALUNA ASTUTA]",
      "Quando o seu oponente colocar um Ninja em jogo, este Ninja ganha +3/+0 durante este turno.",
    ],
    flavor: "\"Agora, isto é tudo o que eu consigo fazer. Não posso me dar ao luxo de falhar!\"",
  },
  "s19-n-992": {
    text: [
      "[FORÇA MENTAL]",
      "Válido: Quando este Ninja for colocado em jogo, os seus Ninjas não podem ser tornados Reserva durante este turno.",
    ],
    flavor: "\"Kakashi... Obito...\"",
  },
  "s19-n-993": {
    text: [
      "[ESTRATEGISTA EXCELENTE]",
      "Válido: Durante a Troca de Jutsu, você pode mudar a posição dos Ninjas do Time deste Ninja.",
    ],
    flavor: "\"Desta vez, trate de não chorar na minha frente.\"",
  },
  "s19-n-994": {
    text: [
      "[SACRIFÍCIO]",
      "Válido: Durante a sua Fase de Missão, você pode remover este Ninja do jogo. Nesse caso, coloque em jogo um card de Ninja de Vento da sua Pilha de Descartes com Custo de Entrada igual ou menor que o seu Marcador de Turnos.",
    ],
    flavor: "\"As coisas que eu fiz no passado foram só erros... Mas... na minha última hora, parece que finalmente vou poder fazer a coisa certa.\"",
  },
  "s19-n-995": {
    text: [
      "[SOLDADO FERVOROSA]",
      "Enquanto você tiver 2 ou mais Ninjas \"Médico\", os cards de Jutsu do seu oponente que tenham os seus Ninjas como alvo custam 1 a mais para usar.",
    ],
    flavor: "\"Sai da minha frente!\"",
  },
  "s19-n-996": {
    text: [
      "[REVERSÃO DE GENJUTSU]",
      "Quando um Ninja do Time deste Ninja se tornar o único alvo de um Jutsu do seu oponente, você pode pagar 2 Chakras de Vento. Nesse caso, aplique o efeito desse Jutsu ao Usuário dele em vez disso.",
    ],
    flavor: "\"Você acha que me pegou com isso? Quem foi pego foi você.\"",
  },
  "s19-n-997": {
    text: [
      "[A ELITE DA FOLHA]",
      "Quando este Ninja for colocado em jogo, você pode curar 1 dos seus Ninjas. Nesse caso, pode ferir 1 dos Ninjas do seu oponente com Custo de Entrada igual ou menor que o do Ninja curado.",
      "Válido: Os seus cards de Missão não podem ser afetados pelos efeitos do seu oponente.",
    ],
    flavor: "\"Para proteger... a minha terra natal... a Vila da Folha...!\"",
  },
  "s19-n-998": {
    text: [
      "[DEVASTAÇÃO]",
      "Quando o Time deste Ninja conseguir qualquer Vitória, o seu oponente move 2 cards da mão para o topo do Deck dele, em qualquer ordem.",
    ],
  },
  "s19-n-999": {
    text: [
      "[O ANJO DO PAIN]",
      "Válido: Quando você Sacrificar um Ninja, pode comprar 1 card.",
    ],
    flavor: "\"Recebi ordens do nosso deus.\"",
  },

  // ── JUTSU ──
  "s19-j-743": {
    name: "Argila Explosiva: Cobra",
    text: [
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Negue o alvo e mova-o para o fundo do Deck do dono dele.",
    ],
    flavor: "\"He He... A vitória aqui é minha.\"",
  },
  "s19-j-744": {
    name: "Argila Explosiva: Dragão C2",
    text: [
      "Requerimentos: Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O alvo passa a ser um Ninja Reserva. Se o seu oponente tiver 3 ou mais Prêmios de Batalha com a face para cima, mova o alvo para o topo do Deck do dono dele em vez disso. Depois, vire 3 dos Prêmios de Batalha do seu oponente com a face para baixo.",
    ],
    flavor: "\"O pop está morto! A minha arte é superplana, hmm?!\"",
  },
  "s19-j-745": {
    name: "Argila Explosiva: Minas",
    text: [
      "Efeito: O Usuário ganha +5/+0 durante este turno. Se o custo maior deste Jutsu tiver sido pago, compre 2 cards, e este Jutsu não pode ser afetado pelos efeitos do seu oponente.",
    ],
    flavor: "\"...O que quer dizer que o C2 é a minha melhor aposta.\"",
  },
  "s19-j-746": {
    name: "Argila Explosiva: C3 Ohako",
    text: [
      "Requerimentos: Terra + Custo de Entrada 5 ou mais",
      "Efeito: Cause 2 Danos a todo Ninja com Custo de Entrada 2 ou menos.",
    ],
    flavor: "\"De todas as minhas bonecas, a Ohako é a minha obra-prima favorita, cheia de Chakra C3.\"",
  },
  "s19-j-747": {
    name: "Argila Explosiva: C4 Karura",
    text: [
      "Requerimentos: Deidara + Custo de Entrada 4 ou mais",
      "Alvo: 1 Ninja",
      "Efeito: Remova o alvo do jogo. Depois, fira cada um dos outros Ninjas do Time do alvo.",
    ],
    flavor: "\"Sayonara, Sasuke!\"",
  },
  "s19-j-748": {
    name: "Jutsu Clone de Argila",
    text: [
      "Requerimentos: Terra + Custo de Entrada 4 ou mais",
      "Efeito: Mova este Jutsu para o Time do Usuário, em qualquer posição, como um Ninja com o seguinte: \"[Poder: 2/2 (Saudável e Ferido) / Custo de Entrada: 0], [Válido: Quando qualquer um dos seus Ninjas for receber qualquer Dano, este Ninja o recebe em vez disso.]\"",
    ],
    flavor: "\"Desta vez acabou de verdade!!\"",
  },
  "s19-j-749": {
    name: "Lâmina de Relâmpago",
    text: [
      "Requerimentos: Kakashi Hatake",
      "Alvo: 1 Ninja",
      "Efeito: O alvo recebe -10/+0 durante este turno.",
    ],
    flavor: "\"Aquele Jutsu não exigia só mudar a natureza do meu chakra para Raio...\"",
  },
  "s19-j-750": {
    text: [
      "Requerimentos: Kakashi Hatake ou Itachi Uchiha",
      "Alvo: 1 Ninja",
      "Efeito: Remova o alvo do jogo. Nesse caso, no final deste turno, devolva esse Ninja ao jogo em qualquer um dos Times do dono dele, em qualquer posição.",
    ],
    flavor: "\"Eu teletransportei ele... e a explosão para outro espaço.\"",
  },
  "s19-j-751": {
    name: "Antecipação",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O Poder do alvo passa a ser igual ao Poder impresso durante este turno. Se o Usuário tiver \"Olho Sharingan\", negue e descarte 1 Jutsu sendo jogado pelo alvo.",
    ],
    flavor: "\"Seja uma ilusão de genjutsu ou uma técnica de luta de ninjutsu... Tem algum tipo de mágica aqui!\"",
  },
  "s19-j-752": {
    name: "Fadiga",
    text: [
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Fira o Usuário do alvo.",
    ],
    flavor: "\"argh... repouso de novo...?",
  },
  "s19-j-753": {
    name: "Ordens de Rastreamento",
    text: [
      "Efeito: Mova todos os seus Ninjas com Rastreamento para o Time do Usuário, em qualquer posição.",
    ],
    flavor: "\"Muito bem, vou explicar as escalas das nossas patrulhas.\"",
  },
  "s19-j-754": {
    name: "Transformação Animal",
    text: [
      "Alvo: Usuário",
      "Efeito: Descarte um card de Ninja \"Animal\" da sua mão. Nesse caso, o alvo ganha +X/+X durante este turno, sendo X o valor de Combate do card descartado.",
    ],
    flavor: "\"Enma!! Bastão Nyoi Indestrutível!!!\"",
  },
  "s19-j-755": {
    name: "Furacão da Folha",
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Efeito: Mova da sua Pilha de Descartes para a sua mão os cards de Ninja com o mesmo nome do Usuário.",
      "Combinação (\"Taijutsu\"): Mova 1 card de Jutsu com \"Requerimentos: Taijutsu\" da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "Furacão da Folha!!!",
  },
  "s19-j-756": {
    name: "Oito Portões Internos",
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Efeito: Mova quantos cards de Jutsu quiser da sua mão para o fundo do seu Deck. Nesse caso, se o Usuário conseguir qualquer Vitória, o Time do Usuário ganha Prêmios de Batalha iguais ao número de cards de Jutsu movidos por este efeito.",
    ],
    flavor: "\"Este é o grand finale!!!\"",
  },
  "s19-j-757": {
    name: "Lótus Primário",
    text: [
      "Requerimentos: \"Taijutsu\"",
      "Efeito: Mova para a sua mão todos os cards de Jutsu com \"Requerimentos: Taijutsu\" da sua Pilha de Descartes e da sua área de Chakra. Durante este turno, quando o efeito dos seus Jutsus for aplicado, mova esse card de Jutsu para o fundo do seu Deck em vez da área de Chakra.",
    ],
    flavor: "\"Te peguei!!!\"",
  },
  "s19-j-758": {
    name: "Furacão da Folha",
    text: [
      "Alvo: Usuário",
      "Efeito: O alvo ganha +2/+0.",
      "Combinação (Taijutsu): Devolva este card de Jutsu à sua mão.",
    ],
    flavor: "\"AGORA!!\"",
  },
  "s19-j-759": {
    name: "Armadilha da Boca do Sapo",
    text: [
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Negue o alvo",
      "Combinação (\"Sapo Ninja\"): O Usuário ganha +2/+2 durante este turno.",
    ],
    flavor: "\"Vocês estão dentro do estômago de um sapo.\"",
  },
  "s19-j-760": {
    name: "Cavalinho",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O Poder impresso do Usuário passa a ser igual ao do alvo durante este turno.",
      "Combinação (\"Jonin\"): O Usuário ganha +X/+Y durante este turno, sendo X o Combate do alvo e Y o Suporte do alvo.",
    ],
    flavor: "\"Muito bem, pessoal, agora vamos andando!!!\"",
  },
  "s19-j-761": {
    name: "Estilo Fogo: Enxaqueca Escaldante",
    text: [
      "Alvo: Cada um dos Ninjas Líderes do seu oponente",
      "Efeito: O alvo recebe -1/+0 e -2 de Poder Mental durante este turno. Enquanto você não tiver cards na mão, este card de Jutsu pode ser jogado da sua área de Chakra.",
      "Combinação (\"Alma\"): Fira 1 Ninja Em Combate contra o Usuário.",
    ],
    flavor: "\"Estilo Fogo! Enxaqueca Escaldante!!\"",
  },
  "s19-j-762": {
    name: "Golpe da Serpente das Sombras",
    text: [
      "Requerimentos: Água + Custo de Entrada 3 ou mais",
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Mude o efeito do alvo para o seguinte: Fira o Usuário. Enquanto você não tiver cards na mão, este card de Jutsu pode ser jogado da sua área de Chakra.",
    ],
    flavor: "\"Heh... Imagino que você esteja paralisado agora.\"",
  },
  "s19-j-763": {
    name: "Jutsu Golpe das Múltiplas Serpentes das Sombras",
    text: [
      "Requerimentos: Água + Custo de Entrada 5 ou mais",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Mova o alvo para a área de Chakra do dono dele. Enquanto você não tiver cards na mão, este card de Jutsu pode ser jogado da sua área de Chakra.",
    ],
    flavor: "\"Intrigante...\"",
  },
  "s19-j-764": {
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Fira o alvo. Se o Usuário for \"Sasuke Uchiha\", o Poder do alvo passa a ser 0/0 durante este turno. Enquanto você não tiver cards na mão, este card de Jutsu pode ser jogado da sua área de Chakra.",
    ],
    flavor: "\"Parece que você gastou todo o seu chakra... A sua reação está lenta.\"",
  },
  "s19-j-765": {
    name: "Soco de Chakra",
    text: [
      "Alvo: 2 Jutsus sendo jogados",
      "Efeito: Fira o(s) Usuário(s) do alvo. Depois, negue o alvo.",
    ],
    flavor: "\"Lá vou eu!\"",
  },
  "s19-j-766": {
    name: "Raiva Justa",
    text: [
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: O texto de efeito do alvo e de todos os Ninjas com o mesmo nome do alvo é negado até o final do turno.",
    ],
    flavor: "\"Vou contar até cinco. Vá embora antes de eu terminar. Senão, eu mesma te faço sumir.\"",
  },
  "s19-j-767": {
    name: "Chute da Raiva!",
    text: [
      "Requerimentos: \"Feminino\"",
      "Alvo: 1 Ninja Em Combate contra o Usuário",
      "Efeito: Fira o alvo. Se o alvo for um Ninja \"Masculino\" com Custo de Entrada igual ou menor que o do Usuário, o alvo passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Naruto!\"",
  },
  "s19-j-768": {
    name: "Cura pelas Palmas",
    text: [
      "Requerimentos: \"Médico\"",
      "Efeito: Escolha um dos efeitos a seguir e aplique-o de acordo com o número dos seus cards de Ninja \"Médico\" em jogo.",
      "2+) Cure dois dos seus ninjas e coloque um marcador de crescimento sobre cada um deles",
      "3+) Fira um ninja Em Combate contra o Usuário e compre um card",
      "4+) Torne Ninja Reserva um ninja Em Combate contra o Usuário e mova 4 cards da sua pilha de descartes para a sua área de chakra.",
    ],
    flavor: "\"Agora ela precisa de repouso\"",
  },
  "s19-j-769": {
    name: "Coordenação",
    text: [
      "Alvo: Usuário",
      "Efeito: Remova o alvo do jogo. Nesse caso, devolva o alvo ao jogo em qualquer um dos seus Times, em qualquer posição.",
    ],
    flavor: "\"O que você está pensando?\" \"Eu explico depois, pelo amor de Deus. Você vai fazer ou não?\"",
  },
  "s19-j-770": {
    name: "As Presas de Pain",
    text: [
      "Requerimentos: \"Rinnegan\" + \"Animal\"",
      "Efeito: Avance o seu Marcador de Turnos em 1.",
      "Combinação (\"Rinnegan\"): Mova 1 card do fundo do seu Deck para a sua mão.",
    ],
    flavor: "\"Os cachorrinhos estão presos a um jutsu de invocação que se replica?\"",
  },
  "s19-j-771": {
    name: "As Asas de Pain",
    text: [
      "Requerimentos: \"Rinnegan\"",
      "Alvo: 1 Jutsu sendo jogado",
      "Efeito: Se o seu Marcador de Turnos for ímpar, mude o efeito do alvo para o seguinte: Recue o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Sim, mas não é só isso. Ao mesmo tempo... Jutsu de Invocação!\"",
  },
  "s19-j-772": {
    text: [
      "Requerimentos: \"Rinnegan\" + \"Maestria\"",
      "Efeito: Aplique 1 dos efeitos a seguir de acordo com o seu Marcador de Turnos:",
      "Par: Embaralhe 1 Missão ou Ninja no Deck do dono dele.",
      "Ímpar: Mova 3 cards do fundo do seu Deck para a sua mão.",
    ],
    flavor: "\"Esse é o Rinnegan? Que olhos horríveis...\"",
  },

  // ── MISSÃO ──
  "s19-m-699": {
    name: "Estratégia Intelectual",
    text: [
      "Permanente: (3)",
      "Efeito: No início da sua Fase de Batalha, se o Poder Mental total dos seus Ninjas for 8 ou mais, você pode comprar 1 card.",
    ],
    flavor: "\"Eu não sou tão lógico quanto você pensa.\"",
  },
  "s19-m-700": {
    name: "Habilidades Afiadas",
    text: [
      "Permanente: (3)",
      "Efeito: Os efeitos dos seus Ninjas são Válidos.",
      "Enquanto este card estiver na sua área de Chakra, os seus Ninjas de Terra ganham +1 de Poder Mental.",
    ],
  },
  "s19-m-701": {
    name: "Pergaminho de Estratégia",
    text: [
      "Permanente (3)",
      "Efeito: Quando você virar um Prêmio de Batalha com a face para cima por causa de um efeito, pode descartar 1 card. Nesse caso, compre 1 card.",
    ],
    flavor: "\"Shikamaru, qual é o nosso próximo passo?\"",
  },
  "s19-m-702": {
    name: "Impasse no Telhado",
    text: [
      "Permanente",
      "Efeito: Os Ninjas que não forem baixados da mão de um jogador não podem ser enviados para a Batalha durante o turno em que forem colocados em jogo.",
    ],
    flavor: "\"Vamos começar a busca pelo Templo do Fogo.\"",
  },
  "s19-m-703": {
    name: "Lições do Passado",
    text: [
      "Efeito: Os dois jogadores compram 2 cards. O seu oponente descarta 2 cards no final do turno.",
    ],
  },
  "s19-m-704": {
    name: "Selo da Morte do Ceifador",
    text: [
      "Permanente",
      "Efeito: No início do seu turno, compre 2 cards. Nesse caso, o seu oponente ganha 1 Prêmio de Batalha.",
      "Esta Missão não pode ser afetada por efeitos nem retirada de jogo.",
    ],
    flavor: "\"Selar!!\"",
  },
  "s19-m-705": {
    name: "Sacrifício",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Descarte o alvo. Nesse caso, fira todos os Ninjas com Custo de Entrada igual ao Custo de Entrada do Ninja descartado.",
    ],
    flavor: "\"Eu tive que fazer.\"",
  },
  "s19-m-706": {
    name: "Treino Supervisionado",
    text: [
      "Permanente",
      "Efeito: Os Prêmios de Batalha não podem ser descartados pelos efeitos de Missões.",
    ],
    flavor: "\"Devíamos começar o exercício.\"",
  },
  "s19-m-707": {
    text: [
      "Efeito: Descarte um card de Ninja da sua mão. Nesse caso, mova um card de Ninja da sua Pilha de Descartes para a sua mão.",
    ],
    flavor: "\"São gatos ninja. Cuidado, ou eles te arranham todo.\"",
  },
  "s19-m-708": {
    name: "Explosão de Poder",
    text: [
      "Permanente",
      "Efeito: Quando 1 dos seus Ninjas \"Taijutsu\" usar o Surto, se todos os seus Ninjas forem Ninjas \"Taijutsu\", compre 1 card.",
    ],
    flavor: "\"Rápido! Igualzinho a... ele...\"",
  },
  "s19-m-709": {
    name: "Besta com Caudas Libertada",
    text: [
      "Efeito: Procure no seu Deck um card de Jutsu com \"Requerimentos: Forma de Besta com Caudas\", revele-o e mova-o para a sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Estou com um mau pressentimento...\"",
  },
  "s19-m-710": {
    name: "Habilidade Surpresa",
    text: [
      "Permanente",
      "Efeito: Durante a Troca de Jutsu, você pode descartar um card. Nesse caso, mova os 2 cards do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Olhem! Ali...\"",
  },
  "s19-m-711": {
    name: "Promessa de Voltar",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, escolha 1 dos seus Ninjas. Quando o Ninja escolhido for ser retirado de jogo pelo efeito do seu oponente ou pelo Showdown, descarte esta Missão em vez disso.",
    ],
    flavor: "\"Você vai ver...\"",
  },
  "s19-m-712": {
    name: "O Teste de Kakashi",
    text: [
      "Permanente",
      "Efeito: Quando um jogador jogar um Jutsu, esse jogador compra 1 card e depois descarta 1 card.",
    ],
    flavor: "\"As regras são as mesmas de quando nos conhecemos.\"",
  },
  "s19-m-713": {
    name: "A Grande Ponte Naruto",
    text: [
      "Alvo: 1 card de Missão de \"Anulação\" sendo jogado ou 1 card em jogo",
      "Efeito: Negue o texto de efeito do alvo. Depois, mova o card do topo do seu Deck para a sua área de Chakra. (Esta Missão não conta para o limite de 1 Missão por turno.)",
    ],
    flavor: "\"Nada. Vamos.\"",
  },
  "s19-m-714": {
    name: "A Alegria de Suigetsu",
    text: [
      "Efeito: Cada jogador move todos os cards da mão, menos 1, para a área de Chakra. Depois, cada jogador compra 2 cards.",
    ],
    flavor: "\"Este iogurte é o melhor.\"",
  },
  "s19-m-715": {
    name: "O Poder do Estado 2",
    text: [
      "Permanente",
      "Efeito: Todos os seus Ninjas e cards de Ninja \"Os Quatro Ninjas do Som\", \"Kimimaro\" e \"Hebi\" ganham \"Emboscada\" e \"Estado 2\".",
    ],
    flavor: "\"Mas você é mesmo o cara, conseguindo fazer uma Transformação Parcial.\"",
  },
  "s19-m-716": {
    name: "Juramento ao Pôr do Sol",
    text: [
      "Efeito: Se você tiver pago o Custo de Mão deste card com um card de Ninja de Água, mova 3 cards da sua Pilha de Descartes para a sua área de Chakra. Depois, descarte 1 dos Chakras do seu oponente para cada cópia deste card na sua área de Chakra.",
    ],
  },
  "s19-m-717": {
    name: "Preparação da Barreira",
    text: [
      "Permanente (2)",
      "Efeito: Durante a sua Fase de Missão, você pode remover 1 dos seus Ninjas do jogo. Nesse caso, devolva esse Ninja ao jogo.",
      "Este card de Missão não pode ser retirado de jogo por efeitos.",
    ],
    flavor: "\"Equipe de selamento! Prontos para o Três Caudas!\"",
  },
  "s19-m-718": {
    name: "Controle de Chakra Perfeito",
    text: [
      "Permanente (1)",
      "Efeito: Quando esta Missão for colocada em jogo, coloque 1 moeda sobre ela para cada um dos seus Ninjas de Vento.",
      "Efeito: Os Custos de Jutsu só podem ser pagos com Chakras que compartilhem um Símbolo com o card de Jutsu.",
    ],
    flavor: "\"Vou fazer o chakra fluir pelo corpo dele... Isso vai trazer a toxina das células para a superfície. Depois ela vai ser absorvida por este líquido... e extraída!\"",
  },
  "s19-m-719": {
    name: "Operação Delicada",
    text: [
      "Permanente (4)",
      "Efeito: Quando o seu oponente jogar um Jutsu, negue e mova esse Jutsu para a mão do dono dele. Nesse caso, retire uma moeda desta Missão.",
    ],
    flavor: "\"Logo vão dar três horas... Por favor, assuma.\"",
  },
  "s19-m-720": {
    name: "Reflexão",
    text: [
      "Permanente (2)",
      "Efeito: Ninjas com Custo de Entrada igual ou menor que o número de cards na sua mão não podem ser enviados para Atacar.",
    ],
    flavor: "\"É que, sempre que eu venho aqui, quero me castigar por ter sido tão tolo no passado.\"",
  },
  "s19-m-721": {
    name: "O Tempo da Dor",
    text: [
      "Efeito: Se você tiver 2 ou mais Ninjas \"Rinnegan\" e/ou \"Akatsuki\", pode avançar o seu Marcador de Turnos em 1. Depois, mova 1 card do fundo do seu Deck para a sua mão.",
    ],
    flavor: "\"Pain... Esse nome é um codinome que representa nós seis.\"",
  },
  "s19-m-722": {
    name: "A Cidade de Pain",
    text: [
      "Permanente",
      "Efeito: Quando esta Missão for colocada em jogo, se você tiver 2 ou mais Ninjas \"Rinnegan\" e/ou \"Akatsuki\", mova 2 cards do fundo do seu Deck para a sua mão.",
      "Efeito: No final do turno, se o seu oponente tiver colocado 2 ou mais Ninjas em jogo, avance o seu Marcador de Turnos em 1.",
    ],
    flavor: "\"Konan... Quando eu parar a chuva, encontre o intruso com o seu jutsu.\"",
  },
};
