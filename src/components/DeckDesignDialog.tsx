'use client';

import { useEffect, useState } from 'react';
import { fetchVersions, type VersionView } from '@/lib/cardMaker/versions';
import { rememberOtherCards } from '@/lib/cloud/library';
import { designedCard } from '@/lib/deckDesigns';
import { CARDS_BY_ID } from '@/data/cards';
import type { Card } from '@/models/card';
import { CardFace } from './CardFace';
import { Dialog } from './Dialog';

/**
 * Escolha do design de uma carta só neste deck (`Deck.designs`): a imagem impressa (o padrão) ou uma das alters dela
 * (cartas do criador ligadas a esta carta, de todos os jogadores). Vale na tela, na impressão e na partida.
 */
export function DeckDesignDialog({
  card,
  choice,
  onChoose,
  onClose,
}: {
  /** A carta do catálogo. `null`: fechado. */
  card: Card | null;
  /** Escolha atual no deck (`undefined` = a impressa). */
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
  const known = new Set((items ?? []).map((v) => v.card.id));
  const options: { key: string; value: string | undefined; label: string; shown: Card }[] = [
    { key: 'original', value: undefined, label: 'Original', shown: base },
    ...(items ?? []).map((v) => ({
      key: v.card.id,
      value: v.card.id,
      label: v.owner === 'mine' ? 'Sua' : v.author || 'Jogador',
      shown: designedCard(base, v.card.id, (id) => (id === v.card.id ? v.card : undefined)),
    })),
  ];
  // Escolha antiga (`original`) ou alter que não existe mais: conta como a impressa.
  const active = choice && known.has(choice) ? choice : undefined;

  return (
    <Dialog open onClose={onClose} title={`Design de ${base.name} neste deck`}>
      <p className="mb-3 text-sm text-muted">
        Vale só para este deck: na tela, na impressão e na partida (os dois jogadores veem). Para criar uma alter, use{' '}
        <strong>Criar carta → Importar do catálogo</strong>.
      </p>
      {error && <p className="mb-2 text-xs text-danger">{error}</p>}
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {options.map((o) => (
          <li key={o.key}>
            <button
              type="button"
              onClick={() => pick(o.value)}
              aria-pressed={o.value === active}
              className={`flex w-full flex-col items-center gap-1 rounded-lg p-1 text-xs ${
                o.value === active ? 'bg-accent/15 ring-2 ring-accent' : 'ring-1 ring-border hover:bg-surface-2'
              }`}
            >
              <CardFace card={o.shown} size="thumb" className="w-full rounded-md" />
              <span className="max-w-full truncate">{o.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {items === null && !error && <p className="mt-2 text-xs text-muted">Carregando alters…</p>}
      {items?.length === 0 && <p className="mt-2 text-xs text-muted">Esta carta ainda não tem alters.</p>}
    </Dialog>
  );
}
