import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, ACCESS_COOKIE_MAX_AGE, accessToken, getSitePassword, sameToken } from '@/lib/sitePassword';

/** Confere a senha do site e grava o cookie de acesso (1 ano). */
export async function POST(request: NextRequest) {
  const password = getSitePassword();
  if (!password) return NextResponse.json({ ok: true });

  let typed = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === 'string') typed = body.password;
  } catch {
    return NextResponse.json({ message: 'JSON inválido' }, { status: 400 });
  }

  const expected = await accessToken(password);
  if (!sameToken(await accessToken(typed), expected)) {
    // Pequena pausa para atrasar tentativas em sequência.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return NextResponse.json({ message: 'Senha incorreta' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE, expected, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ACCESS_COOKIE_MAX_AGE,
  });
  return response;
}
