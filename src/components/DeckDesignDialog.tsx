'use client';

import { useEffect, useState } from 'react';
import { withoutLayout } from '@/lib/cardMaker/catalogEdit';
import { fetchVersions, type VersionView } from '@/lib/cardMaker/versions';
import { rememberOtherCards } from '@/lib/cloud/library';
import { designedCard } from '@/lib/deckDesigns';
import { ORIGINAL_DESIGN } from '@/lib/decks/types';
import { CARDS_BY_ID } from '@/data/cards';
import type { Card } from '@/models/card';
import { CardFace } from './CardFace';
import { Dialog } from './Dialog';

/**
 * Escolha do design de uma carta só neste deck (`Deck.designs`): o padrão da carta (o mesmo para todo mundo), a imagem
 * impressa ou uma das versões dela (as cartas do criador importadas desta carta, de todos os jogadores).
 */
export function DeckDesignDialog({
  card,
  choice,
  onChoose,
  onClose,
}: {
  /** A carta do catálogo (com o design padrão). `null`: fechado. */
  card: Card | null;
  /** Escolha atual no deck (`undefined` = o padrão). */
  choice: string | undefined;
  onChoose: (choice: string | undefined) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<VersionView[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!card) return;
    let cancelled = false;
    setItems(null);
    setError(null);
    fetchVersions(card.id)
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        rememberOtherCards(list);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [card]);

  if (!card) return null;
  const base = CARDS_BY_ID.get(card.id) ?? card;
  const pick = (value: string | undefined) => {
    onChoose(value);
    onClose();
  };
  const options: { key: string; value: string | undefined; label: string; shown: Card }[] = [
    { key: 'default', value: undefined, label: 'Padrão da carta', shown: base },
    { key: ORIGINAL_DESIGN, value: ORIGINAL_DESIGN, label: 'Original (impressa)', shown: withoutLayout(base) },
    ...(items ?? [])
      .filter((v) => v.card.id !== base.design)
      .map((v) => ({
        key: v.card.id,
        value: v.card.id,
        label: v.owner === 'mine' ? 'Sua' : v.owner === 'system' ? 'Do site' : v.author || 'Jogador',
        shown: designedCard(base, v.card.id, (id) => (id === v.card.id ? v.card : undefined)),
      })),
  ];

  return (
    <Dialog open onClose={onClose} title={`Design de ${base.name} neste deck`}>
      <p className="mb-3 text-sm text-muted">
        Vale só para este deck (na tela, na impressão e nas salas). O padrão da carta é o mesmo para todo mundo.
      </p>
      {error && <p className="mb-2 text-xs text-danger">{error}</p>}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {options.map((o) => {
          const active = o.value === choice;
          return (
            <li key={o.key}>
              <button
                type="button"
                onClick={() => pick(o.value)}
                aria-pressed={active}
                className={`flex w-full flex-col items-center gap-1 rounded-lg p-1 text-xs ${
                  active ? 'bg-accent/15 ring-2 ring-accent' : 'ring-1 ring-border hover:bg-surface-2'
                }`}
              >
                <CardFace card={o.shown} size="thumb" rendered className="w-full rounded-md" />
                <span className="max-w-full truncate">{o.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {items === null && !error && <p className="mt-2 text-xs text-muted">Carregando versões…</p>}
    </Dialog>
  );
}
