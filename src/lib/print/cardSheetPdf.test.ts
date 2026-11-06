import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCardSheetPdf, CARDS_PER_PAGE, type JpegImage } from './cardSheetPdf.ts';

// O gerador não lê o JPEG, só o embute: bytes quaisquer servem para conferir a estrutura.
const fakeJpeg = (n: number): JpegImage => ({ width: 429, height: 600, data: new Uint8Array(100 + n).fill(0xff) });
const latin1 = (b: Uint8Array) => Buffer.from(b).toString('latin1');

function xrefOffsets(text: string): number[] {
  const start = Number(/startxref\n(\d+)/.exec(text)![1]);
  assert.ok(text.startsWith('xref', start), 'startxref aponta para a tabela xref');
  const [, count] = /^xref\n0 (\d+)\n/.exec(text.slice(start))!.map(Number);
  const rows = text.slice(start).split('\n').slice(2, 2 + count);
  return rows.slice(1).map((r) => Number(r.slice(0, 10)));
}

test('pdf: xref aponta para o início de cada objeto', () => {
  const text = latin1(buildCardSheetPdf([fakeJpeg(1), fakeJpeg(2)], [0, 0, 0, 1], 'Konoha'));
  assert.ok(text.startsWith('%PDF-1.4\n'));
  assert.ok(text.endsWith('%%EOF\n'));
  xrefOffsets(text).forEach((off, i) => assert.ok(text.startsWith(`${i + 1} 0 obj\n`, off), `objeto ${i + 1}`));
});

test('pdf: 9 cartas por folha, imagem embutida uma vez por carta', () => {
  const slots = Array.from({ length: 50 }, (_, i) => i % 17);
  const images = Array.from({ length: 17 }, (_, i) => fakeJpeg(i));
  const text = latin1(buildCardSheetPdf(images, slots));
  const pages = Math.ceil(50 / CARDS_PER_PAGE);
  assert.match(text, new RegExp(`/Type /Pages /Count ${pages} `));
  assert.equal(text.match(/\/Subtype \/Image/g)!.length, 17);
  assert.equal(text.match(/ Do Q/g)!.length, 50);
});

test('pdf: título com acento vai em UTF-16BE', () => {
  const text = latin1(buildCardSheetPdf([fakeJpeg(0)], [0], 'Ação'));
  assert.match(text, /\/Title <FEFF004100E700E3006F>/);
});

test('pdf: slot fora das imagens é rejeitado', () => {
  assert.throws(() => buildCardSheetPdf([fakeJpeg(0)], [1]), RangeError);
});
