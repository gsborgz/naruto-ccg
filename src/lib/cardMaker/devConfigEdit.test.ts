import assert from 'node:assert/strict';
import { test } from 'node:test';
import { applyCardLayoutEdits, applyConfigEdits, configFile } from './devConfigEdit.ts';

// Trechos de exemplo com os padrões dos arquivos de configuração (não os arquivos reais, que mudam pelo editor).

const LAYOUT = `import { forAllTypes } from './shared.ts';

// Comentário que tem de ficar.
const MARK_ON_DARK: Record<TextColor, string> = { red: '#ff7a6b', blue: '#8cc8ff' };
const COST: CostLayout = { entrance: { x: 555, y: 777, size: 76 }, hand: { x: 611.2, y: 770.4, size: 87 } };

export const LAYOUT_XX: LayoutSpec = {
  id: 'layout-xx',
  typeIcon: forAllTypes({ x: 6, y: 10, size: 173 }),
  cost: {
    ninja: { entrance: { x: 547, y: 689, size: 76 }, hand: { x: 619, y: 683, size: 87 } },
    client: { entrance: { x: 547, y: 689, size: 76 }, hand: { x: 619, y: 683, size: 87 } },
    mission: COST,
  },
  name: {
    ninja: { align: 'center', x: 340, cy: 720, maxWidth: 370, size: 50, color: '#131313' },
  },
  markColor: forAllTypes(MARK_ON_DARK),
};
`;

const ELEMENT = `export const ELEMENT_FIRE_02: NamedIconConfig = {
  url: iconUrl('element', 'element-fire-02'),
  aspect: 1225 / 1228,
  label: {
    ...SIDE_LABEL_STYLE,
    text: 'FIRE',
    length: 0.28,
  },
};
`;

const ATTRIBUTE = `export const COMBAT_ATTRIBUTES_XX: CombatAttributeIconConfig = {
  circle: { cx: 1060, cy: 1019, r: 143 },
  label: { ...ATTRIBUTE_TEXT_STYLE.label, size: 29.2, uppercase: false, strokeWidth: 0 },
  kanji: ATTRIBUTE_TEXT_STYLE.kanji,
};
`;

const SET = `export const SXX: Card[] = [
  {
    id: "sxx-n-001",
    name: "Neji Hyuga",
    layout: {
      layout: "layout-02",
      nameSize: 0,
      nameSizePtBr: 0,
      icons: { type: "default", elements: ["02"], entrance: "entrance-03", hand: "hand-02", attribute: "03-01" },
      art: { back: { x: 0, y: -0.5, zoom: 0.999, print: true } },
    },
  },
  {
    id: "sxx-n-002",
    name: "Sakura Haruno",
    layout: {
      layout: "layout-02",
      icons: { type: "default", elements: ["02"], entrance: "entrance-03", hand: "hand-02", attribute: "03-01" },
      art: { back: { x: 0, y: -0.5, zoom: 0.999, print: true } },
    },
  },
];
`;

test('troca um número no lugar, sem mexer no resto', () => {
  const out = applyConfigEdits(LAYOUT, [{ path: ['cost', 'ninja', 'entrance', 'x'], value: 550.5 }]);
  assert.match(out, /ninja: \{ entrance: \{ x: 550\.5, y: 689, size: 76 \}/);
  assert.equal(out.split('\n').length, LAYOUT.split('\n').length);
  assert.match(out, /\/\/ Comentário que tem de ficar\./);
  // O cliente tem o próprio objeto: não muda.
  assert.match(out, /client: \{ entrance: \{ x: 547, y: 689/);
});

test('forAllTypes e constantes do arquivo: a edição vai para o valor compartilhado', () => {
  const out = applyConfigEdits(LAYOUT, [
    { path: ['typeIcon', 'ninja', 'x'], value: 7 },
    { path: ['cost', 'mission', 'hand', 'size'], value: 90 },
    { path: ['markColor', 'ninja', 'red'], value: '#ff0000' },
  ]);
  assert.match(out, /typeIcon: forAllTypes\(\{ x: 7, y: 10, size: 173 \}\)/);
  assert.match(out, /hand: \{ x: 611\.2, y: 770\.4, size: 90 \}/);
  assert.match(out, /MARK_ON_DARK: Record<TextColor, string> = \{ red: '#ff0000'/);
});

test('campo ausente: acrescenta no objeto (spread ou opcional)', () => {
  const out = applyConfigEdits(ELEMENT, [{ path: ['label', 'weight'], value: 700 }]);
  assert.match(out, /length: 0\.28,\n    weight: 700,\n  \},/);

  const layout = applyConfigEdits(LAYOUT, [{ path: ['name', 'ninja', 'maxHeight'], value: 80 }]);
  assert.match(layout, /color: '#131313', maxHeight: 80 \}/);
});

test('valor importado: vira um spread que sobrescreve só o campo', () => {
  const out = applyConfigEdits(ATTRIBUTE, [{ path: ['kanji', 'size'], value: 1.8 }]);
  assert.match(out, /kanji: \{ \.\.\.ATTRIBUTE_TEXT_STYLE\.kanji, size: 1\.8 \}/);
});

test('lista: gravada inteira (no lugar ou acrescentada sobre o spread)', () => {
  const out = applyConfigEdits(ATTRIBUTE, [
    { path: ['label', 'dyWithKanji'], value: [0.7, 0.58, 0.5] },
    { path: ['label', 'dyWithKanji'], value: [0.71, 0.58, 0.5] },
  ]);
  assert.match(out, /strokeWidth: 0, dyWithKanji: \[0\.71, 0\.58, 0\.5\] \}/);
});

test('layout de uma carta da coleção: troca, acrescenta (com aspas duplas) e tira campos', () => {
  const out = applyCardLayoutEdits(SET, 'sxx-n-001', [
    { path: ['icons', 'attribute'], value: '03-02' },
    { path: ['icons', 'elements'], value: ['03'] },
    { path: ['panelVariant'], value: 'red' },
    { path: ['nameSizePtBr'], value: null },
  ]);
  const block = out.slice(out.indexOf('id: "sxx-n-001"'), out.indexOf('id: "sxx-n-002"'));
  assert.match(block, /icons: \{ type: "default", elements: \["03"\], entrance: "entrance-03", hand: "hand-02", attribute: "03-02" \}/);
  assert.match(block, /art: \{ back: .*\},\n      panelVariant: "red",\n    \},/);
  assert.doesNotMatch(block, /nameSizePtBr/);
  // A outra carta não muda.
  assert.equal(out.slice(out.indexOf('id: "sxx-n-002"')), SET.slice(SET.indexOf('id: "sxx-n-002"')));
  // Quebras CRLF continuam CRLF.
  const crlf = applyCardLayoutEdits(SET.replace(/\n/g, '\r\n'), 'sxx-n-002', [{ path: ['nameBanner'], value: false }]);
  assert.match(crlf, /print: true \} \},\r\n      nameBanner: false,\r\n    \},/);
  assert.throws(() => applyCardLayoutEdits(SET, 'nao-existe', [{ path: ['layout'], value: 'layout-01' }]));
});

test('arquivo de cada alvo', () => {
  assert.equal(configFile({ kind: 'layout', id: 'layout-03' }), 'layouts/layout03.ts');
  assert.equal(configFile({ kind: 'icon', group: 'attribute', id: '03-01' }), 'icons/combat-attributes/03-01.ts');
  assert.throws(() => configFile({ kind: 'icon', group: 'cost', id: '../x' }));
});
