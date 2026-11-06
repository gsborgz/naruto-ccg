'use client';

import { useState } from 'react';
import { CardDetailModal } from '@/components/CardDetailModal';
import { Dialog } from '@/components/Dialog';
import { CARDS_BY_ID } from '@/data/cards';
import {
  BATTLEFIELD_MAX_TEAMS,
  countTeams,
  TEAM_MAX,
  teamGroups,
  type CardInstance,
  type SideView,
  type ZoneName,
} from '@/lib/game/state';
import { cardImageUrl, type Card } from '@/models/card';

/**
 * Arena da partida: uma mesa com os dois Painéis de Jogo frente a frente (docs/REGRAS.md, "Painel de Jogo").
 *
 * - Embaixo fica o seu painel, como no painel impresso: Campo de Batalha virado para o oponente,
 *   Prêmios de Batalha à esquerda, Vila no centro, Deck / Descartes / Chakra à direita.
 * - Em cima fica o painel do oponente, espelhado como se ele estivesse do outro lado da mesa.
 * - As mãos ficam nas bordas da mesa (a sua embaixo, em leque; a do oponente em cima, virada para baixo).
 * - Baralho de Reforço e Removidos de Jogo (fora do painel impresso) ficam ao lado da mão.
 *
 * Você arrasta as SUAS cartas entre as SUAS zonas; o servidor confere e devolve o novo estado.
 * Cartas que você não pode ver (mão do oponente, Deck, Prêmios) chegam só como contagem.
 *
 * O tamanho das cartas acompanha a altura de cada painel (unidades `cqh` de container query).
 */

/** Classes do contêiner de uma tela de partida: altura exata da janela (sem rolagem) no desktop. */
export const ARENA_SCREEN = 'flex flex-col gap-2 lg:h-[calc(100dvh-var(--app-chrome))]';

export interface ArenaSide {
  nickname: string;
  zones: SideView;
  /** Posição do Marcador de Turnos. */
  turn: number;
}

/** Ações do jogador sobre as próprias cartas. Sem isto, a arena é só para ver. */
export interface ArenaControls {
  onMove: (uid: string, to: ZoneName) => void;
  onDraw: () => void;
  onShuffle: () => void;
  /** Abre a busca de uma carta no deck (quem usa a arena mostra o diálogo). */
  onSearch: () => void;
  /** Junta o Ninja `uid` ao Time do Ninja `target` (soltar uma carta sobre a outra). */
  onJoinTeam: (uid: string, target: string) => void;
  /** Move o Time inteiro do Ninja `uid` (arrastar pela alça do Time). */
  onMoveTeam: (uid: string, to: ZoneName) => void;
  /** Torna o Ninja `uid` o Líder do Time dele. */
  onSetLeader: (uid: string) => void;
  /** Manda uma carta sua para os Prêmios do OPONENTE (sem `uid`: o topo do seu Deck). */
  onGiveReward: (uid?: string) => void;
  busy?: boolean;
}

/** Arrastar uma carta (o uid dela) / um Time inteiro (o uid de um membro). */
const CARD_MIME = 'application/x-naruto-ccg-card';
const TEAM_MIME = 'application/x-naruto-ccg-team';
/** Arrastar o topo do seu Deck (sem revelar qual carta é). */
const DECK_TOP_MIME = 'application/x-naruto-ccg-deck-top';

const isNinja = (cardId: string) => CARDS_BY_ID.get(cardId)?.type === 'ninja';

/** Casas do Indicador de Turnos (o marcador começa em 0). */
const TURN_SLOTS = 11;

const PHASES = ['Inicial', 'Missão', 'Organização', 'Batalha', 'Final'] as const;

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

/** Largura das cartas na mesa: proporcional à altura do painel (container `mat`). */
const TABLE_CARD = 'w-[clamp(2.25rem,21cqh,6.5rem)]';
/** Cartas da Vila: a área mais alta do painel, então cartas maiores. */
const VILLAGE_CARD = 'w-[clamp(2.75rem,27cqh,8rem)]';
/** Largura das cartas na sua mão: proporcional à altura da janela (variável usada também na sobreposição). */
const HAND_CARD_WIDTH = 'clamp(3rem,9.5vh,6.25rem)';
const HAND_CARD = 'w-[var(--hand-w)]';

