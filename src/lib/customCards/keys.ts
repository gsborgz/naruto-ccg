import { setArtRefs } from '../artStore.ts';
import { getRedis } from '../redis.ts';
import type { CustomCard } from '../cardMaker/model.ts';
import { isBlobArt } from '../cardMaker/sharedCard.ts';

/**
 * Cartas do criador na nuvem (Redis; só no servidor). O banco é dividido com o projeto pokedex: toda chave começa com
 * `naruto-ccg:`.
 *
 * - `naruto-ccg:custom-cards`: hash id da carta → `CustomCardEntry` (a carta, o dono e o apelido de quem criou). Os
 *   ids são UUIDs, então valem para todo mundo: o deck, a sala e a alter escolhida para uma carta do catálogo guardam
 *   só o id.
 * - `naruto-ccg:custom-cards-of:<dono>`: conjunto com os ids das cartas do dono.
 * - `naruto-ccg:versions:<carta do catálogo>`: conjunto com os ids das alters dela (as cartas do criador ligadas a
 *   ela, `CustomCard.source`), listadas na escolha de design do montador.
 *
 * O dono é o hash do token da identidade anônima do jogador (o mesmo das salas). `system` era o dono das versões feitas
 * do `layout` antigo das cartas (formato 3 do conteúdo), apagadas na conversão para o formato 4.
 */

export interface CustomCardEntry {
  card: CustomCard;
  owner: string;
  /** Apelido de quem criou (o das salas); vazio se não tiver. */
  author: string;
}

export const SYSTEM_OWNER = 'system';

export const CUSTOM_KEY = {
  cards: 'naruto-ccg:custom-cards',
  of: (owner: string) => `naruto-ccg:custom-cards-of:${owner}`,
  versions: (catalogId: string) => `naruto-ccg:versions:${catalogId}`,
} as const;

/** As cartas com esses ids (as que não existem ficam de fora). */
export async function readCustomEntries(ids: readonly string[]): Promise<Map<string, CustomCardEntry>> {
  const unique = [...new Set(ids)];
  const out = new Map<string, CustomCardEntry>();
  if (!unique.length) return out;
  // Em partes de 200, todas num só pedido (pipeline).
  const parts: string[][] = [];
  for (let i = 0; i < unique.length; i += 200) parts.push(unique.slice(i, i + 200));
  const pipe = getRedis().pipeline();
  for (const part of parts) pipe.hmget(CUSTOM_KEY.cards, ...part);
  const results = await pipe.exec<(Record<string, CustomCardEntry | null> | null)[]>();
  parts.forEach((part, i) => {
    for (const id of part) {
      const v = results[i]?.[id];
      if (v && typeof v === 'object' && v.card) out.set(id, v);
    }
  });
  return out;
}

/** Endereços de arte no Blob que a carta usa. */
export function customCardArts(card: CustomCard | null | undefined): string[] {
  if (!card) return [];
  return [...new Set([card.art.src, card.artFront?.src].filter((s): s is string => !!s && isBlobArt(s)))];
}

/** O uso das artes da carta (`src/lib/artStore.ts`): só fica no Blob a arte que alguma carta usa. */
export const customArtRef = (owner: string, id: string) => `custom:${owner}:${id}`;

async function syncArts(owner: string, id: string, card: CustomCard | null, previous: CustomCard | null): Promise<void> {
  const urls = customCardArts(card);
  if (!urls.length && !customCardArts(previous).length) return;
  await setArtRefs(customArtRef(owner, id), urls).catch((e) => console.error('Falha ao registrar as artes da carta criada', e));
}

/**
 * Grava a carta (sem conferir o dono: quem chama confere) e mantém as listas: a do dono e a de versões da carta do
 * catálogo de origem. As artes que saíram são apagadas do Blob se nada mais as usa.
 */
export async function writeCustomEntry(entry: CustomCardEntry, previous?: CustomCardEntry | null): Promise<void> {
  const { card, owner } = entry;
  const tx = getRedis().multi().hset(CUSTOM_KEY.cards, { [card.id]: entry }).sadd(CUSTOM_KEY.of(owner), card.id);
  if (previous && previous.owner !== owner) tx.srem(CUSTOM_KEY.of(previous.owner), card.id);
  const before = previous?.card.source;
  if (before && before !== card.source) tx.srem(CUSTOM_KEY.versions(before), card.id);
  if (card.source) tx.sadd(CUSTOM_KEY.versions(card.source), card.id);
  await tx.exec();
  await syncArts(owner, card.id, card, previous?.card ?? null);
  if (previous && previous.owner !== owner) await syncArts(previous.owner, card.id, null, previous.card);
}

/** Apaga a carta, as listas dela e o uso das artes (as que nada mais usa saem do Blob). */
export async function deleteCustomEntry(entry: CustomCardEntry): Promise<void> {
  const { card, owner } = entry;
  const tx = getRedis().multi().hdel(CUSTOM_KEY.cards, card.id).srem(CUSTOM_KEY.of(owner), card.id);
  if (card.source) tx.srem(CUSTOM_KEY.versions(card.source), card.id);
  await tx.exec();
  await syncArts(owner, card.id, null, card);
}
