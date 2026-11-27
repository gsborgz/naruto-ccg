'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { summarizeDeck } from '@/lib/deckRules';
import { useDecks } from '@/lib/deckStore';
import { useNickname } from '@/lib/rooms/client';
import { useCardCatalog } from '@/lib/useCardCatalog';

const field =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted disabled:opacity-60';

/**
 * Decks salvos que seguem as regras de montagem (só esses podem ir para uma sala). As cartas criadas deste
 * navegador contam: elas vão junto com o deck para a sala.
 */
export function useValidDecks() {
  const decks = useDecks();
  const { lookup } = useCardCatalog();
  return useMemo(
    () => (decks === null ? null : decks.filter((d) => summarizeDeck(d.cards, lookup).isValid)),
    [decks, lookup],
  );
}

/** Seletor de deck válido. Mostra o caminho para o montador quando não há nenhum. */
export function DeckSelect({
  value,
  onChange,
  disabled,
  placeholder = 'Escolha um deck…',
}: {
  value: string;
  onChange: (deckId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const decks = useValidDecks();
  if (decks === null) return <p className="text-sm text-muted">Carregando decks…</p>;
  if (decks.length === 0) {
    return (
      <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
        Você não tem nenhum deck válido (50 cartas, até 3 cópias de cada; Reforço com até 15).{' '}
        <Link href="/" className="font-semibold underline">
          Monte um em Meus decks
        </Link>
        .
      </p>
    );
  }
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Deck"
      className={field}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {decks.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name}
        </option>
      ))}
    </select>
  );
}

/**
 * Criar ou entrar numa sala com o apelido do cabeçalho (`NicknameField`; o deck é escolhido dentro da sala). Sem
 * apelido, o botão fica desligado e o aviso aponta para o campo.
 */
export function RoomEntryButton({
  submitLabel,
  busy,
  error,
  onSubmit,
}: {
  submitLabel: string;
  busy: boolean;
  error: string | null;
  onSubmit: (nickname: string) => void;
}) {
  const nickname = useNickname().trim();
  const canSubmit = !busy && nickname.length > 0;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        {nickname ? (
          <>
            Você entra como <strong className="text-text">{nickname}</strong> (o apelido do topo da página; mude a
            qualquer momento).
          </>
        ) : (
          <>
            Escolha seu apelido no campo <strong className="text-text">Apelido</strong>, no topo da página.
          </>
        )}
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => canSubmit && onSubmit(nickname)}
        className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? 'Aguarde…' : submitLabel}
      </button>
    </div>
  );
}
