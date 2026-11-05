import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Naruto CCG',
  description: 'Monte seus decks de Naruto CCG e jogue com os amigos no navegador.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur">
          <nav className="flex h-14 items-center gap-6 px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid size-8 place-items-center rounded-full bg-accent text-lg text-bg">忍</span>
              <span>Naruto CCG</span>
            </Link>
            <div className="flex gap-4 text-sm text-muted">
              <Link href="/" className="hover:text-text">
                Meus decks
              </Link>
              <Link href="/cards" className="hover:text-text">
                Cartas
              </Link>
            </div>
          </nav>
        </header>
        <main className="px-4 py-6 lg:px-6">{children}</main>
      </body>
    </html>
  );
}
