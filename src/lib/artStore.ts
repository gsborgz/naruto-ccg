import { createHash } from 'node:crypto';
import { BlobNotFoundError, del, head, put } from '@vercel/blob';
import { getRedis } from './redis.ts';
import { ART_DATA_URL, ART_MAX_BYTES, artPathname } from './cardMaker/sharedCard.ts';

/**
 * Artes das cartas criadas no Vercel Blob (docs/DEPLOY.md, "Artes das cartas criadas"). Só no servidor.
 * - O arquivo é `naruto-ccg/art/<sha256>.<ext>`: a mesma imagem nunca é guardada duas vezes.
 * - `naruto-ccg:art-owner:<sha256>` (Redis) guarda `t:<hash do token>` de quem enviou primeiro: só ele pode apagar
 *   (o prefixo evita que o cliente do Upstash leia o hash como número).
 */

export class ArtError extends Error {
  readonly status: 400 | 403 | 404 | 503;
  constructor(status: 400 | 403 | 404 | 503, message: string) {
    super(message);
    this.status = status;
  }
}

const ownerKey = (hash: string) => `naruto-ccg:art-owner:${hash}`;

/** O Blob está ligado ao projeto (variável criada pela Vercel ao conectar o store)? */
export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

function requireBlob() {
  if (!isBlobConfigured()) throw new ArtError(503, 'O armazenamento de imagens não está configurado no servidor.');
}

/** Decodifica e confere o data URL enviado (formato e peso). */
export function parseArtDataUrl(data: unknown): { bytes: Buffer; type: string; ext: string } {
  if (typeof data !== 'string') throw new ArtError(400, 'Imagem inválida.');
  const m = ART_DATA_URL.exec(data);
  if (!m) throw new ArtError(400, 'Formato de imagem não aceito (use JPEG, PNG ou WebP).');
  const bytes = Buffer.from(data.slice(data.indexOf(',') + 1), 'base64');
  if (bytes.length > ART_MAX_BYTES) {
    throw new ArtError(400, `Imagem acima de ${Math.round(ART_MAX_BYTES / 1000)} KB.`);
  }
  const type = `image/${m[1]}`;
  return { bytes, type, ext: m[1] === 'jpeg' ? 'jpg' : m[1] };
}

/** Guarda a arte (se ainda não existir) e devolve o endereço público dela. */
export async function saveArt(data: unknown, tokenHash: string): Promise<{ url: string; hash: string }> {
  requireBlob();
  const { bytes, type, ext } = parseArtDataUrl(data);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const pathname = artPathname(hash, ext);
  // Quem envia primeiro fica como dono (pode apagar). Reenvio da mesma imagem não muda o dono.
  await getRedis().set(ownerKey(hash), `t:${tokenHash}`, { nx: true });
  try {
    const existing = await head(pathname);
    return { url: existing.url, hash };
  } catch (e) {
    if (!(e instanceof BlobNotFoundError)) throw e;
  }
  const blob = await put(pathname, bytes, {
    access: 'public',
    contentType: type,
    addRandomSuffix: false,
    allowOverwrite: true, // dois envios ao mesmo tempo da mesma imagem: o conteúdo é o mesmo
    cacheControlMaxAge: 60 * 60 * 24 * 365, // o nome é o hash: o conteúdo nunca muda
  });
  return { url: blob.url, hash };
}

/** Apaga a arte do Blob. Só quem a enviou primeiro (mesmo token de jogador). */
export async function deleteArt(url: string, tokenHash: string): Promise<void> {
  requireBlob();
  const m = /\/naruto-ccg\/art\/([0-9a-f]{64})\.(webp|jpg|png)$/.exec(new URL(url).pathname);
  if (!m) throw new ArtError(400, 'Endereço de imagem inválido.');
  const hash = m[1];
  const owner = await getRedis().get<string>(ownerKey(hash));
  if (owner === null) throw new ArtError(404, 'Imagem não encontrada.');
  if (owner !== `t:${tokenHash}`) throw new ArtError(403, 'Só quem enviou a imagem pode apagá-la.');
  await del(artPathname(hash, m[2]));
  await getRedis().del(ownerKey(hash));
}
