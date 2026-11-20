import type { LayoutId } from '../model.ts';
import { LAYOUT_01 } from './layout01.ts';
import { LAYOUT_02 } from './layout02.ts';
import { LAYOUT_03 } from './layout03.ts';
import { LAYOUT_04 } from './layout04.ts';
import { LAYOUT_05 } from './layout05.ts';
import type { LayoutSpec } from './types.ts';

/**
 * Carga inicial (seed) dos layouts: a configuração calibrada de cada um (`layoutXX.ts`). O app NÃO lê estes arquivos:
 * os layouts ficam no Redis (src/lib/content/) e são editados pelo site (`/criar/layouts`). Eles só servem para
 * gravar o Redis quando ele está vazio e para os testes.
 */
export const SEED_LAYOUTS: Record<LayoutId, LayoutSpec> = {
  'layout-01': LAYOUT_01,
  'layout-02': LAYOUT_02,
  'layout-03': LAYOUT_03,
  'layout-04': LAYOUT_04,
  'layout-05': LAYOUT_05,
};
