import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { CARDS_BY_ID } from '@/data/cards';
import { parseSharePayload, shareKey, type StoredShare } from '@/lib/deckShare';
import { getRedis } from '@/lib/redis';

const isKnownCard = (id: string) => CARDS_BY_ID.has(id);

/** Cria um compartilhamento (um deck ou a coleção inteira) e devolve o UUID. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const payload = parseSharePayload(body, isKnownCard);
  if (!payload) return NextResponse.json({ message: 'Deck inválido' }, { status: 400 });

  const id = randomUUID();
  const stored: StoredShare = { ...payload, version: 1, createdAt: new Date().toISOString() };
  await getRedis().set(shareKey(id), stored);

  return NextResponse.json({ id });
}
