'use client';

import { useEffect, useState } from 'react';
import { getIdentity, rememberNickname, saveNickname } from '@/lib/rooms/client';
import { NICKNAME_MAX, parseNickname } from '@/lib/rooms/model';
import { safeNextPath } from '@/lib/sitePassword';

const field = 'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted';

/**
 * Pede a senha do site (env `SITE_PASSWORD`) uma vez, com o apelido do jogador: só entra com os dois. O navegador
 * guarda o acesso num cookie, e o apelido vai para a conta (`saveNickname`); depois ele muda no campo do cabeçalho.
 */
export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Preenche com o apelido que o navegador já tem (o localStorage não existe no servidor).
  useEffect(() => setNickname((n) => n || getIdentity().nickname), []);
  const name = parseNickname(nickname);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) return;
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
      // Com o cookie já gravado, o apelido vai para a conta. Se falhar, fica no navegador e o cabeçalho leva para a
      // conta ao abrir o site (`syncNickname`).
      await saveNickname(name).catch(() => rememberNickname(name));
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
        <p className="text-sm text-muted">
          Digite a senha e o seu apelido. A senha fica salva neste navegador; o apelido você muda quando quiser, no topo
          da página.
        </p>
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
          className={field}
        />
        <input
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError(null);
          }}
          maxLength={NICKNAME_MAX}
          autoComplete="nickname"
          spellCheck={false}
          aria-label="Apelido"
          placeholder="Apelido (como os outros jogadores vão te ver)"
          className={field}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={!password || !name || busy}
          className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
