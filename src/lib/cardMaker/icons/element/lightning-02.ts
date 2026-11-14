import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento lightning, variante 02 (card-layouts/icons/element/element-lightning-02.png). */
export const ELEMENT_LIGHTNING_02: NamedIconConfig = {
  url: iconUrl('element', 'element-lightning-02'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1160 / 1195,
  art: { x: 0.0124, y: 0.0201, w: 0.9919, h: 0.9476 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'LIGHTNING',
    cx: 0.1958,
    cy: 0.4764,
    cap: 0.1000,
    length: 0.7200,
  },
};
