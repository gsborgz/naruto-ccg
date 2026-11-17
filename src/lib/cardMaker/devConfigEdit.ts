import ts from 'typescript';

/**
 * Edição dos arquivos de configuração do criador (layouts/layoutXX.ts e icons/**) pelo editor de layouts
 * (`/criar/layouts`, só em desenvolvimento). Troca o valor de um campo no código-fonte sem reescrever o resto:
 * comentários, constantes e chamadas ficam como estão.
 *
 * O caminho (`['cost', 'ninja', 'entrance', 'x']`) é o do objeto em tempo de execução; no código ele passa por:
 * - `forAllTypes(X)`: a chave do tipo é pulada e a edição vale para `X` (os quatro tipos, como no app);
 * - uma constante do próprio arquivo (`COST`, `MARK_ON_DARK`): a edição vai para a constante (vale para todos que a usam);
 * - um spread (`...SIDE_LABEL_STYLE`) ou um valor importado (`ATTRIBUTE_TEXT_STYLE.kanji`): o campo é acrescentado
 *   no objeto do arquivo, sobrescrevendo só ali.
 */

/** Valor de um campo; listas (ex.: `dyWithKanji`) são gravadas inteiras. */
export type ConfigValue = number | string | boolean | (number | string)[];

export interface ConfigEdit {
  path: string[];
  value: ConfigValue;
}

/** Número com até 4 casas, sem zeros à toa. */
export function formatNumber(n: number): string {
  return String(Math.round(n * 10000) / 10000);
}

/** Aspas das strings novas: as do arquivo (as configurações usam ', as coleções "). */
let fileQuote = "'";

function literal(value: ConfigValue, quote = fileQuote): string {
  if (Array.isArray(value)) return `[${value.map((v) => literal(v, quote)).join(', ')}]`;
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'boolean') return String(value);
  return quote + value.replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), `\\${quote}`) + quote;
}

const CARD_TYPES = new Set(['ninja', 'client', 'jutsu', 'mission']);
const KEY_RE = /^[A-Za-z_$][\w$]*$/;
const keyText = (key: string) => (KEY_RE.test(key) ? key : `'${key}'`);

interface Replacement {
  start: number;
  end: number;
  text: string;
}

function unwrap(node: ts.Expression): ts.Expression {
  while (ts.isParenthesizedExpression(node) || ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) node = node.expression;
  return node;
}

function propName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

/** Objeto `{ ...expr, a: { ...expr.a, b: valor } }` que sobrescreve só o campo do caminho. */
function spreadOverride(expr: string, path: string[], value: ConfigValue): string {
  const [key, ...rest] = path;
  const inner = rest.length ? spreadOverride(`${expr}.${key}`, rest, value) : literal(value);
  return `{ ...${expr}, ${keyText(key)}: ${inner} }`;
}

/** Objeto literal novo para um caminho (campo ausente com mais de um nível). */
function nestedLiteral(path: string[], value: ConfigValue): string {
  const [key, ...rest] = path;
  return `{ ${keyText(key)}: ${rest.length ? nestedLiteral(rest, value) : literal(value)} }`;
}

function insertProperty(sf: ts.SourceFile, obj: ts.ObjectLiteralExpression, key: string, valueText: string): Replacement {
  const text = sf.text;
  const close = obj.getEnd() - 1;
  const props = obj.properties;
  if (!props.length) return { start: obj.getStart(sf) + 1, end: close, text: ` ${keyText(key)}: ${valueText} ` };
  const last = props[props.length - 1];
  const between = text.slice(last.getEnd(), close);
  const multiline = between.includes('\n');
  if (!multiline) {
    const at = last.getEnd();
    return { start: at, end: at, text: `, ${keyText(key)}: ${valueText}` };
  }
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lineStart = text.lastIndexOf('\n', last.getStart(sf)) + 1;
  const indent = /^[ \t]*/.exec(text.slice(lineStart))![0];
  const comma = props.hasTrailingComma ? '' : ',';
  const at = last.getEnd() + (props.hasTrailingComma ? text.slice(last.getEnd()).indexOf(',') + 1 : 0);
  return { start: at, end: at, text: `${comma}${eol}${indent}${keyText(key)}: ${valueText}${props.hasTrailingComma ? ',' : ''}` };
}

