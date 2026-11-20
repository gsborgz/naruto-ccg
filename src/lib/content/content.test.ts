import assert from 'node:assert/strict';
import test from 'node:test';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import type { Card, NinjaCard } from '../../models/card.ts';
import { catalogDraft, toCatalogCard } from '../cardMaker/catalogEdit.ts';
import { CHAKRA_ICON, ELEMENT_ICONS, TYPE_ICON_VARIANTS } from '../cardMaker/icons/index.ts';
import { SEED_ICONS } from '../cardMaker/icons/seed.ts';
import { LAYOUTS, LAYOUT_LIST } from '../cardMaker/layouts/index.ts';
import { SEED_LAYOUTS } from '../cardMaker/layouts/seed.ts';
import { assetPathOf, assetUrl, installAssets, isAssetPath } from './assets.ts';
import { parseCatalogCard } from './cardValidation.ts';
import { applyChanges, isCardLayoutChange, isContentChange, linkSharedTypes } from './changes.ts';
import { hydrateContent } from './hydrate.ts';
import { cardsToPtBr } from './ptbr.ts';
import { FIXTURE_CARDS, fixtureNinja } from './testFixture.ts';
import type { ContentSnapshot } from './types.ts';

/** O conteúdo dos testes (cartas inventadas + a configuração da carga inicial), como no testSetup. */
const snapshot = (cards: Card[] = FIXTURE_CARDS): ContentSnapshot =>
  JSON.parse(JSON.stringify({ version: 1, cards, layouts: SEED_LAYOUTS, icons: SEED_ICONS, assets: {} }));

test('hydrateContent preenche o catálogo, os layouts e os ícones no lugar', () => {
  const before = { cards: CARDS, layouts: LAYOUTS, chakra: CHAKRA_ICON };
  const seed = snapshot(FIXTURE_CARDS.slice(0, 3));
  seed.version = 7;
  hydrateContent(seed);
  assert.equal(CARDS, before.cards);
  assert.equal(CARDS.length, 3);
  assert.equal(CARDS_BY_ID.get(seed.cards[0].id), CARDS[0]);
  assert.equal(LAYOUTS, before.layouts);
  assert.deepEqual(LAYOUT_LIST.map((l) => l.id), ['layout-01', 'layout-02', 'layout-03', 'layout-04', 'layout-05']);
  assert.equal(CHAKRA_ICON, before.chakra);
  assert.ok(CHAKRA_ICON.url.endsWith('cost-chakra-any.webp'));
  assert.ok(ELEMENT_ICONS['fire-02']);
  assert.equal(TYPE_ICON_VARIANTS.ninja?.[0].id, 'alter');
  // Volta ao conteúdo dos testes para os outros testes deste arquivo.
  hydrateContent(snapshot());
  assert.equal(CARDS.length, FIXTURE_CARDS.length);
});

test('carga inicial em PT-BR: tradução da carta, glossário e o ajuste do nome traduzido', () => {
  const en: NinjaCard = {
    ...fixtureNinja(1),
    id: 'x-1',
    name: 'Giant Spider',
    text: ['Effect: draw 1 card.'],
    flavor: '"Hi."',
    characteristics: ['Leaf', 'Squad', 'Name: The Third Hokage', 'Mental Power: 2'],
    attributes: ['Weapon'],
    layout: { ...fixtureNinja(1).layout!, nameSize: 2, nameSizePtBr: -4, nameWrapPtBr: 'break' },
  };
  const hokage: NinjaCard = { ...fixtureNinja(3), id: 'x-2', name: 'The Third Hokage' };
  const translations = {
    'x-1': { name: 'Aranha Gigante', text: ['Efeito: compre 1 card.'], flavor: '"Oi."' },
    'x-2': { name: 'O Terceiro Hokage' },
  };
  const [pt, other] = cardsToPtBr([en, hokage], undefined, translations);
  assert.equal(pt.name, 'Aranha Gigante');
  assert.deepEqual(pt.text, ['Efeito: compre 1 card.']);
  assert.equal(pt.flavor, '"Oi."');
  assert.ok(pt.type === 'ninja');
  assert.deepEqual(pt.characteristics, ['Folha', 'Esquadrão', 'Nome: O Terceiro Hokage', 'Poder Mental: 2']);
  assert.deepEqual(pt.attributes, ['Arma']);
  // Nome traduzido: o ajuste do nome em PT-BR vira o ajuste do nome; os campos antigos saem.
  assert.equal(pt.layout?.nameSize, -4);
  assert.equal(pt.layout?.nameWrap, 'break');
  assert.ok(!('nameSizePtBr' in pt.layout!) && !('nameWrapPtBr' in pt.layout!));
  // Sem tradução do nome (personagem): fica o ajuste do nome.
  const kept = cardsToPtBr([{ ...en, id: 'x-3' }], undefined, {})[0];
  assert.equal(kept.layout?.nameSize, 2);
  assert.equal(other.name, 'O Terceiro Hokage');
});

