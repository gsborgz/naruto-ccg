'use client';

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { CARD_H, CARD_W, cardLayout } from '@/lib/cardMaker/layouts';
import type { CustomCard } from '@/lib/cardMaker/model';
import { CardRender } from './CardRender';
import { getAt, layoutHandles, round, type Drive, type Handle } from './layoutEditing';

/**
 * Ajuste das posições só nesta carta (criador, **Ajustar posições**): as mesmas caixas do editor de layouts, mas o que
 * muda vai para `CustomCard.layoutOverrides`, e não para o layout (que vale para todas as cartas).
 * Arrastar move; o canto muda o tamanho; Shift: um eixo só; setas movem a caixa selecionada (Shift = 10, Alt = 0,1).
 */
export function CardPositionEditor({
  card,
  width,
  referenceOpacity = 0,
  only,
  onChange,
}: {
  card: CustomCard;
  width: number;
  referenceOpacity?: number;
  /** Só estas caixas (ids de `layoutHandles`, ex.: `textBox`); sem valor, todas. */
  only?: readonly string[];
  onChange: (update: (card: CustomCard) => CustomCard) => void;
}) {
  const spec = cardLayout(card);
  const handles = layoutHandles(spec, card).filter((h) => !only || only.includes(h.id));
  const [selected, setSelected] = useState<string | null>(null);
  const selectedHandle = handles.find((h) => h.id === selected);
  const scale = width / CARD_W;
  const drag = useRef<{ drives: Drive[]; start: { x: number; y: number }; orig: number[] } | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const valueOf = (h: Handle, d: Drive) => Number(getAt(h.root, d.path)) || 0;
  const write = (values: [Drive, number][]) =>
    onChangeRef.current((c) => {
      const overrides = { ...c.layoutOverrides };
      for (const [d, v] of values) overrides[d.path.join('.')] = round(v, d.k);
      return { ...c, layoutOverrides: overrides };
    });

  const startDrag = (e: ReactPointerEvent, h: Handle, drives: Drive[]) => {
    e.stopPropagation();
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    setSelected(h.id);
    drag.current = { drives, start: { x: e.clientX, y: e.clientY }, orig: drives.map((d) => valueOf(h, d)) };
  };
  const onDragMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const delta = { x: (e.clientX - d.start.x) / scale, y: (e.clientY - d.start.y) / scale };
    if (e.shiftKey) {
      if (Math.abs(delta.x) > Math.abs(delta.y)) delta.y = 0;
      else delta.x = 0;
    }
    write(d.drives.map((drive, i) => [drive, d.orig[i] + delta[drive.axis] * drive.k]));
  };
  const endDrag = () => (drag.current = null);

  useEffect(() => {
    if (!selectedHandle) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, textarea')) return;
      const dir = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, number[]>)[e.key];
      if (!dir) return;
      e.preventDefault();
      const step = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
      const delta = { x: dir[0] * step, y: dir[1] * step };
      write(selectedHandle.move.filter((d) => delta[d.axis]).map((d) => [d, valueOf(selectedHandle, d) + delta[d.axis] * d.k]));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHandle]);

  // Remonta a carta quando muda o estilo dos textos (o ajuste do tamanho do texto só roda ao montar).
  const t = card.type;
  const fitKey = JSON.stringify([spec.id, spec.name[t], spec.characteristics, spec.textBox[t], spec.flavor[t]]);

  return (
    <div className="relative mx-auto shrink-0 select-none" style={{ width, height: width * (CARD_H / CARD_W) }} onClick={() => setSelected(null)}>
      <CardRender key={fitKey} card={card} width={width} referenceOpacity={referenceOpacity} className="shadow-2xl" />
      <div className="absolute inset-0" style={{ touchAction: 'none' }} onPointerMove={onDragMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
        {handles.map((h) => {
          const on = h.id === selected;
          return (
            <div
              key={h.id}
              title={h.label}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => startDrag(e, h, h.move)}
              className={`absolute cursor-move ${on ? 'z-20 bg-accent/10 outline-2 outline-accent' : 'outline-1 outline-sky-400/80 hover:bg-sky-400/10'} ${h.dashed ? 'outline-dashed' : 'outline'}`}
              style={{ left: h.box.x * scale, top: h.box.y * scale, width: h.box.w * scale, height: h.box.h * scale }}
            >
              {on && (
                <span className="pointer-events-none absolute -top-5 left-0 whitespace-nowrap rounded bg-accent px-1 text-[10px] font-semibold text-bg">
                  {h.label}
                </span>
              )}
              {h.resize && (
                <span
                  onPointerDown={(e) => startDrag(e, h, h.resize!)}
                  className="absolute -right-1.5 -bottom-1.5 h-3 w-3 cursor-nwse-resize rounded-sm bg-accent ring-1 ring-bg"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Quantos campos do layout a carta ajustou (só os que ainda existem no layout dela). */
export function overrideCount(card: CustomCard): number {
  return Object.keys(card.layoutOverrides ?? {}).length;
}
