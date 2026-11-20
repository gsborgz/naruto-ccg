import { NextResponse } from 'next/server';
import { contentErrorResponse } from '@/lib/content/http';
import { ensureContent } from '@/lib/content/server';

/**
 * Versão atual do conteúdo (cartas, layouts, ícones e imagens). O navegador consulta ao abrir o app e depois busca
 * `/api/content/<versão>`, que fica em cache.
 */
export async function GET() {
  try {
    const { version } = await ensureContent();
    return NextResponse.json({ version }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return contentErrorResponse(e);
  }
}
