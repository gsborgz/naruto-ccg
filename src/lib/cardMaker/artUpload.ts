'use client';

import { compressImage, isCompressed } from '../images/compressImage.ts';
import { deckActions } from '../deckStore.ts';
import { getIdentity } from '../rooms/client.ts';
import { customDeckCardId } from './customIds.ts';
import type { CustomCard, CustomCardArt } from './model.ts';
import { isBlobArt } from './sharedCard.ts';
import { customCardActions, readCustomCards } from './store.ts';

/**
 * Artes das cartas criadas no Vercel Blob, do lado do navegador (docs/DEPLOY.md, "Artes das cartas criadas").
 * A arte é tratada (`compressImage`) ao entrar no criador e só vai para o servidor quando o jogador clica em
 * **Salvar** (`uploadCardArt`). Nada é enviado sozinho.
 */

async function request<T>(url: string, init: RequestInit): Promise<T> {
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
  if (!res.ok) throw Object.assign(new Error(body?.message ?? 'Erro ao enviar a imagem.'), { status: res.status });
  return body as T;
}

/** Envia a arte (data URL já tratado) e devolve o endereço público dela no Blob. */
export async function uploadArt(dataUrl: string): Promise<string> {
  const { url } = await request<{ url: string }>('/api/art', { method: 'POST', body: JSON.stringify({ data: dataUrl }) });
  return url;
}

/** Apaga a arte do Blob (só funciona para quem a enviou primeiro). */
export async function deleteArt(url: string): Promise<void> {
  await request('/api/art', { method: 'DELETE', body: JSON.stringify({ url }) });
}

/** Trata (se ainda não foi) e envia uma camada de arte que ainda é data URL. */
async function uploadLayer(art: CustomCardArt, transparent: boolean): Promise<CustomCardArt> {
  if (!art.src?.startsWith('data:')) return art;
  const data = isCompressed(art.src) ? art.src : await compressImage(art.src, { transparent });
  return { ...art, src: await uploadArt(data) };
}

/** A carta tem arte que ainda não foi enviada ao servidor (só está neste navegador)? */
export function hasPendingArt(card: CustomCard): boolean {
  return !!card.art.src?.startsWith('data:') || !!card.artFront?.src?.startsWith('data:');
}

/**
 * Envia para o Blob as artes da carta que ainda são data URL (tratando as antigas, de antes do `compressImage`) e
 * devolve a carta com os endereços. Não grava nada: quem chama (o **Salvar** do criador) grava. Lança erro se o
 * envio falhar.
 */
export async function uploadCardArt(card: CustomCard): Promise<CustomCard> {
  const art = await uploadLayer(card.art, false);
  const artFront = card.artFront && (await uploadLayer(card.artFront, true));
  if (art === card.art && artFront === card.artFront) return card;
  return { ...card, art, ...(artFront && { artFront }) };
}


/**
 * Exclui a carta criada de vez: tira de todos os decks deste navegador (eles ficam inválidos até completar de novo),
 * apaga do criador e apaga as artes dela do Blob (as que nenhuma outra carta deste navegador usa e que foram
 * enviadas por este navegador). Cópias importadas por outras pessoas ficam sem a arte.
 */
export async function deleteCustomCard(card: CustomCard): Promise<void> {
  const others = readCustomCards().filter((c) => c.id !== card.id);
  const usedElsewhere = new Set(others.flatMap((c) => [c.art.src, c.artFront?.src]));
  const urls = [card.art.src, card.artFront?.src].filter(
    (src): src is string => isBlobArt(src) && !usedElsewhere.has(src),
  );
  deckActions.removeCardEverywhere(customDeckCardId(card.id));
  customCardActions.remove(card.id);
  // Apagar do Blob é o último passo: se falhar (sem conexão, imagem de outra pessoa), a carta já foi excluída.
  await Promise.allSettled([...new Set(urls)].map(deleteArt));
}
