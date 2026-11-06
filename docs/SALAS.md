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
5. **Início:** quando os dois estão prontos, a sala vira **partida iniciada**. Nesta etapa a tela só mostra
   "Partida iniciada — o jogo será implementado na próxima etapa".

### Regras da sala

- **Dois jogadores**: o anfitrião (`host`) e o convidado (`guest`). Um terceiro que tentar entrar recebe "Sala cheia".
- **O deck é escolhido dentro da sala** e é obrigatório para marcar Pronto.
- **Decks** precisam ser válidos pelas regras do montador (`summarizeDeck(...).isValid`: 50 cartas, até 3 por
  nome). O servidor valida de novo; não confia no navegador.
- **O deck é copiado ao ser escolhido.** Editar o deck no montador depois não muda a sala. Para usar a
  versão nova, o jogador escolhe o deck de novo na sala.
- **O deck de cada um é secreto:** o oponente vê só o nome do deck e a quantidade de cartas, nunca a lista.
- **Recarregar a página ou cair a conexão não tira o jogador da sala.** O navegador guarda a identidade dele
  e o reconecta ao mesmo lugar.
- **O convidado sai:** a vaga fica livre de novo (outro pode entrar com o código).
- **O anfitrião sai:** a sala é **encerrada** para os dois.
- **Trocar de deck** desmarca o **Pronto** de quem trocou.
- **Expiração:** a sala some sozinha depois de **6 horas sem nenhuma ação** (o prazo renova a cada ação).

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
  status: 'waiting' | 'lobby' | 'starting' | 'closed';
  rev: number;                // +1 a cada mudança; usado na sincronização e contra escritas simultâneas
  createdAt: string;
  updatedAt: string;
  host: Seat;
  guest: Seat | null;
  closedReason?: 'host-left';
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
   └──────convidado sai───────┘
qualquer estado ──anfitrião sai──▶ closed
```

## API

Todas as respostas de erro são `{ message }` em português, para mostrar direto na tela.

| Método e rota | Corpo | Resposta | Erros |
| --- | --- | --- | --- |
| `POST /api/rooms` | `{ nickname, playerId, token }` | `RoomView` (com o `id` da sala) | 400 apelido inválido |
| `GET /api/rooms/<id>?ping=1` | — | `RoomView` (com `ping=1`, também marca o jogador como online) | 400, 404 sala não existe/expirou |
| `POST /api/rooms/<id>/join` | `{ nickname, playerId, token }` | `RoomView` | 409 sala cheia ou encerrada |
| `POST /api/rooms/<id>/actions` | ação (abaixo) | `RoomView` | 401 token não é de um jogador da sala, 409 ação inválida no estado atual |

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
  plano (e na hora, ao voltar para a aba). Para de consultar quando a sala está `closed` ou não existe.
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
| `src/app/jogar/page.tsx` | Criar sala / entrar com código ou link. |
| `src/app/salas/[id]/page.tsx` | Sala de espera (e, no MVP 4, a partida). |

Reaproveita o que já existe: `parseSharedDeck` (`src/lib/deckShare.ts`) para validar o formato do deck,
`summarizeDeck` (`src/lib/deckRules.ts`) para as regras de montagem e `getRedis()`. O cabeçalho tem o link **Jogar**.

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
| Anfitrião sai | Sala encerrada | Convidado vira anfitrião |
| O que o oponente vê do deck | Nome e quantidade de cartas | Nada / lista completa |
| Endereços | `/jogar` e `/salas/<uuid>` | Outros nomes |
