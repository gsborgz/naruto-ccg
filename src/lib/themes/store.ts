import { sharedCatalog } from '../cloud/sharedCatalog.ts';
import { getRedis } from '../redis.ts';
import { THEME_LIMITS, type BoardTheme } from './types.ts';

/**
 * Temas da arena na nuvem (só no servidor). Os temas são de todos: qualquer jogador vê e usa qualquer tema, mas só
 * quem criou edita e exclui (`sharedCatalog`: `naruto-ccg:themes`, `naruto-ccg:themes-of:<dono>`, imagem no Blob com o
 * uso `themes:<id>`). O tema em uso é de cada jogador: `naruto-ccg:theme-active:<jogador>` (sem a chave, o fundo
 * padrão).
 */

const catalog = sharedCatalog<BoardTheme>({
  name: 'themes',
  images: (t) => [t.wallpaper],
  limit: THEME_LIMITS.themes,
  label: 'o tema',
});

/** Tema como o jogador o recebe: sem o dono, só se é dele. */
export interface ThemeItem {
  theme: BoardTheme;
  author: string;
  mine: boolean;
}

export class ThemeError extends Error {
  readonly status: 404;
  constructor(status: 404, message: string) {
    super(message);
    this.status = status;
  }
}

const activeKey = (player: string) => `naruto-ccg:theme-active:${player}`;

/** Todos os temas, do mais novo para o mais antigo, marcando os do jogador. */
export async function listThemes(player: string): Promise<ThemeItem[]> {
  return (await catalog.list(player)).map(({ item, author, mine }) => ({ theme: item, author, mine }));
}

/** O tema em uso pelo jogador (id; pode ser de um tema que já foi excluído). */
export async function activeTheme(player: string): Promise<string | null> {
  return (await getRedis().get<string>(activeKey(player))) ?? null;
}

/** Grava (cria ou troca) um tema. Só o dono troca um tema que já existe. */
export function saveTheme(owner: string, theme: BoardTheme, author: string): Promise<void> {
  return catalog.save(owner, theme, author);
}

/**
 * Exclui um tema (só o dono) e a imagem dele do Blob, se nada mais a usa. Quem estava usando o tema volta ao fundo
 * padrão (o id em uso dele deixa de existir, ver `GET /api/me`).
 */
export async function deleteTheme(owner: string, id: string): Promise<void> {
  if (!(await catalog.remove(owner, id))) return;
  if ((await activeTheme(owner)) === id) await getRedis().del(activeKey(owner));
}

/** Escolhe o tema em uso na arena deste jogador (`null` = o fundo padrão). Vale qualquer tema, de qualquer jogador. */
export async function setActiveTheme(player: string, id: string | null): Promise<void> {
  const redis = getRedis();
  if (id === null) {
    await redis.del(activeKey(player));
    return;
  }
  if (!(await catalog.exists(id))) throw new ThemeError(404, 'Tema não encontrado.');
  await redis.set(activeKey(player), id);
}
