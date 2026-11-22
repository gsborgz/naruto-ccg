import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { type Card, type JutsuCard, type MissionCard, type NinjaCard } from '../../models/card.ts';
import { fixtureNinja } from '../content/testFixture.ts';
import {
  ATTRIBUTE_KANJI,
  ATTRIBUTE_NAMES,
  attributeKanjiUrls,
  attributeSlug,
  elementIcon,
  elementVariants,
  typeIcon,
  typeIconVariants,
  getLayout,
  cardLayout,
  TEXT_DIVIDER_DEFAULT,
  textDividerColor,
} from './layouts/index.ts';

const L1 = getLayout('layout-01');
const L2 = getLayout('layout-02');
import {
  catalogTextToMarkup,
  fromCatalogCard,
  getArt,
  migrateCustomCard,
  moveArt,
  nameFontSize,
  newCustomCard,
  cardVillages,
  withVillages,
  parseCardText,
  parseTextBlock,
  setArtImage,
  withLayout,
  withLayoutIcons,
  switchLayout,
  wrapName,
  setArtFrame,
  resetArt,
  type LayoutId,
} from './model.ts';

const NOW = '2026-01-01T00:00:00.000Z';
/** Cartas inventadas (src/lib/content/testFixture.ts): os testes conferem a conversão, não os dados impressos. */
const scannedNinja = (extra: Partial<NinjaCard> = {}): NinjaCard => fixtureNinja(1, extra);
const unscannedNinja = (extra: Partial<NinjaCard> = {}): NinjaCard => fixtureNinja(2, extra);
const jutsuCard = (cost: JutsuCard['cost']): JutsuCard => ({
  id: 'fx-j-900',
  name: 'Estilo Terra: Muralha de Lama',
  type: 'jutsu',
  elements: ['earth'],
  number: '900',
  set: 'S01',
  text: [],
  image: 'fx-j-900',
  cost,
});
const missionCard: MissionCard = {
  id: 'fx-m-900',
  name: 'Missão',
  type: 'mission',
  elements: ['water'],
  number: '900',
  set: 'S01',
  text: ['Permanente (3)', 'Efeito: seus Ninjas com "Byakugan" não são afetados pelos Jutsus do oponente.'],
  image: 'fx-m-900',
  entranceCost: 1,
  handCost: 0,
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
  // Texto traduzido (PT-BR): rótulos e durações com acento.
  assert.equal(catalogTextToMarkup('Válido: compre 1 carta.'), '[Válido:] compre 1 carta.');
  assert.equal(catalogTextToMarkup('Anulação Permanente (2)'), '[Anulação Permanente \\(2\\)]');
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
  const source = unscannedNinja({ entranceCost: 5, handCost: 2, healthy: { combat: 7, support: 2 }, injured: { combat: 5, support: 2 }, attributes: ['Óleo'] });
  const card = fromCatalogCard(source, NOW);
  assert.equal(card.type, 'ninja');
  assert.equal(card.name, source.name);
  assert.equal(card.entranceCost, '5');
  assert.equal(card.handCost, '2');
  assert.equal(card.healthy, '7/2');
  assert.equal(card.injured, '5/2');
  // Vila pela característica, em PT-BR (o conteúdo do jogo) ou como impressa.
  assert.deepEqual(card.villages, [{ village: 'leaf', rogue: false }]);
  assert.deepEqual(fromCatalogCard(unscannedNinja({ characteristics: ['Leaf'] }), NOW).villages, [{ village: 'leaf', rogue: false }]);
  // "Ninja Renegado" não risca o símbolo da vila; só "Akatsuki" risca.
  assert.deepEqual(fromCatalogCard(unscannedNinja({ characteristics: ['Névoa', 'Ninja Renegado'] }), NOW).villages, [{ village: 'mist', rogue: false }]);
  assert.deepEqual(fromCatalogCard(unscannedNinja({ characteristics: ['Névoa', 'Akatsuki'] }), NOW).villages, [{ village: 'mist', rogue: true }]);
  // Mais de uma vila nas características.
  assert.deepEqual(fromCatalogCard(unscannedNinja({ characteristics: ['Folha', 'Areia'] }), NOW).villages?.map((v) => v.village), ['leaf', 'sand']);
  assert.deepEqual(card.elements, [{ element: 'lightning', variant: '01' }]);
  assert.equal(card.attribute.label, 'Óleo');
  assert.equal(card.reference, `/cards/s01/${source.id}.webp`);
});

