import type { TextColor } from '../model.ts';
import { forAllTypes, layoutAsset } from './shared.ts';
import type { CostLayout, LayoutSpec } from './types.ts';

/**
 * Layout 3 (card-layouts/layout-03): arte de corpo inteiro, sem moldura; nome no topo (em versalete,
 * sobre a mancha de pincel) e painel escuro com uma aba à direita para a vila e os custos.
 * A mancha atrás do nome faz parte da imagem do painel (x 187–562, y 37–76), então este layout
 * não usa o `nameBanner`.
 * Só Ninja. Calibrado contra card-layouts/examples/layout-03 (S26: The 6th Hokage 1513,
 * Susano'o (Sasuke) 1537; Promo: Sasuke Uchiha PR-062).
 *
 * Ícones com o tamanho do layout 1 (`size`); nos exemplos são impressos menores (tipo 138 px,
 * custos ~50 px), então os custos e a vila da aba se sobrepõem um pouco. As posições mantêm o centro
 * medido: tipo (84, 90), elementos (665, 80) a cada ~150 px, vila (548, 803), entrada (597, 809),
 * mão (655, 812), losango do atributo (700, 1010).
 * Cartas com ícones de custo alternativos (ex.: moeda dourada e cartas creme no PR-062) usam os
 * ícones padrão do layout (shuriken azul e cartas douradas).
 */

const MARK_ON_DARK: Record<TextColor, string> = { red: '#ff7a6b', blue: '#8cc8ff' };
const COST: CostLayout = { entrance: { x: 555, y: 777, size: 76 }, hand: { x: 611.2, y: 770.4, size: 87 } };

export const LAYOUT_03: LayoutSpec = {
  id: 'layout-03',
  label: 'Layout 3',
  types: ['ninja'],
  frame: {},
  panel: { ninja: layoutAsset('layout-03', 'ninja-data-panel') },
  panelLabel: 'Borda cinza',
  // Mesmo painel com a borda vermelha (card-layouts/layout-03/ninja-data-panel-alter.png).
  panelVariants: [{ id: 'red', label: 'Borda vermelha', panel: { ninja: layoutAsset('layout-03', 'ninja-data-panel-alter') } }],
  typeIcon: forAllTypes({ x: 6, y: 10, size: 173 }),
  elements: { pos: { x: 592.5, y: 10, size: 145 }, slotDy: 150, variant: '02' },
  cost: { ninja: COST, client: COST, mission: COST },
  attribute: { x: 412.8, y: 725.8, size: 333, defaultFrame: '07' },
  village: { x: 508.65, y: 779.65, size: 62.7 },
  name: forAllTypes({
    align: 'center',
    x: 375,
    cy: 47,
    maxWidth: 440,
    size: 54,
    color: '#f4f4f4',
    stroke: '#151515',
    smallCaps: true,
    parenthesesBelow: { size: 34, dy: 41 },
  }),
  characteristics: forAllTypes({ x: 46, cy: 868, maxWidth: 560, size: 17, color: '#e2b23c', separator: '#9b8a5e' }),
  textBox: {
    ninja: { x: 47, top: 888, w: 560, bottom: 1022, size: 19, lineHeight: 24, gap: 2, color: '#f2f2f2' },
  },
  markColor: forAllTypes(MARK_ON_DARK),
  flavor: forAllTypes({ x: 75, w: 420, bottom: 837, size: 18, lineHeight: 22 }),
  defaults: { entranceIcon: 'entrance-03', handIcon: 'hand-02' },
};
