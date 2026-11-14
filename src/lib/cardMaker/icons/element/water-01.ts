import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento water, variante 01 (card-layouts/icons/element/element-water-01.png). */
export const ELEMENT_WATER_01: NamedIconConfig = {
  url: iconUrl('element', 'element-water-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1216 / 1269,
  art: { x: 0, y: -0.0022, w: 1, h: 0.9607 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WATER',
    cx: 0.1300,
    cy: 0.5028,
    cap: 0.1000,
    length: 0.4500,
  },
};
