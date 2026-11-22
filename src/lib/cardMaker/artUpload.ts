'use client';

import { cloudRequest } from '../cloud/library.ts';
import { compressImage, isCompressed } from '../images/compressImage.ts';
import { deckActions } from '../deckStore.ts';
import { customDeckCardId } from './customIds.ts';
import type { CustomCard, CustomCardArt } from './model.ts';
import { customCardActions } from './store.ts';

/**
 * Artes das cartas criadas no Vercel Blob, do lado do navegador (docs/DEPLOY.md, "Artes das cartas criadas").
 * A arte é tratada (`compressImage`) ao entrar no criador e só vai para o servidor quando o jogador clica em
 * **Salvar** (`uploadCardArt`). Nada é enviado sozinho.
 *
 * Para nada ficar no Blob sem uso, o servidor conta quais artes cada carta criada usa (ao gravar e ao excluir a carta,
 * `src/lib/customCards/keys.ts`): a arte trocada ou da carta excluída é apagada se nada mais a usa.
 */

/**
 * Envia a arte (data URL já tratado) e devolve o endereço público dela no Blob. Com `cardId` (carta criada), ela já
 * fica como usada pela carta; sem (versão da aba Editar), é apagada em um dia se nenhuma carta passar a usá-la.
 */
export async function uploadArt(dataUrl: string, cardId?: string): Promise<string> {
  const { url } = await cloudRequest<{ url: string }>('/api/art', { method: 'POST', body: JSON.stringify({ data: dataUrl, cardId }) });
  return url;
}

/** Trata (se ainda não foi) e envia uma camada de arte que ainda é data URL. */
async function uploadLayer(art: CustomCardArt, transparent: boolean, cardId: string): Promise<CustomCardArt> {
  if (!art.src?.startsWith('data:')) return art;
  const data = isCompressed(art.src) ? art.src : await compressImage(art.src, { transparent });
  return { ...art, src: await uploadArt(data, cardId) };
}

/** A carta tem arte que ainda não foi enviada ao servidor (só está na tela)? */
export function hasPendingArt(card: CustomCard): boolean {
  return !!card.art.src?.startsWith('data:') || !!card.artFront?.src?.startsWith('data:');
}

/**
 * Envia para o Blob as artes da carta que ainda são data URL (tratando as antigas, de antes do `compressImage`) e
 * devolve a carta com os endereços. Não grava a carta: quem chama (o **Salvar** do criador) grava. Lança erro se o
 * envio falhar.
 */
export async function uploadCardArt(card: CustomCard): Promise<CustomCard> {
  const art = await uploadLayer(card.art, false, card.id);
  const artFront = card.artFront && (await uploadLayer(card.artFront, true, card.id));
  if (art === card.art && artFront === card.artFront) return card;
  return { ...card, art, ...(artFront && { artFront }) };
}

/**
 * Exclui a carta criada de vez: o servidor tira dos decks do jogador (eles ficam inválidos até completar de novo), apaga
 * a carta e apaga do Blob as artes dela que nada mais usa. Uma alter excluída some dos decks que a escolheram (a carta
 * volta para a impressa).
 */
export async function deleteCustomCard(card: CustomCard): Promise<void> {
  deckActions.forgetCardEverywhere(customDeckCardId(card.id));
  await customCardActions.remove(card.id);
}