function findConst(sf: ts.SourceFile, name: string): ts.Expression | undefined {
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    for (const d of st.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.name.text === name && d.initializer) return d.initializer;
    }
  }
  return undefined;
}

function resolve(sf: ts.SourceFile, node: ts.Expression, path: string[], value: ConfigValue, depth = 0): Replacement {
  if (depth > 20) throw new Error('Caminho longo demais');
  node = unwrap(node);

  if (!path.length) {
    const neg = ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken;
    if (ts.isNumericLiteral(node) || neg || node.kind === ts.SyntaxKind.TrueKeyword || node.kind === ts.SyntaxKind.FalseKeyword) {
      return { start: node.getStart(sf), end: node.getEnd(), text: literal(value) };
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const q = sf.text[node.getStart(sf)];
      return { start: node.getStart(sf), end: node.getEnd(), text: literal(value, q === '"' ? '"' : "'") };
    }
    // Expressão (ex.: `1243 / 1265`): troca pelo valor.
    return { start: node.getStart(sf), end: node.getEnd(), text: literal(value) };
  }

  const [key, ...rest] = path;

  if (ts.isObjectLiteralExpression(node)) {
    for (const p of node.properties) {
      if (ts.isPropertyAssignment(p) && propName(p.name) === key) return resolve(sf, p.initializer, rest, value, depth + 1);
      if (ts.isShorthandPropertyAssignment(p) && p.name.text === key) {
        const init = findConst(sf, p.name.text);
        if (init) return resolve(sf, init, rest, value, depth + 1);
      }
    }
    // Ausente (vem de um spread ou não existia): acrescenta só aqui.
    const spread = node.properties.find(ts.isSpreadAssignment);
    const valueText = rest.length
      ? spread
        ? spreadOverride(`${spread.expression.getText(sf)}.${key}`, rest, value)
        : nestedLiteral(rest, value)
      : literal(value);
    return insertProperty(sf, node, key, valueText);
  }

  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 'forAllTypes') {
    if (!CARD_TYPES.has(key) || !node.arguments[0]) throw new Error(`forAllTypes sem o tipo no caminho (${key})`);
    return resolve(sf, node.arguments[0], rest, value, depth + 1);
  }

  if (ts.isIdentifier(node)) {
    const init = findConst(sf, node.text);
    if (init) return resolve(sf, init, path, value, depth + 1);
  }

  // Valor importado ou calculado: troca por um objeto que sobrescreve só o campo.
  return { start: node.getStart(sf), end: node.getEnd(), text: spreadOverride(node.getText(sf), path, value) };
}

/** O objeto exportado do arquivo (`export const X: Tipo = { ... }`). */
function mainExport(sf: ts.SourceFile): ts.Expression {
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st) || !st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
    for (const d of st.declarationList.declarations) {
      if (d.initializer && ts.isObjectLiteralExpression(unwrap(d.initializer))) return d.initializer;
    }
  }
  throw new Error('Arquivo sem objeto exportado');
}

