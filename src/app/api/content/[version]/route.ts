import { NextResponse } from 'next/server';
import { SEED_CARDS } from '@/data/sets/index';
import { contentErrorResponse } from '@/lib/content/http';
import { ensureContent } from '@/lib/content/server';
import type { Card } from '@/models/card';

/**
 * O conteúdo inteiro numa versão. Se a versão pedida é a atual, a resposta fica em cache para sempre (no navegador e
 * na CDN), porque cada gravação gera uma versão nova. Versão antiga: devolve a atual sem cache (o navegador usa o
 * `version` da resposta).
 *
 * Junta o nome impresso (inglês, de src/data/sets/) das cartas em que ele difere do nome do conteúdo (`namesEn`), para
 * a busca achar as cartas pelos dois nomes.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ version: string }> }) {
  try {
    const { version } = await params;
    const content = await ensureContent();
    const current = String(content.version) === version;
    return NextResponse.json(
      { ...content, namesEn: namesEnFor(content.version, content.cards) },
      { headers: { 'Cache-Control': current ? 'public, max-age=31536000, s-maxage=31536000, immutable' : 'no-store' } },
    );
  } catch (e) {
    return contentErrorResponse(e);
  }
}

let cached: { version: number; names: Record<string, string> } | null = null;

function namesEnFor(version: number, cards: Card[]): Record<string, string> {
  if (cached?.version === version) return cached.names;
  const current = new Map(cards.map((c) => [c.id, c.name]));
  const names: Record<string, string> = {};
  for (const c of SEED_CARDS) {
    const name = current.get(c.id);
    if (name !== undefined && name !== c.name) names[c.id] = c.name;
  }
  cached = { version, names };
  return names;
}
