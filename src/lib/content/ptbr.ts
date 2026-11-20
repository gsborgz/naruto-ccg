import type { Card } from '../../models/card.ts';
import type { CardTranslations } from '../../models/cardTranslation.ts';
import { CARD_TRANSLATIONS_PTBR } from '../../data/ptbr/index.ts';
import { translateAttribute, translateCharacteristic } from '../../data/ptbr/glossary.ts';

/**
 * Cartas em PT-BR para o conteúdo do jogo. O conteúdo (Redis) guarda os textos em PT-BR, editados pelo site; os
 * arquivos em inglês (`src/data/sets/`) e as traduções (`src/data/ptbr/`) são só a carga inicial.
 *
 * Nome, texto e frase vêm da tradução da carta; características e Atributos de Combate, do glossário ("Name: X"
 * usa o nome PT-BR da carta citada). O ajuste do nome traduzido (`nameSizePtBr`/`nameWrapPtBr`, do tempo em que a
 * carta mostrava os dois idiomas) vira o ajuste do nome.
 */

/** Nome em inglês → nome em PT-BR, das cartas dadas. */
function namesPtBr(cards: readonly Card[], translations: CardTranslations): Map<string, string> {
  const names = new Map<string, string>();
  for (const c of cards) {
    const name = translations[c.id]?.name;
    if (name) names.set(c.name, name);
  }
  return names;
}

function cardToPtBr(card: Card, translations: CardTranslations, names: ReadonlyMap<string, string>): Card {
  const tr = translations[card.id];
  const name = tr?.name ?? card.name;
  const next = { ...card, name, text: tr?.text ?? card.text } as Card;
  const flavor = tr?.flavor ?? card.flavor;
  if (flavor) next.flavor = flavor;
  else delete next.flavor;
  if ('characteristics' in next) {
    next.characteristics = next.characteristics.map((c) => translateCharacteristic(c, (en) => names.get(en)));
  }
  if (next.type === 'ninja') next.attributes = next.attributes.map(translateAttribute);
  if (card.layout) {
    const { nameSizePtBr, nameWrapPtBr, ...layout } = card.layout;
    if (name !== card.name) {
      if (nameSizePtBr !== undefined) layout.nameSize = nameSizePtBr;
      else delete layout.nameSize;
      if (nameWrapPtBr) layout.nameWrap = nameWrapPtBr;
      else delete layout.nameWrap;
    }
    next.layout = layout;
  }
  return next;
}

/**
 * As cartas (com os textos em inglês, como impressos) com os textos em PT-BR. `context`: as cartas onde procurar
 * o nome citado em "Name: X" (padrão: as próprias cartas).
 */
export function cardsToPtBr(cards: readonly Card[], context: readonly Card[] = cards, translations = CARD_TRANSLATIONS_PTBR): Card[] {
  const names = namesPtBr(context, translations);
  return cards.map((c) => cardToPtBr(c, translations, names));
}
