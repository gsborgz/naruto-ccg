import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { isReinforcementCard } from '../../models/card.ts';
import { customDeckCardId } from '../cardMaker/customIds.ts';
import { newCustomCard, type CustomCard } from '../cardMaker/model.ts';
import { parseSharedCustomCard } from '../cardMaker/sharedCard.ts';
import { parseSharePayload, type SharedDeck } from '../deckShare.ts';
import {
  applyAction,
  createRoom,
  joinRoom,
  parseRoomDeck,
  RoomError,
  toView,
  type Joiner,
  type Room,
  type RoomAction,
  type SeatName,
} from './model.ts';

const lookup = (id: string) => CARDS_BY_ID.get(id);
const NOW = '2026-11-16T12:00:00.000Z';
/** Arte no Vercel Blob (o endereço que o servidor devolve ao guardar a imagem). */
const blobArt = (c: string) => `https://abc123.public.blob.vercel-storage.com/naruto-ccg/art/${c.repeat(64)}.webp`;
const ART_A = blobArt('a');
const ART_B = blobArt('b');

function custom(id: string, changes: Partial<CustomCard> = {}): CustomCard {
  return { ...newCustomCard('ninja', NOW), id, name: `Ninja ${id}`, healthy: '3/1', injured: '1/0', ...changes };
}

/** Deck válido: 47 cartas do catálogo + 3 cartas criadas (uma com arte enviada pelo jogador). */
function deckWithCustom(name: string, prefix: string, offset = 0, art = ART_A): SharedDeck {
  const cards: Record<string, number> = {};
  let n = 0;
  for (const c of CARDS.slice(offset)) {
    if (isReinforcementCard(c) || n >= 47) continue;
    cards[c.id] = 1;
    n++;
  }
  const customs = [
    custom(`${prefix}-1`, { art: { src: art, x: 0, y: 0, zoom: 1 } }),
    custom(`${prefix}-2`),
    custom(`${prefix}-3`, { characteristics: ['Squad'] }), // vai para o Baralho de Reforço
    custom(`${prefix}-4`),
  ];
  const map: Record<string, CustomCard> = {};
  for (const c of customs) {
    map[customDeckCardId(c.id)] = c;
    cards[customDeckCardId(c.id)] = 1;
  }
  return { name, cards, custom: map };
}

const host: Joiner = { playerId: 'p-host', tokenHash: 'h-host', nickname: 'Naruto' };
const guest: Joiner = { playerId: 'p-guest', tokenHash: 'h-guest', nickname: 'Sasuke' };

function act(room: Room, who: SeatName, action: RoomAction): Room {
  const next = applyAction(room, who, action, NOW);
  assert.ok(next);
  return next;
}

/** Valida como o servidor (JSON de ida e volta) e escolhe o deck. */
function choose(room: Room, who: SeatName, deck: SharedDeck): Room {
  return act(room, who, { type: 'changeDeck', deck: parseRoomDeck(JSON.parse(JSON.stringify(deck)), lookup) });
}

function startedRoom(): Room {
  let room = joinRoom(createRoom('r1', host, NOW), guest, NOW);
  room = choose(room, 'host', deckWithCustom('Konoha', 'h'));
  room = choose(room, 'guest', deckWithCustom('Uchiha', 'g', 60, ART_B));
  room = act(room, 'host', { type: 'setReady', ready: true });
  return act(room, 'guest', { type: 'setReady', ready: true });
}

test('cartas criadas na sala: o deck leva as cartas e é validado com elas', () => {
  const deck = parseRoomDeck(JSON.parse(JSON.stringify(deckWithCustom('Konoha', 'h'))), lookup);
  assert.equal(Object.keys(deck.custom ?? {}).length, 4);

  // Carta criada no deck sem a definição: desconhecida.
  const { custom: _c, ...withoutDefs } = deckWithCustom('Konoha', 'h');
  assert.throws(() => parseRoomDeck(withoutDefs, lookup), RoomError);

  // Definição inválida (id de layout fora do formato, arte de endereço externo, chave que não bate com o id).
  const bad = (change: (d: SharedDeck) => void) => {
    const d = JSON.parse(JSON.stringify(deckWithCustom('Konoha', 'h'))) as SharedDeck;
    change(d);
    assert.throws(() => parseRoomDeck(d, lookup), RoomError);
  };
  bad((d) => ((d.custom![customDeckCardId('h-2')] as unknown as Record<string, unknown>).layout = 'Layout 99!'));
  bad((d) => (d.custom![customDeckCardId('h-2')].art.src = 'https://exemplo.com/a.png'));
  // Arte ainda não enviada (data URL) ou de outro endereço da Vercel: recusada.
  bad((d) => (d.custom![customDeckCardId('h-2')].art.src = 'data:image/png;base64,AAAA'));
  bad((d) => (d.custom![customDeckCardId('h-2')].art.src = 'https://abc.public.blob.vercel-storage.com/outra-pasta/x.webp'));
  bad((d) => (d.custom![customDeckCardId('h-2')].id = 'outro'));
  // 4 cópias de uma carta criada: fora das regras.
  bad((d) => (d.cards[customDeckCardId('h-2')] = 4));

  // Definições que o deck não usa são descartadas.
  const extra = JSON.parse(JSON.stringify(deckWithCustom('Konoha', 'h'))) as SharedDeck;
  extra.custom![customDeckCardId('x')] = custom('x');
  assert.ok(!(customDeckCardId('x') in (parseRoomDeck(extra, lookup).custom ?? {})));
});

