'use client';

import { useState } from 'react';
import { safeNextPath } from '@/lib/sitePassword';

/** Pede a senha do site (env `SITE_PASSWORD`) uma vez; o navegador guarda o acesso num cookie. */
export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/entrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? 'Não foi possível entrar.');
      }
      // Recarrega a página de destino inteira, já com o cookie.
      window.location.replace(safeNextPath(new URLSearchParams(window.location.search).get('next')));
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto mt-16 flex max-w-sm flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <div>
        <h1 className="text-xl font-bold">Entrar</h1>
        <p className="text-sm text-muted">Digite a senha para acessar. Ela fica salva neste navegador.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          autoFocus
          autoComplete="current-password"
          aria-label="Senha"
          placeholder="Senha"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted"
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={!password || busy}
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
