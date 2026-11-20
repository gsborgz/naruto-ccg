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
 *
 * Para nada ficar no Blob sem uso, o servidor sabe quais artes cada carta criada usa (`syncCardArtRefs`): ao trocar a
 * arte e salvar, ou ao excluir a carta, a que saiu é apagada se nada mais a usa.
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

/**
 * Envia a arte (data URL já tratado) e devolve o endereço público dela no Blob. Com `cardId` (carta criada), ela já
 * fica como usada pela carta; sem (arte alternativa), é apagada em um dia se nada passar a usá-la.
 */
export async function uploadArt(dataUrl: string, cardId?: string): Promise<string> {
  const { url } = await request<{ url: string }>('/api/art', { method: 'POST', body: JSON.stringify({ data: dataUrl, cardId }) });
  return url;
}

const blobArtsOf = (card: CustomCard | null | undefined): string[] =>
  card ? [...new Set([card.art.src, card.artFront?.src].filter((src): src is string => isBlobArt(src)))] : [];

/**
 * Diz ao servidor quais artes a carta `cardId` usa agora (`card` = null: nenhuma, a carta saiu). As que ela usava
 * (`previous`) e saíram são apagadas do Blob se nada mais as usa.
 */
export async function syncCardArtRefs(cardId: string, card: CustomCard | null, previous?: CustomCard | null): Promise<void> {
  const urls = blobArtsOf(card);
  // Outra carta deste navegador com a mesma arte: não pede para apagar (vale para as salvas antes das referências).
  const others = new Set(readCustomCards().filter((c) => c.id !== cardId).flatMap(blobArtsOf));
  const had = blobArtsOf(previous);
  if (!urls.length && !had.length) return;
  const prev = had.filter((u) => !others.has(u));
  await request('/api/art', { method: 'PUT', body: JSON.stringify({ cardId, urls, previous: prev }) });
}

const SYNCED_KEY = 'naruto-ccg:art-refs-synced';

/**
 * Uma vez por navegador: registra no servidor as artes das cartas criadas salvas antes das referências, para elas não
 * serem apagadas por engano quando outra carta com a mesma imagem sair.
 */
export async function syncAllCardArtRefs(): Promise<void> {
  try {
    if (localStorage.getItem(SYNCED_KEY)) return;
  } catch {
    return;
  }
  const results = await Promise.allSettled(readCustomCards().map((c) => syncCardArtRefs(c.id, c)));
  if (results.every((r) => r.status === 'fulfilled')) {
    try {
      localStorage.setItem(SYNCED_KEY, '1');
    } catch {
      // sem localStorage: tenta de novo na próxima vez
    }
  }
}

/** Trata (se ainda não foi) e envia uma camada de arte que ainda é data URL. */
async function uploadLayer(art: CustomCardArt, transparent: boolean, cardId: string): Promise<CustomCardArt> {
  if (!art.src?.startsWith('data:')) return art;
  const data = isCompressed(art.src) ? art.src : await compressImage(art.src, { transparent });
  return { ...art, src: await uploadArt(data, cardId) };
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
  const art = await uploadLayer(card.art, false, card.id);
  const artFront = card.artFront && (await uploadLayer(card.artFront, true, card.id));
  if (art === card.art && artFront === card.artFront) return card;
  return { ...card, art, ...(artFront && { artFront }) };
}


/**
 * Exclui a carta criada de vez: tira de todos os decks deste navegador (eles ficam inválidos até completar de novo),
 * apaga do criador e apaga do Blob as artes dela que nada mais usa (outra carta criada, de qualquer navegador que a
 * registrou, ou uma arte alternativa).
 */
export async function deleteCustomCard(card: CustomCard): Promise<void> {
  deckActions.removeCardEverywhere(customDeckCardId(card.id));
  customCardActions.remove(card.id);
  // Apagar do Blob é o último passo: se falhar (sem conexão), a carta já foi excluída.
  await syncCardArtRefs(card.id, null, card).catch(() => undefined);
}
