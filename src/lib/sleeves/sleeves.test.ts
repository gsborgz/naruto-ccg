import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseDeck } from '../decks/types.ts';
import { CENTERED, clampFrame, frameRect, SLEEVE_ZOOM, zoomFrame } from './frame.ts';
import { parseDeckSleeve, parseSleeve, sleeveVar } from './types.ts';

const ID = '0f8fad5b-d9cb-469f-a165-70867728950e';
const ART = `https://abc123.public.blob.vercel-storage.com/naruto-ccg/art/${'a'.repeat(64)}.webp`;

test('sleeve: nome e imagem do Blob; o resto é recusado', () => {
  const s = parseSleeve({ id: ID.toUpperCase(), name: '  Folha  ', image: ART });
  assert.equal(s?.id, ID);
  assert.equal(s?.name, 'Folha');
  assert.equal(parseSleeve({ id: ID, name: '', image: ART })?.name, 'Sleeve sem nome');
  assert.equal(parseSleeve({ id: ID, name: 'x' }), null, 'sem imagem');
  assert.equal(parseSleeve({ id: ID, name: 'x', image: 'data:image/webp;base64,AAAA' }), null, 'imagem não enviada');
  assert.equal(parseSleeve({ id: 'x', name: 'x', image: ART }), null, 'id inválido');
  assert.equal(parseDeckSleeve(undefined), undefined);
  assert.equal(parseDeckSleeve({ id: ID, image: 'https://exemplo.com/a.png' }), null);
  assert.deepEqual(sleeveVar(ART), { '--sleeve': `url("${ART}")` });
  assert.deepEqual(sleeveVar('https://exemplo.com/a.png'), {});
  assert.deepEqual(sleeveVar(null), {});
});

test('sleeve: enquadramento cobre a carta, com zoom e deslocamento limitados', () => {
  // Imagem 1500×1050: no "cobrir" fica 1500×1050 na carta de 750×1050 (sobra 375 de cada lado).
  assert.deepEqual(frameRect(1500, 1050, CENTERED), { left: -375, top: 0, width: 1500, height: 1050 });
  assert.deepEqual(clampFrame(1500, 1050, { x: 999, y: 50, zoom: 1 }), { x: 375, y: 0, zoom: 1 });
  assert.equal(clampFrame(1500, 1050, { x: 0, y: 0, zoom: 99 }).zoom, SLEEVE_ZOOM.max);
  assert.equal(clampFrame(1500, 1050, { x: 0, y: 0, zoom: 0.2 }).zoom, SLEEVE_ZOOM.min);
  // Zoom 2 em volta do canto de cima à esquerda: esse ponto da imagem continua no mesmo lugar.
  const z = zoomFrame(750, 1050, CENTERED, 2, 0, 0);
  assert.deepEqual(frameRect(750, 1050, z), { left: 0, top: 0, width: 1500, height: 2100 });
});

test('sleeve: o deck guarda o id do sleeve escolhido', () => {
  const base = { id: ID, name: 'Deck', cards: {}, createdAt: 'a', updatedAt: 'b' };
  assert.equal(parseDeck({ ...base, sleeve: ID.toUpperCase() })?.sleeve, ID);
  assert.equal(parseDeck(base)?.sleeve, undefined);
  assert.equal(parseDeck({ ...base, sleeve: 'nao-e-uuid' }), null);
});
