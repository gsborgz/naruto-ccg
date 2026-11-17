import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de entrada entrance-03 (card-layouts/icons/cost/cost-entrance-03.png). */
export const COST_ENTRANCE_03: CostIconConfig = {
  url: iconUrl('cost', 'cost-entrance-03'),
  aspect: 966 / 1050,
  // Centro da shuriken: média dos layouts 2 a 4.
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.5176, y: 0.4808, size: 36, strokeWidth: 5 },
};
