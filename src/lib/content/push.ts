/**
 * Envia o conteúdo do jogo do Redis local para o de produção, de uma vez: as cartas, os layouts e os ícones que
 * mudaram (ex.: depois de um scan, de `content:sync-cards` ou de editar no `npm run dev`). Cada item trocado guarda a
 * versão anterior no histórico de produção, como uma edição pelo site.
 *
 * Uso: npm run content:push [-- --dry-run] [-- --yes]
 * - Origem: o Redis do .env.local (o do Docker).
 * - Destino: o Redis do .env.production.local (só local, fora do Git): `KV_REST_API_URL` e `KV_REST_API_TOKEN` (ou
 *   `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`), copiados da Vercel. É o banco dividido com o pokedex: só as
 *   chaves `naruto-ccg:content:*` são lidas e gravadas.
 * - As imagens das molduras e dos ícones (Vercel Blob) não vão por aqui: em produção, use "Enviar imagens do deploy
 *   para o Blob" e "Trocar imagem" no editor de layouts.
 * - Itens que só existem em produção (ex.: um layout criado pelo site) ficam como estão.
 * - Item editado pelo site depois do último envio (a versão em produção não veio deste comando): fica de fora, para não
 *   desfazer a edição de alguém; `--overwrite` envia mesmo assim.
 */
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { Redis } from '@upstash/redis';
import { CONTENT_FORMAT, KEY, historyKey, readContent } from './store.ts';
import { HISTORY_SIZE, type ContentKind } from './types.ts';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const yes = args.includes('--yes');
const overwrite = args.includes('--overwrite');
/** Marca das versões gravadas por este comando no histórico de produção. */
const BY = 'content:push';
const TARGET_FILE = '.env.production.local';

/** Variáveis de um arquivo .env (só `NOME=valor`, com ou sem aspas). */
function readEnvFile(file: string): Record<string, string> {
  let text: string;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    console.error(`Falta o ${file} com as variáveis do Redis de produção (KV_REST_API_URL e KV_REST_API_TOKEN, da Vercel).`);
    process.exit(1);
  }
  const env: Record<string, string> = {};
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return env;
}

const env = readEnvFile(TARGET_FILE);
const url = env.KV_REST_API_URL ?? env.UPSTASH_REDIS_REST_URL;
const token = env.KV_REST_API_TOKEN ?? env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error(`O ${TARGET_FILE} precisa de KV_REST_API_URL e KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL/TOKEN).`);
  process.exit(1);
}
const sourceUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
if (sourceUrl && sourceUrl === url) {
  console.error('A origem (.env.local) e o destino (.env.production.local) são o mesmo Redis.');
  process.exit(1);
}
const target = new Redis({ url, token });

// Origem: o conteúdo local inteiro (grava a carga inicial ou converte o formato antes, se precisar).
const source = await readContent();

const sections: { kind: ContentKind; key: string; items: Record<string, unknown> }[] = [
  { kind: 'card', key: KEY.card, items: Object.fromEntries(source.cards.map((c) => [c.id, c])) },
  { kind: 'layout', key: KEY.layout, items: source.layouts },
  { kind: 'icon', key: KEY.icon, items: source.icons },
];

const [targetVersion, targetFormat] = await target
  .pipeline()
  .get<number | string>(KEY.version)
  .get<number | string>(KEY.format)
  .exec<[number | string | null, number | string | null]>();
const empty = targetVersion === null || targetVersion === undefined;

/** A última troca do item em produção foi pelo site (e não por este comando)? */
async function editedOnSite(kind: ContentKind, ids: string[]): Promise<Set<string>> {
  const out = new Set<string>();
  for (let i = 0; i < ids.length; i += 300) {
    const batch = ids.slice(i, i + 300);
    const tx = target.pipeline();
    for (const id of batch) tx.lrange<{ by?: string }>(historyKey(kind, id), 0, 0);
    const results = await tx.exec<{ by?: string }[][]>();
    results.forEach((r, j) => {
      if (r?.length && r[0]?.by !== BY) out.add(batch[j]);
    });
  }
  return out;
}

const plan: { kind: ContentKind; key: string; changed: [string, unknown, unknown][]; skipped: string[] }[] = [];
for (const s of sections) {
  const current = empty ? {} : ((await target.hgetall<Record<string, unknown>>(s.key)) ?? {});
  const all = Object.entries(s.items)
    .filter(([id, value]) => JSON.stringify(value) !== JSON.stringify(current[id]))
    .map(([id, value]) => [id, value, current[id]] as [string, unknown, unknown]);
  const onSite = empty || overwrite ? new Set<string>() : await editedOnSite(s.kind, all.filter(([, , prev]) => prev != null).map(([id]) => id));
  plan.push({ kind: s.kind, key: s.key, changed: all.filter(([id]) => !onSite.has(id)), skipped: [...onSite] });
}

const label: Record<ContentKind, string> = { card: 'cartas', layout: 'layouts', icon: 'ícones' };
console.log(`Produção: ${empty ? 'sem conteúdo (vai receber tudo)' : `versão ${targetVersion}, formato ${targetFormat ?? 1}`}.`);
for (const p of plan) {
  console.log(`  ${label[p.kind]}: ${p.changed.length} para enviar`);
  for (const [id] of p.changed.slice(0, 15)) console.log(`    ${id}`);
  if (p.changed.length > 15) console.log(`    … e mais ${p.changed.length - 15}`);
  if (p.skipped.length) {
    console.log(`  ${label[p.kind]}: ${p.skipped.length} com edição pelo site depois do último envio (ficam de fora; --overwrite envia): ${p.skipped.slice(0, 15).join(', ')}${p.skipped.length > 15 ? ` … e mais ${p.skipped.length - 15}` : ''}`);
  }
}
const total = plan.reduce((n, p) => n + p.changed.length, 0);
const formatBehind = Number(targetFormat ?? 1) < CONTENT_FORMAT;
if (!total && !formatBehind) {
  console.log('Nada para enviar: produção já tem o mesmo conteúdo.');
  process.exit(0);
}
if (dryRun) {
  console.log('--dry-run: nada foi gravado.');
  process.exit(0);
}
if (!yes) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question(`Enviar ${total} itens para o Redis de produção? (s/N) `)).trim().toLowerCase();
  rl.close();
  if (answer !== 's' && answer !== 'sim') {
    console.log('Cancelado.');
    process.exit(0);
  }
}

for (const p of plan) {
  for (let i = 0; i < p.changed.length; i += 100) {
    const batch = p.changed.slice(i, i + 100);
    const tx = target.pipeline();
    for (const [id, , previous] of batch) {
      if (previous === undefined || previous === null) continue;
      const key = historyKey(p.kind, id);
      tx.lpush(key, JSON.stringify({ savedAt: new Date().toISOString(), value: previous, by: BY }));
      tx.ltrim(key, 0, HISTORY_SIZE - 1);
    }
    tx.hset(p.key, Object.fromEntries(batch.map(([id, value]) => [id, value])));
    await tx.exec();
  }
}
// As cartas enviadas estão no formato atual (textos em PT-BR).
await target.set(KEY.format, CONTENT_FORMAT);
const version = await target.incr(KEY.version);
console.log(`Enviado: ${total} itens; produção na versão ${version}. O site pega a versão nova em até 15 s.`);
process.exit(0);
