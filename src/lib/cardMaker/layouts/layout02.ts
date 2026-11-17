import type { TextColor } from '../model.ts';
import { PART_NAME, layoutAsset } from './shared.ts';
import type { LayoutSpec } from './types.ts';

/**
 * Layout 2 (card-layouts/layout-02): moldura com arco dourado, painel com cantoneiras; até 3 elementos,
 * ícones de elemento da variante 02, custo com shuriken azul e cartas douradas.
 * Calibrado contra card-layouts/examples/layout-02 (cartas do S29: Hinata Hyuga 5015, Fukasaku & Shima
 * 5006, Thief Leader 5005, Waraji 5007, Earth Style: Mud Fall 5000, Wind Release: Spiralling Wind Ball
 * 5016, A New Arrival 5000, Gang World 5006).
 *
 * A linha vermelha do painel Ninja/Cliente fica em y=752 (como na Thief Leader); nas cartas impressas
 * ela muda com o texto (na Hinata, y=767). Nome, vila, características e texto seguem a do asset.
 *
 * Os ícones têm o mesmo tamanho do layout 1 (`size`). As posições
 * foram calculadas para manter o centro medido nos exemplos: ícone do tipo em (124, 123), elementos com
 * centro horizontal em 641, kunai pelo losango do atributo em (699, 998).
 */

const MARK_ON_LIGHT: Record<TextColor, string> = { red: '#c4161c', blue: '#1b4fc4' };
const asset = (type: keyof typeof PART_NAME, part: 'frame' | 'data-panel') =>
  layoutAsset('layout-02', `${PART_NAME[type]}-${part}`);

export const LAYOUT_02: LayoutSpec = {
  id: 'layout-02',
  label: 'Layout 2',
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
    ninja: { x: 37.5, y: 38, size: 173 },
    jutsu: { x: 37.5, y: 38, size: 173 },
    mission: { x: 37.5, y: 38, size: 173 },
    client: { x: 37.5, y: 38, size: 173 },
  },
  // Centro do 1º espaço em (641, 113); espaços seguintes de 150 a 177 px abaixo nos exemplos.
  elements: { pos: { x: 554.5, y: 52, size: 171.8 }, slotDy: 165, variant: '02' },
  cost: {
    // Centros medidos (entrada / mão): Ninja (593, 704) / (659, 701); Cliente (611, 705) / (677, 700);
    // Missão (576, 734) / (647, 731).
    ninja: { entrance: { x: 557.9, y: 665.6, size: 76 }, hand: { x: 619.8, y: 659, size: 87 } },
    client: { entrance: { x: 570.9, y: 669, size: 76 }, hand: { x: 632.3, y: 662.4, size: 87 } },
    mission: { entrance: { x: 541.1, y: 700, size: 76 }, hand: { x: 599.5, y: 693.4, size: 87 } },
  },
  jutsuCost: {
    x: 128,
    cy: 739,
    elementSize: 42,
    chakraSize: 74,
    separatorSize: 24,
    separatorMargin: '0 6px 0 0',
    orSize: 22,
    orMargin: '0 12px',
    orColor: '#fbf3e4',
    color: '#c8962a',
  },
  attribute: { x: 415.2, y: 718.7, size: 333, defaultFrame: '03-01' },
  // A vila fica na linha do nome (no exemplo da Hinata, os dois em y≈706; ver a nota sobre a linha vermelha).
  village: { x: 87.3, y: 667.6, size: 62.7 },
  name: {
    ninja: { align: 'center', x: 341.2, cy: 695.4, maxWidth: 338.5, size: 41.3, color: '#131313' },
    client: { align: 'center', x: 374, cy: 691, maxWidth: 400, size: 52, color: '#131313' },
    mission: { align: 'left', x: 108, cy: 727, maxWidth: 420, size: 50, color: '#131313' },
    jutsu: { align: 'left', x: 126, cy: 682, maxWidth: 590, size: 38, color: '#fbf3e4', stroke: '#2a160b' },
  },
  characteristics: {
    ninja: { x: 94.7, cy: 739.6, maxWidth: 582, size: 14.4, color: '#8a2a26', separator: '#8a2a26' },
    client: { x: 101, cy: 737, maxWidth: 560, size: 18, color: '#8a2a26', separator: '#8a2a26' },
  },
  textBox: {
    ninja: { x: 93, top: 765, w: 525, bottom: 990, size: 22, lineHeight: 25, gap: 18, color: '#1d1d1d' },
    client: { x: 93, top: 767, w: 607, bottom: 985, size: 26, lineHeight: 32, gap: 12, color: '#1d1d1d' },
    mission: { x: 101, top: 776, w: 590, bottom: 975, size: 24, lineHeight: 28.5, gap: 4, color: '#1d1d1d', weight: 700 },
    jutsu: { x: 135, top: 776, w: 565, bottom: 975, size: 21.5, lineHeight: 25.7, gap: 10, color: '#f3ead8', stroke: '#3a2010' },
  },
  markColor: {
    ninja: MARK_ON_LIGHT,
    client: MARK_ON_LIGHT,
    mission: MARK_ON_LIGHT,
    jutsu: { red: '#ff7a6b', blue: '#8cc8ff' },
  },
  flavor: {
    ninja: { x: 96, w: 600, bottom: 635, size: 21, lineHeight: 24 },
    client: { x: 40, w: 640, bottom: 635, size: 21, lineHeight: 24 },
    mission: { x: 56, w: 600, bottom: 661, size: 21, lineHeight: 24 },
    jutsu: { x: 61, w: 600, bottom: 618, size: 21, lineHeight: 24 },
  },
  defaults: { entranceIcon: 'entrance-03', handIcon: 'hand-02' },
};
