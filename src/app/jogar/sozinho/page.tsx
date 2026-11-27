'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ARENA_SCREEN,
  GameArena,
  type ArenaControls,
  type ArenaSide,
} from '@/components/arena/GameArena';
import { ArenaCardsProvider } from '@/components/arena/arenaCards';
import { SearchDeckDialog } from '@/components/arena/SearchDeckDialog';
import { HeaderSlot } from '@/components/HeaderSlot';
import { ThemePicker } from '@/components/themes/ThemePicker';
import { useActiveTheme } from '@/lib/themes/client';
import { currentLibrary } from '@/lib/cloud/library';
import { findSleeve } from '@/lib/sleeves/client';
import type { Deck } from '@/lib/deckStore';
import { DeckSelect, useValidDecks } from '@/components/PlayerSetup';
import { CARDS_BY_ID } from '@/data/cards';
import { customDeckCardId, isCustomCardId } from '@/lib/cardMaker/customIds';
import type { CustomCard } from '@/lib/cardMaker/model';
import { useCustomCards } from '@/lib/cardMaker/store';
import {
  applyGameAction,
  createGame,
  deckContents,
  GameError,
  gameView,
  type CardRules,
  type GameAction,
  type GameState,
  type Side,
} from '@/lib/game/state';
import type { RoomCards } from '@/lib/rooms/client';
import { useKnownVersions } from '@/lib/deckDesigns';
import { deckLookup } from '@/lib/rooms/model';
import { isReinforcementCard, isTokenCard, permanentCoins } from '@/models/card';

/**
 * Jogar sozinho: uma partida só neste navegador, com um deck para cada lado, e o jogador comanda os dois
 * (docs/SALAS.md, "Jogar sozinho"). A arena mostra um lado embaixo (o que ele comanda agora) e o outro em cima;
 * **Trocar de lado** inverte, e por padrão a troca é automática ao passar o turno. Sem servidor: as regras são as
 * mesmas da sala (`applyGameAction`), aplicadas aqui.
 */

const STORAGE_KEY = 'naruto-ccg:solo-game';
const SIDES: readonly Side[] = ['host', 'guest'];
const LABEL: Record<Side, string> = { host: 'Jogador 1', guest: 'Jogador 2' };

interface SoloDeck {
  name: string;
  cards: Record<string, number>;
  /** Design escolhido para cada carta do catálogo no deck (`Deck.designs`). */
  designs?: Record<string, string>;
  /** Imagem do sleeve do deck no início da partida (o verso das cartas deste lado). */
  sleeve?: string;
}

/** O deck como fica guardado na partida (com a imagem do sleeve, se ainda existir). */
function soloDeck(deck: Deck): SoloDeck {
  const sleeve = findSleeve(currentLibrary().sleeves, deck.sleeve)?.image;
  return { name: deck.name, cards: deck.cards, designs: deck.designs, ...(sleeve && { sleeve }) };
}

interface SoloSave {
  version: 1;
  game: GameState;
  decks: Record<Side, SoloDeck>;
  /** Lado que o jogador comanda agora (embaixo na arena). */
  viewing: Side;
  /** Trocar de lado sozinho ao passar o turno (para o novo Atacante). */
  autoSwap: boolean;
}

function loadSave(): SoloSave | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const save = JSON.parse(raw) as SoloSave;
    return save?.version === 1 && save.game?.players && save.decks?.host && save.decks?.guest ? save : null;
  } catch {
    return null;
  }
}

function writeSave(save: SoloSave | null) {
  try {
    if (save) localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sem armazenamento (aba privada, cheio): a partida continua, só não volta ao recarregar.
  }
}

/** Cartas criadas deste navegador usadas pelos dois decks (id no deck → carta). */
function customFor(decks: Record<Side, SoloDeck>, customCards: CustomCard[]): Record<string, CustomCard> {
  const custom: Record<string, CustomCard> = {};
  for (const side of SIDES) {
    for (const id of Object.keys(decks[side].cards)) {
      if (!isCustomCardId(id)) continue;
      const source = customCards.find((c) => customDeckCardId(c.id) === id);
      if (source) custom[id] = source;
    }
  }
  return custom;
}

/** Regras das cartas (catálogo + cartas criadas dos decks) para criar e jogar a partida. */
function rulesFor(custom: Record<string, CustomCard>) {
  const lookup = deckLookup({ custom }, (id) => CARDS_BY_ID.get(id));
  const rules: CardRules = {
    isNinja: (id) => lookup(id)?.type === 'ninja',
    permanentCoins: (id) => {
      const c = lookup(id);
      return c ? permanentCoins(c) : 0;
    },
  };
  const isReinforcement = (id: string) => {
    const c = lookup(id);
    return !!c && isReinforcementCard(c);
  };
  const isToken = (id: string) => {
    const c = lookup(id);
    return !!c && isTokenCard(c);
  };
  return { rules, isReinforcement, isToken };
}

