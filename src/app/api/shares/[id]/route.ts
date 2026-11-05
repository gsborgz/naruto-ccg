import { NextRequest, NextResponse } from 'next/server';
import { isValidShareId, shareKey, type StoredShare } from '@/lib/deckShare';
import { getRedis } from '@/lib/redis';

/** Carrega um compartilhamento pelo UUID. */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidShareId(id)) return NextResponse.json({ message: 'Código inválido' }, { status: 400 });

  const stored = await getRedis().get<StoredShare>(shareKey(id));
  if (!stored) return NextResponse.json({ message: 'Compartilhamento não encontrado' }, { status: 404 });

  return NextResponse.json({ id, ...stored });
}