test('cartas criadas na sala: campos desconhecidos e a referência do catálogo não passam', () => {
  const parsed = parseSharedCustomCard({ ...custom('z'), reference: '/cards/s01/s01-n-001.webp', hack: '<script>' });
  assert.ok(parsed);
  assert.ok(!('hack' in parsed));
  assert.ok(!('reference' in parsed));
  // Arte do próprio site continua aceita.
  assert.ok(parseSharedCustomCard({ ...custom('z'), art: { src: '/card-layouts/arts/s01/s01-n-001/back.webp', x: 0, y: 0, zoom: 1 } }));
  assert.equal(parseSharedCustomCard({ ...custom('z'), art: { src: '/cards/../segredo', x: 0, y: 0, zoom: 1 } }), null);
  // A carta de origem (artes alternativas) passa, se for um id de carta.
  assert.equal(parseSharedCustomCard({ ...custom('z'), source: 'fx-n-001' })?.source, 'fx-n-001');
  assert.equal(parseSharedCustomCard({ ...custom('z'), source: '../x' }), null);
  // Posições ajustadas só na carta: caminhos de campo e números.
  assert.deepEqual(parseSharedCustomCard({ ...custom('z'), layoutOverrides: { 'name.ninja.cy': 80 } })?.layoutOverrides, { 'name.ninja.cy': 80 });
  assert.equal(parseSharedCustomCard({ ...custom('z'), layoutOverrides: { __proto__x: 1 } }), null);
  assert.equal(parseSharedCustomCard({ ...custom('z'), layoutOverrides: { 'name.ninja.cy': 'a' } }), null);
});

test('cartas criadas na sala: entram na partida com as regras de cada uma', () => {
  const room = startedRoom();
  const host = room.game!.players.host;
  const all = [...host.deck, ...host.hand];
  // As 3 cartas criadas do Deck estão no Deck/mão; o Esquadrão criado está no Reforço.
  assert.equal(all.filter((c) => c.cardId.startsWith('custom-')).length, 3);
  assert.deepEqual(host.reinforcement.map((c) => c.cardId), [customDeckCardId('h-3')]);

  const view = toView(room, 'host', {}, Date.parse(NOW), lookup);
  assert.equal(view.players[0].deckSize, 50);
  assert.equal(view.players[0].reinforcementSize, 1);
  assert.deepEqual(view.customCardIds?.length, 8);
});

test('cartas criadas na sala: a mesma carta nos dois decks só se for a mesma versão', () => {
  let room = joinRoom(createRoom('r1', host, NOW), guest, NOW);
  const hostDeck = deckWithCustom('Konoha', 'h');
  room = choose(room, 'host', hostDeck);
  // O convidado importou as cartas do anfitrião (mesmo id, mesmo conteúdo): pode.
  const copy = deckWithCustom('Copia', 'h', 60);
  copy.custom = JSON.parse(JSON.stringify(hostDeck.custom));
  assert.equal(choose(room, 'guest', copy).guest?.deck?.name, 'Copia');
  // Editou a carta depois de importar: versões diferentes, recusado.
  copy.custom![customDeckCardId('h-2')].name = 'Outro nome';
  assert.throws(() => choose(room, 'guest', copy), (e) => e instanceof RoomError && e.status === 409);
});

test('compartilhamento por código leva as cartas criadas', () => {
  const deck = JSON.parse(JSON.stringify(deckWithCustom('Konoha', 'h'))) as SharedDeck;
  const known = (id: string) => CARDS_BY_ID.has(id);
  const share = parseSharePayload({ kind: 'deck', deck }, known);
  assert.ok(share && share.kind === 'deck');
  assert.equal(Object.keys(share.deck.custom ?? {}).length, 4);
  assert.equal(share.deck.custom![customDeckCardId('h-1')].art.src, ART_A);
  // Sem as definições, as cartas criadas são desconhecidas.
  assert.equal(parseSharePayload({ kind: 'deck', deck: { name: 'x', cards: deck.cards } }, known), null);
  // Coleção: cada deck com as suas.
  const collection = parseSharePayload({ kind: 'collection', decks: [deck, deckWithCustom('Uchiha', 'g', 60, ART_B)] }, known);
  assert.ok(collection && collection.kind === 'collection');
  assert.deepEqual(collection.decks.map((d) => Object.keys(d.custom ?? {}).length), [4, 4]);
});

test('carta criada: ícone customizado só com imagem do Blob e tamanho na faixa', () => {
  assert.deepEqual(parseSharedCustomCard(custom('z', { customIcon: { src: ART_A, size: 120 } }))?.customIcon, { src: ART_A, size: 120 });
  assert.equal(parseSharedCustomCard(custom("z"))?.customIcon, undefined);
  assert.equal(parseSharedCustomCard(custom('z', { customIcon: { src: 'data:image/webp;base64,AAAA', size: 120 } })), null);
  assert.equal(parseSharedCustomCard(custom('z', { customIcon: { src: 'https://exemplo.com/a.png', size: 120 } })), null);
  assert.equal(parseSharedCustomCard(custom('z', { customIcon: { src: ART_A, size: 9999 } })), null);
});
