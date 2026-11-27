import { sharedCatalog } from '../cloud/sharedCatalog.ts';
import { SLEEVE_LIMITS, type Sleeve } from './types.ts';

/**
 * Sleeves na nuvem (só no servidor): todos veem e usam qualquer sleeve, só quem criou edita e exclui
 * (`sharedCatalog`: `naruto-ccg:sleeves`, `naruto-ccg:sleeves-of:<dono>`, imagem no Blob com o uso `sleeves:<id>`).
 * O sleeve escolhido fica no deck (`Deck.sleeve`); um deck com um sleeve excluído volta ao verso padrão.
 */

const catalog = sharedCatalog<Sleeve>({
  name: 'sleeves',
  images: (s) => [s.image],
  limit: SLEEVE_LIMITS.sleeves,
  label: 'o sleeve',
});

/** Sleeve como o jogador o recebe: sem o dono, só se é dele. */
export interface SleeveItem {
  sleeve: Sleeve;
  author: string;
  mine: boolean;
}

export async function listSleeves(player: string): Promise<SleeveItem[]> {
  return (await catalog.list(player)).map(({ item, author, mine }) => ({ sleeve: item, author, mine }));
}

export function saveSleeve(owner: string, sleeve: Sleeve, author: string): Promise<void> {
  return catalog.save(owner, sleeve, author);
}

export async function deleteSleeve(owner: string, id: string): Promise<void> {
  await catalog.remove(owner, id);
}
