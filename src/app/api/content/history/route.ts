import { NextRequest, NextResponse } from 'next/server';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { invalidateContent } from '@/lib/content/server';
import { ensureContent } from '@/lib/content/server';
import { ContentError, readHistory, restoreHistory } from '@/lib/content/store';
import { CONTENT_KINDS, HISTORY_SIZE, type ContentKind } from '@/lib/content/types';

function item(kind: unknown, id: unknown): { kind: ContentKind; id: string } {
  const validId = typeof id === 'string' && /^[\w:/.-]{1,200}$/.test(id) && !id.includes('..');
  if (!CONTENT_KINDS.includes(kind as ContentKind) || !validId) throw new ContentError(400, 'Item inválido.');
  return { kind: kind as ContentKind, id: id as string };
}

/**
 * Últimas versões de um item: `?kind=layout&id=layout-02`; ícone: `kind=icon&id=element:fire-02`; carta:
 * `kind=card&id=s01-n-001`.
 */
export async function GET(request: NextRequest) {
  try {
    const { kind, id } = item(request.nextUrl.searchParams.get('kind'), request.nextUrl.searchParams.get('id'));
    return NextResponse.json({ entries: await readHistory(kind, id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return contentErrorResponse(e);
  }
}

/** Restaura uma versão: `{ kind, id, index }` (0 = a mais recente do histórico). */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const { kind, id } = item(body?.kind, body?.id);
    const index = Number(body?.index);
    if (!Number.isInteger(index) || index < 0 || index >= HISTORY_SIZE) throw new ContentError(400, 'Versão inválida.');
    // Carta com o `layout` antigo no histórico: vira uma versão (precisa dos layouts carregados).
    await ensureContent();
    const version = await restoreHistory(kind, id, index);
    invalidateContent();
    return NextResponse.json({ version });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
