import { CARD_NAMES_EN, CARDS, CARDS_BY_ID } from '../../data/cards.ts';
import { installIcons } from '../cardMaker/icons/index.ts';
import { LAYOUTS, LAYOUT_LIST, TEXT_DIVIDER_DEFAULT } from '../cardMaker/layouts/index.ts';
import type { LayoutSpec } from '../cardMaker/layouts/types.ts';
import type { LayoutId } from '../cardMaker/model.ts';
import type { Card } from '../../models/card.ts';
import { installAssets } from './assets.ts';
import { linkSharedTypes } from './changes.ts';
import type { ContentSnapshot } from './types.ts';

/** Ordem dos layouts no seletor do criador. */
export const LAYOUT_ORDER: LayoutId[] = ['layout-01', 'layout-02', 'layout-03', 'layout-04', 'layout-05'];

let installed: number | null = null;

/** Versão do conteúdo em uso (`null` antes da primeira carga). */
export function contentVersion(): number | null {
  return installed;
}

/**
 * Põe o conteúdo em uso: preenche o catálogo (`CARDS`, `CARDS_BY_ID`), os layouts (`LAYOUTS`, `LAYOUT_LIST`), os
 * ícones e o mapa das imagens. Os objetos exportados continuam os mesmos (são atualizados no lugar), então quem já os
 * importou passa a ver o conteúdo novo.
 */
export function hydrateContent(snapshot: ContentSnapshot): void {
  const cards = CARDS as Card[];
  cards.length = 0;
  cards.push(...snapshot.cards);
  const byId = CARDS_BY_ID as Map<string, Card>;
  byId.clear();
  for (const c of snapshot.cards) byId.set(c.id, c);
  const namesEn = CARD_NAMES_EN as Map<string, string>;
  namesEn.clear();
  for (const [id, name] of Object.entries(snapshot.namesEn ?? {})) namesEn.set(id, name);

  for (const key of Object.keys(LAYOUTS)) delete LAYOUTS[key as LayoutId];
  LAYOUT_LIST.length = 0;
  const ids = [...LAYOUT_ORDER.filter((id) => snapshot.layouts[id]), ...(Object.keys(snapshot.layouts) as LayoutId[]).filter((id) => !LAYOUT_ORDER.includes(id))];
  for (const id of ids) {
    // Tipos com a mesma configuração voltam a dividir o objeto, como no código original (ver `linkSharedTypes`).
    const spec = linkSharedTypes(snapshot.layouts[id]) as LayoutSpec;
    // Linha acima do texto: os campos que o layout ainda não gravou ficam com o padrão (e aparecem no editor de layouts).
    spec.textDivider = { ...TEXT_DIVIDER_DEFAULT, ...spec.textDivider };
    LAYOUTS[id] = spec;
    LAYOUT_LIST.push(spec);
  }
  // Seletores de layout em ordem alfabética do nome (com os números em ordem: "Layout 2" antes de "Layout 10").
  LAYOUT_LIST.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR', { numeric: true, sensitivity: 'base' }));

  installIcons(snapshot.icons);
  installAssets(snapshot.assets);
  installed = snapshot.version;
}

/** Só a versão mudou (o navegador gravou uma edição que já está aplicada na memória). */
export function markContentVersion(version: number): void {
  installed = version;
}
