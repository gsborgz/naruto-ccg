'use client';

import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { uploadArt } from '@/lib/cardMaker/artUpload';
import { catalogDraft, toCatalogCard, withoutLayout } from '@/lib/cardMaker/catalogEdit';
import { LAYOUT_LIST } from '@/lib/cardMaker/layouts';
import { moveArt, type ArtLayer, type CustomCard, type CustomCardArt, type LayoutId } from '@/lib/cardMaker/model';
import { compressImage, isCompressed } from '@/lib/images/compressImage';
import { saveCatalogCard } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import type { Card } from '@/models/card';
import { CardFace } from '../CardFace';
import { CardEditor } from './CardEditor';
import { CardRender } from './CardRender';
import { ContentHistoryButton } from './ContentTools';

/**
 * Aba Editar do detalhe da carta: tudo o que o criador de cartas tem (layout, design, ícones, nome, textos, frase,
 * custos, força, atributo, vilas, artes e enquadramento), numa carta do catálogo. Grava no conteúdo do jogo (Redis):
 * vale para todo mundo na hora, sem deploy. Os textos são os do conteúdo (PT-BR). O layout base (molduras, posições)
 * e os ícones em si são editados em Criar carta → Editar layouts.
 *
 * A carta sem `layout` mostra a imagem impressa: a aba pede um layout para começar a montar a carta. Com layout,
 * **Voltar para a original** tira o `layout` (a carta volta a mostrar a impressa).
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
  // `null`: a carta sem layout (a imagem impressa).
  const initial = useMemo(() => (card.layout ? catalogDraft(card) : null), [card]);
  const [draft, setDraft] = useState<CustomCard | null>(initial);
  const layoutChoices = LAYOUT_LIST.filter((l) => l.types.includes(card.type));
  const [chosenLayout, setChosenLayout] = useState<LayoutId | ''>('');
  /** Começa a montar a carta no layout escolhido (o mesmo que ela tinha: volta ao que estava gravado). */
  const applyLayout = (id: LayoutId) =>
    setDraft(card.layout?.layout === id ? catalogDraft(card) : catalogDraft(withoutLayout(card), id));
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
      let next = withoutLayout(card);
      if (draft) {
        const art = (await uploadLayer(draft.art, false)) ?? draft.art;
        const artFront = await uploadLayer(draft.artFront, true);
        next = toCatalogCard(card, { ...draft, art, ...(artFront && { artFront }) });
      }
      const { version } = await saveCatalogCard(next);
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
          {!draft && <CardFace card={card} size="full" className="rounded-lg shadow-xl" />}
          {draft && width > 0 && (
            <CardRender
              card={draft}
              width={width}
              referenceOpacity={refOpacity}
              onArtMove={(dx, dy) => setDraft((d) => d && moveArt(d, artLayer, dx, dy))}
              className="rounded-lg shadow-xl"
            />
          )}
        </div>
        {draft && (
          <>
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
          </>
        )}
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
        {draft ? (
          <>
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
              <p className="min-w-0 flex-1 text-xs text-muted">As molduras, as posições e os ícones em si valem para todas as cartas do layout.</p>
              <Link
                href={`/criar/layouts?layout=${draft.layout}&carta=${card.id}`}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-accent ring-1 ring-accent/50 hover:bg-accent/10"
              >
                Editar layout
              </Link>
              <button
                type="button"
                onClick={() => setDraft(null)}
                title="Tira o layout da carta: ela volta a mostrar a imagem impressa (vale ao salvar)."
                className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface hover:text-danger"
              >
                Voltar para a original
              </button>
            </div>
            <CardEditor card={draft} onChange={setDraft} artLayer={artLayer} onArtLayerChange={setArtLayer} />
          </>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg bg-surface-2 p-4">
            <p className="text-sm">
              Esta carta mostra a <strong>imagem original</strong>. Escolha um layout para montá-la: a impressa fica de
              fundo e dá para trocar a arte, os ícones e os textos.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Layout"
                value={chosenLayout}
                onChange={(e) => setChosenLayout(e.target.value as LayoutId | '')}
                className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm"
              >
                <option value="">Escolha um layout…</option>
                {layoutChoices.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!chosenLayout}
                onClick={() => chosenLayout && applyLayout(chosenLayout)}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
              >
                Aplicar layout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
