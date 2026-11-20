import type { Card } from '../models/card.ts';

/**
 * Catálogo de cartas em uso. Começa vazio e é preenchido com o conteúdo do Redis (`hydrateContent` em
 * src/lib/content/hydrate.ts): no navegador pelo `ContentProvider`, antes de qualquer tela aparecer; no servidor por
 * `ensureContent()`, no começo de cada rota que precisa das cartas.
 *
 * Os arquivos de src/data/sets/ são só a carga inicial (seed) do Redis e os dados dos testes.
 * Imagens em /cards/<set>/<id>.png; versões otimizadas em /public/cards/<set> (`npm run cards:images`).
 */
export const CARDS: Card[] = [];

export const CARDS_BY_ID: ReadonlyMap<string, Card> = new Map<string, Card>();
