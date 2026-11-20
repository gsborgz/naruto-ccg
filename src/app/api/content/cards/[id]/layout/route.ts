import { NextRequest, NextResponse } from 'next/server';
import { isCardLayoutChange, type ContentChange } from '@/lib/content/changes';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { invalidateContent } from '@/lib/content/server';
import { ContentError, saveCardLayoutChanges } from '@/lib/content/store';

/**
 * Grava o `layout` de uma carta escaneada (aba Layout do detalhe da carta e ajuste do tamanho do nome): o layout base,
 * o design, o nome e os ícones. Corpo: `{ changes: [{ path, value }] }`; `value: null` volta ao padrão do layout.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await readJson(request);
    const list = Array.isArray(body?.changes) ? (body.changes as unknown[]) : [];
    if (!/^[a-z0-9-]{1,40}$/.test(id) || !list.length || list.length > 50 || !list.every((c) => isCardLayoutChange(c))) {
      throw new ContentError(400, 'Edição inválida.');
    }
    // Tamanho do nome com uma casa decimal, como no slider.
    const changes = (list as ContentChange[]).map((c) =>
      typeof c.value === 'number' ? { ...c, value: Math.round(c.value * 10) / 10 } : c,
    );
    const version = await saveCardLayoutChanges(id, changes);
    invalidateContent();
    return NextResponse.json({ version });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
