import type { Card } from '../models/card.ts';
import type { CardLanguage, CardTranslations, LocalizedCardText } from '../models/cardTranslation.ts';
import { CARDS_BY_ID } from '../data/cards.ts';
import { SET_NAMES } from '../data/sets.ts';
import { SET_NAMES_PTBR, translateAttribute, translateCharacteristic, translateRarity } from '../data/ptbr/glossary.ts';

/** Nome em inglês → nome PT-BR, montado a partir das traduções (um mapa por conjunto de traduções). */
const namesCache = new WeakMap<CardTranslations, ReadonlyMap<string, string>>();
export function cardNamesPtBr(translations: CardTranslations): ReadonlyMap<string, string> {
  let names = namesCache.get(translations);
  if (!names) {
    const map = new Map<string, string>();
    for (const [id, tr] of Object.entries(translations)) {
      const card = CARDS_BY_ID.get(id);
      if (card && tr.name) map.set(card.name, tr.name);
    }
    namesCache.set(translations, (names = map));
  }
  return names;
}

/** Nome da carta no idioma escolhido (PT-BR sem tradução de nome = nome impresso). */
export function localizeCardName(card: Card, language: CardLanguage, translations: CardTranslations | null): string {
  return (language === 'pt-BR' && translations?.[card.id]?.name) || card.name;
}

/** Nome da coleção no idioma escolhido. */
export function localizeSetName(set: string, language: CardLanguage): string | undefined {
  return (language === 'pt-BR' && SET_NAMES_PTBR[set]) || SET_NAMES[set];
}

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
  const attributes = 'attributes' in card ? card.attributes : [];
  if (language === 'en') {
    return {
      name: card.name,
      text: card.text,
      flavor: card.flavor,
      characteristics,
      attributes,
      rarity: card.rarity,
      translated: true,
    };
  }
  const tr = translations?.[card.id];
  const names = translations ? cardNamesPtBr(translations) : undefined;
  return {
    name: tr?.name ?? card.name,
    text: tr?.text ?? card.text,
    flavor: tr?.flavor ?? card.flavor,
    characteristics: characteristics.map((c) => translateCharacteristic(c, (en) => names?.get(en))),
    attributes: attributes.map(translateAttribute),
    rarity: card.rarity && translateRarity(card.rarity),
    // Carta sem texto nem frase não precisa de tradução por carta.
    translated: tr !== undefined || (card.text.length === 0 && !card.flavor),
  };
}
