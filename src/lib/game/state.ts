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
}

export type PlayerZones = Record<ZoneName, CardInstance[]>;

export interface GameState {
  version: 1;
  /** Zonas de cada jogador. No deck, o índice 0 é o topo. */
  players: Record<Side, PlayerZones>;
  /** Posição do Marcador de Turnos de cada jogador. */
  turn: Record<Side, number>;
}

/** Gerador de números em [0, 1). No servidor é criptográfico; nos testes, previsível. */
export type Rng = () => number;

export type GameAction =
  | { type: 'move'; uid: string; to: ZoneName }
  | { type: 'draw' }
  | { type: 'shuffle' }
  | { type: 'search'; cardId: string }
  /** Juntar o Ninja `uid` ao Time do Ninja `target` (arrastar uma carta para cima da outra). */
  | { type: 'joinTeam'; uid: string; target: string }
  /** Mover o Time inteiro do Ninja `uid` para outra zona (ex.: enviar para o Campo de Batalha). */
  | { type: 'moveTeam'; uid: string; to: ZoneName }
  /** Tornar o Ninja `uid` o Ninja Líder do Time dele. */
  | { type: 'setLeader'; uid: string }
  /**
   * Prêmio de Batalha para o OPONENTE (docs/REGRAS.md 3.5.4): uma carta sua vai para a Área de Prêmios
   * dele, face para baixo. Sem `uid`, vai a carta do topo do seu Deck (o caso normal).
   */
  | { type: 'giveReward'; uid?: string };

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
}

const ANY_CARD: CardRules = { isNinja: () => true };

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

/** Limpa Times desfeitos: fora da Vila/Campo não há Time, e um Time de 1 é só um Ninja. */
function normalizeTeams(zones: PlayerZones) {
  for (const zone of ZONES) {
    const counts = new Map<string, number>();
    for (const c of zones[zone]) if (c.team) counts.set(c.team, (counts.get(c.team) ?? 0) + 1);
    zones[zone] = zones[zone].map((c) =>
      c.team && (!TEAM_ZONES.has(zone) || (counts.get(c.team) ?? 0) < 2) ? { uid: c.uid, cardId: c.cardId } : c,
    );
  }
}

function checkBattlefield(zones: PlayerZones, rules: CardRules) {
  if (countTeams(zones.battlefield, rules.isNinja) > BATTLEFIELD_MAX_TEAMS) {
    throw new GameError(`No máximo ${BATTLEFIELD_MAX_TEAMS} Times no Campo de Batalha.`);
  }
}

/** Cartas compradas na preparação (docs/REGRAS.md 2.3). */
export const OPENING_HAND = 6;

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
  return { version: 1, players, turn: { host: 0, guest: 0 } };
}

function findCard(zones: PlayerZones, uid: string): { zone: ZoneName; index: number } | null {
  for (const zone of ZONES) {
    const index = zones[zone].findIndex((c) => c.uid === uid);
    if (index >= 0) return { zone, index };
  }
  return null;
}

