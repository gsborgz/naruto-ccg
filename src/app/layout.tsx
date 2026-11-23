import type { Metadata } from 'next';
import Link from 'next/link';
import { ChunkReloader } from '@/components/ChunkReloader';
import { FullscreenWatcher } from '@/components/FullscreenWatcher';
import { NavLinks } from '@/components/NavLinks';
import { ContentProvider } from '@/lib/content/ContentProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naruto CCG',
  description: 'Monte seus decks de Naruto CCG e jogue com os amigos no navegador.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">
          <FullscreenWatcher />
          <ChunkReloader />
          <header className="app-header sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
            <nav className="relative flex h-14 items-center gap-3 px-4 sm:gap-6 lg:px-6">
              <Link href="/" className="flex shrink-0 items-center gap-2 font-bold tracking-tight" aria-label="Naruto CCG">
                <span className="grid size-8 place-items-center rounded-full bg-accent text-lg text-bg">忍</span>
                <span className="max-sm:hidden">Naruto CCG</span>
              </Link>
              <NavLinks />
              {/* Espaços que as páginas preenchem com <HeaderSlot> (ex.: jogadores e botões da partida). */}
              <div id="app-header-center" className="absolute left-1/2 hidden -translate-x-1/2 lg:block" />
              <div id="app-header-actions" className="ml-auto flex items-center gap-2" />
            </nav>
          </header>
          <main className="app-main px-4 py-6 lg:px-6">
            {/* Cartas, layouts e ícones vêm do Redis: as telas só aparecem depois de carregá-los. */}
            <ContentProvider>{children}</ContentProvider>
          </main>
      </body>
    </html>
  );
}
