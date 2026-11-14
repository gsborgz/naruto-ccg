import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CARDS_BY_ID } from '../../data/cards.ts';
import {
  ATTRIBUTE_KANJI,
  ATTRIBUTE_NAMES,
  attributeCircle,
  attributeKanjiUrls,
  attributeSlug,
  elementBox,
  elementIcon,
  elementVariants,
  typeIcon,
  typeIconVariants,
  getLayout,
  frameFor,
  panelFor,
  villageBox,
  villageIconUrl,
} from './layouts/index.ts';

const L1 = getLayout('layout-01');
const L2 = getLayout('layout-02');
import {
  catalogTextToMarkup,
  fromCatalogCard,
  getArt,
  moveArt,
  newCustomCard,
  cardVillages,
  withVillages,
  parseCardText,
  parseTextBlock,
  setArtImage,
  withLayout,
  withLayoutIcons,
  setArtFrame,
  resetArt,
} from './model.ts';

const NOW = '2026-01-01T00:00:00.000Z';
const catalog = (id: string) => {
  const card = CARDS_BY_ID.get(id);
  assert.ok(card, id);
  return card;
};

test('criador: só os colchetes marcam negrito; o resto sai como foi escrito', () => {
  // [trecho] → negrito sem colchetes; maiúsculas não mudam.
  assert.deepEqual(parseTextBlock('[Efeito]'), [{ text: 'Efeito', bold: true }]);
  assert.deepEqual(parseTextBlock('[Efeito:] compre 1 carta.'), [
    { text: 'Efeito:', bold: true },
    { text: ' compre 1 carta.', bold: false },
  ]);
  // [[trecho]] → negrito com os colchetes.
  assert.deepEqual(parseTextBlock('[[Efeito]] compre 1 carta.'), [
    { text: '[Efeito]', bold: true },
    { text: ' compre 1 carta.', bold: false },
  ]);
  assert.deepEqual(parseTextBlock('with [[TRUE ALLIES]] effect, draw [1] card.'), [
    { text: 'with ', bold: false },
    { text: '[TRUE ALLIES]', bold: true },
    { text: ' effect, draw ', bold: false },
    { text: '1', bold: true },
    { text: ' card.', bold: false },
  ]);
  // Sem marcação, nada fica em negrito (nem rótulos com dois-pontos).
  assert.deepEqual(parseTextBlock('Effect: Draw a card.'), [{ text: 'Effect: Draw a card.', bold: false }]);
  assert.equal(parseCardText('[A]\n\n  \nEffect: x').length, 2);
});

test('criador: {vermelho} e (azul), com a mesma lógica do negrito', () => {
  assert.deepEqual(parseTextBlock('Pay {2} Chakra.'), [
    { text: 'Pay ', bold: false },
    { text: '2', bold: false, color: 'red' },
    { text: ' Chakra.', bold: false },
  ]);
  assert.deepEqual(parseTextBlock('Pay {{2}} or ((X)).'), [
    { text: 'Pay ', bold: false },
    { text: '{2}', bold: false, color: 'red' },
    { text: ' or ', bold: false },
    { text: '(X)', bold: false, color: 'blue' },
    { text: '.', bold: false },
  ]);
  assert.deepEqual(parseTextBlock('(Leaf) ninja'), [
    { text: 'Leaf', bold: false, color: 'blue' },
    { text: ' ninja', bold: false },
  ]);
  // Combinações: negrito + cor.
  assert.deepEqual(parseTextBlock('[{Fire} Effect:] x'), [
    { text: 'Fire', bold: true, color: 'red' },
    { text: ' Effect:', bold: true },
    { text: ' x', bold: false },
  ]);
  // Escape: \( \) saem normais; marcação sem fechamento fica como texto.
  assert.deepEqual(parseTextBlock('Permanent \\(3\\)'), [{ text: 'Permanent (3)', bold: false }]);
  assert.deepEqual(parseTextBlock('a (b'), [{ text: 'a (b', bold: false }]);
});

