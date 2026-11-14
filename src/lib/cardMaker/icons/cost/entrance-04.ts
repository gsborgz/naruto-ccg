import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de entrada entrance-04 (card-layouts/icons/cost/cost-entrance-04.png). */
export const COST_ENTRANCE_04: CostIconConfig = {
  url: iconUrl('cost', 'cost-entrance-04'),
  aspect: 966 / 1050,
  // Centro da moeda, estimado pelo desenho (a conferir).
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.48, y: 0.49, size: 36, strokeWidth: 5 },
};
