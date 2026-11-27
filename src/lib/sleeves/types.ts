import { isBlobArt } from '../cardMaker/sharedCard.ts';

/**
 * Sleeves: o verso das cartas de um deck (nome + imagem). Cadastrados pelos jogadores no montador; todos veem e usam
 * qualquer sleeve, mas só quem criou edita e exclui. O deck guarda o id do sleeve escolhido (`Deck.sleeve`) e, na
 * partida, o verso das cartas dele aparece com a imagem para os dois jogadores. Dados puros (navegador e servidor).
 */

export interface Sleeve {
  /** UUID. */
  id: string;
  name: string;
  /** Imagem no Vercel Blob (`naruto-ccg/art/`), já recortada na proporção da carta (5×7). */
  image: string;
  createdAt: string;
  updatedAt: string;
}

/** O sleeve como vai junto com o deck para fora da conta (sala, compartilhamento): o id e a imagem. */
export interface DeckSleeve {
  id: string;
  image: string;
}

/** Verso padrão (a carta física do Naruto CCG): sem sleeve, ou se a imagem do sleeve não carregar. */
export const DEFAULT_BACK = '/cards/card-back.webp';

export const SLEEVE_LIMITS = { sleeves: 50, nameLength: 60 } as const;

/** Tamanho da imagem do sleeve: o da carta montada (proporção 5×7). */
export const SLEEVE_SIZE = { w: 750, h: 1050 } as const;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isRecord = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);

export const isSleeveId = (x: unknown): x is string => typeof x === 'string' && UUID.test(x);

/** Confere e normaliza um sleeve vindo do navegador; `null` se for inválido. */
export function parseSleeve(x: unknown): Sleeve | null {
  if (!isRecord(x) || !isSleeveId(x.id) || typeof x.name !== 'string') return null;
  if (typeof x.image !== 'string' || !isBlobArt(x.image)) return null;
  const date = (v: unknown) => (typeof v === 'string' && v.length <= 40 ? v : new Date().toISOString());
  return {
    id: x.id.toLowerCase(),
    name: x.name.trim().slice(0, SLEEVE_LIMITS.nameLength) || 'Sleeve sem nome',
    image: x.image,
    createdAt: date(x.createdAt),
    updatedAt: date(x.updatedAt),
  };
}

/** O sleeve que vai junto com o deck; `undefined` se ausente, `null` se inválido. */
export function parseDeckSleeve(x: unknown): DeckSleeve | null | undefined {
  if (x === undefined) return undefined;
  if (!isRecord(x) || !isSleeveId(x.id) || typeof x.image !== 'string' || !isBlobArt(x.image)) return null;
  return { id: x.id.toLowerCase(), image: x.image };
}

/** Valor de `--sleeve` (o verso das cartas na arena); sem sleeve, a arena usa o verso da carta física. */
export function sleeveVar(image: string | null | undefined): Record<string, string> {
  // O endereço é conferido (`isBlobArt`) ao entrar: só letras, números, `/`, `.` e `:`.
  return image && isBlobArt(image) ? { '--sleeve': `url("${image}")` } : {};
}
