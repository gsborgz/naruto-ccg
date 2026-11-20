/**
 * Edições da configuração (layouts, ícones e o `layout` de cada carta), feitas pelo site e aplicadas no conteúdo do
 * Redis. Cada edição é um caminho no objeto e o valor novo (`null` tira o campo e volta ao padrão).
 */

import type { IconGroup } from '../cardMaker/icons/index.ts';

export type ChangeValue = number | string | boolean | (number | string)[];

/** Valor de um campo da configuração (listas, como `dyWithKanji`, são gravadas inteiras). */
export type ConfigValue = ChangeValue;

/** Alvo de uma edição da configuração: um layout ou um ícone (grupo e id, como no editor). */
export type ConfigTarget = { kind: 'layout'; id: string } | { kind: 'icon'; group: IconGroup; id: string };

export interface ContentChange {
  path: string[];
  value: ChangeValue | null;
}

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
const CARD_TYPES = new Set(['ninja', 'client', 'jutsu', 'mission']);

type Obj = Record<string, unknown>;
const isObject = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

function isValue(v: unknown): v is ChangeValue {
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'string') return v.length <= 500;
  if (typeof v === 'boolean') return true;
  return Array.isArray(v) && v.length <= 20 && v.every((x) => (typeof x === 'number' && Number.isFinite(x)) || (typeof x === 'string' && x.length <= 100));
}

/** Confere o formato de uma edição vinda do navegador. */
export function isContentChange(c: unknown, allowNull = false): c is ContentChange {
  if (!isObject(c) || !Array.isArray(c.path) || c.path.length === 0 || c.path.length > 8) return false;
  if (!c.path.every((k) => typeof k === 'string' && /^[\w-]{1,40}$/.test(k) && !FORBIDDEN_KEYS.has(k))) return false;
  return c.value === null ? allowNull : isValue(c.value);
}

/** Grava `value` no caminho (cria os objetos que faltarem); `null` tira o campo. */
export function setAt(root: Obj, path: string[], value: ChangeValue | null): void {
  let o = root;
  for (const key of path.slice(0, -1)) {
    if (!isObject(o[key]) && !Array.isArray(o[key])) o[key] = {};
    o = o[key] as Obj;
  }
  const last = path[path.length - 1];
  if (value === null) delete o[last];
  else o[last] = Array.isArray(value) ? [...value] : value;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => deepEqual(x, b[i]));
  }
  if (!isObject(a) || !isObject(b)) return false;
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => deepEqual(a[k], b[k]));
}

/**
 * Nos arquivos originais, vários tipos de carta dividiam o mesmo objeto (`forAllTypes(...)` e constantes como `COST`),
 * e editar um mudava todos. No JSON eles viram cópias; aqui eles voltam a ser um objeto só, para a edição continuar
 * valendo para todos os tipos iguais: um objeto cujas chaves são tipos de carta e cujos valores são objetos idênticos
 * passa a apontar para o mesmo valor. Feito no navegador (prévia do editor) e no servidor (ao gravar).
 */
export function linkSharedTypes<T>(root: T): T {
  const visit = (node: unknown) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!isObject(node)) return;
    Object.values(node).forEach(visit);
    const keys = Object.keys(node);
    if (keys.length < 2 || !keys.every((k) => CARD_TYPES.has(k))) return;
    const first = node[keys[0]];
    if (!isObject(first) || !keys.every((k) => deepEqual(node[k], first))) return;
    for (const k of keys) node[k] = first;
  };
  visit(root);
  return root;
}

/** Cópia do objeto com as edições aplicadas (os tipos iguais andam juntos, ver `linkSharedTypes`). */
export function applyChanges<T>(source: T, changes: ContentChange[]): T {
  const copy = linkSharedTypes(structuredClone(source)) as Obj;
  for (const c of changes) setAt(copy, c.path, c.value);
  // Volta para JSON puro (desfaz os objetos divididos).
  return JSON.parse(JSON.stringify(copy)) as T;
}

/** Campos do `layout` da carta que a aba Layout do detalhe da carta pode mudar. */
const CARD_LAYOUT_FIELDS = new Set([
  'layout',
  'nameSize',
  'nameWrap',
  'panelVariant',
  'nameBanner',
  'icons.type',
  'icons.elements',
  'icons.entrance',
  'icons.hand',
  'icons.attribute',
]);

/** Faixa do ajuste do tamanho do nome, em pixels da carta (a mesma do slider do criador). */
export const NAME_SIZE_RANGE = 30;

/** Confere uma edição do `layout` de uma carta (aba Layout e ajuste do tamanho do nome). */
export function isCardLayoutChange(c: unknown): c is ContentChange {
  if (!isContentChange(c, true) || !CARD_LAYOUT_FIELDS.has(c.path.join('.'))) return false;
  const [field] = c.path;
  if (field === 'nameSize') return typeof c.value === 'number' && Math.abs(c.value) <= NAME_SIZE_RANGE;
  if (field === 'nameWrap') return c.value === null || c.value === 'single' || c.value === 'break';
  if (typeof c.value === 'number') return false;
  return !Array.isArray(c.value) || c.value.every((v) => typeof v === 'string');
}
