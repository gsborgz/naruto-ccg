import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento fire, variante 02 (card-layouts/icons/element/element-fire-02.png). */
export const ELEMENT_FIRE_02: NamedIconConfig = {
  url: iconUrl('element', 'element-fire-02'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1225 / 1228,
  art: { x: 0, y: -0.0022, w: 1.003, h: 0.9973 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'FIRE',
    cx: 0.1900,
    cy: 0.4792,
    cap: 0.1100,
    length: 0.2800,
  },
};