const btn = 'rounded-lg px-4 py-2 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text';

/** Escolha dos dois decks. */
function Setup({ onStart }: { onStart: (decks: Record<Side, SoloDeck>) => void }) {
  const decks = useValidDecks();
  const [chosen, setChosen] = useState<Record<Side, string>>({ host: '', guest: '' });
  const pick = (side: Side, id: string) => setChosen((c) => ({ ...c, [side]: id }));
  const find = (id: string) => decks?.find((d) => d.id === id);
  const host = find(chosen.host);
  const guest = find(chosen.guest);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Jogar sozinho</h1>
        <p className="text-sm text-muted">
          Escolha um deck para cada lado. Você comanda os dois: o lado de baixo é o que você está jogando, e{' '}
          <strong className="text-text">Trocar de lado</strong> inverte. A partida fica só neste navegador.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SIDES.map((side) => (
          <section key={side} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
            <h2 className="text-lg font-semibold">{LABEL[side]}</h2>
            <DeckSelect value={chosen[side]} onChange={(id) => pick(side, id)} placeholder="Escolha um deck…" />
          </section>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!host || !guest}
          onClick={() =>
            host && guest && onStart({ host: soloDeck(host), guest: soloDeck(guest) })
          }
          className="rounded-lg bg-ok px-5 py-2 font-semibold text-bg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Começar partida
        </button>
        <span className="text-sm text-muted">Pode ser o mesmo deck nos dois lados.</span>
        <Link href="/jogar" className="ml-auto text-sm text-accent hover:underline">
          Voltar para Jogar
        </Link>
      </div>
    </div>
  );
}

