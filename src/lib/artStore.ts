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

/**
 * O Blob está ligado ao projeto? Stores novos criam só `BLOB_STORE_ID` e autenticam por OIDC (`VERCEL_OIDC_TOKEN`,
 * que a Vercel injeta no site publicado; localmente vem do `vercel env pull`). Stores antigos usam
 * `BLOB_READ_WRITE_TOKEN`. O `@vercel/blob` aceita os dois.
 */
export function isBlobConfigured(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Erro de credencial do Blob (ex.: local sem `VERCEL_OIDC_TOKEN`) vira 503 com a explicação. */
async function withBlobAuth<T>(run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('Vercel Blob:') && /private store|private access/i.test(e.message)) {
      console.error(e);
      throw new ArtError(503, 'O store do Vercel Blob foi criado como privado: o app precisa de um store público.');
    }
    if (e instanceof Error && /credentials|oidc|token/i.test(e.message) && e.message.startsWith('Vercel Blob:')) {
      console.error(e);
      throw new ArtError(503, 'O servidor não conseguiu se autenticar no armazenamento de imagens.');
    }
    throw e;
  }
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

/**
 * Guarda a arte (se ainda não existir) e devolve o endereço público dela. Com `ref`, o envio já registra o uso (carta
 * criada); sem, a imagem fica pendente até alguém passar a usar (arte alternativa) ou é apagada depois de um dia.
 */
export async function saveArt(data: unknown, tokenHash: string, ref?: string): Promise<{ url: string; hash: string }> {
  requireBlob();
  const { bytes, type, ext } = parseArtDataUrl(data);
  const hash = createHash('sha256').update(bytes).digest('hex');
  const pathname = artPathname(hash, ext);
  const redis = getRedis();
  // Quem envia primeiro fica como dono (para as imagens de antes das referências). Reenvio não muda o dono.
  await redis.set(ownerKey(hash), `t:${tokenHash}`, { nx: true });
  if ((await redis.scard(refsKey(hash))) === 0) await redis.zadd(PENDING_KEY, { score: Date.now(), member: `${hash}.${ext}` });
  await sweepPendingArts().catch((e) => console.error('Falha ao apagar artes sem uso', e));
  const saved = await storeArt(pathname, bytes, type, hash);
  if (ref) await addArtRef(ref, saved.url);
  return saved;
}

async function storeArt(pathname: string, bytes: Buffer, type: string, hash: string): Promise<{ url: string; hash: string }> {
  return withBlobAuth(async () => {
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
  });
}

/*
 * Referências: só fica no Blob a arte que alguma coisa usa. A mesma imagem (mesmo hash) pode estar em várias cartas
 * criadas e artes alternativas, então cada uso é registrado e a imagem só é apagada quando o último sai.
 * - `naruto-ccg:art-refs:<sha256>`: conjunto com quem usa a imagem (`alt:<carta>:<arte>` = arte alternativa;
 *   `custom:<hash do token>:<carta>` = carta criada de um navegador).
 * - `naruto-ccg:art-ref:<quem>`: as imagens que esse uso tem agora (lista de `<sha256>.<ext>`), para saber o que saiu
 *   quando ele muda.
 * - `naruto-ccg:art-pending`: imagens enviadas que ainda não têm uso (nota = quando foram enviadas). Se em
 *   `PENDING_TTL_MS` ninguém passar a usar (o registro da arte alternativa falhou, a carta não foi salva), a imagem é
 *   apagada (`sweepPendingArts`, chamada a cada envio).
 */

const refsKey = (hash: string) => `naruto-ccg:art-refs:${hash}`;
const refKey = (ref: string) => `naruto-ccg:art-ref:${ref}`;
const PENDING_KEY = 'naruto-ccg:art-pending';
const PENDING_TTL_MS = 24 * 60 * 60 * 1000;

