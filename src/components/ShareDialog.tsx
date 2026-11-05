'use client';

import { useEffect, useState } from 'react';
import type { SharePayload } from '@/lib/deckShare';
import { createShare } from '@/lib/shareClient';
import { Dialog } from './Dialog';

export interface ShareRequest {
  title: string;
  payload: SharePayload;
}

type State = { status: 'loading' } | { status: 'done'; id: string } | { status: 'error'; message: string };

/** Gera o código (UUID) de um deck ou da coleção e mostra com botão de copiar. */
export function ShareDialog({ request, onClose }: { request: ShareRequest | null; onClose: () => void }) {
  const [state, setState] = useState<State>({ status: 'loading' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!request) return;
    let cancelled = false;
    setState({ status: 'loading' });
    setCopied(false);
    createShare(request.payload)
      .then((id) => {
        if (!cancelled) setState({ status: 'done', id });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ status: 'error', message: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [request]);

  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const count = request ? (request.payload.kind === 'deck' ? 1 : request.payload.decks.length) : 0;

  return (
    <Dialog open={request !== null} onClose={onClose} title={request?.title ?? ''}>
      <p className="text-sm text-muted">
        Envie este código para um amigo. Ele pode usá-lo em <strong className="text-text">Importar</strong>, na tela
        Meus decks, para receber uma cópia {count === 1 ? 'do deck' : `dos ${count} decks`}. O código guarda o deck
        como está agora: alterações feitas depois não aparecem para quem importar.
      </p>
      {state.status === 'loading' && <p className="text-sm text-muted">Gerando código…</p>}
      {state.status === 'error' && <p className="text-sm text-danger">{state.message}</p>}
      {state.status === 'done' && (
        <div className="flex gap-2">
          <input
            readOnly
            value={state.id}
            onFocus={(e) => e.target.select()}
            aria-label="Código de compartilhamento"
            className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm"
          />
          <button
            type="button"
            onClick={() => copy(state.id)}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong"
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      )}
    </Dialog>
  );
}
