import { isBlobArt } from '../cardMaker/sharedCard.ts';

/**
 * Temas da arena cadastrados pelos jogadores (tela `/temas`): um padrão de cores (`PALETTES`) e uma imagem de fundo,
 * com os ajustes de contraste do design "Campo de Jogo" genérico. Não há temas prontos: sem tema, a arena usa o fundo
 * padrão e a paleta Lilás.
 *
 * O layout da arena é um só (vidro escuro sobre a imagem, `GameArena.module.css`); o tema muda só a escala de acento
 * (`--color-accent-100…900` e os derivados) e o fundo. Usado pelo navegador e pelo servidor (dados puros).
 */

/** Escalas de acento, do 100 (mais claro) ao 900 (mais escuro). */
export const PALETTES = {
  lilas: { name: 'Lilás', hint: 'imagens frias ou neutras', ramp: ['#f5f4ff', '#e7e5fe', '#d2cefd', '#b5abfc', '#968ae0', '#796cbf', '#5d5294', '#423a6a', '#2b2741'] },
  carmesim: { name: 'Carmesim', hint: 'madeira, terra, pôr do sol', ramp: ['#fde4e1', '#f8bdb6', '#f0918a', '#e2665f', '#c9443f', '#a63431', '#812826', '#5d1e1d', '#3f1515'] },
  ambar: { name: 'Âmbar', hint: 'areia, outono', ramp: ['#fff3dc', '#fde0a8', '#f6c873', '#e9ad48', '#cf912e', '#a87424', '#80581c', '#5b3f15', '#3c2a0f'] },
  jade: { name: 'Jade', hint: 'floresta, bambu', ramp: ['#e1f7ec', '#b6ebd0', '#87dab1', '#5ac392', '#3ea777', '#30865f', '#25664a', '#1a4936', '#113124'] },
  ciano: { name: 'Ciano', hint: 'água, céu', ramp: ['#e1f7ff', '#b8ebfd', '#89dcf8', '#5fcaf0', '#40b0db', '#308db3', '#246b88', '#1a4d62', '#113442'] },
  sakura: { name: 'Sakura', hint: 'flores', ramp: ['#fde8f1', '#f9c6dc', '#f2a0c3', '#e679a8', '#cf5a8c', '#a8466f', '#823655', '#5d273d', '#3e1a29'] },
  neve: { name: 'Neve', hint: 'combina com qualquer imagem', ramp: ['#ffffff', '#f1f1f4', '#e0e0e6', '#c9c9d2', '#adadb8', '#8e8e9a', '#6e6e7a', '#4d4d57', '#32323a'] },
} as const satisfies Record<string, { name: string; hint: string; ramp: readonly string[] }>;

export type PaletteId = keyof typeof PALETTES;
export const PALETTE_IDS = Object.keys(PALETTES) as PaletteId[];
export const DEFAULT_PALETTE: PaletteId = 'lilas';

export interface BoardTheme {
  /** UUID. */
  id: string;
  name: string;
  palette: PaletteId;
  /** Imagem de fundo no Vercel Blob (`naruto-ccg/art/`); `null` = o fundo padrão. */
  wallpaper: string | null;
  /** `false` = a imagem cobre a tela (foto); `true` = repete (textura). */
  tile: boolean;
  /** Escurece a imagem de fundo (0–0,8). */
  dim: number;
  /** Opacidade do véu do Campo de Batalha (0,2–0,9). */
  arenaDim: number;
  /** Desfoque atrás do Campo de Batalha, em px (0–16). */
  blur: number;
  createdAt: string;
  updatedAt: string;
}

/** Faixas e valores padrão dos ajustes (os do design). */
export const THEME_RANGES = {
  dim: { min: 0, max: 0.8, step: 0.05, default: 0.25 },
  arenaDim: { min: 0.2, max: 0.9, step: 0.05, default: 0.5 },
  blur: { min: 0, max: 16, step: 1, default: 4 },
} as const;

export const THEME_LIMITS = { themes: 50, nameLength: 60 } as const;

