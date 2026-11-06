'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Renderiza `children` num dos espaços do cabeçalho global (layout.tsx): `center` (meio da barra)
 * ou `actions` (extrema direita). O cabeçalho some em tela cheia — quem usa isto para controles
 * importantes deve oferecer uma alternativa com a classe `fullscreen-only` (globals.css).
 */
export function HeaderSlot({ name, children }: { name: 'center' | 'actions'; children: React.ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.getElementById(`app-header-${name}`)), [name]);
  return target ? createPortal(children, target) : null;
}
