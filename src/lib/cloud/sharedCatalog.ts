import { setArtRefs } from '../artStore.ts';
import { getRedis } from '../redis.ts';

/**
 * Catálogo na nuvem que todos os jogadores veem e usam, mas que só quem criou cada item edita e exclui (só no
 * servidor). Usado pelos temas da arena (`src/lib/themes/store.ts`) e pelos sleeves (`src/lib/sleeves/store.ts`).
 *
 * - `naruto-ccg:<nome>`: hash id do item → `CatalogEntry` (o item, o dono e o apelido de quem criou).
 * - `naruto-ccg:<nome>-of:<dono>`: conjunto com os ids dos itens do dono (para o limite por jogador).
 * - As imagens do item ficam no Blob, com o uso contado como as artes das cartas (`<nome>:<id>`,
 *   `src/lib/artStore.ts`): saem de lá quando o item troca de imagem ou é excluído (se nada mais as usa).
 *
 * O dono é o hash do token da identidade anônima do jogador (o mesmo dos decks e das salas). O banco é dividido com
 * o projeto pokedex: toda chave começa com `naruto-ccg:`.
 */

export interface CatalogItem {
  id: string;
  createdAt: string;
}

export interface CatalogEntry<T> {
  item: T;
  owner: string;
  /** Apelido de quem criou (o das salas); vazio se não tiver. */
  author: string;
}

/** Item como o jogador o recebe: sem o dono, só se é dele. */
export interface CatalogView<T> {
  item: T;
  author: string;
  mine: boolean;
}

export class CatalogError extends Error {
  readonly status: 403 | 409;
  constructor(status: 403 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * A entrada como está no Redis, no formato atual. `legacyField` é o campo onde o item ficava antes do catálogo
 * compartilhado (os temas gravavam `{ theme, owner, author }`); `null` se não for uma entrada.
 */
export function normalizeEntry<T extends CatalogItem>(raw: unknown, legacyField?: string): CatalogEntry<T> | null {
  if (!raw || typeof raw !== 'object') return null;
  const e = raw as Record<string, unknown>;
  const item = (e.item ?? (legacyField ? e[legacyField] : undefined)) as T | undefined;
  if (!item || typeof item !== 'object' || typeof item.id !== 'string') return null;
  return {
    item: { ...item, createdAt: typeof item.createdAt === 'string' ? item.createdAt : '' },
    owner: typeof e.owner === 'string' ? e.owner : '',
    author: typeof e.author === 'string' ? e.author : '',
  };
}

export function sharedCatalog<T extends CatalogItem>(options: {
  /** Nome das chaves (`naruto-ccg:<nome>`). */
  name: string;
  /** Imagens no Blob que o item usa. */
  images: (item: T) => (string | null | undefined)[];
  /** Itens por jogador. */
  limit: number;
  /** "o tema", "o sleeve": para as mensagens de erro. */
  label: string;
  /** Prefixo do uso das imagens (`<prefixo>:<id>`, `src/lib/artStore.ts`); padrão: o nome. */
  artRefPrefix?: string;
  /** Campo do item nas entradas gravadas antes do catálogo compartilhado (ver `normalizeEntry`). */
  legacyField?: string;
}) {
  const KEY = `naruto-ccg:${options.name}`;
  const ofKey = (owner: string) => `naruto-ccg:${options.name}-of:${owner}`;
  const artRef = (id: string) => `${options.artRefPrefix ?? options.name}:${id}`;
  const normalize = (raw: unknown) => normalizeEntry<T>(raw, options.legacyField);
  const imagesOf = (item: T | undefined) => [...new Set(item ? options.images(item).filter((u): u is string => !!u) : [])];

  async function syncImages(id: string, now: T | undefined, before: T | undefined): Promise<void> {
    const urls = imagesOf(now);
    const prev = imagesOf(before);
    if (urls.length === prev.length && urls.every((u) => prev.includes(u))) return;
    await setArtRefs(artRef(id), urls).catch((e) => console.error(`Falha ao registrar as imagens de ${options.label}`, e));
  }

  async function read(id: string): Promise<CatalogEntry<T> | null> {
    return normalize(await getRedis().hget<unknown>(KEY, id));
  }

  return {
    read,

    /** Todos os itens, do mais novo para o mais antigo (pela criação), marcando os do jogador. */
    async list(player: string): Promise<CatalogView<T>[]> {
      const all = (await getRedis().hgetall<Record<string, unknown>>(KEY)) ?? {};
      return Object.values(all)
        .map(normalize)
        .filter((e): e is CatalogEntry<T> => !!e)
        .sort((a, b) => b.item.createdAt.localeCompare(a.item.createdAt))
        .map((e) => ({ item: e.item, author: e.author, mine: e.owner === player }));
    },

    async exists(id: string): Promise<boolean> {
      return (await getRedis().hexists(KEY, id)) === 1;
    },

    /** Grava (cria ou troca) um item. Só o dono troca um item que já existe. */
    async save(owner: string, item: T, author: string): Promise<void> {
      const redis = getRedis();
      const previous = await read(item.id);
      if (previous && previous.owner !== owner) throw new CatalogError(403, `Só quem criou ${options.label} pode alterá-lo.`);
      if (!previous && (await redis.scard(ofKey(owner))) >= options.limit) {
        throw new CatalogError(409, `Limite de ${options.limit} atingido.`);
      }
      const entry: CatalogEntry<T> = {
        item: { ...item, createdAt: previous?.item.createdAt ?? item.createdAt },
        owner,
        author: previous?.author || author,
      };
      await redis.multi().hset(KEY, { [item.id]: entry }).sadd(ofKey(owner), item.id).exec();
      await syncImages(item.id, item, previous?.item);
    },

    /** Exclui um item (só o dono) e as imagens dele do Blob, se nada mais as usa. Devolve se existia. */
    async remove(owner: string, id: string): Promise<boolean> {
      const previous = await read(id);
      if (!previous) return false;
      if (previous.owner !== owner) throw new CatalogError(403, `Só quem criou ${options.label} pode excluí-lo.`);
      await getRedis().multi().hdel(KEY, id).srem(ofKey(owner), id).exec();
      await syncImages(id, undefined, previous.item);
      return true;
    },
  };
}
