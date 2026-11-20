'use client';

import { useEffect, useState } from 'react';
import type { Card } from '@/models/card';
import { ArenaCardImage } from './arenaCards';
import styles from './GameArena.module.css';

/** Carta sob o mouse (e onde o mouse está), para a ampliação com Alt. */
export interface HoveredCard {
  card: Card;
  clientX: number;
  /** Amplia sem precisar do Alt (ex.: nome da carta no registro de jogo). */
  always?: boolean;
}

/** Alt pressionado agora? (Soltar fora da janela também conta: perder o foco zera.) */
export function useAltKey(): boolean {
  const [alt, setAlt] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Alt') return;
      e.preventDefault(); // no Windows, soltar o Alt sozinho ativaria o menu do navegador
      setAlt(e.type === 'keydown');
    };
    const move = (e: MouseEvent) => setAlt(e.altKey);
    const reset = () => setAlt(false);
    window.addEventListener('keydown', key);
    window.addEventListener('keyup', key);
    window.addEventListener('mousemove', move);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', key);
      window.removeEventListener('keyup', key);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('blur', reset);
    };
  }, []);
  return alt;
}

/**
 * Alt + mouse sobre uma carta (ou só o mouse, com `always`): a carta ampliada, do lado oposto ao mouse. Fica fixa na janela (fora da
 * escala do palco); dentro de um <dialog> modal, renderize-a dentro dele para ficar por cima do diálogo.
 */
export function CardZoom({ hovered }: { hovered: HoveredCard | null }) {
  const alt = useAltKey();
  const nameOf = (c: { name: string }) => c.name;
  if (!hovered || !(alt || hovered.always)) return null;
  return (
    <ArenaCardImage
      card={hovered.card}
      size="full"
      lazy={false}
      alt={nameOf(hovered.card)}
      className={`${styles.zoom} ${hovered.clientX < window.innerWidth / 2 ? styles.zoomRight : styles.zoomLeft}`}
    />
  );
}
