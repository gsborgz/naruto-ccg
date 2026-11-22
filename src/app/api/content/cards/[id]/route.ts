import { NextRequest, NextResponse } from 'next/server';
import { parseCatalogCard } from '@/lib/content/cardValidation';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { ensureContent, invalidateContent } from '@/lib/content/server';
import { ContentError, readCard, saveCard } from '@/lib/content/store';

/**
 * Grava uma carta do catálogo editada pelo site (aba Editar). Corpo: `{ card }`, com os textos (PT-BR) e os números; o
 * id, a coleção, o número e a imagem ficam os gravados. As cartas do catálogo não têm visual montado: mostram sempre a
 * impressa (as alters ficam nas cartas do criador).
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[a-z0-9-]{1,40}$/.test(id)) throw new ContentError(400, 'Carta inválida.');
    const body = await readJson(request);
    const original = await readCard(id);
    const content = await ensureContent();
    const parsed = parseCatalogCard(body?.card, original, new Set(Object.keys(content.layouts)));
    if (!parsed.ok) throw new ContentError(400, parsed.message);
    const { version } = await saveCard(parsed.card);
    invalidateContent();
    return NextResponse.json({ version });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