test('aba Editar: a carta do catálogo vai para o editor e volta igual', () => {
  for (const card of [CARDS_BY_ID.get('fx-n-001')!, CARDS_BY_ID.get('fx-j-001')!, CARDS_BY_ID.get('fx-m-001')!, CARDS_BY_ID.get('fx-c-001')!]) {
    const back = toCatalogCard(card, catalogDraft(card));
    const { layout: _a, ...data } = back;
    const { layout: _b, ...original } = card;
    assert.deepEqual(data, original, card.id);
    if (card.layout) assert.deepEqual(back.layout, card.layout, `${card.id}: layout`);
  }
});

test('aba Editar: o que o editor muda vai para a carta e para o layout dela', () => {
  const card = CARDS_BY_ID.get('fx-n-001')!;
  const draft = catalogDraft(card);
  const edited = toCatalogCard(card, {
    ...draft,
    name: 'Naruto\nUzumaki',
    text: '[Efeito:] compre {2} cards.',
    healthy: '9/4',
    entranceCost: 'X',
    characteristics: ['Folha', 'Esquadrão'],
    villages: [{ village: 'sand', rogue: true }],
    nameSize: -2,
    art: { ...draft.art, x: 10 },
  });
  assert.ok(edited.type === 'ninja');
  assert.equal(edited.name, 'Naruto Uzumaki');
  assert.equal(edited.layout?.nameText, 'Naruto\nUzumaki');
  assert.deepEqual(edited.text, ['Efeito: compre 2 cards.']);
  assert.equal(edited.layout?.textMarkup, '[Efeito:] compre {2} cards.');
  assert.deepEqual(edited.healthy, { combat: 9, support: 4 });
  assert.equal(edited.entranceCost, -1);
  assert.deepEqual(edited.characteristics, ['Folha', 'Esquadrão']);
  assert.deepEqual(edited.layout?.villages, [{ village: 'sand', rogue: true }]);
  assert.equal(edited.layout?.nameSize, -2);
  assert.equal(edited.layout?.art.back?.x, 10);
  assert.equal(edited.layout?.art.back?.print, true);
  // O id, a coleção, o número e a imagem não mudam.
  assert.deepEqual([edited.id, edited.set, edited.number, edited.image], [card.id, card.set, card.number, card.image]);
  // E o editor mostra de novo o que foi gravado.
  const again = catalogDraft(edited);
  assert.equal(again.name, 'Naruto\nUzumaki');
  assert.equal(again.text, '[Efeito:] compre {2} cards.');
  assert.deepEqual(again.villages, [{ village: 'sand', rogue: true }]);
});

test('aba Editar: o servidor confere a carta antes de gravar', () => {
  const original = CARDS_BY_ID.get('fx-n-001')!;
  const layouts = new Set(Object.keys(LAYOUTS));
  const ok = parseCatalogCard({ ...original, id: 'outro', set: 'S29', extra: 1 }, original, layouts);
  assert.ok(ok.ok);
  assert.equal(ok.card.id, original.id);
  assert.equal(ok.card.set, original.set);
  assert.ok(!('extra' in ok.card));
  const bad = (change: Record<string, unknown>) => !parseCatalogCard({ ...original, ...change }, original, layouts).ok;
  assert.ok(bad({ name: '' }));
  assert.ok(bad({ type: 'dragão' }));
  assert.ok(bad({ entranceCost: 1.5 }));
  assert.ok(bad({ elements: ['plasma'] }));
  assert.ok(bad({ layout: { ...original.layout, layout: 'layout-99' } }));
  assert.ok(bad({ layout: { ...original.layout, art: { back: { x: 0, y: 0, zoom: 1, src: 'https://exemplo.com/a.png' } } } }));
  assert.ok(!bad({ layout: { ...original.layout, art: { back: { x: 0, y: 0, zoom: 1, src: `https://abc.public.blob.vercel-storage.com/naruto-ccg/art/${'a'.repeat(64)}.webp` } } } }));
});

