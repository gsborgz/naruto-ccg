import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeEntry } from '../cloud/sharedCatalog.ts';
import { PALETTES, parseTheme, THEME_RANGES, themePageBackground, themeVars } from './types.ts';

const ID = '0f8fad5b-d9cb-469f-a165-70867728950e';
const ART = `https://abc123.public.blob.vercel-storage.com/naruto-ccg/art/${'a'.repeat(64)}.webp`;

test('tema: valida o formato, limita os ajustes e só aceita imagem do Blob', () => {
  const t = parseTheme({ id: ID.toUpperCase(), name: '  Folhas  ', palette: 'jade', wallpaper: ART, tile: true, dim: 5, arenaDim: 0, blur: 7.6 });
  assert.ok(t);
  assert.equal(t.id, ID);
  assert.equal(t.name, 'Folhas');
  assert.equal(t.dim, THEME_RANGES.dim.max);
  assert.equal(t.arenaDim, THEME_RANGES.arenaDim.min);
  assert.equal(t.blur, 8);
  assert.equal(t.tile, true);
  // Sem os ajustes: os padrões do design.
  const plain = parseTheme({ id: ID, name: '', palette: 'neve' });
  assert.equal(plain?.name, 'Tema sem nome');
  assert.equal(plain?.wallpaper, null);
  assert.equal(plain?.dim, THEME_RANGES.dim.default);
  assert.equal(parseTheme({ id: ID, name: 'x', palette: 'madeira' }), null, 'paleta desconhecida');
  assert.equal(parseTheme({ id: 'x', name: 'x', palette: 'jade' }), null, 'id inválido');
  assert.equal(parseTheme({ id: ID, name: 'x', palette: 'jade', wallpaper: 'https://exemplo.com/a.png' }), null, 'imagem fora do Blob');
  assert.equal(parseTheme({ id: ID, name: 'x', palette: 'jade', wallpaper: 'data:image/webp;base64,AAAA' }), null, 'imagem não enviada');
});

test('tema: as variáveis trocam só a escala de acento e o fundo; sem tema, os padrões', () => {
  const t = parseTheme({ id: ID, name: 'x', palette: 'carmesim', wallpaper: ART, dim: 0.4, arenaDim: 0.6, blur: 10 })!;
  const vars = themeVars(t);
  const ramp = PALETTES.carmesim.ramp;
  assert.equal(vars['--color-accent-100'], ramp[0]);
  assert.equal(vars['--color-accent-900'], ramp[8]);
  assert.equal(vars['--color-accent'], ramp[4]);
  assert.equal(vars['--color-section-glow'], `${ramp[4]}47`);
  assert.equal(vars['--arena-dim'], '0.6');
  assert.equal(vars['--arena-blur'], '10px');
  assert.ok(!Object.keys(vars).some((k) => k.startsWith('--color-neutral')), 'os neutros são fixos');
  assert.match(vars['--page-bg'], /cover no-repeat/);
  assert.match(vars['--page-bg'], /rgba\(8,9,14,0\.4\)/);
  assert.match(themePageBackground({ ...t, tile: true }), /auto repeat/);
  const none = themeVars(null);
  assert.equal(none['--color-accent'], PALETTES.lilas.ramp[4]);
  assert.doesNotMatch(none['--page-bg'], /url\(/);
});

test('tema: os gravados antes do catálogo compartilhado ({ theme, owner, author }) continuam aparecendo', () => {
  const theme = { id: ID, name: 'Antigo', createdAt: '2026-11-20' };
  assert.deepEqual(normalizeEntry({ theme, owner: 'o', author: 'a' }, 'theme'), { item: theme, owner: 'o', author: 'a' });
  assert.deepEqual(normalizeEntry({ item: theme, owner: 'o', author: '' }, 'theme')?.item, theme);
  assert.equal(normalizeEntry({ theme, owner: 'o' }), null, 'sem o campo antigo, não é entrada');
  assert.equal(normalizeEntry('lixo', 'theme'), null);
});
