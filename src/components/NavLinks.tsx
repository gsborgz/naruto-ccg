'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/** Links do cabeçalho; no celular usam o rótulo curto para caber numa linha. A página atual fica destacada. */
const LINKS: { href: string; label: string; short: string; match: (path: string) => boolean }[] = [
  { href: '/', label: 'Meus decks', short: 'Decks', match: (p) => p === '/' || p.startsWith('/decks') },
  { href: '/cards', label: 'Cartas', short: 'Cartas', match: (p) => p.startsWith('/cards') },
  { href: '/criar', label: 'Criar carta', short: 'Criar', match: (p) => p.startsWith('/criar') && !p.startsWith('/criar/layouts') },
  { href: '/criar/layouts', label: 'Layouts', short: 'Layouts', match: (p) => p.startsWith('/criar/layouts') },
  { href: '/temas', label: 'Temas', short: 'Temas', match: (p) => p.startsWith('/temas') },
  { href: '/jogar', label: 'Jogar', short: 'Jogar', match: (p) => p.startsWith('/jogar') || p.startsWith('/salas') },
];

export function NavLinks() {
  const pathname = usePathname() ?? '';
  return (
    <div className="flex min-w-0 gap-3 overflow-x-auto text-sm whitespace-nowrap text-muted [scrollbar-width:none] sm:gap-4">
      {LINKS.map((l) => {
        const current = l.match(pathname);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={current ? 'page' : undefined}
            className={current ? 'font-semibold text-text' : 'hover:text-text'}
          >
            <span className="sm:hidden">{l.short}</span>
            <span className="max-sm:hidden">{l.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