/** Tema novo (ainda não gravado). */
export function newTheme(name = 'Novo tema'): BoardTheme {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    palette: DEFAULT_PALETTE,
    wallpaper: null,
    tile: false,
    dim: THEME_RANGES.dim.default,
    arenaDim: THEME_RANGES.arenaDim.default,
    blur: THEME_RANGES.blur.default,
    createdAt: now,
    updatedAt: now,
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

function range(v: unknown, r: { min: number; max: number; default: number }): number {
  return typeof v === 'number' && Number.isFinite(v) ? Math.min(r.max, Math.max(r.min, v)) : r.default;
}

/** Confere e normaliza um tema vindo do navegador; `null` se for inválido. */
export function parseTheme(x: unknown): BoardTheme | null {
  if (!isRecord(x) || typeof x.id !== 'string' || !UUID.test(x.id) || typeof x.name !== 'string') return null;
  if (typeof x.palette !== 'string' || !(x.palette in PALETTES)) return null;
  const wallpaper = x.wallpaper ?? null;
  if (wallpaper !== null && (typeof wallpaper !== 'string' || !isBlobArt(wallpaper))) return null;
  const date = (v: unknown) => (typeof v === 'string' && v.length <= 40 ? v : new Date().toISOString());
  return {
    id: x.id.toLowerCase(),
    name: x.name.trim().slice(0, THEME_LIMITS.nameLength) || 'Tema sem nome',
    palette: x.palette as PaletteId,
    wallpaper,
    tile: x.tile === true,
    dim: range(x.dim, THEME_RANGES.dim),
    arenaDim: range(x.arenaDim, THEME_RANGES.arenaDim),
    blur: Math.round(range(x.blur, THEME_RANGES.blur)),
    createdAt: date(x.createdAt),
    updatedAt: date(x.updatedAt),
  };
}

/** Fundo padrão (sem imagem). */
const DEFAULT_WALLPAPER = 'radial-gradient(120% 90% at 45% 55%, #262a60 0%, #161826 62%)';

/** Fundo da arena inteira (fora do palco escalado): vinheta, escurecimento e a imagem. */
export function themePageBackground(theme: Pick<BoardTheme, 'wallpaper' | 'tile' | 'dim'> | null): string {
  const dim = theme?.dim ?? THEME_RANGES.dim.default;
  // O endereço já foi conferido (`isBlobArt`): só letras, números, `/`, `.` e `:`.
  const image = theme?.wallpaper
    ? `url("${theme.wallpaper}") center / ${theme.tile ? 'auto repeat' : 'cover no-repeat'}, #0e0f14`
    : DEFAULT_WALLPAPER;
  return `radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(6,7,10,.7) 100%), linear-gradient(rgba(8,9,14,${dim}), rgba(8,9,14,${dim})), ${image}`;
}

/**
 * Variáveis CSS do tema, aplicadas na raiz da arena (e na prévia da tela de temas): a escala de acento, os derivados
 * (`--color-accent`, `--color-section-glow`, `--color-section`), o fundo e os ajustes do Campo de Batalha. Sem tema,
 * os padrões.
 */
export function themeVars(theme: BoardTheme | null): Record<string, string> {
  const ramp = PALETTES[theme?.palette ?? DEFAULT_PALETTE]?.ramp ?? PALETTES[DEFAULT_PALETTE].ramp;
  const vars: Record<string, string> = {};
  ramp.forEach((c, i) => (vars[`--color-accent-${(i + 1) * 100}`] = c));
  vars['--color-accent'] = ramp[4];
  vars['--color-section-glow'] = `${ramp[4]}47`; // alfa 0,28
  vars['--color-section'] = `${ramp[8]}b3`; // alfa 0,7
  vars['--page-bg'] = themePageBackground(theme);
  vars['--arena-dim'] = String(theme?.arenaDim ?? THEME_RANGES.arenaDim.default);
  vars['--arena-blur'] = `${theme?.blur ?? THEME_RANGES.blur.default}px`;
  return vars;
}
