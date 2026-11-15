import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de mão hand-02 (card-layouts/icons/cost/cost-hand-02.png). */
export const COST_HAND_02: CostIconConfig = {
  url: iconUrl('cost', 'cost-hand-02'),
  aspect: 966 / 1050,
  // Carta da frente: média dos layouts 2 a 4.
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.465, y: 0.52, size: 36, strokeWidth: 3 },
};
