import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { LAYOUT_SIZE_FIELDS, NAME_SIZE_RANGE, setLayoutSize, type LayoutSizeField } from '@/lib/devCardLayoutEdit';

const SETS_DIR = path.join(process.cwd(), 'src', 'data', 'sets');

/**
 * Só em desenvolvimento (`next dev`): grava o ajuste do tamanho do nome de uma carta escaneada no arquivo da
 * coleção (src/data/sets/). Em produção a rota não existe (404).
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });

  const body = (await request.json().catch(() => null)) as { id?: unknown; field?: unknown; value?: unknown } | null;
  const id = typeof body?.id === 'string' ? body.id : '';
  const field = body?.field as LayoutSizeField;
  const value = typeof body?.value === 'number' ? Math.round(body.value * 10) / 10 : NaN;
  if (!CARDS_BY_ID.get(id)?.layout || !LAYOUT_SIZE_FIELDS.includes(field) || !(Math.abs(value) <= NAME_SIZE_RANGE)) {
    return NextResponse.json({ message: 'Ajuste inválido' }, { status: 400 });
  }

  for (const file of await readdir(SETS_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const full = path.join(SETS_DIR, file);
    const source = await readFile(full, 'utf8');
    if (!source.includes(`id: "${id}"`)) continue;
    const edited = setLayoutSize(source, id, field, value);
    if (edited === null) return NextResponse.json({ message: `Carta sem layout em ${file}` }, { status: 422 });
    if (edited !== source) await writeFile(full, edited, 'utf8');
    return NextResponse.json({ file, field, value });
  }
  return NextResponse.json({ message: 'Carta não encontrada nos arquivos das coleções' }, { status: 404 });
}
