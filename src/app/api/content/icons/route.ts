import { NextRequest, NextResponse } from 'next/server';
import { dropAssets } from '@/lib/content/assetStore';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { createIcon, deleteIcon } from '@/lib/content/icons';
import { invalidateContent } from '@/lib/content/server';
import { ContentError } from '@/lib/content/store';

/** Chave de um ícone (`<grupo>:<id>`, ex.: `element:fire-02`). */
const ICON_KEY = /^(type|type-variant|element|cost|chakra|attribute):[a-z0-9][a-z0-9-]{0,47}$/;

/**
 * Cria um ícone na aba Ícones do editor de layouts, cópia de outro (`{ base, name? }`; `name` é obrigatório no ícone
 * alternativo do tipo). O id novo é o próximo livre no grupo. Devolve `{ key, version }`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const base = body?.base;
    const name = typeof body?.name === 'string' ? body.name : undefined;
    if (typeof base !== 'string' || !ICON_KEY.test(base)) throw new ContentError(400, 'Ícone base inválido.');
    const result = await createIcon(base, name);
    invalidateContent();
    return NextResponse.json(result);
  } catch (e) {
    return contentErrorResponse(e);
  }
}

/** Exclui um ícone criado no editor (`{ key }`), se nada o usa; a imagem dele sai do Blob. */
export async function DELETE(request: NextRequest) {
  try {
    const body = await readJson(request);
    const key = body?.key;
    if (typeof key !== 'string' || !ICON_KEY.test(key)) throw new ContentError(400, 'Ícone inválido.');
    const { version, dropped } = await deleteIcon(key);
    invalidateContent();
    await dropAssets(dropped);
    return NextResponse.json({ version });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
