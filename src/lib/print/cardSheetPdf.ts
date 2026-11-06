/**
 * Gera um PDF de folhas A4 com cartas lado a lado, prontas para imprimir e recortar.
 *
 * Escritor de PDF mínimo e sem dependências: cada imagem é um JPEG embutido como XObject
 * (filtro DCTDecode, o leitor decodifica o próprio JPEG) e reaproveitado por todas as cópias
 * da carta, então 3 cópias custam o mesmo que 1. Funciona igual no navegador e no Node (testes).
 */

/** Tamanho padrão de carta colecionável (63 × 88 mm) e folha A4 em retrato. */
export const SHEET_LAYOUT = {
  pageWidthMm: 210,
  pageHeightMm: 297,
  cardWidthMm: 63,
  cardHeightMm: 88,
  cols: 3,
  rows: 3,
  /** Espaço em branco entre cartas vizinhas: folga para errar o corte sem pegar a carta do lado. */
  gapMm: 3,
  /** Comprimento das marcas de corte, desenhadas só na margem (fora das cartas). */
  cutMarkMm: 5,
} as const;

export const CARDS_PER_PAGE = SHEET_LAYOUT.cols * SHEET_LAYOUT.rows;

export interface JpegImage {
  width: number;
  height: number;
  /** Bytes de um arquivo JPEG (baseline ou progressivo). */
  data: Uint8Array;
}

const PT_PER_MM = 72 / 25.4;
const pt = (mm: number) => +(mm * PT_PER_MM).toFixed(3);

/** Texto de PDF em UTF-16BE (hex com BOM), para nomes com acento ou símbolos. */
function pdfTextString(s: string): string {
  let hex = 'FEFF';
  for (let i = 0; i < s.length; i++) hex += s.charCodeAt(i).toString(16).padStart(4, '0');
  return `<${hex.toUpperCase()}>`;
}

/** Conteúdo de uma página: as cartas e as marcas de corte em volta da grade. */
function pageContent(slots: number[]): string {
  const L = SHEET_LAYOUT;
  const w = pt(L.cardWidthMm);
  const h = pt(L.cardHeightMm);
  const pitchX = L.cardWidthMm + L.gapMm;
  const pitchY = L.cardHeightMm + L.gapMm;
  const gridW = pitchX * L.cols - L.gapMm;
  const gridH = pitchY * L.rows - L.gapMm;
  const left = (L.pageWidthMm - gridW) / 2;
  const top = (L.pageHeightMm - gridH) / 2; // distância do topo da folha
  const fromTop = (mm: number) => pt(L.pageHeightMm - mm); // a origem do PDF é o canto inferior esquerdo
  const ops: string[] = [];

  slots.forEach((img, i) => {
    const x = pt(left + (i % L.cols) * pitchX);
    const y = fromTop(top + Math.floor(i / L.cols) * pitchY + L.cardHeightMm);
    ops.push(`q ${w} 0 0 ${h} ${x} ${y} cm /Im${img} Do Q`);
  });

  // Marcas de corte: prolongam as bordas de cada carta para dentro da margem, sem cobrir as cartas.
  const usedRows = Math.ceil(slots.length / L.cols);
  const usedCols = Math.min(slots.length, L.cols);
  const m = L.cutMarkMm;
  const off = 1; // mm de folga entre a grade e o início da marca
  const gridTop = top;
  const gridBottom = top + usedRows * pitchY - L.gapMm;
  const gridLeft = left;
  const gridRight = left + usedCols * pitchX - L.gapMm;
  // Bordas verticais (esquerda e direita de cada coluna) e horizontais (topo e base de cada linha).
  const xs = Array.from({ length: usedCols }, (_, c) => [left + c * pitchX, left + c * pitchX + L.cardWidthMm]).flat();
  const ys = Array.from({ length: usedRows }, (_, r) => [top + r * pitchY, top + r * pitchY + L.cardHeightMm]).flat();
  ops.push('0.6 G 0.3 w');
  for (const xMm of xs) {
    const x = pt(xMm);
    ops.push(`${x} ${fromTop(gridTop - off)} m ${x} ${fromTop(gridTop - off - m)} l S`);
    ops.push(`${x} ${fromTop(gridBottom + off)} m ${x} ${fromTop(gridBottom + off + m)} l S`);
  }
  for (const yMm of ys) {
    const y = fromTop(yMm);
    ops.push(`${pt(gridLeft - off)} ${y} m ${pt(gridLeft - off - m)} ${y} l S`);
    ops.push(`${pt(gridRight + off)} ${y} m ${pt(gridRight + off + m)} ${y} l S`);
  }
  return ops.join('\n');
}

