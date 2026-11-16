'use client';

import { createContext, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CardDetailModal } from '@/components/CardDetailModal';
import { Dialog } from '@/components/Dialog';
import { CARDS_BY_ID } from '@/data/cards';
import {
  BATTLEFIELD_MAX_TEAMS,
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
import { formatTeamPower, teamPower, type PowerLookup, type TeamPower } from '@/lib/game/teamPower';
import { cardImageUrl, isReinforcementCard, type Card } from '@/models/card';
import { useCardName } from '@/lib/cardLanguage';
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
   * Devolve a última carta da Área de Prêmios (`mine` = a sua, `theirs` = a do oponente) ao topo do Deck de
   * quem deu a carta.
   */
  onReturnReward: (area: 'mine' | 'theirs') => void;
  /** Aumenta (`delta` > 0) ou diminui o Poder do Time do Ninja `uid`. */
  onAdjustPower: (uid: string, delta: number) => void;
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

const isNinja = (cardId: string) => CARDS_BY_ID.get(cardId)?.type === 'ninja';

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

/** Carta sob o mouse (e onde o mouse está), para a ampliação com Alt. */
interface HoveredCard {
  card: Card;
  clientX: number;
}
const HoverContext = createContext<(hovered: HoveredCard | null) => void>(() => {});

/** Alt pressionado agora? (Soltar fora da janela também conta: perder o foco zera.) */
function useAltKey(): boolean {
  const [alt, setAlt] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Alt') return;
      e.preventDefault(); // no Windows, soltar o Alt sozinho ativaria o menu do navegador
      setAlt(e.type === 'keydown');
    };
    const move = (e: MouseEvent) => setAlt(e.altKey);
    const reset = () => setAlt(false);
    window.addEventListener('keydown', key);
    window.addEventListener('keyup', key);
    window.addEventListener('mousemove', move);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('keyup', key);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('blur', reset);
    };
  }, []);
  return alt;
}

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
  const card = CARDS_BY_ID.get(inst.cardId);
  const nameOf = useCardName();
  const setHovered = useContext(HoverContext);
  const open = () => (onClick ? onClick() : card && onInspect(card, inst));
  return (
    <div
      role="button"
      tabIndex={0}
      draggable={mine}
      onMouseEnter={(e) => card && setHovered({ card, clientX: e.clientX })}
      onMouseLeave={() => setHovered(null)}
      {...(mine ? dragSource(CARD_MIME, inst.uid, true) : {})}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
      title={card ? nameOf(card) : inst.cardId}
      className={cx(styles.card, mine && styles.mine, className)}
      style={{ width: w, height: h, ...style }}
    >
      {card && <img src={cardImageUrl(card, 'thumb')} alt={nameOf(card)} draggable={false} loading="lazy" />}
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
  return (
    <Dialog open onClose={onClose} title={title}>
      {cards.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma carta.</p>
      ) : (
        <ul className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto">
          {[...cards].reverse().map((c) => {
            const card = CARDS_BY_ID.get(c.cardId);
            return (
              <li key={c.uid} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => card && onInspect(card, c)}
                  className="w-12 shrink-0 overflow-hidden rounded ring-1 ring-border hover:ring-accent"
                  title={card ? nameOf(card) : c.cardId}
                >
                  {card ? (
                    <img src={cardImageUrl(card, 'thumb')} alt={nameOf(card)} className="aspect-[5/7] w-full object-cover" />
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

/* ── Times ──────────────────────────────────────────────────────────────── */

/** Quanto um Ninja de Apoio cobre o anterior (fração da largura), em pé e Ferido (design: 46 e 20 de 96). */
const SUPPORT_OVERLAP = 46 / 96;
const INJURED_OVERLAP = 20 / 96;
/** Deslocamento vertical do Apoio (design: 14 de 134), para baixo no seu lado e para cima no do oponente. */
const SUPPORT_DROP = 14 / 134;

/** Poder impresso de um Ninja do catálogo (Saudável e Ferido). */
const ninjaPower: PowerLookup = (cardId) => {
  const card = CARDS_BY_ID.get(cardId);
  return card?.type === 'ninja' ? card : undefined;
};

/** Dica do chip: a conta do Poder do Time (docs/REGRAS.md 3.5.4). */
function powerTitle(power: TeamPower, members: number): string {
  const [leader, ...supports] = power.parts;
  const mod = power.mod ? ` ${power.mod > 0 ? '+' : '−'} ${Math.abs(power.mod)} (ajuste)` : '';
  if (supports.length === 0) {
    return power.mod ? `Poder: ${leader} (Combate do Ninja)${mod} = ${formatTeamPower(power)}` : `Poder: ${leader} (Combate do Ninja)`;
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
  const ninja = isNinja(inst.cardId);
  const accepts = !!controls && ninja;
  const leader = index === 0;
  const roleClass = leader ? (mine ? styles.leaderMine : styles.leaderOpp) : styles.support;
  return (
    <div
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
      {mine && controls && ninja && (
        <div className={styles.memberTools}>
          {inTeam && !leader && (
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
          )}
          <button
            type="button"
            className={styles.tool}
            onClick={() => controls.onSetInjured(inst.uid, !inst.injured)}
            disabled={controls.busy}
            title={inst.injured ? 'Curar: voltar ao Estado Saudável' : 'Ferir: Estado Ferido (carta na horizontal)'}
            aria-label={inst.injured ? 'Curar Ninja' : 'Ferir Ninja'}
          >
            {inst.injured ? '↺' : '↻'}
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
            className={cx(styles.teamCount, power.mod > 0 && styles.powerUp, power.mod < 0 && styles.powerDown)}
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
}

function DeckZone({ side, mine, controls, onOpenReveal }: RowProps) {
  const drop = useDrop('deck', controls);
  const count = side.zones.deck.count;
  const ty = mine ? -1 : 1; // as camadas sobem no seu lado e descem no do oponente
  return (
    <div
      {...drop.handlers}
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
            className={cx(styles.back, styles.deckTop, controls && styles.drawable)}
            title={
              controls
                ? 'Clique para comprar 1 carta · arraste o topo para os Prêmios do oponente'
                : 'Face para baixo: dá para contar, não para ver'
            }
          />
        </div>
      )}
      <div className={styles.pill}>{count}</div>
      {controls && (
        <div className={styles.deckTools}>
          <button
            type="button"
            className={styles.tool}
            onClick={controls.onShuffle}
            disabled={controls.busy || count < 2}
            title="Embaralhar o deck"
            aria-label="Embaralhar o deck"
          >
            ⇄
          </button>
          <button
            type="button"
            className={styles.tool}
            onClick={controls.onSearch}
            disabled={controls.busy || count === 0}
            title="Buscar uma carta no deck (embaralha depois)"
            aria-label="Buscar uma carta no deck"
          >
            ⌕
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
      {/* Ao lado da carta: a do topo vai como Prêmio de Batalha do oponente (o mesmo que arrastar o topo). */}
      {controls && (
        <button
          type="button"
          className={cx(styles.tool, styles.deckReward)}
          onClick={() => controls.onGiveReward()}
          disabled={controls.busy || count === 0}
          title="Enviar a carta do topo do Deck para os Prêmios do oponente (face para baixo)"
          aria-label="Enviar a carta do topo do Deck para os Prêmios do oponente"
        >
          🏆
        </button>
      )}
      {/* Logo abaixo do seu Deck (fora do arco da mão): devolver a mão ao Deck, com confirmação. */}
      {controls && (
        <button
          type="button"
          className={styles.returnHand}
          onClick={() => {
            const n = side.zones.hand.count;
            const cards = n === 1 ? '1 carta' : `${n} cartas`;
            if (confirm(`Devolver a mão inteira (${cards}) ao Deck e embaralhar? Depois você compra as novas cartas.`)) {
              controls.onReturnHand();
            }
          }}
          disabled={controls.busy || side.zones.hand.count === 0}
          title="Mulligan: devolve todas as cartas da mão ao Deck e embaralha (pede confirmação)"
        >
          ↩ Mão → Deck
        </button>
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

function RewardZone({ side, mine, controls, rewardDrop }: RowProps) {
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
      {controls && count > 0 && (
        <div className={styles.deckTools}>
          <button
            type="button"
            className={styles.tool}
            onClick={() => controls.onReturnReward(mine ? 'mine' : 'theirs')}
            disabled={controls.busy}
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
  const typeOf = (c: CardInstance) => CARDS_BY_ID.get(c.cardId)?.type;
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
  const teams = (side: ArenaSide) => countTeams(side.zones.battlefield.cards ?? [], isNinja);
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
  const stacks = stackByCard(side.zones.hand.cards ?? []);
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

  return (
    <div
      ref={ref}
      {...drop.handlers}
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
function stackByCard(cards: readonly CardInstance[]): { top: CardInstance; count: number }[] {
  const stacks = new Map<string, { top: CardInstance; count: number }>();
  for (const c of cards) {
    const s = stacks.get(c.cardId);
    if (s) s.count++;
    else stacks.set(c.cardId, { top: c, count: 1 });
  }
  const rank = (cardId: string) => HAND_TYPE_ORDER[CARDS_BY_ID.get(cardId)?.type ?? ''] ?? 4;
  // sort é estável: dentro do mesmo tipo, mantém a ordem de chegada.
  return [...stacks.values()].sort((a, b) => rank(a.top.cardId) - rank(b.top.cardId));
}

/* ── Coluna de informações (à esquerda) ─────────────────────────────────── */

function Pips({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div className={styles.bar}>
      <div className={styles.barHead}>
        <span>{label}</span>
        <b>
          {value}/{max}
        </b>
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
      <Pips label="Marcador" value={side.turn} max={TURN_MAX} />
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
  const card = (cardId: string | undefined) => {
    const c = cardId ? CARDS_BY_ID.get(cardId) : undefined;
    if (!c) return <b>{cardId ?? 'carta'}</b>;
    return (
      <button type="button" className={styles.logCard} onClick={() => onInspect(c)} title="Ver a carta">
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
    case 'returnHand':
      text = e.hidden ? (
        <>
          devolveu {e.count === 1 ? '1 carta' : `${e.count ?? 'as'} cartas`} da mão ao Deck e embaralhou
        </>
      ) : (
        <>
          devolveu a mão ao Deck e embaralhou:{' '}
          {(e.cards ?? []).map((id, i) => (
            <span key={i}>
              {i > 0 && ', '}
              {card(id)}
            </span>
          ))}
        </>
      );
      break;
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
    case 'returnReward':
      text =
        e.owner === e.who ? (
          <>devolveu um Prêmio de Batalha ao topo do Deck de {other}</>
        ) : (
          <>pegou de volta um Prêmio de Batalha dado a {other} (foi para o topo do Deck)</>
        );
      break;
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

/**
 * Registro de jogo: botão no canto inferior direito da arena (com o número de jogadas novas) que abre um
 * painel lateral com as jogadas, da mais antiga para a mais nova.
 */
function GameLog({
  log,
  yourSide,
  you,
  opponent,
  onInspect,
}: {
  log: LogEntryView[];
  yourSide: Side;
  you: ArenaSide;
  opponent: ArenaSide;
  onInspect: Inspect;
}) {
  const [open, setOpen] = useState(false);
  const latest = log.at(-1)?.n ?? 0;
  // Jogadas já vistas: as que existiam ao abrir a tela não contam como novas.
  const [seen, setSeen] = useState(latest);
  const unread = open ? 0 : log.filter((e) => e.n > seen).length;
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!open) return;
    setSeen(latest);
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [open, latest]);

  const nameOf = (side: Side) => (side === yourSide ? 'Você' : opponent.nickname);
  const otherOf = (side: Side) => (side === yourSide ? opponent.nickname : 'você');

  return (
    <>
      <button
        type="button"
        className={cx(styles.logToggle, open && styles.logToggleOpen)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        title="Registro de jogo"
      >
        📜 Registro
        {unread > 0 && <span className={styles.logUnread}>{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <aside className={styles.logPanel} aria-label="Registro de jogo">
          <div className={styles.logHead}>
            <span>Registro de jogo</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar o registro" className={styles.logClose}>
              ✕
            </button>
          </div>
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
      )}
    </>
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
  const inspectCard: Inspect = (card, inst) => setInspect({ card, inst });
  // Carta sua na mesa (ou na mão): o detalhe ganha os botões de mover.
  const inspectZone = inspect?.inst && controls ? zoneOf(you.zones, inspect.inst.uid) : null;
  const [list, setList] = useState<{ side: 'you' | 'opponent'; zone: ZoneName } | null>(null);
  const listSide = list ? (list.side === 'you' ? you : opponent) : null;
  const openMine = (zone: ZoneName) => setList({ side: 'you', zone });
  const openTheirs = (zone: ZoneName) => setList({ side: 'opponent', zone });
  const currentPhase = Math.max(0, Math.min(PHASES.length - 1, phase));
  const [hovered, setHovered] = useState<HoveredCard | null>(null);
  const alt = useAltKey();
  const nameOf = useCardName();
  const zoomed = alt && hovered ? hovered : null;

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
      {log && <GameLog log={log} yourSide={yourSide} you={you} opponent={opponent} onInspect={inspectCard} />}

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
      <CardDetailModal
        card={inspect?.card ?? null}
        onClose={() => setInspect(null)}
        actions={
          inspect?.inst && inspectZone && controls ? (
            <CardMoveActions
              card={inspect.card}
              inst={inspect.inst}
              zone={inspectZone}
              controls={controls}
              onDone={() => setInspect(null)}
            />
          ) : undefined
        }
      />

      {/* Alt + mouse sobre uma carta: a carta ampliada, do lado oposto ao mouse (fora do palco, sem a escala). */}
      {zoomed && (
        <img
          src={cardImageUrl(zoomed.card, 'full')}
          alt={nameOf(zoomed.card)}
          className={cx(styles.zoom, zoomed.clientX < window.innerWidth / 2 ? styles.zoomRight : styles.zoomLeft)}
          draggable={false}
        />
      )}
    </div>
    </HoverContext.Provider>
  );
}
