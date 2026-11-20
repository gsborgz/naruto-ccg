import { NextRequest, NextResponse } from 'next/server';
import { ICON_GROUPS, type IconGroup } from '@/lib/cardMaker/icons';
import { isContentChange, type ContentChange } from '@/lib/content/changes';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { invalidateContent } from '@/lib/content/server';
import { ContentError, saveChanges } from '@/lib/content/store';

type Target = { kind: 'layout'; id: string } | { kind: 'icon'; group: IconGroup; id: string };

function isTarget(t: unknown): t is Target {
  if (!t || typeof t !== 'object') return false;
  const x = t as Record<string, unknown>;
  if (typeof x.id !== 'string' || !/^[a-z0-9-]{1,48}$/.test(x.id)) return false;
  // Os das coleções (layout-01 a layout-05) e os criados no editor.
  if (x.kind === 'layout') return /^layout-[a-z0-9][a-z0-9-]{0,39}$/.test(x.id);
  return x.kind === 'icon' && ICON_GROUPS.includes(x.group as IconGroup);
}

/**
 * Grava as edições do editor de layouts (`/criar/layouts` e a aba Layout do detalhe da carta) na configuração dos
 * layouts e dos ícones. Corpo: `{ changes: [{ target, path, value }] }`. Devolve a versão nova do conteúdo.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const list = Array.isArray(body?.changes) ? (body.changes as unknown[]) : [];
    if (!list.length || list.length > 500) throw new ContentError(400, 'Edições inválidas.');

    const byItem = new Map<string, { kind: 'layout' | 'icon'; id: string; changes: ContentChange[] }>();
    for (const raw of list) {
      const c = (raw ?? {}) as { target?: unknown; path?: unknown; value?: unknown };
      const change = { path: c.path, value: c.value };
      if (!isTarget(c.target) || !isContentChange(change)) throw new ContentError(400, 'Edições inválidas.');
      // O id é a chave do item: não muda por edição.
      if (change.path[0] === 'id') throw new ContentError(400, 'O id do layout ou do ícone não pode ser mudado.');
      const t = c.target;
      const id = t.kind === 'layout' ? t.id : `${t.group}:${t.id}`;
      const key = `${t.kind}/${id}`;
      const item = byItem.get(key) ?? { kind: t.kind, id, changes: [] };
      item.changes.push(change);
      byItem.set(key, item);
    }

    let version = 0;
    for (const item of byItem.values()) version = await saveChanges(item.kind, item.id, item.changes);
    invalidateContent();
    return NextResponse.json({ version, written: [...byItem.values()].map((i) => i.id) });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
