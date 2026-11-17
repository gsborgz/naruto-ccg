import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento earth, variante 02 (card-layouts/icons/element/element-earth-02.png). */
export const ELEMENT_EARTH_02: NamedIconConfig = {
  url: iconUrl('element', 'element-earth-02'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1172 / 1306,
  art: { x: -0.0333, y: 0.0686, w: 0.909, h: 0.8654 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'EARTH',
    cx: 0.2000,
    cy: 0.3625,
    cap: 0.1050,
    length: 0.3800,
  },
};
