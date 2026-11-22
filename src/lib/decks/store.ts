import { getRedis } from '../redis.ts';
import { DECK_LIMITS, type Deck } from './types.ts';

/**
 * Decks dos jogadores na nuvem (só no servidor). `naruto-ccg:decks:<dono>`: hash id do deck → `Deck`. O dono é o hash
 * do token da identidade anônima do jogador (a mesma das salas, `src/lib/rooms/client.ts`).
 */

export class DeckError extends Error {
  readonly status: 400 | 409;
  constructor(status: 400 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

const decksKey = (owner: string) => `naruto-ccg:decks:${owner}`;

/** Os decks do jogador, do mais novo para o mais antigo (pela criação). */
export async function listDecks(owner: string): Promise<Deck[]> {
  const all = (await getRedis().hgetall<Record<string, Deck>>(decksKey(owner))) ?? {};
  return Object.values(all).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Grava (cria ou troca) decks do jogador. */
export async function saveDecks(owner: string, decks: Deck[]): Promise<void> {
  if (!decks.length) return;
  const redis = getRedis();
  const count = await redis.hlen(decksKey(owner));
  const known = await redis.hmget<Record<string, Deck | null>>(decksKey(owner), ...decks.map((d) => d.id));
  const added = decks.filter((d) => !known?.[d.id]).length;
  if (count + added > DECK_LIMITS.decks) throw new DeckError(409, `Limite de ${DECK_LIMITS.decks} decks atingido.`);
  for (let i = 0; i < decks.length; i += 100) {
    await redis.hset(decksKey(owner), Object.fromEntries(decks.slice(i, i + 100).map((d) => [d.id, d])));
  }
}

export async function deleteDeck(owner: string, id: string): Promise<void> {
  await getRedis().hdel(decksKey(owner), id.toLowerCase());
}

/** Tira a carta (id no deck) de todos os decks do jogador: a carta criada foi excluída. */
export async function removeCardFromDecks(owner: string, cardId: string): Promise<void> {
  const decks = await listDecks(owner);
  const changed = decks
    .filter((d) => cardId in d.cards)
    .map((d) => {
      const { [cardId]: _removed, ...cards } = d.cards;
      return { ...d, cards, updatedAt: new Date().toISOString() };
    });
  if (changed.length) await saveDecks(owner, changed);
}
