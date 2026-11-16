# Salas de jogo (MVP 3)

> **Status: implementado** (lobby: criar, entrar, pronto, trocar deck, sair). A partida em si é o MVP 4.
> As decisões do fim do documento foram aprovadas com os valores padrão.

## Objetivo

Um jogador cria uma **sala**, recebe o **código dela (UUID)** e envia para um amigo. O amigo entra com o
código. **Dentro da sala**, cada um escolhe o deck e marca **Pronto**, e a sala passa para "partida iniciada".

A sala é pensada para várias partidas seguidas entre os mesmos jogadores:

```
entram na sala → escolhem o deck → iniciam a partida → fim de jogo → voltam a escolher o deck → …
```

Por isso o deck **não** é escolhido para criar ou entrar: ele pertence a cada partida, não à sala.

**Fora do escopo desta etapa:** a partida em si (tabuleiro, turnos, regras em jogo), que vem no MVP 4.
Também ficam de fora: chat, espectadores, busca de oponentes, contas/login e revanche.

## Fluxo do usuário

1. **Criar** (`/jogar`): o jogador informa um apelido e clica em **Criar sala**. Na sala, aparece o código
   com botões **Copiar código** e **Copiar link** (`/salas/<uuid>`).
2. **Convidar:** o anfitrião envia o código ou o link para o amigo, por fora do app (WhatsApp, Discord…).
3. **Entrar:** o amigo abre o link, ou cola o código em `/jogar` → **Entrar numa sala**. Ele informa o
   apelido e entra.
4. **Sala de espera** (`/salas/<uuid>`): os dois veem a sala atualizada em ~1 s:
   - apelido de cada um, deck escolhido (ou "ainda sem deck") e se está online;
   - **seletor de deck** com os decks válidos do jogador (o anfitrião já pode escolher antes do oponente chegar);
   - botão **Pronto** / **Cancelar pronto**, liberado só depois de escolher o deck;
   - trocar de deck desmarca o Pronto;
   - botão **Sair da sala**.
5. **Início:** quando os dois estão prontos, a sala vira **partida iniciada**. A tela troca para a **arena**
   (ver "Arena"); as jogadas chegam com o motor do jogo.

### Regras da sala

- **Dois jogadores**: o anfitrião (`host`) e o convidado (`guest`). Um terceiro que tentar entrar recebe "Sala cheia".
- **O deck é escolhido dentro da sala** e é obrigatório para marcar Pronto.
- **Decks** precisam ser válidos pelas regras do montador (`summarizeDeck(...).isValid`: 50 cartas,
  até 3 cópias de cada carta, Baralho de Reforço com até 15, Tokens com 1 cópia de cada). O servidor valida de novo; não confia no navegador. Os dois jogadores veem
  quantas cartas o outro tem no Baralho de Reforço (`reinforcementSize`), mas não quais são.
- **O deck é copiado ao ser escolhido.** Editar o deck no montador depois não muda a sala. Para usar a
  versão nova, o jogador escolhe o deck de novo na sala.
- **O deck de cada um é secreto:** o oponente vê só o nome do deck e a quantidade de cartas, nunca a lista.
- **Sair sem querer não tira o jogador da sala.** Fechar a aba, ir para outra página, recarregar ou cair a
  conexão mantêm o lugar dele. O navegador lembra a última sala (`lastRoomId` em `naruto-ccg:player`), e as
  telas **Jogar** e **Meus decks** mostram **"Você ainda está na sala de X → Voltar para a sala"** enquanto o
  lugar existir. Se a sala sumiu, o aviso some e a sala é esquecida.
- **Sair de verdade é só pelo botão "Sair da sala"** (com confirmação):
  - se o outro jogador continua na sala, a vaga fica livre e **quem ficou vira o anfitrião** (volta a esperar
    um oponente, sem Pronto);
  - se ninguém mais está na sala, **ela é apagada** na hora.
  Quem saiu pelo botão perde o lugar e esquece a sala; pode entrar de novo pelo código, se houver vaga.
- **Trocar de deck** desmarca o **Pronto** de quem trocou.
- **Expiração:** a sala some sozinha depois de **6 horas sem nenhuma ação** (o prazo renova a cada ação). É o
  que limpa salas abandonadas sem o botão Sair.

## Identidade sem login

Na primeira vez que entra numa sala, o navegador gera e guarda no localStorage (`naruto-ccg:player`):

- `playerId`: UUID público do jogador;
- `token`: segredo aleatório (UUID) que prova que é ele;
- `nickname`: último apelido usado (para preencher o campo da próxima vez).

As requisições à API mandam o token no cabeçalho `X-Player-Token`. O servidor guarda só o **hash** (SHA-256)
do token em cada vaga e nunca o devolve. Quem tem só o código da sala consegue **ver** a sala e **entrar
se houver vaga**, mas não consegue agir em nome de outro jogador.

## Dados no Redis

Banco compartilhado com o pokedex: **toda chave começa com `naruto-ccg:`** (ver `docs/DEPLOY.md`).

