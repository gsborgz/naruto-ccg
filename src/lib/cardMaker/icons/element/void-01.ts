import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Elemento void, variante 01 (card-layouts/icons/element/element-void-01.png). */
export const ELEMENT_VOID_01: NamedIconConfig = {
  url: iconUrl('element', 'element-void-01'),
  // Caixa: a área útil do ícone antigo, que tinha o nome impresso (as posições foram calibradas nela).
  aspect: 1203 / 1224,
  art: { x: 0.0366, y: -0.0007, w: 0.9607, h: 0.9827 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'VOID',
    cx: 0.1900,
    cy: 0.4625,
    cap: 0.1000,
    length: 0.3200,
  },
};