test('criador: texto do catálogo vira marcação que reproduz o impresso', () => {
  assert.equal(catalogTextToMarkup('[Transformation]'), '[[TRANSFORMATION]]');
  assert.equal(catalogTextToMarkup('Permanent (3)'), '[Permanent \\(3\\)]');
  assert.deepEqual(parseTextBlock(catalogTextToMarkup('Permanent (3)')), [{ text: 'Permanent (3)', bold: true }]);
  assert.equal(catalogTextToMarkup('Effect: Draw a card.'), '[Effect:] Draw a card.');
  assert.equal(
    catalogTextToMarkup('Valid: if you have another Ninja with [TRUE ALLIES] effect, draw 1 card.'),
    '[Valid:] if you have another Ninja with [[TRUE ALLIES]] effect, draw 1 card.',
  );
  assert.equal(catalogTextToMarkup('[EOJ] (1): This Ninja gets +1/+0.'), '[[EOJ]] \\(1\\): This Ninja gets +1/+0.');
  assert.deepEqual(parseTextBlock(catalogTextToMarkup('[EOJ] (1): This Ninja gets +1/+0.')), [
    { text: '[EOJ]', bold: true },
    { text: ' (1): This Ninja gets +1/+0.', bold: false },
  ]);
  // Dois-pontos no meio da frase não é rótulo.
  assert.equal(
    catalogTextToMarkup('While this Ninja is in play, your Ninjas get +1/+0: always.'),
    'While this Ninja is in play, your Ninjas get +1/+0: always.',
  );
  // A marcação gerada volta ao impresso.
  assert.deepEqual(parseTextBlock(catalogTextToMarkup('[Transformation]')), [{ text: '[TRANSFORMATION]', bold: true }]);
});

test('criador: importa Ninja do catálogo (custos, força, vila e atributo)', () => {
  const card = fromCatalogCard(catalog('s10-n-352'), NOW);
  assert.equal(card.type, 'ninja');
  assert.equal(card.name, 'Jiraiya');
  assert.equal(card.entranceCost, '5');
  assert.equal(card.handCost, '2');
  assert.equal(card.healthy, '7/2');
  assert.equal(card.injured, '5/2');
  assert.deepEqual(card.villages, [{ village: 'leaf', rogue: false }]);
  // Renegado: a vila vem com o símbolo riscado.
  const rogue = fromCatalogCard(catalog('s01-n-017'), NOW);
  assert.deepEqual(rogue.villages, [{ village: 'mist', rogue: true }]);
  assert.deepEqual(fromCatalogCard(catalog('s03-n-132'), NOW).villages?.map((v) => v.village), ['waterfall']);
  // Mais de uma vila nas características.
  assert.deepEqual(fromCatalogCard(catalog('s08-n-264'), NOW).villages?.map((v) => v.village), ['leaf', 'sand']);
  assert.deepEqual(card.elements, [{ element: 'lightning', variant: '01' }]);
  assert.equal(card.attribute.label, 'Oil');
  assert.equal(card.reference, '/cards/s10/s10-n-352.webp');
});

test('criador: importa Jutsu e Missão do catálogo', () => {
  const jutsu = fromCatalogCard(catalog('s10-j-us078'), NOW);
  assert.deepEqual(jutsu.jutsuCost, { symbols: ['water'], generic: '1' });

  const mission = fromCatalogCard(catalog('s10-m-us087'), NOW);
  assert.equal(mission.text, '[Permanent \\(3\\)]\n[Effect:] Your Ninjas with a "Byakugan" cannot be affected by the effects of your opponent\'s Jutsu cards.');
  assert.equal(mission.characteristics.length, 0);
  assert.deepEqual(mission.villages, []);
});

test('layouts: 2º elemento fica abaixo do 1º, centralizado nele, e o círculo do atributo cai na kunai', () => {
  const first = elementBox(L1, { element: 'fire', variant: '01' }, 0);
  const second = elementBox(L1, { element: 'fire', variant: '01' }, 1, { element: 'fire', variant: '01' });
  assert.equal(second.y - first.y, L1.elements.slotDy);
  assert.equal(second.x, first.x);
  // Ícones de larguras diferentes: o de baixo copia o centro horizontal do 1º.
  const earth = elementBox(L2, { element: 'earth', variant: '02' }, 0);
  const third = elementBox(L2, { element: 'void', variant: '01' }, 2, { element: 'earth', variant: '02' });
  assert.ok(Math.abs(third.x + third.w / 2 - (earth.x + earth.w / 2)) < 0.01);
  assert.equal(third.y - earth.y, 2 * L2.elements.slotDy);

  for (const spec of [L1, L2]) {
    const circle = attributeCircle(spec, spec.attribute.defaultFrame);
    assert.ok(circle.cx > 690 && circle.cx < 720, `${spec.id} cx ${circle.cx}`);
    assert.ok(circle.cy > 990 && circle.cy < 1020, `${spec.id} cy ${circle.cy}`);
  }
});

