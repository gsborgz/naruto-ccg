import { NextResponse } from 'next/server';
import { contentErrorResponse } from '@/lib/content/http';
import { ensureContent } from '@/lib/content/server';

/**
 * O conteúdo inteiro numa versão. Se a versão pedida é a atual, a resposta fica em cache para sempre (no navegador e
 * na CDN), porque cada gravação gera uma versão nova. Versão antiga: devolve a atual sem cache (o navegador usa o
 * `version` da resposta).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ version: string }> }) {
  try {
    const { version } = await params;
    const content = await ensureContent();
    const current = String(content.version) === version;
    return NextResponse.json(content, {
      headers: { 'Cache-Control': current ? 'public, max-age=31536000, s-maxage=31536000, immutable' : 'no-store' },
    });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
