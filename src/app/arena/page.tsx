'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ARENA_SCREEN,
  ArenaThemePicker,
  GameArena,
  type ArenaControls,
} from '@/components/arena/GameArena';
import { HeaderSlot } from '@/components/HeaderSlot';
import { setArenaTheme, useArenaTheme } from '@/lib/arenaTheme';
import { BOARD_THEME_IDS } from '@/lib/game/boardThemes';
import { SearchDeckDialog } from '@/components/arena/SearchDeckDialog';
import { CARDS } from '@/data/cards';
import {
  applyGameAction,
  createGame,
  deckContents,
  GameError,
  gameView,
  type CardRules,
  type GameAction,
  type GameState,
  type ZoneName,
} from '@/lib/game/state';
import { deckNameKey, isReinforcementCard, permanentCoins } from '@/models/card';

/**
 * Prévia da arena: uma partida local (só neste navegador) com dois decks de exemplo, para testar
 * arrastar, comprar, embaralhar e buscar sem precisar de dois jogadores numa sala. Não aparece no menu.
 * A arena de verdade abre em /salas/<id> quando os dois marcam Pronto.
 */

/** Só Ninjas formam Times; Missões Permanentes (X) entram na Vila com X Moedas Ninja. */
const rules: CardRules = {
  isNinja: (id: string) => CARDS.find((c) => c.id === id)?.type === 'ninja',
  permanentCoins: (id: string) => {
    const card = CARDS.find((c) => c.id === id);
    return card ? permanentCoins(card) : 0;
  },
};

/**
 * Deck de exemplo: 50 cartas a partir de uma posição do catálogo, com algumas em 3 cópias (como num deck de
 * verdade), para a mão mostrar as pilhas de cartas repetidas.
 */
function sampleDeck(offset: number): Record<string, number> {
  const seen = new Set<string>();
  const cards: Record<string, number> = {};
  let total = 0;
  for (const c of CARDS.slice(offset)) {
    if (isReinforcementCard(c) || seen.has(deckNameKey(c))) continue;
    seen.add(deckNameKey(c));
    const qty = Math.min(seen.size % 3 === 1 ? 3 : 1, 50 - total);
    cards[c.id] = qty;
    total += qty;
    if (total === 50) break;
  }
  return cards;
}

const isReinforcement = (id: string) => {
  const card = CARDS.find((c) => c.id === id);
  return !!card && isReinforcementCard(card);
};

/** Partida de exemplo já "em andamento": algumas cartas em cada zona dos dois lados. */
function newGame(): GameState {
  let game = createGame({ host: sampleDeck(0), guest: sampleDeck(800) }, isReinforcement, Math.random);
  const spread: [ZoneName, number][] = [
    ['village', 4],
    ['chakra', 3],
    ['discard', 2],
  ];
  for (const side of ['host', 'guest'] as const) {
    for (const [to, n] of spread) {
      for (let i = 0; i < n; i++) {
        const uid = game.players[side].deck[0].uid;
        game = applyGameAction(game, side, { type: 'move', uid, to }, Math.random);
      }
    }
    // 2 Prêmios de Batalha para o outro lado (saem do topo do deck deste jogador).
    for (let i = 0; i < 2; i++) game = applyGameAction(game, side, { type: 'giveReward' }, Math.random, rules);
    // 3 Ninjas do deck no Campo de Batalha (o Campo só recebe Ninjas).
    for (let i = 0; i < 3; i++) {
      const ninja = game.players[side].deck.find((c) => rules.isNinja(c.cardId));
      if (ninja) game = applyGameAction(game, side, { type: 'move', uid: ninja.uid, to: 'battlefield' }, Math.random, rules);
    }
    // Uma Missão e um Jutsu jogados no Campo (ficam nas laterais, fora dos Times).
    for (const type of ['mission', 'jutsu'] as const) {
      const card = game.players[side].deck.find((c) => CARDS.find((x) => x.id === c.cardId)?.type === type);
      if (card) game = applyGameAction(game, side, { type: 'move', uid: card.uid, to: 'battlefield' }, Math.random, rules);
    }
    // Um Time de exemplo na Vila (até 3 Ninjas) e outro no Campo de Batalha (2 Ninjas).
    const ninjasIn = (zone: 'village' | 'battlefield') =>
      game.players[side][zone].filter((c) => rules.isNinja(c.cardId)).map((c) => c.uid);
    for (const [zone, size] of [['village', 3], ['battlefield', 2]] as const) {
      const [leader, ...rest] = ninjasIn(zone).slice(0, size);
      for (const uid of rest) {
        game = applyGameAction(game, side, { type: 'joinTeam', uid, target: leader }, Math.random, rules);
      }
    }
  }
  // Na prévia você é sempre o anfitrião e começa como Atacante.
  return { ...game, active: 'host' };
}