| Chave | Conteúdo | Expira |
| --- | --- | --- |
| `naruto-ccg:room:<uuid>` | Estado da sala (JSON abaixo) | 6 h após a última escrita |
| `naruto-ccg:room:<uuid>:seen` | Hash `host`/`guest` → horário da última consulta (presença) | junto com a sala |

```ts
interface Room {
  version: 1;
  id: string;                 // UUID da sala
  status: 'waiting' | 'lobby' | 'starting';
  rev: number;                // +1 a cada mudança; usado na sincronização e contra escritas simultâneas
  createdAt: string;
  updatedAt: string;
  host: Seat;
  guest: Seat | null;
}

interface Seat {
  playerId: string;
  tokenHash: string;          // SHA-256 do token; nunca sai do servidor
  nickname: string;           // 1–24 caracteres
  deck: { name: string; cards: Record<string, number>; custom?: Record<string, CustomCard> } | null; // cópia validada; null até escolher
  ready: boolean;
  joinedAt: string;
}
```

**Estados:**

```
waiting ──convidado entra──▶ lobby ──os dois prontos──▶ starting   (MVP 4: vira a partida)
   ▲                          │
   └──um dos dois sai─────────┘  (quem fica vira o anfitrião)
waiting ──o último sai──▶ sala apagada (DEL das duas chaves)
```

## API

Todas as respostas de erro são `{ message }` em português, para mostrar direto na tela.

| Método e rota | Corpo | Resposta | Erros |
| --- | --- | --- | --- |
| `POST /api/rooms` | `{ nickname, playerId, token }` | `RoomView` (com o `id` da sala) | 400 apelido inválido |
| `GET /api/rooms/<id>?ping=1` | — | `RoomView` (com `ping=1`, também marca o jogador como online) | 400, 404 sala não existe/expirou |
| `POST /api/rooms/<id>/join` | `{ nickname, playerId, token }` | `RoomView` | 404 sala não existe, 409 sala cheia |
| `POST /api/rooms/<id>/actions` | ação (abaixo) | `RoomView`, ou `null` se a ação apagou a sala | 401 token não é de um jogador da sala, 409 ação inválida no estado atual |
| `GET /api/rooms/<id>/custom-cards` | — | `{ cards }`: as cartas criadas dos dois decks | 401, 409 fora da partida |

- `POST /api/rooms` e `join` registram o `token` do jogador (o servidor guarda o hash).
- `join` com um token que **já ocupa** uma vaga devolve a sala normalmente (reconexão). O anfitrião abrindo o
  próprio link não vira convidado.
- **Ações:** `{ type: 'changeDeck', deck }` (escolher ou trocar o deck; 400 se não seguir as regras),
  `{ type: 'setReady', ready: boolean }` (409 sem deck escolhido) e `{ type: 'leave' }`.

**`RoomView`** (o que cada jogador recebe; sem tokens, sem lista de cartas do oponente):

```ts
interface RoomView {
  id: string;
  status: Room['status'];
  rev: number;
  you: 'host' | 'guest' | null; // null = visitante que ainda não entrou
  players: {
    seat: 'host' | 'guest';
    nickname: string;
    deckName: string | null; // null = ainda não escolheu
    deckSize: number;
    ready: boolean;
    online: boolean; // consultou a sala nos últimos 15 s
  }[];
  yourDeck?: { name: string; cards: Record<string, number> } | null; // só o seu
}
```

### Cartas criadas

Decks com cartas do **Criar carta** (`custom-<uuid>`) podem ir para a sala:

- **A carta vai com o deck.** `changeDeck` leva `deck.custom` (id no deck → carta do criador). O servidor valida
  cada carta campo a campo (`parseSharedCustomCard` em `src/lib/cardMaker/sharedCard.ts`: só campos conhecidos,
  tamanhos limitados, layouts e ícones da lista), aplica as regras de montagem com elas e guarda só as que o deck
  usa. A mesma carta criada (mesmo id) nos dois decks só vale se for igual (um importou do outro); versões diferentes são recusadas (409). Na partida, as regras da tela (Ninja,
  Reforço, Token, Missão Permanente) leem as cartas criadas da sala (`withRoomCards` em `model.ts`).
- **As artes ficam no Vercel Blob** (docs/DEPLOY.md, "Artes das cartas criadas"): a carta leva o endereço público
  da arte, enviada pelo **Salvar** do criador. Carta com arte ainda só no navegador não vai para a sala (o aviso
  pede para salvar no criador; `withCustomCards` em `src/lib/cardMaker/customDeck.ts`), e a sala recusa arte que não
  seja do Blob ou do próprio site (`/card-layouts/...`, `/cards/...`).
- **Na partida**, cada navegador busca as cartas criadas uma vez (`GET .../custom-cards`; a `RoomView` traz só
  `customCardIds`, porque a sala é consultada a cada segundo) e a arena as desenha (`ArenaCardsProvider` em
  `src/components/arena/arenaCards.tsx`). As imagens vêm direto do Blob.
