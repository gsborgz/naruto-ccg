'use client';

import { CARDS_BY_ID } from '@/data/cards';
import { withCustomCards } from '@/lib/cardMaker/customDeck';
import { readCustomCards } from '@/lib/cardMaker/store';
import { isValidShareId, parseSharePayload, type SharePayload } from './deckShare';
import type { Deck } from './decks/types';

/** O que compartilhar: decks da conta (o sleeve pelo id; vira o id e a imagem no envio). */
export type ShareSource = { kind: 'deck'; deck: Deck } | { kind: 'collection'; decks: Deck[] };

const isKnownCard = (id: string) => CARDS_BY_ID.has(id);

/**
 * Envia uma cópia do deck/coleção para o servidor e devolve o UUID gerado. As cartas criadas vão junto (as artes
 * são enviadas antes para o Vercel Blob; ver `withCustomCards`).
 */
export async function createShare(payload: ShareSource): Promise<string> {
  const custom = readCustomCards();
  const body: SharePayload =
    payload.kind === 'deck'
      ? { kind: 'deck', deck: await withCustomCards(payload.deck, custom) }
      : { kind: 'collection', decks: await Promise.all(payload.decks.map((d) => withCustomCards(d, custom))) };
  const res = await fetch('/api/shares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Não foi possível gerar o código de compartilhamento.');
  const { id } = (await res.json()) as { id: string };
  return id;
}

/** Busca um compartilhamento pelo UUID. Lança erro com mensagem amigável. */
export async function loadShare(rawId: string): Promise<SharePayload> {
  const id = rawId.trim();
  if (!isValidShareId(id)) throw new Error('Código inválido. Ele tem o formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.');
  const res = await fetch(`/api/shares/${id}`);
  if (res.status === 404) throw new Error('Nenhum deck encontrado com esse código.');
  if (!res.ok) throw new Error('Não foi possível carregar o código agora. Tente de novo.');
  const payload = parseSharePayload(await res.json(), isKnownCard);
  if (!payload) throw new Error('O conteúdo compartilhado tem cartas desconhecidas ou está corrompido.');
  return payload;
}
