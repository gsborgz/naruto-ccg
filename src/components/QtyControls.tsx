'use client';

import { memo } from 'react';
import type { Card } from '@/models/card';

interface Props {
  card: Card;
  qty: number;
  /** Motivo pelo qual não dá para adicionar mais uma cópia, ou `null`. */
  blocked: string | null;
  /** Deve ser estável (useCallback) para não re-renderizar todas as cartas da grade a cada clique. */
  onSetQty: (card: Card, qty: number) => void;
  compact?: boolean;
}

export const QtyControls = memo(function QtyControls({ card, qty, blocked, onSetQty, compact }: Props) {
  const btn = `grid place-items-center rounded-md font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
    compact ? 'size-8' : 'size-10 text-lg'
  }`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`${btn} bg-surface-2 hover:bg-border`}
        disabled={qty === 0}
        onClick={() => onSetQty(card, qty - 1)}
        aria-label={`Remover 1 ${card.name}`}
      >
        −
      </button>
      <span className={`min-w-6 text-center font-mono ${compact ? 'text-sm' : 'text-lg'}`} aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className={`${btn} bg-accent text-bg hover:bg-accent-strong`}
        disabled={blocked !== null}
        title={blocked ?? undefined}
        onClick={() => onSetQty(card, qty + 1)}
        aria-label={`Adicionar 1 ${card.name}`}
      >
        +
      </button>
      {!compact && blocked && qty > 0 && <span className="text-xs text-muted">{blocked}</span>}
    </div>
  );
});
