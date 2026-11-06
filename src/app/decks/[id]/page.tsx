'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { CardBrowser } from '@/components/CardBrowser';
import { CardDetailModal } from '@/components/CardDetailModal';
import { DeckPanel } from '@/components/DeckPanel';
import { QtyControls } from '@/components/QtyControls';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { CARDS_BY_ID } from '@/data/cards';
import { cannotAddReasonIn, DECK_RULES, indexDeck, summarizeDeck, type DeckCards } from '@/lib/deckRules';
import { deckActions, useDeck, type Deck } from '@/lib/deckStore';
import { useLeaveGuard } from '@/lib/useLeaveGuard';
import type { Card } from '@/models/card';

const lookup = (id: string) => CARDS_BY_ID.get(id);

type Draft = Pick<Deck, 'id' | 'name' | 'cards'>;

function sameCards(a: DeckCards, b: DeckCards): boolean {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

export default function DeckBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const stored = useDeck(id);
  const [selected, setSelected] = useState<Card | null>(null);

  // Rascunho em memória: as edições só vão para o localStorage ao salvar.
  const [draft, setDraft] = useState<Draft | null>(null);
  if (stored && draft?.id !== stored.id) setDraft({ id: stored.id, name: stored.name, cards: stored.cards });
  const deck = draft && stored ? { ...stored, name: draft.name, cards: draft.cards } : stored;

  const dirty = !!draft && !!stored && (draft.name !== stored.name || !sameCards(draft.cards, stored.cards));
  const guard = useLeaveGuard(dirty);

  // Tudo derivado do conteúdo do deck é calculado uma vez por mudança, não uma vez por carta da grade.
  const deckCards = draft?.cards;
  const index = useMemo(() => indexDeck(deckCards ?? {}, lookup), [deckCards]);
  const summary = useMemo(() => summarizeDeck(deckCards ?? {}, lookup), [deckCards]);
  const countOf = useCallback((c: Card) => deckCards?.[c.id] ?? 0, [deckCards]);
  const blockedOf = useCallback((c: Card) => cannotAddReasonIn(index, c), [index]);
  const onSetQty = useCallback((c: Card, qty: number) => {
    setDraft((d) => {
      if (!d) return d;
      const cards = { ...d.cards };
      if (qty <= 0) delete cards[c.id];
      else cards[c.id] = qty;
      return { ...d, cards };
    });
  }, []);
  const onRename = useCallback((name: string) => setDraft((d) => d && { ...d, name }), []);
  const onClear = useCallback(() => setDraft((d) => d && { ...d, cards: {} }), []);

  const save = useCallback(() => {
    if (!draft) return;
    deckActions.save(draft.id, draft);
    // O nome salvo é normalizado (sem espaços nas pontas): alinha o rascunho para não ficar "não salvo".
    setDraft((d) => d && { ...d, name: d.name.trim() || 'Deck sem nome' });
  }, [draft]);

  if (deck === undefined) return <p className="text-muted">Carregando…</p>;
  if (deck === null) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="text-lg font-semibold">Deck não encontrado</p>
        <p className="mt-1 text-sm text-muted">
          Ele pode ter sido excluído ou criado em outro navegador.{' '}
          <Link href="/" className="text-accent hover:underline">
            Voltar para meus decks
          </Link>
        </p>
      </div>
    );
  }

  return (
    // No desktop a tela ocupa a altura toda (descontando cabeçalho e padding: --app-chrome em globals.css; em tela cheia o cabeçalho some):
    // cada coluna rola sozinha, como no TCG Live — cartas disponíveis à esquerda, deck à direita.
    <div className="grid gap-6 lg:h-[calc(100dvh-var(--app-chrome))] lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_minmax(30rem,38%)]">
      <section className="flex min-w-0 flex-col gap-4 lg:-mr-2 lg:overflow-y-auto lg:pr-2" aria-label="Cartas disponíveis">
        <CardBrowser
          onSelect={setSelected}
          countOf={countOf}
          blockedOf={blockedOf}
          onSetQty={onSetQty}
          gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
          filtersClassName="lg:sticky lg:top-0 lg:z-10 lg:-mb-4 lg:bg-bg lg:pb-4"
        />
      </section>

      <aside id="deck" className="min-h-0 lg:h-full">
        <DeckPanel
          deck={deck}
          summary={summary}
          dirty={dirty}
          blockedOf={blockedOf}
          onSelect={setSelected}
          onSetQty={onSetQty}
          onRename={onRename}
          onClear={onClear}
          onSave={save}
        />
      </aside>

      {/* Barra fixa no celular para chegar ao painel do deck. */}
      <a
        href="#deck"
        className={`fixed inset-x-4 bottom-4 z-20 flex items-center justify-between rounded-xl px-4 py-3 font-semibold shadow-lg lg:hidden ${
          summary.isValid ? 'bg-ok text-bg' : 'bg-surface-2 text-text ring-1 ring-border'
        }`}
      >
        <span>
          {summary.total}/{DECK_RULES.size} cartas
          {summary.reinforcement > 0 && (
            <span className="font-normal"> + {summary.reinforcement} Reforço</span>
          )}
        </span>
        <span className="text-sm">Ver deck ↓</span>
      </a>

      <CardDetailModal
        card={selected}
        onClose={() => setSelected(null)}
        actions={
          selected && (
            <QtyControls card={selected} qty={countOf(selected)} blocked={blockedOf(selected)} onSetQty={onSetQty} />
          )
        }
      />

      <UnsavedChangesDialog
        open={guard.pending}
        onSave={() => {
          save();
          guard.proceed();
        }}
        onDiscard={guard.proceed}
        onCancel={guard.cancel}
      />
    </div>
  );
}
