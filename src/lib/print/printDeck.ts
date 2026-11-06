import { CARDS_BY_ID } from '@/data/cards';
import { sortCost } from '@/lib/cardFilters';
import { deckPartOf, type DeckCards } from '@/lib/deckRules';
import { cardImageUrl, type Card, type CardType } from '@/models/card';
import { buildCardSheetPdf, type JpegImage } from './cardSheetPdf';

const TYPE_ORDER: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

/** Cartas do deck na ordem de impressão: Deck por tipo e custo, depois o Baralho de Reforço. */
export function printOrder(cards: DeckCards): { card: Card; qty: number }[] {
  return Object.entries(cards)
    .map(([id, qty]) => ({ card: CARDS_BY_ID.get(id), qty }))
    .filter((e): e is { card: Card; qty: number } => !!e.card && e.qty > 0)
    .sort((a, b) => {
      const part = Number(deckPartOf(a.card) === 'reinforcement') - Number(deckPartOf(b.card) === 'reinforcement');
      return (
        part ||
        TYPE_ORDER.indexOf(a.card.type) - TYPE_ORDER.indexOf(b.card.type) ||
        sortCost(a.card) - sortCost(b.card) ||
        a.card.name.localeCompare(b.card.name)
      );
    });
}

/** Carrega a imagem da carta (WebP) e a converte para JPEG, formato que o PDF embute direto. */
async function loadAsJpeg(url: string): Promise<JpegImage> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível');
  ctx.fillStyle = '#fff'; // JPEG não tem transparência
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
  if (!blob) throw new Error('Falha ao converter a imagem');
  return { width: canvas.width, height: canvas.height, data: new Uint8Array(await blob.arrayBuffer()) };
}

function fileName(deckName: string): string {
  const base = deckName.trim().replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '').replace(/\s+/g, ' ').slice(0, 80);
  return `${base || 'deck'}.pdf`;
}

/** Gera o PDF de impressão do deck (folhas A4, 3 × 3 cartas em tamanho real) e baixa o arquivo. */
export async function downloadDeckPdf(deckName: string, cards: DeckCards): Promise<void> {
  const entries = printOrder(cards);
  if (entries.length === 0) throw new Error('O deck está vazio');

  const images = await Promise.all(entries.map((e) => loadAsJpeg(cardImageUrl(e.card, 'full'))));
  const slots = entries.flatMap((e, i) => Array<number>(e.qty).fill(i));
  const pdf = buildCardSheetPdf(images, slots, deckName.trim() || 'Deck');

  const url = URL.createObjectURL(new Blob([pdf as BlobPart], { type: 'application/pdf' }));
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName(deckName);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}
