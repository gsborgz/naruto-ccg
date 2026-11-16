/**
 * Estado de uma partida em funções puras (sem rede, sem Redis, sem Math.random direto).
 *
 * Por enquanto é um "tabuleiro manual": os jogadores movem as próprias cartas entre as zonas, compram,
 * embaralham e buscam cartas no deck. As regras de turno (fases, custos, batalha) virão por cima disto.
 *
 * Visibilidade (docs/REGRAS.md, "Zonas"):
 * - Vila, Campo de Batalha, Chakra, Descartes e Removidos: face para cima, todos veem;
 * - Mão e Baralho de Reforço: só o dono vê; o oponente vê só a contagem;
 * - Deck e Prêmios de Batalha: face para baixo, ninguém vê (nem o dono); só a contagem.
 */

import { BOARD_THEME_IDS, DEFAULT_BOARD_THEME } from './boardThemes.ts';

export type Side = 'host' | 'guest';

export const ZONES = [
  'deck',
  'hand',
  'village',
  'battlefield',
  'chakra',
  'discard',
  'rewards',
  'reinforcement',
  'removed',
] as const;
export type ZoneName = (typeof ZONES)[number];

const PUBLIC_ZONES: ReadonlySet<ZoneName> = new Set(['village', 'battlefield', 'chakra', 'discard', 'removed']);
const OWNER_ZONES: ReadonlySet<ZoneName> = new Set(['hand', 'reinforcement']);

/** Uma carta física na partida: `uid` único na partida, `cardId` aponta para o catálogo. */
export interface CardInstance {
  uid: string;
  cardId: string;
  /**
   * Time [Team] a que o Ninja pertence (só na Vila e no Campo de Batalha). Os membros de um Time ficam
   * juntos na zona, e o primeiro deles é o Ninja Líder. Ninja sem `team` = Time de 1.
   */
  team?: string;
  /**
   * Ninja Ferido [Injured]: a carta fica na horizontal (docs/REGRAS.md 3.5.4, "Dano e Ninjas Feridos").
   * Só na Vila e no Campo de Batalha; continua ferido ao voltar do Campo para a Vila.
   */
  injured?: true;
  /**
   * Ajuste manual do Poder (efeitos de cartas, ex.: +2/+2): soma no Poder do Time do Ninja. Os botões +/− do
   * Time mexem no Líder; se o Ninja sai do Time, o ajuste vai com ele. Só na Vila e no Campo de Batalha.
   */
  power?: number;
  /**
   * Moedas sobre a carta (docs/REGRAS.md 6.4 e 6.5): tipo → quantidade (sempre ≥ 1). O tipo é o nome
   * impresso ("Growth", "+1/+1", "Poison", "Bomb"…) ou "Ninja" (a Moeda Ninja das Missões Permanentes (X)).
   * Moedas de Poder ("Growth", "+N/+N", "-N/-N") somam no Poder do Time (`teamPower.ts`). Só na Vila e no
   * Campo de Batalha, e continuam com a carta entre as duas.
   */
  coins?: Record<string, number>;
}

export type PlayerZones = Record<ZoneName, CardInstance[]>;

export interface GameState {
  version: 1;
  /** Zonas de cada jogador. No deck, o índice 0 é o topo. */
  players: Record<Side, PlayerZones>;
  /** Posição do Marcador de Turnos de cada jogador. */
  turn: Record<Side, number>;
  /** Jogador do turno, o Atacante [Attacker] (docs/REGRAS.md 3.1). O outro é o Bloqueador. */
  active: Side;
  /** Número do turno da partida (começa em 1 e sobe a cada "passar turno"). */
  turnNumber: number;
  /** Fase do turno do Atacante (índice em `PHASES`). Só referência: as regras de cada fase ainda não valem. */
  phase?: number;
  /**
   * Tema da arena sorteado na partida (id em `BOARD_THEMES`): o padrão de quem ainda não escolheu um tema no
   * seletor. A escolha de cada jogador fica no navegador dele (`src/lib/arenaTheme.ts`), não aqui.
   */
  theme?: string;
  /** Registro de jogo: as últimas jogadas (até `LOG_MAX`), da mais antiga para a mais nova. */
  log?: LogEntry[];
  /**
   * Prêmio de Batalha que cada jogador olhou por último (`peekReward`): só ele vê essa carta (`GameView.peek`),
   * enquanto ela continuar naquela Área de Prêmios.
   */
  peek?: Partial<Record<Side, { owner: Side; uid: string }>>;
}

/** Quantas entradas do registro de jogo ficam guardadas na partida. */
export const LOG_MAX = 80;

/**
 * Uma jogada no registro de jogo. Guarda o `cardId` das cartas (não o uid); quem vê o nome é decidido na
 * visão de cada jogador (`gameView`), com as mesmas regras das zonas.
 */
export interface LogEntry {
  /** Número da entrada na partida (sobe sempre, mesmo quando as antigas saem do registro). */
  n: number;
  who: Side;
  /** Turno da partida em que a jogada aconteceu. */
  turn: number;
  type: GameAction['type'];
  /** Cartas envolvidas (a primeira é a principal; no Time, o Líder primeiro). */
  cards?: string[];
  from?: ZoneName;
  to?: ZoneName;
  /** joinTeam: o Ninja do Time em que a carta entrou. */
  target?: string;
  /** setInjured: ferido (true) ou curado (false). */
  injured?: boolean;
  /** nextPhase: a fase nova. */
  phase?: number;
  /** returnHand: quantas cartas voltaram (o oponente vê só isso, sem os nomes). */
  count?: number;
  /** adjustPower: quanto o Poder mudou (somado nas jogadas seguidas no mesmo Time). */
  delta?: number;
  /** returnReward e peekReward: de quem é a Área de Prêmios. */
  owner?: Side;
  /** peekReward: posição do Prêmio olhado na Área (1 = o primeiro que entrou). */
  slot?: number;
  /** reveal: de onde do Deck saíram as cartas. */
  position?: 'top' | 'bottom';
  /** setCoins: o tipo de moeda (`delta` diz quantas entraram ou saíram). */
  coin?: string;
  /** flip: o lado sorteado da Moeda Ninja. */
  result?: 'heads' | 'tails';
}

