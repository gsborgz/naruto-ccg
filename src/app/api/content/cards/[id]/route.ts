import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { parseCatalogCard } from '@/lib/content/cardValidation';
import { contentErrorResponse, readJson } from '@/lib/content/http';
import { ensureContent, invalidateContent } from '@/lib/content/server';
import { ContentError, readStoredCard, saveCard } from '@/lib/content/store';
import { readCustomEntries, SYSTEM_OWNER } from '@/lib/customCards/keys';
import { CustomCardError, saveOwnCard } from '@/lib/customCards/store';
import { optionalPlayerOf, playerErrorResponse } from '@/lib/player';

/**
 * Grava uma carta do catálogo editada pelo site. Corpo: `{ card, version? }`.
 * - `card`: os dados de jogo e os textos (PT-BR); o id, a coleção, o número e a imagem ficam os gravados. `card.design`
 *   escolhe uma versão existente como design padrão (Artes alternativas); sem `design` (e sem `version`), a carta volta
 *   para a impressa.
 * - `version` (aba Editar): a carta do criador com o visual editado. Ela atualiza a versão que a carta já usa, se for de
 *   quem editou ou do sistema; senão vira uma versão nova de quem editou. A carta passa a usar essa versão.
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[a-z0-9-]{1,40}$/.test(id)) throw new ContentError(400, 'Carta inválida.');
    const body = await readJson(request);
    const original = await readStoredCard(id);
    if (!original) throw new ContentError(404, 'Carta não encontrada.');
    const content = await ensureContent();
    const parsed = parseCatalogCard(body?.card, original, new Set(Object.keys(content.layouts)));
    if (!parsed.ok) throw new ContentError(400, parsed.message);
    const { layout: _layout, ...card } = parsed.card;

    if (body?.version !== undefined) {
      const editor = optionalPlayerOf(request);
      if (!editor) throw new ContentError(400, 'Identidade do jogador inválida. Recarregue a página.');
      const current = original.design ? (await readCustomEntries([original.design])).get(original.design) : undefined;
      const reuse = current && (current.owner === editor || current.owner === SYSTEM_OWNER) ? current.card : null;
      const raw = body.version as Record<string, unknown>;
      const now = new Date().toISOString();
      const version = {
        ...raw,
        id: reuse?.id ?? crypto.randomUUID(),
        source: id,
        createdAt: reuse?.createdAt ?? now,
        updatedAt: now,
      };
      const author = typeof body.author === 'string' ? body.author : '';
      const saved = await saveOwnCard(editor, version, author, { allowSystem: true, knownCatalog: (c) => CARDS_BY_ID.has(c) });
      card.design = saved.card.id;
    } else if (card.design && card.design !== original.design) {
      const entry = (await readCustomEntries([card.design])).get(card.design);
      if (!entry || entry.card.source !== id) throw new ContentError(404, 'Versão não encontrada para esta carta.');
    }

    const { version } = await saveCard(card);
    invalidateContent();
    return NextResponse.json({ version });
  } catch (e) {
    if (e instanceof CustomCardError) return playerErrorResponse(e);
    return contentErrorResponse(e);
  }
}
