'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NicknameForm } from '@/components/PlayerSetup';
import { ReturnToRoom } from '@/components/ReturnToRoom';
import { isValidShareId } from '@/lib/deckShare';
import { roomApi } from '@/lib/rooms/client';

/** Criar uma sala ou entrar numa com o código (docs/SALAS.md). */
export default function PlayPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const create = async (nickname: string) => {
    setBusy(true);
    setCreateError(null);
    try {
      const room = await roomApi.create(nickname);
      router.push(`/salas/${room.id}`);
    } catch (e) {
      setCreateError((e as Error).message);
      setBusy(false);
    }
  };

  const enter = (e: React.FormEvent) => {
    e.preventDefault();
    // Aceita o código puro ou o link inteiro da sala.
    const id = code.trim().split('/').filter(Boolean).pop() ?? '';
    if (!isValidShareId(id)) {
      setCodeError('Código inválido. Ele tem o formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.');
      return;
    }
    router.push(`/salas/${id.toLowerCase()}`);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <ReturnToRoom />
      <div>
        <h1 className="text-2xl font-bold">Jogar</h1>
        <p className="text-sm text-muted">Crie uma sala e mande o código para um amigo, ou entre na sala de alguém.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          <div>
            <h2 className="text-lg font-semibold">Criar sala</h2>
            <p className="text-sm text-muted">Você recebe um código para enviar ao oponente. O deck é escolhido dentro da sala.</p>
          </div>
          <NicknameForm submitLabel="Criar sala" busy={busy} error={createError} onSubmit={create} />
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          <div>
            <h2 className="text-lg font-semibold">Entrar numa sala</h2>
            <p className="text-sm text-muted">Cole o código ou o link que seu amigo enviou.</p>
          </div>
          <form onSubmit={enter} className="flex flex-col gap-3">
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError(null);
              }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              autoComplete="off"
              spellCheck={false}
              aria-label="Código da sala"
              className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm placeholder:text-muted"
            />
            {codeError && <p className="text-sm text-danger">{codeError}</p>}
            <button
              type="submit"
              disabled={!code.trim()}
              className="rounded-lg bg-surface-2 px-4 py-2 font-semibold hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
            >
              Ir para a sala
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
