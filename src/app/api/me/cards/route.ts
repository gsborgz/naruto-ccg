import type { NextRequest } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { ensureContent, invalidateContent } from '@/lib/content/server';
import { deleteOwnCard, saveOwnCard } from '@/lib/customCards/store';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/**
 * Grava uma carta do criador do jogador (`{ card, author }`), com as artes já no Vercel Blob. Se ela é o design padrão
 * de uma carta do catálogo, o conteúdo do jogo muda de versão (`contentChanged`).
 */
export async function PUT(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    await ensureContent();
    const author = typeof body.author === 'string' ? body.author : '';
    const { card, contentChanged } = await saveOwnCard(owner, body.card, author, { knownCatalog: (id) => CARDS_BY_ID.has(id) });
    if (contentChanged) invalidateContent();
    return json({ card, contentChanged });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

/** Exclui uma carta do jogador (`{ id }`): sai dos decks dele, e a arte sai do Blob se nada mais a usa. */
export async function DELETE(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    if (typeof body.id !== 'string' || !/^[A-Za-z0-9-]{1,64}$/.test(body.id)) throw new PlayerError(400, 'Carta inválida.');
    const { contentChanged } = await deleteOwnCard(owner, body.id);
    if (contentChanged) invalidateContent();
    return json({ contentChanged });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
