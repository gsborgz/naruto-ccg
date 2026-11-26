import type { NextRequest } from 'next/server';
import { deleteTheme, saveTheme, setActiveTheme } from '@/lib/themes/store';
import { parseTheme } from '@/lib/themes/types';
import { json, PlayerError, playerErrorResponse, playerOf, readBody } from '@/lib/player';

/** Temas da arena: todos veem e usam todos; só quem criou grava e exclui (a lista vem em `GET /api/me`). */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function themeId(x: unknown): string {
  if (typeof x !== 'string' || !UUID.test(x)) throw new PlayerError(400, 'Tema inválido.');
  return x.toLowerCase();
}

/** Grava um tema do jogador (`{ theme, author }`: novo ou alterado). */
export async function PUT(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const body = await readBody(request);
    const theme = parseTheme(body.theme);
    if (!theme) throw new PlayerError(400, 'Tema inválido.');
    const author = typeof body.author === 'string' ? body.author.trim().slice(0, 40) : '';
    await saveTheme(owner, theme, author);
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

/** Escolhe o tema em uso na arena deste jogador (`{ active }`: id de qualquer tema, ou `null` para o fundo padrão). */
export async function PATCH(request: NextRequest) {
  try {
    const owner = playerOf(request);
    const { active } = await readBody(request);
    await setActiveTheme(owner, active === null ? null : themeId(active));
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}

/** Exclui um tema do jogador (`{ id }`). */
export async function DELETE(request: NextRequest) {
  try {
    const owner = playerOf(request);
    await deleteTheme(owner, themeId((await readBody(request)).id));
    return json({ ok: true });
  } catch (e) {
    return playerErrorResponse(e);
  }
}