test('tipos com a mesma configuração dividem o objeto (como forAllTypes) e mudam juntos', () => {
  const layout = {
    typeIcon: { ninja: { x: 1, y: 2, size: 3 }, client: { x: 1, y: 2, size: 3 }, jutsu: { x: 1, y: 2, size: 3 }, mission: { x: 1, y: 2, size: 3 } },
    name: { ninja: { size: 10 }, client: { size: 12 } },
  };
  const linked = linkSharedTypes(structuredClone(layout));
  assert.equal(linked.typeIcon.ninja, linked.typeIcon.mission);
  assert.notEqual(linked.name.ninja, linked.name.client);

  const edited = applyChanges(layout, [{ path: ['typeIcon', 'ninja', 'x'], value: 9 }]);
  assert.deepEqual([edited.typeIcon.ninja.x, edited.typeIcon.client.x, edited.typeIcon.jutsu.x, edited.typeIcon.mission.x], [9, 9, 9, 9]);
  const one = applyChanges(layout, [{ path: ['name', 'ninja', 'size'], value: 11 }]);
  assert.deepEqual([one.name.ninja.size, one.name.client.size], [11, 12]);
  // O original não muda e o resultado é JSON puro (objetos separados de novo).
  assert.equal(layout.typeIcon.ninja.x, 1);
  assert.notEqual(edited.typeIcon.ninja, edited.typeIcon.client);
});

test('applyChanges cria campos, troca listas inteiras e tira campos com null', () => {
  const base = { a: { b: 1 }, list: [1, 2], gone: 'x' };
  const out = applyChanges(base, [
    { path: ['a', 'c', 'd'], value: 'novo' },
    { path: ['list'], value: [3, 4, 5] },
    { path: ['gone'], value: null },
  ]);
  assert.deepEqual(out, { a: { b: 1, c: { d: 'novo' } }, list: [3, 4, 5] });
});

test('edições: caminho e valor conferidos', () => {
  assert.ok(isContentChange({ path: ['cost', 'ninja', 'entrance', 'x'], value: 12.5 }));
  assert.ok(!isContentChange({ path: ['__proto__', 'x'], value: 1 }));
  assert.ok(!isContentChange({ path: [], value: 1 }));
  assert.ok(!isContentChange({ path: ['a'], value: null }));
  assert.ok(!isContentChange({ path: ['a'], value: { nested: true } }));
  assert.ok(!isContentChange({ path: ['a'], value: Number.NaN }));

  assert.ok(isCardLayoutChange({ path: ['nameSize'], value: -4.5 }));
  assert.ok(!isCardLayoutChange({ path: ['nameSize'], value: 99 }));
  assert.ok(isCardLayoutChange({ path: ['nameWrap'], value: null }));
  assert.ok(!isCardLayoutChange({ path: ['nameWrap'], value: 'qualquer' }));
  assert.ok(isCardLayoutChange({ path: ['icons', 'elements'], value: ['02', '01'] }));
  assert.ok(!isCardLayoutChange({ path: ['art', 'back', 'x'], value: 1 }));
  assert.ok(!isCardLayoutChange({ path: ['layout'], value: 3 }));
});

test('imagens: o mapa troca o caminho lógico pela URL do Blob', () => {
  installAssets({ 'layout-02/jutsu-frame.webp': 'https://blob.example/naruto-ccg/card-layouts/layout-02/jutsu-frame-abc.webp' });
  assert.equal(assetUrl('/card-layouts/layout-02/jutsu-frame.webp'), 'https://blob.example/naruto-ccg/card-layouts/layout-02/jutsu-frame-abc.webp');
  assert.equal(assetUrl('/card-layouts/layout-01/jutsu-frame.webp'), '/card-layouts/layout-01/jutsu-frame.webp');
  assert.equal(assetUrl('/cards/s01/s01-n-001.webp'), '/cards/s01/s01-n-001.webp');
  assert.equal(assetUrl(undefined), undefined);
  installAssets({});

  assert.equal(assetPathOf('/card-layouts/icons/element/element-fire-02.webp'), 'icons/element/element-fire-02.webp');
  assert.equal(assetPathOf('/card-layouts/../secret.webp'), null);
  assert.equal(assetPathOf('https://x/card-layouts/a.webp'), null);
  assert.ok(isAssetPath('icons/village/village-leaf-rogue.webp'));
  assert.ok(!isAssetPath('icons/x.png'));
  assert.ok(!isAssetPath('/icons/x.webp'));
});
