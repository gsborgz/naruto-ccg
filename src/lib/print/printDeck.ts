import { sortCost } from '../cardFilters.ts';
import { isCustomCardId } from '../cardMaker/customIds.ts';
import { deckPartOf, type CardLookup, type DeckCards } from '../deckRules.ts';
import { cardImageUrl, type Card, type CardType } from '../../models/card.ts';
import { buildCardSheetPdf, type JpegImage } from './cardSheetPdf.ts';

const TYPE_ORDER: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

/**
 * Design das cartas no PDF, um só para o deck inteiro: `original` = a imagem impressa; `rendered` = a carta
 * montada (layout + ícones + textos), nas cartas já escaneadas (as outras saem com a impressa).
 * As cartas do criador não têm impressa: saem sempre montadas.
 */
export type PrintDesign = 'original' | 'rendered';

export interface PrintOptions {
  design: PrintDesign;
  /** Procura as cartas do deck (catálogo + cartas criadas). */
  lookup: CardLookup;
  /** Desenha a carta montada em PNG (null: não dá para montar). Necessário para `rendered` e cartas criadas. */
  renderCard?: (card: Card) => Promise<Blob | null>;
  /** Avisado a cada carta pronta. */
  onProgress?: (done: number, total: number) => void;
}

/** A carta sai montada no PDF (e não com a imagem impressa). */
export function printsRendered(card: Card, design: PrintDesign): boolean {
  return isCustomCardId(card.id) || (design === 'rendered' && card.layout !== undefined);
}

/** Cartas do deck na ordem de impressão: Deck por tipo e custo, depois o Baralho de Reforço. */
export function printOrder(cards: DeckCards, lookup: CardLookup): { card: Card; qty: number }[] {
  return Object.entries(cards)
    .map(([id, qty]) => ({ card: lookup(id), qty }))
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

/** Carrega a imagem da carta (WebP ou PNG) e a converte para JPEG, formato que o PDF embute direto. */
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
export async function downloadDeckPdf(deckName: string, cards: DeckCards, options: PrintOptions): Promise<void> {
  const { design, lookup, renderCard, onProgress } = options;
  const entries = printOrder(cards, lookup);
  if (entries.length === 0) throw new Error('O deck está vazio');

  let done = 0;
  const tick = () => onProgress?.(++done, entries.length);
  // Impressas em paralelo; montadas uma de cada vez (cada uma é desenhada na página, fora da tela).
  const printed = entries.map((e) =>
    printsRendered(e.card, design) ? null : loadAsJpeg(cardImageUrl(e.card, 'full')).finally(tick),
  );
  // Se uma montada falhar antes, as impressas que ficaram sem `await` não viram rejeição sem tratamento.
  for (const p of printed) p?.catch(() => {});
  const images: JpegImage[] = [];
  for (const [i, e] of entries.entries()) {
    const pending = printed[i];
    if (pending) {
      images.push(await pending);
      continue;
    }
    const png = await renderCard?.(e.card);
    if (!png) throw new Error(`Não foi possível montar a carta "${e.card.name}".`);
    const url = URL.createObjectURL(png);
    try {
      images.push(await loadAsJpeg(url));
    } finally {
      URL.revokeObjectURL(url);
    }
    tick();
  }
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