/**
 * Monta o PDF.
 * @param images imagens distintas (uma por carta).
 * @param slots índice em `images` de cada carta a imprimir, na ordem (repita para várias cópias).
 */
export function buildCardSheetPdf(images: JpegImage[], slots: number[], title = 'Deck'): Uint8Array {
  for (const s of slots) {
    if (!Number.isInteger(s) || s < 0 || s >= images.length) throw new RangeError(`slot inválido: ${s}`);
  }
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = []; // offsets[n] = posição do objeto n (1-based)
  let size = 0;
  const push = (b: Uint8Array | string) => {
    const bytes = typeof b === 'string' ? enc.encode(b) : b;
    chunks.push(bytes);
    size += bytes.length;
  };

  const pages: number[][] = [];
  for (let i = 0; i < slots.length; i += CARDS_PER_PAGE) pages.push(slots.slice(i, i + CARDS_PER_PAGE));
  if (pages.length === 0) pages.push([]);

  // Numeração dos objetos: 1 catálogo, 2 árvore de páginas, 3 info, imagens, depois página + conteúdo.
  const firstImage = 4;
  const firstPage = firstImage + images.length;
  const pageObj = (p: number) => firstPage + p * 2;
  const total = firstPage + pages.length * 2 - 1;

  const obj = (n: number, body: string | (() => void)) => {
    offsets[n] = size;
    push(`${n} 0 obj\n`);
    if (typeof body === 'string') push(body);
    else body();
    push('\nendobj\n');
  };

  push('%PDF-1.4\n');
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // comentário binário: marca o arquivo como binário

  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, p) => `${pageObj(p)} 0 R`).join(' ')}] >>`);
  obj(3, `<< /Title ${pdfTextString(title)} /Producer (Naruto CCG) >>`);

  images.forEach((img, i) => {
    obj(firstImage + i, () => {
      push(
        `<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} ` +
          `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.data.length} >>\nstream\n`,
      );
      push(img.data);
      push('\nendstream');
    });
  });

  const xobjects = images.map((_, i) => `/Im${i} ${firstImage + i} 0 R`).join(' ');
  const mediaBox = `[0 0 ${pt(SHEET_LAYOUT.pageWidthMm)} ${pt(SHEET_LAYOUT.pageHeightMm)}]`;
  pages.forEach((pageSlots, p) => {
    const content = enc.encode(pageContent(pageSlots));
    obj(
      pageObj(p),
      `<< /Type /Page /Parent 2 0 R /MediaBox ${mediaBox} ` +
        `/Resources << /XObject << ${xobjects} >> >> /Contents ${pageObj(p) + 1} 0 R >>`,
    );
    obj(pageObj(p) + 1, () => {
      push(`<< /Length ${content.length} >>\nstream\n`);
      push(content);
      push('\nendstream');
    });
  });

  const xref = size;
  let table = `xref\n0 ${total + 1}\n0000000000 65535 f \n`;
  for (let n = 1; n <= total; n++) table += `${String(offsets[n]).padStart(10, '0')} 00000 n \n`;
  push(table);
  push(`trailer\n<< /Size ${total + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    out.set(c, at);
    at += c.length;
  }
  return out;
}