- O oponente vê as cartas criadas do seu deck (os textos, não a ordem) a partir do início da partida: elas são
  necessárias para desenhar as cartas que ele vê.
- Os compartilhamentos por código levam as cartas criadas do mesmo jeito; quem importa recebe as cartas no próprio
  criador.

### Artes alternativas

As artes escolhidas no detalhe da carta (README, "Artes alternativas") também vão para a partida:

- No `changeDeck`, o navegador manda `deck.arts` (carta do catálogo → imagem no Blob + enquadramento) com as artes
  escolhidas para as cartas do deck (`chosenArtsFor` em `src/lib/altArtClient.ts`). O servidor valida
  (`parseDeckArts` em `src/lib/altArts.ts`: só imagens do Blob e só cartas que o deck usa). A escolha vale no
  momento em que o deck vai para a sala: trocar a arte depois só conta ao escolher o deck de novo.
- Na partida, a `RoomView` traz só `artKeys` (`<lado>:<carta>`); as artes vêm junto das cartas criadas, em
  `GET .../custom-cards` (`arts`: lado → carta → arte).
- Cada carta aparece com a arte de quem a levou, para os dois jogadores: o dono sai do `uid` da carta (`h…` = anfitrião,
  `g…` = convidado; `ownerOfUid`), e `useArenaLookup()(id, dono)` devolve a carta com a arte fixada
  (`withFixedArt`), montada pelo `CardFace`.

### Escritas simultâneas

Os dois jogadores podem agir ao mesmo tempo (ex.: os dois clicam em Pronto). Toda escrita é um
**compare-and-set** atômico no Redis (script Lua via `EVAL`, suportado pela Upstash):

1. o servidor lê a sala (rev `N`) e aplica a ação;
2. grava só se a sala ainda estiver na rev `N`, já com rev `N+1`, e renova a expiração;
3. se outra escrita passou na frente, relê e tenta de novo (até 3 vezes).

## Sincronização (navegador)

Um hook `useRoom(id)` concentra toda a comunicação. Se um dia a espera de ~1 s incomodar, só ele muda
(por exemplo, para WebSocket); as telas continuam iguais.

- Consulta `GET /api/rooms/<id>` a cada **1 s** com a aba visível e a cada **5 s** com a aba em segundo
  plano (e na hora, ao voltar para a aba). Para de consultar quando a sala não existe ou quando o jogador
  sai pelo botão.
- A resposta é sempre a sala inteira (poucas centenas de bytes); o hook só re-renderiza se algo mudou.
- A cada **5 s** a consulta leva `?ping=1`, que atualiza a presença do jogador (`:seen`). "Online" =
  consultou a sala nos últimos 15 s.
- Ações (`join`, `actions`) devolvem a sala atualizada na hora. Quem clicou não espera a próxima consulta.

**Custo estimado no Redis:** 2 comandos por consulta (ler a sala e a presença) + 2 a cada 5 s (gravar a
presença), ou seja ~16 mil comandos por hora com dois jogadores na sala. A cota é dividida com o pokedex (ver
`docs/DEPLOY.md`, "Limites").

## Organização do código

| Arquivo | Papel |
| --- | --- |
| `src/lib/rooms/model.ts` | Regras da sala em funções puras: `createRoom`, `joinRoom`, `applyAction`, `toView`. Sem rede nem Redis. |
| `src/lib/rooms/model.test.ts` | Testes das regras (`npm test`), como `deckRules.test.ts`. |
| `src/lib/rooms/store.ts` | Leitura/escrita no Redis (chaves, compare-and-set, expiração, presença) e helpers das rotas. |
| `src/app/api/rooms/...` | Rotas da tabela acima: validam a entrada, chamam `model` + `store`. |
| `src/lib/rooms/client.ts` | Identidade do jogador (`playerId`/`token`/`nickname` no localStorage) e chamadas à API. |
| `src/lib/rooms/useRoom.ts` | Hook de sincronização (consulta, ações, presença). |
| `src/components/PlayerSetup.tsx` | `NicknameForm` (criar/entrar) e `DeckSelect` (decks válidos, usado na sala). |
| `src/components/ReturnToRoom.tsx` | Aviso "Voltar para a sala" em Jogar e Meus decks. |
| `src/app/jogar/page.tsx` | Criar sala / entrar com código ou link. |
| `src/app/salas/[id]/page.tsx` | Sala de espera (e, no MVP 4, a partida). |

Reaproveita o que já existe: `parseSharedDeck` (`src/lib/deckShare.ts`) para validar o formato do deck,
`summarizeDeck` (`src/lib/deckRules.ts`) para as regras de montagem e `getRedis()`. O cabeçalho tem o link **Jogar**.

## Arena

Quando a sala chega em `starting`, a tela da sala troca a sala de espera pela **arena**
(`src/components/arena/GameArena.tsx`): dois Painéis de Jogo frente a frente, como na mesa
(docs/REGRAS.md, "Painel de Jogo").

