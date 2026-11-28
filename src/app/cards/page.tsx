'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CardBrowser } from '@/components/CardBrowser';
import { CardDetailModal } from '@/components/CardDetailModal';
import { useCardCatalog } from '@/lib/useCardCatalog';
import { filtersFromSearchParams, filtersToSearchParams, type CardFilterState } from '@/lib/cardFilters';
import type { Card } from '@/models/card';

/** Grava os filtros na URL sem criar uma entrada no histórico a cada tecla. */
function writeFiltersToUrl(filters: CardFilterState) {
  const query = filtersToSearchParams(filters).toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(window.history.state, '', url);
  }
}

function CardsBrowser({ onSelect }: { onSelect: (card: Card) => void }) {
  const searchParams = useSearchParams();
  // Lidos só na montagem: depois disso o estado do CardBrowser é a fonte e a URL só acompanha.
  const [initialFilters] = useState(() => filtersFromSearchParams(searchParams));
  // O catálogo e as cartas criadas pelos jogadores (coleção "Cartas criadas"; as alters não entram).
  const { cards } = useCardCatalog();
  return (
    <CardBrowser cards={cards} onSelect={onSelect} initialFilters={initialFilters} onFiltersChange={writeFiltersToUrl} />
  );
}

export default function CardsPage() {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-3 md:gap-6">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">Cartas disponíveis</h1>
        <p className="text-sm text-muted max-md:hidden">Clique em uma carta para ver os detalhes.</p>
      </div>
      <Suspense>
        <CardsBrowser onSelect={setSelected} />
      </Suspense>
      <CardDetailModal card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