/** Fases do turno (docs/REGRAS.md 3.2 a 3.6). */
export const PHASES = ['Inicial', 'Missão', 'Organização', 'Batalha', 'Final'] as const;

/** Gerador de números em [0, 1). No servidor é criptográfico; nos testes, previsível. */
export type Rng = () => number;

export type GameAction =
  /**
   * Mover uma carta sua para outra zona. Com `before` (uid de uma carta na zona de destino), entra logo antes
   * do Time dessa carta: é o que reordena os Times na Vila e no Campo de Batalha. Sem `before`, entra por último
   * (na Vila e no Campo, também dentro da mesma zona: vai para o fim). No Deck, entra no topo, ou no fundo
   * com `bottom`.
   */
  | { type: 'move'; uid: string; to: ZoneName; before?: string; bottom?: boolean }
  | { type: 'draw' }
  | { type: 'shuffle' }
  | { type: 'search'; cardId: string }
  /**
   * Devolver a mão inteira ao Deck e embaralhar (docs/REGRAS.md 2, passo 4-A: o mulligan). A compra das
   * novas cartas continua manual. Com `bottom`, a mão vai para o fundo do Deck, na ordem da mão, **sem
   * embaralhar** (efeitos como "put your hand on the bottom of your Deck").
   */
  | { type: 'returnHand'; bottom?: boolean }
  /** Juntar o Ninja `uid` ao Time do Ninja `target` (arrastar uma carta para cima da outra). */
  | { type: 'joinTeam'; uid: string; target: string }
  /** Mover o Time inteiro do Ninja `uid` para outra zona (ex.: enviar para o Campo de Batalha). */
  | { type: 'moveTeam'; uid: string; to: ZoneName; before?: string }
  /** Tornar o Ninja `uid` o Ninja Líder do Time dele. */
  | { type: 'setLeader'; uid: string }
  /** Virar o Ninja `uid` para Ferido (horizontal) ou de volta para Saudável. */
  | { type: 'setInjured'; uid: string; injured: boolean }
  /** Avançar para a próxima fase do turno (só o Atacante; a Fase Final termina com "passar turno"). */
  | { type: 'nextPhase' }
  /**
   * Prêmio de Batalha para o OPONENTE (docs/REGRAS.md 3.5.4): uma carta sua vai para a Área de Prêmios
   * dele, face para baixo. Sem `uid`, vai a carta do topo do seu Deck (o caso normal).
   */
  | { type: 'giveReward'; uid?: string }
  /**
   * Devolver um Prêmio de Batalha (ex.: dado por engano): a última carta que entrou na Área de Prêmios de
   * `owner` (ou, com `uid`, essa carta, depois de olhá-la com `peekReward`) volta, face para baixo, ao topo do
   * Deck do dono da carta (o oponente de `owner`); com `to: 'hand'`, vai para a mão dele (o "Recuperar" do
   * Prêmio olhado). Qualquer um dos dois pode devolver, de qualquer uma das Áreas.
   */
  | { type: 'returnReward'; owner: Side; uid?: string; to?: 'deck' | 'hand' }
  /**
   * Olhar o Prêmio de Batalha na posição `index` (0 = o primeiro que entrou) da Área de `owner`: só quem
   * olhou vê a carta (`GameView.peek`) e o registro anota que ele olhou (o nome, só para ele).
   */
  | { type: 'peekReward'; owner: Side; index: number }
  /**
   * Revelar `count` cartas do topo ou do fundo do seu Deck: elas vão para a sua Vila, face para cima, na ordem
   * do Deck (a primeira é a de cima), para os dois jogadores verem. Depois, cada uma é movida à mão.
   */
  | { type: 'reveal'; from: 'top' | 'bottom'; count: number }
  /** Aumentar (`delta` > 0) ou diminuir o Poder do Time do Ninja `uid` (o ajuste fica no Líder). */
  | { type: 'adjustPower'; uid: string; delta: number }
  /**
   * Pôr (`delta` > 0) ou tirar moedas do tipo `kind` da carta `uid` (na Vila ou no Campo de Batalha).
   * Com 0 moedas, o tipo some da carta.
   */
  | { type: 'setCoins'; uid: string; kind: string; delta: number }
  /**
   * Jogar a Moeda Ninja [Flip] (docs/REGRAS.md 4.16): o servidor sorteia Cara [Heads] ou Coroa [Tails] e
   * anota no registro, para os dois verem. Qualquer jogador, a qualquer momento.
   */
  | { type: 'flip' }
  /** Subir (`delta` > 0) ou descer o SEU Marcador de Turnos (efeitos de cartas), entre 0 e `TURN_MAX`. */
  | { type: 'adjustTurn'; delta: number }
  /**
   * Passar o turno (docs/REGRAS.md 3.6 N): só o Atacante. Avança o próprio Marcador de Turnos 1 casa e o
   * oponente vira o Atacante. O limite de 6 cartas na mão (3.6 M) não é cobrado: os jogadores se policiam.
   */
  | { type: 'passTurn' };

export class GameError extends Error {}

const REWARDS_FROM_OPPONENT =
  'Os Prêmios de Batalha vêm do Deck do oponente: arraste a sua carta para a Área de Prêmios dele.';
const REWARDS_LOCKED = 'Cartas na Área de Prêmios ficam lá (face para baixo).';

function otherSide(side: Side): Side {
  return side === 'host' ? 'guest' : 'host';
}

/** docs/REGRAS.md 3.4 F: cada Time tem de 1 a 3 Ninjas (na Vila, o número de Times é livre). */
export const TEAM_MAX = 3;
/** docs/REGRAS.md 3.5.1: até 3 Times enviados à Batalha por turno. */
export const BATTLEFIELD_MAX_TEAMS = 3;

