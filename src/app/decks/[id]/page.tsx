'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { CardBrowser } from '@/components/CardBrowser';
import { CardDetailModal } from '@/components/CardDetailModal';
import { DeckDesignDialog } from '@/components/DeckDesignDialog';
import { DeckPanel } from '@/components/DeckPanel';
import { DeckSheet } from '@/components/DeckSheet';
import { SleeveDialog } from '@/components/SleeveDialog';
import { QtyControls } from '@/components/QtyControls';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { cannotAddReasonIn, DECK_RULES, indexDeck, summarizeDeck, type DeckCards } from '@/lib/deckRules';
import { useDesignedLookup } from '@/lib/deckDesigns';
import { deckActions, useDeck, type Deck } from '@/lib/deckStore';
import { useCardCatalog } from '@/lib/useCardCatalog';
import { useLeaveGuard } from '@/lib/useLeaveGuard';
import type { Card } from '@/models/card';

type Draft = Pick<Deck, 'id' | 'name' | 'cards' | 'designs' | 'sleeve'>;

/** Mesmas entradas (quantidades das cartas ou designs escolhidos). */
function sameCards(a: Record<string, number | string>, b: Record<string, number | string>): boolean {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

export default function DeckBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const stored = useDeck(id);
  const [selected, setSelected] = useState<Card | null>(null);
  // Catálogo + cartas do criador (`/criar`).
  const { cards: available, lookup } = useCardCatalog();

  // Rascunho em memória: as edições só vão para a nuvem ao salvar.
  const [draft, setDraft] = useState<Draft | null>(null);
  if (stored && draft?.id !== stored.id) {
    setDraft({ id: stored.id, name: stored.name, cards: stored.cards, designs: stored.designs ?? {}, sleeve: stored.sleeve });
  }
  const deck =
    draft && stored ? { ...stored, name: draft.name, cards: draft.cards, designs: draft.designs, sleeve: draft.sleeve } : stored;

  const dirty =
    !!draft &&
    !!stored &&
    (draft.name !== stored.name ||
      !sameCards(draft.cards, stored.cards) ||
      !sameCards(draft.designs ?? {}, stored.designs ?? {}) ||
      draft.sleeve !== stored.sleeve);
  const guard = useLeaveGuard(dirty);

  // Tudo derivado do conteúdo do deck é calculado uma vez por mudança, não uma vez por carta da grade.
  const deckCards = draft?.cards;
  const index = useMemo(() => indexDeck(deckCards ?? {}, lookup), [deckCards, lookup]);
  const summary = useMemo(() => summarizeDeck(deckCards ?? {}, lookup), [deckCards, lookup]);
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
  // Design de cada carta neste deck (`Deck.designs`): a carta com o design escolhido é a que aparece e é impressa.
  const designedLookup = useDesignedLookup(lookup, draft?.designs);
  const [designFor, setDesignFor] = useState<Card | null>(null);
  const onSetDesign = useCallback((cardId: string, choice: string | undefined) => {
    setDraft((d) => {
      if (!d) return d;
      const designs = { ...d.designs };
      if (choice) designs[cardId] = choice;
      else delete designs[cardId];
      return { ...d, designs };
    });
  }, []);

  const save = useCallback(() => {
    if (!draft) return;
    // Só ficam os designs das cartas que estão no deck.
    const designs = Object.fromEntries(Object.entries(draft.designs ?? {}).filter(([id]) => id in draft.cards));
    void deckActions.save(draft.id, { ...draft, designs });
    // O nome salvo é normalizado (sem espaços nas pontas): alinha o rascunho para não ficar "não salvo".
    setDraft((d) => d && { ...d, name: d.name.trim() || 'Deck sem nome' });
  }, [draft]);

  const [sheetOpen, setSheetOpen] = useState(false);
  // Sleeve do deck (verso das cartas na partida): a escolha entra no rascunho.
  const [sleeveOpen, setSleeveOpen] = useState(false);
  const onSetSleeve = useCallback((sleeve: string | undefined) => setDraft((d) => d && { ...d, sleeve }), []);

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

  const panelProps = {
    deck,
    lookup: designedLookup,
    summary,
    dirty,
    blockedOf,
    onSelect: setSelected,
    onSetQty,
    onRename,
    onClear,
    onSave: save,
    onDesign: setDesignFor,
    onSleeve: () => setSleeveOpen(true),
  };

  return (
    // No desktop a tela ocupa a altura toda (descontando cabeçalho e padding: --app-chrome em globals.css; em tela cheia o cabeçalho some):
    // cada coluna rola sozinha, como no TCG Live — cartas disponíveis à esquerda, deck à direita.
    <div className="grid gap-6 pb-20 lg:h-[calc(100dvh-var(--app-chrome))] lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_minmax(30rem,38%)]">
      <section className="flex min-w-0 flex-col gap-4 lg:-mx-2 lg:overflow-y-auto lg:px-2 lg:pt-1 lg:pb-4" aria-label="Cartas disponíveis">
        <CardBrowser
          cards={available}
          onSelect={setSelected}
          countOf={countOf}
          blockedOf={blockedOf}
          onSetQty={onSetQty}
          gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]"
          filtersClassName="lg:sticky lg:top-0 lg:z-10 lg:-mb-4 lg:bg-bg lg:pb-4"
        />
      </section>

      {/* Desktop: coluna fixa à direita. No celular o deck abre num painel por cima da lista (DeckSheet). */}
      <aside className="hidden min-h-0 lg:block lg:h-full">
        <DeckPanel {...panelProps} />
      </aside>

      <DeckSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <DeckPanel {...panelProps} onClose={() => setSheetOpen(false)} />
      </DeckSheet>

      {/* Barra fixa no celular: abre o deck sem sair do ponto da lista. */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        className={`fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-20 flex items-center justify-between gap-3 rounded-xl px-4 py-3 font-semibold shadow-lg lg:hidden ${
          summary.isValid ? 'bg-ok text-bg' : 'bg-surface-2 text-text ring-1 ring-border'
        }`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span aria-hidden>{summary.isValid ? '✓' : '🂠'}</span>
          <span className="truncate">
            {summary.total}/{DECK_RULES.size} cartas
            {summary.reinforcement > 0 && <span className="font-normal"> + {summary.reinforcement} Reforço</span>}
            {summary.tokens > 0 && <span className="font-normal"> + {summary.tokens} Tokens</span>}
          </span>
          {dirty && <span className="size-2 shrink-0 rounded-full bg-accent" aria-label="(alterações não salvas)" />}
        </span>
        <span className="shrink-0 text-sm">Ver deck ↑</span>
      </button>

      <CardDetailModal
        card={selected}
        onClose={() => setSelected(null)}
        // Carta criada excluída de vez: sai também do rascunho (o deck salvo já foi atualizado).
        onDeleted={(c) => onSetQty(c, 0)}
        actions={
          selected && (
            <QtyControls card={selected} qty={countOf(selected)} blocked={blockedOf(selected)} onSetQty={onSetQty} />
          )
        }
      />

      <DeckDesignDialog
        card={designFor}
        choice={designFor ? draft?.designs?.[designFor.id] : undefined}
        onChoose={(choice) => designFor && onSetDesign(designFor.id, choice)}
        onClose={() => setDesignFor(null)}
      />

      <SleeveDialog open={sleeveOpen} onClose={() => setSleeveOpen(false)} value={draft?.sleeve} onChoose={onSetSleeve} />

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
