import { NextRequest, NextResponse } from 'next/server';
import { setArtRefs } from '@/lib/artStore';
import { catalogCardArts } from '@/lib/cardMaker/catalogEdit';
import { parseCatalogCard } from '@/lib/content/cardValidation';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { ensureContent, invalidateContent } from '@/lib/content/server';
import { ContentError, readCard, saveCard } from '@/lib/content/store';

/**
 * Grava uma carta do catálogo editada pelo site (aba Editar do detalhe da carta). Corpo: `{ card }`, a carta inteira
 * no formato do catálogo (os textos em PT-BR); o id, a coleção, o número e a imagem ficam os gravados. As artes
 * enviadas para a carta (Vercel Blob) contam como usadas por ela (`catalog:<id>`); a que saiu é apagada se nada mais
 * a usa.
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
    const { version, previous } = await saveCard(parsed.card);
    invalidateContent();
    const arts = catalogCardArts(parsed.card);
    if (arts.length || catalogCardArts(previous).length) {
      await setArtRefs(`catalog:${id}`, arts).catch((e) => console.error('Falha ao registrar as artes da carta', e));
    }
    return NextResponse.json({ version, card: parsed.card });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
