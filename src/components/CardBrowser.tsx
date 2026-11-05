'use client';

import { memo, useDeferredValue, useMemo, useState } from 'react';
import { CARDS } from '@/data/cards';
import { filterCards, INITIAL_FILTERS } from '@/lib/cardFilters';
import { CARD_TYPE_LABEL, cardImageUrl, type Card } from '@/models/card';
import { CardCost } from './CardCost';
import { CardFilters } from './CardFilters';
import { QtyControls } from './QtyControls';

/** Miniaturas carregadas de imediato (com prioridade): as primeiras linhas visíveis da grade. */
const EAGER_THUMBS = 12;

/** Imagens grandes já pré-carregadas nesta sessão (ao passar o mouse ou focar uma carta). */
const preloaded = new Set<string>();
function preloadFull(card: Card) {
  const url = cardImageUrl(card);
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

interface Props {
  onSelect: (card: Card) => void;
  /** Quantidade no deck, exibida como selo no canto (e nos controles +/-). */
  countOf?: (card: Card) => number;
  /** Motivo pelo qual não dá para adicionar mais uma cópia (desabilita o "+"). */
  blockedOf?: (card: Card) => string | null;
  /** Se presente, mostra os controles +/- em cada carta. Deve ser estável (useCallback). */
  onSetQty?: (card: Card, qty: number) => void;
  gridClassName?: string;
  /** Classes extras do bloco de filtros (ex.: fixá-lo no topo de uma coluna com rolagem própria). */
  filtersClassName?: string;
}

interface TileProps {
  card: Card;
  eager: boolean;
  count: number;
  blocked: string | null;
  onSelect: (card: Card) => void;
  onSetQty?: (card: Card, qty: number) => void;
}

/**
 * Uma carta da grade. Memoizada: ao clicar em "+", só as cartas cuja quantidade ou bloqueio
 * mudou são re-renderizadas (a grade pode ter milhares de cartas).
 */
const CardTile = memo(function CardTile({ card, eager, count, blocked, onSelect, onSetQty }: TileProps) {
  return (
    <li className="group flex flex-col gap-1.5 [contain-intrinsic-size:auto_320px] [content-visibility:auto]">
      <button
        type="button"
        onClick={() => onSelect(card)}
        onPointerEnter={() => preloadFull(card)}
        onFocus={() => preloadFull(card)}
        className="relative overflow-hidden rounded-lg ring-1 ring-border transition hover:-translate-y-0.5 hover:ring-accent"
        aria-label={`Ver detalhes de ${card.name}`}
      >
        <img
          src={cardImageUrl(card, 'thumb')}
          alt={card.name}
          width={300}
          height={420}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          className="aspect-[5/7] w-full object-cover"
        />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-accent text-sm font-bold text-bg shadow">
            {count}
          </span>
        )}
      </button>
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={card.name}>
            {card.name}
          </p>
          <p className="text-xs text-muted">{CARD_TYPE_LABEL[card.type]}</p>
        </div>
        <CardCost card={card} />
      </div>
      {onSetQty && <QtyControls card={card} qty={count} blocked={blocked} onSetQty={onSetQty} compact />}
    </li>
  );
});

export function CardBrowser({ onSelect, countOf, blockedOf, onSetQty, gridClassName, filtersClassName }: Props) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  // Os filtros (e a contagem) atualizam na hora; a grade pesada segue logo depois, sem travar a digitação.
  const deferredFilters = useDeferredValue(filters);
  const cards = useMemo(() => filterCards(CARDS, deferredFilters), [deferredFilters]);

  return (
    <div className="flex flex-col gap-4">
      <div className={filtersClassName}>
        <CardFilters value={filters} onChange={setFilters} resultCount={cards.length} />
      </div>
      {cards.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted">
          Nenhuma carta encontrada com esses filtros.
        </p>
      ) : (
        <ul className={gridClassName ?? 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}>
          {cards.map((card, index) => (
            <CardTile
              key={card.id}
              card={card}
              eager={index < EAGER_THUMBS}
              count={countOf?.(card) ?? 0}
              blocked={blockedOf?.(card) ?? null}
              onSelect={onSelect}
              onSetQty={onSetQty}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