/** Zonas onde existem Times. */
const TEAM_ZONES: ReadonlySet<ZoneName> = new Set(['village', 'battlefield']);

/** O que as ações precisam saber do catálogo. */
export interface CardRules {
  isNinja: (cardId: string) => boolean;
  /**
   * Moedas Ninja com que a carta entra na Vila: o X de uma Missão "Permanent (X)" (docs/REGRAS.md 6.4).
   * 0 (ou sem a função) = nenhuma.
   */
  permanentCoins?: (cardId: string) => number;
}

const ANY_CARD: CardRules = { isNinja: () => true };

/** Tipo da Moeda Ninja das Missões Permanentes (X). */
export const NINJA_COIN = 'Ninja';
/**
 * Atalhos de moeda na tela, por tipo de carta (qualquer outra é digitada como impressa, ex.: "+1/+1",
 * "Bomb"): nos Ninjas, Growth e Poison; nas outras cartas (Missões Permanentes, Clientes), a Moeda Ninja.
 */
export const COIN_SUGGESTIONS = { ninja: ['Growth', 'Poison'], other: [NINJA_COIN] } as const;
/** Mais moedas de um tipo numa carta. */
export const COINS_MAX = 99;
/** Mais tipos de moeda diferentes numa carta. */
export const COIN_KINDS_MAX = 12;
/** Maior nome de tipo de moeda. */
export const COIN_NAME_MAX = 24;

/**
 * Nome do tipo de moeda arrumado: sem espaços sobrando, sem aspas em volta e com o sinal de menos comum
 * ("−1/−1" vira "-1/-1"). Vazio, longo demais ou com caracteres de controle: `null`.
 */
export function coinKind(raw: string): string | null {
  const kind = raw
    .replace(/[−–]/g, '-')
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!kind || kind.length > COIN_NAME_MAX || /[\u0000-\u001f\u007f]/.test(kind)) return null;
  return kind;
}

/** Chave do grupo de uma carta: o Time dela, ou ela mesma (Time de 1). */
function groupKey(c: CardInstance): string {
  return c.team ?? `solo:${c.uid}`;
}

/** Quantos Times (de Ninjas) há numa zona: outras cartas não contam. */
export function countTeams(cards: readonly CardInstance[], isNinja: (cardId: string) => boolean): number {
  return teamGroups(cards.filter((c) => isNinja(c.cardId))).length;
}

/** Cartas de uma zona agrupadas por Time, na ordem da zona (o primeiro de cada grupo é o Líder). */
export function teamGroups(cards: readonly CardInstance[]): CardInstance[][] {
  const groups = new Map<string, CardInstance[]>();
  for (const c of cards) {
    const key = groupKey(c);
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  }
  return [...groups.values()];
}

/** Uma carta só com os campos dados (sem `team`/`injured`/`power`/`coins` indefinidos no JSON). */
function card(
  uid: string,
  cardId: string,
  team?: string,
  injured?: boolean,
  power?: number,
  coins?: Record<string, number>,
): CardInstance {
  return {
    uid,
    cardId,
    ...(team ? { team } : {}),
    ...(injured ? { injured: true as const } : {}),
    ...(power ? { power } : {}),
    ...(coins && Object.keys(coins).length > 0 ? { coins } : {}),
  };
}

/** A mesma carta com outro Time/estado, mantendo o resto (Ferido, ajuste de Poder e moedas). */
function keep(c: CardInstance, patch: { team?: string | null; injured?: boolean; power?: number }): CardInstance {
  return card(
    c.uid,
    c.cardId,
    patch.team === null ? undefined : (patch.team ?? c.team),
    patch.injured ?? c.injured,
    patch.power ?? c.power,
    c.coins,
  );
}

/**
 * Limpa Times desfeitos e estados fora de lugar: fora da Vila/Campo não há Time nem Ninja Ferido,
 * e um Time de 1 é só um Ninja.
 */
function normalizeTeams(zones: PlayerZones) {
  for (const zone of ZONES) {
    const counts = new Map<string, number>();
    for (const c of zones[zone]) if (c.team) counts.set(c.team, (counts.get(c.team) ?? 0) + 1);
    const here = TEAM_ZONES.has(zone);
    zones[zone] = zones[zone].map((c) => {
      const team = here && c.team && (counts.get(c.team) ?? 0) >= 2 ? c.team : undefined;
      const injured = here && !!c.injured;
      const power = here ? (c.power ?? 0) : 0;
      const coins = here ? c.coins : undefined;
      return team === c.team && injured === !!c.injured && power === (c.power ?? 0) && coins === c.coins
        ? c
        : card(c.uid, c.cardId, team, injured, power, coins);
    });
  }
}

function checkBattlefield(zones: PlayerZones, rules: CardRules) {
  if (countTeams(zones.battlefield, rules.isNinja) > BATTLEFIELD_MAX_TEAMS) {
    throw new GameError(`No máximo ${BATTLEFIELD_MAX_TEAMS} Times no Campo de Batalha.`);
  }
}

/** Mais cartas que dá para revelar de uma vez (um Deck tem 50). */
export const REVEAL_MAX = 60;

/** Maior ajuste manual de Poder num Ninja (para cima ou para baixo). */
export const POWER_MOD_MAX = 99;

/** Cartas compradas na preparação (docs/REGRAS.md 2.3). */
export const OPENING_HAND = 6;
/** Última casa do Indicador de Turnos (o marcador começa em 0). */
export const TURN_MAX = 10;

/** Jogador do turno. Partidas criadas antes do campo existir começam pelo anfitrião. */
export function activeSide(game: GameState): Side {
  return game.active ?? 'host';
}

/** Fisher–Yates com o gerador dado. Não altera o original. */
export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function emptyZones(): PlayerZones {
  return Object.fromEntries(ZONES.map((z) => [z, []])) as unknown as PlayerZones;
}