O visual segue o design **"Campo de Jogo"**, com **7 temas** (TEMAS.md do design): **Madeira antiga**,
**Nuvens**, **Papel antigo** (o único claro), **Folhas**, **Bambu**, **Areia** e **Água**. O layout é o mesmo em
todos; mudam só as cores e sombras (`--color-*`, `--shadow-*`), a fonte (Zen Old Mincho ou Shippori Mincho, do
Google Fonts, carregada só com a arena aberta) e as texturas (fundo da mesa, borda e miolo do Campo de Batalha,
em `public/textures/`). Os temas ficam em `src/lib/game/boardThemes.ts`, e o GameArena aplica o escolhido como
variáveis na raiz da arena. Areia e Água têm a mesa clara, então definem também o fundo das zonas
(`zoneFillOpp`/`zoneFillMine`: um degradê escuro translúcido que deixa cartas e rótulos legíveis).

- **Cada jogador escolhe o seu tema** pelo seletor 🎨 no cabeçalho do site durante a partida (no menu ⋯ em
  tela cheia). A escolha vale só para quem troca e fica salva no navegador (`naruto-ccg:arena-theme`, em
  `src/lib/arenaTheme.ts`), valendo também nas próximas partidas; o oponente continua com o tema dele. Quem
  nunca escolheu vê o tema sorteado no início da partida (`GameState.theme`; partidas criadas antes dos temas
  abrem em Madeira antiga). Não há jogada para trocar o tema: o servidor não guarda a escolha de ninguém. Na
  prévia, `/arena?tema=papel` força um tema até escolher outro no seletor.
- As costas das cartas usam a imagem da carta física (`public/cards/card-back.webp`) em todos os temas.
- **Tela cheia (F11):** a arena ocupa a tela inteira (sem o cabeçalho do site, sem barra e sem espaçamento;
  classe `arena-screen` em globals.css). Os controles da partida (tema, Encerrar partida, Sair da sala; na
  prévia, tema e Nova partida) ficam no menu **⋯** do canto superior direito da arena, e o erro da última
  jogada aparece ao lado dele (`fullscreenMenu` e `notice` do GameArena).

Tudo é desenhado num **palco fixo
de 1600×900** escalado para caber inteiro na área abaixo do cabeçalho (`scale = min(largura/1600, altura/900)`,
recalculado com ResizeObserver), sem rolagem em nenhum tamanho de janela.

- **Em cima:** a mão do oponente (só o verso, em leque, saindo da borda) e a linha dele, da esquerda para a
  direita: Deck, Descartes, Chakra, Vila e Prêmios de Batalha.
- **No meio:** o Campo de Batalha octogonal, com os Times do oponente em cima, os seus embaixo e a fase atual
  no centro. Missões jogadas no Campo ficam à esquerda da tela e Jutsus à direita, para os dois jogadores (o
  oponente não é espelhado aqui), sempre nessas faixas, mesmo sem Ninjas no Campo. O centro tem 3 colunas
  invisíveis, uma por Time (ver **Colunas do Campo** abaixo). Os Ninjas de Apoio ficam atrás do Líder
  (deslocados), e o Ninja Ferido aparece girado 90°.
- **Embaixo:** a sua linha, espelhada (Prêmios, Vila, Chakra, Descartes, Deck) e a sua mão em leque, saindo
  da borda (a carta sobe e cresce ao passar o mouse).
- **À esquerda:** a placa de cada jogador (apelido, Prêmios n/10, Marcador de Turnos n/10, Mão, Reforço e
  Removidos), o número do turno, as 3 fases e o botão do Atacante (**Próxima fase**, e **Passar turno** na
  Batalha).
- Os tokens ficam escopados à arena (`GameArena.module.css`): o resto do app continua com o tema laranja,
  e os diálogos abertos pela arena herdam o tema da arena.
- Prévia com dados de exemplo em **`/arena`** (fora do menu), para ajustar o layout sem dois jogadores.

## Partida: tabuleiro manual

Primeira parte do MVP 4. Ainda **não há regras de turno** (fases, custos, batalha): os jogadores mexem
nas próprias cartas como numa mesa, e o servidor só garante quem pode ver e mexer em quê.

- **Início:** quando os dois marcam Pronto, cada deck vira cartas na Área do Deck, **embaralhadas no
  servidor** (sorteio criptográfico), as cartas de Esquadrão vão para o Baralho de Reforço e cada jogador
  compra **6 cartas** (docs/REGRAS.md 2.3). O mulligan é manual: **R** com o mouse sobre a mão (devolve a mão e embaralha) e depois comprar.
