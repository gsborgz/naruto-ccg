'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AccountDialog } from '@/components/AccountDialog';
import { ImportDialog } from '@/components/ImportDialog';
import { ReturnToRoom } from '@/components/ReturnToRoom';
import { ShareDialog, type ShareRequest } from '@/components/ShareDialog';
import { hasCustomCards } from '@/lib/cardMaker/customIds';
import { DECK_RULES, summarizeDeck } from '@/lib/deckRules';
import { useLibraryError } from '@/lib/cloud/library';
import { deckActions, useDecks } from '@/lib/deckStore';
import { useCardCatalog } from '@/lib/useCardCatalog';

export default function HomePage() {
  const decks = useDecks();
  const { lookup } = useCardCatalog();
  const router = useRouter();
  const [share, setShare] = useState<ShareRequest | null>(null);
  const [importing, setImporting] = useState(false);
  const [account, setAccount] = useState(false);
  const loadError = useLibraryError();

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
            {DECK_RULES.size} cartas, até {DECK_RULES.copiesPerCard} cópias de cada carta. Salvos na nuvem, no seu código da conta.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAccount(true)}
            className="rounded-lg px-4 py-2 font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
          >
            Código da conta
          </button>
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
        <p className={loadError ? 'text-danger' : 'text-muted'}>
          {loadError ? `Não foi possível carregar os decks: ${loadError}` : 'Carregando…'}
        </p>
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
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                  {s.tokens > 0 && ` · +${s.tokens} Tokens`}
                </p>
                {hasCustomCards(deck.cards) && (
                  <p
                    className="-mt-2 text-xs text-accent"
                    title="O deck tem cartas do criador: elas vão junto para as salas e para os códigos de compartilhamento."
                  >
                    Com cartas criadas
                  </p>
                )}
                <div className="mt-auto flex flex-wrap gap-2 text-sm">
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
      <AccountDialog open={account} onClose={() => setAccount(false)} />
    </div>
  );
}