export default function ArenaPreviewPage() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  // Tema: o da URL (`?tema=`), senão o escolhido neste navegador, senão o sorteado na partida.
  const myTheme = useArenaTheme();
  const [urlTheme, setUrlTheme] = useState<string | null>(null);

  // Criada só no navegador: embaralhar no servidor e de novo no cliente daria telas diferentes.
  // `?tema=papel` abre a prévia num tema específico (até escolher outro no seletor);
  // `?mao=10` compra 10 cartas a mais (para testar mãos grandes).
  useEffect(() => {
    let game = newGame();
    const params = new URLSearchParams(window.location.search);
    const extra = Math.min(30, Math.max(0, Number(params.get('mao')) || 0));
    for (let i = 0; i < extra && game.players.host.deck.length > 0; i++) {
      game = applyGameAction(game, 'host', { type: 'draw' }, Math.random, rules);
    }
    const tema = params.get('tema');
    if (tema && BOARD_THEME_IDS.includes(tema)) setUrlTheme(tema);
    setGame(game);
  }, []);

  const play = (action: GameAction) => {
    if (!game) return;
    try {
      setGame(applyGameAction(game, 'host', action, Math.random, rules));
      setError(null);
    } catch (e) {
      if (e instanceof GameError) setError(e.message);
      else throw e;
    }
  };
  const loadDeck = useCallback(async () => (game ? deckContents(game, 'host') : {}), [game]);

  if (!game) return <p className="text-muted">Preparando a prévia…</p>;

  const view = gameView(game, 'host');
  const controls: ArenaControls = {
    onMove: (uid, to, before) => play({ type: 'move', uid, to, ...(before ? { before } : {}) }),
    onMoveToDeckBottom: (uid) => play({ type: 'move', uid, to: 'deck', bottom: true }),
    onDraw: () => play({ type: 'draw' }),
    onShuffle: () => play({ type: 'shuffle' }),
    onReturnHand: () => play({ type: 'returnHand' }),
    onReturnHandToBottom: () => play({ type: 'returnHand', bottom: true }),
    onSearch: () => setSearching(true),
    onJoinTeam: (uid, target) => play({ type: 'joinTeam', uid, target }),
    onMoveTeam: (uid, to, before) => play({ type: 'moveTeam', uid, to, ...(before ? { before } : {}) }),
    onSetLeader: (uid) => play({ type: 'setLeader', uid }),
    onGiveReward: (uid) => play(uid ? { type: 'giveReward', uid } : { type: 'giveReward' }),
    onSetInjured: (uid, injured) => play({ type: 'setInjured', uid, injured }),
    onReturnReward: (area, uid, to) =>
      play({
        type: 'returnReward',
        owner: area === 'mine' ? 'host' : 'guest',
        ...(uid ? { uid } : {}),
        ...(to === 'hand' ? { to } : {}),
      }),
    onPeekReward: (area, index) => play({ type: 'peekReward', owner: area === 'mine' ? 'host' : 'guest', index }),
    onAdjustPower: (uid, delta) => play({ type: 'adjustPower', uid, delta }),
    onSetCoins: (uid, kind, delta) => play({ type: 'setCoins', uid, kind, delta }),
    onFlip: () => play({ type: 'flip' }),
    onAdjustTurn: (delta) => play({ type: 'adjustTurn', delta }),
    onReveal: (from, count) => play({ type: 'reveal', from, count }),
    onNextPhase: () => play({ type: 'nextPhase' }),
    // Sem oponente de verdade: ele devolve o turno na hora.
    onPassTurn: () => {
      try {
        const passed = applyGameAction(game, 'host', { type: 'passTurn' }, Math.random, rules);
        setGame(applyGameAction(passed, 'guest', { type: 'passTurn' }, Math.random, rules));
        setError(null);
      } catch (e) {
        if (e instanceof GameError) setError(e.message);
        else throw e;
      }
    },
  };

  const theme = urlTheme ?? myTheme ?? view.theme;
  const themePicker = (
    <ArenaThemePicker
      value={theme}
      onChange={(t) => {
        setUrlTheme(null);
        setArenaTheme(t);
      }}
    />
  );
  const newGameButton = (
    <button
      type="button"
      onClick={() => setGame(newGame())}
      className="rounded-lg px-4 py-2 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
    >
      Nova partida
    </button>
  );

  return (
    <div className={ARENA_SCREEN}>
      <HeaderSlot name="actions">
        {themePicker}
      </HeaderSlot>
      {/* Em tela cheia esta barra some: o tema e "Nova partida" ficam no menu ⋯ da arena. */}
      <div className="fullscreen-hidden flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          <strong className="text-text">Prévia local</strong> · arraste suas cartas, solte um Ninja sobre outro para formar um Time, compre, embaralhe e busque no deck.
          {error && <span className="ml-2 text-danger">{error}</span>}
        </p>
        {newGameButton}
      </div>
      <GameArena
        you={{ nickname: 'Naruto', zones: view.players.host, turn: view.turn.host, attacker: view.active === 'host' }}
        opponent={{ nickname: 'Sasuke', zones: view.players.guest, turn: view.turn.guest, attacker: view.active === 'guest' }}
        controls={controls}
        turnNumber={view.turnNumber}
        phase={view.phase}
        theme={theme}
        fullscreenMenu={
          <>
            {themePicker}
            {newGameButton}
          </>
        }
        notice={error}
        log={view.log}
        yourSide="host"
        peek={view.peek}
      />
      <SearchDeckDialog
        open={searching}
        load={loadDeck}
        onPick={(cardId) => {
          setSearching(false);
          play({ type: 'search', cardId });
        }}
        onClose={() => setSearching(false)}
      />
    </div>
  );
}
