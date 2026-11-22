import { NextResponse } from 'next/server';
import { ArtError } from '../artStore.ts';
import { ContentError } from './store.ts';

/** Resposta de erro das rotas do conteúdo (mensagem em português para o editor mostrar). */
export function contentErrorResponse(e: unknown): NextResponse {
  if (e instanceof ContentError || e instanceof ArtError) {
    return NextResponse.json({ message: e.message }, { status: e.status });
  }
  console.error(e);
  // O motivo vai junto (o site é fechado por senha): sem ele, só os logs da Vercel dizem o que houve.
  const detail = e instanceof Error ? e.message : String(e);
  return NextResponse.json({ message: `Erro ao acessar o conteúdo do jogo: ${detail}` }, { status: 500 });
}

/** Corpo JSON do pedido, ou `null` se não for um objeto JSON. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const body: unknown = await request.json().catch(() => null);
  return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
}
