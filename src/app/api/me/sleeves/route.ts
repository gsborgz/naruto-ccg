import type { NextRequest } from 'next/server';
import { deleteSleeve, saveSleeve } from '@/lib/sleeves/store';
import { isSleeveId, parseSleeve } from '@/lib/sleeves/types';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/** Sleeves: todos veem e usam todos; só quem criou grava e exclui (a lista vem em `GET /api/me`). */

/** Grava um sleeve do jogador (`{ sleeve, author }`: novo ou alterado). */
export async function PUT(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    const sleeve = parseSleeve(body.sleeve);
    if (!sleeve) throw new PlayerError(400, 'Sleeve inválido.');
    const author = typeof body.author === 'string' ? body.author.trim().slice(0, 40) : '';
    await saveSleeve(owner, sleeve, author);
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

/** Exclui um sleeve do jogador (`{ id }`). Os decks que o usavam voltam ao verso padrão. */
export async function DELETE(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const { id } = await readBody(request);
    if (!isSleeveId(id)) throw new PlayerError(400, 'Sleeve inválido.');
    await deleteSleeve(owner, id.toLowerCase());
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
