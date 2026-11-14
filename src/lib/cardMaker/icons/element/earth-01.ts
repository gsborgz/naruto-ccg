import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento earth, variante 01 (card-layouts/icons/element/element-earth-01.png). */
export const ELEMENT_EARTH_01: NamedIconConfig = {
  url: iconUrl('element', 'element-earth-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1284 / 1205,
  art: { x: 0.0139, y: 0.0005, w: 0.9888, h: 1.0615 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'EARTH',
    cx: 0.2000,
    cy: 0.4542,
    cap: 0.1000,
    length: 0.4200,
  },
};
