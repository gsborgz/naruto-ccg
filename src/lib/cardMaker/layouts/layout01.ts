import type { TextColor } from '../model.ts';
import { PART_NAME, layoutAsset } from './shared.ts';
import type { LayoutSpec } from './types.ts';

/**
 * Layout 1 (card-layouts/layout-01): moldura com arco, nome no painel inferior.
 * Calibrado contra card-layouts/examples/layout-01 (cartas do S10: Jiraiya, Fugai, Kahiko, Clematis
 * Dance: Flower, Flying Knee, Hyuga Way): ícones casados por correlação de bordas, textos por screenshot.
 */

const MARK_ON_LIGHT: Record<TextColor, string> = { red: '#c4161c', blue: '#1b4fc4' };
const asset = (type: keyof typeof PART_NAME, part: 'frame' | 'data-panel') =>
  layoutAsset('layout-01', `${PART_NAME[type]}-${part}`);

export const LAYOUT_01: LayoutSpec = {
  id: 'layout-01',
  label: 'Layout 1',
  types: ['ninja', 'jutsu', 'mission', 'client'],
  frame: {
    ninja: asset('ninja', 'frame'),
    client: asset('client', 'frame'),
    jutsu: asset('jutsu', 'frame'),
    mission: asset('mission', 'frame'),
  },
  panel: {
    ninja: asset('ninja', 'data-panel'),
    client: asset('client', 'data-panel'),
    jutsu: asset('jutsu', 'data-panel'),
    mission: asset('mission', 'data-panel'),
  },
  typeIcon: {
    ninja: { x: 36.5, y: 38, size: 173 },
    jutsu: { x: 36.5, y: 38, size: 173 },
    mission: { x: 36.5, y: 38, size: 173 },
    client: { x: 36.5, y: 38, size: 173 },
  },
  elements: { pos: { x: 567, y: 46, size: 145 }, slotDy: 168, variant: '01' },
  cost: {
    // Medidos com 82 e 85 px; recentralizados no tamanho padrão (76 e 87).
    ninja: { entrance: { x: 547, y: 689, size: 76 }, hand: { x: 619, y: 683, size: 87 } },
    client: { entrance: { x: 547, y: 689, size: 76 }, hand: { x: 619, y: 683, size: 87 } },
    mission: { entrance: { x: 530, y: 715, size: 72 }, hand: { x: 607.2, y: 714, size: 76 } },
  },
  jutsuCost: {
    x: 138,
    cy: 747,
    elementSize: 42,
    chakraSize: 74,
    separatorSize: 26,
    separatorMargin: '0 6px 0 -5px',
    orSize: 22,
    orMargin: '0 10px',
    orColor: '#fbf3e4',
    color: '#c8962a',
  },
  attribute: { x: 413, y: 721, size: 333, defaultFrame: '01' },
  village: { x: 85, y: 687.85, size: 62.7 },
  name: {
    ninja: { align: 'center', x: 340, cy: 720, maxWidth: 370, size: 50, color: '#131313' },
    client: { align: 'center', x: 347, cy: 718, maxWidth: 370, size: 46, color: '#131313' },
    mission: { align: 'left', x: 116, cy: 735, maxWidth: 400, size: 50, color: '#131313' },
    jutsu: { align: 'left', x: 140, cy: 697, maxWidth: 560, size: 46, color: '#fbf3e4', stroke: '#2a160b' },
  },
  characteristics: {
    ninja: { x: 91, cy: 775, maxWidth: 560, size: 18, color: '#8a2a26', separator: '#b07b77' },
    client: { x: 91, cy: 775, maxWidth: 560, size: 18, color: '#8a2a26', separator: '#b07b77' },
  },
  textBox: {
    ninja: { x: 91, top: 820, w: 560, bottom: 996, size: 21, lineHeight: 23.4, gap: 12, color: '#1d1d1d' },
    client: { x: 91, top: 820, w: 585, bottom: 996, size: 21, lineHeight: 23.4, gap: 12, color: '#1d1d1d' },
    mission: { x: 112, top: 782, w: 550, bottom: 960, size: 21, lineHeight: 23.4, gap: 2, color: '#1d1d1d' },
    jutsu: { x: 141, top: 793, w: 490, bottom: 966, size: 21, lineHeight: 24, gap: 9, color: '#f6ecdc', stroke: '#3a2010' },
  },
  markColor: {
    ninja: MARK_ON_LIGHT,
    client: MARK_ON_LIGHT,
    mission: MARK_ON_LIGHT,
    jutsu: { red: '#ff7a6b', blue: '#8cc8ff' },
  },
  flavor: {
    ninja: { x: 92, w: 600, bottom: 660, size: 21, lineHeight: 24.5 },
    client: { x: 92, w: 555, bottom: 660, size: 21, lineHeight: 24.5 },
    mission: { x: 110, w: 560, bottom: 661, size: 21, lineHeight: 24.5 },
    jutsu: { x: 107, w: 590, bottom: 630, size: 21, lineHeight: 24.5 },
  },
  defaults: { entranceIcon: 'entrance-01', handIcon: 'hand-01' },
};
