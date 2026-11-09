import type { Card } from '../models/card.ts';
import type { CardLanguage, CardTranslations, LocalizedCardText } from '../models/cardTranslation.ts';
import { translateCharacteristic, translateRarity } from '../data/ptbr/glossary.ts';

/**
 * Textos da carta no idioma escolhido. Em PT-BR, o que não tiver tradução fica em inglês
 * (`translated: false`). `translations` é `null` enquanto o módulo PT-BR ainda está carregando.
 */
export function localizeCard(
  card: Card,
  language: CardLanguage,
  translations: CardTranslations | null,
): LocalizedCardText {
  const characteristics = 'characteristics' in card ? card.characteristics : [];
  if (language === 'en') {
    return { text: card.text, flavor: card.flavor, characteristics, rarity: card.rarity, translated: true };
  }
  const tr = translations?.[card.id];
  return {
    text: tr?.text ?? card.text,
    flavor: tr?.flavor ?? card.flavor,
    characteristics: characteristics.map(translateCharacteristic),
    rarity: card.rarity && translateRarity(card.rarity),
    // Carta sem texto nem frase não precisa de tradução por carta.
    translated: tr !== undefined || (card.text.length === 0 && !card.flavor),
  };
}
