'use client';

import { CARDS } from '../../data/cards.ts';
import { cardImageUrl } from '../../models/card.ts';
import type { AltCardView } from '../altCards.ts';
import { getIdentity } from '../rooms/client.ts';
import type { CustomCard } from './model.ts';

/** Arte ainda só neste navegador (data URL): a carta só é publicada depois que a arte chega ao servidor. */
const hasPendingArt = (card: CustomCard) => !!card.art.src?.startsWith('data:') || !!card.artFront?.src?.startsWith('data:');

/**
 * Artes alternativas do lado do navegador (`src/lib/altCards.ts`): a carta do criador importada de uma carta do
 * catálogo é publicada ao salvar e sai da lista ao ser excluída; o detalhe da carta do catálogo lista as de todos.
 */

export type { AltCardView };

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'X-Player-Token': getIdentity().token },
    });
  } catch {
    throw new Error('Sem conexão com o servidor.');
  }
  const body = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!res.ok) throw new Error(body?.message ?? 'Erro nas artes alternativas.');
  return body as T;
}

/**
 * Carta do catálogo de onde a carta criada foi importada: `source` ou, nas cartas importadas antes desse campo, a da
 * imagem de comparação (`reference`).
 */
export function customCardSource(card: CustomCard): string | undefined {
  if (card.source) return card.source;
  if (!card.reference) return undefined;
  return CARDS.find((c) => cardImageUrl(c) === card.reference)?.id;
}

/** Publica (ou atualiza) a carta criada como arte alternativa da carta de origem. Sem origem, não faz nada. */
export async function publishAltCard(card: CustomCard): Promise<void> {
  const source = customCardSource(card);
  if (!source || hasPendingArt(card)) return;
  const { reference: _reference, ...rest } = card;
  await request('/api/alt-cards', {
    method: 'PUT',
    body: JSON.stringify({ card: { ...rest, source }, author: getIdentity().nickname }),
  });
}

/** Tira a carta criada da lista de artes alternativas (ela foi excluída). */
export async function unpublishAltCard(cardId: string): Promise<void> {
  await request('/api/alt-cards', { method: 'DELETE', body: JSON.stringify({ cardId }) });
}

/** As artes alternativas de uma carta do catálogo. */
export async function fetchAltCards(catalogId: string): Promise<AltCardView[]> {
  const { items } = await request<{ items: AltCardView[] }>(`/api/alt-cards?card=${encodeURIComponent(catalogId)}`);
  return items;
}