- **Jogadas** (`POST /api/rooms/<id>/actions` com `{ type: 'game', action }`):
  - `{ type: 'move', uid, to }`: arrastar uma carta SUA para outra zona SUA (devolvida ao Deck, vai para o topo);
  - `{ type: 'draw' }`: comprar o topo do deck;
  - `{ type: 'shuffle' }`: embaralhar o deck;
  - `{ type: 'search', cardId }`: buscar uma carta específica do deck para a mão **e embaralhar em seguida**;
  - `{ type: 'returnHand' }`: devolver a mão inteira ao Deck e embaralhar (o mulligan, docs/REGRAS.md 2, passo
    4-A; a compra das novas cartas continua manual). Na tela é a tecla **R** com o mouse sobre a sua mão, sem
    confirmação. Com `bottom: true` (tecla **Shift+F** sobre a mão, par do F que manda uma carta só), a mão vai para o **fundo** do Deck, na ordem
    da mão, **sem embaralhar**. No registro, o dono vê quais cartas voltaram; o oponente vê só quantas;
  - `{ type: 'nextPhase' }`: avançar a fase do turno (ver "Turnos");
  - `{ type: 'setInjured', uid, injured }`: virar um Ninja seu para Ferido ou Saudável (ver "Ninja Ferido");
  - `{ type: 'passTurn' }`: passar o turno (ver "Turnos");
  - `{ type: 'returnReward', owner }`: devolver um Prêmio de Batalha (ver "Prêmios de Batalha");
  - `{ type: 'adjustPower', uid, delta }`: aumentar ou diminuir o Poder de um Time seu (ver "Times");
  - `{ type: 'reveal', from, count }`: revelar `count` cartas do **topo** (`from: 'top'`) ou do **fundo**
    (`'bottom'`) do seu Deck. Elas vão para a sua **Vila**, face para cima, na ordem do Deck, e os dois veem
    (também no registro, com os nomes). Depois, cada carta é movida à mão (arrastando ou pelo detalhe). Na tela é
    o botão 👁 no seu Deck, que pergunta de onde e quantas (pedir mais do que há revela o que sobrou);
  - `{ type: 'setCoins', uid, kind, delta }`: pôr ou tirar moedas de um tipo numa carta sua (ver "Moedas");
  - `{ type: 'flip' }`: jogar a Moeda Ninja (ver "Moeda Ninja");
  - `{ type: 'adjustTurn', delta }`: subir ou descer o SEU Marcador de Turnos (efeitos de cartas, como S02 M-043),
    entre 0 e 10. Na tela são o − e o + que aparecem ao passar o mouse na barra **Marcador** da sua placa.
- **Topo ou fundo do Deck pelo teclado:** com o mouse sobre uma carta sua (mão, Vila, Campo, Chakra, Descartes…),
  **T** a põe no topo e **F** no fundo do Deck, sem embaralhar (a mesma ação `move` do detalhe; Esquadrões não
  vão para o Deck).
- **Mover pelo detalhe da carta:** clicar numa carta sua (mão, Vila, Campo, Chakra, Descartes, Reforço,
  Removidos) abre o detalhe com **Descartar**, **→ zona** (mão, Vila, Campo, Chakra, topo ou fundo do Deck, Removidos
  e, para Esquadrões/Reforço, Reforço) e **→ Prêmio do oponente**. São as mesmas ações `move` e `giveReward` do
  arrastar (o fundo do Deck é `move` com `bottom: true`, que só existe no detalhe); numa carta de um Time, move
  só ela.
- **Turnos** (docs/REGRAS.md 3.1 e 3.6): quem começa é **sorteado** no início da partida (`GameState.active`,
  o Atacante; `turnNumber` conta os turnos a partir de 1). Só o Atacante passa o turno, com qualquer número de
  cartas na mão (o limite de 6 da etapa M não é cobrado: os jogadores se policiam). Ao passar, o **Marcador de Turnos dele avança
  1 casa** (até 10, `TURN_MAX`) e o oponente vira o Atacante. A compra do início do turno continua manual
  (botão `+1`), porque os efeitos "No Início do Turno" vêm antes dela e o primeiro jogador não compra no
  primeiro turno. **Fases** (`GameState.phase`, índice em `PHASES`: Missão, Organização e Batalha;
  Inicial e Final ficaram de fora): o Atacante avança com **Próxima fase** (`nextPhase`); na Batalha o botão vira
  **Passar turno**, e o turno seguinte começa na Missão. As fases são só a referência dos dois jogadores: o que cada uma permite
  ainda não é controlado. Na tela, a placa do Atacante diz "sua vez" / "Atacante" e o oponente vê o botão
  desligado "Turno de X". Na prévia `/arena`, o oponente devolve o turno na hora. Os outros botões
  continuam valendo para os dois jogadores em qualquer turno (o Bloqueador também mexe nas cartas dele).
- **Ninja Ferido** (docs/REGRAS.md 3.5.4, "Dano e Ninjas Feridos"): a tecla **R** com o mouse sobre um Ninja seu
  na Vila ou no Campo de Batalha vira a carta para a horizontal; R de novo cura. Fica guardado na carta
  (`CardInstance.injured`), continua ao entrar num Time e ao voltar do Campo para a Vila, e some quando a carta
  sai da Vila/Campo.
