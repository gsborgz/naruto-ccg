/**
 * Ids e coleção das cartas do criador (`/criar`) quando usadas no montador de decks (conversão em `deckCard.ts`).
 * Arquivo leve, sem o modelo do criador: é importado pela face das cartas e pelos nomes das coleções.
 */

export const CUSTOM_SET = 'CUSTOM';
export const CUSTOM_SET_NAME = 'Cartas criadas';

const PREFIX = 'custom-';

/** Id da carta criada no deck (o mesmo em todas as abas e depois de editar a carta). */
export function customDeckCardId(customId: string): string {
  return PREFIX + customId;
}

export function isCustomCardId(id: string): boolean {
  return id.startsWith(PREFIX);
}

/** Inverso de `customDeckCardId`: o id da carta no criador. */
export function customSourceId(deckCardId: string): string {
  return deckCardId.slice(PREFIX.length);
}

/** O deck tem alguma carta criada (que só existe neste navegador). */
export function hasCustomCards(cards: Record<string, number>): boolean {
  return Object.entries(cards).some(([id, qty]) => qty > 0 && isCustomCardId(id));
}
