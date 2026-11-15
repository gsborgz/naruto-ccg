/**
 * Ajustes da carta montada feitos pelo próprio app em desenvolvimento (slider do tamanho do nome no detalhe da
 * carta): grava o valor direto no arquivo da coleção (src/data/sets/), só no bloco `layout` da carta.
 */

export const LAYOUT_SIZE_FIELDS = ['nameSize', 'nameSizePtBr'] as const;
export type LayoutSizeField = (typeof LAYOUT_SIZE_FIELDS)[number];

/** Faixa do slider, em pixels da carta (a mesma do criador). */
export const NAME_SIZE_RANGE = 30;

/**
 * Troca (ou acrescenta) `field: value` no `layout` da carta `cardId` dentro do código-fonte de uma coleção.
 * Devolve o código novo, ou `null` se a carta (ou o `layout` dela) não estiver no arquivo.
 */
export function setLayoutSize(source: string, cardId: string, field: LayoutSizeField, value: number): string | null {
  // Alguns arquivos de coleção têm quebras CRLF: edita em LF e devolve no formato original.
  if (source.includes('\r\n')) {
    const edited = setLayoutSize(source.replace(/\r\n/g, '\n'), cardId, field, value);
    return edited === null ? null : edited.replace(/\n/g, '\r\n');
  }
  const start = source.indexOf(`id: "${cardId}"`);
  if (start < 0) return null;
  const next = source.indexOf('\n  {\n    id: "', start);
  const end = next < 0 ? source.length : next;
  const block = source.slice(start, end);
  const layoutAt = block.indexOf('layout: {\n');
  if (layoutAt < 0) return null;

  const line = new RegExp(`(\\n(\\s*)${field}: )(-?[\\d.]+)(,)`);
  let edited: string;
  if (line.test(block.slice(layoutAt))) {
    edited = block.slice(0, layoutAt) + block.slice(layoutAt).replace(line, `$1${value}$4`);
  } else {
    // Campo ausente: entra logo depois de `layout: "..."`, com o mesmo recuo.
    const layoutId = /(\n(\s*)layout: "[^"]+",)/;
    const tail = block.slice(layoutAt);
    if (!layoutId.test(tail)) return null;
    edited = block.slice(0, layoutAt) + tail.replace(layoutId, `$1\n$2${field}: ${value},`);
  }
  return source.slice(0, start) + edited + source.slice(end);
}