test('layouts: vilas na mesma escala e centralizadas no mesmo ponto (a da Nuvem é mais larga)', () => {
  const leaf = villageBox(L1, 'leaf');
  const cloud = villageBox(L1, 'cloud');
  assert.ok(Math.abs(leaf.x + leaf.w / 2 - (cloud.x + cloud.w / 2)) < 0.01);
  assert.ok(Math.abs(leaf.y + leaf.h / 2 - (cloud.y + cloud.h / 2)) < 0.01);
  assert.ok(cloud.w > leaf.w && cloud.h < leaf.h);
  assert.equal(villageIconUrl('hot-water', true), '/card-layouts/icons/village/village-hot-water-rogue.webp');
});

test('layouts: 2 vilas na diagonal e 3 em triângulo, menores que uma só', () => {
  const one = villageBox(L1, 'leaf');
  const center = (b: { x: number; y: number; w: number; h: number }) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
  const [a, b] = [0, 1].map((i) => villageBox(L1, 'leaf', i, 2));
  assert.ok(a.w < one.w && b.w < one.w);
  assert.ok(center(a).x < center(b).x && center(a).y < center(b).y);
  const [top, left, right] = [0, 1, 2].map((i) => villageBox(L1, 'leaf', i, 3));
  assert.ok(top.w < a.w);
  assert.ok(center(top).y < center(left).y && Math.abs(center(left).y - center(right).y) < 0.01);
  assert.ok(center(left).x < center(top).x && center(top).x < center(right).x);
});

test('criador: cartas antigas com uma vila só são lidas no formato novo', () => {
  assert.deepEqual(cardVillages({ village: 'mist', villageRogue: true }), [{ village: 'mist', rogue: true }]);
  assert.deepEqual(cardVillages({ village: null }), []);
  const card = withVillages({ ...newCustomCard('ninja', NOW), village: 'leaf' }, [{ village: 'sand', rogue: false }]);
  assert.equal(card.village, undefined);
  assert.deepEqual(cardVillages(card), [{ village: 'sand', rogue: false }]);
});

test('layouts: importar aplica os ícones do layout; trocar de layout mantém os ícones escolhidos', () => {
  const fukasaku = fromCatalogCard(catalog('s29-n-5006'), NOW, 'layout-02');
  assert.equal(fukasaku.layout, 'layout-02');
  assert.deepEqual(
    fukasaku.elements.map((e) => `${e.element}-${e.variant}`),
    ['lightning-02', 'wind-02', 'fire-02'],
  );
  assert.equal(fukasaku.entranceIcon, 'entrance-03');
  assert.equal(fukasaku.handIcon, 'hand-02');
  assert.equal(fukasaku.attribute.frame, '03-01');

  // De volta ao layout 1: os 3 elementos e os ícones do layout 2 continuam (estilos misturados).
  const back = withLayout(fukasaku, 'layout-01');
  assert.deepEqual(back.elements.map((e) => `${e.element}-${e.variant}`), ['lightning-02', 'wind-02', 'fire-02']);
  assert.equal(back.entranceIcon, 'entrance-03');
  assert.equal(back.attribute.frame, '03-01');

  // Ícones padrão do layout 1 (carta nova / importada).
  const own = withLayoutIcons(back);
  assert.deepEqual(own.elements.map((e) => `${e.element}-${e.variant}`), ['lightning-01', 'wind-01', 'fire-01']);
  assert.equal(own.entranceIcon, 'entrance-01');
  assert.equal(own.handIcon, 'hand-01');
  assert.equal(own.attribute.frame, '01');

  // Custo alternativo ("or") vem do catálogo: "土 | 1 or 3".
  const mudFall = fromCatalogCard(catalog('s29-j-5000'), NOW, 'layout-02');
  assert.deepEqual(mudFall.jutsuCost, { symbols: ['earth'], generic: '1', alternatives: [{ symbols: [], generic: '3' }] });
});