/**
 * Prepara a partida: cada deck vira cartas na Área do Deck (embaralhadas) e as cartas do Baralho de
 * Reforço vão para a zona de Reforço. Cada jogador compra a mão inicial.
 */
export function createGame(
  decks: Record<Side, Record<string, number>>,
  isReinforcement: (cardId: string) => boolean,
  rng: Rng,
): GameState {
  const players = {} as Record<Side, PlayerZones>;
  for (const side of ['host', 'guest'] as const) {
    const zones = emptyZones();
    let n = 0;
    const main: CardInstance[] = [];
    for (const [cardId, qty] of Object.entries(decks[side])) {
      for (let i = 0; i < qty; i++) {
        const card = { uid: `${side[0]}${++n}`, cardId };
        (isReinforcement(cardId) ? zones.reinforcement : main).push(card);
      }
    }
    zones.deck = shuffle(main, rng);
    zones.hand = zones.deck.splice(0, OPENING_HAND);
    players[side] = zones;
  }
  // Quem começa é sorteado (docs/REGRAS.md 2.3, passo 3).
  const active: Side = rng() < 0.5 ? 'host' : 'guest';
  // Tema da arena sorteado na partida (salvo nela, para os dois verem o mesmo).
  const theme = BOARD_THEME_IDS[Math.floor(rng() * BOARD_THEME_IDS.length)] ?? DEFAULT_BOARD_THEME;
  return { version: 1, players, turn: { host: 0, guest: 0 }, active, turnNumber: 1, phase: 0, theme };
}

/**
 * Põe `cards` na lista logo antes do Time da carta `before` (o primeiro membro dele), ou no fim se `before`
 * não estiver na lista.
 */
function insertBefore(list: CardInstance[], cards: CardInstance[], before: string | undefined) {
  const target = before ? list.find((c) => c.uid === before) : undefined;
  const index = target ? list.findIndex((c) => groupKey(c) === groupKey(target)) : -1;
  if (index < 0) list.push(...cards);
  else list.splice(index, 0, ...cards);
}

function findCard(zones: PlayerZones, uid: string): { zone: ZoneName; index: number } | null {
  for (const zone of ZONES) {
    const index = zones[zone].findIndex((c) => c.uid === uid);
    if (index >= 0) return { zone, index };
  }
  return null;
}

/** Aplica uma ação do jogador `who` nas zonas DELE. Lança GameError se não for possível. */
/**
 * Aplica uma ação do jogador `who` e, se ela mudou algo, anota no registro de jogo. Lança GameError se não
 * for possível.
 */
export function applyGameAction(
  game: GameState,
  who: Side,
  action: GameAction,
  rng: Rng,
  rules: CardRules = ANY_CARD,
): GameState {
  // Jogar a moeda não muda a mesa: só o registro, com o resultado.
  if (action.type === 'flip') {
    const log = game.log ?? [];
    const result = rng() < 0.5 ? ('heads' as const) : ('tails' as const);
    const n = (log.at(-1)?.n ?? 0) + 1;
    return { ...game, log: [...log, { n, who, turn: game.turnNumber ?? 1, type: 'flip' as const, result }].slice(-LOG_MAX) };
  }
  // Olhar um Prêmio também não muda a mesa: guarda o que o jogador viu e anota no registro.
  if (action.type === 'peekReward') {
    const rewards = game.players[action.owner].rewards;
    const seen = rewards[action.index];
    if (!seen) throw new GameError('Esse Prêmio não existe (a Área de Prêmios mudou).');
    const log = game.log ?? [];
    const n = (log.at(-1)?.n ?? 0) + 1;
    const entry: LogEntry = {
      n,
      who,
      turn: game.turnNumber ?? 1,
      type: 'peekReward',
      cards: [seen.cardId],
      from: 'rewards',
      owner: action.owner,
      slot: action.index + 1,
    };
    return {
      ...game,
      peek: { ...game.peek, [who]: { owner: action.owner, uid: seen.uid } },
      log: [...log, entry].slice(-LOG_MAX),
    };
  }
  const next = applyAction(game, who, action, rng, rules);
  if (next === game) return game;
  // Reordenar na mesma zona sem mudar a ordem (ex.: soltar a última carta no fim): nada a fazer nem anotar.
  if ((action.type === 'move' || action.type === 'moveTeam') && action.to !== 'deck') {
    const from = findCard(game.players[who], action.uid)?.zone;
    if (from === action.to && JSON.stringify(game.players[who][from]) === JSON.stringify(next.players[who][from])) {
      return game;
    }
  }
  const entry = describe(game, next, who, action);
  const log = game.log ?? [];
  // Cliques seguidos no mesmo +/− (Poder do mesmo Time, moedas do mesmo tipo na mesma carta, Marcador de
  // Turnos) viram uma jogada só no registro.
  const last = log.at(-1);
  if (
    (entry.type === 'adjustPower' || entry.type === 'setCoins' || entry.type === 'adjustTurn') &&
    last?.type === entry.type &&
    last.who === who &&
    last.turn === (game.turnNumber ?? 1) &&
    last.cards?.[0] === entry.cards?.[0] &&
    last.coin === entry.coin
  ) {
    const delta = (last.delta ?? 0) + (entry.delta ?? 0);
    const rest = log.slice(0, -1);
    return { ...next, log: delta === 0 ? rest : [...rest, { ...last, delta }] };
  }
  const n = (log.at(-1)?.n ?? 0) + 1;
  return { ...next, log: [...log, { n, who, turn: game.turnNumber ?? 1, ...entry }].slice(-LOG_MAX) };
}

