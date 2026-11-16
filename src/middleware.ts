import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, LOGIN_PATH, accessToken, getSitePassword, sameToken } from '@/lib/sitePassword';

/** Exige a senha do site (env `SITE_PASSWORD`) em todas as páginas e APIs, menos o login. */
export async function middleware(request: NextRequest) {
  const password = getSitePassword();
  if (!password) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname === LOGIN_PATH || pathname === '/api/entrar') return NextResponse.next();

  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  if (cookie && sameToken(cookie, await accessToken(password))) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ message: 'Senha necessária' }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = LOGIN_PATH;
  url.search = pathname === '/' && !search ? '' : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Arquivos estáticos (imagens das cartas, molduras, ícones) ficam de fora: são públicos e muitos.
  matcher: ['/((?!_next/static|_next/image|cards/|card-layouts/|textures/|icon\\.svg|favicon\\.ico).*)'],
};
