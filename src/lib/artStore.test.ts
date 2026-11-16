import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ArtError, parseArtDataUrl } from './artStore.ts';
import { ART_MAX_BYTES, isBlobArt } from './cardMaker/sharedCard.ts';

const png1x1 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

test('artes: só data URL de imagem, dentro do peso', () => {
  const ok = parseArtDataUrl(png1x1);
  assert.equal(ok.type, 'image/png');
  assert.equal(ok.ext, 'png');
  assert.ok(ok.bytes.length > 0);
  assert.equal(parseArtDataUrl('data:image/jpeg;base64,AAAA').ext, 'jpg');

  const rejects = (data: unknown) => assert.throws(() => parseArtDataUrl(data), (e) => e instanceof ArtError && e.status === 400);
  rejects('data:image/svg+xml;base64,AAAA'); // SVG pode ter script
  rejects('data:text/html;base64,AAAA');
  rejects('https://exemplo.com/a.png');
  rejects(42);
  rejects(`data:image/webp;base64,${'A'.repeat(Math.ceil((ART_MAX_BYTES + 10) / 3) * 4)}`);
});

test('artes: endereço aceito nas cartas é só a pasta das artes no Blob', () => {
  assert.ok(isBlobArt(`https://abc123.public.blob.vercel-storage.com/naruto-ccg/art/${'f'.repeat(64)}.webp`));
  assert.ok(!isBlobArt(`https://abc123.public.blob.vercel-storage.com/pokedex/${'f'.repeat(64)}.webp`));
  assert.ok(!isBlobArt(`https://exemplo.com/naruto-ccg/art/${'f'.repeat(64)}.webp`));
  assert.ok(!isBlobArt('data:image/webp;base64,AAAA'));
  assert.ok(!isBlobArt(null));
});
