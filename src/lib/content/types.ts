import type { IconsContent } from '../cardMaker/icons/index.ts';
import type { LayoutSpec } from '../cardMaker/layouts/types.ts';
import type { LayoutId } from '../cardMaker/model.ts';
import type { Card } from '../../models/card.ts';
import type { AssetMap } from './assets.ts';

/**
 * Conteúdo editável do jogo, guardado no Redis (src/lib/content/store.ts) e carregado inteiro pelo app: as cartas, a
 * configuração dos layouts e dos ícones e o mapa das imagens (molduras e ícones no Vercel Blob).
 *
 * `version` aumenta a cada gravação: o navegador busca `/api/content/<version>`, que fica em cache para sempre.
 */
export interface ContentSnapshot {
  version: number;
  cards: Card[];
  layouts: Record<LayoutId, LayoutSpec>;
  icons: IconsContent;
  assets: AssetMap;
  /**
   * Nome impresso (inglês, de src/data/sets/) das cartas em que ele difere do nome do conteúdo (PT-BR), para a busca
   * achar a carta pelos dois. Não fica no Redis: a rota `/api/content/<versão>` junta na resposta.
   */
  namesEn?: Record<string, string>;
}

/**
 * O que tem histórico (as últimas versões, para desfazer). As imagens não têm: a trocada sai do Blob na hora, para só
 * ficar guardado o que está em uso.
 */
export type ContentKind = 'card' | 'layout' | 'icon';

export const CONTENT_KINDS: readonly ContentKind[] = ['card', 'layout', 'icon'];

/** Uma versão anterior de um item: o valor e quando foi trocado. */
export interface HistoryEntry {
  savedAt: string;
  value: unknown;
  /** Quem trocou o item (`content:push`, o envio do conteúdo local para produção). Sem valor: uma edição pelo site. */
  by?: string;
}

/** Quantas versões anteriores de cada item ficam guardadas. */
export const HISTORY_SIZE = 5;
