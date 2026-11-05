'use client';

import { useState } from 'react';
import { CardBrowser } from '@/components/CardBrowser';
import { CardDetailModal } from '@/components/CardDetailModal';
import type { Card } from '@/models/card';

export default function CardsPage() {
  const [selected, setSelected] = useState<Card | null>(null);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Cartas disponíveis</h1>
        <p className="text-sm text-muted">Clique em uma carta para ver os detalhes.</p>
      </div>
      <CardBrowser onSelect={setSelected} />
      <CardDetailModal card={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
