import { getRedis } from '../redis.ts';
import type { CustomCard } from '../cardMaker/model.ts';
import { parseSharedCustomCard } from '../cardMaker/sharedCard.ts';
import { customDeckCardId } from '../cardMaker/customIds.ts';
import { removeCardFromDecks } from '../decks/store.ts';
import { CUSTOM_KEY, deleteCustomEntry, readCustomEntries, writeCustomEntry, type CustomCardEntry } from './keys.ts';

/**
 * Cartas do criador na nuvem, com as regras de dono (só no servidor; chaves em `keys.ts`). Cada jogador grava e exclui
 * as próprias cartas; qualquer um lê qualquer carta pelo id (decks importados, salas, alters das cartas do catálogo).
 *
 * Alter: carta do criador ligada a uma carta do catálogo (`source`), com os dados dela e só as artes novas. Ela não é
 * uma carta do deck: é um design que o dono do deck escolhe para a carta do catálogo (`Deck.designs`).
 */

export class CustomCardError extends Error {
  readonly status: 400 | 403 | 404 | 409;
  constructor(status: 400 | 403 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

/** Quem é o dono da carta, do ponto de vista de quem pediu. */
export type CardOwnership = 'mine' | 'other';

export interface CustomCardView {
  card: CustomCard;
  author: string;
  owner: CardOwnership;
}

const view = (entry: CustomCardEntry, requester: string | undefined): CustomCardView => ({
  card: entry.card,
  author: entry.author,
  owner: entry.owner === requester ? 'mine' : 'other',
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

/** Grava uma carta do jogador (nova ou dele). A carta de outro jogador não pode ser gravada. */
export async function saveOwnCard(
  owner: string,
  raw: unknown,
  author: string,
  opts: { knownCatalog: (id: string) => boolean },
): Promise<{ card: CustomCard }> {
  const parsed = parseSharedCustomCard(raw);
  if (!parsed) throw new CustomCardError(400, 'Carta inválida (a arte precisa estar enviada ao servidor).');
  const { reference: _reference, ...card } = parsed;
  if (card.source && !opts.knownCatalog(card.source)) delete card.source;
  const previous = (await readCustomEntries([card.id])).get(card.id) ?? null;
  if (previous && previous.owner !== owner) {
    throw new CustomCardError(409, 'Esta carta é de outro jogador: duplique-a para editar.');
  }
  await writeCustomEntry({ card, owner, author: author.trim().slice(0, 40) }, previous);
  return { card };
}

/** Exclui uma carta do jogador de vez: sai dos decks dele, e a arte sai do Blob se nada mais a usa. */
export async function deleteOwnCard(requester: string, id: string): Promise<void> {
  const entry = (await readCustomEntries([id])).get(id);
  if (!entry) return;
  if (entry.owner !== requester) throw new CustomCardError(403, 'Só quem criou a carta pode excluí-la.');
  await deleteCustomEntry(entry);
  await removeCardFromDecks(entry.owner, customDeckCardId(entry.card.id));
}

/** As alters de uma carta do catálogo (de todos os jogadores), da mais nova para a mais antiga. */
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
