'use client';

import { createContext, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CardDetailModal } from '@/components/CardDetailModal';
import { Dialog } from '@/components/Dialog';
import {
  BATTLEFIELD_MAX_TEAMS,
  COIN_NAME_MAX,
  COIN_SUGGESTIONS,
  coinKind,
  countTeams,
  PHASES,
  TEAM_MAX,
  teamGroups,
  TURN_MAX,
  ZONES,
  type CardInstance,
  type LogEntryView,
  type Side,
  type SideView,
  type ZoneName,
} from '@/lib/game/state';
import { BOARD_THEMES, boardTheme } from '@/lib/game/boardThemes';
import { coinPower, formatTeamPower, teamPower, type PowerLookup, type TeamPower } from '@/lib/game/teamPower';
import { isReinforcementCard, type Card } from '@/models/card';
import { ArenaCardImage, useArenaLookup } from './arenaCards';
import { useCardName } from '@/lib/cardLanguage';
import { CardZoom, type HoveredCard } from './CardZoom';
import styles from './GameArena.module.css';

/**
 * Arena da partida (design "Campo de Jogo", tokens Nocturne): os dois lados da mesa frente a frente.
 *
 * - Tudo é desenhado num palco fixo de 1600×900, escalado para caber inteiro na área disponível
 *   (sem rolagem): `scale = min(largura / 1600, altura / 900)`.
 * - Em cima: a mão do oponente (só o verso) e a linha dele: Deck, Descartes, Chakra, Vila e Prêmios.
 * - No meio: o Campo de Batalha octogonal, com os Times dos dois e a fase atual no centro.
 * - Embaixo: a sua linha, espelhada (Prêmios, Vila, Chakra, Descartes, Deck) e a sua mão em leque.
 * - À esquerda: a placa de cada jogador (Prêmios, Marcador de Turnos, mão, Reforço, Removidos), o turno
 *   e as fases, com o botão "Próxima fase" (ou "Passar turno" na Fase Final) para o Atacante.
 *
 * Você arrasta as SUAS cartas entre as SUAS zonas; o servidor confere e devolve o novo estado.
 * Cartas que você não pode ver (mão do oponente, Deck, Prêmios) chegam só como contagem.
 */

/**
 * Classes do contêiner de uma tela de partida: altura exata da janela (sem rolagem). `arena-screen` faz a
 * arena ocupar a tela inteira em tela cheia (globals.css).
 */
export const ARENA_SCREEN = 'arena-screen flex h-[calc(100dvh-var(--app-chrome))] flex-col gap-2';

export interface ArenaSide {
  nickname: string;
  zones: SideView;
  /** Posição do Marcador de Turnos. */
  turn: number;
  /** É o jogador do turno (Atacante)? */
  attacker: boolean;
}

/** Ações do jogador sobre as próprias cartas. Sem isto, a arena é só para ver. */
export interface ArenaControls {
  /** Move a carta `uid` para a zona `to`; com `before`, antes do Time dessa carta (reordenar Times). */
  onMove: (uid: string, to: ZoneName, before?: string) => void;
  /** Põe a carta `uid` no fundo do seu Deck. */
  onMoveToDeckBottom: (uid: string) => void;
  onDraw: () => void;
  onShuffle: () => void;
  /** Devolve a mão inteira ao Deck e embaralha (o mulligan; o botão pede confirmação antes). */
  onReturnHand: () => void;
  /** Devolve a mão inteira ao fundo do Deck, na ordem da mão, sem embaralhar. */
  onReturnHandToBottom: () => void;
  /** Abre a busca de uma carta no deck (quem usa a arena mostra o diálogo). */
  onSearch: () => void;
  /** Junta o Ninja `uid` ao Time do Ninja `target` (soltar uma carta sobre a outra). */
  onJoinTeam: (uid: string, target: string) => void;
  /** Move o Time inteiro do Ninja `uid` (arrastar pela alça do Time); com `before`, antes do Time dessa carta. */
  onMoveTeam: (uid: string, to: ZoneName, before?: string) => void;
  /** Torna o Ninja `uid` o Líder do Time dele. */
  onSetLeader: (uid: string) => void;
  /** Vira o Ninja `uid` para Ferido (horizontal) ou de volta para Saudável. */
  onSetInjured: (uid: string, injured: boolean) => void;
  /** Manda uma carta sua para os Prêmios do OPONENTE (sem `uid`: o topo do seu Deck). */
  onGiveReward: (uid?: string) => void;
  /**
   * Devolve a última carta da Área de Prêmios (`mine` = a sua, `theirs` = a do oponente), ou a carta `uid`
   * (um Prêmio olhado), ao topo do Deck de quem deu a carta; com `to: 'hand'`, para a mão dele.
   */
  onReturnReward: (area: 'mine' | 'theirs', uid?: string, to?: 'deck' | 'hand') => void;
  /** Olha o Prêmio na posição `index` (0 = o primeiro que entrou) da Área: só você vê (`GameArena.peek`). */
  onPeekReward: (area: 'mine' | 'theirs', index: number) => void;
  /** Aumenta (`delta` > 0) ou diminui o Poder do Time do Ninja `uid`. */
  onAdjustPower: (uid: string, delta: number) => void;
  /** Põe (`delta` > 0) ou tira moedas do tipo `kind` da carta `uid` (na Vila ou no Campo de Batalha). */
  onSetCoins: (uid: string, kind: string, delta: number) => void;
  /** Joga a Moeda Ninja: o servidor sorteia Cara ou Coroa e os dois veem o resultado. */
  onFlip: () => void;
  /** Sobe (`delta` > 0) ou desce o seu Marcador de Turnos. */
  onAdjustTurn: (delta: number) => void;
  /** Revela `count` cartas do topo ou do fundo do seu Deck: vão para a sua Vila, à vista dos dois. */
  onReveal: (from: 'top' | 'bottom', count: number) => void;
  /** Avança para a próxima fase do turno (só quando você é o Atacante). */
  onNextPhase: () => void;
  /** Passa o turno para o oponente (só quando você é o Atacante). */
  onPassTurn: () => void;
  busy?: boolean;
}

/** Tamanho do palco do design. */
const STAGE_W = 1600;
const STAGE_H = 900;

/** Arrastar uma carta (o uid dela) / um Time inteiro (o uid de um membro). */
const CARD_MIME = 'application/x-naruto-ccg-card';
const TEAM_MIME = 'application/x-naruto-ccg-team';
/** Arrastar o topo do seu Deck (sem revelar qual carta é). */
const DECK_TOP_MIME = 'application/x-naruto-ccg-deck-top';

/**
 * O que está sendo arrastado, guardado também aqui: alguns navegadores (ou extensões que interceptam o
 * arraste) entregam o `dataTransfer` vazio às zonas, que recusariam a carta (cursor de bloqueado).
 * Armado no pointerdown, antes do arraste começar, e repetido no dragstart; a arena limpa no fim do arraste
 * (dragend) ou num clique sem arraste (pointerup).
 */
let dragPayload: { mime: string; value: string } | null = null;

function clearDragPayload() {
  dragPayload = null;
}

/** Tipos do arraste: os do navegador ou, se ele não entregou nenhum, o guardado em `dragPayload`. */
function dragTypes(dt: DataTransfer): readonly string[] {
  if (dt.types.length > 0) return dt.types;
  return dragPayload ? [dragPayload.mime] : [];
}

/** Dado do arraste: o do navegador ou o guardado em `dragPayload`. */
function dragData(dt: DataTransfer, mime: string): string {
  return dt.getData(mime) || (dragPayload?.mime === mime ? dragPayload.value : '');
}

/** Props de uma origem de arraste (`mime` com `value`). Com `stop`, o evento não chega aos pais. */
function dragSource(mime: string, value: string, stop = false) {
  return {
    onPointerDown: (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      if (stop) e.stopPropagation();
      dragPayload = { mime, value };
    },
    onDragStart: (e: React.DragEvent) => {
      if (stop) e.stopPropagation();
      dragPayload = { mime, value };
      e.dataTransfer.setData(mime, value);
      e.dataTransfer.effectAllowed = 'move';
    },
  };
}


/** Prêmios de Batalha para vencer (docs/REGRAS.md, Condições de Vitória). */
const REWARDS_TO_WIN = 10;

/** Kanji de cada fase (na ordem de `PHASES`). */
const PHASE_KANJI = ['始', '任', '編', '戦', '終'] as const;

const ZONE_LABEL: Record<ZoneName, string> = {
  deck: 'Topo do Deck',
  hand: 'Mão',
  village: 'Vila',
  battlefield: 'Campo de Batalha',
  chakra: 'Chakra',
  discard: 'Descartes',
  rewards: 'Prêmios',
  reinforcement: 'Reforço',
  removed: 'Removidos',
};

/** Tamanhos (px do palco) das cartas em cada lugar. */
const FIELD_CARD = { w: 96, h: 134 };
const MINI_CARD = { w: 62, h: 87 };
const HAND_CARD = { w: 112, h: 157 };
/** Largura útil da Vila: a linha menos as outras zonas, os espaços e o padding da Vila. */
const VILLAGE_INNER = 1332 - 132 - 150 - 100 - 118 - 4 * 10 - 24;

/** Abre o detalhe da carta; com `inst` (carta da mesa), o detalhe mostra as ações de mover. */
type Inspect = (card: Card, inst?: CardInstance) => void;

function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

const HoverContext = createContext<(hovered: HoveredCard | null) => void>(() => {});
/** Os seus controles, para os atalhos de cada carta (T e F mandam a carta para o topo ou o fundo do Deck). */
const ControlsContext = createContext<ArenaControls | undefined>(undefined);

/** Escala do palco para caber inteiro no elemento (recalcula ao redimensionar). */
function useStageScale(ref: React.RefObject<HTMLElement | null>): number {
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      // Medida 0 (ainda sem layout): tenta de novo no próximo quadro, senão o palco sairia cortado.
      if (!w || !h) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(fit);
        return;
      }
      setScale(Math.min(w / STAGE_W, h / STAGE_H));
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener('resize', fit);
    fit();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return scale;
}

interface DropTarget {
  over: boolean;
  handlers: Partial<Pick<React.HTMLAttributes<HTMLElement>, 'onDragOver' | 'onDragLeave' | 'onDrop'>>;
}

/** Onde um Time solto entraria entre os Times da zona (posições em % da zona, para a barra de inserção). */
interface Insertion {
  /** Primeira carta do Time da frente; `undefined` = no fim. */
  before?: string;
  left: number;
  top: number;
  height: number;
}

/**
 * Marca no `nativeEvent` do arraste que ele está sobre um Ninja que aceita formar Time: a zona embaixo
 * esconde a barra de inserção (soltar ali junta ao Time, não reordena).
 */
const JOIN_TARGET = Symbol('joinTarget');

/** Atributo dos Times na tela (o uid do primeiro membro), lido para calcular a posição de inserção. */
const TEAM_ATTR = 'data-team-first';

/** Posição de inserção na zona `el` para o mouse em `clientX`: antes do primeiro Time cujo meio está à direita. */
function insertionAt(el: HTMLElement, clientX: number): Insertion | null {
  const groups = [...el.querySelectorAll<HTMLElement>(`[${TEAM_ATTR}]`)];
  if (groups.length === 0) return null;
  const box = el.getBoundingClientRect();
  const rects = groups.map((g) => g.getBoundingClientRect());
  let i = rects.findIndex((r) => clientX < r.left + r.width / 2);
  if (i < 0) i = groups.length;
  const x =
    i === 0
      ? rects[0].left - 8
      : i === groups.length
        ? rects[i - 1].right + 8
        : (rects[i - 1].right + rects[i].left) / 2;
  const top = Math.min(...rects.map((r) => r.top));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return {
    before: groups[i]?.getAttribute(TEAM_ATTR) ?? undefined,
    left: ((x - box.left) / box.width) * 100,
    top: ((top - box.top) / box.height) * 100,
    height: ((bottom - top) / box.height) * 100,
  };
}

/**
 * Liga uma área como destino de arrastar (só nas suas zonas). Com `ordered` (Vila e Campo de Batalha),
 * soltar entre os Times escolhe a posição: a barra `insert` mostra onde vai entrar.
 */
