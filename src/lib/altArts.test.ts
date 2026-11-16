import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../data/cards.ts';
import { isReinforcementCard } from '../models/card.ts';
import { hasFixedArt, parseAltArtPlacement, parseDeckArts, withFixedArt } from './altArts.ts';
import { parseSharedDeck, type SharedDeck } from './deckShare.ts';
import { applyAction, createRoom, joinRoom, parseRoomDeck, roomArts, toView, type Room } from './rooms/model.ts';

const NOW = '2026-11-16T12:00:00.000Z';
const ART = 'https://abc123.public.blob.vercel-storage.com/naruto-ccg/art/' + 'c'.repeat(64) + '.webp';
const lookup = (id: string) => CARDS_BY_ID.get(id);
const isKnown = (id: string) => CARDS_BY_ID.has(id);

function deck(name: string, offset: number): SharedDeck {
  const cards: Record<string, number> = {};
  for (const c of CARDS.slice(offset)) {
    if (isReinforcementCard(c) || Object.keys(cards).length >= 50) continue;
    cards[c.id] = 1;
  }
  return { name, cards };
}

test('artes alternativas: só imagens do Vercel Blob e enquadramento válido', () => {
  assert.deepEqual(parseAltArtPlacement({ src: ART, x: 10, y: -5, zoom: 1.5, extra: 1 }), { src: ART, x: 10, y: -5, zoom: 1.5 });
  assert.equal(parseAltArtPlacement({ src: 'https://evil.example/a.webp', x: 0, y: 0, zoom: 1 }), null);
  assert.equal(parseAltArtPlacement({ src: 'data:image/webp;base64,AAAA', x: 0, y: 0, zoom: 1 }), null);
  assert.equal(parseAltArtPlacement({ src: ART, x: 0, y: 0, zoom: 0 }), null);
  assert.equal(parseAltArtPlacement({ src: ART, x: Number.NaN, y: 0, zoom: 1 }), null);
});

test('artes alternativas do deck: só as cartas do catálogo que o deck usa', () => {
  const cards = { 's01-n-001': 1, 'custom-abc': 1 };
  const art = { src: ART, x: 0, y: 0, zoom: 1 };
  assert.deepEqual(parseDeckArts({ 's01-n-001': art, 's01-n-002': art, 'custom-abc': art }, cards), { 's01-n-001': art });
  assert.equal(parseDeckArts({ 's01-n-001': { ...art, src: 'x' } }, cards), null);
  assert.deepEqual(parseDeckArts(undefined, cards), {});
});

test('artes alternativas: o deck compartilhado leva as artes e as valida', () => {
  const d = deck('Konoha', 0);
  const first = Object.keys(d.cards)[0];
  const parsed = parseSharedDeck({ ...d, arts: { [first]: { src: ART, x: 1, y: 2, zoom: 1 } } }, isKnown);
  assert.deepEqual(parsed?.arts, { [first]: { src: ART, x: 1, y: 2, zoom: 1 } });
  assert.equal(parseSharedDeck({ ...d, arts: { [first]: { src: 'http://x', x: 0, y: 0, zoom: 1 } } }, isKnown), null);
  assert.ok(!('arts' in (parseSharedDeck(d, isKnown) ?? {})));
});

test('artes alternativas na sala: cada jogador leva as suas e a partida avisa quais existem', () => {
  const hostDeck = deck('Konoha', 0);
  const guestDeck = deck('Suna', 600);
  const hostCard = Object.keys(hostDeck.cards)[0];
  hostDeck.arts = { [hostCard]: { src: ART, x: 0, y: 0, zoom: 1 } };
  let room: Room = joinRoom(
    createRoom('r1', { playerId: 'p1', tokenHash: 'h1', nickname: 'A' }, NOW),
    { playerId: 'p2', tokenHash: 'h2', nickname: 'B' },
    NOW,
  );
  room = applyAction(room, 'host', { type: 'changeDeck', deck: parseRoomDeck(hostDeck, lookup) }, NOW)!;
  room = applyAction(room, 'guest', { type: 'changeDeck', deck: parseRoomDeck(guestDeck, lookup) }, NOW)!;
  room = applyAction(room, 'host', { type: 'setReady', ready: true }, NOW)!;
  room = applyAction(room, 'guest', { type: 'setReady', ready: true }, NOW)!;
  assert.deepEqual(roomArts(room), { host: hostDeck.arts, guest: {} });
  assert.deepEqual(toView(room, 'guest', {}, Date.parse(NOW), lookup).artKeys, [`host:${hostCard}`]);
});

test('artes alternativas: a carta com a arte fixada ignora a escolha do navegador', () => {
  const card = CARDS_BY_ID.get('s01-n-001')!;
  assert.equal(hasFixedArt(card), false);
  assert.equal(hasFixedArt(withFixedArt(card, null)), true);
});
