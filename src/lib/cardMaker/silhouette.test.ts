import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrapFloat, type Silhouette } from './silhouette.ts';

/** Silhueta inventada: metade de cima vazia, metade de baixo opaca a partir de 1/4 da largura. */
const half: Silhouette = {
  left: [1, 1, 0.25, 0.25],
  right: [0, 0, 1, 1],
};
const box = { x: 100, top: 800, w: 500, bottom: 1000 };

test('contorno: ícone à direita invadindo a caixa de texto vira um bloco à direita com a silhueta', () => {
  const f = wrapFloat(half, { x: 500, y: 850, w: 200, h: 200 }, box, 6);
  assert.ok(f);
  assert.equal(f.side, 'right');
  // Começa no topo do ícone e vai só até o fim da caixa.
  assert.equal(f.top, 50);
  assert.equal(f.height, 150);
  // Da borda do ícone até a borda direita da caixa.
  assert.equal(f.width, 100);
  // Metade de cima do ícone (100 px) está vazia: a borda; depois, 1/4 de 200 = 50 px a partir do ícone (a última faixa fica fora da caixa).
  assert.equal(f.shape, 'polygon(100px 0px, 100px 0px, 100px 50px, 100px 50px, 100px 100px, 50px 100px, 50px 150px, 100px 150px)');
  assert.equal(f.margin, 6);
});

test('contorno: ícone à esquerda usa o fim da silhueta; ícone fora da caixa não faz nada', () => {
  const f = wrapFloat(half, { x: 0, y: 700, w: 200, h: 200 }, box, 0);
  assert.ok(f);
  assert.equal(f.side, 'left');
  assert.equal(f.top, 0);
  assert.equal(f.width, 100);
  assert.equal(f.height, 100);
  assert.equal(wrapFloat(half, { x: 500, y: 400, w: 200, h: 200 }, box, 6), null);
  assert.equal(wrapFloat(half, { x: 650, y: 900, w: 100, h: 100 }, box, 6), null);
});
