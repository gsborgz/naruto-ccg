import { NextResponse, type NextRequest } from 'next/server';
import { CustomCardError } from './customCards/store.ts';
import { DeckError } from './decks/store.ts';
import { ContentError } from './content/store.ts';
import { ArtError } from './artStore.ts';
import { ThemeError } from './themes/store.ts';
import { CatalogError } from './cloud/sharedCatalog.ts';
import { hashToken } from './rooms/store.ts';

/**
 * Rotas do jogador (decks, cartas criadas, temas da arena e sleeves na nuvem). O jogador é a identidade anônima do navegador (a das salas):
 * `X-Player-Token` leva o token, e o servidor guarda só o hash dele.
 */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class PlayerError extends Error {
  readonly status: 400 | 401;
  constructor(status: 400 | 401, message: string) {
    super(message);
    this.status = status;
  }
}

/** Hash do token do jogador (dono dos decks e das cartas). */
export function playerOf(request: NextRequest): string {
  const token = request.headers.get('x-player-token');
  if (!token || !UUID.test(token)) throw new PlayerError(401, 'Identidade do jogador inválida. Recarregue a página.');
  return hashToken(token);
}

/** O mesmo, mas opcional (rotas que qualquer um lê). */
export function optionalPlayerOf(request: NextRequest): string | undefined {
  const token = request.headers.get('x-player-token');
  return token && UUID.test(token) ? hashToken(token) : undefined;
}

export async function readBody(request: NextRequest): Promise<Record<string, unknown>> {
  const json: unknown = await request.json().catch(() => null);
  if (typeof json !== 'object' || json === null || Array.isArray(json)) throw new PlayerError(400, 'Requisição inválida.');
  return json as Record<string, unknown>;
}

export function playerErrorResponse(e: unknown): NextResponse {
  if (e instanceof PlayerError || e instanceof CustomCardError || e instanceof DeckError || e instanceof ContentError || e instanceof ArtError || e instanceof ThemeError || e instanceof CatalogError) {
    return NextResponse.json({ message: e.message }, { status: e.status });
  }
  console.error(e);
  return NextResponse.json({ message: 'Erro inesperado no servidor.' }, { status: 500 });
}

const NO_STORE = { 'Cache-Control': 'no-store' };

export function json(data: unknown): NextResponse {
  return NextResponse.json(data, { headers: NO_STORE });
}
