import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { CostIconConfig } from '../types.ts';

/** Custo de entrada entrance-02 (card-layouts/icons/cost/cost-entrance-02.png). */
export const COST_ENTRANCE_02: CostIconConfig = {
  url: iconUrl('cost', 'cost-entrance-02'),
  aspect: 966 / 1050,
  // Centro do escudo, estimado pelo desenho (a conferir).
  // Número: centro em frações do ícone; fonte e contorno em px da carta (não mudam com o size do layout).
  number: { ...NUMBER_STYLE, x: 0.5, y: 0.47, size: 36, strokeWidth: 5 },
};
