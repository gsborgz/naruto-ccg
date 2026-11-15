import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setLayoutSize } from './devCardLayoutEdit.ts';

const SOURCE = `export const SET = [
  {
    id: "s01-n-001",
    name: "Naruto Uzumaki",
    layout: {
      layout: "layout-01",
      nameSize: 0,
      nameSizePtBr: 0,
      icons: { type: "default", elements: ["01"] },
    },
  },
  {
    id: "s01-n-002",
    name: "Sasuke Uchiha",
    layout: {
      layout: "layout-01",
      nameSize: 0,
      icons: { type: "default", elements: ["01"] },
    },
  },
  {
    id: "s01-n-003",
    name: "Sakura Haruno",
  },
];
`;

test('ajuste do nome: troca só o campo da carta pedida', () => {
  const out = setLayoutSize(SOURCE, 's01-n-002', 'nameSize', -4.5)!;
  assert.match(out, /id: "s01-n-002",\n    name: "Sasuke Uchiha",\n    layout: \{\n      layout: "layout-01",\n      nameSize: -4.5,/);
  // As outras cartas ficam como estavam.
  assert.equal(out.replace('nameSize: -4.5,', 'nameSize: 0,'), SOURCE);
  const pt = setLayoutSize(SOURCE, 's01-n-001', 'nameSizePtBr', 3)!;
  assert.equal(pt, SOURCE.replace('nameSizePtBr: 0,', 'nameSizePtBr: 3,'));
});

test('ajuste do nome: acrescenta o campo que falta, depois do layout', () => {
  const out = setLayoutSize(SOURCE, 's01-n-002', 'nameSizePtBr', -2)!;
  assert.ok(out.includes('      layout: "layout-01",\n      nameSizePtBr: -2,\n      nameSize: 0,'));
  // Não mexe no layout da primeira carta.
  assert.equal(out.match(/nameSizePtBr/g)!.length, 2);
});

test('ajuste do nome: arquivo com quebras CRLF continua CRLF', () => {
  const crlf = SOURCE.replace(/\n/g, '\r\n');
  assert.equal(setLayoutSize(crlf, 's01-n-002', 'nameSize', 2), SOURCE.replace(/(Sasuke[\s\S]*?nameSize: )0/, '$12').replace(/\n/g, '\r\n'));
});

test('ajuste do nome: carta fora do arquivo ou sem layout', () => {
  assert.equal(setLayoutSize(SOURCE, 's01-n-999', 'nameSize', 1), null);
  assert.equal(setLayoutSize(SOURCE, 's01-n-003', 'nameSize', 1), null);
});
