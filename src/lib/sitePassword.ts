/**
 * Senha de acesso ao site (env `SITE_PASSWORD`). Sem a variável, o site fica aberto.
 *
 * Depois de acertar a senha, o navegador guarda um cookie com o hash dela (`naruto-ccg-access`), válido
 * por 1 ano. Trocar a senha invalida os cookies antigos e todos precisam digitar a nova.
 * Usa só Web Crypto, para rodar tanto no middleware quanto nas rotas.
 */

export const ACCESS_COOKIE = 'naruto-ccg-access';
export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const LOGIN_PATH = '/entrar';

export const getSitePassword = (): string | undefined => process.env.SITE_PASSWORD || undefined;

/** Valor do cookie para uma senha: SHA-256 em hexadecimal (a senha em si nunca vai para o navegador). */
export async function accessToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`naruto-ccg:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Comparação em tempo constante (para strings do mesmo tamanho). */
export function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Para onde voltar depois de entrar: só caminhos internos (evita redirecionar para outro site). */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/';
  if (next === LOGIN_PATH || next.startsWith(`${LOGIN_PATH}?`)) return '/';
  return next;
}
