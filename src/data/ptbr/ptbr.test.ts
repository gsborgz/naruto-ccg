import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../cards.ts';
import { CARD_TRANSLATIONS_PTBR, TRANSLATED_SETS } from './index.ts';
import { CHARACTERISTICS_PTBR, RARITY_PTBR, translateCharacteristic } from './glossary.ts';
import { localizeCard } from '../../lib/cardLocale.ts';
import { filterCards, INITIAL_FILTERS } from '../../lib/cardFilters.ts';

/** Rótulos impressos no início das linhas e a forma PT-BR (docs/TRADUCAO.md, REGRAS.md 6.4). */
const LINE_PREFIXES: [string, string][] = [
  ['Valid:', 'Válido:'],
  ['Requirements:', 'Requerimentos:'],
  ['Requirement:', 'Requerimento:'],
  ['Target:', 'Alvo:'],
  ['Effect:', 'Efeito:'],
];
const WHOLE_LINES: Record<string, string> = { Counter: 'Anulação', Permanent: 'Permanente' };

test('toda tradução aponta para uma carta existente', () => {
  const unknown = Object.keys(CARD_TRANSLATIONS_PTBR).filter((id) => !CARDS_BY_ID.has(id));
  assert.deepEqual(unknown, []);
});

test('coleções traduzidas não têm cartas faltando', () => {
  const missing = CARDS.filter(
    (c) => TRANSLATED_SETS.includes(c.set) && (c.text.length > 0 || c.flavor) && !CARD_TRANSLATIONS_PTBR[c.id],
  ).map((c) => c.id);
  assert.deepEqual(missing, []);
});

test('tradução tem as mesmas linhas, rótulos e frase do original', () => {
  const problems: string[] = [];
  for (const [id, tr] of Object.entries(CARD_TRANSLATIONS_PTBR)) {
    const card = CARDS_BY_ID.get(id);
    if (!card) continue;
    const text = tr.text ?? [];
    if (text.length !== card.text.length) {
      problems.push(`${id}: ${text.length} linhas, original tem ${card.text.length}`);
      continue;
    }
    card.text.forEach((en, i) => {
      const pt = text[i];
      if (!pt.trim()) problems.push(`${id} linha ${i + 1}: vazia`);
      const isTitle = (s: string) => s.startsWith('[') && s.endsWith(']');
      if (isTitle(en) !== isTitle(pt)) problems.push(`${id} linha ${i + 1}: título [..] não corresponde`);
      for (const [enPrefix, ptPrefix] of LINE_PREFIXES) {
        if (en.startsWith(enPrefix) && !pt.startsWith(ptPrefix)) {
          problems.push(`${id} linha ${i + 1}: deveria começar com "${ptPrefix}"`);
        }
      }
      if (WHOLE_LINES[en] && pt !== WHOLE_LINES[en]) problems.push(`${id} linha ${i + 1}: deveria ser "${WHOLE_LINES[en]}"`);
    });
    if (!!card.flavor !== !!tr.flavor) problems.push(`${id}: frase ${card.flavor ? 'faltando' : 'sem original'}`);
  }
  assert.deepEqual(problems, []);
});

test('glossário cobre todas as características e raridades', () => {
  const missing = new Set<string>();
  for (const c of CARDS) {
    if (c.rarity && !RARITY_PTBR[c.rarity]) missing.add(`raridade ${c.rarity}`);
    if (!('characteristics' in c)) continue;
    for (const ch of c.characteristics) {
      if (ch.startsWith('Name:') || ch.startsWith('Mental Power:')) continue;
      if (!CHARACTERISTICS_PTBR[ch]) missing.add(ch);
    }
  }
  assert.deepEqual([...missing], []);
});

test('Name: X mantém o nome da carta em inglês; Mental Power vira Poder Mental', () => {
  assert.equal(translateCharacteristic('Name: The Fourth Hokage'), 'Nome: The Fourth Hokage');
  assert.equal(translateCharacteristic('Mental Power: -1'), 'Poder Mental: -1');
  assert.equal(translateCharacteristic('Leaf'), 'Folha');
  assert.equal(translateCharacteristic('Algo novo'), 'Algo novo');
});

test('localizeCard usa o inglês como reserva', () => {
  const card = CARDS_BY_ID.get('s01-n-004')!;
  assert.deepEqual(localizeCard(card, 'en', CARD_TRANSLATIONS_PTBR).text, card.text);

  const pt = localizeCard(card, 'pt-BR', CARD_TRANSLATIONS_PTBR);
  assert.equal(pt.translated, true);
  assert.equal(pt.text[0], '[Rival no Amor]');
  assert.deepEqual(pt.characteristics, ['Folha', 'Genin', 'Feminino']);
  assert.equal(pt.rarity, 'Comum');

  // Ainda carregando (translations = null) ou sem tradução: textos em inglês.
  const loading = localizeCard(card, 'pt-BR', null);
  assert.equal(loading.translated, false);
  assert.deepEqual(loading.text, card.text);
});

test('busca acha pelo texto em PT-BR só com as traduções ativas', () => {
  const filters = { ...INITIAL_FILTERS, query: 'rival no amor' };
  assert.deepEqual(filterCards(CARDS, filters).map((c) => c.id), []);
  assert.deepEqual(filterCards(CARDS, filters, CARD_TRANSLATIONS_PTBR).map((c) => c.id), ['s01-n-004']);
  // O inglês continua valendo com PT-BR ativo.
  const en = filterCards(CARDS, { ...INITIAL_FILTERS, query: "love's rival" }, CARD_TRANSLATIONS_PTBR);
  assert.ok(en.some((c) => c.id === 's01-n-004'));
});
