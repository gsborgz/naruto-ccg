import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { CARDS_BY_ID } from '../../data/cards.ts';
import { cardImageUrl, type Card } from '../../models/card.ts';
import { cardArtUrl } from '../../models/cardLayout.ts';
import { CARD_TRANSLATIONS_PTBR } from '../../data/ptbr/index.ts';
import { localizeCard } from '../cardLocale.ts';
import {
  ATTRIBUTE_KANJI,
  ATTRIBUTE_NAMES,
  attributeKanjiUrls,
  attributeSlug,
  COMBAT_ATTRIBUTE_ICONS,
  COST_ICONS,
  ELEMENT_ICONS,
  TYPE_ICON_VARIANTS,
  elementIcon,
  elementVariants,
  typeIcon,
  typeIconVariants,
  getLayout,
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
  withLocalizedText,
  wrapName,
  setArtFrame,
  resetArt,
  type LayoutId,
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
  const card = fromCatalogCard(catalog('s10-n-352'), NOW);
  assert.equal(card.type, 'ninja');
  assert.equal(card.name, 'Jiraiya');
  assert.equal(card.entranceCost, '5');
  assert.equal(card.handCost, '2');
  assert.equal(card.healthy, '7/2');
  assert.equal(card.injured, '5/2');
  assert.deepEqual(card.villages, [{ village: 'leaf', rogue: false }]);
  // "Rogue Ninja" não risca o símbolo da vila; só "Akatsuki" risca.
  const rogueNinja = catalog('s01-n-017');
  assert.ok(rogueNinja.type === 'ninja' && rogueNinja.characteristics.includes('Rogue Ninja'));
  assert.deepEqual(fromCatalogCard(rogueNinja, NOW).villages, [{ village: 'mist', rogue: false }]);
  const akatsuki: Card = { ...rogueNinja, characteristics: [...rogueNinja.characteristics, 'Akatsuki'] };
  assert.deepEqual(fromCatalogCard(akatsuki, NOW).villages, [{ village: 'mist', rogue: true }]);
  assert.deepEqual(fromCatalogCard(catalog('s03-n-132'), NOW).villages?.map((v) => v.village), ['waterfall']);
  // Mais de uma vila nas características.
  assert.deepEqual(fromCatalogCard(catalog('s08-n-264'), NOW).villages?.map((v) => v.village), ['leaf', 'sand']);
  assert.deepEqual(card.elements, [{ element: 'lightning', variant: '01' }]);
  assert.equal(card.attribute.label, 'Oil');
  assert.equal(card.reference, '/cards/s10/s10-n-352.webp');
});

test('cartas escaneadas: importam com o layout e as artes extraídas', () => {
  // Sem arte extraída: a carta impressa faz o fundo, no enquadramento do scan.
  const source = catalog('s01-n-001');
  const { print: _print, clean: _clean, ...placed } = source.layout!.art.back!;
  const printed = fromCatalogCard({ ...source, layout: { ...source.layout!, art: { back: { ...placed, print: true } } } }, NOW);
  assert.equal(printed.layout, 'layout-01');
  assert.deepEqual(printed.art, { src: '/cards/s01/s01-n-001.webp', ...placed });
  assert.equal(printed.artFront, undefined);
  // Impressa sem os ícones de elemento (`clean`): mesmo enquadramento, outra imagem.
  const naruto = fromCatalogCard({ ...source, layout: { ...source.layout!, art: { back: { ...placed, print: true, clean: true } } } }, NOW);
  assert.deepEqual(naruto.art, { src: '/card-layouts/arts/s01/s01-n-001/print-clean.webp', ...placed });
  // Com artes extraídas: cada camada vem de card-layouts/arts/<set>/<id>/.
  const extracted: Card = {
    ...source,
    layout: { ...source.layout!, art: { back: { x: 1, y: 2, zoom: 0.9 }, front: { x: 3, y: 4, zoom: 1.1 } } },
  };
  const withArts = fromCatalogCard(extracted, NOW);
  assert.deepEqual(withArts.art, { src: '/card-layouts/arts/s01/s01-n-001/back.webp', x: 1, y: 2, zoom: 0.9 });
  assert.deepEqual(withArts.artFront, { src: '/card-layouts/arts/s01/s01-n-001/front.webp', x: 3, y: 4, zoom: 1.1 });
  // Outro layout pedido: vale o pedido, as artes continuam.
  const other = fromCatalogCard(extracted, NOW, 'layout-02');
  assert.equal(other.layout, 'layout-02');
  assert.equal(other.artFront?.src, '/card-layouts/arts/s01/s01-n-001/front.webp');
  // Carta não escaneada: layout 1, sem arte.
  const unscanned = [...CARDS_BY_ID.values()].find((c) => !c.layout)!;
  assert.equal(fromCatalogCard(unscanned, NOW).art.src, null);
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
  // Carta escaneada: a escolha do layout dela (a do nome traduzido em PT-BR, como o tamanho).
  const source = catalog('s01-n-001');
  const card: Card = { ...source, layout: { ...source.layout!, nameWrap: 'single', nameWrapPtBr: 'break' } };
  assert.equal(fromCatalogCard(card, NOW).nameWrap, 'single');
  assert.equal(fromCatalogCard(card, NOW, 'layout-02').nameWrap, undefined);
  const pt = withLocalizedText(fromCatalogCard(card, NOW), { name: 'Outro nome', text: [], flavor: undefined, characteristics: [] }, card);
  assert.equal(pt.nameWrap, 'break');
});