/** Hover das cartas na mesa: sobem um pouco. */
const TABLE_HOVER = 'hover:z-10 hover:-translate-y-1';
/** Hover das cartas na mão: sobem e crescem bastante, por cima de tudo (crescem a partir da base). */
const HAND_HOVER = 'origin-bottom hover:z-50 hover:-translate-y-[18%] hover:scale-[1.7]';

/**
 * Quanto cada carta da mão cobre a anterior (fração da largura): pouco com mão pequena,
 * mais conforme a mão cresce, para caber sem barra de rolagem.
 */
function handOverlap(n: number): number {
  return Math.min(0.72, 0.18 + Math.max(0, n - 6) * 0.06);
}

/** Liga uma área como destino de arrastar (só nas suas zonas). */
function useDrop(to: ZoneName, controls: ArenaControls | undefined) {
  const [over, setOver] = useState(false);
  if (!controls) return { over: false, handlers: {} };
  return {
    over,
    handlers: {
      onDragOver: (e: React.DragEvent) => {
        const types = e.dataTransfer.types;
        if (!types.includes(CARD_MIME) && !types.includes(TEAM_MIME)) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      },
      onDrop: (e: React.DragEvent) => {
        setOver(false);
        const team = e.dataTransfer.getData(TEAM_MIME);
        const uid = e.dataTransfer.getData(CARD_MIME);
        if (!team && !uid) return;
        e.preventDefault();
        if (team) controls.onMoveTeam(team, to);
        else controls.onMove(uid, to);
      },
    },
  };
}

interface CustomDrop {
  /** Tipos de arraste aceitos (CARD_MIME, DECK_TOP_MIME…). */
  accept: string[];
  onDrop: (data: DataTransfer) => void;
  /** Dica mostrada ao passar por cima. */
  hint?: string;
}

/** Destino de arrastar com tratamento próprio (ex.: Prêmios do oponente). */
function useCustomDrop(drop: CustomDrop | undefined) {
  const [over, setOver] = useState(false);
  if (!drop) return { over: false, handlers: {} };
  return {
    over,
    handlers: {
      onDragOver: (e: React.DragEvent) => {
        if (!drop.accept.some((t) => e.dataTransfer.types.includes(t))) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      },
      onDragLeave: (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      },
      onDrop: (e: React.DragEvent) => {
        setOver(false);
        if (!drop.accept.some((t) => e.dataTransfer.types.includes(t))) return;
        e.preventDefault();
        drop.onDrop(e.dataTransfer);
      },
    },
  };
}

