import type { TextColor } from '../model.ts';
import { forAllTypes, layoutAsset } from './shared.ts';
import type { CostLayout, LayoutSpec } from './types.ts';

/**
 * Layout 5 (card-layouts/layout-05): arte de corpo inteiro, sem moldura; nome no topo sobre a mancha
 * de pincel e uma faixa escura com as características e os custos — sem texto de efeito. Só Ninja.
 * Calibrado contra card-layouts/examples/layout-05 (S29: Bandit (1) 5008 e Bandit (2) 5009).
 *
 * Os ícones de elemento impressos nesse layout são de outro desenho (Terra com aro dourado, Fogo em
 * flor); por decisão do projeto, usa a variante 02, que já está extraída.
 * Ícones com o tamanho do layout 1 (`size`); posições pelo centro medido: tipo (84, 87), elementos
 * (659, 79) a cada ~180 px, entrada (549, 915), mão (621, 918), losango do atributo (697, 1005).
 */

const MARK_ON_DARK: Record<TextColor, string> = { red: '#ff7a6b', blue: '#8cc8ff' };
const COST: CostLayout = { entrance: { x: 519.1, y: 890, size: 76 }, hand: { x: 575.1, y: 884.7, size: 87 } };

export const LAYOUT_05: LayoutSpec = {
  id: 'layout-05',
  label: 'Layout 5',
  types: ['ninja'],
  frame: {},
  panel: { ninja: layoutAsset('layout-05', 'ninja-data-panel') },
  typeIcon: forAllTypes({ x: 5, y: 14.9, size: 173 }),
  elements: { pos: { x: 579.8, y: 29.2, size: 163.8 }, slotDy: 180, variant: '02' },
  cost: { ninja: COST, client: COST, mission: COST },
  attribute: { x: 412.4, y: 720.8, size: 333, defaultFrame: '06-01' },
  // Sem exemplo com vila: célula da esquerda da faixa.
  village: { x: 21.6, y: 892.2, size: 62.7 },
  name: forAllTypes({ align: 'center', x: 375, cy: 42, maxWidth: 400, size: 38, color: '#f4f4f4', stroke: '#151515' }),
  nameBanner: { cx: 370, cy: 44, w: 470, default: true },
  characteristics: forAllTypes({ x: 97.3, cy: 867.3, maxWidth: 595.7, size: 10.8, color: '#f2f2f2', separator: '#bdbdbd' }),
  textBox: {},
  markColor: forAllTypes(MARK_ON_DARK),
  flavor: forAllTypes({ x: 45, w: 600, bottom: 803, size: 18, lineHeight: 22 }),
  defaults: { entranceIcon: 'entrance-03', handIcon: 'hand-02' },
};
