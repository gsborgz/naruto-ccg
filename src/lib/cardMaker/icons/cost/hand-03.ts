import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de mão hand-03 (card-layouts/icons/cost/cost-hand-03.png). */
export const COST_HAND_03: CostIconConfig = {
  url: iconUrl('cost', 'cost-hand-03'),
  aspect: 966 / 1050,
  // Carta da frente, estimado pelo desenho (a conferir).
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.5, y: 0.52, size: 36, strokeWidth: 3 },
};
