import { getRedis } from './redis.ts';
import { parseSharedCustomCard } from './cardMaker/sharedCard.ts';
import type { CustomCard } from './cardMaker/model.ts';

/**
 * Artes alternativas das cartas do catálogo: as cartas do criador importadas de uma carta do catálogo
 * (`CustomCard.source`), publicadas por quem as criou ao salvar. O detalhe da carta lista as de todos os jogadores, e
 * qualquer uma pode virar o design padrão da carta (o `layout` dela no conteúdo do jogo). Só no servidor.
 *
 * - `naruto-ccg:alt-cards:<carta do catálogo>`: hash `<hash do token>:<id da carta criada>` → `AltCardEntry`.
 * - `naruto-ccg:alt-card-source:<hash do token>:<id da carta criada>`: a carta do catálogo onde ela está publicada
 *   (para tirar da lista ao excluir a carta criada).
 *
 * As artes ficam no Vercel Blob com o uso da carta criada (`custom:<hash do token>:<id>`, em `artStore.ts`).
 */

export class AltCardError extends Error {
  readonly status: 400 | 404 | 409;
  constructor(status: 400 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

export interface AltCardEntry {
  card: CustomCard;
  /** Apelido de quem criou (o das salas); vazio se não tiver. */
  author: string;
  updatedAt: string;
}

/** Arte alternativa como o navegador recebe: sem o token de quem criou, com `mine` para quem pediu. */
export interface AltCardView extends AltCardEntry {
  id: string;
  mine: boolean;
}

/** Quantas artes alternativas uma carta do catálogo pode ter. */
export const ALT_CARDS_PER_CARD = 100;

const listKey = (catalogId: string) => `naruto-ccg:alt-cards:${catalogId}`;
const sourceKey = (tokenHash: string, customId: string) => `naruto-ccg:alt-card-source:${tokenHash}:${customId}`;
const field = (tokenHash: string, customId: string) => `${tokenHash}:${customId}`;

const parseEntry = (raw: unknown): AltCardEntry | null => {
  const value = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Partial<AltCardEntry> | null;
  const card = parseSharedCustomCard(value?.card);
  if (!card) return null;
  return { card, author: typeof value?.author === 'string' ? value.author : '', updatedAt: String(value?.updatedAt ?? '') };
};

/** As artes alternativas de uma carta do catálogo, da mais nova para a mais antiga. */
export async function listAltCards(catalogId: string, tokenHash?: string): Promise<AltCardView[]> {
  const all = (await getRedis().hgetall<Record<string, unknown>>(listKey(catalogId))) ?? {};
  return Object.entries(all)
    .flatMap(([key, raw]) => {
      const entry = parseEntry(raw);
      return entry ? [{ ...entry, id: entry.card.id, mine: !!tokenHash && key.startsWith(`${tokenHash}:`) }] : [];
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/**
 * Publica (ou atualiza) a carta criada como arte alternativa da carta de origem dela. A carta já vem validada
 * (`parseSharedCustomCard`: artes no Blob ou do próprio site). Se ela estava publicada em outra carta, sai de lá.
 */
export async function publishAltCard(tokenHash: string, card: CustomCard, author: string): Promise<void> {
  const catalogId = card.source;
  if (!catalogId) throw new AltCardError(400, 'A carta não foi importada de uma carta do catálogo.');
  const redis = getRedis();
  const key = field(tokenHash, card.id);
  const previous = await redis.get<string>(sourceKey(tokenHash, card.id));
  if (!(await redis.hexists(listKey(catalogId), key)) && (await redis.hlen(listKey(catalogId))) >= ALT_CARDS_PER_CARD) {
    throw new AltCardError(409, 'Esta carta já tem o máximo de artes alternativas.');
  }
  const entry: AltCardEntry = { card, author: author.trim().slice(0, 40), updatedAt: new Date().toISOString() };
  const tx = redis.multi();
  if (previous && previous !== catalogId) tx.hdel(listKey(previous), key);
  tx.hset(listKey(catalogId), { [key]: entry }).set(sourceKey(tokenHash, card.id), catalogId);
  await tx.exec();
}

/** Tira a carta criada da lista de artes alternativas (ela foi excluída). */
export async function unpublishAltCard(tokenHash: string, customId: string): Promise<void> {
  const redis = getRedis();
  const catalogId = await redis.get<string>(sourceKey(tokenHash, customId));
  if (!catalogId) return;
  await redis.multi().hdel(listKey(catalogId), field(tokenHash, customId)).del(sourceKey(tokenHash, customId)).exec();
}
