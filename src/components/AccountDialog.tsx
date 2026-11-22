'use client';

import { useState } from 'react';
import { accountCode, switchAccount } from '@/lib/cloud/library';
import { Dialog } from './Dialog';

/**
 * Código da conta: os decks e as cartas criadas ficam na nuvem, ligados à identidade anônima deste navegador. O código
 * abre os mesmos dados em outro navegador (e é o que permite recuperá-los se este navegador for limpo).
 */
export function AccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mine = open ? accountCode() : '';

  const close = () => {
    setCode('');
    setError(null);
    setCopied(false);
    onClose();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(mine);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const use = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !confirm(
        'Usar este código neste navegador? Você passa a ver os decks e as cartas daquela conta. Os desta conta continuam na nuvem: guarde o código atual para voltar a eles.',
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await switchAccount(code);
      close();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} title="Código da conta">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">
            Seus decks e suas cartas criadas ficam na nuvem, ligados a este código. Use-o para abrir tudo em outro
            navegador e guarde-o: sem ele, quem limpa os dados do navegador perde o acesso.
          </p>
          <div className="flex gap-2">
            <code className="min-w-0 flex-1 truncate rounded-lg bg-surface-2 px-3 py-2 text-sm">{mine}</code>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
            >
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
        <form onSubmit={use} className="flex flex-col gap-2 border-t border-border pt-4">
          <label htmlFor="account-code" className="text-sm text-muted">
            Usar o código de outro navegador
          </label>
          <div className="flex gap-2">
            <input
              id="account-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy || !code.trim()}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Abrindo…' : 'Usar'}
            </button>
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
        </form>
      </div>
    </Dialog>
  );
}