/** O que a jogada fez, lido do estado de ANTES (onde as cartas estavam) e do de depois. */
function describe(
  before: GameState,
  after: GameState,
  who: Side,
  action: GameAction,
): Omit<LogEntry, 'n' | 'who' | 'turn'> {
  const zones = before.players[who];
  const at = (uid: string) => {
    const found = findCard(zones, uid);
    return found ? { zone: found.zone, card: zones[found.zone][found.index] } : null;
  };
  switch (action.type) {
    case 'move': {
      const c = at(action.uid);
      return {
        type: 'move',
        cards: c ? [c.card.cardId] : [],
        from: c?.zone,
        to: action.to,
        ...(action.to === 'deck' && action.bottom ? { position: 'bottom' as const } : {}),
      };
    }
    case 'moveTeam': {
      const c = at(action.uid);
      if (!c) return { type: 'moveTeam', to: action.to };
      const key = groupKey(c.card);
      const members = zones[c.zone].filter((x) => groupKey(x) === key).map((x) => x.cardId);
      return { type: 'moveTeam', cards: members, from: c.zone, to: action.to };
    }
    case 'draw':
      return { type: 'draw', cards: zones.deck[0] ? [zones.deck[0].cardId] : [], from: 'deck', to: 'hand' };
    case 'search':
      return { type: 'search', cards: [action.cardId], from: 'deck', to: 'hand' };
    case 'reveal': {
      const n = Math.min(action.count, zones.deck.length);
      const cards = action.from === 'top' ? zones.deck.slice(0, n) : zones.deck.slice(zones.deck.length - n);
      return {
        type: 'reveal',
        cards: cards.map((c) => c.cardId),
        count: n,
        from: 'deck',
        to: 'village',
        position: action.from,
      };
    }
    case 'returnHand':
      return {
        type: 'returnHand',
        cards: zones.hand.map((c) => c.cardId),
        count: zones.hand.length,
        from: 'hand',
        to: 'deck',
        ...(action.bottom ? { position: 'bottom' as const } : {}),
      };
    case 'joinTeam': {
      const c = at(action.uid);
      const t = at(action.target);
      return { type: 'joinTeam', cards: c ? [c.card.cardId] : [], from: c?.zone, to: t?.zone, target: t?.card.cardId };
    }
    case 'setLeader':
    case 'setInjured': {
      const c = at(action.uid);
      return {
        type: action.type,
        cards: c ? [c.card.cardId] : [],
        from: c?.zone,
        ...(action.type === 'setInjured' ? { injured: action.injured } : {}),
      };
    }
    case 'giveReward': {
      const c = action.uid ? at(action.uid) : zones.deck[0] ? { zone: 'deck' as const, card: zones.deck[0] } : null;
      return { type: 'giveReward', cards: c ? [c.card.cardId] : [], from: c?.zone, to: 'rewards' };
    }
    case 'nextPhase':
      return { type: 'nextPhase', phase: after.phase ?? 0 };
    case 'returnReward': {
      // Com `uid` (o Prêmio olhado), quem devolveu sabe qual foi: o registro guarda a carta (só ele vê).
      const c = action.uid ? before.players[action.owner].rewards.find((x) => x.uid === action.uid) : undefined;
      return {
        type: 'returnReward',
        from: 'rewards',
        to: action.to ?? 'deck',
        owner: action.owner,
        ...(c ? { cards: [c.cardId] } : {}),
      };
    }
    case 'peekReward':
      return { type: 'peekReward', from: 'rewards', owner: action.owner, slot: action.index + 1 };
    case 'adjustPower': {
      const c = at(action.uid);
      const leader = c && zones[c.zone].find((x) => groupKey(x) === groupKey(c.card));
      return { type: 'adjustPower', cards: leader ? [leader.cardId] : [], from: c?.zone, delta: action.delta };
    }
    case 'setCoins': {
      const c = at(action.uid);
      return { type: 'setCoins', cards: c ? [c.card.cardId] : [], from: c?.zone, coin: action.kind, delta: action.delta };
    }
    case 'adjustTurn':
      return { type: 'adjustTurn', delta: after.turn[who] - before.turn[who] };
    case 'flip':
    case 'shuffle':
    case 'passTurn':
      return { type: action.type };
  }
}