test('cartas escaneadas: importam com o layout e as artes extraídas', () => {
  // Sem arte extraída: a carta impressa faz o fundo, no enquadramento do scan.
  const source = scannedNinja();
  const id = source.id;
  const { print: _print, clean: _clean, ...placed } = source.layout!.art.back!;
  const printed = fromCatalogCard({ ...source, layout: { ...source.layout!, art: { back: { ...placed, print: true } } } }, NOW);
  assert.equal(printed.layout, 'layout-01');
  assert.deepEqual(printed.art, { src: `/cards/s01/${id}.webp`, ...placed });
  assert.equal(printed.artFront, undefined);
  // Impressa sem os ícones de elemento (`clean`): mesmo enquadramento, outra imagem.
  const naruto = fromCatalogCard({ ...source, layout: { ...source.layout!, art: { back: { ...placed, print: true, clean: true } } } }, NOW);
  assert.deepEqual(naruto.art, { src: `/card-layouts/arts/fx/${id}/print-clean.webp`, ...placed });
  // Com artes extraídas: cada camada vem de card-layouts/arts/<set>/<id>/.
  const extracted: Card = {
    ...source,
    layout: { ...source.layout!, art: { back: { x: 1, y: 2, zoom: 0.9 }, front: { x: 3, y: 4, zoom: 1.1 } } },
  };
  const withArts = fromCatalogCard(extracted, NOW);
  assert.deepEqual(withArts.art, { src: `/card-layouts/arts/fx/${id}/back.webp`, x: 1, y: 2, zoom: 0.9 });
  assert.deepEqual(withArts.artFront, { src: `/card-layouts/arts/fx/${id}/front.webp`, x: 3, y: 4, zoom: 1.1 });
  // Outro layout pedido: vale o pedido, as artes continuam.
  const other = fromCatalogCard(extracted, NOW, 'layout-02');
  assert.equal(other.layout, 'layout-02');
  assert.equal(other.artFront?.src, `/card-layouts/arts/fx/${id}/front.webp`);
  // Arte enviada pela aba Editar (Vercel Blob): no lugar da impressa.
  const blob = 'https://abc.public.blob.vercel-storage.com/naruto-ccg/art/' + 'a'.repeat(64) + '.webp';
  const uploaded = fromCatalogCard({ ...source, layout: { ...source.layout!, art: { back: { x: 0, y: 0, zoom: 1, src: blob } } } }, NOW);
  assert.equal(uploaded.art.src, blob);
  assert.equal(uploaded.printedFlavor, undefined);
  // Carta não escaneada: layout 1, sem arte.
  assert.equal(fromCatalogCard(unscannedNinja(), NOW).art.src, null);
});

test('nome: quebra de linha automática, uma linha só ou duas linhas', () => {
  assert.equal(wrapName('Hinata Hyuga (Quimono)', undefined), 'Hinata Hyuga (Quimono)');
  assert.equal(wrapName('Hinata Hyuga (Quimono)', 'auto'), 'Hinata Hyuga (Quimono)');
  // Duas linhas: antes do parêntese final; sem parêntese, no espaço mais perto do meio; uma palavra só, como está.
  assert.equal(wrapName('Hinata Hyuga (Quimono)', 'break'), 'Hinata Hyuga\n(Quimono)');
  assert.equal(wrapName('Earth Style: Mud Fall', 'break'), 'Earth Style:\nMud Fall');
  assert.equal(wrapName('Rasengan', 'break'), 'Rasengan');
  // A quebra digitada vale em "duas linhas" e some em "uma linha só".
  assert.equal(wrapName('Hinata\nHyuga (Quimono)', 'break'), 'Hinata\nHyuga (Quimono)');
  assert.equal(wrapName('Hinata Hyuga\n(Quimono)', 'single'), 'Hinata Hyuga (Quimono)');
  // Carta escaneada: a escolha do layout dela; em outro layout, não vale.
  const source = scannedNinja();
  const card: Card = { ...source, layout: { ...source.layout!, nameWrap: 'single' } };
  assert.equal(fromCatalogCard(card, NOW).nameWrap, 'single');
  assert.equal(fromCatalogCard(card, NOW, 'layout-02').nameWrap, undefined);
});

