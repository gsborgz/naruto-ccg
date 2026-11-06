'use client';

import { useEffect } from 'react';

/**
 * Marca `<html data-fullscreen>` quando a janela ocupa a tela inteira (F11 ou Fullscreen API).
 * O CSS (globals.css) usa isso para esconder o cabeçalho e dar a altura toda às telas de jogo.
 * Complementa o `@media (display-mode: fullscreen)`, que nem todo navegador aplica ao F11.
 */
export function FullscreenWatcher() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const fillsScreen =
        Math.abs(window.innerHeight - window.screen.height) <= 1 &&
        Math.abs(window.innerWidth - window.screen.width) <= 1;
      root.toggleAttribute('data-fullscreen', !!document.fullscreenElement || fillsScreen);
    };
    update();
    window.addEventListener('resize', update);
    document.addEventListener('fullscreenchange', update);
    return () => {
      window.removeEventListener('resize', update);
      document.removeEventListener('fullscreenchange', update);
      root.removeAttribute('data-fullscreen');
    };
  }, []);
  return null;
}
