'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { summarizeDeck } from '@/lib/deckRules';
import { useDecks } from '@/lib/deckStore';
import { NICKNAME_MAX } from '@/lib/rooms/model';
import { getIdentity, rememberNickname } from '@/lib/rooms/client';

const lookup = (id: string) => CARDS_BY_ID.get(id);

const field =
  'w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm placeholder:text-muted disabled:opacity-60';

/** Decks salvos que seguem as regras de montagem (só esses podem ir para uma sala). */
export function useValidDecks() {
  const decks = useDecks();
  return useMemo(
    () => (decks === null ? null : decks.filter((d) => summarizeDeck(d.cards, lookup).isValid)),
    [decks],
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
        Você não tem nenhum deck válido (50 cartas, até 3 por nome).{' '}
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

/** Apelido, usado para criar e para entrar numa sala (o deck é escolhido dentro da sala). */
export function NicknameForm({
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
  const [nickname, setNickname] = useState('');
  // Preenche com o último apelido depois de montar (o localStorage não existe no servidor).
  useEffect(() => setNickname((n) => n || getIdentity().nickname), []);
  const canSubmit = !busy && nickname.trim().length > 0;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        rememberNickname(nickname.trim());
        onSubmit(nickname.trim());
      }}
    >
      <label className="flex flex-col gap-1 text-sm text-muted">
        Apelido
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={NICKNAME_MAX}
          placeholder="Como o oponente vai te ver"
          className={field}
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? 'Aguarde…' : submitLabel}
      </button>
    </form>
  );
}
