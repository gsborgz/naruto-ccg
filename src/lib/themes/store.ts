import { setArtRefs } from '../artStore.ts';
import { getRedis } from '../redis.ts';
import { THEME_LIMITS, type BoardTheme } from './types.ts';

/**
 * Temas da arena na nuvem (só no servidor). Os temas são de todos: qualquer jogador vê e usa qualquer tema, mas só
 * quem criou edita e exclui. O tema em uso é de cada jogador. O banco é dividido com o projeto pokedex: toda chave
 * começa com `naruto-ccg:`.
 *
 * - `naruto-ccg:themes`: hash id do tema → `ThemeEntry` (o tema, o dono e o apelido de quem criou).
 * - `naruto-ccg:themes-of:<dono>`: conjunto com os ids dos temas do dono (para o limite).
 * - `naruto-ccg:theme-active:<jogador>`: id do tema em uso na arena desse jogador (sem a chave, o fundo padrão).
 * - A imagem de fundo fica no Blob, com o uso contado como as artes das cartas (`theme:<id>`, `src/lib/artStore.ts`):
 *   sai de lá quando o tema troca de imagem ou é excluído (se nada mais a usa).
 *
 * O dono é o hash do token da identidade anônima do jogador (o mesmo dos decks e das salas).
 */

export interface ThemeEntry {
  theme: BoardTheme;
  owner: string;
  /** Apelido de quem criou (o das salas); vazio se não tiver. */
  author: string;
}

/** Tema como o jogador o recebe: sem o dono, só se é dele. */
export interface ThemeItem {
  theme: BoardTheme;
  author: string;
  mine: boolean;
}

export class ThemeError extends Error {
  readonly status: 400 | 403 | 404 | 409;
  constructor(status: 400 | 403 | 404 | 409, message: string) {
    super(message);
    this.status = status;
  }
}

const THEMES_KEY = 'naruto-ccg:themes';
const ofKey = (owner: string) => `naruto-ccg:themes-of:${owner}`;
const activeKey = (player: string) => `naruto-ccg:theme-active:${player}`;
const themeArtRef = (id: string) => `theme:${id}`;

const toItem = (e: ThemeEntry, player: string): ThemeItem => ({ theme: e.theme, author: e.author, mine: e.owner === player });

/** Todos os temas, do mais novo para o mais antigo (pela criação), marcando os do jogador. */
export async function listThemes(player: string): Promise<ThemeItem[]> {
  const all = (await getRedis().hgetall<Record<string, ThemeEntry>>(THEMES_KEY)) ?? {};
  return Object.values(all)
    .filter((e) => e && typeof e === 'object' && e.theme)
    .sort((a, b) => b.theme.createdAt.localeCompare(a.theme.createdAt))
    .map((e) => toItem(e, player));
}

/** O tema em uso pelo jogador (id; pode ser de um tema que já foi excluído). */
export async function activeTheme(player: string): Promise<string | null> {
  return (await getRedis().get<string>(activeKey(player))) ?? null;
}

async function syncWallpaper(id: string, now: string | null, before: string | null): Promise<void> {
  if (now === before || (!now && !before)) return;
  await setArtRefs(themeArtRef(id), now ? [now] : []).catch((e) => console.error('Falha ao registrar a imagem do tema', e));
}

/** Grava (cria ou troca) um tema. Só o dono troca um tema que já existe. */
export async function saveTheme(owner: string, theme: BoardTheme, author: string): Promise<void> {
  const redis = getRedis();
  const previous = await redis.hget<ThemeEntry>(THEMES_KEY, theme.id);
  if (previous && previous.owner !== owner) throw new ThemeError(403, 'Só quem criou o tema pode alterá-lo.');
  if (!previous && (await redis.scard(ofKey(owner))) >= THEME_LIMITS.themes) {
    throw new ThemeError(409, `Limite de ${THEME_LIMITS.themes} temas atingido.`);
  }
  const entry: ThemeEntry = {
    theme: { ...theme, createdAt: previous?.theme.createdAt ?? theme.createdAt },
    owner,
    author: previous?.author || author,
  };
  await redis.multi().hset(THEMES_KEY, { [theme.id]: entry }).sadd(ofKey(owner), theme.id).exec();
  await syncWallpaper(theme.id, theme.wallpaper, previous?.theme.wallpaper ?? null);
}

/**
 * Exclui um tema (só o dono) e a imagem dele do Blob, se nada mais a usa. Quem estava usando o tema volta ao fundo
 * padrão (o id em uso dele deixa de existir, ver `GET /api/me`).
 */
export async function deleteTheme(owner: string, id: string): Promise<void> {
  const redis = getRedis();
  const previous = await redis.hget<ThemeEntry>(THEMES_KEY, id);
  if (!previous) return;
  if (previous.owner !== owner) throw new ThemeError(403, 'Só quem criou o tema pode excluí-lo.');
  await redis.multi().hdel(THEMES_KEY, id).srem(ofKey(owner), id).exec();
  if ((await activeTheme(owner)) === id) await redis.del(activeKey(owner));
  await syncWallpaper(id, null, previous.theme.wallpaper);
}

/** Escolhe o tema em uso na arena deste jogador (`null` = o fundo padrão). Vale qualquer tema, de qualquer jogador. */
export async function setActiveTheme(player: string, id: string | null): Promise<void> {
  const redis = getRedis();
  if (id === null) {
    await redis.del(activeKey(player));
    return;
  }
  if (!(await redis.hexists(THEMES_KEY, id))) throw new ThemeError(404, 'Tema não encontrado.');
  await redis.set(activeKey(player), id);
}