function applyAction(
  game: GameState,
  who: Side,
  action: GameAction,
  rng: Rng,
  rules: CardRules,
): GameState {
  const zones: PlayerZones = Object.fromEntries(ZONES.map((z) => [z, [...game.players[who][z]]])) as PlayerZones;
  const done = (): GameState => {
    normalizeTeams(zones);
    checkBattlefield(zones, rules);
    return { ...game, players: { ...game.players, [who]: zones } };
  };
  const mustFind = (uid: string) => {
    const at = findCard(zones, uid);
    if (!at) throw new GameError('Essa carta não é sua ou não está mais em jogo.');
    return at;
  };

  switch (action.type) {
    case 'move': {
      if (action.to === 'rewards') throw new GameError(REWARDS_FROM_OPPONENT);
      const at = mustFind(action.uid);
      if (at.zone === 'rewards') throw new GameError(REWARDS_LOCKED);
      const moved = zones[at.zone][at.index];
      // Na mesma zona, só a Vila e o Campo reordenam (sem `before` = para o fim); nas outras, nada muda.
      if (at.zone === action.to && !moved.team && !TEAM_ZONES.has(at.zone)) return game;
      if (action.before === moved.uid) return game;
      zones[at.zone].splice(at.index, 1);
      // Mover uma carta sozinha a tira do Time (o ajuste de Poder e as moedas vão junto).
      let solo = keep(moved, { team: null });
      // Missão Permanente (X) entrando na Vila: já com as X Moedas Ninja (docs/REGRAS.md 6.4).
      const x = rules.permanentCoins?.(moved.cardId) ?? 0;
      if (action.to === 'village' && !TEAM_ZONES.has(at.zone) && x > 0) {
        solo = card(solo.uid, solo.cardId, undefined, false, 0, { [NINJA_COIN]: Math.min(COINS_MAX, x) });
      }
      // Carta devolvida ao Deck vai para o topo (ou o fundo, com `bottom`); nas outras zonas, antes do Time de
      // `before` ou por último.
      if (action.to === 'deck') {
        if (action.bottom) zones.deck.push(solo);
        else zones.deck.unshift(solo);
      }
      else insertBefore(zones[action.to], [solo], action.before);
      return done();
    }
    case 'draw': {
      const card = zones.deck.shift();
      if (!card) throw new GameError('Seu deck está vazio.');
      zones.hand.push(card);
      return done();
    }
    case 'shuffle':
      zones.deck = shuffle(zones.deck, rng);
      return done();
    case 'returnHand': {
      if (zones.hand.length === 0) throw new GameError('Sua mão está vazia.');
      const back = zones.hand.map((c) => card(c.uid, c.cardId));
      // Para o fundo: na ordem da mão, sem embaralhar. Senão, junto com o Deck e embaralha (o mulligan).
      zones.deck = action.bottom ? [...zones.deck, ...back] : shuffle([...zones.deck, ...back], rng);
      zones.hand = [];
      return done();
    }
    case 'reveal': {
      if (!Number.isInteger(action.count) || action.count < 1) throw new GameError('Escolha quantas cartas revelar.');
      if (zones.deck.length === 0) throw new GameError('Seu deck está vazio.');
      const n = Math.min(action.count, zones.deck.length);
      const cards = action.from === 'top' ? zones.deck.splice(0, n) : zones.deck.splice(zones.deck.length - n, n);
      zones.village.push(...cards.map((c) => card(c.uid, c.cardId)));
      return done();
    }
    case 'search': {
      const index = zones.deck.findIndex((c) => c.cardId === action.cardId);
      if (index < 0) throw new GameError('Essa carta não está no seu deck.');
      zones.hand.push(...zones.deck.splice(index, 1));
      zones.deck = shuffle(zones.deck, rng); // buscar no deck sempre termina embaralhando
      return done();
    }
    case 'joinTeam': {
      if (action.uid === action.target) return game;
      const from = mustFind(action.uid);
      const joining = zones[from.zone][from.index];
      const targetAt = mustFind(action.target);
      const target = zones[targetAt.zone][targetAt.index];
      if (!TEAM_ZONES.has(targetAt.zone)) throw new GameError('Times só existem na Vila e no Campo de Batalha.');
      if (!rules.isNinja(joining.cardId) || !rules.isNinja(target.cardId)) {
        throw new GameError('Só Ninjas formam Times.');
      }
      const teamId = target.team ?? `t-${target.uid}`;
      if (joining.team === teamId) return game;
      const size = zones[targetAt.zone].filter((c) => c.uid === target.uid || (!!target.team && c.team === target.team)).length;
      if (size >= TEAM_MAX) throw new GameError(`Um Time tem no máximo ${TEAM_MAX} Ninjas.`);

      zones[from.zone].splice(from.index, 1);
      const list = zones[targetAt.zone];
      for (let i = 0; i < list.length; i++) if (list[i].uid === target.uid) list[i] = { ...list[i], team: teamId };
      // Entra logo depois do último membro: o Líder continua sendo o primeiro.
      const last = list.reduce((acc, c, i) => (c.team === teamId ? i : acc), -1);
      list.splice(last + 1, 0, keep(joining, { team: teamId }));
      return done();
    }
    case 'moveTeam': {
      if (action.to === 'rewards') throw new GameError(REWARDS_FROM_OPPONENT);
      const at = mustFind(action.uid);
      if (at.zone === 'rewards') throw new GameError(REWARDS_LOCKED);
      if (at.zone === action.to && !TEAM_ZONES.has(at.zone)) return game;
      const key = groupKey(zones[at.zone][at.index]);
      const members = zones[at.zone].filter((c) => groupKey(c) === key);
      if (action.before && members.some((c) => c.uid === action.before)) return game; // antes de si mesmo
      zones[at.zone] = zones[at.zone].filter((c) => groupKey(c) !== key);
      if (action.to === 'deck') zones.deck.unshift(...members);
      else insertBefore(zones[action.to], members, action.before);
      return done();
    }
    case 'giveReward': {
      let given: CardInstance | undefined;
      if (action.uid) {
        const at = mustFind(action.uid);
        if (at.zone === 'rewards') throw new GameError(REWARDS_LOCKED);
        given = zones[at.zone].splice(at.index, 1)[0];
      } else {
        given = zones.deck.shift();
        if (!given) throw new GameError('Seu deck está vazio.');
      }
      const opponent = otherSide(who);
      const theirs = { ...game.players[opponent], rewards: [...game.players[opponent].rewards, card(given.uid, given.cardId)] };
      normalizeTeams(zones);
      checkBattlefield(zones, rules);
      return { ...game, players: { ...game.players, [who]: zones, [opponent]: theirs } as Record<Side, PlayerZones> };
    }
    case 'returnReward': {
      const owner = action.owner;
      const deckOwner = otherSide(owner);
      const rewards = [...game.players[owner].rewards];
      let back: CardInstance | undefined;
      if (action.uid) {
        const i = rewards.findIndex((c) => c.uid === action.uid);
        if (i < 0) throw new GameError('Esse Prêmio não está mais nessa Área de Prêmios.');
        back = rewards.splice(i, 1)[0];
      } else {
        back = rewards.pop();
      }
      if (!back) throw new GameError('Essa Área de Prêmios está vazia.');
      const players = { ...game.players };
      players[owner] = { ...players[owner], rewards };
      const back2 = card(back.uid, back.cardId);
      players[deckOwner] =
        action.to === 'hand'
          ? { ...players[deckOwner], hand: [...players[deckOwner].hand, back2] }
          : { ...players[deckOwner], deck: [back2, ...players[deckOwner].deck] };
      return { ...game, players };
    }
    case 'adjustPower': {
      if (!Number.isInteger(action.delta) || action.delta === 0) return game;
      const at = mustFind(action.uid);
      if (!TEAM_ZONES.has(at.zone)) throw new GameError('Só Times na Vila ou no Campo de Batalha têm Poder.');
      const list = zones[at.zone];
      const key = groupKey(list[at.index]);
      const li = list.findIndex((c) => groupKey(c) === key);
      const leader = list[li];
      if (!rules.isNinja(leader.cardId)) throw new GameError('Só Ninjas têm Poder.');
      const power = Math.max(-POWER_MOD_MAX, Math.min(POWER_MOD_MAX, (leader.power ?? 0) + action.delta));
      if (power === (leader.power ?? 0)) return game;
      list[li] = keep(leader, { power });
      return done();
    }
    case 'setCoins': {
      if (!Number.isInteger(action.delta) || action.delta === 0) return game;
      const kind = coinKind(action.kind);
      if (!kind) throw new GameError(`Dê um nome à moeda (até ${COIN_NAME_MAX} letras).`);
      const at = mustFind(action.uid);
      if (!TEAM_ZONES.has(at.zone)) throw new GameError('Moedas só ficam em cartas na Vila ou no Campo de Batalha.');
      const target = zones[at.zone][at.index];
      const coins = { ...target.coins };
      const now = coins[kind] ?? 0;
      if (now === 0 && action.delta < 0) return game;
      if (now === 0 && Object.keys(coins).length >= COIN_KINDS_MAX) {
        throw new GameError(`No máximo ${COIN_KINDS_MAX} tipos de moeda numa carta.`);
      }
      const count = Math.max(0, Math.min(COINS_MAX, now + action.delta));
      if (count === now) return game;
      if (count === 0) delete coins[kind];
      else coins[kind] = count;
      zones[at.zone][at.index] = card(target.uid, target.cardId, target.team, target.injured, target.power, coins);
      return done();
    }
    case 'adjustTurn': {
      if (!Number.isInteger(action.delta) || action.delta === 0) return game;
      const turn = Math.max(0, Math.min(TURN_MAX, game.turn[who] + action.delta));
      if (turn === game.turn[who]) return game;
      return { ...game, turn: { ...game.turn, [who]: turn } as Record<Side, number> };
    }
    case 'flip':
    case 'peekReward':
      return game; // tratados em applyGameAction (a mesa não muda)
    case 'passTurn': {
      if (activeSide(game) !== who) throw new GameError('Só o Atacante (o jogador do turno) pode passar o turno.');
      return {
        ...game,
        turn: { ...game.turn, [who]: Math.min(TURN_MAX, game.turn[who] + 1) } as Record<Side, number>,
        active: otherSide(who),
        turnNumber: (game.turnNumber ?? 1) + 1,
        phase: 0,
      };
    }
    case 'nextPhase': {
      if (activeSide(game) !== who) throw new GameError('Só o Atacante (o jogador do turno) avança as fases.');
      const phase = game.phase ?? 0;
      if (phase >= PHASES.length - 1) throw new GameError('Esta é a Fase Final: passe o turno.');
      return { ...game, phase: phase + 1 };
    }
    case 'setInjured': {
      const at = mustFind(action.uid);
      const target = zones[at.zone][at.index];
      if (!TEAM_ZONES.has(at.zone)) throw new GameError('Só Ninjas na Vila ou no Campo de Batalha ficam Feridos.');
      if (!rules.isNinja(target.cardId)) throw new GameError('Só Ninjas ficam Feridos.');
      if (!!target.injured === action.injured) return game;
      zones[at.zone][at.index] = keep(target, { injured: action.injured });
      return done();
    }
    case 'setLeader': {
      const at = mustFind(action.uid);
      const list = zones[at.zone];
      const leader = list[at.index];
      if (!leader.team) return game;
      const first = list.findIndex((c) => c.team === leader.team);
      if (first === at.index) return game;
      list.splice(at.index, 1);
      list.splice(first, 0, leader);
      return done();
    }
  }
}