/** Aspas mais usadas no arquivo. */
function detectQuote(text: string): string {
  return (text.match(/"/g)?.length ?? 0) > (text.match(/'/g)?.length ?? 0) ? '"' : "'";
}

/** Aplica as edições ao objeto que `root` acha no arquivo, uma por vez (cada uma relê o arquivo). */
function applyEdits(source: string, edits: CardLayoutEdit[], root: (sf: ts.SourceFile) => ts.Expression): string {
  let text = source;
  fileQuote = detectQuote(source);
  try {
    for (const edit of edits) {
      const sf = ts.createSourceFile('config.ts', text, ts.ScriptTarget.Latest, true);
      const r = edit.value === null ? removeAt(sf, root(sf), edit.path) : resolve(sf, root(sf), edit.path, edit.value);
      if (r) text = text.slice(0, r.start) + r.text + text.slice(r.end);
    }
  } finally {
    fileQuote = "'";
  }
  return text;
}

/** Aplica as edições ao objeto exportado do arquivo (configuração de layout ou de ícone). */
export function applyConfigEdits(source: string, edits: ConfigEdit[]): string {
  return applyEdits(source, edits, mainExport);
}

/** Edição do bloco `layout` de uma carta; `null` tira o campo (volta ao padrão). */
export interface CardLayoutEdit {
  path: string[];
  value: ConfigValue | null;
}

/**
 * Aplica as edições ao `layout` da carta `cardId` num arquivo de coleção (src/data/sets/), ex.:
 * `{ path: ['icons', 'attribute'], value: '03-02' }`. Erro se a carta ou o `layout` dela não estiverem no arquivo.
 */
export function applyCardLayoutEdits(source: string, cardId: string, edits: CardLayoutEdit[]): string {
  return applyEdits(source, edits, (sf) => {
    let found: ts.Expression | undefined;
    const visit = (node: ts.Node) => {
      if (found) return;
      if (ts.isObjectLiteralExpression(node)) {
        const id = node.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === 'id');
        if (id && ts.isPropertyAssignment(id) && ts.isStringLiteral(id.initializer) && id.initializer.text === cardId) {
          const layout = node.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === 'layout');
          if (!layout || !ts.isPropertyAssignment(layout)) throw new Error(`Carta sem layout: ${cardId}`);
          found = layout.initializer;
          return;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    if (!found) throw new Error(`Carta não encontrada: ${cardId}`);
    return found;
  });
}

/** Tira o campo do caminho (com a vírgula dele); nada se ele não existir. */
function removeAt(sf: ts.SourceFile, node: ts.Expression, path: string[]): Replacement | null {
  node = unwrap(node);
  if (!ts.isObjectLiteralExpression(node)) return null;
  const [key, ...rest] = path;
  const prop = node.properties.find((p) => ts.isPropertyAssignment(p) && propName(p.name) === key);
  if (!prop || !ts.isPropertyAssignment(prop)) return null;
  if (rest.length) return removeAt(sf, prop.initializer, rest);
  const text = sf.text;
  let start = prop.getStart(sf);
  let end = prop.getEnd();
  const after = /^\s*,/.exec(text.slice(end));
  if (after) end += after[0].length;
  // Linha só com o campo: tira a linha inteira.
  const lineStart = text.lastIndexOf('\n', start) + 1;
  if (/^[ \t]*$/.test(text.slice(lineStart, start))) {
    const lineEnd = text.indexOf('\n', end);
    if (lineEnd >= 0 && /^[ \t\r]*$/.test(text.slice(end, lineEnd))) {
      start = lineStart;
      end = lineEnd + 1;
    }
  } else if (!after) {
    // Último campo de uma linha: tira a vírgula de antes.
    const before = /,\s*$/.exec(text.slice(0, start));
    if (before) start -= before[0].length;
  }
  return { start, end, text: '' };
}

// ── Arquivos ──────────────────────────────────────────────────────────────────

/** Alvo de uma edição: um layout ou um ícone (grupo + id, como nos registros de icons/index.ts). */
export type ConfigTarget =
  | { kind: 'layout'; id: string }
  | { kind: 'icon'; group: 'type' | 'type-variant' | 'element' | 'cost' | 'chakra' | 'attribute'; id: string };

const SAFE_ID = /^[a-z0-9-]+$/;

/** Arquivo do alvo, relativo a src/lib/cardMaker/. */
export function configFile(target: ConfigTarget): string {
  if (!SAFE_ID.test(target.id)) throw new Error(`Id inválido: ${target.id}`);
  if (target.kind === 'layout') {
    const m = /^layout-(\d\d)$/.exec(target.id);
    if (!m) throw new Error(`Layout inválido: ${target.id}`);
    return `layouts/layout${m[1]}.ts`;
  }
  switch (target.group) {
    case 'type':
      return `icons/type/${target.id}.ts`;
    case 'type-variant':
      return `icons/type/${target.id}.ts`;
    case 'element':
      return `icons/element/${target.id}.ts`;
    case 'cost':
      return `icons/cost/${target.id}.ts`;
    case 'chakra':
      return 'icons/cost/chakra-any.ts';
    case 'attribute':
      return `icons/combat-attributes/${target.id}.ts`;
  }
}
