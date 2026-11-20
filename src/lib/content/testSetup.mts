/**
 * Carregado antes dos testes (`npm test`, `node --import`): põe cartas inventadas (`testFixture.ts`) no catálogo e a
 * configuração dos layouts e dos ícones da carga inicial (src/lib/cardMaker/) em uso, como o app faz com o conteúdo do
 * Redis. Os testes conferem regras e conversões, não os dados das cartas impressas.
 */
import { SEED_ICONS } from '../cardMaker/icons/seed.ts';
import { SEED_LAYOUTS } from '../cardMaker/layouts/seed.ts';
import { hydrateContent } from './hydrate.ts';
import { FIXTURE_CARDS } from './testFixture.ts';

hydrateContent(JSON.parse(JSON.stringify({ version: 1, cards: FIXTURE_CARDS, layouts: SEED_LAYOUTS, icons: SEED_ICONS, assets: {} })));
