import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento wind, variante 02 (card-layouts/icons/element/element-wind-02.png). */
export const ELEMENT_WIND_02: NamedIconConfig = {
  url: iconUrl('element', 'element-wind-02'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1208 / 1168,
  art: { x: -0.0001, y: 0.0066, w: 0.9971, h: 0.9996 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'WIND',
    cx: 0.1700,
    cy: 0.4944,
    cap: 0.1000,
    length: 0.3500,
  },
};
