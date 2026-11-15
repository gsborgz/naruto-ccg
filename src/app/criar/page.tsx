'use client';

import { useEffect, useRef, useState } from 'react';
import { CardEditor } from '@/components/cardMaker/CardEditor';
import { CardRender } from '@/components/cardMaker/CardRender';
import { CARD_H, CARD_W } from '@/lib/cardMaker/layouts';
import { CatalogImportDialog, importCatalogCard } from '@/components/cardMaker/CatalogImportDialog';
import { CARDS_BY_ID } from '@/data/cards';
import { useCardLanguage } from '@/lib/cardLanguage';
import {
  moveArt,
  newCustomCard,
  withLayout,
  withLayoutIcons,
  type ArtLayer,
  type CustomCard,
  type LayoutId,
} from '@/lib/cardMaker/model';
import { customCardActions, useCustomCards } from '@/lib/cardMaker/store';
import { CARD_TYPE_LABEL } from '@/models/card';
import { elementToPng, pngFileName, saveBlob } from '@/lib/cardMaker/exportPng';

/** Tamanho disponível de um elemento (para a prévia acompanhar a coluna). */
function useSize<T extends HTMLElement>() {
  // Ref por callback: o elemento só aparece depois que as cartas carregam, então observa quando ele montar.
  const [el, ref] = useState<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [el]);
  return [ref, size] as const;
}

/** Espaço sob a prévia (comparar com a original, aviso e botões). */
const PREVIEW_CONTROLS = 110;

const button = 'rounded-lg px-4 py-2 font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text';

