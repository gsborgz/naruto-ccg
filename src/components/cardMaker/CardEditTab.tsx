'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { uploadArt } from '@/lib/cardMaker/artUpload';
import { catalogDraft, toCatalogCard } from '@/lib/cardMaker/catalogEdit';
import { moveArt, type ArtLayer, type CustomCard, type CustomCardArt } from '@/lib/cardMaker/model';
import { compressImage, isCompressed } from '@/lib/images/compressImage';
import { saveCatalogCard } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import type { Card } from '@/models/card';
import { CardEditor } from './CardEditor';
import { CardRender } from './CardRender';
import { ContentHistoryButton } from './ContentTools';

/**
 * Aba Editar do detalhe da carta: tudo o que o criador de cartas tem (layout, design, ícones, nome, textos, frase,
 * custos, força, atributo, vilas, artes e enquadramento), numa carta do catálogo. Grava no conteúdo do jogo (Redis):
 * vale para todo mundo na hora, sem deploy. Os textos são os do conteúdo (PT-BR). O layout base (molduras, posições)
 * e os ícones em si são editados em Criar carta → Editar layouts.
 */

/** Envia ao Vercel Blob a camada de arte que ainda é imagem local (data URL). */
async function uploadLayer(art: CustomCardArt | undefined, transparent: boolean): Promise<CustomCardArt | undefined> {
  if (!art?.src?.startsWith('data:')) return art;
  const data = isCompressed(art.src) ? art.src : await compressImage(art.src, { transparent });
  return { ...art, src: await uploadArt(data) };
}

export default function CardEditTab({
  card,
  header,
  onDirtyChange,
}: {
  card: Card;
  header: ReactNode;
  /** Avisa o detalhe quando há alterações não salvas (para perguntar antes de fechar ou trocar de aba). */
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const content = useContent();
  const initial = useMemo(() => catalogDraft(card), [card]);
  const [draft, setDraft] = useState<CustomCard>(initial);
  const [artLayer, setArtLayer] = useState<ArtLayer>('back');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [refOpacity, setRefOpacity] = useState(0);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  useEffect(() => onDirtyChange?.(dirty), [dirty, onDirtyChange]);
  // Carta gravada (nova versão do conteúdo): o rascunho recomeça dela.
  useEffect(() => setDraft(initial), [initial]);

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const art = (await uploadLayer(draft.art, false)) ?? draft.art;
      const artFront = await uploadLayer(draft.artFront, true);
      const sent: CustomCard = { ...draft, art, ...(artFront && { artFront }) };
      const { version } = await saveCatalogCard(toCatalogCard(card, sent));
      content.saved(version);
      setStatus({ ok: true, text: 'Carta salva para todo mundo.' });
    } catch (e) {
      setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      <div className="mx-auto flex w-full max-w-xs flex-col gap-2 self-start sm:sticky sm:top-4 sm:max-w-none">
        <div ref={ref} className="w-full">
          {width > 0 && (
            <CardRender
              card={draft}
              width={width}
              referenceOpacity={refOpacity}
              onArtMove={(dx, dy) => setDraft((d) => moveArt(d, artLayer, dx, dy))}
              className="rounded-lg shadow-xl"
            />
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          Original por cima
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={refOpacity}
            onChange={(e) => setRefOpacity(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--color-accent)]"
          />
          {Math.round(refOpacity * 100)}%
        </label>
        <p className="text-xs text-muted">Arraste a arte na carta para enquadrar.</p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {header}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{dirty ? 'Alterações não salvas' : 'Sem alterações'}</span>
          <ContentHistoryButton kind="card" id={card.id} />
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={() => setDraft(initial)}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger disabled:opacity-50"
            >
              Descartar
            </button>
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={save}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </span>
        </div>
        {status && <p className={`text-xs ${status.ok ? 'text-ok' : 'text-danger'}`}>{status.text}</p>}
        <p className="text-xs text-muted">
          As molduras, as posições e os ícones em si são de todas as cartas do layout:{' '}
          <Link href={`/criar/layouts?layout=${draft.layout}&carta=${card.id}`} className="text-accent hover:underline">
            editar o layout
          </Link>
          .
        </p>
        <CardEditor card={draft} onChange={setDraft} artLayer={artLayer} onArtLayerChange={setArtLayer} />
      </div>
    </div>
  );
}
