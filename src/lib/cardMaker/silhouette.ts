/**
 * Silhueta de um ícone (a parte opaca da imagem), para o texto de efeito contorná-la em vez de passar por cima
 * (ex.: o Atributo de Combate que invade a caixa de texto). Calculada no navegador a partir da transparência da
 * imagem, uma vez por imagem, e guardada em memória.
 *
 * O perfil divide a altura da imagem em faixas e guarda, em cada uma, onde começa (`left`) e onde termina (`right`) a
 * parte opaca, em frações da largura. Faixa sem nada opaco: `left = 1` e `right = 0`.
 */

export interface Silhouette {
  left: number[];
  right: number[];
}

/** Faixas na altura da imagem. */
const BANDS = 64;
/** Largura em que a imagem é lida (basta para o contorno; a altura segue a proporção). */
const SAMPLE_W = 160;
/** Opacidade mínima (0–255) para o pixel contar como parte do ícone (a sombra fraca em volta não conta). */
const ALPHA_MIN = 48;

const cache = new Map<string, Silhouette | null>();
const pending = new Map<string, Promise<Silhouette | null>>();

/** A silhueta já calculada (`undefined`: ainda não; `null`: não deu para ler a imagem). */
export function getSilhouette(url: string): Silhouette | null | undefined {
  return cache.get(url);
}

/** Calcula a silhueta da imagem (uma vez por URL). */
export function loadSilhouette(url: string): Promise<Silhouette | null> {
  if (cache.has(url)) return Promise.resolve(cache.get(url)!);
  let job = pending.get(url);
  if (!job) {
    job = read(url)
      .catch(() => null)
      .then((s) => {
        cache.set(url, s);
        pending.delete(url);
        return s;
      });
    pending.set(url, job);
  }
  return job;
}

async function read(url: string): Promise<Silhouette | null> {
  if (typeof document === 'undefined') return null;
  // Baixada como blob: o canvas não fica "sujo" (imagem de outro domínio) e dá para ler os pixels.
  const res = await fetch(url);
  if (!res.ok) return null;
  const bitmap = await createImageBitmap(await res.blob());
  const w = SAMPLE_W;
  const h = Math.max(BANDS, Math.round((bitmap.height / bitmap.width) * w));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const data = ctx.getImageData(0, 0, w, h).data;
  const left = new Array<number>(BANDS).fill(1);
  const right = new Array<number>(BANDS).fill(0);
  for (let y = 0; y < h; y++) {
    const band = Math.min(BANDS - 1, Math.floor((y / h) * BANDS));
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < ALPHA_MIN) continue;
      const f = x / w;
      if (f < left[band]) left[band] = f;
      if ((x + 1) / w > right[band]) right[band] = (x + 1) / w;
    }
  }
  return { left, right };
}

export interface WrapFloat {
  side: 'left' | 'right';
  /** Espaço acima do contorno, dentro da caixa de texto. */
  top: number;
  width: number;
  height: number;
  /** `shape-outside` (polígono em px, relativo ao bloco). */
  shape: string;
  margin: number;
}

/**
 * O bloco flutuante que faz o texto contornar o ícone dentro da caixa de texto (unidades da carta). O ícone à direita
 * do centro da caixa empurra o texto para a esquerda (o perfil `left` da silhueta), e o contrário à esquerda.
 * `null` quando o ícone não invade a caixa.
 */
export function wrapFloat(
  silhouette: Silhouette,
  icon: { x: number; y: number; w: number; h: number },
  box: { x: number; top: number; w: number; bottom: number },
  margin: number,
): WrapFloat | null {
  const boxRight = box.x + box.w;
  const top = Math.max(box.top, icon.y);
  const bottom = Math.min(box.bottom, icon.y + icon.h);
  if (bottom <= top || icon.x >= boxRight || icon.x + icon.w <= box.x) return null;
  const side = icon.x + icon.w / 2 >= box.x + box.w / 2 ? 'right' : 'left';
  // O bloco vai da borda do ícone até a borda da caixa do mesmo lado.
  const fx0 = side === 'right' ? Math.max(box.x, icon.x) : box.x;
  const fx1 = side === 'right' ? boxRight : Math.min(boxRight, icon.x + icon.w);
  const width = fx1 - fx0;
  const height = bottom - top;
  if (width <= 0) return null;
  const edge = side === 'right' ? width : 0;
  const clamp = (v: number) => Math.min(width, Math.max(0, v));
  const points: [number, number][] = [[edge, 0]];
  const bandH = icon.h / silhouette.left.length;
  for (let i = 0; i < silhouette.left.length; i++) {
    const y0 = icon.y + i * bandH - top;
    const y1 = y0 + bandH;
    if (y1 <= 0 || y0 >= height) continue;
    const empty = silhouette.left[i] >= silhouette.right[i];
    const x = empty
      ? edge
      : clamp(side === 'right' ? icon.x + silhouette.left[i] * icon.w - fx0 : icon.x + silhouette.right[i] * icon.w - fx0);
    points.push([x, Math.max(0, y0)], [x, Math.min(height, y1)]);
  }
  points.push([edge, height]);
  const r = (n: number) => Math.round(n * 10) / 10;
  return {
    side,
    top: top - box.top,
    width,
    height,
    shape: `polygon(${points.map(([x, y]) => `${r(x)}px ${r(y)}px`).join(', ')})`,
    margin,
  };
}
