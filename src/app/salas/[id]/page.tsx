'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeckSelect, NicknameForm, useValidDecks } from '@/components/PlayerSetup';
import { DECK_RULES } from '@/lib/deckRules';
import type { PlayerView, RoomView } from '@/lib/rooms/model';
import { useRoom } from '@/lib/rooms/useRoom';

const card = 'flex flex-col gap-4 rounded-xl border border-border bg-surface p-5';

function Notice({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {children && <div className="text-sm text-muted">{children}</div>}
      <Link href="/jogar" className="mt-2 text-sm text-accent hover:underline">
        Voltar para Jogar
      </Link>
    </div>
  );
}

/** Código da sala com botões de copiar o código e o link. */
function InviteBox({ id }: { id: string }) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const copy = async (what: 'code' | 'link') => {
    const text = what === 'code' ? id : `${window.location.origin}/salas/${id}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  };
  const btn = 'shrink-0 rounded-lg px-3 py-2 text-sm font-semibold';
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">Envie o código (ou o link) para seu oponente entrar:</p>
      <div className="flex flex-wrap gap-2">
        <input
          readOnly
          value={id}
          onFocus={(e) => e.target.select()}
          aria-label="Código da sala"
          className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm"
        />
        <button type="button" onClick={() => copy('code')} className={`${btn} bg-accent text-bg hover:bg-accent-strong`}>
          {copied === 'code' ? 'Copiado ✓' : 'Copiar código'}
        </button>
        <button type="button" onClick={() => copy('link')} className={`${btn} bg-surface-2 hover:bg-border`}>
          {copied === 'link' ? 'Copiado ✓' : 'Copiar link'}
        </button>
      </div>
    </div>
  );
}

function PlayerSlot({ player, isYou, label }: { player: PlayerView | undefined; isYou: boolean; label: string }) {
  if (!player) {
    return (
      <div className="flex min-h-28 flex-col justify-center gap-1 rounded-lg border border-dashed border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="animate-pulse text-muted">Aguardando oponente…</p>
      </div>
    );
  }
  return (
    <div className={`flex min-h-28 flex-col gap-1 rounded-lg border p-4 ${player.ready ? 'border-ok' : 'border-border'}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className="flex items-center gap-2 text-lg font-semibold">
        <span
          className={`size-2 shrink-0 rounded-full ${player.online ? 'bg-ok' : 'bg-muted'}`}
          title={player.online ? 'Online' : 'Offline'}
          aria-label={player.online ? 'Online' : 'Offline'}
        />
        <span className="truncate">{player.nickname}</span>
        {isYou && <span className="text-sm font-normal text-muted">(você)</span>}
      </p>
      <p className="truncate text-sm text-muted">
        {player.deckName ? `Deck: ${player.deckName} · ${player.deckSize}/${DECK_RULES.size}` : 'Ainda sem deck'}
      </p>
      <p className={`text-sm font-semibold ${player.ready ? 'text-ok' : 'text-muted'}`}>
        {player.ready ? '✓ Pronto' : player.deckName ? 'Não está pronto' : 'Escolhendo o deck…'}
      </p>
    </div>
  );
}

function Lobby({ view, room }: { view: RoomView; room: ReturnType<typeof useRoom> }) {
  const router = useRouter();
  const decks = useValidDecks();
  const host = view.players.find((p) => p.seat === 'host');
  const guest = view.players.find((p) => p.seat === 'guest');
  const me = view.you === 'host' ? host : guest;
  const starting = view.status === 'starting';

  const changeDeck = (deckId: string) => {
    const deck = decks?.find((d) => d.id === deckId);
    if (deck) room.act({ type: 'changeDeck', deck: { name: deck.name, cards: deck.cards } });
  };

  const leave = async () => {
    const msg =
      view.you === 'host' ? 'Encerrar a sala? Seu oponente também sai.' : 'Sair da sala? Você pode entrar de novo com o código.';
    if (!confirm(msg)) return;
    if (await room.act({ type: 'leave' })) router.push('/jogar');
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Sala de {host?.nickname ?? '…'}</h1>
        <p className="text-sm text-muted">
          {view.status === 'waiting'
            ? 'Esperando o oponente entrar.'
            : starting
              ? 'Os dois estão prontos.'
              : 'Cada um escolhe o deck e marca Pronto.'}
        </p>
      </div>

      {starting && (
        <div className="rounded-xl bg-ok/15 px-5 py-4 text-ok">
          <p className="font-semibold">Partida iniciada!</p>
          <p className="text-sm">O jogo será implementado na próxima etapa.</p>
        </div>
      )}

      {view.you === 'host' && view.status === 'waiting' && (
        <section className={card}>
          <InviteBox id={view.id} />
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-2">
        <PlayerSlot player={host} isYou={view.you === 'host'} label="Anfitrião" />
        <PlayerSlot player={guest} isYou={view.you === 'guest'} label="Convidado" />
      </section>

      {me && !starting && (
        <section className={card}>
          <div className="flex flex-col gap-1 text-sm text-muted">
            {me.deckName ? 'Seu deck (trocar desmarca o Pronto)' : 'Escolha seu deck para esta partida'}
            <DeckSelect
              value=""
              onChange={changeDeck}
              disabled={room.busy}
              placeholder={me.deckName ? `Atual: ${me.deckName}` : 'Escolha um deck…'}
            />
          </div>
          {room.actionError && <p className="text-sm text-danger">{room.actionError}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={room.busy || !me.deckName}
              onClick={() => room.act({ type: 'setReady', ready: !me.ready })}
              className={`rounded-lg px-5 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                me.ready ? 'bg-surface-2 hover:bg-border' : 'bg-ok text-bg hover:brightness-110'
              }`}
            >
              {me.ready ? 'Cancelar pronto' : 'Pronto'}
            </button>
            <span className="text-sm text-muted">
              {!me.deckName
                ? 'Escolha um deck para poder marcar Pronto.'
                : view.status === 'waiting'
                  ? 'A partida começa quando os dois estiverem prontos.'
                  : null}
            </span>
          </div>
        </section>
      )}

      <div>
        <button
          type="button"
          onClick={leave}
          disabled={room.busy}
          className="rounded-lg px-4 py-2 text-sm text-muted ring-1 ring-border hover:bg-danger/15 hover:text-danger"
        >
          {view.you === 'host' ? 'Encerrar sala' : 'Sair da sala'}
        </button>
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const room = useRoom(id);
  const { view, loadError } = room;

  if (!view) {
    if (loadError && loadError.status !== 0) return <Notice title={loadError.message} />;
    return <p className="text-muted">{loadError ? loadError.message : 'Carregando sala…'}</p>;
  }

  if (view.status === 'closed') {
    return <Notice title="Esta sala foi encerrada">O anfitrião saiu da sala. Crie uma nova para jogar.</Notice>;
  }

  if (!view.you) {
    const host = view.players.find((p) => p.seat === 'host');
    if (view.status !== 'waiting') return <Notice title="Sala cheia">Esta sala já tem dois jogadores.</Notice>;
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Sala de {host?.nickname}</h1>
          <p className="text-sm text-muted">Escolha seu apelido para entrar. O deck você escolhe lá dentro.</p>
        </div>
        <section className={card}>
          <NicknameForm submitLabel="Entrar na sala" busy={room.busy} error={room.actionError} onSubmit={room.join} />
        </section>
      </div>
    );
  }

  return (
    <>
      {loadError?.status === 0 && (
        <p className="mx-auto mb-4 max-w-4xl rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {loadError.message} Tentando reconectar…
        </p>
      )}
      <Lobby view={view} room={room} />
    </>
  );
}