/** Uma zona como o jogador `viewer` a vê: sempre a contagem; as cartas só se ele puder vê-las. */
export interface ZoneView {
  count: number;
  cards?: CardInstance[];
}

export type SideView = Record<ZoneName, ZoneView>;

export interface GameView {
  players: Record<Side, SideView>;
  turn: Record<Side, number>;
  /** Jogador do turno (Atacante). */
  active: Side;
  turnNumber: number;
  /** Fase do turno (índice em `PHASES`). */
  phase: number;
  /** Tema visual da arena. */
  theme: string;
  /** Registro de jogo, com o nome das cartas só quando o jogador pode vê-las. */
  log: LogEntryView[];
  /**
   * O Prêmio de Batalha que ESTE jogador olhou por último, se ainda estiver na mesma Área: de quem é a Área,
   * a posição (0 = o primeiro que entrou) e a carta. O oponente não recebe isto.
   */
  peek?: { owner: Side; index: number; card: CardInstance };
}

/** Entrada do registro como um jogador a vê: sem `cards` (e com `hidden`) se ele não pode ver as cartas. */
export type LogEntryView = LogEntry & { hidden?: boolean };

/**
 * Quem vê as cartas de uma jogada: quem pode vê-las na zona de origem ou na de destino (as zonas são de
 * quem jogou; os Prêmios dados ao oponente são face para baixo para todos).
 */
function logView(entry: LogEntry, viewer: Side | null): LogEntryView {
  if (!entry.cards?.length) return entry;
  // Prêmio olhado (e devolvido depois de olhado): só quem olhou sabe qual é.
  if (entry.type === 'peekReward' || entry.type === 'returnReward') {
    if (entry.who === viewer) return entry;
    const { cards: _hidden, ...rest } = entry;
    return { ...rest, hidden: true };
  }
  const sees = (zone: ZoneName | undefined) => !!zone && zone !== 'rewards' && canSee(zone, entry.who, viewer);
  if (sees(entry.from) || sees(entry.to)) return entry;
  const { cards: _hidden, ...rest } = entry;
  return { ...rest, hidden: true };
}

