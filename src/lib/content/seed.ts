import { SEED_CARDS } from '../../data/sets/index.ts';
import { SEED_ICONS } from '../cardMaker/icons/seed.ts';
import { SEED_LAYOUTS } from '../cardMaker/layouts/seed.ts';
import { cardsToPtBr } from './ptbr.ts';
import type { ContentSnapshot } from './types.ts';

/**
 * Conteúdo da carga inicial: as cartas de src/data/sets/ com os textos em PT-BR (src/data/ptbr/, `ptbr.ts`) e a configuração dos layouts e ícones de src/lib/cardMaker/
 * (`seed.ts`), sem imagens no Blob (vale public/card-layouts/). Usado para gravar o Redis quando ele está vazio e
 * nos testes. Só no servidor e nos scripts: são ~3 MB de dados.
 */
export function seedSnapshot(): ContentSnapshot {
  // JSON puro: desfaz os objetos divididos entre tipos (`forAllTypes`) e as referências entre arquivos.
  return JSON.parse(JSON.stringify({ version: 0, cards: cardsToPtBr(SEED_CARDS), layouts: SEED_LAYOUTS, icons: SEED_ICONS, assets: {} }));
}