/** Aplica uma ação do jogador `who` nas zonas DELE. Lança GameError se não for possível. */
export function applyGameAction(
  game: GameState,
  who: Side,
  action: GameAction,
  rng: Rng,
  rules: CardRules = ANY_CARD,
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
      const card = zones[at.zone][at.index];
      if (at.zone === action.to && !card.team) return game;
      zones[at.zone].splice(at.index, 1);
      const solo = { uid: card.uid, cardId: card.cardId }; // mover uma carta sozinha a tira do Time
      // Carta devolvida ao Deck vai para o topo; nas outras zonas, entra por último.
      if (action.to === 'deck') zones.deck.unshift(solo);
      else zones[action.to].push(solo);
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
      const card = zones[from.zone][from.index];
      const targetAt = mustFind(action.target);
      const target = zones[targetAt.zone][targetAt.index];
      if (!TEAM_ZONES.has(targetAt.zone)) throw new GameError('Times só existem na Vila e no Campo de Batalha.');
      if (!rules.isNinja(card.cardId) || !rules.isNinja(target.cardId)) {
        throw new GameError('Só Ninjas formam Times.');
      }
      const teamId = target.team ?? `t-${target.uid}`;
      if (card.team === teamId) return game;
      const size = zones[targetAt.zone].filter((c) => c.uid === target.uid || (!!target.team && c.team === target.team)).length;
      if (size >= TEAM_MAX) throw new GameError(`Um Time tem no máximo ${TEAM_MAX} Ninjas.`);

      zones[from.zone].splice(from.index, 1);
      const list = zones[targetAt.zone];
      for (let i = 0; i < list.length; i++) if (list[i].uid === target.uid) list[i] = { ...list[i], team: teamId };
      // Entra logo depois do último membro: o Líder continua sendo o primeiro.
      const last = list.reduce((acc, c, i) => (c.team === teamId ? i : acc), -1);
      list.splice(last + 1, 0, { uid: card.uid, cardId: card.cardId, team: teamId });
      return done();
    }
    case 'moveTeam': {
      if (action.to === 'rewards') throw new GameError(REWARDS_FROM_OPPONENT);
      const at = mustFind(action.uid);
      if (at.zone === 'rewards') throw new GameError(REWARDS_LOCKED);
      if (at.zone === action.to) return game;
      const key = groupKey(zones[at.zone][at.index]);
      const members = zones[at.zone].filter((c) => groupKey(c) === key);
      zones[at.zone] = zones[at.zone].filter((c) => groupKey(c) !== key);
      if (action.to === 'deck') zones.deck.unshift(...members);
      else zones[action.to].push(...members);
      return done();
    }
    case 'giveReward': {
      let card: CardInstance | undefined;
      if (action.uid) {
        const at = mustFind(action.uid);
        if (at.zone === 'rewards') throw new GameError(REWARDS_LOCKED);
        card = zones[at.zone].splice(at.index, 1)[0];
      } else {
        card = zones.deck.shift();
        if (!card) throw new GameError('Seu deck está vazio.');
      }
      const opponent = otherSide(who);
      const theirs = { ...game.players[opponent], rewards: [...game.players[opponent].rewards, { uid: card.uid, cardId: card.cardId }] };
      normalizeTeams(zones);
      checkBattlefield(zones, rules);
      return { ...game, players: { ...game.players, [who]: zones, [opponent]: theirs } as Record<Side, PlayerZones> };
    }
    case 'setLeader': {
      const at = mustFind(action.uid);
      const list = zones[at.zone];
      const card = list[at.index];
      if (!card.team) return game;
      const first = list.findIndex((c) => c.team === card.team);
      if (first === at.index) return game;
      list.splice(at.index, 1);
      list.splice(first, 0, card);
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
  return { players: { host: side('host'), guest: side('guest') }, turn: game.turn };
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
  if (a.type === 'move' && typeof a.uid === 'string' && (ZONES as readonly unknown[]).includes(a.to)) {
    return { type: 'move', uid: a.uid, to: a.to as ZoneName };
  }
  if (a.type === 'draw' || a.type === 'shuffle') return { type: a.type };
  if (a.type === 'search' && typeof a.cardId === 'string') return { type: 'search', cardId: a.cardId };
  if (a.type === 'joinTeam' && typeof a.uid === 'string' && typeof a.target === 'string') {
    return { type: 'joinTeam', uid: a.uid, target: a.target };
  }
  if (a.type === 'moveTeam' && typeof a.uid === 'string' && (ZONES as readonly unknown[]).includes(a.to)) {
    return { type: 'moveTeam', uid: a.uid, to: a.to as ZoneName };
  }
  if (a.type === 'setLeader' && typeof a.uid === 'string') return { type: 'setLeader', uid: a.uid };
  if (a.type === 'giveReward' && (a.uid === undefined || typeof a.uid === 'string')) {
    return a.uid === undefined ? { type: 'giveReward' } : { type: 'giveReward', uid: a.uid };
  }
  return null;
}
