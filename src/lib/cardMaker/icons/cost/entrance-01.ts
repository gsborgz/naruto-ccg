import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de entrada entrance-01 (card-layouts/icons/cost/cost-entrance-01.png). */
export const COST_ENTRANCE_01: CostIconConfig = {
  url: iconUrl('cost', 'cost-entrance-01'),
  aspect: 966 / 1050,
  // Calibrado no layout 1 (Ninja).
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.52, y: 0.5, size: 31, strokeWidth: 3 },
};
