'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type NavLink = { href: string; label: string; short: string; match: (path: string) => boolean };

/** Opções do menu **Cartas** (abre ao passar o mouse; no toque, o primeiro toque abre). */
const CARD_LINKS: Omit<NavLink, 'short'>[] = [
  { href: '/cards', label: 'Lista de Cartas', match: (p) => p.startsWith('/cards') },
  {
    href: '/criar',
    label: 'Criar Cartas',
    match: (p) => p.startsWith('/criar') && !p.startsWith('/criar/layouts'),
  },
  { href: '/criar/layouts', label: 'Criar Layouts', match: (p) => p.startsWith('/criar/layouts') },
];

/**
 * Links do cabeçalho; no celular usam o rótulo curto para caber numa linha. A página atual fica destacada. `null`
 * marca onde fica o menu **Cartas**.
 */
const LINKS: (NavLink | null)[] = [
  { href: '/', label: 'Meus decks', short: 'Decks', match: (p) => p === '/' || p.startsWith('/decks') },
  null,
  { href: '/temas', label: 'Temas', short: 'Temas', match: (p) => p.startsWith('/temas') },
  { href: '/jogar', label: 'Jogar', short: 'Jogar', match: (p) => p.startsWith('/jogar') || p.startsWith('/salas') },
];

const linkClass = (current: boolean) => (current ? 'font-semibold text-text' : 'hover:text-text');

export function NavLinks() {
  const pathname = usePathname() ?? '';
  return (
    <div className="flex min-w-0 items-center gap-3 text-sm whitespace-nowrap text-muted sm:gap-4">
      {LINKS.map((l) =>
        l ? (
          <Link key={l.href} href={l.href} aria-current={l.match(pathname) ? 'page' : undefined} className={linkClass(l.match(pathname))}>
            <span className="sm:hidden">{l.short}</span>
            <span className="max-sm:hidden">{l.label}</span>
          </Link>
        ) : (
          <CardsMenu key="cards" pathname={pathname} />
        ),
      )}
    </div>
  );
}

/**
 * **Cartas**: abre ao passar o mouse (e com o foco do teclado); clicar leva à lista. No toque não há "passar o mouse",
 * então o primeiro toque abre o menu e o segundo segue o link. Fecha ao sair, com Esc, ao tocar fora ou ao navegar.
 */
function CardsMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touch = useRef(false);
  const current = CARD_LINKS.some((l) => l.match(pathname));

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const show = () => {
    cancelClose();
    setOpen(true);
  };
  // Um respiro ao sair, para o mouse atravessar o vão entre o link e o menu.
  const hide = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => cancelClose, []);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={(e) => e.pointerType === 'mouse' && show()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && hide()}
      onFocus={show}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <Link
        href="/cards"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-current={current ? 'page' : undefined}
        className={`inline-flex items-center gap-1 ${linkClass(current)}`}
        onPointerDown={(e) => (touch.current = e.pointerType !== 'mouse')}
        onClick={(e) => {
          if (touch.current && !open) {
            e.preventDefault();
            show();
          }
        }}
      >
        Cartas
        <span aria-hidden className={`text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </Link>
      {open && (
        <div role="menu" className="absolute top-full left-0 z-40 pt-2">
          <div className="flex min-w-44 flex-col rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border">
            {CARD_LINKS.map((l) => {
              const here = l.match(pathname);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  role="menuitem"
                  aria-current={here ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 hover:bg-surface-2 hover:text-text ${here ? 'font-semibold text-text' : ''}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
