import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getRedis } from '../redis.ts';
import { ROOM_TTL_SECONDS, RoomError, type Room, type SeenMap } from './model.ts';

/**
 * Salas no Redis (docs/SALAS.md). O banco é compartilhado com o pokedex: toda chave começa com `naruto-ccg:`.
 * - `naruto-ccg:room:<id>`: a sala (JSON);
 * - `naruto-ccg:room:<id>:seen`: hash hash-do-token → última consulta (ms), para o "online".
 */

const roomKey = (id: string) => `naruto-ccg:room:${id.toLowerCase()}`;
const seenKey = (id: string) => `${roomKey(id)}:seen`;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function readRoom(id: string): Promise<{ room: Room | null; seen: SeenMap }> {
  const [room, seen] = await getRedis()
    .pipeline()
    .get<Room>(roomKey(id))
    .hgetall<Record<string, number>>(seenKey(id))
    .exec<[Room | null, Record<string, number> | null]>();
  return { room, seen: seen ?? {} };
}

/** Marca o jogador como online (chamado periodicamente pelo navegador, não a cada consulta). */
export async function touchSeen(id: string, tokenHash: string, nowMs: number): Promise<void> {
  await getRedis()
    .pipeline()
    .hset(seenKey(id), { [tokenHash]: nowMs })
    .expire(seenKey(id), ROOM_TTL_SECONDS)
    .exec();
}

export async function insertRoom(room: Room): Promise<void> {
  const ok = await getRedis().set(roomKey(room.id), room, { nx: true, ex: ROOM_TTL_SECONDS });
  if (ok !== 'OK') throw new Error('Colisão de id de sala');
}

/**
 * Grava `next` só se a sala ainda estiver na rev `expectedRev` (compare-and-set atômico) e renova a expiração.
 * Lê a rev direto do JSON gravado (`"rev":N`, sempre escrito por `JSON.stringify` deste módulo).
 */
const CAS_SCRIPT = `
local cur = redis.call('GET', KEYS[1])
if not cur then return -1 end
local rev = string.match(cur, '"rev":(%d+)')
if tonumber(rev) ~= tonumber(ARGV[1]) then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'EX', ARGV[3])
redis.call('EXPIRE', KEYS[2], ARGV[3])
return 1
`;

/**
 * Lê a sala, aplica `mutate` e grava com compare-and-set. Se outra escrita passou na frente
 * (os dois jogadores clicaram ao mesmo tempo), relê e tenta de novo.
 */
export async function updateRoom(id: string, mutate: (room: Room) => Room): Promise<{ room: Room; seen: SeenMap }> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { room, seen } = await readRoom(id);
    if (!room) throw new RoomError(404, 'Sala não encontrada. Ela pode ter expirado.');
    const next = mutate(room);
    if (next === room) return { room, seen };
    const result = await getRedis().eval<string[], number>(
      CAS_SCRIPT,
      [roomKey(id), seenKey(id)],
      [String(room.rev), JSON.stringify(next), String(ROOM_TTL_SECONDS)],
    );
    if (result === 1) return { room: next, seen };
    if (result === -1) throw new RoomError(404, 'Sala não encontrada. Ela pode ter expirado.');
  }
  throw new RoomError(409, 'A sala mudou ao mesmo tempo. Tente de novo.');
}

/** Converte erros das regras em respostas HTTP; o resto vira 500. */
export function roomErrorResponse(e: unknown) {
  if (e instanceof RoomError) return NextResponse.json({ message: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ message: 'Erro inesperado no servidor. Tente de novo.' }, { status: 500 });
}

/** Lê `playerId` e `token` (UUIDs gerados pelo navegador). */
export function parseIdentity(body: Record<string, unknown>): { playerId: string; tokenHash: string } {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const { playerId, token } = body;
  if (typeof playerId !== 'string' || !uuid.test(playerId) || typeof token !== 'string' || !uuid.test(token)) {
    throw new RoomError(400, 'Identidade do jogador inválida. Recarregue a página.');
  }
  return { playerId, tokenHash: hashToken(token) };
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (typeof body === 'object' && body !== null && !Array.isArray(body)) return body as Record<string, unknown>;
  } catch {
    // cai no erro abaixo
  }
  throw new RoomError(400, 'Requisição inválida.');
}
