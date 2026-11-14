import { SIDE_LABEL_STYLE, iconUrl } from '../defaults.ts';
import type { NamedIconConfig } from '../types.ts';

/** Ícone do tipo Client (card-layouts/icons/type/type-client.png). */
export const TYPE_CLIENT: NamedIconConfig = {
  url: iconUrl('type', 'type-client'),
  // Caixa: a tela de 1265×1243 dos ícones antigos, que tinham o nome impresso (as posições foram calibradas nela).
  aspect: 1243 / 1265,
  art: { x: 0.012, y: -0.0036, w: 0.9781, h: 0.9781 },
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'CLIENT',
    cx: 0.2319,
    cy: 0.5,
    cap: 0.0800,
    length: 0.3444,
  },
};