/** `<sha256>.<ext>` de um endereço de arte do Blob (ou null). */
export function artFileOf(url: string): string | null {
  try {
    const m = /\/naruto-ccg\/art\/([0-9a-f]{64}\.(?:webp|jpg|png))$/.exec(new URL(url).pathname);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

const hashOf = (file: string) => file.slice(0, 64);

/** Apaga a imagem do Blob e tudo o que o Redis guarda dela. */
async function deleteArtFile(file: string): Promise<void> {
  const hash = hashOf(file);
  await withBlobAuth(() => del(`naruto-ccg/art/${file}`));
  await getRedis().pipeline().del(ownerKey(hash)).del(refsKey(hash)).zrem(PENDING_KEY, file).exec();
}

/** Tira um uso da imagem; sem nenhum uso, ela é apagada do Blob. */
async function releaseArt(file: string, ref: string): Promise<void> {
  const [, left] = await getRedis().multi().srem(refsKey(hashOf(file)), ref).scard(refsKey(hashOf(file))).exec<[number, number]>();
  if (left === 0) await deleteArtFile(file);
}

/**
 * Diz quais imagens um uso (`ref`) tem agora: as novas ganham o uso, as que saíram perdem e, sem nenhum outro, são
 * apagadas do Blob. `legacy` serve para usos de antes das referências (sem lista guardada): as imagens que ele tinha
 * (`previous`) e não tem mais são apagadas se ninguém registrou uso nelas e se foram enviadas por `tokenHash`.
 */
export async function setArtRefs(
  ref: string,
  urls: readonly string[],
  legacy?: { previous: readonly string[]; tokenHash: string },
): Promise<void> {
  requireBlob();
  const redis = getRedis();
  const files = [...new Set(urls.map(artFileOf).filter((f): f is string => !!f))];
  const prev = await redis.get<string[]>(refKey(ref));
  const before = new Set(prev ?? []);
  const added = files.filter((f) => !before.has(f));
  const removed = [...before].filter((f) => !files.includes(f));
  const tx = redis.multi();
  for (const f of added) tx.sadd(refsKey(hashOf(f)), ref).zrem(PENDING_KEY, f);
  if (files.length) tx.set(refKey(ref), files);
  else tx.del(refKey(ref));
  await tx.exec();
  for (const f of removed) await releaseArt(f, ref);
  if (prev === null && legacy) {
    for (const url of legacy.previous) {
      const f = artFileOf(url);
      if (!f || files.includes(f)) continue;
      const [owner, uses] = await redis.pipeline().get<string>(ownerKey(hashOf(f))).scard(refsKey(hashOf(f))).exec<[string | null, number]>();
      if (uses === 0 && owner === `t:${legacy.tokenHash}`) await deleteArtFile(f);
    }
  }
}

/** Dá mais um uso a uma imagem (sem tirar os outros do mesmo `ref`): o envio da arte de uma carta criada. */
export async function addArtRef(ref: string, url: string): Promise<void> {
  const file = artFileOf(url);
  if (!file) return;
  const prev = (await getRedis().get<string[]>(refKey(ref))) ?? [];
  if (prev.includes(file)) return;
  await getRedis().multi().sadd(refsKey(hashOf(file)), ref).zrem(PENDING_KEY, file).set(refKey(ref), [...prev, file]).exec();
}

/** Apaga as imagens enviadas há mais de `PENDING_TTL_MS` que ninguém passou a usar (algumas por vez). */
export async function sweepPendingArts(limit = 20): Promise<number> {
  const redis = getRedis();
  const stale = await redis.zrange<string[]>(PENDING_KEY, '-inf', Date.now() - PENDING_TTL_MS, { byScore: true, offset: 0, count: limit });
  let deleted = 0;
  for (const raw of stale) {
    const file = String(raw);
    if ((await redis.scard(refsKey(hashOf(file)))) === 0) {
      await deleteArtFile(file);
      deleted++;
    } else await redis.zrem(PENDING_KEY, file);
  }
  return deleted;
}
