'use client';

import { useState } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { DECK_RULES, type DeckSummary } from '@/lib/deckRules';
import { sortCost } from '@/lib/cardFilters';
import type { Deck } from '@/lib/deckStore';
import { CARD_TYPE_LABEL, cardImageUrl, type Card, type CardType } from '@/models/card';

const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

const lookup = (id: string) => CARDS_BY_ID.get(id);

type Entry = { card: Card; qty: number };

function Meter({ value, max }: { value: number; max: number }) {
  const over = value > max;
  const done = value === max;
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${over ? 'bg-danger' : done ? 'bg-ok' : 'bg-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-sm font-semibold ${over ? 'text-danger' : done ? 'text-ok' : 'text-text'}`}>
        {value}/{max}
      </span>
    </div>
  );
}

/** Botão redondo pequeno de −/+ que aparece sobre a carta do deck. */
const roundBtn =
  'grid size-6 place-items-center rounded-full text-sm font-bold shadow ring-1 transition disabled:cursor-not-allowed disabled:opacity-35';
/** Esconde os botões até passar o mouse/focar (em telas de toque ficam sempre visíveis). */
const revealOnHover =
  'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100';

function DeckCard({
  entry,
  blocked,
  onSelect,
  onSetQty,
}: {
  entry: Entry;
  blocked: string | null;
  onSelect: (card: Card) => void;
  onSetQty: (card: Card, qty: number) => void;
}) {
  const { card, qty } = entry;
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onSelect(card)}
        className="block w-full overflow-hidden rounded-md ring-1 ring-border transition hover:-translate-y-0.5 hover:ring-accent"
        aria-label={`Ver detalhes de ${card.name}`}
        title={card.name}
      >
        <img
          src={cardImageUrl(card, 'thumb')}
          alt={card.name}
          width={300}
          height={420}
          loading="lazy"
          decoding="async"
          className="aspect-[5/7] w-full object-cover"
        />
      </button>
      <div className="absolute inset-x-0 -bottom-3 flex items-center justify-center gap-1">
        <span className={revealOnHover}>
          <button
            type="button"
            onClick={() => onSetQty(card, qty - 1)}
            className={`${roundBtn} bg-surface-2 text-text ring-border hover:bg-border`}
            aria-label={`Remover 1 ${card.name}`}
          >
            −
          </button>
        </span>
        <span
          className="grid size-7 place-items-center rounded-full bg-text font-mono text-sm font-bold text-bg shadow ring-2 ring-surface"
          aria-label={`${qty} no deck`}
        >
          {qty}
        </span>
        <span className={revealOnHover}>
          <button
            type="button"
            onClick={() => onSetQty(card, qty + 1)}
            disabled={blocked !== null}
            title={blocked ?? undefined}
            className={`${roundBtn} bg-accent text-bg ring-accent hover:bg-accent-strong`}
            aria-label={`Adicionar 1 ${card.name}`}
          >
            +
          </button>
        </span>
      </div>
    </li>
  );
}

export function DeckPanel({
  deck,
  summary,
  dirty,
  blockedOf,
  onSelect,
  onSetQty,
  onRename,
  onClear,
  onSave,
}: {
  deck: Deck;
  summary: DeckSummary;
  /** Há alterações ainda não salvas. */
  dirty: boolean;
  blockedOf: (card: Card) => string | null;
  onSelect: (card: Card) => void;
  onSetQty: (card: Card, qty: number) => void;
  onRename: (name: string) => void;
  onClear: () => void;
  onSave: () => void;
}) {
  const [tab, setTab] = useState<CardType>('ninja');

  const entries = Object.entries(deck.cards)
    .map(([id, qty]) => ({ card: lookup(id), qty }))
    .filter((e): e is Entry => !!e.card && e.qty > 0);

  const group = entries
    .filter((e) => e.card.type === tab)
    .sort((a, b) => sortCost(a.card) - sortCost(b.card) || a.card.name.localeCompare(b.card.name));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <input
            value={deck.name}
            onChange={(e) => onRename(e.target.value)}
            onBlur={(e) => !e.target.value.trim() && onRename('Deck sem nome')}
            aria-label="Nome do deck"
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 text-xl font-bold hover:border-border focus:border-accent"
          />
          <button
            type="button"
            onClick={onSave}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
          >
            Salvar
            {dirty && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-bg align-middle" aria-label="(alterações não salvas)" />}
          </button>
        </div>
        <Meter value={summary.total} max={DECK_RULES.size} />
        {summary.isValid ? (
          <p className="rounded-lg bg-ok/15 px-3 py-1.5 text-sm font-semibold text-ok">✓ Deck válido para jogar</p>
        ) : (
          <ul className="space-y-0.5 rounded-lg bg-danger/10 px-3 py-1.5 text-sm text-danger">
            {summary.issues.map((issue, i) => (
              <li key={i}>• {issue.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div role="tablist" aria-label="Tipos de carta no deck" className="flex border-b border-border">
        {TYPES.map((t) => {
          const selected = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t)}
              className={`relative flex flex-1 flex-col items-center py-2.5 transition-colors ${
                selected ? 'text-accent' : 'text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">{CARD_TYPE_LABEL[t]}</span>
              <span className="font-mono text-lg font-bold leading-tight">{summary.byType[t]}</span>
              {selected && <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="min-h-48 flex-1 overflow-y-auto p-4">
        {group.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            {entries.length === 0
              ? 'Use o botão + nas cartas para montar seu deck.'
              : `Nenhuma carta do tipo ${CARD_TYPE_LABEL[tab]} no deck.`}
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-x-3 gap-y-6 pb-3">
            {group.map((entry) => (
              <DeckCard
                key={entry.card.id}
                entry={entry}
                blocked={blockedOf(entry.card)}
                onSelect={onSelect}
                onSetQty={onSetQty}
              />
            ))}
          </ul>
        )}
      </div>

      {entries.length > 0 && (
        <div className="border-t border-border px-4 py-2.5">
          <button
            type="button"
            onClick={() => confirm('Remover todas as cartas deste deck?') && onClear()}
            className="text-sm text-muted hover:text-danger"
          >
            Limpar deck
          </button>
        </div>
      )}
    </div>
  );
}
