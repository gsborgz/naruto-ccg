import type { Card, JutsuCostOption, Power } from '../../models/card.ts';
import { CUSTOM_SET, customDeckCardId } from './customIds.ts';
import { hasCharacteristics, parseCardText, type CustomCard, type JutsuCostPart } from './model.ts';

/**
 * Cartas do criador (`/criar`) no montador de decks: viram cartas do catálogo (`Card`) com o id `custom-<uuid>`
 * e a coleção `CUSTOM`. Ficam só neste navegador (localStorage), então não vão para salas nem compartilhamentos.
 */

/** Nome usado quando a carta foi salva sem nome (conta como um nome só na regra de cópias). */
export const UNNAMED_CARD = 'Carta sem nome';

/** Custo digitado ("3", "X", vazio). "X" vira -1, como nos dados do catálogo. */
function parseCost(value: string): number {
  const v = value.trim().toUpperCase();
  if (v === 'X') return -1;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function parsePowerValue(value: string | undefined): number | 'X' {
  const v = (value ?? '').trim().toUpperCase();
  if (v === 'X') return 'X';
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
}

/** Força "Combate/Suporte" (ex.: "7/2", "X/0"). */
function parsePower(value: string): Power {
  const [combat, support] = value.split('/');
  return { combat: parsePowerValue(combat), support: parsePowerValue(support) };
}

function parseJutsuCost(part: JutsuCostPart): JutsuCostOption {
  const v = part.generic.trim().toUpperCase();
  const n = Number.parseInt(v, 10);
  return { symbols: [...part.symbols], generic: v === 'X' ? 'X' : Number.isFinite(n) && n > 0 ? n : 0 };
}

/** Texto de efeito sem a marcação do criador (negrito/cores), uma linha por bloco, como nos dados do catálogo. */
function plainText(text: string): string[] {
  return parseCardText(text)
    .map((runs) => runs.map((r) => r.text).join('').trim())
    .filter(Boolean);
}

/** Converte a carta do criador para o formato do catálogo (usado pelas regras de montagem e pelas grades). */
export function customCardToCard(c: CustomCard): Card {
  const base = {
    id: customDeckCardId(c.id),
    name: c.name.trim().replace(/\s+/g, ' ') || UNNAMED_CARD,
    elements: [...new Set(c.elements.map((e) => e.element))],
    number: '',
    set: CUSTOM_SET,
    text: plainText(c.text),
    ...(c.flavor.trim() && { flavor: c.flavor.trim() }),
    image: '',
  };
  const characteristics = hasCharacteristics(c.type) ? c.characteristics.map((s) => s.trim()).filter(Boolean) : [];
  const entranceCost = parseCost(c.entranceCost);
  const handCost = parseCost(c.handCost);
  switch (c.type) {
    case 'ninja':
      return {
        ...base,
        type: 'ninja',
        entranceCost,
        handCost,
        characteristics,
        healthy: parsePower(c.healthy),
        injured: parsePower(c.injured),
        attributes: c.attribute.label
          .split('/')
          .map((s) => s.trim())
          .filter(Boolean),
      };
    case 'jutsu': {
      const alternatives = (c.jutsuCost.alternatives ?? []).map(parseJutsuCost);
      return {
        ...base,
        type: 'jutsu',
        cost: { ...parseJutsuCost(c.jutsuCost), ...(alternatives.length && { alternatives }) },
      };
    }
    case 'mission':
      return { ...base, type: 'mission', entranceCost, handCost };
    case 'client':
      return { ...base, type: 'client', entranceCost, handCost, characteristics };
  }
}