- **Prêmios de Batalha** (docs/REGRAS.md 3.5.4): ninguém coloca cartas nos **próprios** Prêmios. Você manda
  uma carta SUA para a Área de Prêmios do **oponente** (ação `giveReward`): arrastando o seu Deck ou clicando no
  botão 🏆 no canto dele, ao lado do 👁 (vai a carta do topo, sem revelar qual é), ou arrastando uma carta específica para os
  Prêmios dele (ou pelo detalhe da carta, **→ Prêmio do oponente**). Cartas nos Prêmios ficam lá (face para
  baixo, ninguém vê) e não podem ser movidas, mas podem ser **devolvidas** (ex.: Prêmio dado por engano): o
  botão ↩ na Área de Prêmios (a sua ou a do oponente; qualquer um dos dois; sempre à mostra, desligado com a
  Área vazia) manda a última carta que entrou ali
  de volta, face para baixo, ao **topo do Deck de quem a deu** (ação `returnReward`, com `owner` = dono da
  Área). No registro, ninguém vê qual carta voltou. Ao lado do ↩, o 🔍 **olha um Prêmio** (ação `peekReward`,
  com `owner` e `index`, 0 = o primeiro que entrou): o diálogo mostra os Prêmios face para baixo, você escolhe
  a posição e o servidor manda a carta **só para você** (`GameState.peek` → `GameView.peek`, enquanto a carta
  continuar na Área). Dali dá para **recuperar** essa carta (`returnReward` com `uid` e `to: 'hand'`: ela vai para a
  mão de quem a deu). No registro, os dois veem que você olhou (e qual posição) ou recuperou um Prêmio; o
  nome da carta, só você.
- **Times** (docs/REGRAS.md 3.4 F e 3.5.1): soltar um Ninja sobre outro Ninja seu na Vila ou no Campo de
  Batalha forma um Time (ou aumenta o Time dele). Ações `joinTeam` (`uid` sobre `target`), `moveTeam` (o Time
  inteiro para outra zona, arrastando pela alça "Time n/3") e `setLeader` (botão ★).
  - De **1 a 3 Ninjas** por Time (`TEAM_MAX`); na Vila o número de Times é livre (Ninja sozinho = Time de 1).
  - No máximo **3 Times no Campo de Batalha** (`BATTLEFIELD_MAX_TEAMS`); só Times de Ninjas contam.
  - O primeiro Ninja do Time é o **Ninja Líder** (por cima, com o anel brilhante); quem entra fica atrás, como Ninja de Apoio.
  - Arrastar um membro sozinho para fora (ou para um espaço vazio da mesma zona) o tira do Time; Time que
    fica com 1 Ninja se desfaz. Fora da Vila/Campo não existem Times.
  - O Time fica guardado na própria carta (`CardInstance.team`), e os membros ficam juntos na zona.
  - **Reordenar (Vila):** arrastar um Time (pelo chip) ou uma carta para os lados, entre os outros Times da
    Vila, muda a posição; uma barra brilhante mostra onde vai entrar. Vindo de outra zona, entra na posição
    marcada. As ações `move` e `moveTeam` aceitam `before` (uid de uma carta da zona de destino: entra antes
    do Time dela; sem `before`, entra no fim). Soltar em cima de um Ninja continua formando Time.
  - **Colunas do Campo:** o centro do Campo de Batalha tem 3 colunas invisíveis (esquerda, centro, direita, as
    mesmas para os dois jogadores, já que a mesa não é espelhada): o Time bloqueia o Time do oponente na mesma
    coluna. Arrastar um Ninja ou Time para o Campo o põe na coluna sob o mouse (ela acende); se já houver um
    Time nela, os dois trocam de coluna (ou o outro vai para uma livre, se quem chegou veio de fora). A coluna
    fica em `CardInstance.lane` (0 a 2) em todos os membros, e `move`/`moveTeam` aceitam `lane`. Sem coluna
    escolhida (ex.: botão "para o Campo de Batalha"), o Time vai para a livre, o centro primeiro
    (`assignLanes` em `src/lib/game/state.ts`). Missões, Jutsus e outras cartas que não são Ninja não têm
    coluna.
  - Cada Time (inclusive Ninja sozinho, nos dois lados) tem o chip **PODER n**: o **Poder do Time**
    (docs/REGRAS.md 3.5.4) = Combate do Líder + Suporte de cada Apoio, no estado atual de cada um (Saudável ou
    Ferido), recalculado ao ferir/curar ou trocar o Líder (`src/lib/game/teamPower.ts`). Valores "X" aparecem
    como "5+X". A dica do chip mostra a conta. No seu lado, o chip é a alça para arrastar o Time inteiro.
  - **Ajuste manual do Poder** (efeitos de cartas): ao passar o mouse num Time seu, o chip mostra **−** e **+**
    (ação `adjustPower`). O ajuste fica no Ninja Líder (`CardInstance.power`) e soma no Poder (verde quando
    aumentado, vermelho quando diminuído; sem X, o Poder não fica abaixo de 0). Continua ao ferir/curar e ao ir
    para o Campo; se o Ninja sai do Time, o ajuste vai com ele; some quando a carta sai da Vila/Campo. Não zera
    sozinho no fim do turno: volte com −/+ quando o efeito acabar. Cliques seguidos viram uma jogada só no
    registro.
