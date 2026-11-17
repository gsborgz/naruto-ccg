import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';

const SETS_DIR = path.join(process.cwd(), 'src', 'data', 'sets');

/** Campos do `layout` da carta que a aba Layout do detalhe pode mudar. */
const EDITABLE = new Set(['layout', 'panelVariant', 'nameBanner', 'icons.type', 'icons.elements', 'icons.entrance', 'icons.hand', 'icons.attribute']);

/**
 * Só em desenvolvimento (`next dev`): grava o layout e os ícones de uma carta escaneada (aba Layout do detalhe da
 * carta) no bloco `layout` dela, no arquivo da coleção (src/data/sets/). Em produção a rota não existe (404).
 *
 * Corpo: `{ id, changes: [{ path, value }] }`; `value: null` tira o campo (volta ao padrão do layout).
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const { applyCardLayoutEdits } = await import('@/lib/cardMaker/devConfigEdit');
  type Change = { path: string[]; value: string | boolean | string[] | null };

  const body = (await request.json().catch(() => null)) as { id?: unknown; changes?: Change[] } | null;
  const id = typeof body?.id === 'string' ? body.id : '';
  const changes = Array.isArray(body?.changes) ? body.changes : [];
  const valid = (c: Change) =>
    Array.isArray(c?.path) &&
    EDITABLE.has(c.path.join('.')) &&
    (c.value === null ||
      typeof c.value === 'string' ||
      typeof c.value === 'boolean' ||
      (Array.isArray(c.value) && c.value.every((v) => typeof v === 'string')));
  if (!CARDS_BY_ID.get(id)?.layout || !changes.length || !changes.every(valid)) {
    return NextResponse.json({ message: 'Edição inválida' }, { status: 400 });
  }

  for (const file of await readdir(SETS_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const full = path.join(SETS_DIR, file);
    const source = await readFile(full, 'utf8');
    if (!source.includes(`id: "${id}"`)) continue;
    try {
      const edited = applyCardLayoutEdits(source, id, changes);
      if (edited !== source) await writeFile(full, edited, 'utf8');
      return NextResponse.json({ file });
    } catch (err) {
      return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 422 });
    }
  }
  return NextResponse.json({ message: 'Carta não encontrada nos arquivos das coleções' }, { status: 404 });
}
