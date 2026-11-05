'use client';

import { CARDS_BY_ID } from '@/data/cards';
import { isValidShareId, parseSharePayload, type SharedDeck, type SharePayload } from './deckShare';

const isKnownCard = (id: string) => CARDS_BY_ID.has(id);

const toShared = (d: SharedDeck): SharedDeck => ({ name: d.name, cards: d.cards });

/** Envia uma cópia do deck/coleção para o servidor e devolve o UUID gerado. */
export async function createShare(payload: SharePayload): Promise<string> {
  const body: SharePayload =
    payload.kind === 'deck'
      ? { kind: 'deck', deck: toShared(payload.deck) }
      : { kind: 'collection', decks: payload.decks.map(toShared) };
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