/** Uma carta virada para cima. Arrastável se for sua; clique abre o detalhe. */
function ArenaCard({
  inst,
  draggable,
  onInspect,
  sizeClass = TABLE_CARD,
  hoverClass = TABLE_HOVER,
  className = '',
  style,
}: {
  inst: CardInstance;
  draggable: boolean;
  onInspect: (card: Card) => void;
  sizeClass?: string;
  hoverClass?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const card = CARDS_BY_ID.get(inst.cardId);
  return (
    <div
      role="button"
      tabIndex={0}
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData(CARD_MIME, inst.uid);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={() => card && onInspect(card)}
      onKeyDown={(e) => e.key === 'Enter' && card && onInspect(card)}
      title={card?.name ?? inst.cardId}
      style={style}
      className={`${sizeClass} relative shrink-0 overflow-hidden rounded-[6%/4.3%] shadow-[0_2px_6px_rgb(0_0_0/0.5)] ring-1 ring-black/40 transition duration-150 hover:ring-2 hover:ring-accent ${hoverClass} ${
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      } ${className}`}
    >
      {card ? (
        <img
          src={cardImageUrl(card, 'thumb')}
          alt={card.name}
          draggable={false}
          loading="lazy"
          className="aspect-[5/7] w-full object-cover"
        />
      ) : (
        <div className="aspect-[5/7] w-full bg-surface-2" />
      )}
    </div>
  );
}

/** Verso de carta. */
function CardBack({ sizeClass = TABLE_CARD, className = '' }: { sizeClass?: string; className?: string }) {
  return (
    <div
      className={`${sizeClass} grid aspect-[5/7] shrink-0 place-items-center rounded-[6%/4.3%] border border-accent/50 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--color-accent)_35%,transparent),transparent_60%),linear-gradient(135deg,#2b1d14,#14161d)] shadow-[0_2px_6px_rgb(0_0_0/0.5)] ${className}`}
    >
      <span className="text-[clamp(0.7rem,40%,1.6rem)] text-accent/80">忍</span>
    </div>
  );
}

/** Marca d'água com o nome da zona (some atrás das cartas). */
function Watermark({ label, en }: { label: string; en: string }) {
  return (
    <span
      className="pointer-events-none absolute inset-0 grid place-items-center text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white/[0.09] select-none"
      title={`${label} [${en}]`}
    >
      {label}
    </span>
  );
}

function Badge({ n, title }: { n: number; title?: string }) {
  return (
    <span
      title={title}
      className="absolute -bottom-1.5 -right-1.5 z-10 min-w-6 rounded-full bg-bg px-1.5 text-center font-mono text-[11px] font-bold leading-5 text-text ring-1 ring-border"
    >
      {n}
    </span>
  );
}

/**
 * Espaço do tamanho de uma carta para uma pilha (Deck, Descartes, Prêmios): contorno quando vazio,
 * verso empilhado ou a carta de cima quando tem cartas, e a contagem no canto.
 */
function PileSlot({
  zone,
  label,
  en,
  count,
  top,
  faceDown,
  controls,
  mine,
  onInspect,
  onOpen,
  customDrop,
  dragTop,
  children,
}: {
  zone: ZoneName;
  label: string;
  en: string;
  count: number;
  /** Carta de cima, se for visível (Descartes). */
  top?: CardInstance;
  faceDown?: boolean;
  controls?: ArenaControls;
  mine: boolean;
  onInspect: (card: Card) => void;
  /** Clique na pilha abre a lista (Descartes). */
  onOpen?: () => void;
  /** Recebe cartas soltas aqui de outro jeito que "mover para esta zona" (Prêmios do oponente). */
  customDrop?: CustomDrop;
  /** A pilha pode ser arrastada (o topo do seu Deck). */
  dragTop?: boolean;
  children?: React.ReactNode;
}) {
  const zoneDrop = useDrop(zone, customDrop ? undefined : controls);
  const custom = useCustomDrop(customDrop);
  const drop = customDrop ? custom : zoneDrop;
  return (
    <div
      className="flex flex-col items-center gap-1"
      title={
        customDrop?.hint ??
        (dragTop ? `${label} [${en}]: arraste o topo para os Prêmios do oponente` : `${label} [${en}]`)
      }
    >
      <div
        {...drop.handlers}
        draggable={dragTop && count > 0}
        onDragStart={
          dragTop
            ? (e) => {
                e.dataTransfer.setData(DECK_TOP_MIME, '1');
                e.dataTransfer.effectAllowed = 'move';
              }
            : undefined
        }
        className={`relative rounded-[6%/4.3%] ${drop.over ? 'ring-2 ring-accent ring-offset-2 ring-offset-transparent' : ''} ${
          dragTop && count > 0 ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        {count === 0 ? (
          <div
            className={`${TABLE_CARD} grid aspect-[5/7] place-items-center rounded-[6%/4.3%] border border-dashed border-white/15 bg-black/10 p-1 text-center text-[9px] font-bold uppercase tracking-widest text-white/25`}
          >
            {label}
          </div>
        ) : top && !faceDown ? (
          <div onClick={onOpen} className="relative">
            {count > 1 && <CardBack className="absolute left-[3px] top-[3px] opacity-60" />}
            <ArenaCard inst={top} draggable={mine} onInspect={onOpen ? () => onOpen() : onInspect} className="relative" />
          </div>
        ) : (
          <div className="relative">
            {count > 2 && <CardBack className="absolute left-[4px] top-[4px] opacity-50" />}
            {count > 1 && <CardBack className="absolute left-[2px] top-[2px] opacity-75" />}
            <CardBack className="relative" />
          </div>
        )}
        {count > 0 && <Badge n={count} title={faceDown ? 'Face para baixo: dá para contar, não para ver' : undefined} />}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-widest text-white/35">{label}</span>
      {children}
    </div>
  );
}

/**
 * Ninja na Vila / Campo de Batalha: além de arrastável, recebe outra carta solta em cima dele
 * para formar (ou aumentar) um Time.
 */
function TeamCard({
  inst,
  controls,
  mine,
  onInspect,
  leader,
  inTeam,
  sizeClass,
}: {
  inst: CardInstance;
  controls?: ArenaControls;
  mine: boolean;
  onInspect: (card: Card) => void;
  leader: boolean;
  inTeam: boolean;
  sizeClass?: string;
}) {
  const [over, setOver] = useState(false);
  const accepts = !!controls && isNinja(inst.cardId);
  return (
    <div
      className={`relative rounded-[6%/4.3%] transition ${over ? 'scale-105 ring-2 ring-accent ring-offset-2 ring-offset-bg' : ''}`}
      onDragOver={(e) => {
        if (!accepts || !e.dataTransfer.types.includes(CARD_MIME)) return;
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setOver(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver(false);
      }}
      onDrop={(e) => {
        setOver(false);
        if (!accepts) return;
        const uid = e.dataTransfer.getData(CARD_MIME);
        if (!uid) return;
        e.preventDefault();
        e.stopPropagation(); // não deixa a zona tratar como "mover para a zona"
        if (uid !== inst.uid) controls!.onJoinTeam(uid, inst.uid);
      }}
      title={accepts ? 'Solte outro Ninja aqui para formar um Time' : undefined}
    >
      <ArenaCard inst={inst} draggable={mine} onInspect={onInspect} sizeClass={sizeClass} />
      {inTeam && leader && (
        <span
          className="pointer-events-none absolute -left-1 -top-1 z-10 rounded-full bg-accent px-1.5 text-[9px] font-black leading-4 text-bg shadow"
          title="Ninja Líder [Head Ninja]"
        >
          LÍDER
        </span>
      )}
      {inTeam && !leader && mine && controls && (
        <button
          type="button"
          onClick={() => controls.onSetLeader(inst.uid)}
          disabled={controls.busy}
          className="absolute -left-1 -top-1 z-10 grid size-5 place-items-center rounded-full bg-black/70 text-[10px] text-accent ring-1 ring-accent/60 hover:bg-accent hover:text-bg"
          title="Tornar Ninja Líder"
          aria-label="Tornar Ninja Líder"
        >
          ★
        </button>
      )}
    </div>
  );
}

/** Um Time: Ninjas juntos numa moldura, com alça para arrastar o Time inteiro. Ninja sozinho = Time de 1. */
function TeamGroup({
  group,
  controls,
  mine,
  onInspect,
  sizeClass,
}: {
  group: CardInstance[];
  controls?: ArenaControls;
  mine: boolean;
  onInspect: (card: Card) => void;
  sizeClass?: string;
}) {
  const inTeam = group.length > 1;
  const cards = group.map((c, i) => (
    <TeamCard
      key={c.uid}
      inst={c}
      controls={controls}
      mine={mine}
      onInspect={onInspect}
      leader={i === 0}
      inTeam={inTeam}
      sizeClass={sizeClass}
    />
  ));
  if (!inTeam) return <>{cards}</>;
  return (
    <div className="relative flex items-end gap-1 rounded-xl bg-accent/[0.07] p-1.5 ring-1 ring-accent/35">
      {/*
        Selo na borda de BAIXO (não ocupa altura e não cobre os selos LÍDER/★, que ficam no topo de cada
        carta): é também a alça para arrastar o Time inteiro.
      */}
      <div
        draggable={mine}
        onDragStart={(e) => {
          e.dataTransfer.setData(TEAM_MIME, group[0].uid);
          e.dataTransfer.effectAllowed = 'move';
        }}
        className={`absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-bg px-2 text-[9px] font-bold uppercase leading-4 tracking-widest text-accent ring-1 ring-accent/50 ${
          mine ? 'cursor-grab hover:bg-accent hover:text-bg active:cursor-grabbing' : ''
        }`}
        title={mine ? 'Arraste por aqui para mover o Time inteiro' : 'Time [Team]'}
      >
        {mine && <span aria-hidden>⠿</span>}
        Time {group.length}/{TEAM_MAX}
      </div>
      {cards}
    </div>
  );
}

/** Área larga (Vila, Campo de Batalha, Chakra): cartas lado a lado sobre a mesa. */
function SpreadZone({
  zone,
  label,
  en,
  cards,
  controls,
  mine,
  onInspect,
  className = '',
  style,
  stacked,
  cardSize = TABLE_CARD,
}: {
  zone: ZoneName;
  label: string;
  en: string;
  cards: CardInstance[] | undefined;
  controls?: ArenaControls;
  mine: boolean;
  onInspect: (card: Card) => void;
  className?: string;
  style?: React.CSSProperties;
  /** Cartas sobrepostas em leque, numa linha só (zonas estreitas, como o Chakra). */
  stacked?: boolean;
  /** Tamanho das cartas nesta zona (padrão: o da mesa). */
  cardSize?: string;
}) {
  const drop = useDrop(zone, controls);
  const teamsHere = zone === 'village' || zone === 'battlefield';
  return (
    <section
      aria-label={label}
      style={style}
      {...drop.handlers}
      className={`relative min-h-0 min-w-0 rounded-xl transition-colors ${
        drop.over ? 'bg-accent/15 ring-2 ring-accent/70' : ''
      } ${className}`}
    >
      {!cards?.length && <Watermark label={label} en={en} />}
      {!!cards?.length &&
        (stacked ? (
          <div className="flex h-full w-full items-center justify-center overflow-hidden p-2">
            {cards.map((c, i) => (
              <ArenaCard
                key={c.uid}
                inst={c}
                draggable={mine}
                onInspect={onInspect}
                className={i > 0 ? '-ml-[clamp(1.5rem,15cqh,4.5rem)]' : ''}
              />
            ))}
          </div>
        ) : teamsHere ? (
          // O Campo de Batalha tem no máximo 3 Times numa linha: sem rolagem (o selo do Time pode passar da borda).
          <div
            className={`flex h-full w-full flex-wrap content-center items-center justify-center gap-x-2.5 gap-y-4 px-2 ${
              zone === 'battlefield' ? 'overflow-visible py-1' : 'overflow-auto pb-3 pt-3'
            }`}
          >
            {teamGroups(cards).map((group) => (
              <TeamGroup
                key={group[0].uid}
                group={group}
                controls={controls}
                mine={mine}
                onInspect={onInspect}
                sizeClass={cardSize}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full flex-wrap content-center items-center justify-center gap-1.5 overflow-auto p-2">
            {cards.map((c) => (
              <ArenaCard key={c.uid} inst={c} draggable={mine} onInspect={onInspect} />
            ))}
          </div>
        ))}
      {zone === 'battlefield' && !!cards?.length && (
        <span
          className="absolute left-2 top-1.5 rounded-full bg-black/40 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/50"
          title={`Até ${BATTLEFIELD_MAX_TEAMS} Times enviados à Batalha por turno`}
        >
          Times {countTeams(cards, isNinja)}/{BATTLEFIELD_MAX_TEAMS}
        </span>
      )}
    </section>
  );
}

function IconButton({ label, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      title={label}
      className="grid size-6 place-items-center rounded-full bg-black/50 font-mono text-[11px] font-bold text-text ring-1 ring-white/15 hover:bg-accent hover:text-bg disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Marcador de Turnos compacto: trilha de casas com a atual destacada. */
function TurnTrack({ turn }: { turn: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Indicador de Turnos: ${turn}`} title="Indicador de Turnos [Turn Indicator]">
      <span className="text-[9px] font-semibold uppercase tracking-widest text-white/40">Turno</span>
      <ol className="flex items-center gap-[3px]">
        {Array.from({ length: TURN_SLOTS }, (_, i) => (
          <li
            key={i}
            className={
              i === turn
                ? 'grid size-5 place-items-center rounded-full bg-accent font-mono text-[10px] font-bold text-bg shadow-[0_0_8px_var(--color-accent)]'
                : `size-1.5 rounded-full ${i < turn ? 'bg-accent/60' : 'bg-white/20'}`
            }
          >
            {i === turn ? i : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Lista de uma zona (Descartes, Reforço, Removidos) com botões para mover as suas cartas. */
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
  onInspect: (card: Card) => void;
  onClose: () => void;
}) {
  const targets = (['hand', 'village', 'battlefield', 'chakra', 'discard', 'deck'] as const).filter((t) => t !== zone);
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
                <ArenaCard inst={c} draggable={false} onInspect={onInspect} sizeClass="w-12" />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-medium">{card?.name ?? c.cardId}</span>
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

/** O painel de um jogador sobre a mesa. `flipped` = oponente (espelhado). `controls` só no seu. */
function PlayerMat({
  side,
  flipped,
  controls,
  onInspect,
  onOpenList,
  rewardDrop,
}: {
  side: ArenaSide;
  flipped: boolean;
  controls?: ArenaControls;
  onInspect: (card: Card) => void;
  onOpenList: (zone: ZoneName) => void;
  /** Só no painel do oponente: você solta aqui uma carta sua (ou o topo do seu Deck) como Prêmio dele. */
  rewardDrop?: CustomDrop;
}) {
  const z = side.zones;
  const mine = !!controls;

  // Espelhar = inverter linhas e colunas, mantendo o texto de pé.
  const areas = flipped
    ? `"piles village reward" "battle battle battle"`
    : `"battle battle battle" "reward village piles"`;
  const columns = flipped ? 'auto minmax(0,1fr) auto' : 'auto minmax(0,1fr) auto';
  const rows = flipped ? 'minmax(0,1.35fr) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1.35fr)';

  const deckButtons = controls && (
    <div className="flex gap-1">
      <IconButton label="Comprar 1 carta" onClick={controls.onDraw} disabled={controls.busy || z.deck.count === 0}>
        +1
      </IconButton>
      <IconButton label="Embaralhar o deck" onClick={controls.onShuffle} disabled={controls.busy || z.deck.count < 2}>
        ⇄
      </IconButton>
      <IconButton
        label="Buscar uma carta no deck (embaralha depois)"
        onClick={controls.onSearch}
        disabled={controls.busy || z.deck.count === 0}
      >
        ⌕
      </IconButton>
    </div>
  );

  return (
    <div
      className="grid min-h-[18rem] flex-1 gap-x-3 gap-y-2 px-3 py-2 [container-type:size] lg:min-h-0"
      style={{ gridTemplateAreas: areas, gridTemplateColumns: columns, gridTemplateRows: rows }}
      aria-label={mine ? 'Seu painel' : `Painel de ${side.nickname}`}
    >
      {/* G — Campo de Batalha: encosta no do oponente, no meio da mesa. */}
      <SpreadZone
        zone="battlefield"
        label="Campo de Batalha"
        en="Battlefield"
        cards={z.battlefield.cards}
        controls={controls}
        mine={mine}
        onInspect={onInspect}
        style={{ gridArea: 'battle' }}
        className="bg-gradient-to-b from-danger/10 to-danger/5 ring-1 ring-danger/20"
      />

      {/* A — Prêmios de Batalha (face para baixo; 10 vence). */}
      <div style={{ gridArea: 'reward' }} className="flex items-center">
        {/* Ninguém coloca cartas nos próprios Prêmios: eles vêm do Deck do oponente (docs/REGRAS.md 3.5.4). */}
        <PileSlot
          zone="rewards"
          label="Prêmios"
          en="Battle Reward Area"
          count={z.rewards.count}
          faceDown
          mine={mine}
          onInspect={onInspect}
          customDrop={rewardDrop}
        />
      </div>

      {/* E — Vila: Ninjas, Clientes e Missões Permanentes. */}
      <SpreadZone
        zone="village"
        label="Vila"
        en="Village"
        cards={z.village.cards}
        controls={controls}
        mine={mine}
        onInspect={onInspect}
        style={{ gridArea: 'village' }}
        cardSize={VILLAGE_CARD}
        className="bg-white/[0.025] ring-1 ring-white/[0.06]"
      />

      {/* B, C, D — Deck, Descartes e Chakra (espelhados no oponente). */}
      <div
        style={{ gridArea: 'piles' }}
        className={`flex min-h-0 items-stretch gap-3 ${flipped ? 'flex-row-reverse' : ''}`}
      >
        <SpreadZone
          zone="chakra"
          label="Chakra"
          en="Chakra Area"
          cards={z.chakra.cards}
          controls={controls}
          mine={mine}
          onInspect={onInspect}
          stacked
          className="w-[clamp(6rem,40cqh,14rem)] bg-sky-500/[0.06] ring-1 ring-sky-400/15"
        />
        <div className={`flex items-center gap-3 ${flipped ? 'flex-row-reverse' : ''}`}>
          <PileSlot
            zone="discard"
            label="Descartes"
            en="Discard Pile"
            count={z.discard.count}
            top={z.discard.cards?.at(-1)}
            controls={controls}
            mine={mine}
            onInspect={onInspect}
            onOpen={() => onOpenList('discard')}
          />
          <PileSlot
            zone="deck"
            label="Deck"
            en="Deck Area"
            count={z.deck.count}
            faceDown
            controls={controls}
            mine={mine}
            onInspect={onInspect}
            dragTop={mine}
          >
            {deckButtons}
          </PileSlot>
        </div>
      </div>
    </div>
  );
}

/** Borda da mesa de um jogador: placa (apelido + turno), mão e as áreas fora do painel. */
function HandRail({
  side,
  you,
  controls,
  onInspect,
  onOpenList,
}: {
  side: ArenaSide;
  you: boolean;
  controls?: ArenaControls;
  onInspect: (card: Card) => void;
  onOpenList: (zone: ZoneName) => void;
}) {
  const z = side.zones;
  const mine = !!controls;
  const handDrop = useDrop('hand', controls);
  const reinforcementDrop = useDrop('reinforcement', controls);
  const removedDrop = useDrop('removed', controls);
  const hand = z.hand.cards ?? [];

  const chip = (over: boolean) =>
    `rounded-full px-2.5 py-1 text-[11px] text-white/70 ring-1 transition-colors ${
      over ? 'bg-accent/30 ring-accent' : 'bg-black/40 ring-white/10 hover:bg-black/60'
    }`;

  return (
    <div className={`relative z-20 flex items-end gap-3 px-3 ${you ? 'pb-2' : 'flex-row-reverse items-start pt-2'}`}>
      {/* Placa do jogador. */}
      <div className={`flex w-56 shrink-0 flex-col gap-1 ${you ? '' : 'items-end'}`}>
        <span className="truncate text-sm font-bold">
          {side.nickname}
          {you && <span className="font-normal text-white/50"> (você)</span>}
        </span>
        <TurnTrack turn={side.turn} />
      </div>

      {/* Mão: a sua em leque (cartas sobem ao passar o mouse); a do oponente, só o verso. */}
      <section
        aria-label={you ? 'Sua mão' : `Mão de ${side.nickname}`}
        {...handDrop.handlers}
        className={`flex min-w-0 flex-1 justify-center rounded-xl transition-colors ${
          handDrop.over ? 'bg-accent/15 ring-2 ring-accent/60' : ''
        } ${you ? 'min-h-[clamp(4.5rem,13vh,8.75rem)] items-end' : 'items-start'}`}
      >
        {you ? (
          hand.length === 0 ? (
            <span className="self-center text-[11px] uppercase tracking-widest text-white/25">Mão vazia</span>
          ) : (
            // Sem overflow aqui: um contêiner com rolagem cortaria a carta ampliada no hover.
            <div
              className="flex max-w-full items-end px-4 pt-3"
              style={{ '--hand-w': HAND_CARD_WIDTH } as React.CSSProperties}
            >
              {hand.map((c, i) => (
                <ArenaCard
                  key={c.uid}
                  inst={c}
                  draggable={mine}
                  onInspect={onInspect}
                  sizeClass={HAND_CARD}
                  hoverClass={HAND_HOVER}
                  style={i > 0 ? { marginLeft: `calc(var(--hand-w) * -${handOverlap(hand.length)})` } : undefined}
                />
              ))}
            </div>
          )
        ) : (
          <div className="flex items-start" title={`${z.hand.count} cartas na mão`}>
            {Array.from({ length: Math.min(z.hand.count, 15) }, (_, i) => (
              <CardBack
                key={i}
                sizeClass="w-[clamp(1.5rem,3.6vh,2.5rem)]"
                className={i > 0 ? '-ml-[clamp(0.9rem,2.2vh,1.5rem)]' : ''}
              />
            ))}
            {z.hand.count > 0 && (
              <span className="ml-2 self-center font-mono text-xs text-white/60">{z.hand.count}</span>
            )}
          </div>
        )}
      </section>

      {/* I e J: fora do painel impresso. */}
      <div className={`flex w-56 shrink-0 gap-2 ${you ? 'justify-end' : 'justify-start'}`}>
        <button
          type="button"
          {...reinforcementDrop.handlers}
          onClick={() => z.reinforcement.cards && onOpenList('reinforcement')}
          className={chip(reinforcementDrop.over)}
          title="Baralho de Reforço [Reinforcement Deck]: face para baixo (só o dono vê)"
        >
          Reforço <strong className="font-mono text-text">{z.reinforcement.count}</strong>
        </button>
        <button
          type="button"
          {...removedDrop.handlers}
          onClick={() => onOpenList('removed')}
          className={chip(removedDrop.over)}
          title="Área de Removidos de Jogo [Removed from Game Area]: face para cima"
        >
          Removidos <strong className="font-mono text-text">{z.removed.count}</strong>
        </button>
      </div>
    </div>
  );
}

/** Linha do meio da mesa, com o Andamento do Jogo (fases do turno). */
function CenterLine() {
  return (
    <div className="relative flex h-6 shrink-0 items-center justify-center" aria-label="Andamento do Jogo [Turn Sequence]">
      <div className="absolute inset-x-6 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <ol className="relative flex items-center gap-1 rounded-full bg-bg/90 px-3 py-0.5 text-[10px] uppercase tracking-widest text-white/45 ring-1 ring-white/10">
        {PHASES.map((p, i) => (
          <li key={p} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className="text-white/20">›</span>}
            <span>{p}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Ocupa a altura que o pai der (flex-1): quem usa a arena define a altura total da tela
 * (ver `ARENA_SCREEN`), assim barras extras acima dela não criam rolagem.
 */
export function GameArena({
  you,
  opponent,
  controls,
}: {
  you: ArenaSide;
  opponent: ArenaSide;
  controls?: ArenaControls;
}) {
  const [inspect, setInspect] = useState<Card | null>(null);
  const [list, setList] = useState<{ side: 'you' | 'opponent'; zone: ZoneName } | null>(null);
  const listSide = list ? (list.side === 'you' ? you : opponent) : null;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_50%_50%,#262b38_0%,#191c25_55%,#11131a_100%)] shadow-[inset_0_0_80px_rgb(0_0_0/0.6)] ring-1 ring-white/5">
      <HandRail side={opponent} you={false} onInspect={setInspect} onOpenList={(zone) => setList({ side: 'opponent', zone })} />
      <PlayerMat
        side={opponent}
        flipped
        onInspect={setInspect}
        onOpenList={(zone) => setList({ side: 'opponent', zone })}
        rewardDrop={
          controls && {
            accept: [CARD_MIME, DECK_TOP_MIME],
            onDrop: (data) => controls.onGiveReward(data.getData(CARD_MIME) || undefined),
            hint: 'Solte uma carta sua (ou o topo do seu Deck) como Prêmio de Batalha do oponente',
          }
        }
      />
      <CenterLine />
      <PlayerMat
        side={you}
        flipped={false}
        controls={controls}
        onInspect={setInspect}
        onOpenList={(zone) => setList({ side: 'you', zone })}
      />
      <HandRail
        side={you}
        you
        controls={controls}
        onInspect={setInspect}
        onOpenList={(zone) => setList({ side: 'you', zone })}
      />

      {list && listSide && (
        <ZoneListDialog
          title={`${ZONE_LABEL[list.zone]} de ${listSide.nickname}`}
          zone={list.zone}
          cards={listSide.zones[list.zone].cards ?? []}
          controls={list.side === 'you' ? controls : undefined}
          onInspect={setInspect}
          onClose={() => setList(null)}
        />
      )}
      <CardDetailModal card={inspect} onClose={() => setInspect(null)} />
    </div>
  );
}
