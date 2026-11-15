'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CardRender } from '@/components/cardMaker/CardRender';
import { CARDS_BY_ID } from '@/data/cards';
import { fromCatalogCard, type LayoutId } from '@/lib/cardMaker/model';

/** Cartas do S10 usadas como exemplo do layout 1 (card-layouts/examples/layout-01). */
const DEFAULT_IDS = ['s10-n-us098', 's10-j-us078', 's10-m-us087', 's10-n-us101'];

/**
 * Calibração do mapa do layout (`/criar/calibrar?ids=s10-n-us098,...`): a carta montada pelo criador,
 * a imagem original e as duas sobrepostas, para conferir a posição de cada elemento. Cartas escaneadas
 * (`card.layout`) vêm com as artes extraídas (ex.: `?ids=s01-n-001,s01-j-001`).
 */
function Calibration() {
  const params = useSearchParams();
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? DEFAULT_IDS;
  const width = Number(params.get('w')) || 360;
  // Sem `layout`: o da carta (cartas escaneadas, com as artes) ou o layout 1.
  const layout = (params.get('layout') ?? undefined) as LayoutId | undefined;
  const now = '2026-01-01T00:00:00.000Z';

  return (
    <div className="flex flex-col gap-8">
      {ids.map((id) => {
        const source = CARDS_BY_ID.get(id);
        if (!source) return <p key={id}>Carta não encontrada: {id}</p>;
        const card = fromCatalogCard(source, now, layout);
        return (
          <div key={id} className="flex flex-wrap gap-4">
            <CardRender card={card} width={width} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={card.reference} alt="" style={{ width, height: width * 1.4 }} />
            <CardRender card={card} width={width} referenceOpacity={0.5} />
          </div>
        );
      })}
    </div>
  );
}

export default function CalibrationPage() {
  return (
    <Suspense>
      <Calibration />
    </Suspense>
  );
}
