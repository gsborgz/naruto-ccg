import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento water, variante 02 (card-layouts/icons/element/element-water-02.png). */
export const ELEMENT_WATER_02: NamedIconConfig = {
  url: iconUrl('element', 'element-water-02'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1181 / 1179,
  art: { x: -0.0528, y: -0.0134, w: 1.0696, h: 1.0179 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WATER',
    cx: 0.1625,
    cy: 0.4694,
    cap: 0.1000,
    length: 0.3900,
  },
};