test('nome: a fonte é a do layout mais o ajuste da carta (padrão 0)', () => {
  assert.equal(newCustomCard('ninja', NOW).nameSize, 0);
  assert.equal(nameFontSize(50, 0), 50);
  assert.equal(nameFontSize(50, undefined), 50);
  assert.equal(nameFontSize(50, -6.5), 43.5);
  assert.equal(nameFontSize(50, 4), 54);
  assert.equal(nameFontSize(50, -100), 4); // nunca some
  // Catálogo: o ajuste da carta escaneada vale no layout dela; em outro layout, volta a 0.
  const source = scannedNinja();
  assert.equal(fromCatalogCard(source, NOW).nameSize, 0);
  const adjusted: Card = { ...source, layout: { ...source.layout!, nameSize: -3 } };
  assert.equal(fromCatalogCard(adjusted, NOW).nameSize, -3);
  assert.equal(fromCatalogCard(adjusted, NOW, 'layout-02').nameSize, 0);
  // Cartas antigas com `nameScale` (fração): viram o ajuste equivalente em pixels.
  const legacy = { ...newCustomCard('ninja', NOW), nameSize: undefined, nameScale: 0.9 };
  const migrated = migrateCustomCard(legacy);
  assert.equal(migrated.nameSize, L1.name.ninja.size * -0.1);
  assert.equal('nameScale' in migrated, false);
});

test('cartas escaneadas: os ícones vêm da carta, não do layout (coleções misturam ícones)', () => {
  const source = scannedNinja();
  // Layout 1 com ícones de outros layouts.
  const mixed = {
    ...source,
    layout: {
      ...source.layout!,
      icons: { type: 'alter', elements: ['03' as const], entrance: 'entrance-03' as const, hand: 'hand-02' as const, attribute: '07' as const },
    },
  };
  const card = fromCatalogCard(mixed, NOW);
  assert.equal(card.layout, 'layout-01');
  assert.equal(card.typeVariant, 'alter');
  assert.deepEqual(card.elements, [{ element: 'lightning', variant: '03' }]);
  assert.equal(card.entranceIcon, 'entrance-03');
  assert.equal(card.handIcon, 'hand-02');
  assert.equal(card.attribute.frame, '07');
  // Pedindo outro layout: os ícones padrão dele.
  const other = fromCatalogCard(mixed, NOW, 'layout-02');
  assert.equal(other.typeVariant, undefined);
  assert.equal(other.attribute.frame, L2.attribute.defaultFrame);
  assert.equal(other.entranceIcon, L2.defaults.entranceIcon);
});

test('criador: importa Jutsu e Missão do catálogo', () => {
  const jutsu = fromCatalogCard(jutsuCard({ symbols: ['water'], generic: 1 }), NOW);
  assert.deepEqual(jutsu.jutsuCost, { symbols: ['water'], generic: '1' });

  const mission = fromCatalogCard(missionCard, NOW);
  assert.equal(mission.text, '[Permanente \\(3\\)]\n[Efeito:] seus Ninjas com "Byakugan" não são afetados pelos Jutsus do oponente.');
  assert.equal(mission.characteristics.length, 0);
  assert.deepEqual(mission.villages, []);
});

