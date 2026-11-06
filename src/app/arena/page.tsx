'use client';

import { useCallback, useEffect, useState } from 'react';
import { ARENA_SCREEN, GameArena, type ArenaControls } from '@/components/arena/GameArena';
import { SearchDeckDialog } from '@/components/arena/SearchDeckDialog';
import { CARDS } from '@/data/cards';
import {
  applyGameAction,
  createGame,
  deckContents,
  GameError,
  gameView,
  type GameAction,
  type GameState,
  type ZoneName,
} from '@/lib/game/state';
import { deckNameKey, isReinforcementCard } from '@/models/card';

/**
 * Prévia da arena: uma partida local (só neste navegador) com dois decks de exemplo, para testar
 * arrastar, comprar, embaralhar e buscar sem precisar de dois jogadores numa sala. Não aparece no menu.
 * A arena de verdade abre em /salas/<id> quando os dois marcam Pronto.
 */

/** Só Ninjas formam Times. */
const rules = { isNinja: (id: string) => CARDS.find((c) => c.id === id)?.type === 'ninja' };

/** Deck de exemplo: 50 cartas com nomes diferentes, a partir de uma posição do catálogo. */
function sampleDeck(offset: number): Record<string, number> {
  const seen = new Set<string>();
  const cards: Record<string, number> = {};
  for (const c of CARDS.slice(offset)) {
    if (isReinforcementCard(c) || seen.has(deckNameKey(c))) continue;
    seen.add(deckNameKey(c));
    cards[c.id] = 1;
    if (seen.size === 50) break;
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
  return game;
}

export default function ArenaPreviewPage() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Criada só no navegador: embaralhar no servidor e de novo no cliente daria telas diferentes.
  useEffect(() => setGame(newGame()), []);

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
    onMove: (uid, to) => play({ type: 'move', uid, to }),
    onDraw: () => play({ type: 'draw' }),
    onShuffle: () => play({ type: 'shuffle' }),
    onSearch: () => setSearching(true),
    onJoinTeam: (uid, target) => play({ type: 'joinTeam', uid, target }),
    onMoveTeam: (uid, to) => play({ type: 'moveTeam', uid, to }),
    onSetLeader: (uid) => play({ type: 'setLeader', uid }),
    onGiveReward: (uid) => play(uid ? { type: 'giveReward', uid } : { type: 'giveReward' }),
  };

  return (
    <div className={ARENA_SCREEN}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          <strong className="text-text">Prévia local</strong> · arraste suas cartas, solte um Ninja sobre outro para formar um Time, compre, embaralhe e busque no deck.
          {error && <span className="ml-2 text-danger">{error}</span>}
        </p>
        <button
          type="button"
          onClick={() => setGame(newGame())}
          className="rounded-lg px-4 py-2 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
        >
          Nova partida
        </button>
      </div>
      <GameArena
        you={{ nickname: 'Naruto', zones: view.players.host, turn: view.turn.host }}
        opponent={{ nickname: 'Sasuke', zones: view.players.guest, turn: view.turn.guest }}
        controls={controls}
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
