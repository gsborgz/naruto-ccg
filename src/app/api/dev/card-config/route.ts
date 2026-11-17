import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';

const CARD_MAKER_DIR = path.join(process.cwd(), 'src', 'lib', 'cardMaker');

/**
 * Só em desenvolvimento (`next dev`): grava as edições do editor de layouts (`/criar/layouts`) nos arquivos de
 * configuração dos layouts e dos ícones (src/lib/cardMaker/layouts/ e icons/). Em produção a rota não existe (404).
 *
 * Corpo: `{ changes: [{ target, path, value }] }`, agrupadas por arquivo e aplicadas com `applyConfigEdits`.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const { applyConfigEdits, configFile } = await import('@/lib/cardMaker/devConfigEdit');
  type Change = { target: Parameters<typeof configFile>[0]; path: string[]; value: number | string | boolean | (number | string)[] };
  const validValue = (v: unknown): boolean =>
    (typeof v === 'number' && Number.isFinite(v)) || typeof v === 'string' || typeof v === 'boolean';

  const body = (await request.json().catch(() => null)) as { changes?: Change[] } | null;
  const changes = Array.isArray(body?.changes) ? body.changes : [];
  const valid = (c: Change) =>
    Array.isArray(c?.path) &&
    c.path.length > 0 &&
    c.path.every((k) => typeof k === 'string' && /^[\w-]+$/.test(k)) &&
    (Array.isArray(c.value) ? c.value.every((v) => typeof v !== 'boolean' && validValue(v)) : validValue(c.value));
  if (!changes.length || !changes.every(valid)) return NextResponse.json({ message: 'Edições inválidas' }, { status: 400 });

  const byFile = new Map<string, Change[]>();
  try {
    for (const c of changes) {
      const file = configFile(c.target);
      byFile.set(file, [...(byFile.get(file) ?? []), c]);
    }
    const written: string[] = [];
    for (const [file, list] of byFile) {
      const full = path.join(CARD_MAKER_DIR, file);
      const source = await readFile(full, 'utf8');
      const edited = applyConfigEdits(source, list);
      if (edited !== source) {
        await writeFile(full, edited, 'utf8');
        written.push(file);
      }
    }
    return NextResponse.json({ written });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : String(err) }, { status: 422 });
  }
}
