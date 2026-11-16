import { randomUUID } from 'node:crypto';
import { ALT_ART_LIMITS, altArtSources, parseAltArtPlacement, type AltArt, type AltArtView } from './altArts.ts';
import { ArtError, deleteArt } from './artStore.ts';
import { getRedis } from './redis.ts';

/**
 * Artes alternativas das cartas do catálogo no Redis (só no servidor). Um hash por carta,
 * `naruto-ccg:alt-arts:<id da carta>`: id da arte → arte + `owner` (`t:<hash do token>` de quem enviou, o único que
 * pode remover). A imagem fica no Vercel Blob (`artStore.ts`), enviada antes pelo navegador.
 */

type Stored = AltArt & { owner: string };

export const altArtsKey = (cardId: string) => `naruto-ccg:alt-arts:${cardId}`;

function readStored(value: unknown): Stored | null {
  const obj = typeof value === 'string' ? safeParse(value) : value;
  if (typeof obj !== 'object' || obj === null) return null;
  const rec = obj as Record<string, unknown>;
  const placement = parseAltArtPlacement(rec);
  if (!placement || typeof rec.id !== 'string' || typeof rec.cardId !== 'string' || typeof rec.owner !== 'string') {
    return null;
  }
  return { ...placement, id: rec.id, cardId: rec.cardId, createdAt: String(rec.createdAt ?? ''), owner: rec.owner };
}

function safeParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function toView({ owner, ...art }: Stored, tokenHash: string | null): AltArtView {
  return tokenHash && owner === `t:${tokenHash}` ? { ...art, mine: true } : art;
}

async function readAll(cardId: string): Promise<Stored[]> {
  const all = (await getRedis().hgetall<Record<string, unknown>>(altArtsKey(cardId))) ?? {};
  return Object.values(all)
    .map(readStored)
    .filter((a): a is Stored => a !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/** Artes alternativas da carta, da mais antiga para a mais nova. */
export async function listAltArts(cardId: string, tokenHash: string | null): Promise<AltArtView[]> {
  return (await readAll(cardId)).map((a) => toView(a, tokenHash));
}

/**
 * Guarda uma arte nova para a carta (as imagens já estão no Blob). A mesma arte (mesmo fundo e mesma frente) não
 * entra duas vezes.
 */
export async function addAltArt(cardId: string, placement: unknown, tokenHash: string): Promise<AltArtView> {
  const parsed = parseAltArtPlacement(placement);
  if (!parsed) throw new ArtError(400, 'Arte inválida.');
  const existing = await readAll(cardId);
  const same = existing.find((a) => a.src === parsed.src && a.front?.src === parsed.front?.src);
  if (same) return toView(same, tokenHash);
  if (existing.length >= ALT_ART_LIMITS.perCard) {
    throw new ArtError(400, `Esta carta já tem ${ALT_ART_LIMITS.perCard} artes alternativas.`);
  }
  const art: Stored = {
    ...parsed,
    id: randomUUID(),
    cardId,
    createdAt: new Date().toISOString(),
    owner: `t:${tokenHash}`,
  };
  await getRedis().hset(altArtsKey(cardId), { [art.id]: art });
  return toView(art, tokenHash);
}

/**
 * Remove a arte da carta (só quem enviou) e apaga as imagens do Blob (fundo e frente). O Blob guarda cada imagem uma vez só: se a
 * mesma imagem foi usada em outra arte ou numa carta criada, ela some de lá também (caso raro: o mesmo arquivo).
 */
export async function removeAltArt(cardId: string, id: string, tokenHash: string): Promise<void> {
  const art = readStored(await getRedis().hget(altArtsKey(cardId), id));
  if (!art) throw new ArtError(404, 'Arte não encontrada.');
  if (art.owner !== `t:${tokenHash}`) throw new ArtError(403, 'Só quem enviou a arte pode removê-la.');
  await getRedis().hdel(altArtsKey(cardId), id);
  // Só apaga se esta pessoa enviou a imagem primeiro (`deleteArt` confere); uma falha aqui não desfaz a remoção.
  // Fundo e frente.
  for (const src of altArtSources(art)) await deleteArt(src, tokenHash).catch(() => undefined);
}
