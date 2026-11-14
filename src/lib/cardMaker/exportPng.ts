/**
 * Converte a carta montada (HTML) em PNG, sem dependências: clona o elemento com os estilos
 * computados, embute imagens e fontes como data URL, põe tudo num SVG com `<foreignObject>` e
 * desenha num canvas. Só roda no navegador.
 */

const XHTML = 'http://www.w3.org/1999/xhtml';

const dataUrlCache = new Map<string, Promise<string>>();

/** Baixa um recurso (mesma origem ou data URL) e devolve como data URL. */
function toDataUrl(url: string): Promise<string> {
  if (url.startsWith('data:')) return Promise.resolve(url);
  let cached = dataUrlCache.get(url);
  if (!cached) {
    cached = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao baixar ${url}`);
        return res.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          }),
      );
    dataUrlCache.set(url, cached);
    cached.catch(() => dataUrlCache.delete(url));
  }
  return cached;
}

const URL_RE = /url\((['"]?)([^'")]+)\1\)/g;

/** Troca os `url(...)` externos de um valor CSS por data URLs (os `url(#id)` ficam como estão). */
async function inlineCssUrls(value: string, base: string): Promise<string> {
  const urls = [...value.matchAll(URL_RE)].map((m) => m[2]).filter((u) => !u.startsWith('#') && !u.startsWith('data:'));
  if (!urls.length) return value;
  const map = new Map<string, string>();
  await Promise.all(urls.map(async (u) => map.set(u, await toDataUrl(new URL(u, base).href))));
  return value.replace(URL_RE, (all, _q, u: string) => (map.has(u) ? `url("${map.get(u)}")` : all));
}

/** Copia os estilos computados de cada elemento para o clone e embute as imagens. */
async function inlineTree(source: Element, clone: Element, families: Set<string>, jobs: Promise<unknown>[]) {
  const computed = getComputedStyle(source);
  const style = (clone as HTMLElement | SVGElement).style;
  if (style) {
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      const value = computed.getPropertyValue(prop);
      if (value.includes('url(') && !/url\(\s*['"]?#/.test(value)) {
        jobs.push(inlineCssUrls(value, location.href).then((v) => style.setProperty(prop, v)));
      } else {
        style.setProperty(prop, value, computed.getPropertyPriority(prop));
      }
    }
    for (const family of computed.fontFamily.split(',')) families.add(family.trim().replace(/^['"]|['"]$/g, ''));
  }
  if (source instanceof HTMLImageElement && clone instanceof HTMLImageElement) {
    clone.removeAttribute('srcset');
    const src = source.currentSrc || source.src;
    if (src) jobs.push(toDataUrl(src).then((data) => (clone.src = data)));
  }
  if (source instanceof SVGImageElement) {
    const href = source.href.baseVal;
    if (href) jobs.push(toDataUrl(new URL(href, location.href).href).then((data) => clone.setAttribute('href', data)));
  }
  const children = source.children;
  const cloned = clone.children;
  for (let i = 0; i < children.length; i++) await inlineTree(children[i], cloned[i], families, jobs);
}

/** Regras `@font-face` das fontes usadas pela carta, com os arquivos embutidos. */
async function fontFaces(families: Set<string>): Promise<string> {
  const rules: Promise<string>[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let cssRules: CSSRuleList;
    try {
      cssRules = sheet.cssRules;
    } catch {
      continue; // folha de outra origem
    }
    for (const rule of Array.from(cssRules)) {
      if (!(rule instanceof CSSFontFaceRule)) continue;
      const family = rule.style.getPropertyValue('font-family').trim().replace(/^['"]|['"]$/g, '');
      if (!families.has(family)) continue;
      rules.push(inlineCssUrls(rule.cssText, sheet.href ?? location.href));
    }
  }
  return (await Promise.all(rules)).join('\n');
}

/** Espera as fontes e as imagens do elemento terminarem de carregar. */
async function ready(node: Element) {
  await document.fonts.ready;
  await Promise.all(
    Array.from(node.querySelectorAll('img')).map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))),
  );
  // Um quadro a mais para os ajustes de layout (texto que encolhe para caber, tamanho da arte).
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

/** Desenha o elemento num PNG com `scale` vezes o tamanho dele na tela. */
export async function elementToPng(node: HTMLElement, scale = 1): Promise<Blob> {
  await ready(node);
  const { width, height } = node.getBoundingClientRect();
  const clone = node.cloneNode(true) as HTMLElement;
  const families = new Set<string>();
  const jobs: Promise<unknown>[] = [];
  await inlineTree(node, clone, families, jobs);
  await Promise.all(jobs);
  clone.style.margin = '0';

  const wrapper = document.createElementNS(XHTML, 'div');
  const fonts = document.createElementNS(XHTML, 'style');
  fonts.textContent = await fontFaces(families);
  wrapper.append(fonts, clone);
  const html = new XMLSerializer().serializeToString(wrapper);

  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${width} ${height}">` +
    `<foreignObject x="0" y="0" width="${width}" height="${height}">${html}</foreignObject></svg>`;

  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Não foi possível gerar o PNG.'))), 'image/png'),
  );
}

/** Nome de arquivo a partir do nome da carta. */
export function pngFileName(name: string): string {
  const slug = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return `${slug || 'carta'}.png`;
}

/** Baixa um Blob como arquivo. */
export function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
