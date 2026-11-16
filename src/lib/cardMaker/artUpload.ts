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
 * A arte é tratada (`compressImage`) e enviada assim que entra no criador; sem conexão ou sem o Blob configurado,
 * ela fica como data URL no localStorage e é enviada depois (ao abrir o site, ao levar o deck para uma sala ou ao
 * compartilhar).
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

/**
 * Garante que as artes da carta estão no Blob (as que ainda são data URL são tratadas e enviadas) e grava a carta
 * atualizada no criador. Lança erro se o envio falhar.
 */
export async function ensureCardArtUploaded(card: CustomCard): Promise<CustomCard> {
  const art = await uploadLayer(card.art, false);
  const artFront = card.artFront && (await uploadLayer(card.artFront, true));
  if (art === card.art && artFront === card.artFront) return card;
  const next: CustomCard = { ...card, art, ...(artFront && { artFront }) };
  // Grava só os endereços novos, sem desfazer o que mudou na carta enquanto a imagem subia.
  const current = readCustomCards().find((c) => c.id === card.id);
  if (current) {
    customCardActions.save({
      ...current,
      ...(current.art.src === card.art.src && { art: { ...current.art, src: art.src } }),
      ...(artFront && current.artFront?.src === card.artFront?.src && { artFront: { ...current.artFront!, src: artFront.src } }),
    });
  }
  return next;
}

/**
 * Trata as artes antigas do criador (até 1500 px, JPEG) e as envia para o Blob. Roda uma vez por carregamento do
 * site, em segundo plano. Sem conexão ou sem Blob, ao menos a arte é recomprimida no localStorage.
 */
export async function migrateStoredArt(): Promise<void> {
  for (const card of readCustomCards()) {
    if (!card.art.src?.startsWith('data:') && !card.artFront?.src?.startsWith('data:')) continue;
    try {
      await ensureCardArtUploaded(card);
    } catch {
      // Sem envio: ao menos reduz o peso no localStorage.
      try {
        const compress = async (a: CustomCardArt | undefined, transparent: boolean) =>
          a?.src?.startsWith('data:') && !isCompressed(a.src) ? { ...a, src: await compressImage(a.src, { transparent }) } : a;
        const art = await compress(card.art, false);
        const artFront = await compress(card.artFront, true);
        if (art !== card.art || artFront !== card.artFront) {
          const current = readCustomCards().find((c) => c.id === card.id);
          if (current && current.art.src === card.art.src && current.artFront?.src === card.artFront?.src) {
            customCardActions.save({ ...current, art: art!, ...(artFront && { artFront }) });
          }
        }
      } catch {
        // Imagem que não abre: fica como está.
      }
    }
  }
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
