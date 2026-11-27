'use client';

import { useState } from 'react';
import { DEFAULT_BACK } from '@/lib/sleeves/types';

/**
 * Imagem de um verso de carta: o sleeve ou, sem sleeve ou se a imagem dele não carregar (excluída, fora do ar), o
 * verso padrão do Naruto CCG.
 */
export function SleeveImage({ src, className }: { src: string | null | undefined; className?: string }) {
  // Endereço que falhou: enquanto `src` for ele, mostra o padrão.
  const [failed, setFailed] = useState<string | null>(null);
  const shown = src && src !== failed ? src : DEFAULT_BACK;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagem do Blob ou do site
    <img src={shown} alt="" className={className} onError={() => shown !== DEFAULT_BACK && setFailed(shown)} />
  );
}
