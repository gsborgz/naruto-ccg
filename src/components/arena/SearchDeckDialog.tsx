'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { CARD_TYPE_LABEL } from '@/models/card';
import type { Side } from '@/lib/game/state';
import { ArenaCardImage, useArenaLookup } from './arenaCards';
import { CardZoom, type HoveredCard } from './CardZoom';

/**
 * Buscar uma carta no deck: mostra as cartas na ordem do deck (do topo para o fundo, como ao
 * procurar no deck físico) e leva a escolhida para a mão. O servidor embaralha o deck em seguida.
 */
export function SearchDeckDialog({
  open,
  load,
  onPick,
  onClose,
  owner,
}: {
  open: boolean;
  /** De quem é o deck. */
  owner?: Side;
  /** Ids das cartas na ordem do deck, do topo para o fundo (ex.: `roomApi.deck`). */
  load: () => Promise<string[]>;
  onPick: (cardId: string) => void;
  onClose: () => void;
}) {
  const [counts, setCounts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  // Alt + mouse sobre uma carta: a carta ampliada (como na arena).
  const [hovered, setHovered] = useState<HoveredCard | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCounts(null);
    setError(null);
    setQuery('');
    setHovered(null);
    load()
      .then((c) => !cancelled && setCounts(c))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [open, load]);

  const nameOf = (c: { name: string }) => c.name;
  const lookup = useArenaLookup();
  const entries = useMemo(() => {
    if (!counts) return [];
    const q = query.trim().toLowerCase();
    // Na ordem do deck (1 = topo); o filtro mantém a posição de cada carta.
    return counts
      .map((id, i) => ({ id, position: i + 1, card: lookup(id, owner) }))
      .map((e) => ({ ...e, name: e.card ? nameOf(e.card) : e.id }))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || (e.card?.name ?? '').toLowerCase().includes(q));
  }, [counts, query, lookup, owner]);

  return (
    <Dialog open={open} onClose={onClose} title="Buscar no deck">
      <p className="text-sm text-muted">
        As cartas estão na ordem do deck, do topo (1) para o fundo. Escolha uma para colocar na mão. Depois o deck é{' '}
        <strong className="text-text">embaralhado</strong>.
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
          {entries.map(({ id, position, card, name }) => (
            <li key={position}>
              <button
                type="button"
                onClick={() => onPick(id)}
                onMouseEnter={(e) => card && setHovered({ card, clientX: e.clientX })}
                onMouseLeave={() => setHovered(null)}
                title={name}
                className="group relative flex w-full flex-col gap-1 rounded-lg p-1 text-left hover:bg-surface-2"
              >
                {card && (
                  <ArenaCardImage
                    card={card}
                    size="thumb"
                    alt={name}
                    className="aspect-[5/7] w-full overflow-hidden rounded object-cover ring-1 ring-border group-hover:ring-accent"
                  />
                )}
                <span
                  className="absolute left-2 top-2 rounded-full bg-bg/85 px-1.5 text-xs font-bold ring-1 ring-border"
                  title={position === 1 ? 'Topo do deck' : `${position}ª carta do topo`}
                >
                  {position}
                </span>
                <span className="truncate text-xs font-medium">{name}</span>
                {card && <span className="text-[10px] text-muted">{CARD_TYPE_LABEL[card.type]}</span>}
              </button>
            </li>
          ))}
          {entries.length === 0 && <li className="col-span-full text-sm text-muted">Nenhuma carta com esse nome.</li>}
        </ul>
      )}
      {/* Dentro do <dialog>: fora dele, a carta ampliada ficaria atrás do modal. */}
      {open && <CardZoom hovered={hovered} />}
    </Dialog>
  );
}