- **Moedas** (docs/REGRAS.md 6.4 e 6.5): cartas na Vila ou no Campo de Batalha guardam moedas por tipo
  (`CardInstance.coins`, tipo → quantidade, até 99 de cada e 12 tipos por carta). O tipo é o nome impresso na
  carta ("Growth", "+1/+1", "Poison", "Bomb", "State 2"…), digitado no detalhe da carta ou escolhido entre as
  atalhos (Growth e Poison nos Ninjas; Ninja nas outras cartas; as demais, como +1/+1, são digitadas); o nome é arrumado no servidor (`coinKind`: sem espaços ou
  aspas sobrando, "−" vira "-"). Na mesa, cada tipo vira um selo no canto da carta (verde/vermelho para as de
  Poder), visível para os dois; o detalhe de uma carta sua mostra a seção **Marcadores (moedas)**, com − e + e uma linha explicando o uso. O −/+ do Poder do Time continua sendo o caminho para efeitos que duram só o turno; as moedas são o que fica marcado na carta.
  - **Moedas de Poder** somam sozinhas no Poder do Time (`coinPower` em `teamPower.ts`): Growth dá +1/+1, e
    as com o valor no nome ("+1/+1", "-2/-2", "+0/+2") dão esse valor (o primeiro número no Líder, o segundo
    nos Apoios). As outras são só marcadores.
  - **Missão Permanente (X)** entrando na Vila (vinda de fora da Vila/Campo) já chega com X moedas "Ninja"
    (`permanentCoins` em `src/models/card.ts`, lido do texto "Permanent (X)" ou "Counter Permanent (X)"; com X
    não numérico, fica por conta do jogador). Tirar a moeda no início do turno e mandar a Missão para o Chakra
    na última continuam manuais.
  - As moedas seguem a carta entre a Vila e o Campo, ao entrar ou sair de um Time, ao ferir/curar e ao trocar
    o Líder; somem quando a carta sai da Vila/Campo. No Crescimento [Growth], quem passa as moedas do Ninja
    antigo para o novo é o jogador.
  - Cliques seguidos no mesmo tipo da mesma carta viram uma jogada só no registro.
- **Moeda Ninja** (docs/REGRAS.md 4.16, "Jogar a Moeda Ninja"): o botão **🪙 Moeda** no canto inferior direito
  (qualquer um dos dois, a qualquer momento) pede ao servidor um sorteio de Cara [Heads] ou Coroa [Tails]. A
  mesa não muda: o resultado vai para o registro (`LogEntry.result`) e aparece no meio da arena, para os dois,
  por 4 s.
- **Encerrar partida** (`{ type: 'endGame' }`, qualquer um dos dois): volta para a escolha de decks (decks
  mantidos, ninguém pronto). Sair da sala no meio da partida também a encerra.
- **Registro de jogo** (`GameState.log`, as últimas `LOG_MAX` = 80 jogadas): toda jogada que muda algo é
  anotada no servidor com quem fez, o turno, as cartas (pelo `cardId`) e de onde para onde foram (mover,
  mover Time, reposicionar, comprar, buscar, embaralhar, juntar ao Time, Líder, ferir/curar, Prêmio, fase,
  passar turno, moedas, Moeda Ninja, Marcador de Turnos). Só o que é do jogo: jogadas sem efeito e a troca de tema não entram. Na visão de cada jogador, o nome da carta só aparece
  se ele pode vê-la na zona de origem ou na de destino (ex.: o oponente vê "comprou uma carta"; Prêmios
  dados do topo do Deck ficam ocultos para os dois). Na tela, o botão **📜 Registro** no canto inferior
  direito da arena (com o número de jogadas novas) abre o painel, agrupado por turno, com os nomes das cartas
  clicáveis para ver o detalhe. Ao lado dele, **⌨ Atalhos** abre, no mesmo lugar, a lista de teclas de
  atalho e gestos da arena (`SHORTCUTS` em `src/components/arena/GameArena.tsx`; atalho novo entra nessa lista).
- **Visibilidade** (docs/REGRAS.md, "Zonas"): Vila, Campo de Batalha, Chakra, Descartes e Removidos são
  públicos; Mão e Reforço só o dono vê; Deck e Prêmios ninguém vê. O que não pode ser visto chega ao
  navegador só como contagem (`ZoneView.count`, sem `cards`).
- **Busca:** `GET /api/rooms/<id>/deck` (só o dono, só durante a partida) devolve a quantidade por carta no
  deck, **sem a ordem**. A tela mostra em ordem alfabética.
