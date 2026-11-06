'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ImportDialog } from '@/components/ImportDialog';
import { ReturnToRoom } from '@/components/ReturnToRoom';
import { ShareDialog, type ShareRequest } from '@/components/ShareDialog';
import { CARDS_BY_ID } from '@/data/cards';
import { DECK_RULES, summarizeDeck } from '@/lib/deckRules';
import { deckActions, useDecks } from '@/lib/deckStore';

const lookup = (id: string) => CARDS_BY_ID.get(id);

export default function HomePage() {
  const decks = useDecks();
  const router = useRouter();
  const [share, setShare] = useState<ShareRequest | null>(null);
  const [importing, setImporting] = useState(false);

  const newDeck = () => {
    const deck = deckActions.create();
    router.push(`/decks/${deck.id}`);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <ReturnToRoom />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Meus decks</h1>
          <p className="text-sm text-muted">
            {DECK_RULES.size} cartas · até {DECK_RULES.maxCopiesPerName} cópias
            por nome. Salvos neste navegador.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setImporting(true)}
            className="rounded-lg px-4 py-2 font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
          >
            Importar
          </button>
          <button
            type="button"
            disabled={!decks?.length}
            onClick={() =>
              decks?.length &&
              setShare({ title: 'Compartilhar coleção', payload: { kind: 'collection', decks } })
            }
            className="rounded-lg px-4 py-2 font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compartilhar coleção
          </button>
          <button
            type="button"
            onClick={newDeck}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-strong"
          >
            + Novo deck
          </button>
        </div>
      </div>

      {decks === null ? (
        <p className="text-muted">Carregando…</p>
      ) : decks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-lg font-semibold">Nenhum deck ainda</p>
          <p className="mt-1 text-sm text-muted">
            Crie seu primeiro deck ou{' '}
            <Link href="/cards" className="text-accent hover:underline">
              explore as cartas disponíveis
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const s = summarizeDeck(deck.cards, lookup);
            return (
              <li key={deck.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/decks/${deck.id}`} className="min-w-0 font-semibold hover:text-accent">
                    <span className="block truncate">{deck.name}</span>
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.isValid ? 'bg-ok/15 text-ok' : 'bg-danger/15 text-danger'
                    }`}
                  >
                    {s.isValid ? 'Válido' : 'Incompleto'}
                  </span>
                </div>
                <p className="text-sm text-muted">
                  {s.total}/{DECK_RULES.size} cartas · {s.byType.ninja} Ninja · {s.byType.jutsu} Jutsu ·{' '}
                  {s.byType.mission} Missão
                  {s.reinforcement > 0 && ` · +${s.reinforcement} no Reforço`}
                </p>
                <div className="mt-auto flex gap-2 text-sm">
                  <Link
                    href={`/decks/${deck.id}`}
                    className="rounded-md bg-surface-2 px-3 py-1.5 hover:bg-border"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => deckActions.duplicate(deck.id)}
                    className="rounded-md px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-text"
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setShare({ title: `Compartilhar "${deck.name}"`, payload: { kind: 'deck', deck } })
                    }
                    className="rounded-md px-3 py-1.5 text-muted hover:bg-surface-2 hover:text-text"
                  >
                    Compartilhar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir o deck "${deck.name}"?`)) deckActions.remove(deck.id);
                    }}
                    className="ml-auto rounded-md px-3 py-1.5 text-muted hover:bg-danger/15 hover:text-danger"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ShareDialog request={share} onClose={() => setShare(null)} />
      <ImportDialog open={importing} onClose={() => setImporting(false)} />
    </div>
  );
}