test('layouts: os ícones têm o mesmo tamanho em todos os layouts (só a posição muda)', () => {
  const el = { element: 'fire', variant: '02' } as const;
  assert.equal(elementBox(L1, el, 0).w, elementBox(L2, el, 0).w);
  assert.equal(villageBox(L1, 'leaf').w, villageBox(L2, 'leaf').w);
  assert.equal(attributeCircle(L1, '03-01').r, attributeCircle(L2, '03-01').r);
  assert.notDeepEqual(elementBox(L1, el, 0), elementBox(L2, el, 0));
});

test('layouts 3 a 5: só Ninja; layout 5 sem texto de efeito; mancha atrás do nome', () => {
  const jutsu = fromCatalogCard(catalog('s10-j-us078'), NOW);
  for (const id of ['layout-03', 'layout-04', 'layout-05'] as const) {
    assert.equal(withLayout(jutsu, id).type, 'ninja', id);
  }
  assert.equal(getLayout('layout-05').textBox.ninja, undefined);
  assert.ok(getLayout('layout-04').textBox.ninja);
  assert.equal(getLayout('layout-03').frame.ninja, undefined);
  assert.equal(getLayout('layout-05').nameBanner?.default, true);
  // Layout 3: a mancha já vem na imagem do painel.
  assert.equal(getLayout('layout-03').nameBanner, undefined);
});

test('layout 4: design roxo troca a moldura e o painel', () => {
  const L4 = getLayout('layout-04');
  assert.match(frameFor(L4, 'ninja', undefined) ?? '', /layout-04\/ninja-frame\.webp$/);
  assert.match(frameFor(L4, 'ninja', 'purple') ?? '', /layout-04\/ninja-frame-alter\.webp$/);
  assert.match(panelFor(L4, 'ninja', 'purple') ?? '', /layout-04\/ninja-data-panel-alter\.webp$/);
  // Design que só troca o painel (layout 3) mantém a moldura padrão.
  const L3 = getLayout('layout-03');
  assert.equal(frameFor(L3, 'ninja', 'red'), L3.frame.ninja);
});

test('layout 3: painel padrão ou com a borda vermelha', () => {
  const L3 = getLayout('layout-03');
  assert.match(panelFor(L3, 'ninja', undefined) ?? '', /layout-03\/ninja-data-panel\.webp$/);
  assert.match(panelFor(L3, 'ninja', 'red') ?? '', /layout-03\/ninja-data-panel-alter\.webp$/);
  // Versão que o layout não tem (ex.: carta trocada de layout): painel padrão.
  assert.equal(panelFor(getLayout('layout-04'), 'ninja', 'red'), getLayout('layout-04').panel.ninja);
});

test('arte em duas camadas: ligadas movem juntas; soltas, só a escolhida', () => {
  let card = setArtImage(newCustomCard('ninja', NOW), 'back', 'data:fundo');
  card = moveArt(card, 'back', 10, -5);
  // Com as camadas ligadas (padrão), a nova imagem da frente herda o enquadramento do fundo.
  card = setArtImage(card, 'front', 'data:frente');
  assert.deepEqual(getArt(card, 'front'), { src: 'data:frente', x: 10, y: -5, zoom: 1 });

  card = moveArt(card, 'front', 2, 3);
  assert.deepEqual(getArt(card, 'back'), { src: 'data:fundo', x: 12, y: -2, zoom: 1 });
  assert.deepEqual(getArt(card, 'front'), { src: 'data:frente', x: 12, y: -2, zoom: 1 });

  // Os controles da camada (zoom, X, Y, centralizar) mexem só nela, mesmo ligadas.
  card = setArtFrame(card, 'front', { zoom: 1.5, x: 20 });
  assert.deepEqual(getArt(card, 'front'), { src: 'data:frente', x: 20, y: -2, zoom: 1.5 });
  assert.deepEqual(getArt(card, 'back'), { src: 'data:fundo', x: 12, y: -2, zoom: 1 });
  card = resetArt(card, 'front');
  assert.deepEqual(getArt(card, 'front'), { src: 'data:frente', x: 0, y: 0, zoom: 1 });
  assert.equal(getArt(card, 'back').x, 12);

  // Soltas: arrastar mexe só a camada escolhida.
  card = moveArt({ ...card, artLinked: false }, 'front', 5, 0);
  assert.equal(getArt(card, 'front').x, 5);
  assert.equal(getArt(card, 'back').x, 12);

  // Sem arte da frente, ela vem vazia.
  assert.equal(getArt(newCustomCard('ninja', NOW), 'front').src, null);
});