export function canSee(zone: ZoneName, owner: Side, viewer: Side | null): boolean {
  return PUBLIC_ZONES.has(zone) || (OWNER_ZONES.has(zone) && owner === viewer);
}

export function gameView(game: GameState, viewer: Side | null): GameView {
  const side = (owner: Side): SideView =>
    Object.fromEntries(
      ZONES.map((z) => {
        const cards = game.players[owner][z];
        return [z, canSee(z, owner, viewer) ? { count: cards.length, cards } : { count: cards.length }];
      }),
    ) as SideView;
  return {
    players: { host: side('host'), guest: side('guest') },
    turn: game.turn,
    active: activeSide(game),
    turnNumber: game.turnNumber ?? 1,
    phase: game.phase ?? 0,
    theme: game.theme ?? DEFAULT_BOARD_THEME,
    // Entradas de tema gravadas quando o tema era da partida (antes de virar preferência de cada um) não aparecem.
    log: (game.log ?? []).filter((e) => (e.type as string) !== 'setTheme').map((e) => logView(e, viewer)),
    ...peekView(game, viewer),
  };
}

/** `GameView.peek` do jogador: o Prêmio que ele olhou, se a carta ainda estiver naquela Área. */
function peekView(game: GameState, viewer: Side | null): Pick<GameView, 'peek'> {
  const p = viewer ? game.peek?.[viewer] : undefined;
  if (!p) return {};
  const index = game.players[p.owner].rewards.findIndex((c) => c.uid === p.uid);
  return index < 0 ? {} : { peek: { owner: p.owner, index, card: game.players[p.owner].rewards[index] } };
}

/**
 * Conteúdo do deck do jogador para a busca: quantidade por carta, **sem a ordem** (a ordem do deck
 * é segredo até para o dono). Quem chama ordena para exibir.
 */
export function deckContents(game: GameState, who: Side): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const c of game.players[who].deck) counts[c.cardId] = (counts[c.cardId] ?? 0) + 1;
  return counts;
}

export function parseGameAction(x: unknown): GameAction | null {
  const a = (typeof x === 'object' && x !== null ? x : {}) as Record<string, unknown>;
  const before = (o: Record<string, unknown>) => (typeof o.before === 'string' ? { before: o.before } : {});
  if (a.type === 'move' && typeof a.uid === 'string' && (ZONES as readonly unknown[]).includes(a.to)) {
    return { type: 'move', uid: a.uid, to: a.to as ZoneName, ...before(a), ...(a.bottom === true ? { bottom: true } : {}) };
  }
  if (
    a.type === 'draw' ||
    a.type === 'shuffle' ||
    a.type === 'passTurn' ||
    a.type === 'nextPhase' ||
    a.type === 'flip'
  ) {
    return { type: a.type };
  }
  if (a.type === 'returnHand') return a.bottom === true ? { type: 'returnHand', bottom: true } : { type: 'returnHand' };
  if (a.type === 'setInjured' && typeof a.uid === 'string' && typeof a.injured === 'boolean') {
    return { type: 'setInjured', uid: a.uid, injured: a.injured };
  }
  if (a.type === 'search' && typeof a.cardId === 'string') return { type: 'search', cardId: a.cardId };
  if (a.type === 'joinTeam' && typeof a.uid === 'string' && typeof a.target === 'string') {
    return { type: 'joinTeam', uid: a.uid, target: a.target };
  }
  if (a.type === 'moveTeam' && typeof a.uid === 'string' && (ZONES as readonly unknown[]).includes(a.to)) {
    return { type: 'moveTeam', uid: a.uid, to: a.to as ZoneName, ...before(a) };
  }
  if (a.type === 'setLeader' && typeof a.uid === 'string') return { type: 'setLeader', uid: a.uid };
  if (
    a.type === 'reveal' &&
    (a.from === 'top' || a.from === 'bottom') &&
    Number.isInteger(a.count) &&
    (a.count as number) >= 1 &&
    (a.count as number) <= REVEAL_MAX
  ) {
    return { type: 'reveal', from: a.from, count: a.count as number };
  }
  if (a.type === 'returnReward' && (a.owner === 'host' || a.owner === 'guest')) {
    if (a.uid !== undefined && typeof a.uid !== 'string') return null;
    if (a.to !== undefined && a.to !== 'deck' && a.to !== 'hand') return null;
    return {
      type: 'returnReward',
      owner: a.owner,
      ...(typeof a.uid === 'string' ? { uid: a.uid } : {}),
      ...(a.to === 'hand' ? { to: 'hand' as const } : {}),
    };
  }
  if (
    a.type === 'peekReward' &&
    (a.owner === 'host' || a.owner === 'guest') &&
    Number.isInteger(a.index) &&
    (a.index as number) >= 0
  ) {
    return { type: 'peekReward', owner: a.owner, index: a.index as number };
  }
  if (a.type === 'adjustPower' && typeof a.uid === 'string' && Number.isInteger(a.delta) && a.delta !== 0) {
    return { type: 'adjustPower', uid: a.uid, delta: a.delta as number };
  }
  if (
    a.type === 'setCoins' &&
    typeof a.uid === 'string' &&
    typeof a.kind === 'string' &&
    coinKind(a.kind) !== null &&
    Number.isInteger(a.delta) &&
    a.delta !== 0 &&
    Math.abs(a.delta as number) <= COINS_MAX
  ) {
    return { type: 'setCoins', uid: a.uid, kind: coinKind(a.kind)!, delta: a.delta as number };
  }
  if (a.type === 'adjustTurn' && Number.isInteger(a.delta) && a.delta !== 0 && Math.abs(a.delta as number) <= TURN_MAX) {
    return { type: 'adjustTurn', delta: a.delta as number };
  }
  if (a.type === 'giveReward' && (a.uid === undefined || typeof a.uid === 'string')) {
    return a.uid === undefined ? { type: 'giveReward' } : { type: 'giveReward', uid: a.uid };
  }
  return null;
}