test('criador: cartas antigas com uma vila só são lidas no formato novo', () => {
  assert.deepEqual(cardVillages({ village: 'mist', villageRogue: true }), [{ village: 'mist', rogue: true }]);
  assert.deepEqual(cardVillages({ village: null }), []);
  const card = withVillages({ ...newCustomCard('ninja', NOW), village: 'leaf' }, [{ village: 'sand', rogue: false }]);
  assert.equal(card.village, undefined);
  assert.deepEqual(cardVillages(card), [{ village: 'sand', rogue: false }]);
});

test('layouts: importar aplica os ícones do layout; withLayout mantém os ícones escolhidos; switchLayout usa os do layout', () => {
  const fukasaku = fromCatalogCard(unscannedNinja({ elements: ['wind', 'fire'] }), NOW, 'layout-02');
  const l2 = (c: typeof fukasaku) => ({
    elements: c.elements.map((e) => e.variant),
    entrance: c.entranceIcon,
    hand: c.handIcon,
    attribute: c.attribute.frame,
  });
  const defaults = (spec: typeof L1) => ({
    elements: fukasaku.elements.map((e) => (elementVariants(e.element).includes(spec.elements.variant) ? spec.elements.variant : '01')),
    entrance: spec.defaults.entranceIcon,
    hand: spec.defaults.handIcon,
    attribute: spec.attribute.defaultFrame,
  });
  assert.equal(fukasaku.layout, 'layout-02');
  assert.deepEqual(l2(fukasaku), defaults(L2));

  // De volta ao layout 1: os ícones do layout 2 continuam (estilos misturados).
  const back = withLayout(fukasaku, 'layout-01');
  assert.deepEqual(l2(back), defaults(L2));

  // Ícones padrão do layout 1 (carta nova / importada).
  assert.deepEqual(l2(withLayoutIcons(back)), defaults(L1));

  // Trocar de layout no criador (switchLayout) carrega os ícones padrão do layout escolhido; o mesmo layout não muda nada.
  assert.deepEqual(l2(switchLayout(fukasaku, 'layout-01')), defaults(L1));
  const chosen = { ...fukasaku, entranceIcon: L1.defaults.entranceIcon };
  assert.equal(switchLayout(chosen, 'layout-02').entranceIcon, L1.defaults.entranceIcon);

  // Custo alternativo ("or") vem do catálogo: "土 | 1 or 3".
  const mudFall = fromCatalogCard(jutsuCard({ symbols: ['earth'], generic: 1, alternatives: [{ symbols: [], generic: 3 }] }), NOW, 'layout-02');
  assert.deepEqual(mudFall.jutsuCost, { symbols: ['earth'], generic: '1', alternatives: [{ symbols: [], generic: '3' }] });
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

  // O conteúdo do jogo guarda o atributo em PT-BR: o kanji é achado pelo nome traduzido também.
  assert.deepEqual(attributeKanjiUrls('Arma'), ['/card-layouts/icons/attributes/weapon.webp']);
  assert.deepEqual(attributeKanjiUrls('Artes Marciais/Árvore'), [
    '/card-layouts/icons/attributes/martial-arts.webp',
    '/card-layouts/icons/attributes/tree.webp',
  ]);

  // Importação traz todos os atributos (até 3).
  const trio = fromCatalogCard(unscannedNinja({ attributes: ['Mente', 'Sombra', 'Comida'] }), NOW);
  assert.equal(trio.attribute.label, 'Mente/Sombra/Comida');
  assert.equal(attributeKanjiUrls(trio.attribute.label)?.length, 3);
  // O nome impresso de cada arquivo leva de volta ao mesmo arquivo.
  for (const [file, name] of Object.entries(ATTRIBUTE_NAMES)) assert.equal(attributeSlug(name), file);
  assert.ok(ATTRIBUTE_KANJI.size > 0);

  // A lista bate com os arquivos gerados.
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

test('frase: com a impressa de fundo, guarda a frase impressa (sombreado); outra arte de fundo tira', () => {
  const source = scannedNinja();
  const card = fromCatalogCard(source, NOW);
  assert.equal(card.printedFlavor, source.flavor ?? '');
  assert.equal(setArtImage(card, 'back', 'data:image/png;base64,').printedFlavor, undefined);
  assert.equal(setArtImage(card, 'front', 'data:image/png;base64,').printedFlavor, source.flavor);
  // Carta não escaneada e carta nova: sem frase impressa.
  assert.equal(fromCatalogCard(unscannedNinja(), NOW).printedFlavor, undefined);
  assert.equal(newCustomCard('ninja', NOW).printedFlavor, undefined);
});


test('posições ajustadas só na carta: mudam o layout dela, não o layout carregado', () => {
  const card = { ...newCustomCard('ninja', NOW), layout: 'layout-01' as const };
  const cy = L1.name.ninja.cy;
  const x = L1.cost.ninja.entrance.x;
  const adjusted = { ...card, layoutOverrides: { 'name.ninja.cy': cy + 12, 'cost.ninja.entrance.x': x - 3, 'nada.aqui': 5, 'name.ninja.color': 1 } };
  const spec = cardLayout(adjusted);
  assert.equal(spec.name.ninja.cy, cy + 12);
  assert.equal(spec.cost.ninja.entrance.x, x - 3);
  // Campos que não existem ou não são números ficam de fora.
  assert.equal(spec.name.ninja.color, L1.name.ninja.color);
  assert.ok(!('nada' in spec));
  // O layout carregado (o de todas as cartas) não muda.
  assert.equal(getLayout('layout-01').name.ninja.cy, cy);
  assert.equal(getLayout('layout-01').cost.ninja.entrance.x, x);
  assert.equal(cardLayout(card).name, L1.name);
  // Layout sem a linha acima do texto: a padrão; o ajuste da carta vale nela.
  assert.deepEqual(cardLayout(card).textDivider, L1.textDivider ?? TEXT_DIVIDER_DEFAULT);
  assert.equal(cardLayout({ ...card, layoutOverrides: { 'textDivider.gap': 30 } }).textDivider?.gap, 30);
  // Trocar de layout apaga os ajustes; continuar no mesmo layout mantém.
  assert.equal(withLayout(adjusted, 'layout-02').layoutOverrides, undefined);
  assert.deepEqual(withLayout(adjusted, 'layout-01').layoutOverrides, adjusted.layoutOverrides);
});

test('cor da linha acima do texto: uma por tipo de carta no layout', () => {
  const spec = { ...L1, textDividerColor: { ninja: '#123456' } };
  assert.equal(textDividerColor(spec, 'ninja'), '#123456');
  assert.equal(textDividerColor(spec, 'jutsu'), undefined);
  assert.equal(textDividerColor(spec, 'mission'), undefined);
  // Valor antigo (uma cor só, de antes de ser por tipo): ignorado.
  assert.equal(textDividerColor({ ...L1, textDividerColor: '#ff0000' as never }, 'ninja'), undefined);
});

test('ícones no texto: ~1~ vira o Chakra genérico e ~fire~ o símbolo do elemento', () => {
  const runs = parseTextBlock('Pague ~2~ e ~fogo~ ou [~X~ e ~Water~]. ~nada~ fica.');
  const icons = runs.filter((r) => r.icon).map((r) => r.icon);
  assert.deepEqual(icons, [
    { kind: 'chakra', value: '2' },
    { kind: 'element', element: 'fire' },
    { kind: 'chakra', value: 'X' },
    { kind: 'element', element: 'water' },
  ]);
  // O ícone fica com o estilo do trecho (negrito dentro de [ ]) e com o que foi digitado.
  assert.equal(runs.find((r) => r.icon?.kind === 'chakra' && r.icon.value === 'X')?.bold, true);
  assert.equal(runs.find((r) => r.icon?.kind === 'chakra')?.text, '~2~');
  // O que não é valor nem elemento sai como foi digitado.
  assert.ok(runs.some((r) => !r.icon && r.text.includes('~nada~ fica.')));
});