test('atributos: o kanji vem da imagem do atributo (um ou dois, "?" = unknown)', async () => {
  assert.deepEqual(attributeKanjiUrls('Oil'), ['/card-layouts/icons/attributes/oil.webp']);
  assert.deepEqual(attributeKanjiUrls('Genjutsu / Tree'), [
    '/card-layouts/icons/attributes/genjutsu.webp',
    '/card-layouts/icons/attributes/tree.webp',
  ]);
  assert.deepEqual(attributeKanjiUrls('Martial Arts'), ['/card-layouts/icons/attributes/martial-arts.webp']);
  assert.deepEqual(attributeKanjiUrls('?'), ['/card-layouts/icons/attributes/unknown.webp']);
  assert.equal(attributeKanjiUrls('Banana'), null);
  assert.equal(attributeKanjiUrls(''), null);

  // Importação traz todos os atributos.
  const twoAttrs = [...CARDS_BY_ID.values()].find((c) => c.type === 'ninja' && c.attributes.length > 1);
  assert.ok(twoAttrs && twoAttrs.type === 'ninja');
  assert.equal(fromCatalogCard(twoAttrs, NOW).attribute.label, twoAttrs.attributes.join('/'));

  // Trios do S25: três atributos.
  const trio = fromCatalogCard(catalog('s25-n-1486'), NOW);
  assert.equal(trio.attribute.label, 'Mind/Shadow/Food');
  assert.equal(attributeKanjiUrls(trio.attribute.label)?.length, 3);
  // O nome impresso de cada arquivo leva de volta ao mesmo arquivo.
  for (const [file, name] of Object.entries(ATTRIBUTE_NAMES)) assert.equal(attributeSlug(name), file);

  // Todo atributo do catálogo tem kanji, e a lista bate com os arquivos gerados.
  for (const card of CARDS_BY_ID.values()) {
    if (card.type !== 'ninja') continue;
    for (const a of card.attributes) assert.ok(ATTRIBUTE_KANJI.has(attributeSlug(a)), `${card.id}: ${a}`);
  }
  const { readdirSync } = await import('node:fs');
  const files = readdirSync('public/card-layouts/icons/attributes').map((f) => f.replace(/\.webp$/, ''));
  assert.deepEqual(new Set(files), new Set(ATTRIBUTE_KANJI));
});

test('ícones alternativos: elemento 03 (menos o Vazio) e Ninja alternativo', () => {
  assert.deepEqual(elementVariants('fire'), ['01', '02', '03']);
  assert.deepEqual(elementVariants('void'), ['01']);
  assert.match(elementIcon(L2, { element: 'wind', variant: '03' }, 0).url, /element-wind-03\.webp$/);
  // Variante que não existe para o elemento: cai na 01.
  assert.match(elementIcon(L2, { element: 'void', variant: '03' }, 0).url, /element-void-01\.webp$/);
  assert.deepEqual(typeIconVariants('ninja').map((v) => v.id), ['alter']);
  assert.deepEqual(typeIconVariants('jutsu'), []);
  assert.match(typeIcon(L1, 'ninja', 'alter').url, /type-ninja-alter\.webp$/);
  assert.match(typeIcon(L1, 'ninja').url, /type-ninja\.webp$/);
  assert.match(typeIcon(L1, 'jutsu', 'alter').url, /type-jutsu\.webp$/);
  // Toda configuração de ícone aponta para uma imagem gerada.
  for (const v of ['01', '02', '03'] as const) {
    for (const el of ['earth', 'fire', 'lightning', 'water', 'wind'] as const) {
      assert.ok(existsSync(`public${elementIcon(L1, { element: el, variant: v }, 0).url}`), `${el}-${v}`);
    }
  }
  assert.ok(existsSync(`public${typeIcon(L1, 'ninja', 'alter').url}`));
});
