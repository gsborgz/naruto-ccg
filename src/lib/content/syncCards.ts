/**
 * Copia cartas dos arquivos das coleções (src/data/sets/ em inglês + a tradução de src/data/ptbr/, a carga inicial) para o
 * conteúdo do jogo no Redis, com os textos em PT-BR. Serve para levar ao app correções feitas nesses arquivos (revisão
 * contra as imagens, docs/REVISAO-CARTAS.md). Cuidado: os dados e os textos da carta no Redis são trocados pelos dos
 * arquivos, inclusive o que foi editado pelo site (aba Editar do detalhe); a versão anterior vai para o histórico.
 *
 * O `layout` de cada carta (visual da carta montada, editado pelo site) fica o que está no Redis, a não ser com
 * `--with-layout`. A versão anterior de cada carta vai para o histórico.
 *
 * Uso: npm run content:sync-cards -- <SET ou id> [<SET ou id> ...] [--with-layout] [--dry-run]
 *   ex.: npm run content:sync-cards -- S02            (a coleção inteira)
 *        npm run content:sync-cards -- s02-n-010 s02-j-003
 * O Redis é o das variáveis do .env.local; para gravar em produção, rode com as variáveis de produção
 * (ex.: `node --env-file=.env.production.local src/lib/content/syncCards.ts S02`).
 */
import { SEED_CARDS } from '../../data/sets/index.ts';
import { CARDS_BY_ID } from '../../data/cards.ts';
import type { Card } from '../../models/card.ts';
import { loadContentForScripts } from './scripts.ts';
import { cardsToPtBr } from './ptbr.ts';
import { saveCards } from './store.ts';

const args = process.argv.slice(2);
const withLayout = args.includes('--with-layout');
const dryRun = args.includes('--dry-run');
const wanted = args.filter((a) => !a.startsWith('--'));
if (!wanted.length) {
  console.error('Uso: npm run content:sync-cards -- <SET ou id> [...] [--with-layout] [--dry-run]');
  process.exit(1);
}

await loadContentForScripts();

const picked = cardsToPtBr(SEED_CARDS.filter((c) => wanted.some((w) => w.toUpperCase() === c.set || w.toLowerCase() === c.id)), SEED_CARDS);
const notFound = wanted.filter((w) => !SEED_CARDS.some((c) => w.toUpperCase() === c.set || w.toLowerCase() === c.id));

const changed: Card[] = [];
for (const seed of picked) {
  const current = CARDS_BY_ID.get(seed.id);
  // O design fica o do Redis (a versão escolhida, `design`), a não ser com --with-layout.
  const next = JSON.parse(JSON.stringify(withLayout || !current ? seed : { ...seed, design: current.design })) as Card;
  if (!next.layout) delete next.layout;
  if (!next.design) delete next.design;
  const { layout: _layout, ...stored } = current ?? ({} as Card);
  if (JSON.stringify(next) !== JSON.stringify(current?.layout ? stored : current)) changed.push(next);
}

console.log(`${picked.length} cartas nos arquivos; ${changed.length} diferentes do Redis.`);
for (const c of changed.slice(0, 30)) console.log(`  ${c.id} ${c.name}`);
if (changed.length > 30) console.log(`  … e mais ${changed.length - 30}`);
if (notFound.length) console.log(`Não encontrados nos arquivos: ${notFound.join(', ')}`);
if (changed.length && !dryRun) console.log(`Gravado: conteúdo na versão ${await saveCards(changed)}.`);
process.exit(0);