export default function CardMakerPage() {
  const cards = useCustomCards();
  const [draft, setDraft] = useState<CustomCard | null>(null);
  const [importing, setImporting] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [reference, setReference] = useState(0);
  // Camada que o arrastar move quando as duas camadas de arte não estão ligadas.
  const [artLayer, setArtLayer] = useState<ArtLayer>('back');
  // Baixar: monta a carta fora da tela no tamanho cheio (750×1050) e exporta em 2×.
  const [downloading, setDownloading] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [previewRef, { width: previewWidth }] = useSize<HTMLDivElement>();
  // Altura da área do editor: no desktop é a da tela, e a prévia (fixa) precisa caber nela.
  const [areaRef, { height: areaHeight }] = useSize<HTMLDivElement>();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Abre a carta mais recente ao carregar.
  useEffect(() => {
    if (cards && !draft && cards.length) setDraft(cards[0]);
  }, [cards, draft]);

  // Grava o rascunho logo depois de cada alteração (com folga para não regravar a cada pixel arrastado).
  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => setSaveFailed(!customCardActions.save(draft)), 300);
    return () => clearTimeout(timer);
  }, [draft]);

  // `/criar?importar=<id da carta>[&layout=layout-02]`: começa uma carta nova a partir de uma carta do catálogo
  // (sem `layout`: o da carta, se ela já foi escaneada, ou o layout 1).
  // Em PT-BR, espera as traduções carregarem para importar com os textos traduzidos.
  const { language, translations } = useCardLanguage();
  const translationsReady = language === 'en' || !!translations;
  const imported = useRef(false);
  useEffect(() => {
    if (!translationsReady) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('importar');
    const layout = (params.get('layout') ?? undefined) as LayoutId | undefined;
    if (!id || imported.current) return;
    imported.current = true;
    const source = CARDS_BY_ID.get(id);
    if (source) create(importCatalogCard(source, language, translations, layout));
    window.history.replaceState(null, '', '/criar');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translationsReady]);

  const open = (card: CustomCard) => {
    if (draft) customCardActions.save(draft);
    setDraft(card);
    setReference(0);
  };

  const create = (card: CustomCard) => {
    customCardActions.save(card);
    open(card);
  };

  const remove = () => {
    if (!draft || !confirm(`Excluir "${draft.name || 'carta sem nome'}"?`)) return;
    customCardActions.remove(draft.id);
    setDraft(cards?.find((c) => c.id !== draft.id) ?? null);
  };

  const duplicate = () => {
    if (!draft) return;
    const now = new Date().toISOString();
    create({ ...draft, id: crypto.randomUUID(), name: `${draft.name} (cópia)`, createdAt: now, updatedAt: now });
  };

  useEffect(() => {
    const node = exportRef.current?.firstElementChild;
    if (!downloading || !draft || !(node instanceof HTMLElement)) return;
    let cancelled = false;
    elementToPng(node, 2)
      .then((blob) => !cancelled && saveBlob(blob, pngFileName(draft.name)))
      .catch((error) => {
        console.error(error);
        if (!cancelled) setDownloadFailed(true);
      })
      .finally(() => !cancelled && setDownloading(false));
    return () => {
      cancelled = true;
    };
    // Só ao pedir o download: a carta não muda enquanto exporta (o botão fica desativado).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloading]);

  const fitHeight = desktop && areaHeight ? ((areaHeight - PREVIEW_CONTROLS) * CARD_W) / CARD_H : Infinity;
  const width = Math.max(200, Math.min(previewWidth || 420, 480, fitHeight));

  return (
    // No desktop a tela ocupa a altura toda (--app-chrome em globals.css): só a coluna da esquerda rola; a prévia fica fixa.
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:h-[calc(100dvh-var(--app-chrome))]">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Criar carta</h1>
          <p className="text-sm text-muted">Monte cartas nos layouts das coleções (escolha no formulário). Ficam salvas neste navegador.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setImporting(true)} className={button}>
            Importar do catálogo
          </button>
          <button
            type="button"
            onClick={() =>
              create(withLayoutIcons(withLayout(newCustomCard(draft?.type ?? 'ninja'), draft?.layout ?? 'layout-01')))
            }
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-strong"
          >
            Nova carta
          </button>
        </div>
      </div>

      {cards && !draft && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          Nenhuma carta ainda. Crie uma do zero ou parta de uma carta do catálogo.
        </p>
      )}

      {(draft || (cards && cards.length > 0)) && (
        <div ref={areaRef} className="grid min-h-0 flex-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:grid-rows-[minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-2">
            {draft && <CardEditor card={draft} onChange={setDraft} artLayer={artLayer} onArtLayerChange={setArtLayer} />}
            {cards && cards.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">Minhas cartas ({cards.length})</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
                  {cards.map((c) => {
                    const shown = c.id === draft?.id ? draft : c;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => open(c)}
                        className={`flex flex-col items-center gap-1 rounded-xl p-2 text-left ring-1 ${
                          c.id === draft?.id ? 'bg-surface-2 ring-accent' : 'ring-border hover:bg-surface'
                        }`}
                      >
                        <CardRender card={shown} width={128} />
                        <span className="w-full truncate text-center text-xs font-semibold">{shown.name || 'Sem nome'}</span>
                        <span className="text-[11px] text-muted">{CARD_TYPE_LABEL[shown.type]}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
          {draft && (
            <div className="flex flex-col gap-3">
              <div ref={previewRef} className="w-full">
                <CardRender
                  card={draft}
                  width={width}
                  referenceOpacity={reference}
                  onArtMove={(dx, dy) => setDraft((d) => d && moveArt(d, artLayer, dx, dy))}
                  className="mx-auto shadow-2xl"
                />
              </div>
              {draft.reference && (
                <label className="flex items-center gap-3 text-xs font-semibold text-muted">
                  Comparar com a original
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={reference}
                    onChange={(e) => setReference(Number(e.target.value))}
                    className="flex-1"
                  />
                </label>
              )}
              {saveFailed && (
                <p className="text-xs text-danger">
                  O navegador não tem espaço para salvar esta carta (a arte ocupa muito). Use uma imagem menor.
                </p>
              )}
              {downloadFailed && <p className="text-xs text-danger">Não foi possível gerar a imagem da carta.</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => {
                    setDownloadFailed(false);
                    setDownloading(true);
                  }}
                  className={`${button} text-sm disabled:opacity-50`}
                >
                  {downloading ? 'Gerando…' : 'Baixar PNG'}
                </button>
                <button type="button" onClick={duplicate} className={`${button} text-sm`}>
                  Duplicar
                </button>
                <button type="button" onClick={remove} className={`${button} text-sm hover:text-danger`}>
                  Excluir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {downloading && draft && (
        <div ref={exportRef} aria-hidden style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}>
          <CardRender card={draft} width={CARD_W} />
        </div>
      )}

      <CatalogImportDialog
        open={importing}
        layout={draft?.layout ?? 'layout-01'}
        onClose={() => setImporting(false)}
        onPick={create}
      />
    </div>
  );
}
