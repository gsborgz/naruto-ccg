import { getRedis } from '../redis.ts';
import type { CustomCard } from '../cardMaker/model.ts';
import { parseSharedCustomCard } from '../cardMaker/sharedCard.ts';
import { customDeckCardId } from '../cardMaker/customIds.ts';
import { clearDesign, readStoredCard, touchContent } from '../content/store.ts';
import { removeCardFromDecks } from '../decks/store.ts';
import {
  CUSTOM_KEY,
  deleteCustomEntry,
  readCustomEntries,
  SYSTEM_OWNER,
  writeCustomEntry,
  type CustomCardEntry,
} from './keys.ts';

/**
 * Cartas do criador na nuvem, com as regras de dono (só no servidor; chaves em `keys.ts`). Cada jogador grava e exclui
 * as próprias cartas; qualquer um lê qualquer carta pelo id (decks importados, salas, versões das cartas do catálogo).
 */

export class CustomCardError extends Error {
  readonly status: 400 | 403 | 404 | 409;
  constructor(status: 400 | 403 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

/** Quem é o dono da carta, do ponto de vista de quem pediu. */
export type CardOwnership = 'mine' | 'system' | 'other';

export interface CustomCardView {
  card: CustomCard;
  author: string;
  owner: CardOwnership;
}

const ownership = (entry: CustomCardEntry, requester: string | undefined): CardOwnership =>
  entry.owner === SYSTEM_OWNER ? 'system' : entry.owner === requester ? 'mine' : 'other';

const view = (entry: CustomCardEntry, requester: string | undefined): CustomCardView => ({
  card: entry.card,
  author: entry.author,
  owner: ownership(entry, requester),
});

const byUpdated = (a: CustomCardView, b: CustomCardView) => b.card.updatedAt.localeCompare(a.card.updatedAt);

/** As cartas do jogador, da mais nova para a mais antiga. */
export async function listOwnCards(owner: string): Promise<CustomCard[]> {
  const ids = await getRedis().smembers(CUSTOM_KEY.of(owner));
  const entries = await readCustomEntries(ids);
  return [...entries.values()].map((e) => view(e, owner)).sort(byUpdated).map((v) => v.card);
}

/** Cartas pelo id (as que não existem ficam de fora). */
export async function readCustomCards(ids: readonly string[], requester?: string): Promise<CustomCardView[]> {
  const entries = await readCustomEntries(ids.slice(0, 500));
  return [...entries.values()].map((e) => view(e, requester));
}

/** Se a versão é o design padrão de alguma das cartas do catálogo, o conteúdo muda de versão (o cache é por versão). */
async function touchIfDesign(versionId: string, catalogIds: (string | undefined)[]): Promise<boolean> {
  for (const id of new Set(catalogIds)) {
    if (id && (await readStoredCard(id))?.design === versionId) {
      await touchContent();
      return true;
    }
  }
  return false;
}

/**
 * Grava uma carta do jogador (nova ou dele). A carta de outro jogador não pode ser gravada; a do sistema (versão feita
 * do `layout` antigo das cartas) também não, a não ser pela aba Editar (`allowSystem`). Devolve se o conteúdo mudou
 * de versão (a carta é o design padrão de uma carta do catálogo).
 */
export async function saveOwnCard(
  owner: string,
  raw: unknown,
  author: string,
  opts: { allowSystem?: boolean; knownCatalog: (id: string) => boolean },
): Promise<{ card: CustomCard; contentChanged: boolean }> {
  const parsed = parseSharedCustomCard(raw);
  if (!parsed) throw new CustomCardError(400, 'Carta inválida (a arte precisa estar enviada ao servidor).');
  const { reference: _reference, ...card } = parsed;
  if (card.source && !opts.knownCatalog(card.source)) delete card.source;
  const previous = (await readCustomEntries([card.id])).get(card.id) ?? null;
  const keepOwner = previous?.owner === SYSTEM_OWNER && opts.allowSystem;
  if (previous && previous.owner !== owner && !keepOwner) {
    throw new CustomCardError(409, 'Esta carta é de outro jogador: duplique-a para editar.');
  }
  const entry: CustomCardEntry = {
    card,
    owner: keepOwner ? SYSTEM_OWNER : owner,
    author: keepOwner ? (previous?.author ?? '') : author.trim().slice(0, 40),
  };
  await writeCustomEntry(entry, previous);
  const contentChanged = await touchIfDesign(card.id, [card.source, previous?.card.source]);
  return { card, contentChanged };
}

/**
 * Exclui uma carta de vez (a do jogador, ou uma versão do sistema): sai dos decks do dono e, se era o design padrão da
 * carta do catálogo de origem, a carta volta para a impressa. A arte sai do Blob se nada mais a usa.
 */
export async function deleteOwnCard(requester: string, id: string): Promise<{ contentChanged: boolean }> {
  const entry = (await readCustomEntries([id])).get(id);
  if (!entry) return { contentChanged: false };
  if (entry.owner !== requester && entry.owner !== SYSTEM_OWNER) {
    throw new CustomCardError(403, 'Só quem criou a carta pode excluí-la.');
  }
  return removeEntry(entry);
}

async function removeEntry(entry: CustomCardEntry): Promise<{ contentChanged: boolean }> {
  const source = entry.card.source;
  let contentChanged = false;
  if (source && (await readStoredCard(source))?.design === entry.card.id) {
    await clearDesign(source);
    await touchContent();
    contentChanged = true;
  }
  await deleteCustomEntry(entry);
  if (entry.owner !== SYSTEM_OWNER) await removeCardFromDecks(entry.owner, customDeckCardId(entry.card.id));
  return { contentChanged };
}

/**
 * Tira uma versão da lista de versões da carta do catálogo. A do jogador e a do sistema são excluídas de vez; a de outro
 * jogador só sai da lista (continua no criador dele, sem a ligação com a carta do catálogo).
 */
export async function removeVersion(requester: string, catalogId: string, id: string): Promise<{ contentChanged: boolean }> {
  const entry = (await readCustomEntries([id])).get(id);
  if (!entry || entry.card.source !== catalogId) {
    await getRedis().srem(CUSTOM_KEY.versions(catalogId), id);
    return { contentChanged: false };
  }
  if (entry.owner === requester || entry.owner === SYSTEM_OWNER) return removeEntry(entry);
  const { source: _source, ...card } = entry.card;
  await writeCustomEntry({ ...entry, card }, entry);
  let contentChanged = false;
  if ((await readStoredCard(catalogId))?.design === id) {
    await clearDesign(catalogId);
    await touchContent();
    contentChanged = true;
  }
  return { contentChanged };
}

/** As versões de uma carta do catálogo (cartas criadas importadas dela), da mais nova para a mais antiga. */
export async function listVersions(catalogId: string, requester?: string): Promise<CustomCardView[]> {
  const ids = await getRedis().smembers(CUSTOM_KEY.versions(catalogId));
  const entries = await readCustomEntries(ids);
  return [...entries.values()].filter((e) => e.card.source === catalogId).map((e) => view(e, requester)).sort(byUpdated);
}

/**
 * Cartas que vieram de fora da nuvem (as do navegador, de antes da nuvem, ou de um código compartilhado antigo): as que
 * ainda não existem passam a ser do jogador. Devolve os ids gravados.
 */
export async function adoptCards(owner: string, raw: unknown[], author: string, knownCatalog: (id: string) => boolean): Promise<string[]> {
  const adopted: string[] = [];
  for (const x of raw.slice(0, 500)) {
    const parsed = parseSharedCustomCard(x);
    if (!parsed || (await readCustomEntries([parsed.id])).size) continue;
    const { reference: _reference, ...card } = parsed;
    if (card.source && !knownCatalog(card.source)) delete card.source;
    await writeCustomEntry({ card, owner, author: author.trim().slice(0, 40) }, null);
    adopted.push(card.id);
  }
  return adopted;
}
