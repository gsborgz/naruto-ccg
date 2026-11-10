import type { CardTranslations } from '../../../models/cardTranslation.ts';

/**
 * PR — Naruto CCG: Promos, em PT-BR (efeitos e frases; ver docs/TRADUCAO.md).
 * Traduzido a partir de `src/data/sets/pr-promos.ts`.
 * Os títulos [..] seguem o impresso de cada carta (a maioria em maiúsculas; algumas em caixa mista).
 * As marcações de momento `[Valid | Attacker | Mission | EOJ]` viram `[Válido | Atacante | Missão | Troca de Jutsu]`.
 */
export const PR_PROMOS_PTBR: CardTranslations = {
  // ── NINJA ──
  "promo-n-524": {
    text: [
      "[DOMINANDO A TÉCNICA OCULTA]",
      "Válido: Quando este Ninja for enviado para a Batalha, você pode procurar, entre os 5 cards do topo do seu Deck, 1 card de Jutsu que tenha \"Rasengan\" no nome e/ou \"Requerimentos: 'Naruto Uzumaki'\", mostrá-lo ao seu oponente e colocá-lo na sua mão. Depois, devolva o resto ao topo do seu Deck e embaralhe-o.",
    ],
    flavor: "\"Não pense que eu sou o mesmo da última vez!\"",
  },
  "promo-n-525": {
    text: [
      "[GUARDIÃO DA VILA]",
      "Cada um dos seus Times ganha +2 de Poder do Time e +2 de Poder Mental do Time durante os turnos do seu oponente.",
    ],
    flavor: "\"Eu percebi que a dor, a tristeza e a alegria podiam ser compartilhadas com os outros.\"",
  },
  "promo-n-526": {
    text: [
      "[O OLHO QUE VÊ ATRAVÉS DE TUDO]",
      "Durante a sua Fase de Missão, você pode escolher 1 dos Ninjas do seu oponente. Nesse caso, o Ninja escolhido não pode ser o Usuário de nenhum card de Jutsu durante esse turno e o próximo.",
    ],
    flavor: "\"!!!!!\"",
  },
  "promo-n-ex-001": {
    text: [
      "[O TREINO DO SÁBIO TARADO]",
      "Quando este Ninja for colocado em jogo, exceto pelo efeito de \"Crescimento\", descarte todos os Chakras das áreas de Chakra dos dois jogadores.",
    ],
    flavor: "\"Eu estou dando o meu melhor, pode acreditar!\"",
  },
  "promo-n-ex-002": {
    text: [
      "[Energizando o Corpo]",
      "Este Ninja ganha +2/+0 durante o turno em que for colocado em jogo.",
    ],
    flavor: "\"...Peguei você.\"",
  },
  "promo-n-pr-001": {
    text: [
      "[DECISÃO DE BATALHA]",
      "Se este Ninja estiver saudável, você pode feri-lo no início da Fase de Batalha.",
    ],
    flavor: "\"Vamos com tudo!\"",
  },
  "promo-n-pr-002": {
    text: [
      "[SENSO DE BATALHA]",
      "Se este Ninja se tornar o Usuário de um card de Jutsu, um Símbolo de \"Fogo\" do custo do Jutsu pode ser pago como (1).",
    ],
    flavor: "\"Hunf.\"",
  },
  "promo-n-pr-003": {
    text: [
      "[NINJUTSU DE LIVRO]",
      "Quando este Ninja se tornar o Usuário de um card de Jutsu com custo de Jutsu 1 ou menos (não incluídos os cards de Jutsu que exigem Símbolos específicos), ele ganha +1/+1 durante o turno dele.",
    ],
    flavor: "\"Isso! Eu consigo.\"",
  },
  "promo-n-pr-004": {
    text: [
      "[PRIVILÉGIO DO PROTAGONISTA]",
      "Se o seu oponente tiver dois ou mais Ninjas em jogo a mais que você, este Ninja não entra na restrição de \"1 card de Ninja por turno\".",
    ],
    flavor: "\"Naruto Uzumaki chegou. É isso aí, pode acreditar!\"",
  },
  "promo-n-pr-005": {
    text: [
      "[COMPANHEIRO PRECIOSO]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Sakura Haruno\", ele ganha +1/+1.",
    ],
    flavor: "\"Sakura...\"",
  },
  "promo-n-pr-005r": {
    text: [
      "[COMPANHEIRO PRECIOSO]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Sakura Haruno\", ele ganha +1/+1.",
    ],
    flavor: "\"Sakura...\"",
  },
  "promo-n-pr-006": {
    text: [
      "[COMPANHEIRO PRECIOSO]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Naruto Uzumaki\", ele ganha +1/+1.",
    ],
    flavor: "\"Seu idiota!\"",
  },
  "promo-n-pr-006r": {
    text: [
      "[COMPANHEIRO PRECIOSO]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Naruto Uzumaki\", ele ganha +1/+1.",
    ],
    flavor: "\"Seu idiota!\"",
  },
  "promo-n-pr-007": {
    text: [
      "[COMPANHEIRA PRECIOSA]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Sasuke Uchiha\", ele ganha +1/+1.",
    ],
    flavor: "\"Vou confiar no Sasuke e fazer o que preciso fazer...\"",
  },
  "promo-n-pr-007r": {
    text: [
      "[COMPANHEIRA PRECIOSA]",
      "Válido: Se este Ninja estiver no mesmo Time que \"Sasuke Uchiha\", ele ganha +1/+1.",
    ],
    flavor: "\"Vou confiar no Sasuke e fazer o que preciso fazer...\"",
  },
  "promo-n-pr-008": {
    text: [
      "[PROFESSOR ESQUENTADO]",
      "Este Ninja ganha -1 de Custo de Entrada quando você tiver um Ninja \"Estudante da Academia\" em jogo.",
    ],
    flavor: "\"Ei, peguei você!\"",
  },
  "promo-n-pr-008r": {
    text: [
      "[PROFESSOR ESQUENTADO]",
      "Este Ninja ganha -1 de Custo de Entrada quando você tiver 1 ou mais Ninjas \"Estudante da Academia\" em jogo.",
    ],
    flavor: "\"Ei, peguei você!\"",
  },
  "promo-n-pr-009": {
    text: [
      "[KAKASHI DO OLHO SHARINGAN]",
      "Este Ninja pode usar um card de Jutsu sem pagar nenhum custo de Jutsu se o seu oponente tiver na Pilha de Descartes dele um card de Jutsu com o mesmo nome desse card de Jutsu.",
    ],
    flavor: "\"Vamos ficar em apuros... a menos que encontremos um jeito de melhorar esta situação.\"",
  },
  "promo-n-pr-009r": {
    text: [
      "[KAKASHI DO OLHO SHARINGAN]",
      "Este Ninja pode usar um card de Jutsu sem pagar nenhum custo de Jutsu se o seu oponente tiver na Pilha de Descartes dele um card de Jutsu com o mesmo nome desse card de Jutsu.",
    ],
    flavor: "\"Vamos ficar em apuros... a menos que encontremos um jeito de melhorar esta situação.\"",
  },
  "promo-n-pr-014": {
    text: [
      "[Potencial Ilimitado]",
      "Este Ninja pode ser colocado em jogo pelo efeito de Crescimento mesmo quando você já tiver em jogo um Ninja com o mesmo nome com 1 ou mais Marcadores de Crescimento.",
    ],
    flavor: "\"O meu sonho para o futuro é... ser o maior Hokage!\"",
  },
  "promo-n-pr-015": {
    text: [
      "[Rugido Furioso]",
      "Válido: Enquanto o seu oponente tiver 1 ou mais Ninjas com Símbolo de Água em jogo, este Ninja ganha +2/+0.",
    ],
    flavor: "\"Não vou deixar você fazer isso\"",
  },
  "promo-n-pr-018": {
    name: "O Primeiro Hokage",
    text: [
      "[AQUELE QUE CRIOU A VILA]",
      "Quando este Ninja for colocado em jogo, se o seu oponente tiver 5 ou mais Prêmios de Batalha, descarte Prêmio(s) de Batalha do seu oponente até ele ficar com 4 Prêmios de Batalha.",
    ],
    flavor: "\"Ser Hokage é acreditar no seu povo tanto quanto... ele acredita em você.\"",
  },
  "promo-n-pr-019": {
    name: "O Segundo Hokage",
    text: [
      "[AQUELE QUE ESTABELECEU A FUNDAÇÃO]",
      "Quando este Ninja for colocado em jogo, se você tiver 3 cards ou menos na mão, compre card(s) até ficar com 4 cards na mão.",
    ],
    flavor: "\"Guie as pessoas e acredite nelas, pois é do meio delas... que virá aquele que vai continuar quando a sua hora chegar.\"",
  },
  "promo-n-pr-024": {
    text: [
      "[TREINO SUPREMO]",
      "Quando este Ninja se tornar o Usuário de um card de Jutsu com \"Requerimentos: Rock Lee\", você pode mudar o custo do Jutsu para 1 de \"Raio\".",
      "Válido: Este Ninja não pode ser retirado de jogo pelos efeitos dos cards de Jutsu do seu oponente.",
    ],
    flavor: "\"Vou te ensinar uma técnica nova, então preste atenção.\" \"Acabou, certo — de um jeito ou de outro!\"",
  },
  "promo-n-pr-025": {
    text: [
      "[TREINO SUPREMO]",
      "Quando este Ninja for colocado em jogo, você pode mover 1 card de Jutsu \"Chidori\" da sua Pilha de Descartes ou da sua área de Chakra para a sua mão. Além disso, cada vez que este Ninja usar um card de Jutsu \"Chidori\" e o efeito dele for aplicado com sucesso, mova-o para a sua mão.",
    ],
    flavor: "\"Se vocês se perguntavam por que eu insisti em treinar o Sasuke pessoalmente... agora já sabem... É porque ele é como eu.\" \"Posso usar o tempo para me preparar para o que eu tenho reservado para você.\"",
  },
  "promo-n-pr-026": {
    text: [
      "[TREINO SUPREMO]",
      "Válido: Este Ninja pode usar o card de Jutsu \"Rasengan\" sem pagar o custo de Jutsu dele. Nesse caso, este Ninja não pode ser retirado de jogo pelos efeitos dos cards de Jutsu do seu oponente durante esse turno. Se você pagar o custo de Jutsu, esse card de Jutsu \"Rasengan\" não pode ser negado.",
    ],
    flavor: "\"Naruto, vamos andando. Hora do seu treino.\" \"Sim, senhor!\"",
  },
  "promo-n-pr-027": {
    text: [
      "[DETERMINAÇÃO FIRME]",
      "Este Ninja não pode receber nenhum Dano pelos efeitos dos Ninjas do seu oponente com Custo de Entrada 2 ou menos. Enquanto este Ninja estiver Em Combate contra o \"Naruto Uzumaki\" do seu oponente, ele ganha +2/+0.",
    ],
    flavor: "\"Vamos, Naruto...\"",
  },
  "promo-n-pr-028": {
    text: [
      "[O SENTIDO DA PRÓPRIA VIDA]",
      "Enquanto este Ninja estiver Em Combate, você pode descartar 1 dos seus Ninjas \"Os Quatro Ninjas do Som\" do Time deste Ninja. Nesse caso, você pode negar e enviar para a área de Chakra do Dono Original dele 1 dos cards de Jutsu do seu oponente com 2 ou mais Símbolos específicos que esteja sendo usado.",
    ],
    flavor: "\"Eu percebi que — encontrar o nosso propósito é o sentido. É por isso que estamos aqui...\"",
  },
  "promo-n-pr-034": {
    text: [
      "[CHAKRA TRANSBORDANTE]",
      "Válido: Enquanto você tiver um card de Missão \"O Vale do Fim\" em jogo, no início da sua Fase de Missão, você pode mover o card do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Eu não vou deixar gente como o Orochimaru pôr as mãos em você!\"",
  },
  "promo-n-pr-035": {
    text: [
      "[CHAKRA TRANSBORDANTE]",
      "Válido: Enquanto você tiver um card de Missão \"O Vale do Fim\" em jogo, no início da sua Fase de Missão, você pode mover o card do topo do seu Deck para a sua área de Chakra.",
    ],
    flavor: "\"Você não está me deixando muita escolha, Naruto...\"",
  },
  "promo-n-pr-036": {
    text: [
      "[OLHOS DE SANGUE-FRIO]",
      "Quando este Ninja for enviado para a Batalha, descarte até 2 cards do topo do Deck do seu oponente.",
    ],
    flavor: "\"Vá embora. Você não me interessa no momento.\"",
  },
  "promo-n-pr-038": {
    text: [
      "[COMO UM REDEMOINHO]",
      "Quando este Ninja for baixado, escolha aleatoriamente 1 dos Prêmios de Batalha do seu oponente e mova-o para a sua mão.",
    ],
    flavor: "\"Eu vou trazer o Sasuke de volta do Orochimaru!\"",
  },
  "promo-n-pr-039": {
    text: [
      "[LÍDER APAIXONADO]",
      "Enquanto este card de Ninja estiver na sua mão, se você tiver \"Rock Lee\", \"Neji Hyuga\" e/ou \"Tenten\" em jogo em Estado Ferido, o Custo de Entrada e o Custo de Mão deste Ninja ganham -1.",
      "Válido: Os seus \"Rock Lee\", \"Neji Hyuga\" e/ou \"Tenten\" em jogo ganham +1/+1.",
    ],
    flavor: "\"Time Guy! Façam isso com toda a paixão!!!\"",
  },
  "promo-n-pr-040": {
    text: [
      "[ESPÍRITO COMPETITIVO]",
      "O Ninja Líder que receber qualquer Dano do Time deste Ninja por causa do Showdown é descartado.",
    ],
    flavor: "\"Eu aprendi o espírito competitivo com a minha mestra!\"",
  },
  "promo-n-pr-041": {
    text: [
      "[REENCONTRO REPENTINO]",
      "No início da Fase de Missão do seu oponente, você pode colocar este card de Ninja em jogo removendo do jogo os seus \"Naruto Uzumaki\" e \"Hinata Hyuga\" em jogo. (O Custo de Entrada deve ser pago.) Nesse caso, o seu oponente não pode colocar nenhum card de Ninja em jogo durante este turno.",
    ],
    flavor: "\"Ei, Hinata! Por que você está se escondendo?\" \"Eu ainda não estou pronta para isso...\"",
  },
  "promo-n-pr-042": {
    text: [
      "[NOVA TÉCNICA]",
      "Quando este Ninja for colocado em jogo, você pode procurar no seu Deck 1 card de Jutsu \"Mangekyo Sharingan\" e removê-lo do jogo, mantendo-o com a face para cima. Nesse caso, no início do seu próximo turno, mova esse card para a sua mão.",
    ],
    flavor: "\"Sim. É um novo sharingan.\"",
  },
  "promo-n-pr-046": {
    text: [
      "[CRIANDO UMA FLORESTA DO SUBSOLO]",
      "Quando este Ninja for colocado em jogo, mova até 3 cards com Símbolo de \"Terra\" da sua Pilha de Descartes para a sua área de Chakra.",
      "Válido: Este Ninja pode se tornar o Usuário de cards de Jutsu com Requerimentos: O Primeiro Hokage\".",
    ],
    flavor: "\"Muito bem, então. Vamos lá!\"",
  },
  "promo-n-pr-050": {
    text: [
      "[FOLHA DANÇANTE E AREIA SILENCIOSA]",
      "Válido: Cada vez que este Ninja se tornar o Usuário de um card de Jutsu, este Ninja ganha +2/+2 e não é afetado pelo efeito dos cards de Jutsu e de Ninja do seu oponente durante este turno.",
      "Válido: Este Ninja pode se tornar o Usuário de cards de Jutsu com Requerimentos: \"Might Guy\".",
    ],
    flavor: "\"Entrou areia na minha boca...\" \"Enquanto eu tiver areia, posso fazer qualquer coisa.\"",
  },
  "promo-n-pr-051": {
    text: [
      "[VERDADEIROS ALIADOS]",
      "Quando este Ninja for baixado, você pode descartar um card. Nesse caso, procure no seu Deck 1 card de Ninja \"Naruto Uzumaki\" com o efeito [VERDADEIROS ALIADOS], revele-o e coloque-o na sua mão. Depois, embaralhe o seu Deck.",
      "Válido: Durante a sua Fase de Missão, se você tiver outro Ninja com o efeito [VERDADEIROS ALIADOS], você pode descartar 2 dos seus Chakras para curar um Ninja ferido ou comprar 1 card.",
    ],
    flavor: "Naruto! Você está bem?\"",
  },
  "promo-n-pr-052": {
    text: [
      "[VERDADEIROS ALIADOS]",
      "Quando este Ninja for baixado, você pode descartar um card. Nesse caso, procure no seu Deck 1 card de Ninja \"Sakura Haruno\" com o efeito [VERDADEIROS ALIADOS], mostre-o ao seu oponente e coloque-o na sua mão. Depois, embaralhe o seu Deck.",
      "Válido: Durante a sua Fase de Missão, se você tiver outro Ninja com o efeito [VERDADEIROS ALIADOS], você pode mover 1 card de Ninja ou de Missão da sua Pilha de Descartes ou área de Chakra para a sua mão.",
    ],
    flavor: "\"Não somos mais professor e alunos. Vamos trabalhar juntos como shinobi da Folha iguais. Entendido?\"",
  },
  "promo-n-pr-053": {
    text: [
      "[VERDADEIROS ALIADOS]",
      "Enquanto este card estiver no seu Baralho de Reforço, se você tiver 2 ou mais Ninjas com o efeito [VERDADEIROS ALIADOS], você pode devolver o seu Ninja \"Naruto Uzumaki\" à mão do Dono Original dele durante a sua Fase de Missão. Nesse caso, coloque este card de Ninja em jogo.",
      "Válido: Quando um Ninja for ser retirado de jogo, você pode descartar 1 card de Ninja \"Naruto Uzumaki\" da sua mão. Nesse caso, em vez disso, esse Ninja não é retirado.",
    ],
    flavor: "\"Toma essa!\"",
  },
  "promo-n-pr-054": {
    text: [
      "[DISTRAÇÃO]",
      "Quando este Ninja for colocado em jogo, você pode procurar no seu Deck um card de Ninja \"Estado de Clone\", revelá-lo e movê-lo para a sua mão.",
    ],
  },
  "promo-n-pr-055": {
    text: [
      "[OLHOS DE FALCÃO]",
      "Quando este Ninja for colocado em jogo, você pode procurar no seu Deck um card que tenha \"Chidori\" no nome, revelá-lo e movê-lo para a sua mão.",
    ],
  },
  "promo-n-pr-056": {
    text: [
      "[ESQUECIMENTO]",
      "Você pode descartar 3 dos seus Chakras. Nesse caso, negue e remova do jogo 1 card de Missão ou de Jutsu que esteja sendo jogado.",
    ],
  },
  "promo-n-pr-057": {
    text: [
      "[CONHECIMENTO DE LIVRO]",
      "Quando você baixar este Ninja ou outro Ninja com \"Poder Mental: 2\" ou mais, compre 1 card.",
    ],
  },
  "promo-n-pr-058": {
    text: [
      "[INFERNO]",
      "O seu oponente não pode jogar cards com Custo de Entrada 2 ou menos.",
    ],
  },
  "promo-n-pr-059": {
    text: [
      "[CONFIANÇA]",
      "Quando este Ninja for colocado em jogo, procure no seu Deck um card de Ninja \"Naruto Uzumaki\" com Custo de Entrada 4 ou menos e coloque-o em jogo.",
    ],
  },
  "promo-n-pr-061": {
    text: [
      "[SHINOBI DOS CÉUS DE SAFIRA]",
      "Quando este Ninja for baixado, você pode escolher até 5 cards da sua Pilha de Descartes. Nesse caso, coloque os cards escolhidos no topo do seu Deck em ordem aleatória.",
    ],
  },
  "promo-n-pr-062": {
    text: [
      "[SHINOBI DAS CHAMAS CARMESIM]",
      "Válido: Quando você baixar este Ninja ou outro Ninja \"Olho Sharingan\", mova os 3 cards do topo do Deck do seu oponente para a Pilha de Descartes dele.",
    ],
  },
  "promo-n-pr-063": {
    text: [
      "[MUNDO ILUSÓRIO]",
      "Válido: Os alvos dos cards de Jutsu devem ser escolhidos aleatoriamente. (Escolha aleatoriamente entre todos os alvos válidos)",
    ],
  },
  "promo-n-pr-064": {
    text: [
      "[O JUTSU SUPREMO]",
      "Quando este Ninja for colocado em jogo, diga o nome de um card de Jutsu.",
      "Válido: Os cards de Jutsu com o nome escolhido podem ser usados por este Ninja sem pagar o custo deles. (Os Requerimentos do Jutsu ainda devem ser cumpridos)",
    ],
  },
  "promo-n-pr-065": {
    name: "Jiraiya & O 4º Hokage",
    text: [
      "[PROFESSOR E LÍDER]",
      "Todos os Chakras do seu oponente são considerados como tendo apenas o Símbolo de Raio e não podem ter nenhum outro Símbolo.",
    ],
  },
  "promo-n-pr-066": {
    text: [
      "[GUARDIÕES DOS DESASTRES]",
      "Válido: Quando este Ninja for colocado em jogo, coloque 1 Marcador de Crescimento neste Ninja para cada 2 Prêmios de Batalha que o seu oponente tiver (arredondado para baixo).",
    ],
  },
  "promo-n-pr-067": {
    text: [
      "[INFUSÃO ELEMENTAL]",
      "Quando este Ninja Atacar e for enfrentado, escolha 1 Ninja de Apoio Em Combate contra ele. Nesse caso, o Ninja escolhido também recebe qualquer Dano que o Ninja Líder do Time dele receber durante este turno.",
    ],
  },
  "promo-n-pr-068": {
    text: [
      "[FERA DAS RIMAS]",
      "Válido: Enquanto ferido, quando este Ninja for enfrentado por um Ninja com Custo de Entrada impresso 1 ou menos, mova esse Ninja para o fundo do Deck do Dono Original dele.",
    ],
  },
  "promo-n-pr-069": {
    text: [
      "[SÁBIO DAS MARIONETES]",
      "Válido: Durante a sua Fase de Missão, você pode pagar 2 Chakras. Nesse caso, coloque em jogo 1 moeda (que simboliza um Ninja \"Marionete\") com o seguinte: [Poder: 0/0 (Saudável e Ferido), Não Único/\"Marionete\"].",
    ],
  },
  "promo-n-pr-070": {
    text: [
      "[ARTISTA DA RUÍNA]",
      "Durante a sua Fase de Missão, você pode descartar qualquer número dos seus Ninjas. Depois, descarte todos os outros Ninjas com Custo de Entrada menor ou igual ao número de Ninjas que você descartou por este efeito.",
    ],
  },
  "promo-n-pr-071": {
    text: [
      "[TÁTICA ENGENHOSA]",
      "Durante a Fase de Missão, você pode pagar 2 Chakras e escolher 1 dos seus Ninjas. Nesse caso, o próximo card de Jutsu que o Ninja escolhido usar durante este turno é de graça.",
    ],
  },
  "promo-n-pr-072": {
    text: [
      "[SINTONIA]",
      "Quando este Ninja for baixado, você pode anexar a este Ninja 1 card de Jutsu da sua mão.",
      "Válido: Durante a Troca de Jutsu, você pode pagar 2 Chakras. Nesse caso, adicione à Sequência uma cópia do Jutsu anexado, com este Ninja como Usuário (Requerimentos/alvo devem ser cumpridos/escolhidos).",
    ],
  },
  "promo-n-pr-073": {
    text: [
      "[ANÁTEMA]",
      "Enquanto você tiver mais cards na sua área de Removidos do Jogo que no seu Deck, todos os cards de Jutsu usados por este Ninja são de graça.",
    ],
  },
  "promo-n-pr-074": {
    text: [
      "[PROVA DE CENSURA]",
      "Durante a Troca de Jutsu, você pode remover do jogo os 5 cards do topo do seu Deck. Nesse caso, mova 1 card de Jutsu da sua Pilha de Descartes para a sua mão.",
    ],
  },
  "promo-n-pr-075": {
    text: [
      "[DEMÔNIOS DO GELO]",
      "Quando este Ninja Atacar sozinho, ele ganha +5/-5 durante este turno.",
      "Válido: Quando este Ninja Atacar sozinho, ele só pode ser Bloqueado por Times com 2 ou mais Ninjas durante este turno.",
    ],
    flavor: "\"Mas você é um pirralho tão sádico...\" \"Exatamente!\"",
  },
  "promo-n-pr-076": {
    text: [
      "[CAMPO DE BATALHA DISTORCIDO]",
      "Válido: Quando este Ninja for colocado em jogo, distribua 3 Marcadores -1/-1 entre até 3 Ninjas alvo.",
      "Válido: Os Ninjas do seu oponente com Marcadores -1/-1 não podem ser os Usuários de cards de Jutsu.",
    ],
    flavor: "\"Esta é a minha vingança.\" \"Agora ele não pode fugir.\"",
  },
  "promo-n-pr-077": {
    text: [
      "[DISCÍPULO DO SÁBIO TARADO]",
      "Quando este Ninja for baixado, você pode mover um card de Jutsu de Raio da sua Pilha de Descartes para a sua mão.",
    ],
  },
  "promo-n-pr-078": {
    text: [
      "[O ABRAÇO DA COBRA]",
      "Quando um Ninja adversário usar um Jutsu, se o custo desse Jutsu tiver 2 ou mais Símbolos, você pode ferir esse Ninja.",
    ],
  },
  "promo-n-pr-079": {
    text: [
      "[HABILIDADE LENDÁRIA]",
      "Válido: Quando este Ninja usar um Jutsu, você pode pagar (1). Nesse caso, você pode negar 1 Jutsu.",
    ],
  },
  "promo-n-pr-083": {
    text: [
      "[A QUALQUER CUSTO]",
      "Válido: Os Ninjas e Missões que você controla podem ser descartados para pagar cards de Jutsu como se estivessem na sua área de Chakra.",
    ],
  },
  "promo-n-pr-084": {
    text: [
      "[RUMO À ESCURIDÃO]",
      "Quando o seu oponente jogar um Jutsu, você pode descartar 1 dos seus Prêmios de Batalha e pagar (Fogo). Nesse caso, negue esse Jutsu.",
    ],
  },
  "promo-n-pr-085": {
    name: "Pain (Caminho Deva)",
    text: [
      "[ALUNO DO SÁBIO]",
      "Sacrifício: 1 Ninja ou Cliente",
      "[Atacante | Missão] (0): Veja a mão do jogador alvo. Você pode mover 1 card da mão dele para o fundo do Deck dele. Nesse caso, se o alvo foi você, compre 1 card.",
    ],
  },
  "promo-n-pr-086": {
    text: [
      "[SACRIFÍCIO HONRADO]",
      "[Válido | Troca de Jutsu] (0): Os cards de Jutsu de Fogo e de Raio da sua Pilha de Descartes podem ser jogados como se estivessem na sua mão durante este turno e são removidos do jogo quando resolvidos com sucesso. No final deste turno, descarte este Ninja.",
    ],
  },
  "promo-n-pr-087": {
    name: "Naruto Uzumaki (Modo Sábio)",
    text: [
      "[CAMPEÃO DA FOLHA]",
      "Sacrifício: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "Senjutsu",
      "Este card de Ninja ganha -1 de Custo de Entrada para cada Ninja ferido que você controla.",
      "Quando este Ninja for colocado em jogo, coloque um Marcador +1/+1 neste Ninja para cada Ninja ferido que você controla.",
    ],
    flavor: "\"O meu novo jutsu vai acabar com isso numa tacada só!!!\"",
  },
  "promo-n-pr-088": {
    text: [
      "[CAMPEÃO DOS UCHIHA]",
      "[Atacante | Missão] Remova do jogo 2 cards de Ninja \"Olho Sharingan\" da Pilha de Descartes de qualquer jogador: Procure no seu Deck 1 card de Jutsu, revele-o e depois mova-o para a sua mão.",
    ],
    flavor: "\"Esta é a minha vingança.\"",
  },
  "promo-n-pr-089": {
    text: [
      "[CAMPEÃ DOS DETERMINADOS]",
      "Quando este Ninja conseguir qualquer Vitória, coloque um Marcador +1/+1 nele.",
      "Quando este Ninja ganhar qualquer Prêmio de Batalha, compre 1 card.",
    ],
    flavor: "\"Isso mesmo.\"",
  },
  "promo-n-pr-090": {
    text: [
      "[CAMPEÃ DO CORAÇÃO]",
      "[Troca de Jutsu] (0): No início do Showdown, remova do jogo este Ninja e o Ninja Líder adversário alvo.",
    ],
    flavor: "\"Estou aqui porque eu quero estar.\"",
  },
  "promo-n-pr-091": {
    text: [
      "[CAMPEÃO DOS ELEMENTOS]",
      "[Troca de Jutsu] (1): Este Ninja ganha +1/+0 para cada Símbolo diferente na sua área de Chakra.",
      "[Atacante | Missão] (2): Veja os X cards do topo do seu Deck e devolva-os em qualquer ordem. X = o número de Símbolos diferentes na sua área de Chakra.",
    ],
    flavor: "\"É verdade. Ataques físicos são praticamente inúteis contra mim.\"",
  },
  "promo-n-pr-095": {
    text: [
      "[TREINO ÚNICO]",
      "Válido: Quando este Ninja for curado, coloque um Marcador +1/+1 nele.",
      "[Válido | Missão] Descarte um card de Ninja Naruto Uzumaki da sua mão: Cure este Ninja.",
    ],
  },
  "promo-n-pr-096": {
    name: "O 4º Hokage",
    text: [
      "[SALVADOR DA FOLHA]",
      "Válido: Quando este Ninja Atacar, se você estiver Atacando com 3 ou mais Times, você pode mover 1 dos Prêmios de Batalha do seu oponente para a sua mão.",
    ],
  },
  "promo-n-pr-100": {
    text: [
      "[ASPIRAÇÕES]",
      "Sacrifício: Naruto Uzumaki + Custo de Entrada 3 ou mais",
      "[Atacante | Missão] (X): Procure no seu Deck um card de Ninja \"Folha\" com Custo de Entrada X ou menos e mova-o para a sua Vila. Depois, embaralhe o seu Deck.",
    ],
  },
  "promo-n-pr-us001": {
    text: [
      "[VIRADA DRÁSTICA]",
      "Válido: Enquanto este Ninja estiver em Estado Ferido, o Combate deste Ninja passa a ser igual ao número de Prêmios de Batalha do seu oponente.",
    ],
    flavor: "\"Agora que eu cheguei, vai ficar tudo bem!\"",
  },
  "promo-n-pr-us002": {
    text: [
      "[CLÃ DE GÊNIOS]",
      "Quando o Time deste Ninja conseguir uma Vitória ou uma Vitória Espetacular, você pode escolher e descartar 1 dos cards da área de Chakra do seu oponente.",
    ],
    flavor: "\"Quer saber mais sobre o meu clã? .. Então eu vou te ensinar... do jeito difícil.\"",
  },
  "promo-n-pr-us003": {
    text: [
      "[CAPRICHO]",
      "Quando este Ninja for enviado para a Batalha e for enfrentado, jogue a Moeda Ninja; se der cara, o Time deste Ninja e o Time do seu oponente Em Combate contra o Time deste Ninja fazem uma Batalha Mental.",
    ],
    flavor: "\"Eu só não curto me esforçar com as coisas...\"",
  },
  "promo-n-pr-us005": {
    text: [
      "[PELO MEU PROFESSOR]",
      "Válido: Enquanto este Ninja estiver Em Combate contra um Time do seu oponente com 1 ou mais Ninjas \"Chunin\" ou de Hierarquia superior, este Ninja ganha +2/+0.",
    ],
    flavor: "\"Se você encostar um dedo no meu professor ...\"",
  },
  "promo-n-pr-us007": {
    text: [
      "[CHAKRA VERMELHO]",
      "Válido: Enquanto este Ninja estiver em Estado Ferido e você tiver 3 cards ou menos na mão, este Ninja ganha +2/+0.",
    ],
    flavor: "\"É agora!\"",
  },
  "promo-n-pr-us008": {
    text: [
      "[NOME TRÁGICO]",
      "Você pode descartar outro Ninja do Time deste Ninja para causar 1 Dano a 1 dos Ninjas do seu oponente Em Combate contra o Time deste Ninja.",
    ],
    flavor: "\"Eu vivo só para mim mesmo. Eu amo só a mim mesmo.\"",
  },
  "promo-n-pr-us009": {
    text: [
      "[PERSPICÁCIA]",
      "Este Ninja não pode ser movido da sua Vila ou do Campo de Batalha pelo efeito dos cards de Jutsu do seu oponente.",
    ],
    flavor: "\"Eu vejo o mundo com clareza, — com o meu Byakugan.\"",
  },
  "promo-n-pr-us010": {
    text: [
      "[EU CONSIGO]",
      "Durante a Troca de Jutsu, se este Ninja for enfrentado, você pode mudar este Ninja para Estado Ferido. Nesse caso, o Time deste Ninja e o Time do seu oponente Em Combate contra o Time deste Ninja fazem uma Batalha Mental.",
    ],
    flavor: "\"Nada funciona contra isto\"",
  },
  "promo-n-pr-us011": {
    text: [
      "[UM ÚLTIMO ATAQUE]",
      "Válido: Quando este Ninja for enviado para Atacar e receber qualquer Dano, você pode causar 1 Dano a 1 dos Ninjas do seu oponente Em Combate contra este Ninja.",
    ],
    flavor: "\"Prepare-se, seu monstro maluco!\"",
  },
  "promo-n-pr-us012": {
    text: [
      "[ARTE NINJA FAVORITA]",
      "Cada vez que este Ninja se tornar o Usuário de um card de Jutsu com Símbolo de \"Fogo\", você pode comprar 1 card.",
    ],
    flavor: "\"Jutsu Bola de Fogo!!\"",
  },
  "promo-n-pr-us013": {
    text: [
      "[O CORPO DO CLÃ UCHIHA]",
      "Quando o Time deste Ninja conseguir uma Vitória ou uma Vitória Espetacular, você pode escolher e mover para o topo do seu Deck 1 card de Jutsu da sua Pilha de Descartes que tenha \"Requerimentos: 'Olho Sharingan'\" ou \"Requerimentos: 'Itachi Uchiha'\".",
    ],
    flavor: "\"Vou te mostrar o verdadeiro poder do clã Uchiha!\"",
  },
  "promo-n-pr-us015": {
    name: "O Terceiro Hokage",
    text: [
      "[FAMÍLIA PRECIOSA]",
      "Enquanto você tiver apenas Ninjas \"Genin\" em jogo, o Custo de Entrada e o Custo de Mão deste Ninja ganham -1.",
    ],
    flavor: "\"Eles são preciosos para mim... São a minha família!\"",
  },
  "promo-n-ps-004": {
    flavor: "\"Eu vou proteger vocês com a minha vida. Todos vocês.\"",
  },
  // ── JUTSU ──
  "promo-j-pr-020": {
    text: [
      "Requerimentos: \"O Quarto Hokage\" ou \"Jiraiya\" ou \"Naruto Uzumaki\" + \"Estado de Clone\"",
      "Alvo: Usuário",
      "Efeito: O alvo ganha +7/+0 durante este turno. No final do turno, cause 1 Dano a todos os Ninjas do Time deste Ninja.",
    ],
    flavor: "\"Está na hora daquele Jutsu...\"",
  },
  "promo-j-pr-026": {
    name: "A Tática contra o Olho Sharingan",
    text: [
      "Alvo: 1 Ninja com \"Olho Sharingan\"",
      "Efeito: O texto de efeito do alvo é negado durante este turno. Este card de Jutsu não pode ser negado.",
    ],
    flavor: "\"Fechem os olhos! Não olhem nos olhos dele!\"",
  },
  "promo-j-pr-037": {
    text: [
      "Requerimentos: \"Itachi Uchiha\"",
      "Efeito: Descarte 5 cards do topo do Deck do seu oponente. Depois, continue jogando a Moeda Ninja até tirar coroa. Descarte 3 cards do topo do Deck do seu oponente para cada cara que você tirou nas jogadas.",
    ],
    flavor: "Queimar o sapo de pedra, quando ele mesmo tem o poder de cuspir fogo... Esse é mesmo um jutsu poderoso.",
  },
  "promo-j-pr-043": {
    name: "Jutsu Multiclones das Sombras",
    text: [
      "Requerimentos: \"Naruto Uzumaki\" + \"Custo de Entrada impresso 3 ou mais\" ou \"Jonin\" ou Hierarquia superior",
      "Alvo: Usuário",
      "Efeito: O alvo ganha +6/+6 e +6 de Poder Mental durante este turno. Além disso, o alvo não pode ser afetado pelos efeitos do seu oponente durante este turno.",
    ],
    flavor: "\"Jutsu Multiclones das Sombras!!\"",
  },
  "promo-j-pr-044": {
    name: "Lâmina de Relâmpago",
    text: [
      "Requerimentos: \"Kakashi Hatake\"",
      "Alvo: (1) Usuário (2) 1 Ninja Em Combate contra o Usuário",
      "Efeito: Escolha 1 dos seguintes e aplique-o.",
      "•O alvo (1) ganha +5/+5 durante este turno. Além disso, o alvo não pode ser afetado pelos efeitos do seu oponente durante este turno.",
      "•Mova o alvo (2) para o fundo do Deck do Dono Original dele.",
    ],
    flavor: "\"Lâmina de Relâmpago!!\"",
  },
  "promo-j-pr-045": {
    name: "Corrente Chidori",
    text: [
      "Requerimentos: \"Sasuke Uchiha\" + \"Custo de Entrada impresso 4 ou mais\"",
      "Alvo: Todos os Ninjas Em Combate contra o Usuário",
      "Efeito: Negue os textos de efeito do alvo e cause 1 Dano a ele. Além disso, se o Custo de Entrada impresso do alvo for igual ou menor que o do Usuário, o alvo passa a ser um Ninja Reserva.",
    ],
    flavor: "\"Corrente de Chidori!!\"",
  },
  "promo-j-pr-093": {
    name: "Lâmina de Relâmpago: Tremor do Relâmpago Gêmeo",
    text: [
      "Requerimentos: Kakashi Hatake",
      "Alvo: 1 Ninja que enfrenta o Usuário",
      "Efeito: Se o Usuário for um Ninja de Fogo, cause 1 Dano ao alvo e negue 1 Jutsu. Se o Usuário for um Ninja de Raio, cause 1 Dano ao alvo, e o Usuário ganha +5/+0 durante este turno.",
    ],
  },
  "promo-j-pr-us004": {
    name: "Olho Sharingan",
    text: [
      "Requerimentos: \"Olho Sharingan\"",
      "Alvo: 1 dos cards de Jutsu do seu oponente que esteja sendo jogado",
      "Efeito: Negue o alvo e descarte-o. Depois, veja todos os cards da mão do seu oponente e descarte o(s) card(s) com o mesmo nome do alvo.",
    ],
    flavor: "\"Agora eu consigo ver!\"",
  },
  "promo-j-pr-us014": {
    name: "Jutsu Multiclones das Sombras",
    text: [
      "Requerimentos: \"Naruto Uzumaki\"",
      "Alvo: Usuário",
      "Efeito: O alvo ganha +3/+0 para cada card de Ninja \"Naruto Uzumaki\" na sua Pilha de Descartes e na sua área de Chakra.",
    ],
    flavor: "\"Se você não vem... Então nós vamos atrás de você!\"",
  },
  // ── MISSÃO ──
  "promo-m-621": {
    name: "Ambição Feroz",
    text: [
      "Permanente",
      "Efeito: Quando você colocar um card de Ninja \"Akatsuki\" em jogo, ele ganha os seguintes textos de efeito durante esse turno: \"Quando este Ninja for colocado em jogo, compre 1 card.\" \"Quando o Time deste Ninja conseguir uma Vitória ou uma Vitória Espetacular, você ganha 1 Prêmio de Batalha.\"",
    ],
    flavor: "\"Eu odeio o jeito como eles olham para nós, como se fôssemos monstros ou coisa assim!!\"",
  },
  "promo-m-622": {
    name: "Resgatem o 5º Kazekage",
    text: [
      "Permanente",
      "Efeito: Os seus Times só com Ninja(s) \"Folha\" ganham +2 de Poder do Time enquanto estiverem Em Combate contra 1 ou mais Ninjas que não sejam \"Folha\". Além disso, cada um dos seus Ninjas nesses Times não pode ser afetado pelos efeitos dos Ninjas do seu oponente que não sejam \"Folha\".",
    ],
    flavor: "\"Custe o que custar, eu não vou deixar vocês levarem o Gaara!\"",
  },
  "promo-m-623": {
    name: "Olhos Amaldiçoados",
    text: [
      "Permanente",
      "Efeito: Durante a Troca de Jutsu, você pode remover do jogo 2 cards de Ninja com \"Olho Sharingan\" da sua Pilha de Descartes e/ou área de Chakra. Nesse caso, procure no seu Deck 1 card de Jutsu, mostre-o ao seu oponente e coloque-o na sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "\"Você acha que conseguiria romper os seus laços tão facilmente, Sasuke?\" \"......\"",
  },
  "promo-m-pr-010": {
    name: "Monumento dos Hokages",
    text: [
      "Permanente",
      "Efeito: Todos os seus Times que tiverem apenas Ninjas \"Folha\" ganham +1 de Poder do Time durante o Showdown.",
    ],
    flavor: "\"As folhas dançam no ar onde queimam. A sombra do fogo ilumina o céu e faz as folhas verdejarem de novo...\"",
  },
  "promo-m-pr-011": {
    name: "Sucessores",
    text: [
      "Alvo: \"Naruto Uzumaki\", \"Sasuke Uchiha\" e \"Sakura Haruno\"",
      "Efeito: Quando todos os Ninjas alvo estiverem no mesmo Time e ganharem um Prêmio de Batalha Espetacular durante este turno, você vence o jogo.",
    ],
    flavor: "\"Ser Hokage é o meu sonho!\"",
  },
  "promo-m-pr-012": {
    name: "Comece a Batalha",
    text: [
      "Alvo: 1 dos seus Ninjas",
      "Efeito: Depois que a Fase de Batalha deste turno terminar, você pode ter 1 Fase de Batalha adicional. Você só pode enviar o Time do alvo para a Batalha durante essa Fase de Batalha adicional.",
    ],
    flavor: "\"Muito bem! Vamos lá!\"",
  },
  "promo-m-pr-013": {
    name: "A Origem da Trama",
    text: [
      "Efeito: Veja os 2 cards do topo do Deck do seu oponente e devolva-os ao topo do Deck dele na ordem que você quiser.",
    ],
    flavor: "\"Gostei de ver as suas habilidades e o seu poder.\"",
  },
  "promo-m-pr-016": {
    name: "A Prova da Existência",
    text: [
      "Efeito: Depois que este turno terminar, você pode ter 1 turno adicional, sem a Fase de Missão. O seu oponente ganha 3 Prêmios de Batalha no final do turno adicional.",
    ],
    flavor: "\"A minha existência não vai desaparecer!\"",
  },
  "promo-m-pr-017": {
    name: "Um Último Ataque",
    text: [
      "Efeito: Depois que este turno terminar, você pode ter 1 turno adicional. Nesse caso, no final desse turno adicional, descarte todos os cards do seu Deck.",
    ],
    flavor: "\"Vamos acabar com isso agora!\"",
  },
  "promo-m-pr-018": {
    text: [
      "Efeito: Durante a Fase de Organização deste turno, os Ninjas Genin dos dois jogadores devem ser retirados dos Times e não podem ser incluídos num Time com nenhum outro Ninja. (Os outros Ninjas podem ser organizados normalmente.) Durante a Fase de Batalha, os dois jogadores devem enviar para a Batalha apenas Ninjas Genin, se possível. Durante o Showdown, nenhum Ninja pode receber Dano. Além disso, se um jogador conseguir uma Vitória ou uma Vitória Espetacular, esse jogador ganha 2 Prêmios de Batalha e compra um card.",
    ],
    flavor: "\"Agora você luta comigo!\"",
  },
  "promo-m-pr-021": {
    name: "Vigia",
    text: [
      "Permanente (3)",
      "Alvo: 1 Ninja com Custo de Entrada 1 ou menos",
      "Efeito: Anexe este card ao alvo. O texto de efeito do alvo é negado. (Se você anexar este card a um Ninja do seu oponente, ele controla este card.)",
    ],
    flavor: "\"Ninjutsu, a terceira habilidade de batalha shinobi.\" \"...\"",
  },
  "promo-m-pr-022": {
    name: "Vamos resolver isso lá fora!",
    text: [
      "Alvo: (1) 1 dos seus Ninjas só \"Genin\" (2) 1 dos Ninjas do seu oponente",
      "Efeito: Você organiza um Time só com o alvo (1), e o seu oponente organiza um Time só com o alvo (2). Esses 2 Times devem ser enviados para a Batalha neste turno, se possível. Os textos de efeito dos dois alvos são negados enquanto estiverem Em Combate neste turno. Nenhum outro Time pode ser enviado para a Batalha durante este turno.",
    ],
    flavor: "\"Como você ousa me dizer isso... Vamos resolver isso lá fora, seu pirralho!\"",
  },
  "promo-m-pr-023": {
    name: "Silêncio",
    text: [
      "Permanente (2)",
      "Alvo: Todos os Ninjas com Custo de Entrada 1 ou menos",
      "Efeito: O texto de efeito do alvo é negado.",
    ],
    flavor: "\".........!\"",
  },
  "promo-m-pr-024": {
    name: "Nenhuma Resposta",
    text: [
      "Permanente (2)",
      "Alvo: 1 Ninja",
      "Efeito: Anexe este card ao alvo. O Poder Mental do alvo passa a ser 0 e não pode ser mudado. (Se você anexar este card a um Ninja do seu oponente, ele controla este card.)",
    ],
    flavor: "\"Acabei de aprovar um candidato que não respondeu a uma única pergunta...\"",
  },
  "promo-m-pr-025": {
    name: "Para o Mesmo Lugar",
    text: [
      "Permanente (2)",
      "Efeito: No início do seu turno, se você tiver \"Haku\" ou \"Zabuza Momochi\" em jogo e o outro na sua Pilha de Descartes, coloque em jogo o que estiver na Pilha de Descartes, no mesmo estado daquele que está em jogo.",
    ],
    flavor: "\"Eu sei que não pode ser, mas... queria poder ir para onde você foi... Como eu queria  me juntar a você lá..\"",
  },
  "promo-m-pr-029": {
    name: "Batalha entre os Sannin",
    text: [
      "Permanente (2)",
      "Efeito: Os Ninjas \"Sannin\" não podem receber nenhum Dano dos cards de Jutsu do seu oponente usados por Ninjas que não sejam \"Sannin\". Além disso, enquanto os Ninjas \"Sannin\" estiverem Em Combate contra um Time que não inclua Ninjas \"Sannin\", eles não podem receber nenhum Dano por causa do Showdown.",
    ],
    flavor: "\"Hoje é o último dia em que nos chamam de 'Os Sannin'\".",
  },
  "promo-m-pr-030": {
    name: "Um Novo Inimigo",
    text: [
      "Anulação",
      "Efeito: Coloque em jogo 1 card de Ninja \"Kimimaro\" da sua mão. Depois, você pode colocá-lo em qualquer um dos seus Times com 2 Ninjas ou menos. O Time desse \"Kimimaro\" deve ser enviado para Bloquear, se possível, durante o turno.",
    ],
    flavor: "\"Por que você é...\"",
  },
  "promo-m-pr-031": {
    name: "Pelo Título de Hokage",
    text: [
      "Permanente (3)",
      "Efeito: No início do turno de cada jogador, esse jogador escolhe 1 dos Ninjas dele em jogo. Se o Time do Ninja escolhido conseguir uma Vitória ou uma Vitória Espetacular durante o turno, esse jogador ganha 1 Prêmio de Batalha.",
    ],
    flavor: "\"Quem vai ser Hokage sou eu!!\"",
  },
  "promo-m-pr-032": {
    name: "Admirando as Lendas",
    text: [
      "Permanente",
      "Efeito: Quando você colocar um Ninja \"Sannin\" em jogo, o seu oponente não pode jogar nenhum card de Missão, e os Ninjas dele não podem usar nenhum card de Jutsu durante esse turno e o próximo.",
    ],
    flavor: "\"Sannin\" são ninjas lendários conhecidos em todas as vilas.",
  },
  "promo-m-pr-033": {
    name: "A Linhagem das Lendas",
    text: [
      "Permanente",
      "Efeito: Quando o seu Ninja \"Satoosa\" for retirado de jogo por causa do Showdown ou pelos efeitos do seu oponente, você pode procurar no seu Deck 1 card de Ninja \"Satoosa\", mostrá-lo ao seu oponente e colocá-lo na sua mão. Depois, embaralhe o seu Deck.",
    ],
    flavor: "O Ninja que governa a Vila da Folha e a protege do perigo é chamado de \"O Hokage\".",
  },
  "promo-m-pr-048": {
    name: "Popularidade",
    text: [
      "Permanente (3)",
      "Efeito: Enquanto você tiver apenas 1 Ninja com o maior custo entre os Ninjas que você tem em jogo, esse Ninja não pode ser afetado pelos efeitos do seu oponente.",
    ],
    flavor: "Todo mundo fica \"Sasuke, Sasuke\". O que esse cara tem de tão especial?!",
  },
  "promo-m-pr-049": {
    name: "A Vontade da Juventude",
    text: [
      "Permanente",
      "Efeito: Os Ninjas de cada jogador não podem ser retirados de jogo pelos efeitos dos cards de Jutsu do oponente.",
      "Efeito: Quando esta Missão for retirada de jogo, você pode comprar 1 card. Nesse caso, em vez disso, mova este card para o topo do Deck do Dono Original dele.",
    ],
    flavor: "\"Agora eu sou Ninja e quero uma missão de Ninja!\"",
  },
  "promo-m-pr-060": {
    name: "Choque",
    text: [
      "Acesse BandaiCG.com/Clash para encontrar o texto de efeito atual deste card, além das regras oficiais e das instruções de download.",
    ],
  },
  "promo-m-pr-060b": {
    name: "Choque",
    text: [
      "Acesse Bandai.com/naruto/clash/ para encontrar o texto de efeito atual deste card, além das regras oficiais.",
    ],
  },
  "promo-m-pr-080": {
    name: "Os Sábios Sapos",
    text: [
      "Permanente",
      "Efeito: Quando você baixar um Ninja, você pode ver os X cards do topo do seu Deck, onde X = o Combate de saudável desse Ninja. Nesse caso, mova 1 desses cards para o topo do seu Deck e os outros cards para o fundo do seu Deck, em qualquer ordem.",
    ],
  },
  "promo-m-pr-081": {
    name: "Laço Rompido",
    text: [
      "Permanente (2)",
      "Efeito: Quando o seu oponente for comprar um card durante a Fase Inicial dele, em vez disso, ele compra um card e o revela. Nesse caso, se esse card for um card de Ninja, descarte-o, a menos que esse jogador faça você ganhar 1 Prêmio de Batalha.",
    ],
    flavor: "\"Em vez de perder todo esse tempo me perseguindo, você devia ter treinado.\"",
  },
  "promo-m-pr-082": {
    name: "Oito Cães Ninja",
    text: [
      "Efeito: Mova um card que não seja de Ninja da sua Pilha de Descartes para a sua mão. Se você moveu um card de Missão, coloque um Marcador -1/-1 no Ninja alvo. Depois, remova este card do jogo.",
    ],
  },
  "promo-m-pr-092": {
    name: "Amor sem Fim",
    text: [
      "Efeito: Compre 3 cards. Nesse caso, pule a sua Fase de Organização durante este turno.",
    ],
    flavor: "\"Obrigada...\"",
  },
  "promo-m-pr-us006": {
    name: "Chefão",
    text: [
      "Anulação Permanente (2)",
      "Efeito: Todos os cards de Jutsu e efeitos de Ninja que exijam Chakra não podem ser usados nem ativados.",
    ],
    flavor: "\"Era tudo encenação. ... Com uma mascarazinha fofa.\"",
  },
};