- **Na tela:** arrastar (HTML5 drag and drop) entre as suas zonas, inclusive mão e os contadores Reforço e
  Removidos da sua placa; clique no seu Deck compra 1 carta, **R** com o mouse sobre ele embaralha (com uma animação
  das cartas girando, que o oponente também vê, disparada pelo registro) e **F** abre a busca no Deck; clique nos Descartes, no Chakra ou em Reforço/Removidos abre a lista com botões para mover;
  na sua mão, cópias iguais (mesmo `cardId`) aparecem como uma pilha só, com a badge **×N** (arrastar a pilha
  leva uma cópia), e a mão fica sempre organizada por tipo: Ninjas → Clientes → Missões → Jutsus (dentro do
  tipo, na ordem em que chegaram). A mão é um **arco rolável**: as cartas se aproximam a cada pilha a mais
  (de 90px até 56px entre elas) e voltam a se afastar quando a mão diminui; quando nem assim cabem, a **roda
  do mouse** (ou o deslize do touchpad) sobre a mão gira o arco, uma carta por vez, e os chips **‹ N** / **N ›**
  nas pontas mostram quantas estão escondidas de cada lado (clique gira o arco). Na prévia, `/arena?mao=15`
  compra 15 cartas a mais. Clique numa carta visível abre o detalhe; **Alt + mouse** sobre uma carta visível mostra a carta ampliada
  (do lado oposto ao mouse, em pé mesmo se o Ninja estiver Ferido), enquanto o Alt estiver pressionado.
- **Código:** regras puras em `src/lib/game/state.ts` (testes em `state.test.ts`); integração na sala em
  `src/lib/rooms/model.ts` (ações `game`/`endGame`, campo `game` na sala e na `RoomView`); arena em
  `src/components/arena/` (`GameArena.tsx`, `GameArena.module.css`, `SearchDeckDialog.tsx`). A prévia
  `/arena` roda uma partida local com dois decks de exemplo.
- **Ainda não:** o que cada fase permite, mexer em outras cartas do oponente (ferir, descartar, Chakra, topo do
  Deck, Prêmios, mudar o controle), ver ou mostrar cartas da mão, olhar o topo do Deck sem revelar e
  reordenar, escolhas aleatórias (ex.: descarte aleatório da mão do oponente), cartas presas a outras
  ("Attach this card to the target"), turno extra, Poder Mental no chip do Time, quem bloqueia quem na Batalha,
  condições de vitória e mulligan automático.

## Jogar sozinho

`/jogar/sozinho` (link em **Jogar**) roda uma partida só no navegador, sem sala nem servidor, para treinar ou
testar decks:

- O jogador escolhe um deck válido para cada lado (**Jogador 1** e **Jogador 2**; pode ser o mesmo deck). As cartas
  criadas e as artes alternativas escolhidas neste navegador valem nos dois lados.
- Ele comanda os dois: a arena mostra embaixo o lado que ele está jogando e em cima o outro (com a mão virada para
  baixo, como numa sala). **⇅ Trocar de lado** inverte. Com **Trocar ao passar o turno** (ligado por padrão),
  passar o turno já troca para o novo Atacante.
- As jogadas usam as mesmas regras da sala (`applyGameAction`, aplicado no navegador como o lado de baixo).
- A partida fica no localStorage (`naruto-ccg:solo-game`), e volta ao recarregar a página. **Nova partida**
  recomeça com os mesmos decks; **Trocar decks** encerra e volta para a escolha.
- Código: `src/app/jogar/sozinho/page.tsx`.

## Ligação com a partida (MVP 4)

Quando a sala chega em `starting`, ela ganha um campo `game` com o estado da partida, e a sala vira
`playing`. Ao fim do jogo, a sala volta para `lobby` com os dois **sem Pronto** (o deck anterior continua
selecionado, mas pode ser trocado), fechando o ciclo "escolher deck → jogar → escolher de novo". A mesma
estrutura serve para o jogo:

- **motor do jogo em TypeScript puro**: `aplicar(estado, ação)` e `visãoDoJogador(estado, lado)`, sem rede;
- o servidor é a autoridade: embaralha, valida cada jogada e devolve a cada jogador só o que ele pode ver
  (a mão e o baralho do oponente ficam ocultos);
- as jogadas são novas ações em `POST /api/rooms/<id>/actions`, e `useRoom` continua sincronizando por `rev`.

## Decisões (aprovadas)

| Decisão | Adotado | Alternativas consideradas |
| --- | --- | --- |
| Apelido | Obrigatório (1–24 caracteres), lembrado no navegador | Opcional, com "Jogador 1/2" |
| Expiração da sala | 6 h sem ações | Outro prazo |
| Alguém sai pelo botão | Quem fica vira anfitrião; o último a sair apaga a sala | Anfitrião saindo encerra a sala (versão anterior) |
| Saída sem querer | Lugar mantido + aviso "Voltar para a sala" | Liberar a vaga por inatividade |
| O que o oponente vê do deck | Nome e quantidade de cartas | Nada / lista completa |
| Endereços | `/jogar` e `/salas/<uuid>` | Outros nomes |