test('nome: a fonte é a do layout mais o ajuste da carta (padrão 0)', () => {
  assert.equal(newCustomCard('ninja', NOW).nameSize, 0);
  assert.equal(nameFontSize(50, 0), 50);
  assert.equal(nameFontSize(50, undefined), 50);
  assert.equal(nameFontSize(50, -6.5), 43.5);
  assert.equal(nameFontSize(50, 4), 54);
  assert.equal(nameFontSize(50, -100), 4); // nunca some
  // Catálogo: o ajuste da carta escaneada vale no layout dela; em outro layout, volta a 0.
  const source = catalog('s01-n-001');
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
  const source = catalog('s01-n-001');
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

test('cartas escaneadas: layout conhecido e artes geradas em public/', () => {
  const scanned = [...CARDS_BY_ID.values()].filter((c) => c.layout);
  assert.ok(scanned.length >= 2);
  for (const card of scanned) {
    const info = card.layout!;
    assert.equal(getLayout(info.layout).id, info.layout, `${card.id}: layout ${info.layout}`);
    assert.ok(getLayout(info.layout).types.includes(card.type), `${card.id}: o layout não tem o tipo ${card.type}`);
    if (info.panelVariant) {
      assert.ok(getLayout(info.layout).panelVariants?.some((v) => v.id === info.panelVariant), `${card.id}: design ${info.panelVariant}`);
    }
    // Ícones: um por elemento, custos só fora do Jutsu, Atributo só no Ninja, e todos com arquivo.
    const { icons } = info;
    assert.equal(icons.elements.length, card.elements.length, `${card.id}: variantes dos elementos`);
    card.elements.forEach((el, i) => assert.ok(ELEMENT_ICONS[`${el}-${icons.elements[i]}`], `${card.id}: ${el}-${icons.elements[i]}`));
    assert.ok(
      icons.type === 'default' || TYPE_ICON_VARIANTS[card.type]?.some((v) => v.id === icons.type),
      `${card.id}: ícone do tipo ${icons.type}`,
    );
    assert.equal(icons.entrance !== undefined && icons.hand !== undefined, card.type !== 'jutsu', `${card.id}: ícones de custo`);
    if (icons.entrance) assert.ok(COST_ICONS[icons.entrance] && COST_ICONS[icons.hand!], `${card.id}: ícones de custo`);
    assert.equal(icons.attribute !== undefined, card.type === 'ninja', `${card.id}: moldura do Atributo`);
    if (icons.attribute) assert.ok(COMBAT_ATTRIBUTE_ICONS[icons.attribute], `${card.id}: moldura ${icons.attribute}`);
    assert.ok(info.art.back || info.art.front, `${card.id}: sem arte`);
    for (const layer of ['back', 'front'] as const) {
      const art = info.art[layer];
      if (!art) continue;
      assert.ok(art.zoom > 0, `${card.id}: zoom da arte ${layer}`);
      const file = art.print
        ? `public${art.clean ? cardArtUrl(card.id, 'print-clean') : cardImageUrl(card, 'full')}`
        : `public/card-layouts/arts/${card.id.split('-')[0]}/${card.id}/${layer}.webp`;
      assert.ok(existsSync(file), `${card.id}: falta a arte ${layer} (npm run cards:layouts)`);
    }
  }
});

test('criador: importa Jutsu e Missão do catálogo', () => {
  const jutsu = fromCatalogCard(catalog('s10-j-us078'), NOW);
  assert.deepEqual(jutsu.jutsuCost, { symbols: ['water'], generic: '1' });

  const mission = fromCatalogCard(catalog('s10-m-us087'), NOW);
  assert.equal(mission.text, '[Permanent \\(3\\)]\n[Effect:] Your Ninjas with a "Byakugan" cannot be affected by the effects of your opponent\'s Jutsu cards.');
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

test('layouts: importar aplica os ícones do layout; trocar de layout mantém os ícones escolhidos', () => {
  const fukasaku = fromCatalogCard(catalog('s29-n-5006'), NOW, 'layout-02');
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

  // Custo alternativo ("or") vem do catálogo: "土 | 1 or 3".
  const mudFall = fromCatalogCard(catalog('s29-j-5000'), NOW, 'layout-02');
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

test('importar em PT-BR: nome, textos, frase e características traduzidos; vilas e atributo em inglês', () => {
  const source = catalog('s01-n-017');
  const card = withLocalizedText(fromCatalogCard(source, NOW), localizeCard(source, 'pt-BR', CARD_TRANSLATIONS_PTBR));
  assert.equal(card.flavor, CARD_TRANSLATIONS_PTBR['s01-n-017'].flavor);
  assert.notDeepEqual(card.characteristics, source.type === 'ninja' ? source.characteristics : []);
  assert.deepEqual(card.villages, fromCatalogCard(source, NOW).villages);
  assert.equal(card.attribute.label, fromCatalogCard(source, NOW).attribute.label);
});

test('frase: com a impressa de fundo, guarda a frase impressa (sombreado); outra arte de fundo tira', () => {
  const source = catalog('s01-n-017');
  const card = fromCatalogCard(source, NOW);
  assert.equal(card.printedFlavor, source.flavor ?? '');
  // Em PT-BR a frase montada muda, a impressa continua a em inglês.
  const pt = withLocalizedText(card, localizeCard(source, 'pt-BR', CARD_TRANSLATIONS_PTBR), source);
  assert.equal(pt.flavor, CARD_TRANSLATIONS_PTBR['s01-n-017'].flavor);
  assert.equal(pt.printedFlavor, source.flavor);
  assert.equal(setArtImage(card, 'back', 'data:image/png;base64,').printedFlavor, undefined);
  assert.equal(setArtImage(card, 'front', 'data:image/png;base64,').printedFlavor, source.flavor);
  // Carta não escaneada e carta nova: sem frase impressa.
  assert.equal(fromCatalogCard([...CARDS_BY_ID.values()].find((c) => !c.layout)!, NOW).printedFlavor, undefined);
  assert.equal(newCustomCard('ninja', NOW).printedFlavor, undefined);
});

test('importar em PT-BR: nome traduzido usa o ajuste nameSizePtBr; nome igual ao inglês usa nameSize', () => {
  const pt = (c: Card, layout?: LayoutId) =>
    withLocalizedText(fromCatalogCard(c, NOW, layout), localizeCard(c, 'pt-BR', CARD_TRANSLATIONS_PTBR), c);
  // Jutsu com nome traduzido.
  const jutsu = [...CARDS_BY_ID.values()].find(
    (c) => c.layout && CARD_TRANSLATIONS_PTBR[c.id]?.name && CARD_TRANSLATIONS_PTBR[c.id].name !== c.name,
  )!;
  const adjusted: Card = { ...jutsu, layout: { ...jutsu.layout!, nameSize: 2, nameSizePtBr: -5 } };
  assert.equal(pt(adjusted).nameSize, -5);
  assert.equal(fromCatalogCard(adjusted, NOW).nameSize, 2);
  assert.equal(pt({ ...jutsu, layout: { ...jutsu.layout!, nameSizePtBr: undefined } }).nameSize, 0);
  assert.equal(pt(adjusted, 'layout-02').nameSize, 0); // outro layout: o ajuste não vale
  // Personagem: o nome não muda em PT-BR, vale o ajuste do nome em inglês.
  const naruto = catalog('s01-n-001');
  const character: Card = { ...naruto, layout: { ...naruto.layout!, nameSize: 3, nameSizePtBr: -5 } };
  assert.equal(pt(character).nameSize, 3);
});
