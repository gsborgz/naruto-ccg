import type { TextColor } from '../model.ts';
import { forAllTypes, layoutAsset } from './shared.ts';
import type { CostLayout, LayoutSpec } from './types.ts';

/**
 * Layout 4 (card-layouts/layout-04): moldura vermelha e painel escuro de borda vermelha (cartas de
 * Reforço). Só Ninja. Calibrado contra card-layouts/examples/layout-04 (S26: Inner Sakura 1543;
 * Promo: Naruto Uzumaki PR-053). O l04-n-01 (214×300) é pequeno demais e ficou de fora.
 *
 * Ícones com o tamanho do layout 1 (`size`); posições pelo centro medido: tipo (128, 125),
 * elementos (634, 127) a cada ~155 px, vila (116, 701), entrada (595, 706), mão (660, 705),
 * círculo do atributo (712, 1010).
 */

const MARK_ON_DARK: Record<TextColor, string> = { red: '#ff7a6b', blue: '#8cc8ff' };
const COST: CostLayout = { entrance: { x: 553, y: 675, size: 76 }, hand: { x: 617.1, y: 668.4, size: 87 } };

export const LAYOUT_04: LayoutSpec = {
  id: 'layout-04',
  label: 'Layout 4',
  types: ['ninja'],
  frame: { ninja: layoutAsset('layout-04', 'ninja-frame') },
  panel: { ninja: layoutAsset('layout-04', 'ninja-data-panel') },
  panelLabel: 'Vermelho',
  // Mesma carta em roxo (card-layouts/layout-04/ninja-frame-alter.png e ninja-data-panel-alter.png).
  panelVariants: [
    {
      id: 'purple',
      label: 'Roxo',
      frame: { ninja: layoutAsset('layout-04', 'ninja-frame-alter') },
      panel: { ninja: layoutAsset('layout-04', 'ninja-data-panel-alter') },
    },
  ],
  typeIcon: forAllTypes({ x: 42, y: 40, size: 173 }),
  elements: { pos: { x: 561.5, y: 54.5, size: 145 }, slotDy: 155, variant: '02' },
  cost: { ninja: COST, client: COST, mission: COST },
  attribute: { x: 418.7, y: 720.9, size: 333, defaultFrame: '06-02' },
  village: { x: 84.65, y: 669.65, size: 62.7 },
  name: forAllTypes({ align: 'center', x: 355, cy: 708, maxWidth: 380, size: 46, color: '#f5f1e8', stroke: '#1a1a1a' }),
  characteristics: forAllTypes({ x: 100, cy: 759, maxWidth: 580, size: 17, color: '#e9dcc0', separator: '#bfb39a' }),
  textBox: {
    ninja: { x: 100, top: 793, w: 520, bottom: 985, size: 19.5, lineHeight: 25, gap: 8, color: '#f0ece4' },
  },
  markColor: forAllTypes(MARK_ON_DARK),
  flavor: forAllTypes({ x: 105, w: 560, bottom: 630, size: 20, lineHeight: 24 }),
  defaults: { entranceIcon: 'entrance-03', handIcon: 'hand-02' },
};
