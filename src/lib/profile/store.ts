import { getRedis } from '../redis.ts';

/**
 * Apelido do jogador na nuvem (só no servidor): `naruto-ccg:nickname:<dono>` (o dono é o hash do token da identidade
 * anônima, o mesmo dos decks e das salas). É o nome que aparece nas salas e como criador dos temas, sleeves e cartas:
 * as listas trocam o apelido gravado junto com o item (o da época da criação) pelo atual (`currentAuthors`).
 */

const key = (owner: string) => `naruto-ccg:nickname:${owner}`;

export async function getNickname(owner: string): Promise<string> {
  return (await getRedis().get<string>(key(owner))) ?? '';
}

/** Grava o apelido (vazio apaga: os itens do jogador voltam a mostrar o apelido da época da criação). */
export async function setNickname(owner: string, nickname: string): Promise<void> {
  if (nickname) await getRedis().set(key(owner), nickname);
  else await getRedis().del(key(owner));
}

/** Apelido atual de cada dono (só os que têm um). */
export async function currentNicknames(owners: Iterable<string>): Promise<Map<string, string>> {
  const list = [...new Set(owners)].filter(Boolean);
  if (!list.length) return new Map();
  const values = await getRedis().mget<(string | null)[]>(...list.map(key));
  const out = new Map<string, string>();
  list.forEach((owner, i) => {
    const v = values[i];
    if (typeof v === 'string' && v) out.set(owner, v);
  });
  return out;
}

/**
 * Troca o `author` de cada item pelo apelido atual do dono (`owner`); sem apelido gravado, fica o da criação.
 */
export async function withCurrentAuthors<T extends { owner: string; author: string }>(items: T[]): Promise<T[]> {
  const names = await currentNicknames(items.map((i) => i.owner));
  return names.size ? items.map((i) => (names.has(i.owner) ? { ...i, author: names.get(i.owner)! } : i)) : items;
}
