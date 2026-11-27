import { SLEEVE_SIZE } from './types.ts';

/**
 * Enquadramento da imagem do sleeve no cadastro: a imagem "cobre" a carta (750×1050) com `zoom` ≥ 1 por cima disso, e
 * `x`/`y` deslocam o centro dela, em px da carta. Dados puros: a prévia (CSS) e o recorte (canvas) usam a mesma conta.
 */
export interface SleeveFrame {
  x: number;
  y: number;
  zoom: number;
}

export const SLEEVE_ZOOM = { min: 1, max: 4 } as const;
export const CENTERED: SleeveFrame = { x: 0, y: 0, zoom: 1 };

/** Onde a imagem (`iw`×`ih`) fica desenhada na carta: canto e tamanho, em px de 750×1050. */
export interface SleeveRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** O enquadramento dentro do permitido: zoom entre os limites e a imagem sempre cobrindo a carta inteira. */
export function clampFrame(iw: number, ih: number, f: SleeveFrame): SleeveFrame {
  const { w, h } = SLEEVE_SIZE;
  const zoom = Math.min(SLEEVE_ZOOM.max, Math.max(SLEEVE_ZOOM.min, Number.isFinite(f.zoom) ? f.zoom : 1));
  const s = Math.max(w / iw, h / ih) * zoom;
  const maxX = (iw * s - w) / 2;
  const maxY = (ih * s - h) / 2;
  const clamp = (v: number, m: number) => Math.min(m, Math.max(-m, Number.isFinite(v) ? v : 0));
  return { x: clamp(f.x, maxX), y: clamp(f.y, maxY), zoom };
}

export function frameRect(iw: number, ih: number, frame: SleeveFrame): SleeveRect {
  const { w, h } = SLEEVE_SIZE;
  const f = clampFrame(iw, ih, frame);
  const s = Math.max(w / iw, h / ih) * f.zoom;
  const width = iw * s;
  const height = ih * s;
  return { left: (w - width) / 2 + f.x, top: (h - height) / 2 + f.y, width, height };
}

/** Muda o zoom mantendo fixo o ponto da carta em (`px`, `py`) (o do mouse, na roda; o centro, no controle). */
export function zoomFrame(iw: number, ih: number, f: SleeveFrame, zoom: number, px = SLEEVE_SIZE.w / 2, py = SLEEVE_SIZE.h / 2): SleeveFrame {
  const cur = clampFrame(iw, ih, f);
  const next = Math.min(SLEEVE_ZOOM.max, Math.max(SLEEVE_ZOOM.min, zoom));
  const k = next / cur.zoom;
  // O centro da imagem está em (w/2 + x, h/2 + y); escala em volta do ponto (px, py).
  const cx = SLEEVE_SIZE.w / 2 + cur.x;
  const cy = SLEEVE_SIZE.h / 2 + cur.y;
  return clampFrame(iw, ih, {
    x: px + (cx - px) * k - SLEEVE_SIZE.w / 2,
    y: py + (cy - py) * k - SLEEVE_SIZE.h / 2,
    zoom: next,
  });
}
