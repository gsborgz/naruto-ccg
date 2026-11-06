'use client';

import { useState } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { DECK_RULES, summarizeDeck } from '@/lib/deckRules';
import { sharedDecks, type SharedDeck } from '@/lib/deckShare';
import { deckActions } from '@/lib/deckStore';
import { loadShare } from '@/lib/shareClient';
import { Dialog } from './Dialog';

const lookup = (id: string) => CARDS_BY_ID.get(id);

/** Busca um código compartilhado e adiciona os decks dele à lista do usuário (sem apagar nada). */
export function ImportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<SharedDeck[] | null>(null);

  const close = () => {
    setCode('');
    setError(null);
    setFound(null);
    setBusy(false);
    onClose();
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFound(null);
    try {
      setFound(sharedDecks(await loadShare(code)));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = () => {
    if (!found) return;
    deckActions.importDecks(found);
    close();
  };

  return (
    <Dialog open={open} onClose={close} title="Importar decks">
      <form onSubmit={search} className="flex flex-col gap-2">
        <label htmlFor="share-code" className="text-sm text-muted">
          Cole o código de um deck ou de uma coleção compartilhada.
        </label>
        <div className="flex gap-2">
          <input
            id="share-code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
              setFound(null);
            }}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="shrink-0 rounded-lg bg-surface-2 px-4 py-2 text-sm font-semibold hover:bg-border disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Buscando…' : 'Buscar'}
          </button>
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
      </form>

      {found && (
        <div className="flex flex-col gap-3">
          <ul className="max-h-64 divide-y divide-border overflow-y-auto rounded-lg border border-border">
            {found.map((d, i) => {
              const s = summarizeDeck(d.cards, lookup);
              return (
                <li key={i} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                  <span className="truncate font-medium">{d.name}</span>
                  <span className="shrink-0 text-muted">
                    {s.total}/{DECK_RULES.size} cartas
                    {s.reinforcement > 0 && ` + ${s.reinforcement} Reforço`}
                  </span>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={confirmImport}
            className="self-end rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong"
          >
            {found.length === 1 ? 'Importar deck' : `Importar ${found.length} decks`}
          </button>
        </div>
      )}
    </Dialog>
  );
}