function useDrop(
  to: ZoneName,
  controls: ArenaControls | undefined,
  ordered = false,
): DropTarget & { insert: Insertion | null } {
  const [over, setOver] = useState(false);
  const [insert, setInsert] = useState<Insertion | null>(null);
  if (!controls) return { over: false, insert: null, handlers: {} };
  return {
    over,
    insert,
    handlers: {
      onDragOver: (e) => {
        const types = dragTypes(e.dataTransfer);
        if (!types.includes(CARD_MIME) && !types.includes(TEAM_MIME)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
        if (ordered) {
          const joining = (e.nativeEvent as unknown as Record<symbol, boolean>)[JOIN_TARGET];
          const next = joining ? null : insertionAt(e.currentTarget, e.clientX);
          setInsert((prev) =>
            prev?.before === next?.before && prev?.left === next?.left && prev?.top === next?.top ? prev : next,
          );
        }
      },
      onDragLeave: (e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        setOver(false);
        setInsert(null);
      },
      onDrop: (e) => {
        setOver(false);
        setInsert(null);
        const team = dragData(e.dataTransfer, TEAM_MIME);
        const uid = dragData(e.dataTransfer, CARD_MIME);
        if (!team && !uid) return;
        e.preventDefault();
        const before = ordered ? insertionAt(e.currentTarget, e.clientX)?.before : undefined;
        if (team) controls.onMoveTeam(team, to, before);
        else controls.onMove(uid, to, before);
      },
    },
  };
}

/** Barra brilhante entre os Times: onde o Time arrastado vai entrar. */
function InsertBar({ at }: { at: Insertion | null }) {
  if (!at) return null;
  return (
    <div
      className={styles.insertBar}
      style={{ left: `${at.left}%`, top: `${at.top}%`, height: `${at.height}%` }}
      aria-hidden
    />
  );
}

interface CustomDrop {
  /** Tipos de arraste aceitos (CARD_MIME, DECK_TOP_MIME…). */
  accept: string[];
  /** `get(mime)` lê o dado do arraste (ver `dragData`). */
  onDrop: (get: (mime: string) => string) => void;
  /** Dica mostrada ao passar por cima. */
  hint?: string;
}

/** Destino de arrastar com tratamento próprio (ex.: Prêmios do oponente). */
function useCustomDrop(drop: CustomDrop | undefined): DropTarget {
  const [over, setOver] = useState(false);
  if (!drop) return { over: false, handlers: {} };
  return {
    over,
    handlers: {
      onDragOver: (e) => {
        if (!drop.accept.some((t) => dragTypes(e.dataTransfer).includes(t))) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      },
      onDrop: (e) => {
        setOver(false);
        if (!drop.accept.some((t) => dragTypes(e.dataTransfer).includes(t))) return;
        e.preventDefault();
        const dt = e.dataTransfer;
        drop.onDrop((mime) => dragData(dt, mime));
      },
    },
  };
}

/** Uma carta virada para cima. Arrastável se for sua; clique abre o detalhe (ou `onClick`). */
function TableCard({
  inst,
  w,
  h,
  mine,
  onInspect,
  onClick,
  className,
  style,
}: {
  inst: CardInstance;
  w: number;
  h: number;
  mine: boolean;
  onInspect: Inspect;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const lookup = useArenaLookup();
  const card = lookup(inst.cardId);
  const nameOf = useCardName();
  const setHovered = useContext(HoverContext);
  const controls = useContext(ControlsContext);
  const open = () => (onClick ? onClick() : card && onInspect(card, inst));
  // T / F com o mouse sobre uma carta sua: ela vai para o topo / o fundo do seu Deck, sem embaralhar.
  // Esquadrões não vão para o Deck (ficam no Reforço).
  const toDeck = mine && controls && !controls.busy && !(card && isReinforcementCard(card));
  const hoverKeys = useHoverKeys({
    t: toDeck ? () => controls.onMove(inst.uid, 'deck') : undefined,
    f: toDeck ? () => controls.onMoveToDeckBottom(inst.uid) : undefined,
  });
  return (
    <div
      role="button"
      tabIndex={0}
      draggable={mine}
      onMouseEnter={(e) => {
        hoverKeys.onMouseEnter();
        if (card) setHovered({ card, clientX: e.clientX });
      }}
      onMouseLeave={() => {
        hoverKeys.onMouseLeave();
        setHovered(null);
      }}
      {...(mine ? dragSource(CARD_MIME, inst.uid, true) : {})}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      title={card ? nameOf(card) : inst.cardId}
      className={cx(styles.card, mine && styles.mine, className)}
      style={{ width: w, height: h, ...style }}
    >
      {card && <ArenaCardImage card={card} size="thumb" alt={nameOf(card)} />}
    </div>
  );
}

function ZoneLabel({ text, kanji }: { text: string; kanji?: string }) {
  return (
    <div className={styles.label}>
      {kanji && <span className={styles.kanji}>{kanji}</span>}
      <span>{text}</span>
    </div>
  );
}

/** Lista de uma zona (Descartes, Chakra, Reforço, Removidos) com botões para mover as suas cartas. */
function ZoneListDialog({
  title,
  zone,
  cards,
  controls,
  onInspect,
  onClose,
}: {
  title: string;
  zone: ZoneName;
  cards: CardInstance[];
  controls?: ArenaControls;
  onInspect: Inspect;
  onClose: () => void;
}) {
  const targets = (['hand', 'village', 'battlefield', 'chakra', 'discard', 'deck', 'removed'] as const).filter((t) => t !== zone);
  const nameOf = useCardName();
  const lookup = useArenaLookup();
  return (
    <Dialog open onClose={onClose} title={title}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma carta.</p>
      ) : (
        <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {[...cards].reverse().map((c) => {
            const card = lookup(c.cardId);
            return (
              <li key={c.uid} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => card && onInspect(card, c)}
                  className="w-12 shrink-0 overflow-hidden rounded ring-1 ring-border hover:ring-accent"
                  title={card ? nameOf(card) : c.cardId}
                >
                  {card ? (
                    <ArenaCardImage card={card} size="thumb" alt={nameOf(card)} className="aspect-[5/7] w-full object-cover" />
                  ) : (
                    <div className="aspect-[5/7] w-full bg-surface-2" />
                  )}
                </button>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium">{card ? nameOf(card) : c.cardId}</span>
                  {controls && (
                    <div className="flex flex-wrap gap-1">
                      {targets.map((t) => (
                        <button
                          key={t}
                          type="button"
                          disabled={controls.busy}
                          onClick={() => controls.onMove(c.uid, t)}
                          className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold hover:bg-accent hover:text-bg disabled:opacity-40"
                        >
                          → {ZONE_LABEL[t]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}

/** Zona em que está a carta `uid` (só nas zonas em que você vê as cartas). */
function zoneOf(zones: SideView, uid: string): ZoneName | null {
  for (const zone of ZONES) if (zones[zone].cards?.some((c) => c.uid === uid)) return zone;
  return null;
}

/** Ações no detalhe de uma carta sua: descartar, mover para outra zona ou dar como Prêmio ao oponente. */
function CardMoveActions({
  card,
  inst,
  zone,
  controls,
  onDone,
}: {
  card: Card;
  inst: CardInstance;
  zone: ZoneName;
  controls: ArenaControls;
  onDone: () => void;
}) {
  const targets = (['hand', 'village', 'battlefield', 'chakra', 'deck', 'removed', 'reinforcement'] as const).filter(
    (t) => t !== zone && (t !== 'reinforcement' || isReinforcementCard(card)),
  );
  const run = (fn: () => void) => {
    fn();
    onDone();
  };
  const chip =
    'rounded-md bg-surface-2 px-2 py-1 text-xs font-semibold hover:bg-accent hover:text-bg disabled:opacity-40';
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Está em: {ZONE_LABEL[zone]}</p>
      <div className="flex flex-wrap gap-1.5">
        {zone !== 'discard' && (
          <button
            type="button"
            disabled={controls.busy}
            onClick={() => run(() => controls.onMove(inst.uid, 'discard'))}
            className="rounded-md bg-accent px-3 py-1 text-sm font-semibold text-bg hover:opacity-90 disabled:opacity-40"
          >
            Descartar
          </button>
        )}
        {targets.map((t) => (
          <Fragment key={t}>
            <button
              type="button"
              disabled={controls.busy}
              onClick={() => run(() => controls.onMove(inst.uid, t))}
              className={chip}
              title={t === 'deck' ? 'Pôr esta carta no topo do seu Deck' : undefined}
            >
              → {t === 'deck' ? 'Topo do Deck' : ZONE_LABEL[t]}
            </button>
            {t === 'deck' && (
              <button
                type="button"
                disabled={controls.busy}
                onClick={() => run(() => controls.onMoveToDeckBottom(inst.uid))}
                className={chip}
                title="Pôr esta carta no fundo do seu Deck"
              >
                → Fundo do Deck
              </button>
            )}
          </Fragment>
        ))}
        <button
          type="button"
          disabled={controls.busy}
          onClick={() => run(() => controls.onGiveReward(inst.uid))}
          className={chip}
          title="Dar esta carta como Prêmio de Batalha ao oponente (face para baixo)"
        >
          → Prêmio do oponente
        </button>
      </div>
    </div>
  );
}

/** Prêmio de Batalha olhado por este jogador (como a arena o recebe: a Área pela sua perspectiva). */
export interface ArenaPeek {
  area: 'mine' | 'theirs';
  /** Posição na Área (0 = o primeiro que entrou). */
  index: number;
  card: CardInstance;
}

/**
 * Olhar um Prêmio de Batalha: escolhe a posição (as cartas ficam face para baixo), o servidor mostra a carta
 * só para você e anota no registro; depois dá para recuperá-la (volta ao topo do Deck de quem a deu).
 */
function PeekRewardDialog({
  area,
  count,
  peek,
  controls,
  opponentName,
  onClose,
}: {
  area: 'mine' | 'theirs';
  /** Quantos Prêmios há na Área. */
  count: number;
  peek?: ArenaPeek;
  controls: ArenaControls;
  opponentName: string;
  onClose: () => void;
}) {
  const nameOf = useCardName();
  // Só mostra a carta olhada NESTE diálogo (um Prêmio olhado antes não aparece ao abrir de novo).
  const [asked, setAsked] = useState(false);
  const shown = asked && peek && peek.area === area ? peek : null;
  const lookup = useArenaLookup();
  const shownCard = shown ? lookup(shown.card.cardId) : undefined;
  const giverHand = area === 'mine' ? `a mão de ${opponentName}` : 'a sua mão';
  const title = area === 'mine' ? 'Olhar um dos seus Prêmios' : `Olhar um Prêmio de ${opponentName}`;
  const ordinal = (i: number) => (i === count - 1 && count > 1 ? `${i + 1}º (o último)` : `${i + 1}º`);

  return (
    <Dialog open onClose={onClose} title={title}>
      {shown && shownCard ? (
        <div className="flex flex-col items-center gap-3">
          <p className="self-start text-sm text-muted">
            {ordinal(shown.index)} Prêmio. Só você vê esta carta; o registro anota que você olhou.
          </p>
          <ArenaCardImage
            card={shownCard}
            size="full"
            lazy={false}
            alt={nameOf(shownCard)}
            className="aspect-[5/7] w-56 overflow-hidden rounded-lg ring-1 ring-border"
          />
          <strong>{nameOf(shownCard)}</strong>
          <div className="flex w-full justify-end gap-2">
            <button
              type="button"
              onClick={() => setAsked(false)}
              className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-2"
            >
              Olhar outro
            </button>
            <button
              type="button"
              disabled={controls.busy}
              onClick={() => {
                controls.onReturnReward(area, shown.card.uid, 'hand');
                onClose();
              }}
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg hover:opacity-90 disabled:opacity-40"
              title={`A carta sai dos Prêmios e vai para ${giverHand}`}
            >
              Recuperar
            </button>
          </div>
        </div>
      ) : count === 0 ? (
        <p className="text-sm text-muted">Essa Área de Prêmios está vazia.</p>
      ) : (
        <>
          <p className="text-sm text-muted">
            Escolha qual Prêmio olhar (na ordem em que entraram). Só você vê a carta, e o registro anota que você
            olhou.
          </p>
          <ul className="grid max-h-[55vh] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-5">
            {Array.from({ length: count }, (_, i) => (
              <li key={i}>
                <button
                  type="button"
                  disabled={controls.busy}
                  onClick={() => {
                    setAsked(true);
                    controls.onPeekReward(area, i);
                  }}
                  className="group flex w-full flex-col items-center gap-1 rounded-lg p-1 hover:bg-surface-2 disabled:opacity-40"
                  title={`Olhar o ${ordinal(i)} Prêmio`}
                >
                  <img
                    src="/cards/card-back.webp"
                    alt=""
                    className="aspect-[5/7] w-full rounded object-cover ring-1 ring-border group-hover:ring-accent"
                  />
                  <span className="text-xs text-muted">{ordinal(i)}</span>
                </button>
              </li>
            ))}
          </ul>
          {asked && <p className="text-sm text-muted">Virando a carta…</p>}
        </>
      )}
    </Dialog>
  );
}

/** Escolha de quantas cartas revelar do Deck, e de onde (topo ou fundo). */
function RevealDialog({
  deckCount,
  controls,
  onClose,
}: {
  deckCount: number;
  controls: ArenaControls;
  onClose: () => void;
}) {
  const [count, setCount] = useState(1);
  const [from, setFrom] = useState<'top' | 'bottom'>('top');
  const n = Math.max(1, Math.min(deckCount, Math.floor(count) || 1));
  const submit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    controls.onReveal(from, n);
    onClose();
  };
  return (
    <Dialog open onClose={onClose} title="Revelar cartas do Deck">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          As cartas vão para a sua Vila, face para cima, na ordem do Deck. Os dois jogadores veem. Depois, mova cada
          uma para onde ela deve ir.
        </p>
        <div role="group" aria-label="De onde" className="flex gap-1 text-sm">
          {(
            [
              ['top', 'Do topo'],
              ['bottom', 'Do fundo'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={from === value}
              onClick={() => setFrom(value)}
              className={`rounded-md px-3 py-1 ${from === value ? 'bg-accent font-semibold text-bg' : 'bg-surface-2 text-muted hover:text-text'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 text-sm">
          Quantidade
          <input
            type="number"
            min={1}
            max={deckCount}
            value={count}
            autoFocus
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-md bg-bg px-2 py-1 text-text ring-1 ring-border focus-visible:ring-2 focus-visible:ring-accent"
          />
          <span className="text-muted">de {deckCount} no Deck</span>
        </label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-surface-2">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={controls.busy || deckCount === 0}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-bg hover:opacity-90 disabled:opacity-40"
          >
            Revelar {n === 1 ? '1 carta' : `${n} cartas`}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

/* ── Moedas ─────────────────────────────────────────────────────────────── */

/** "Growth ×2, Bomb ×1". */
function coinList(coins: Record<string, number>): string {
  return Object.entries(coins)
    .map(([kind, n]) => `${kind} ×${n}`)
    .join(', ');
}

/** Cor do selo: verde/vermelho para as moedas de Poder, dourado para as outras. */
function coinTone(kind: string): string | undefined {
  const p = coinPower(kind);
  return p ? (p.combat + p.support >= 0 ? styles.coinUp : styles.coinDown) : undefined;
}

/**
 * Selos das moedas sobre uma carta da mesa: um por tipo, com a quantidade num círculo e o nome ao lado.
 * Ficam no canto direito de baixo, a parte que fica à mostra também nos Ninjas de Apoio (atrás do Líder).
 * Nas cartas pequenas (Vila), os selos são menores.
 */
function CoinBadges({ coins, small }: { coins: Record<string, number>; small?: boolean }) {
  const entries = Object.entries(coins);
  if (entries.length === 0) return null;
  return (
    <div
      className={cx(styles.coins, small && styles.coinsSmall)}
      title={`Moedas: ${coinList(coins)}`}
      aria-label={`Moedas: ${coinList(coins)}`}
    >
      {entries.map(([kind, n]) => (
        <span key={kind} className={cx(styles.coin, coinTone(kind))}>
          <b>{n}</b>
          <span>{kind}</span>
        </span>
      ))}
    </div>
  );
}

/** No detalhe de uma carta do oponente (ou sem controles): as moedas dela, só para ver. */
function CoinView({ coins }: { coins: Record<string, number> }) {
  const entries = Object.entries(coins);
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Marcadores (moedas)</p>
      <ul className="flex flex-col gap-1">
        {entries.map(([k, n]) => (
          <li key={k} className="flex items-center gap-2 text-sm">
            <b className="w-6 text-center tabular-nums">{n}</b>
            <span>{k}</span>
            {coinPower(k) && <span className="text-xs text-muted">(soma no Poder)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** No detalhe de uma carta sua na Vila ou no Campo: as moedas dela, com −/+, e o campo para pôr outro tipo. */
function CoinEditor({ inst, controls }: { inst: CardInstance; controls: ArenaControls }) {
  const [name, setName] = useState('');
  const coins = Object.entries(inst.coins ?? {});
  const kind = coinKind(name);
  const btn =
    'flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-sm font-bold hover:bg-accent hover:text-bg disabled:opacity-40';
  const chip =
    'rounded-md bg-surface-2 px-2 py-1 text-xs font-semibold hover:bg-accent hover:text-bg disabled:opacity-40';
  const add = (k: string) => controls.onSetCoins(inst.uid, k, 1);
  const ninja = useArenaLookup()(inst.cardId)?.type === 'ninja';
  const pool: readonly string[] = ninja ? COIN_SUGGESTIONS.ninja : COIN_SUGGESTIONS.other;
  const suggestions = pool.filter((k) => !inst.coins?.[k]);
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Marcadores (moedas)</p>
      <p className="text-xs text-muted">
        {ninja
          ? 'Moedas que ficam na carta (Growth, Poison, "Bomb"…), para os dois verem. As de Poder (Growth, +1/+1, -1/-1) já somam no Time; para efeitos que duram só o turno, use o − e + do Poder.'
          : 'Moedas que ficam na carta, para os dois verem: as Moedas Ninja de uma Missão Permanent (X) (tire uma no início de cada turno seu) ou outra que a carta pedir.'}
      </p>
      {coins.length === 0 ? (
        <p className="text-xs text-muted">Nenhuma moeda nesta carta.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {coins.map(([k, n]) => (
            <li key={k} className="flex items-center gap-2 text-sm">
              <button
                type="button"
                className={btn}
                disabled={controls.busy}
                onClick={() => controls.onSetCoins(inst.uid, k, -1)}
                aria-label={`Tirar 1 moeda ${k}`}
              >
                −
              </button>
              <b className="w-6 text-center tabular-nums">{n}</b>
              <button type="button" className={btn} disabled={controls.busy} onClick={() => add(k)} aria-label={`Pôr 1 moeda ${k}`}>
                +
              </button>
              <span>{k}</span>
              {coinPower(k) && <span className="text-xs text-muted">(soma no Poder)</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-1.5">
        {suggestions.map((k) => (
          <button key={k} type="button" disabled={controls.busy} onClick={() => add(k)} className={chip}>
            + {k}
          </button>
        ))}
      </div>
      <form
        className="flex items-center gap-1.5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!kind) return;
          add(kind);
          setName('');
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={COIN_NAME_MAX + 4}
          placeholder={ninja ? 'Outra, como impressa (ex.: +1/+1, Bomb)' : 'Outra, como impressa (ex.: Bomb)'}
          aria-label="Nome da moeda"
          className="min-w-0 flex-1 rounded-md bg-bg px-2 py-1 text-sm text-text ring-1 ring-border focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button type="submit" disabled={controls.busy || !kind} className={chip}>
          Pôr moeda
        </button>
      </form>
    </div>
  );
}

/* ── Times ──────────────────────────────────────────────────────────────── */

/** Quanto um Ninja de Apoio cobre o anterior (fração da largura), em pé e Ferido (design: 46 e 20 de 96). */
const SUPPORT_OVERLAP = 46 / 96;
const INJURED_OVERLAP = 20 / 96;
/** Deslocamento vertical do Apoio (design: 14 de 134), para baixo no seu lado e para cima no do oponente. */
const SUPPORT_DROP = 14 / 134;


/** Dica do chip: a conta do Poder do Time (docs/REGRAS.md 3.5.4). */
function powerTitle(power: TeamPower, members: number): string {
  const [leader, ...supports] = power.parts;
  const signed = (n: number, what: string) => (n ? ` ${n > 0 ? '+' : '−'} ${Math.abs(n)} (${what})` : '');
  const mod = signed(power.coins, 'moedas') + signed(power.mod, 'ajuste');
  if (supports.length === 0) {
    return mod ? `Poder: ${leader} (Combate do Ninja)${mod} = ${formatTeamPower(power)}` : `Poder: ${leader} (Combate do Ninja)`;
  }
  return (
    `Poder do Time (${members}/${TEAM_MAX} Ninjas): ${leader} (Combate do Líder) + ` +
    `${supports.join(' + ')} (Suporte dos Apoios)${mod} = ${formatTeamPower(power)}`
  );
}

/** Largura que um Time ocupa na mesa (para encolher a Vila quando há muitas cartas). */
function teamWidth(group: CardInstance[], w: number, h: number): number {
  return group.reduce((sum, c, i) => {
    if (i === 0) return sum + (c.injured ? h : w);
    return sum + w - w * (c.injured ? INJURED_OVERLAP : SUPPORT_OVERLAP);
  }, 0);
}

/**
 * Um Ninja do Time: além de arrastável, recebe outro Ninja solto em cima dele para formar (ou aumentar)
 * um Time. O Líder fica por cima dos Apoios; Ferido = girado 90°.
 */
function TeamMember({
  inst,
  index,
  size,
  inTeam,
  controls,
  mine,
  onInspect,
  marginLeft,
  marginRight,
  dy,
  z,
}: {
  inst: CardInstance;
  index: number;
  size: { w: number; h: number };
  inTeam: boolean;
  controls?: ArenaControls;
  mine: boolean;
  onInspect: Inspect;
  marginLeft: number;
  marginRight: number;
  dy: number;
  z: number;
}) {
  const [over, setOver] = useState(false);
  const ninja = useArenaLookup()(inst.cardId)?.type === 'ninja';
  const accepts = !!controls && ninja;
  const leader = index === 0;
  const roleClass = leader ? (mine ? styles.leaderMine : styles.leaderOpp) : styles.support;
  // R com o mouse sobre um Ninja seu (Vila ou Campo de Batalha): fere ou cura (carta na horizontal).
  const hoverKeys = useHoverKeys({
    r: mine && controls && ninja && !controls.busy ? () => controls.onSetInjured(inst.uid, !inst.injured) : undefined,
  });
  return (
    <div
      {...hoverKeys}
      className={cx(styles.member, roleClass, over && styles.memberOver)}
      style={{ width: size.w, height: size.h, marginLeft, marginRight, transform: `translateY(${dy}px)`, zIndex: z }}
      onDragOver={(e) => {
        if (!accepts || !dragTypes(e.dataTransfer).includes(CARD_MIME)) return;
        e.preventDefault();
        // Sem stopPropagation: a zona precisa saber para esconder a barra de inserção.
        (e.nativeEvent as unknown as Record<symbol, boolean>)[JOIN_TARGET] = true;
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(e) => {
        setOver(false);
        if (!accepts) return;
        const uid = dragData(e.dataTransfer, CARD_MIME);
        if (!uid) return;
        e.preventDefault();
        e.stopPropagation(); // não deixa a zona tratar como "mover para a zona"
        if (uid !== inst.uid) controls!.onJoinTeam(uid, inst.uid);
      }}
    >
      <TableCard
        inst={inst}
        w={size.w}
        h={size.h}
        mine={mine}
        onInspect={onInspect}
        style={{ transform: inst.injured ? 'rotate(90deg)' : undefined }}
      />
      {inst.coins && <CoinBadges coins={inst.coins} small={size.w < FIELD_CARD.w} />}
      {mine && controls && ninja && inTeam && !leader && (
        <div className={styles.memberTools}>
          <button
            type="button"
            className={styles.tool}
            onClick={() => controls.onSetLeader(inst.uid)}
            disabled={controls.busy}
            title="Tornar Ninja Líder [Head Ninja]"
            aria-label="Tornar Ninja Líder"
          >
            ★
          </button>
        </div>
      )}
    </div>
  );
}

/** Um Time (Ninja sozinho = Time de 1), com a alça para arrastar o Time inteiro. */
function TeamStack({
  group,
  size,
  mine,
  controls,
  onInspect,
  style,
}: {
  group: CardInstance[];
  size: { w: number; h: number };
  mine: boolean;
  controls?: ArenaControls;
  onInspect: Inspect;
  style?: React.CSSProperties;
}) {
  const inTeam = group.length > 1;
  // Recalculado a cada estado: ferir/curar um membro ou trocar o Líder muda o Poder na hora.
  const lookup = useArenaLookup();
  // Poder impresso do Ninja (Saudável e Ferido), do catálogo ou da carta criada.
  const ninjaPower: PowerLookup = (cardId) => {
    const card = lookup(cardId);
    return card?.type === 'ninja' ? card : undefined;
  };
  const power = teamPower(group, ninjaPower);
  const drop = Math.round(size.h * SUPPORT_DROP) * (mine ? 1 : -1);
  const bulge = (size.h - size.w) / 2; // quanto a carta girada passa da largura dela, de cada lado
  return (
    <div className={styles.team} style={style} {...{ [TEAM_ATTR]: group[0].uid }}>
      {group.map((c, i) => {
        const first = i === 0;
        const last = i === group.length - 1;
        const marginLeft = first
          ? c.injured
            ? bulge
            : 0
          : -size.w * (c.injured ? INJURED_OVERLAP : SUPPORT_OVERLAP);
        return (
          <TeamMember
            key={c.uid}
            inst={c}
            index={i}
            size={size}
            inTeam={inTeam}
            controls={controls}
            mine={mine}
            onInspect={onInspect}
            marginLeft={marginLeft}
            marginRight={first && last && c.injured ? bulge : 0}
            dy={first ? 0 : drop}
            z={group.length - i}
          />
        );
      })}
      {power && (
        <div
          draggable={mine}
          {...(mine ? dragSource(TEAM_MIME, group[0].uid) : {})}
          className={cx(styles.teamHandle, mine && styles.draggable)}
          title={
            powerTitle(power, group.length) +
            (mine ? '\nArraste por aqui para mover o Time inteiro. − e + ajustam o Poder (efeitos de cartas).' : '')
          }
          aria-label={`Poder do Time: ${formatTeamPower(power)}`}
        >
          {mine && (
            <span aria-hidden className={styles.teamGrip}>
              ⠿
            </span>
          )}
          Poder
          {mine && controls && (
            <button
              type="button"
              draggable={false}
              className={styles.powerBtn}
              onClick={() => controls.onAdjustPower(group[0].uid, -1)}
              disabled={controls.busy}
              title="Diminuir o Poder do Time em 1"
              aria-label="Diminuir o Poder do Time"
            >
              −
            </button>
          )}
          <span
            className={cx(
              styles.teamCount,
              power.mod + power.coins > 0 && styles.powerUp,
              power.mod + power.coins < 0 && styles.powerDown,
            )}
          >
            {formatTeamPower(power)}
          </span>
          {mine && controls && (
            <button
              type="button"
              draggable={false}
              className={styles.powerBtn}
              onClick={() => controls.onAdjustPower(group[0].uid, 1)}
              disabled={controls.busy}
              title="Aumentar o Poder do Time em 1"
              aria-label="Aumentar o Poder do Time"
            >
              +
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Zonas das linhas ───────────────────────────────────────────────────── */

interface RowProps {
  side: ArenaSide;
  mine: boolean;
  controls?: ArenaControls;
  onInspect: Inspect;
  onOpenList: (zone: ZoneName) => void;
  /** Só na linha do oponente: você solta aqui uma carta sua (ou o topo do seu Deck) como Prêmio dele. */
  rewardDrop?: CustomDrop;
  /** Só na sua linha: abre a escolha de quantas cartas revelar do Deck. */
  onOpenReveal?: () => void;
  /** Número (`n` no registro) da última jogada que embaralhou o Deck deste jogador; quando muda, o Deck gira. */
  shuffleKey?: number;
  /** Abre a escolha de um Prêmio desta linha para olhar (e talvez recuperar). */
  onOpenPeek?: () => void;
}

/** Jogadas que terminam embaralhando o Deck (e disparam a animação). */
const SHUFFLING_ACTIONS: ReadonlySet<string> = new Set(['shuffle', 'search', 'returnHand']);

/** Número da última jogada de `who` que embaralhou o Deck (0 se nenhuma). */
function lastShuffle(log: LogEntryView[] | undefined, who: Side): number {
  if (!log) return 0;
  for (let i = log.length - 1; i >= 0; i--) {
    const e = log[i];
    // A mão devolvida ao fundo do Deck não embaralha.
    if (e.who === who && SHUFFLING_ACTIONS.has(e.type) && !(e.type === 'returnHand' && e.position === 'bottom')) return e.n;
  }
  return 0;
}

/** Quanto dura a animação do embaralhar (igual ao CSS de .shuffleCard). */
const SHUFFLE_MS = 900;
/** Quantas costas giram na animação. */
const SHUFFLE_CARDS = 5;

/**
 * Animação do Deck embaralhando: dispara quando `key` muda depois de montar (abrir a sala com o registro
 * já cheio não anima). Devolve a chave da animação em curso (para reiniciar o CSS) ou null.
 */
function useShuffleAnim(key: number | undefined): number | null {
  const first = useRef(key);
  const [playing, setPlaying] = useState<number | null>(null);
  useEffect(() => {
    if (key === undefined || key === first.current) return;
    first.current = key;
    setPlaying(key);
    const t = setTimeout(() => setPlaying(null), SHUFFLE_MS);
    return () => clearTimeout(t);
  }, [key]);
  return playing;
}

/**
 * Teclas de atalho que só valem com o mouse sobre um elemento: `actions` liga a tecla (minúscula, ou
 * "shift+tecla") à ação; sem ação (undefined), a tecla fica livre. Ignora teclas com Ctrl/Alt/Cmd, a tecla segurada e o que se
 * digita em campos de texto. Devolve os handlers de mouse para espalhar no elemento. Ao criar um atalho,
 * liste-o em SHORTCUTS.
 */
function useHoverKeys(actions: Record<string, (() => void) | undefined>) {
  const [hover, setHover] = useState(false);
  const latest = useRef(actions);
  latest.current = actions;
  useEffect(() => {
    if (!hover) return;
    const key = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      // Com Shift, a tecla é procurada como "shift+f" (F e Shift+F são atalhos diferentes).
      const run = latest.current[(e.shiftKey ? 'shift+' : '') + e.key.toLowerCase()];
      if (!run) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault(); // sem isso, a tecla seria digitada num diálogo que a ação abrir (ex.: o filtro da busca)
      run();
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [hover]);
  return { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
}

function DeckZone({ side, mine, controls, onOpenReveal, shuffleKey }: RowProps) {
  const drop = useDrop('deck', controls);
  const count = side.zones.deck.count;
  const ty = mine ? -1 : 1; // as camadas sobem no seu lado e descem no do oponente
  const shuffling = useShuffleAnim(shuffleKey);
  // Atalhos com o mouse sobre o seu Deck (listados em SHORTCUTS): R embaralha, F abre a busca.
  const ready = !!controls && !controls.busy;
  const hoverKeys = useHoverKeys({
    r: ready && count >= 2 ? controls.onShuffle : undefined,
    f: ready && count > 0 ? controls.onSearch : undefined,
  });
  return (
    <div
      {...drop.handlers}
      {...hoverKeys}
      className={cx(styles.zone, mine ? styles.zoneMine : styles.zoneOpp, styles.deck, drop.over && styles.over)}
      aria-label={mine ? 'Seu Deck' : `Deck de ${side.nickname}`}
    >
      <ZoneLabel text="Deck" />
      {count === 0 ? (
        <div className={styles.empty} />
      ) : (
        <div className={styles.deckStack}>
          {count > 2 && <div className={styles.backLayer} style={{ transform: `translate(4px, ${4 * ty}px)` }} />}
          {count > 1 && <div className={styles.backLayer} style={{ transform: `translate(2px, ${2 * ty}px)` }} />}
          <div
            role={controls ? 'button' : undefined}
            tabIndex={controls ? 0 : undefined}
            draggable={!!controls}
            {...(controls ? dragSource(DECK_TOP_MIME, '1') : {})}
            onClick={() => controls && !controls.busy && controls.onDraw()}
            onKeyDown={(e) => e.key === 'Enter' && controls && !controls.busy && controls.onDraw()}
            className={cx(styles.back, styles.deckTop, controls && styles.drawable, shuffling !== null && styles.deckTopHidden)}
            title={
              controls
                ? 'Clique para comprar 1 carta · arraste o topo para os Prêmios do oponente'
                : 'Face para baixo: dá para contar, não para ver'
            }
          />
          {/* Embaralhando: algumas costas giram e se abrem em leque, cada uma para um lado, e voltam à pilha. */}
          {shuffling !== null && (
            <div key={shuffling} aria-hidden className={styles.shuffleFx}>
              {Array.from({ length: Math.min(SHUFFLE_CARDS, count) }, (_, i) => {
                const dir = i % 2 === 0 ? 1 : -1;
                const spread = (Math.floor(i / 2) + 1) * 14;
                return (
                  <div
                    key={i}
                    className={cx(styles.back, styles.shuffleCard)}
                    style={
                      {
                        '--x-out': `${spread * dir}px`,
                        '--x-back': `${-0.3 * spread * dir}px`,
                        '--r-out': `${160 * dir}deg`,
                        '--r-mid': `${330 * dir}deg`,
                        '--r-end': `${360 * dir}deg`,
                        animationDelay: `${i * 40}ms`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      <div className={styles.pill}>{count}</div>
      {controls && (
        <div className={styles.deckTools}>
          {/* A carta do topo vai como Prêmio de Batalha do oponente (o mesmo que arrastar o topo). */}
          <button
            type="button"
            className={styles.tool}
            onClick={() => controls.onGiveReward()}
            disabled={controls.busy || count === 0}
            title="Enviar a carta do topo do Deck para os Prêmios do oponente (face para baixo)"
            aria-label="Enviar a carta do topo do Deck para os Prêmios do oponente"
          >
            🏆
          </button>
          {onOpenReveal && (
            <button
              type="button"
              className={styles.tool}
              onClick={onOpenReveal}
              disabled={controls.busy || count === 0}
              title="Revelar cartas do topo ou do fundo do deck (vão para a Vila, os dois veem)"
              aria-label="Revelar cartas do deck"
            >
              👁
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function DiscardZone({ side, mine, controls, onInspect, onOpenList }: RowProps) {
  const drop = useDrop('discard', controls);
  const { count, cards } = side.zones.discard;
  const top = cards?.at(-1);
  return (
    <div
      {...drop.handlers}
      onClick={() => onOpenList('discard')}
      className={cx(styles.zone, mine ? styles.zoneMine : styles.zoneOpp, styles.discard, styles.clickable, drop.over && styles.over)}
      title="Descartes [Discard Pile]: clique para ver a pilha"
    >
      <ZoneLabel text="Descarte" />
      {top ? (
        <TableCard
          inst={top}
          {...MINI_CARD}
          mine={mine}
          onInspect={onInspect}
          onClick={() => onOpenList('discard')}
          style={{ transform: `rotate(${mine ? 3 : -4}deg)` }}
        />
      ) : (
        <div className={styles.empty} />
      )}
      {count > 0 && <div className={styles.count}>{count}</div>}
    </div>
  );
}

/** Rotação das cartas empilhadas no Chakra (a de cima por último). */
const CHAKRA_TILT = [-10, -3, 5];

function ChakraZone({ side, mine, controls, onInspect, onOpenList }: RowProps) {
  const drop = useDrop('chakra', controls);
  const { count, cards = [] } = side.zones.chakra;
  const shown = cards.slice(-3);
  return (
    <div
      {...drop.handlers}
      onClick={() => onOpenList('chakra')}
      className={cx(styles.zone, mine ? styles.zoneMine : styles.zoneOpp, styles.chakra, styles.clickable, drop.over && styles.over)}
      title="Área de Chakra [Chakra Area]: clique para ver as cartas"
    >
      <div className={styles.label}>
        <span className={styles.kanji} style={{ fontSize: 11 }}>
          チャクラ
        </span>
      </div>
      <div className={styles.chakraStack}>
        {shown.length === 0
          ? CHAKRA_TILT.map((r) => <div key={r} className={styles.chakraSlot} style={{ transform: `rotate(${r}deg)`, opacity: 0.45 }} />)
          : shown.map((c, i) => (
              <TableCard
                key={c.uid}
                inst={c}
                w={46}
                h={64}
                mine={mine}
                onInspect={onInspect}
                onClick={() => onOpenList('chakra')}
                style={{ position: 'absolute', inset: 0, borderRadius: 4, transform: `rotate(${CHAKRA_TILT[i + 3 - shown.length]}deg)` }}
              />
            ))}
      </div>
      <div className={styles.bigCount}>
        <b>{count}</b>
        <span>CHAKRA</span>
      </div>
    </div>
  );
}

function VillageZone({ side, mine, controls, onInspect }: RowProps) {
  const drop = useDrop('village', controls, true);
  const cards = side.zones.village.cards ?? [];
  const groups = teamGroups(cards);
  // Muitas cartas: os Times passam a se sobrepor para caber na linha.
  const widths = groups.map((g) => teamWidth(g, MINI_CARD.w, MINI_CARD.h));
  const total = widths.reduce((a, b) => a + b, 0);
  const gap = groups.length < 2 ? 12 : Math.min(12, (VILLAGE_INNER - total) / (groups.length - 1));
  return (
    <div
      {...drop.handlers}
      className={cx(styles.zone, mine ? styles.zoneMine : styles.zoneOpp, styles.village, drop.over && styles.over)}
      aria-label={mine ? 'Sua Vila' : `Vila de ${side.nickname}`}
    >
      <ZoneLabel text="Vila" kanji="里" />
      <InsertBar at={drop.insert} />
      {groups.length === 0 && <span className={styles.zoneHint}>{mine && controls ? 'Solte cartas aqui' : 'Vazia'}</span>}
      {groups.map((g, i) => (
        <TeamStack
          key={g[0].uid}
          group={g}
          size={MINI_CARD}
          mine={mine}
          controls={controls}
          onInspect={onInspect}
          style={{ marginLeft: i === 0 ? 0 : gap - 12, zIndex: i }}
        />
      ))}
    </div>
  );
}

function RewardZone({ side, mine, controls, rewardDrop, onOpenPeek }: RowProps) {
  const drop = useCustomDrop(rewardDrop);
  const count = side.zones.rewards.count;
  const returnTitle = mine
    ? 'Devolver o último Prêmio recebido ao topo do Deck do oponente'
    : `Pegar de volta o último Prêmio dado a ${side.nickname} (volta ao topo do seu Deck)`;
  return (
    <div
      {...drop.handlers}
      className={cx(styles.zone, mine ? styles.zoneMine : styles.zoneOpp, styles.reward, drop.over && styles.over)}
      title={
        rewardDrop?.hint ??
        'Prêmios de Batalha [Battle Rewards]: face para baixo; vêm do Deck do oponente. Com 10, você vence.'
      }
    >
      <ZoneLabel text="Prêmios" />
      <div className={styles.rewardStack}>
        {count === 0 ? (
          <div className={styles.empty} style={{ width: 50, height: 70 }} />
        ) : (
          <>
            {count > 1 && <div className={styles.backLayer} style={{ transform: 'translate(4px,-4px)' }} />}
            {/* Face para baixo: as costas da carta; no seu lado, com o contorno roxo. */}
            <div
              className={styles.back}
              style={mine ? { boxShadow: '0 0 0 1px var(--color-accent-500)' } : undefined}
            />
          </>
        )}
      </div>
      <div className={styles.rewardNum}>{count}</div>
      {/* Sempre à mostra (desligado com a área vazia), para ficar claro que dá para recuperar o Prêmio. */}
      {controls && (
        <div className={styles.deckTools}>
          {onOpenPeek && (
            <button
              type="button"
              className={styles.tool}
              onClick={onOpenPeek}
              disabled={controls.busy || count === 0}
              title="Olhar um destes Prêmios (só você vê; fica no registro) e, se quiser, recuperá-lo"
              aria-label="Olhar um Prêmio"
            >
              🔍
            </button>
          )}
          <button
            type="button"
            className={styles.tool}
            onClick={() => controls.onReturnReward(mine ? 'mine' : 'theirs')}
            disabled={controls.busy || count === 0}
            title={returnTitle}
            aria-label={returnTitle}
          >
            ↩
          </button>
        </div>
      )}
    </div>
  );
}

/** Linha de zonas de um jogador. A do oponente vai da esquerda para a direita; a sua, espelhada. */
function ZoneRow({ rewardControls, ...props }: RowProps & { rewardControls?: ArenaControls }) {
  return (
    <div className={cx(styles.row, props.mine ? styles.rowMine : styles.rowOpp)}>
      <DeckZone {...props} />
      <DiscardZone {...props} />
      <ChakraZone {...props} />
      <VillageZone {...props} />
      <RewardZone {...props} controls={rewardControls ?? props.controls} />
    </div>
  );
}

/* ── Campo de Batalha ───────────────────────────────────────────────────── */

function Field({
  side,
  mine,
  controls,
  onInspect,
}: {
  side: ArenaSide;
  mine: boolean;
  controls?: ArenaControls;
  onInspect: Inspect;
}) {
  const drop = useDrop('battlefield', controls, true);
  const cards = side.zones.battlefield.cards ?? [];
  const lookup = useArenaLookup();
  const typeOf = (c: CardInstance) => lookup(c.cardId)?.type;
  const missions = cards.filter((c) => typeOf(c) === 'mission');
  const jutsus = cards.filter((c) => typeOf(c) === 'jutsu');
  const teams = teamGroups(cards.filter((c) => typeOf(c) !== 'mission' && typeOf(c) !== 'jutsu'));
  // Missões à esquerda da tela e Jutsus à direita, para os dois jogadores (sem espelhar o oponente).
  const [left, right] = [missions, jutsus];
  return (
    <div
      {...drop.handlers}
      className={cx(styles.field, mine ? styles.fieldMine : styles.fieldOpp, drop.over && styles.over)}
      aria-label={mine ? 'Seu Campo de Batalha' : `Campo de Batalha de ${side.nickname}`}
    >
      <InsertBar at={drop.insert} />
      {teams.length === 0 ? (
        // Sem Ninjas no Campo: Missões e Jutsus ficam no centro, na mesma ordem (Missões à esquerda do jogador).
        <div className={cx(styles.teams, styles.fieldTeams, styles.fieldLoose)}>
          {[...left, ...right].map((c) => (
            <TableCard key={c.uid} inst={c} {...FIELD_CARD} mine={mine} onInspect={onInspect} className={styles.fieldSideCard} />
          ))}
        </div>
      ) : (
        <>
          <FieldSide cards={left} edge="left" mine={mine} onInspect={onInspect} />
          {/* Centro: só os Times (a barra de reordenar só conta estes). */}
          <div className={cx(styles.teams, styles.fieldTeams)}>
            {teams.map((g) => (
              <TeamStack key={g[0].uid} group={g} size={FIELD_CARD} mine={mine} controls={controls} onInspect={onInspect} />
            ))}
          </div>
          <FieldSide cards={right} edge="right" mine={mine} onInspect={onInspect} />
        </>
      )}
    </div>
  );
}

/** Largura das faixas laterais do Campo (Missões e Jutsus), entre a borda chanfrada e os Times. */
const FIELD_SIDE_SPACE = 230;

/** Missões ou Jutsus jogados no Campo de Batalha, numa faixa lateral, sobrepostos se forem muitos. */
function FieldSide({
  cards,
  edge,
  mine,
  onInspect,
}: {
  cards: CardInstance[];
  edge: 'left' | 'right';
  mine: boolean;
  onInspect: Inspect;
}) {
  if (cards.length === 0) return null;
  const n = cards.length;
  const overlap = n > 1 ? Math.max(30, (n * FIELD_CARD.w - FIELD_SIDE_SPACE) / (n - 1)) : 0;
  return (
    <div className={cx(styles.fieldSide, edge === 'left' ? styles.fieldSideLeft : styles.fieldSideRight)}>
      {cards.map((c, i) => (
        <TableCard
          key={c.uid}
          inst={c}
          {...FIELD_CARD}
          mine={mine}
          onInspect={onInspect}
          className={styles.fieldSideCard}
          style={{ marginLeft: i === 0 ? 0 : -overlap, zIndex: i }}
        />
      ))}
    </div>
  );
}

function Arena({
  you,
  opponent,
  phase,
  controls,
  onInspect,
}: {
  you: ArenaSide;
  opponent: ArenaSide;
  phase: number;
  controls?: ArenaControls;
  onInspect: Inspect;
}) {
  const lookup = useArenaLookup();
  const teams = (side: ArenaSide) => countTeams(side.zones.battlefield.cards ?? [], (id) => lookup(id)?.type === 'ninja');
  return (
    <div className={styles.arena}>
      <div className={styles.arenaInner}>
        <div className={cx(styles.ring, styles.ringOuter)} />
        <div className={cx(styles.ring, styles.ringInner)} />
        <div className={cx(styles.arenaLabel, styles.arenaLabelOpp)}>
          <span>戦場</span>
          <span>
            Campo de Batalha · {opponent.nickname} · {teams(opponent)}/{BATTLEFIELD_MAX_TEAMS} Times
          </span>
        </div>
        <div className={cx(styles.arenaLabel, styles.arenaLabelMine)}>
          <span>戦場</span>
          <span>
            Campo de Batalha · Você · {teams(you)}/{BATTLEFIELD_MAX_TEAMS} Times
          </span>
        </div>
        <div className={styles.centerLine} />
        <Field side={opponent} mine={false} onInspect={onInspect} />
        <Field side={you} mine controls={controls} onInspect={onInspect} />
        <div className={styles.phasePill} aria-label={`Fase ${PHASES[phase]}`}>
          <span>{PHASE_KANJI[phase]}</span>
          <span>{PHASES[phase]}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Mãos ───────────────────────────────────────────────────────────────── */

function OpponentHand({ side }: { side: ArenaSide }) {
  const n = Math.min(side.zones.hand.count, 12);
  return (
    <div className={styles.oppHand} title={`${side.zones.hand.count} cartas na mão de ${side.nickname}`}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className={styles.back} style={{ transform: `rotate(${(i - (n - 1) / 2) * -3}deg)` }} />
      ))}
    </div>
  );
}

/** Distância entre as cartas da mão (design: 112px com 22px de sobreposição). */
const HAND_STEP = HAND_CARD.w - 22;
/** Menor distância entre as cartas, com a mão cheia. */
const HAND_MIN_STEP = 56;
/** Até quantas pilhas a mão usa a distância do design; depois, cada pilha a mais aproxima as cartas. */
const HAND_ROOMY = 6;
/** Quanto as cartas se aproximam a cada pilha a mais. */
const HAND_SQUEEZE = 5;
/** Cartas inteiras de cada lado da carta central do arco, na distância do design; as outras somem e a mão rola. */
const HAND_RADIUS = 4;

/**
 * Distância entre as cartas e quantas ficam inteiras de cada lado da central: quanto mais pilhas na mão,
 * mais juntas (e mais cartas cabem na mesma largura do arco); quando a mão diminui, voltam a se afastar.
 */
function handSpacing(n: number): { step: number; radius: number } {
  const step = Math.max(HAND_MIN_STEP, HAND_STEP - Math.max(0, n - HAND_ROOMY) * HAND_SQUEEZE);
  return { step, radius: Math.max(HAND_RADIUS, Math.floor((HAND_RADIUS * HAND_STEP) / step)) };
}
/** Roda do mouse / touchpad: quanto de deslocamento vale uma carta. */
const WHEEL_STEP = 60;

/**
 * Sua mão em arco, como um carrossel: o arco gira em torno de uma carta central (`focus`), com
 * `HAND_RADIUS` cartas inteiras de cada lado. Com mais cartas, a roda do mouse (ou o deslize do touchpad)
 * gira o arco, e os chips nas pontas mostram quantas estão escondidas de cada lado.
 */
function Hand({ side, controls, onInspect }: { side: ArenaSide; controls?: ArenaControls; onInspect: Inspect }) {
  const drop = useDrop('hand', controls);
  const lookup = useArenaLookup();
  const stacks = stackByCard(side.zones.hand.cards ?? [], lookup);
  const n = stacks.length;
  const center = (n - 1) / 2;
  const { step, radius } = handSpacing(n);
  // Faixa da carta central: com até 2×radius+1 cartas, fica no meio e nada rola.
  const minFocus = Math.min(radius, center);
  const maxFocus = Math.max(n - 1 - radius, center);
  const [wanted, setWanted] = useState<number | null>(null);
  const focus = wanted === null ? center : Math.min(maxFocus, Math.max(minFocus, wanted));
  const scrollable = maxFocus > minFocus;
  const scrollBy = (cards: number) => setWanted(Math.min(maxFocus, Math.max(minFocus, focus + cards)));

  // Roda do mouse: ouvinte nativo (não passivo) para impedir a rolagem da página.
  const ref = useRef<HTMLDivElement>(null);
  const wheel = useRef({ acc: 0, scrollBy });
  wheel.current.scrollBy = scrollBy;
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollable) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const px = e.deltaMode === 0 ? d : d * 40; // linhas/páginas → px
      const w = wheel.current;
      if (Math.abs(px) >= WHEEL_STEP) {
        w.acc = 0; // um "clique" da roda = uma carta
        w.scrollBy(Math.sign(px));
        return;
      }
      w.acc += px; // touchpad: soma os deslocamentos pequenos
      if (Math.abs(w.acc) >= WHEEL_STEP) {
        w.scrollBy(Math.sign(w.acc));
        w.acc = 0;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scrollable]);

  const hiddenLeft = stacks.filter((_, i) => i < focus - radius - 0.5).length;
  const hiddenRight = stacks.filter((_, i) => i > focus + radius + 0.5).length;
  // Chips logo depois das cartas inteiras do arco.
  const chipOffset = (radius + 0.5) * step + HAND_CARD.w / 2;

  // R com o mouse sobre a mão: a mão inteira volta ao Deck, que é embaralhado (o mesmo que "Mão → Deck",
  // sem a confirmação). O registro anota quais cartas foram (o oponente vê só quantas).
  // Shift+F: a mão vai para o fundo do Deck, na ordem da mão, sem embaralhar (F sobre uma carta = só ela).
  const canReturn = !!controls && !controls.busy && side.zones.hand.count > 0;
  const hoverKeys = useHoverKeys({
    r: canReturn ? controls.onReturnHand : undefined,
    'shift+f': canReturn ? controls.onReturnHandToBottom : undefined,
  });

  return (
    <div
      ref={ref}
      {...drop.handlers}
      {...hoverKeys}
      className={cx(styles.hand, drop.over && styles.over)}
      aria-label="Sua mão"
      title={scrollable ? 'Role o mouse sobre a mão para ver as outras cartas' : undefined}
    >
      {n === 0 && <span className={styles.handEmpty}>Mão vazia</span>}
      {stacks.map(({ top, count }, i) => {
        // Posição no arco em relação à carta central. A curva do design (gira 4° e desce u²×3px) usa a
        // distância na tela (u, em cartas do design): cartas mais juntas não despencam nas pontas.
        const o = i - focus;
        const u = (o * step) / HAND_STEP;
        const far = Math.abs(o) - radius; // > 0: fora da janela
        const opacity = far <= 0 ? 1 : far >= 1 ? 0 : 1 - far;
        return (
          <div
            key={top.cardId}
            className={cx(styles.handSlot, count > 1 && styles.handStack)}
            style={{
              zIndex: i + 1,
              opacity,
              pointerEvents: opacity < 0.5 ? 'none' : undefined,
              transform: `translateX(${o * step - HAND_CARD.w / 2}px) translateY(${u * u * 3}px) rotate(${u * 4}deg)`,
            }}
            aria-hidden={opacity === 0 || undefined}
          >
            <div className={styles.handLift}>
              {/* Arrastar a pilha leva uma cópia (a primeira que entrou na mão). */}
              <TableCard inst={top} {...HAND_CARD} mine={!!controls} onInspect={onInspect} className={styles.handCard} />
              {count > 1 && (
                <span className={styles.stackBadge} title={`${count} cópias desta carta na mão`}>
                  ×{count}
                </span>
              )}
            </div>
          </div>
        );
      })}
      {hiddenLeft > 0 && (
        <button
          type="button"
          className={styles.handMore}
          style={{ right: `calc(50% + ${chipOffset}px)` }}
          onClick={() => scrollBy(-radius)}
          title={`${hiddenLeft} carta(s) à esquerda`}
          aria-label={`Ver ${hiddenLeft} carta(s) à esquerda`}
        >
          ‹ {hiddenLeft}
        </button>
      )}
      {hiddenRight > 0 && (
        <button
          type="button"
          className={styles.handMore}
          style={{ left: `calc(50% + ${chipOffset}px)` }}
          onClick={() => scrollBy(radius)}
          title={`${hiddenRight} carta(s) à direita`}
          aria-label={`Ver ${hiddenRight} carta(s) à direita`}
        >
          {hiddenRight} ›
        </button>
      )}
    </div>
  );
}

/** Ordem dos tipos na sua mão: Ninjas → Clientes → Missões → Jutsus. */
const HAND_TYPE_ORDER: Record<string, number> = { ninja: 0, client: 1, mission: 2, jutsu: 3 };

/**
 * Cartas iguais (mesmo `cardId`) juntas numa pilha, organizadas por tipo (`HAND_TYPE_ORDER`). Dentro do
 * mesmo tipo, na ordem em que a primeira cópia entrou na mão.
 */
function stackByCard(
  cards: readonly CardInstance[],
  lookup: (id: string) => Card | undefined,
): { top: CardInstance; count: number }[] {
  const stacks = new Map<string, { top: CardInstance; count: number }>();
  for (const c of cards) {
    const s = stacks.get(c.cardId);
    if (s) s.count++;
    else stacks.set(c.cardId, { top: c, count: 1 });
  }
  const rank = (cardId: string) => HAND_TYPE_ORDER[lookup(cardId)?.type ?? ''] ?? 4;
  // sort é estável: dentro do mesmo tipo, mantém a ordem de chegada.
  return [...stacks.values()].sort((a, b) => rank(a.top.cardId) - rank(b.top.cardId));
}

/* ── Coluna de informações (à esquerda) ─────────────────────────────────── */

function Pips({
  label,
  value,
  max,
  onAdjust,
  busy,
  what,
}: {
  label: string;
  value: number;
  max: number;
  /** Com isto, a barra ganha −/+ (ex.: o seu Marcador de Turnos). */
  onAdjust?: (delta: number) => void;
  busy?: boolean;
  /** Nome do que a barra conta, para a dica dos botões. */
  what?: string;
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.barHead}>
        <span>{label}</span>
        <span className={styles.barValue}>
          {onAdjust && (
            <button
              type="button"
              className={styles.barBtn}
              disabled={busy || value <= 0}
              onClick={() => onAdjust(-1)}
              title={`Descer o ${what ?? label} 1 casa (efeitos de cartas)`}
              aria-label={`Descer o ${what ?? label}`}
            >
              −
            </button>
          )}
          <b>
            {value}/{max}
          </b>
          {onAdjust && (
            <button
              type="button"
              className={styles.barBtn}
              disabled={busy || value >= max}
              onClick={() => onAdjust(1)}
              title={`Subir o ${what ?? label} 1 casa (efeitos de cartas)`}
              aria-label={`Subir o ${what ?? label}`}
            >
              +
            </button>
          )}
        </span>
      </div>
      <div className={styles.pips}>
        {Array.from({ length: max }, (_, i) => (
          <i key={i} className={i < value ? styles.on : undefined} />
        ))}
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
  title,
  onClick,
  drop,
}: {
  label: string;
  value: number;
  title: string;
  onClick?: () => void;
  drop?: DropTarget;
}) {
  const body = (
    <>
      <b>{value}</b>
      <span>{label}</span>
    </>
  );
  if (!onClick && !drop) {
    return (
      <div className={styles.counter} title={title}>
        {body}
      </div>
    );
  }
  return (
    <button type="button" {...drop?.handlers} onClick={onClick} className={cx(styles.counter, drop?.over && styles.over)} title={title}>
      {body}
    </button>
  );
}

function Plate({
  side,
  mine,
  controls,
  onOpenList,
}: {
  side: ArenaSide;
  mine: boolean;
  controls?: ArenaControls;
  onOpenList: (zone: ZoneName) => void;
}) {
  const z = side.zones;
  const reinforcementDrop = useDrop('reinforcement', controls);
  const removedDrop = useDrop('removed', controls);
  const who = (
    <div className={styles.who}>
      <div className={styles.avatar} aria-hidden>
        {side.nickname.trim().charAt(0).toUpperCase() || '?'}
      </div>
      <div className={styles.whoText}>
        <b title={side.nickname}>{side.nickname}</b>
        <span>
          {mine ? 'Você' : 'Oponente'}
          {side.attacker && <span className={styles.attackerTag}>{mine ? ' · sua vez' : ' · Atacante'}</span>}
        </span>
      </div>
    </div>
  );
  const bars = (
    <>
      <Pips label="Prêmios" value={Math.min(z.rewards.count, REWARDS_TO_WIN)} max={REWARDS_TO_WIN} />
      <Pips
        label="Marcador"
        value={side.turn}
        max={TURN_MAX}
        onAdjust={mine && controls ? controls.onAdjustTurn : undefined}
        busy={controls?.busy}
        what="Marcador de Turnos"
      />
    </>
  );
  const counters = (
    <div className={styles.counters}>
      <Counter label="MÃO" value={z.hand.count} title={mine ? 'Cartas na sua mão' : `Cartas na mão de ${side.nickname}`} />
      <Counter
        label="REFORÇO"
        value={z.reinforcement.count}
        title="Baralho de Reforço [Reinforcement Deck]: só o dono vê"
        onClick={z.reinforcement.cards ? () => onOpenList('reinforcement') : undefined}
        drop={controls ? reinforcementDrop : undefined}
      />
      <Counter
        label="REMOV."
        value={z.removed.count}
        title="Removidos de Jogo [Removed from Game]: face para cima"
        onClick={() => onOpenList('removed')}
        drop={controls ? removedDrop : undefined}
      />
    </div>
  );
  return (
    <div className={cx(styles.plate, mine && styles.plateMine)} aria-label={mine ? 'Sua placa' : `Placa de ${side.nickname}`}>
      {mine ? (
        <>
          {counters}
          {bars}
          {who}
        </>
      ) : (
        <>
          {who}
          {bars}
          {counters}
        </>
      )}
    </div>
  );
}

function TurnPanel({
  turnNumber,
  phase,
  you,
  opponent,
  controls,
}: {
  turnNumber: number;
  phase: number;
  you: ArenaSide;
  opponent: ArenaSide;
  controls?: ArenaControls;
}) {
  const last = phase >= PHASES.length - 1;
  return (
    <div className={styles.turnBox} aria-label="Andamento do Jogo [Turn Sequence]">
      <div className={styles.turnHead}>
        <span>TURNO</span>
        <b>{turnNumber}</b>
        <span className={styles.turnWho}>{you.attacker ? 'Seu turno' : opponent.attacker ? opponent.nickname : ''}</span>
      </div>
      <ol className={styles.phases}>
        {PHASES.map((p, i) => (
          <li
            key={p}
            className={cx(styles.phase, i === phase && styles.phaseActive, i < phase && styles.phaseDone)}
            aria-current={i === phase ? 'step' : undefined}
          >
            <span>{PHASE_KANJI[i]}</span>
            <span>{p}</span>
          </li>
        ))}
      </ol>
      {controls &&
        (you.attacker ? (
          <button
            type="button"
            className={styles.btn}
            disabled={controls.busy}
            onClick={last ? controls.onPassTurn : controls.onNextPhase}
            title={
              last
                ? 'Fim do turno: o seu Marcador de Turnos avança 1 casa e o oponente vira o Atacante (até 6 cartas na mão)'
                : `Ir para a Fase ${PHASES[phase + 1]}`
            }
          >
            {last ? 'Passar turno' : 'Próxima fase'}
          </button>
        ) : (
          <button type="button" className={styles.btn} disabled>
            Turno de {opponent.nickname}
          </button>
        ))}
    </div>
  );
}

/* ── Registro de jogo ───────────────────────────────────────────────────── */

/** "para a Vila", "da mão"… (as zonas são de quem jogou). */
const ZONE_TO: Record<ZoneName, string> = {
  deck: 'para o topo do Deck',
  hand: 'para a mão',
  village: 'para a Vila',
  battlefield: 'para o Campo de Batalha',
  chakra: 'para o Chakra',
  discard: 'para os Descartes',
  rewards: 'para os Prêmios',
  reinforcement: 'para o Reforço',
  removed: 'para Removidos de Jogo',
};
const ZONE_FROM: Record<ZoneName, string> = {
  deck: 'do Deck',
  hand: 'da mão',
  village: 'da Vila',
  battlefield: 'do Campo de Batalha',
  chakra: 'do Chakra',
  discard: 'dos Descartes',
  rewards: 'dos Prêmios',
  reinforcement: 'do Reforço',
  removed: 'de Removidos de Jogo',
};
const ZONE_IN: Record<ZoneName, string> = {
  deck: 'no Deck',
  hand: 'na mão',
  village: 'na Vila',
  battlefield: 'no Campo de Batalha',
  chakra: 'no Chakra',
  discard: 'nos Descartes',
  rewards: 'nos Prêmios',
  reinforcement: 'no Reforço',
  removed: 'em Removidos de Jogo',
};

/** Uma entrada do registro em texto, com os nomes das cartas clicáveis. */
function LogLine({
  e,
  who,
  other,
  onInspect,
}: {
  e: LogEntryView;
  /** Nome de quem jogou ("Você" ou o apelido). */
  who: string;
  /** Nome do outro jogador (para os Prêmios dados a ele). */
  other: string;
  onInspect: Inspect;
}) {
  const nameOf = useCardName();
  const lookup = useArenaLookup();
  const setHovered = useContext(HoverContext);
  const card = (cardId: string | undefined) => {
    const c = cardId ? lookup(cardId) : undefined;
    if (!c) return <b>{cardId ?? 'carta'}</b>;
    // Mouse sobre o nome: a carta ampliada ao lado, sem precisar do Alt.
    return (
      <button
        type="button"
        className={styles.logCard}
        onClick={() => {
          setHovered(null);
          onInspect(c);
        }}
        onMouseEnter={(ev) => setHovered({ card: c, clientX: ev.clientX, always: true })}
        onMouseLeave={() => setHovered(null)}
      >
        {nameOf(c)}
      </button>
    );
  };
  const main = e.hidden ? 'uma carta' : card(e.cards?.[0]);
  const from = e.from ? ` ${ZONE_FROM[e.from]}` : '';
  let text: React.ReactNode;
  switch (e.type) {
    case 'move':
      text =
        e.from && e.from === e.to ? (
          <>reposicionou {main} {ZONE_IN[e.from]}</>
        ) : (
          <>
            moveu {main}
            {from} {e.to === 'deck' && e.position === 'bottom' ? 'para o fundo do Deck' : e.to && ZONE_TO[e.to]}
          </>
        );
      break;
    case 'moveTeam': {
      const [leader, ...rest] = e.cards ?? [];
      const what = e.hidden ? (
        'um Time'
      ) : (
        <>
          o Time de {card(leader)}
          {rest.length > 0 && (
            <>
              {' '}
              ({rest.map((id, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  {card(id)}
                </span>
              ))})
            </>
          )}
        </>
      );
      text =
        e.from && e.from === e.to ? (
          <>reposicionou {what} {ZONE_IN[e.from]}</>
        ) : (
          <>
            moveu {what}
            {from} {e.to && ZONE_TO[e.to]}
          </>
        );
      break;
    }
    case 'draw':
      text = <>comprou {main}</>;
      break;
    case 'search':
      text = <>buscou {main} no Deck e embaralhou</>;
      break;
    case 'reveal':
      text = (
        <>
          revelou {e.count === 1 ? '1 carta' : `${e.count} cartas`} {e.position === 'bottom' ? 'do fundo' : 'do topo'} do
          Deck (foram para a Vila)
          {(e.cards?.length ?? 0) > 0 && (
            <>
              :{' '}
              {e.cards!.map((id, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  {card(id)}
                </span>
              ))}
            </>
          )}
        </>
      );
      break;
    case 'shuffle':
      text = <>embaralhou o Deck</>;
      break;
    case 'returnHand': {
      const where = e.position === 'bottom' ? 'ao fundo do Deck (sem embaralhar)' : 'ao Deck e embaralhou';
      text = e.hidden ? (
        <>
          devolveu {e.count === 1 ? '1 carta' : `${e.count ?? 'as'} cartas`} da mão {where}
        </>
      ) : (
        <>
          devolveu a mão {where}:{' '}
          {(e.cards ?? []).map((id, i) => (
            <span key={i}>
              {i > 0 && ', '}
              {card(id)}
            </span>
          ))}
        </>
      );
      break;
    }
    case 'joinTeam':
      text = (
        <>
          juntou {main} ao Time de {card(e.target)}
          {e.from && e.from !== e.to && <> (veio {ZONE_FROM[e.from]})</>}
        </>
      );
      break;
    case 'setLeader':
      text = <>tornou {main} o Ninja Líder</>;
      break;
    case 'setInjured':
      text = e.injured ? <>feriu {main}</> : <>curou {main}</>;
      break;
    case 'giveReward':
      text = (
        <>
          deu {e.hidden && e.from === 'deck' ? 'a carta do topo do Deck' : main}
          {!(e.hidden && e.from === 'deck') && from} como Prêmio de Batalha para {other}
        </>
      );
      break;
    case 'nextPhase':
      text = <>avançou para a Fase {PHASES[e.phase ?? 0]}</>;
      break;
    case 'returnReward': {
      // Com a carta (um Prêmio olhado), só quem devolveu vê o nome.
      const what = e.cards?.length ? <>o Prêmio de Batalha {card(e.cards[0])}</> : 'um Prêmio de Batalha';
      const toHand = e.to === 'hand';
      text =
        e.owner === e.who ? (
          <>
            devolveu {what} {toHand ? `para a mão de ${other}` : `ao topo do Deck de ${other}`}
          </>
        ) : (
          <>
            recuperou {what} dado a {other} ({toHand ? 'foi para a mão' : 'foi para o topo do Deck'})
          </>
        );
      break;
    }
    case 'peekReward': {
      const slot = e.slot ? `o ${e.slot}º` : 'um';
      const where =
        e.owner === e.who
          ? 'dos próprios Prêmios de Batalha'
          : other === 'você'
            ? 'dos seus Prêmios de Batalha'
            : `dos Prêmios de Batalha de ${other}`;
      text = e.hidden ? (
        <>
          olhou {slot} {where}
        </>
      ) : (
        <>
          olhou {slot} {where}: {card(e.cards?.[0])}
        </>
      );
      break;
    }
    case 'adjustPower': {
      const d = e.delta ?? 0;
      text = (
        <>
          {d >= 0 ? 'aumentou' : 'diminuiu'} em {Math.abs(d)} o Poder do Time de {main}
          {e.from && ` ${ZONE_IN[e.from]}`}
        </>
      );
      break;
    }
    case 'setCoins': {
      const d = e.delta ?? 0;
      const n = Math.abs(d);
      text = (
        <>
          {d >= 0 ? 'pôs' : 'tirou'} {n === 1 ? '1 moeda' : `${n} moedas`} {e.coin} {d >= 0 ? 'em' : 'de'} {main}
          {e.from && ` ${ZONE_IN[e.from]}`}
        </>
      );
      break;
    }
    case 'flip':
      text = (
        <>
          jogou a Moeda Ninja: <b>{e.result === 'heads' ? 'Cara [Heads]' : 'Coroa [Tails]'}</b>
        </>
      );
      break;
    case 'adjustTurn': {
      const d = e.delta ?? 0;
      text = (
        <>
          {d >= 0 ? 'subiu' : 'desceu'} o Marcador de Turnos em {Math.abs(d)} {Math.abs(d) === 1 ? 'casa' : 'casas'}
        </>
      );
      break;
    }
    case 'passTurn':
      text = <>passou o turno</>;
      break;
    default:
      text = null;
  }
  return (
    <>
      <b>{who}</b> {text}.
    </>
  );
}

/** Quanto tempo o resultado da Moeda Ninja fica na tela. */
const FLIP_MS = 4000;

/**
 * Última Moeda Ninja jogada, enquanto o resultado está na tela. Só as jogadas depois de abrir a arena
 * aparecem (abrir a sala com o registro já cheio não mostra a moeda antiga).
 */
function useLastFlip(log: LogEntryView[] | undefined): LogEntryView | null {
  const latest = log ? [...log].reverse().find((e) => e.type === 'flip') : undefined;
  const latestRef = useRef(latest);
  latestRef.current = latest;
  const n = latest?.n ?? 0;
  const first = useRef(n);
  const [shown, setShown] = useState<LogEntryView | null>(null);
  // Depende só do número da jogada: outras atualizações da sala não reiniciam (nem cancelam) o tempo.
  useEffect(() => {
    if (n <= first.current || !latestRef.current) return;
    first.current = n;
    setShown(latestRef.current);
    const t = setTimeout(() => setShown(null), FLIP_MS);
    return () => clearTimeout(t);
  }, [n]);
  return shown;
}

/** Painel aberto no canto inferior direito da arena (os dois ocupam o mesmo lugar). */
type CornerPanel = 'log' | 'keys';

/** Quantas jogadas do registro chegaram desde a última vez que ele ficou aberto. */
function useUnread(log: LogEntryView[] | undefined, open: boolean): number {
  const latest = log?.at(-1)?.n ?? 0;
  // Jogadas já vistas: as que existiam ao abrir a tela não contam como novas.
  const [seen, setSeen] = useState(latest);
  useEffect(() => {
    if (open) setSeen(latest);
  }, [open, latest]);
  return open || !log ? 0 : log.filter((e) => e.n > seen).length;
}

/** Cabeçalho dos painéis do canto (registro e atalhos). */
function PanelHead({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className={styles.logHead}>
      <span>{title}</span>
      <button type="button" onClick={onClose} aria-label={`Fechar: ${title}`} className={styles.logClose}>
        ✕
      </button>
    </div>
  );
}

/** Registro de jogo: painel lateral com as jogadas, da mais antiga para a mais nova. */
function GameLogPanel({
  log,
  yourSide,
  you,
  opponent,
  onInspect,
  onClose,
}: {
  log: LogEntryView[];
  yourSide: Side;
  you: ArenaSide;
  opponent: ArenaSide;
  onInspect: Inspect;
  onClose: () => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const latest = log.at(-1)?.n ?? 0;
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [latest]);

  const nameOf = (side: Side) => (side === yourSide ? 'Você' : opponent.nickname);
  const otherOf = (side: Side) => (side === yourSide ? opponent.nickname : 'você');

  return (
    <aside className={styles.logPanel} aria-label="Registro de jogo">
      <PanelHead title="Registro de jogo" onClose={onClose} />
      {log.length === 0 ? (
        <p className={styles.logEmpty}>Nenhuma jogada ainda.</p>
      ) : (
        <ol ref={listRef} className={styles.logList}>
          {log.map((e, i) => (
            <li key={e.n} className={cx(styles.logItem, e.who === yourSide ? styles.logMine : styles.logTheirs)}>
              {(i === 0 || log[i - 1].turn !== e.turn) && <div className={styles.logTurn}>Turno {e.turn}</div>}
              <LogLine e={e} who={nameOf(e.who)} other={otherOf(e.who)} onInspect={onInspect} />
            </li>
          ))}
        </ol>
      )}
      <p className={styles.logFoot}>
        {you.nickname} × {opponent.nickname} · últimas jogadas da partida
      </p>
    </aside>
  );
}

/**
 * Atalhos e gestos da arena, mostrados no painel ⌨ Atalhos. Ao criar um atalho novo, liste-o aqui.
 * `keys`: as teclas (cada uma vira um <kbd>); `where`: onde fica o mouse ou o que fazer com ele.
 */
const SHORTCUTS: { group: string; items: { keys?: string[]; where: string; does: string }[] }[] = [
  {
    group: 'Teclado',
    items: [
      { keys: ['R'], where: 'com o mouse sobre o seu Deck', does: 'embaralha o Deck' },
      { keys: ['F'], where: 'com o mouse sobre o seu Deck', does: 'busca uma carta no Deck (embaralha depois)' },
      { keys: ['R'], where: 'com o mouse sobre a sua mão', does: 'devolve a mão inteira ao Deck e embaralha (sem confirmação)' },
      {
        keys: ['Shift', 'F'],
        where: 'com o mouse sobre a sua mão',
        does: 'devolve a mão inteira ao fundo do Deck, na ordem da mão, sem embaralhar',
      },
      { keys: ['T'], where: 'com o mouse sobre uma carta sua (mão, Vila, Campo, Chakra…)', does: 'põe a carta no topo do Deck, sem embaralhar' },
      { keys: ['F'], where: 'com o mouse sobre uma carta sua (mão, Vila, Campo, Chakra…)', does: 'põe a carta no fundo do Deck, sem embaralhar' },
      { keys: ['R'], where: 'com o mouse sobre um Ninja seu na Vila ou no Campo de Batalha', does: 'fere ou cura o Ninja (vira a carta)' },
      { keys: ['Alt'], where: 'segurando, com o mouse sobre uma carta (também na busca no deck)', does: 'mostra a carta ampliada' },    ],
  },
  {
    group: 'Mouse',
    items: [
      { where: 'Clicar no topo do seu Deck', does: 'compra 1 carta' },
      { where: 'Clicar numa carta', does: 'abre o detalhe (nas suas, com Descartar e os botões de mover)' },
      { where: 'Passar o mouse no nome de uma carta no Registro', does: 'mostra a carta ampliada ao lado' },
      { where: 'Arrastar uma carta sua', does: 'move entre as zonas' },
      { where: 'Soltar um Ninja sobre outro', does: 'forma um Time' },
      { where: 'Arrastar o topo do Deck para os Prêmios do oponente', does: 'envia a carta como Prêmio de Batalha' },
    ],
  },
];

/** Painel com as teclas de atalho e os gestos da arena (SHORTCUTS). */
function ShortcutsPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className={styles.logPanel} aria-label="Atalhos">
      <PanelHead title="Atalhos" onClose={onClose} />
      <div className={styles.keysBody}>
        {SHORTCUTS.map((g) => (
          <section key={g.group}>
            <h3 className={styles.logTurn}>{g.group}</h3>
            <ul className={styles.keysList}>
              {g.items.map((s, i) => (
                <li key={i} className={styles.keysItem}>
                  <span className={styles.keysWhen}>
                    {s.keys?.map((k) => (
                      <kbd key={k} className={styles.kbd}>
                        {k}
                      </kbd>
                    ))}
                    <span>{s.keys ? s.where : <b>{s.where}</b>}</span>
                  </span>
                  <span className={styles.keysDoes}>{s.does}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </aside>
  );
}

/* ── Seletor de tema ────────────────────────────────────────────────────── */

/**
 * Troca o tema da arena (fica fora da arena, no cabeçalho do site durante a partida). Vale só para quem
 * troca: a escolha fica neste navegador (`src/lib/arenaTheme.ts`) e o oponente continua com o tema dele.
 */
export function ArenaThemePicker({
  value,
  onChange,
  disabled,
}: {
  value: string | undefined;
  onChange: (theme: string) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className="flex items-center gap-2 rounded-lg py-1 pl-3 pr-1 text-sm text-muted ring-1 ring-border"
      title="Tema da arena (só para você; fica salvo neste navegador)"
    >
      <span aria-hidden>🎨</span>
      <span className="sr-only">Tema da arena</span>
      <select
        value={boardTheme(value).id}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-md bg-bg px-2 py-1 text-text outline-none hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
      >
        {BOARD_THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Arena ──────────────────────────────────────────────────────────────── */

/**
 * Ocupa a altura que o pai der (flex-1): quem usa a arena define a altura total da tela
 * (ver `ARENA_SCREEN`), assim barras extras acima dela não criam rolagem.
 */
export function GameArena({
  you,
  opponent,
  controls,
  turnNumber = 1,
  phase = 0,
  theme,
  fullscreenMenu,
  notice,
  log,
  yourSide = 'host',
  peek,
}: {
  you: ArenaSide;
  opponent: ArenaSide;
  controls?: ArenaControls;
  /** Número do turno da partida. */
  turnNumber?: number;
  /** Fase do turno (índice em `PHASES`). */
  phase?: number;
  /** Tema visual (id em `BOARD_THEMES`); sem tema, o padrão. */
  theme?: string;
  /**
   * Controles da partida (tema, encerrar, sair) para a tela cheia, quando o cabeçalho do site some: ficam
   * no menu ⋯ do canto superior direito da arena. Fora da tela cheia, o menu não aparece.
   */
  fullscreenMenu?: React.ReactNode;
  /** Aviso (ex.: erro da última jogada), mostrado ao lado do menu em tela cheia. */
  notice?: string | null;
  /** Registro de jogo (como este jogador o vê). Sem ele, o botão do registro não aparece. */
  log?: LogEntryView[];
  /** Seu lado na partida (para o registro dizer "Você" nas suas jogadas). */
  yourSide?: Side;
  /** O Prêmio que você olhou por último (`GameView.peek`), se ainda estiver na Área. */
  peek?: { owner: Side; index: number; card: CardInstance };
}) {
  const look = boardTheme(theme);
  const themeStyle = {
    ...look.vars,
    '--board-font': look.fontFamily,
    '--page-bg': look.pageBg,
    '--arena-border': look.arenaBorder,
    '--arena-bg': look.arenaBg,
    ...(look.zoneFillOpp ? { '--zone-fill-opp': look.zoneFillOpp } : {}),
    ...(look.zoneFillMine ? { '--zone-fill-mine': look.zoneFillMine } : {}),
  } as React.CSSProperties;
  const rootRef = useRef<HTMLDivElement>(null);
  const scale = useStageScale(rootRef);
  const [inspect, setInspect] = useState<{ card: Card; inst?: CardInstance } | null>(null);
  const [revealing, setRevealing] = useState(false);
  // Diálogo de olhar um Prêmio: de qual Área (pela sua perspectiva).
  const [peeking, setPeeking] = useState<'mine' | 'theirs' | null>(null);
  const arenaPeek: ArenaPeek | undefined = peek && {
    area: peek.owner === yourSide ? 'mine' : 'theirs',
    index: peek.index,
    card: peek.card,
  };
  const inspectCard: Inspect = (card, inst) => setInspect({ card, inst });
  // Carta sua na mesa (ou na mão): o detalhe ganha os botões de mover.
  const inspectZone = inspect?.inst && controls ? zoneOf(you.zones, inspect.inst.uid) : null;
  // A carta como está agora (as moedas mudam com o detalhe aberto).
  const inspectLive =
    inspect?.inst && inspectZone ? (you.zones[inspectZone].cards?.find((c) => c.uid === inspect.inst!.uid) ?? inspect.inst) : null;
  // Carta do oponente na mesa (ou sua, só vendo a partida): as moedas aparecem no detalhe, sem os botões.
  const inspectOther =
    inspect?.inst && !inspectLive
      ? ([you, opponent]
          .flatMap((s) => [...(s.zones.village.cards ?? []), ...(s.zones.battlefield.cards ?? [])])
          .find((c) => c.uid === inspect.inst!.uid) ?? null)
      : null;
  const flip = useLastFlip(log);
  const [list, setList] = useState<{ side: 'you' | 'opponent'; zone: ZoneName } | null>(null);
  const listSide = list ? (list.side === 'you' ? you : opponent) : null;
  const openMine = (zone: ZoneName) => setList({ side: 'you', zone });
  const openTheirs = (zone: ZoneName) => setList({ side: 'opponent', zone });
  const currentPhase = Math.max(0, Math.min(PHASES.length - 1, phase));
  const [hovered, setHovered] = useState<HoveredCard | null>(null);
  const [panel, setPanel] = useState<CornerPanel | null>(null);
  const togglePanel = (p: CornerPanel) => setPanel((cur) => (cur === p ? null : p));
  const unread = useUnread(log, panel === 'log');

  // Fim do arraste (soltou ou cancelou) ou clique sem arraste: esquece o que estava sendo arrastado.
  useEffect(() => {
    window.addEventListener('dragend', clearDragPayload, true);
    window.addEventListener('pointerup', clearDragPayload, true);
    return () => {
      window.removeEventListener('dragend', clearDragPayload, true);
      window.removeEventListener('pointerup', clearDragPayload, true);
    };
  }, []);

  return (
    <HoverContext.Provider value={setHovered}>
    <ControlsContext.Provider value={controls}>
    {/* Fonte do tema: o React move o <link> para o <head> (uma vez por endereço) e só carrega com a arena aberta. */}
    <link rel="stylesheet" href={look.fontHref} precedence="default" />
    <div ref={rootRef} className={styles.root} style={themeStyle} data-theme={look.id}>
      <div className={styles.box} style={{ width: STAGE_W * scale, height: STAGE_H * scale, visibility: scale ? 'visible' : 'hidden' }}>
        <div className={styles.stage} style={{ transform: `scale(${scale})` }}>
          <OpponentHand side={opponent} />
          <ZoneRow
            side={opponent}
            mine={false}
            onInspect={inspectCard}
            onOpenList={openTheirs}
            shuffleKey={lastShuffle(log, yourSide === 'host' ? 'guest' : 'host')}
            onOpenPeek={controls && (() => setPeeking('theirs'))}
            rewardControls={controls}
            rewardDrop={
              controls && {
                accept: [CARD_MIME, DECK_TOP_MIME],
                onDrop: (get) => controls.onGiveReward(get(CARD_MIME) || undefined),
                hint: 'Solte uma carta sua (ou o topo do seu Deck) como Prêmio de Batalha do oponente',
              }
            }
          />
          <Arena you={you} opponent={opponent} phase={currentPhase} controls={controls} onInspect={inspectCard} />
          <ZoneRow
            side={you}
            mine
            controls={controls}
            onInspect={inspectCard}
            onOpenList={openMine}
            onOpenReveal={controls && (() => setRevealing(true))}
            shuffleKey={lastShuffle(log, yourSide)}
            onOpenPeek={controls && (() => setPeeking('mine'))}
          />
          <Hand side={you} controls={controls} onInspect={inspectCard} />
          <div className={styles.rail}>
            <Plate side={opponent} mine={false} onOpenList={openTheirs} />
            <TurnPanel turnNumber={turnNumber} phase={currentPhase} you={you} opponent={opponent} controls={controls} />
            <Plate side={you} mine controls={controls} onOpenList={openMine} />
          </div>
        </div>
      </div>

      {/* Registro de jogo (fora do palco: o texto não encolhe com a escala). */}
      {/* Canto inferior direito: Atalhos e Registro; os painéis abrem no mesmo lugar, um de cada vez. */}
      <div className={styles.cornerTools}>
        {controls && (
          <button
            type="button"
            className={styles.logToggle}
            onClick={controls.onFlip}
            disabled={controls.busy}
            title="Jogar a Moeda Ninja [Flip]: o servidor sorteia Cara [Heads] ou Coroa [Tails], e os dois veem"
          >
            🪙 Moeda
          </button>
        )}
        <button
          type="button"
          className={cx(styles.logToggle, panel === 'keys' && styles.logToggleOpen)}
          onClick={() => togglePanel('keys')}
          aria-expanded={panel === 'keys'}
          title="Teclas de atalho e gestos da arena"
        >
          ⌨ Atalhos
        </button>
        {log && (
          <button
            type="button"
            className={cx(styles.logToggle, panel === 'log' && styles.logToggleOpen)}
            onClick={() => togglePanel('log')}
            aria-expanded={panel === 'log'}
            title="Registro de jogo"
          >
            📜 Registro
            {unread > 0 && <span className={styles.logUnread}>{unread > 99 ? '99+' : unread}</span>}
          </button>
        )}
      </div>
      {panel === 'log' && log && (
        <GameLogPanel
          log={log}
          yourSide={yourSide}
          you={you}
          opponent={opponent}
          onInspect={inspectCard}
          onClose={() => setPanel(null)}
        />
      )}
      {panel === 'keys' && <ShortcutsPanel onClose={() => setPanel(null)} />}

      {/* Resultado da Moeda Ninja, para os dois jogadores (some sozinho). */}
      {flip && (
        <div key={flip.n} className={styles.flipToast} role="status">
          <span className={styles.flipCoin} aria-hidden>
            🪙
          </span>
          <span>
            {flip.who === yourSide ? 'Você' : opponent.nickname} jogou a moeda:{' '}
            <b>{flip.result === 'heads' ? 'Cara' : 'Coroa'}</b>
            <small>{flip.result === 'heads' ? ' [Heads]' : ' [Tails]'}</small>
          </span>
        </div>
      )}

      {/* Tela cheia: os controles da partida num menu ⋯ (fora do palco, sem a escala). */}
      {(fullscreenMenu || notice) && (
        <div className={cx('fullscreen-only', styles.fsMenu)}>
          {notice && (
            <span className={styles.fsError} role="alert">
              {notice}
            </span>
          )}
          {fullscreenMenu && (
            <details>
              <summary aria-label="Menu da partida" title="Menu da partida">
                ⋯
              </summary>
              <div className={styles.fsMenuPanel}>{fullscreenMenu}</div>
            </details>
          )}
        </div>
      )}

      {/* Fora do palco: os diálogos não podem herdar a escala. */}
      {list && listSide && (
        <ZoneListDialog
          title={`${ZONE_LABEL[list.zone]} de ${listSide.nickname}`}
          zone={list.zone}
          cards={listSide.zones[list.zone].cards ?? []}
          controls={list.side === 'you' ? controls : undefined}
          onInspect={inspectCard}
          onClose={() => setList(null)}
        />
      )}
      {revealing && controls && (
        <RevealDialog deckCount={you.zones.deck.count} controls={controls} onClose={() => setRevealing(false)} />
      )}
      {peeking && controls && (
        <PeekRewardDialog
          area={peeking}
          count={(peeking === 'mine' ? you : opponent).zones.rewards.count}
          peek={arenaPeek}
          controls={controls}
          opponentName={opponent.nickname}
          onClose={() => setPeeking(null)}
        />
      )}
      <CardDetailModal
        card={inspect?.card ?? null}
        onClose={() => setInspect(null)}
        actions={
          inspectLive && inspectZone && controls ? (
            <>
              {(inspectZone === 'village' || inspectZone === 'battlefield') && (
                <CoinEditor inst={inspectLive} controls={controls} />
              )}
              <CardMoveActions
                card={inspect!.card}
                inst={inspectLive}
                zone={inspectZone}
                controls={controls}
                onDone={() => setInspect(null)}
              />
            </>
          ) : inspectOther?.coins ? (
            <CoinView coins={inspectOther.coins} />
          ) : undefined
        }
      />

      {/* Alt + mouse sobre uma carta: a carta ampliada, do lado oposto ao mouse (fora do palco, sem a escala). */}
      <CardZoom hovered={hovered} />
    </div>
    </ControlsContext.Provider>
    </HoverContext.Provider>
  );
}
