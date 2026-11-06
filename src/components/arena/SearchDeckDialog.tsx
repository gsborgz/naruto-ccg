'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { CARDS_BY_ID } from '@/data/cards';
import { cardImageUrl, CARD_TYPE_LABEL } from '@/models/card';

/**
 * Buscar uma carta no deck: mostra o que há no deck (por nome, sem revelar a ordem) e leva a carta
 * escolhida para a mão. O servidor embaralha o deck em seguida.
 */
export function SearchDeckDialog({
  open,
  load,
  onPick,
  onClose,
}: {
  open: boolean;
  /** Quantidade por carta no deck (ex.: `roomApi.deck`). */
  load: () => Promise<Record<string, number>>;
  onPick: (cardId: string) => void;
  onClose: () => void;
}) {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCounts(null);
    setError(null);
    setQuery('');
    load()
      .then((c) => !cancelled && setCounts(c))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, load]);

  const entries = useMemo(() => {
    if (!counts) return [];
    const q = query.trim().toLowerCase();
    return Object.entries(counts)
      .map(([id, qty]) => ({ id, qty, card: CARDS_BY_ID.get(id) }))
      .filter((e) => !q || (e.card?.name ?? e.id).toLowerCase().includes(q))
      .sort((a, b) => (a.card?.name ?? a.id).localeCompare(b.card?.name ?? b.id, 'pt-BR'));
  }, [counts, query]);

  return (
    <Dialog open={open} onClose={onClose} title="Buscar no deck">
      <p className="text-sm text-muted">
        Escolha uma carta para colocar na mão. Depois o deck é <strong className="text-text">embaralhado</strong>.
      </p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filtrar por nome…"
        aria-label="Filtrar por nome"
        className="rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      {!counts && !error && <p className="text-sm text-muted">Carregando o deck…</p>}
      {counts && (
        <ul className="grid max-h-[55vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
          {entries.map(({ id, qty, card }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onPick(id)}
                title={card?.name ?? id}
                className="group relative flex w-full flex-col gap-1 rounded-lg p-1 text-left hover:bg-surface-2"
              >
                {card && (
                  <img
                    src={cardImageUrl(card, 'thumb')}
                    alt={card.name}
                    loading="lazy"
                    className="aspect-[5/7] w-full rounded object-cover ring-1 ring-border group-hover:ring-accent"
                  />
                )}
                {qty > 1 && (
                  <span className="absolute right-2 top-2 rounded-full bg-accent px-1.5 text-xs font-bold text-bg">
                    ×{qty}
                  </span>
                )}
                <span className="truncate text-xs font-medium">{card?.name ?? id}</span>
                {card && <span className="text-[10px] text-muted">{CARD_TYPE_LABEL[card.type]}</span>}
              </button>
            </li>
          ))}
          {entries.length === 0 && <li className="col-span-full text-sm text-muted">Nenhuma carta com esse nome.</li>}
        </ul>
      )}
    </Dialog>
  );
}
