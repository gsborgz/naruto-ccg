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
- **Decks** precisam ser válidos pelas regras do montador (`summarizeDeck(...).isValid`: 50 cartas, até 3 por
  nome, Baralho de Reforço com até 15). O servidor valida de novo; não confia no navegador. Os dois jogadores veem
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
  deck: { name: string; cards: Record<string, number> } | null; // cópia validada; null até escolher
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

- **Seu painel (embaixo):** Campo de Batalha em cima (virado para o oponente), Prêmios de Batalha à
  esquerda, Vila no centro, Deck e Descartes à direita com a Área de Chakra embaixo deles. No rodapé:
  apelido e mão, Andamento do Jogo, Baralho de Reforço, Removidos de Jogo e Indicador de Turnos.
- **Painel do oponente (em cima):** o mesmo, **espelhado** como se ele estivesse do outro lado da mesa
  (as áreas trocam de lado e o Campo de Batalha dele encosta no seu, no meio da tela). Os textos e os
  números do Indicador de Turnos continuam legíveis.
- Por enquanto só desenha as zonas e as contagens que a sala já conhece (tamanho do Deck e do Reforço).
  As cartas entram com o motor do jogo.
- Prévia com dados de exemplo em **`/arena`** (fora do menu), para ajustar o layout sem dois jogadores.

## Partida: tabuleiro manual

Primeira parte do MVP 4. Ainda **não há regras de turno** (fases, custos, batalha): os jogadores mexem
nas próprias cartas como numa mesa, e o servidor só garante quem pode ver e mexer em quê.

- **Início:** quando os dois marcam Pronto, cada deck vira cartas na Área do Deck, **embaralhadas no
  servidor** (sorteio criptográfico), as cartas de Esquadrão vão para o Baralho de Reforço e cada jogador
  compra **6 cartas** (docs/REGRAS.md 2.3). O mulligan é manual (devolver ao deck + embaralhar).
- **Jogadas** (`POST /api/rooms/<id>/actions` com `{ type: 'game', action }`):
  - `{ type: 'move', uid, to }`: arrastar uma carta SUA para outra zona SUA (devolvida ao Deck, vai para o topo);
  - `{ type: 'draw' }`: comprar o topo do deck;
  - `{ type: 'shuffle' }`: embaralhar o deck;
  - `{ type: 'search', cardId }`: buscar uma carta específica do deck para a mão **e embaralhar em seguida**.
- **Prêmios de Batalha** (docs/REGRAS.md 3.5.4): ninguém coloca cartas nos **próprios** Prêmios. Você manda
  uma carta SUA para a Área de Prêmios do **oponente** (ação `giveReward`): arrastando o seu Deck (vai a carta do
  topo, sem revelar qual é) ou uma carta específica para os Prêmios dele. Cartas nos Prêmios ficam lá (face para
  baixo, ninguém vê) e não podem ser movidas.
- **Times** (docs/REGRAS.md 3.4 F e 3.5.1): soltar um Ninja sobre outro Ninja seu na Vila ou no Campo de
  Batalha forma um Time (ou aumenta o Time dele). Ações `joinTeam` (`uid` sobre `target`), `moveTeam` (o Time
  inteiro para outra zona, arrastando pela alça "Time n/3") e `setLeader` (botão ★).
  - De **1 a 3 Ninjas** por Time (`TEAM_MAX`); na Vila o número de Times é livre (Ninja sozinho = Time de 1).
  - No máximo **3 Times no Campo de Batalha** (`BATTLEFIELD_MAX_TEAMS`); só Times de Ninjas contam.
  - O primeiro Ninja do Time é o **Ninja Líder** (selo "LÍDER"); quem entra fica atrás, como Ninja de Apoio.
  - Arrastar um membro sozinho para fora (ou para um espaço vazio da mesma zona) o tira do Time; Time que
    fica com 1 Ninja se desfaz. Fora da Vila/Campo não existem Times.
  - O Time fica guardado na própria carta (`CardInstance.team`), e os membros ficam juntos na zona.
- **Encerrar partida** (`{ type: 'endGame' }`, qualquer um dos dois): volta para a escolha de decks (decks
  mantidos, ninguém pronto). Sair da sala no meio da partida também a encerra.
- **Visibilidade** (docs/REGRAS.md, "Zonas"): Vila, Campo de Batalha, Chakra, Descartes e Removidos são
  públicos; Mão e Reforço só o dono vê; Deck e Prêmios ninguém vê. O que não pode ser visto chega ao
  navegador só como contagem (`ZoneView.count`, sem `cards`).
- **Busca:** `GET /api/rooms/<id>/deck` (só o dono, só durante a partida) devolve a quantidade por carta no
  deck, **sem a ordem**. A tela mostra em ordem alfabética.
- **Na tela:** arrastar (HTML5 drag and drop) entre as suas zonas, inclusive mão, Reforço e Removidos; no
  Deck, os botões `+1` (comprar), `⇄` (embaralhar) e `⌕` (buscar); clique na pilha de Descartes ou em
  Reforço/Removidos abre a lista com botões para mover; clique numa carta visível abre o detalhe.
- **Visual:** uma mesa só, com os painéis sem moldura de "sistema": pilhas (Deck, Descartes, Prêmios) como
  espaços do tamanho de uma carta com a contagem na pilha, áreas largas (Vila, Campo de Batalha, Chakra) com
  o nome em marca d'água, mãos nas bordas da mesa (a sua em leque), fases do turno na linha do meio. O
  tamanho das cartas acompanha a altura de cada painel (`cqh`).
- **Código:** regras puras em `src/lib/game/state.ts` (testes em `state.test.ts`); integração na sala em
  `src/lib/rooms/model.ts` (ações `game`/`endGame`, campo `game` na sala e na `RoomView`); arena em
  `src/components/arena/` (`GameArena.tsx`, `SearchDeckDialog.tsx`). A prévia `/arena` roda uma partida
  local com dois decks de exemplo.
- **Ainda não:** turnos/fases e Marcador de Turnos, mexer em outras cartas do oponente, virar cartas (Ninja ferido), mulligan automático.

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
