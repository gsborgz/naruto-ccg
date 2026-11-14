import { NUMBER_STYLE, iconUrl } from '../defaults.ts';
import type { ChakraIconConfig } from '../types.ts';

/** Chakra genérico do custo do Jutsu (card-layouts/icons/cost/cost-chakra-any.png). */
export const COST_CHAKRA_ANY: ChakraIconConfig = {
  url: iconUrl('cost', 'cost-chakra-any'),
  aspect: 966 / 1050,
  // A tela tem margem: na linha do custo, o ícone ocupa só esta parte (frações da caixa).
  inline: { x: 0.19, y: 0.19, w: 0.62, h: 0.62 },
  // Fonte de 27 px com o ícone de 74 px (layout 1).
  number: { ...NUMBER_STYLE, x: 0.5, y: 0.51, size: 0.3649, strokeWidth: 0.0541 },
};