export default function SoloPage() {
  // `undefined` = ainda lendo o localStorage; `null` = sem partida (escolha dos decks).
  const [save, setSave] = useState<SoloSave | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const customCards = useCustomCards();
  const knownVersions = useKnownVersions();
  const theme = useActiveTheme();

  useEffect(() => setSave(loadSave()), []);

  const update = useCallback((next: SoloSave | null) => {
    setSave(next);
    writeSave(next);
  }, []);

  const custom = useMemo(
    () => (save && customCards ? customFor(save.decks, customCards) : {}),
    [save?.decks, customCards], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { rules } = useMemo(() => rulesFor(custom), [custom]);
  // Cartas criadas dos dois lados.
  // Cartas criadas dos dois lados e o design escolhido em cada deck (as versões vêm da biblioteca na nuvem).
  const roomCards = useMemo<RoomCards | undefined>(() => {
    if (!save) return undefined;
    const designs = { host: save.decks.host.designs ?? {}, guest: save.decks.guest.designs ?? {} };
    const versions: Record<string, CustomCard> = {};
    for (const id of [...Object.values(designs.host), ...Object.values(designs.guest)]) {
      const v = knownVersions(id);
      if (v) versions[id] = v;
    }
    return { cards: custom, designs, versions };
  }, [save, custom, knownVersions]);
  // Busca no deck do lado que você comanda (a referência só muda com a partida, para o diálogo não recarregar à toa).
  const loadDeck = useCallback(async () => (save ? deckContents(save.game, save.viewing) : []), [save]);

  const start = (decks: Record<Side, SoloDeck>) => {
    const { isReinforcement: reinf, isToken: token } = rulesFor(customCards ? customFor(decks, customCards) : {});
    const game = createGame({ host: decks.host.cards, guest: decks.guest.cards }, reinf, Math.random, token);
    setError(null);
    update({ version: 1, game, decks, viewing: game.active, autoSwap: true });
  };

  if (save === undefined || customCards === null) return <p className="text-muted">Carregando…</p>;
  if (!save) return <Setup onStart={start} />;

  const { game, viewing, decks } = save;
  const other: Side = viewing === 'host' ? 'guest' : 'host';
  const view = gameView(game, viewing);

  const run = (fn: () => SoloSave) => {
    try {
      update(fn());
      setError(null);
    } catch (e) {
      if (e instanceof GameError) setError(e.message);
      else throw e;
    }
  };
  const play = (action: GameAction) =>
    run(() => ({ ...save, game: applyGameAction(game, viewing, action, Math.random, rules) }));
  const swap = () => {
    setError(null);
    update({ ...save, viewing: other });
  };

  const controls: ArenaControls = {
    onMove: (uid, to, before, lane) =>
      play({ type: 'move', uid, to, ...(before ? { before } : {}), ...(lane !== undefined ? { lane } : {}) }),
    onMoveToDeckBottom: (uid) => play({ type: 'move', uid, to: 'deck', bottom: true }),
    onDraw: () => play({ type: 'draw' }),
    onShuffle: () => play({ type: 'shuffle' }),
    onReturnHand: () => play({ type: 'returnHand' }),
    onReturnHandToBottom: () => play({ type: 'returnHand', bottom: true }),
    onSearch: () => setSearching(true),
    onJoinTeam: (uid, target) => play({ type: 'joinTeam', uid, target }),
    onMoveTeam: (uid, to, before, lane) =>
      play({ type: 'moveTeam', uid, to, ...(before ? { before } : {}), ...(lane !== undefined ? { lane } : {}) }),
    onSetLeader: (uid) => play({ type: 'setLeader', uid }),
    onGiveReward: (uid) => play(uid ? { type: 'giveReward', uid } : { type: 'giveReward' }),
    onSetInjured: (uid, injured) => play({ type: 'setInjured', uid, injured }),
    onReturnReward: (area, uid, to) =>
      play({
        type: 'returnReward',
        owner: area === 'mine' ? viewing : other,
        ...(uid ? { uid } : {}),
        ...(to === 'hand' ? { to } : {}),
      }),
    onPeekReward: (area, index) => play({ type: 'peekReward', owner: area === 'mine' ? viewing : other, index }),
    onAdjustPower: (uid, delta) => play({ type: 'adjustPower', uid, delta }),
    onSetCoins: (uid, kind, delta) => play({ type: 'setCoins', uid, kind, delta }),
    onFlip: () => play({ type: 'flip' }),
    onAdjustTurn: (delta) => play({ type: 'adjustTurn', delta }),
    onReveal: (from, count) => play({ type: 'reveal', from, count }),
    onCreateToken: (cardId) => play({ type: 'createToken', cardId }),
    // Passar o turno: com a troca automática, você passa a comandar o novo Atacante.
    onPassTurn: () =>
      run(() => {
        const next = applyGameAction(game, viewing, { type: 'passTurn' }, Math.random, rules);
        return { ...save, game: next, viewing: save.autoSwap ? next.active : viewing };
      }),
  };

  const side = (s: Side): ArenaSide => ({
    nickname: `${LABEL[s]} · ${decks[s].name}`,
    zones: view.players[s],
    turn: view.turn[s],
    attacker: view.active === s,
    sleeve: decks[s].sleeve,
    ...(s === viewing && view.tokens ? { tokens: view.tokens } : {}),
  });

  const restart = () => {
    if (confirm('Começar outra partida com os mesmos decks? A atual é perdida.')) start(decks);
  };
  const changeDecks = () => {
    if (confirm('Encerrar a partida e escolher outros decks?')) update(null);
  };
  const controlsBar = (
    <>
      <button
        type="button"
        onClick={swap}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong"
        title={`Passar a comandar o ${LABEL[other]} (${decks[other].name})`}
      >
        ⇅ Trocar de lado
      </button>
      <label className="flex items-center gap-2 text-sm text-muted" title="Ao passar o turno, você passa a comandar o novo Atacante">
        <input type="checkbox" checked={save.autoSwap} onChange={(e) => update({ ...save, autoSwap: e.target.checked })} />
        Trocar ao passar o turno
      </label>
      <ThemePicker />
      <button type="button" onClick={restart} className={btn}>
        Nova partida
      </button>
      <button type="button" onClick={changeDecks} className={btn}>
        Trocar decks
      </button>
    </>
  );

  return (
    <ArenaCardsProvider roomCards={roomCards}>
      <div className={ARENA_SCREEN}>
        <HeaderSlot name="actions">
          {error && <span className="text-sm text-danger">{error}</span>}
          {controlsBar}
        </HeaderSlot>
        <GameArena
          you={side(viewing)}
          opponent={side(other)}
          controls={controls}
          turnNumber={view.turnNumber}
          theme={theme}
          fullscreenMenu={controlsBar}
          notice={error}
          log={view.log}
          yourSide={viewing}
          peek={view.peek}
          // Quem está no comando: no topo do card do turno (no cabeçalho, cobria os botões).
          matchInfo={
            <>
              Comandando: <b>{LABEL[viewing]}</b> ({decks[viewing].name})
            </>
          }
        />
        <SearchDeckDialog
          open={searching}
          owner={viewing}
          load={loadDeck}
          onPick={(cardId) => {
            setSearching(false);
            play({ type: 'search', cardId });
          }}
          onClose={() => setSearching(false)}
        />
      </div>
    </ArenaCardsProvider>
  );
}
