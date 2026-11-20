import { hydrateContent } from './hydrate.ts';
import { readContent } from './store.ts';
import type { ContentSnapshot } from './types.ts';

/**
 * Conteúdo para os scripts locais (scripts/card-scan, scripts/review-set...): lê o Redis das variáveis de ambiente
 * (`node --env-file-if-exists=.env.local ...`) e põe em uso, como o app. Depois disso `CARDS`, `LAYOUTS` e os ícones
 * têm o conteúdo de verdade, não a carga inicial dos arquivos.
 */
export async function loadContentForScripts(): Promise<ContentSnapshot> {
  const content = await readContent();
  hydrateContent(content);
  return content;
}
