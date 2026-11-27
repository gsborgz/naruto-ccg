'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CardEditor } from '@/components/cardMaker/CardEditor';
import { CardRender } from '@/components/cardMaker/CardRender';
import { CardPositionEditor, overrideCount } from '@/components/cardMaker/CardPositionEditor';
import { CARD_H, CARD_W } from '@/lib/cardMaker/layouts';
import { CatalogImportDialog, importCatalogCard } from '@/components/cardMaker/CatalogImportDialog';
import { Dialog } from '@/components/Dialog';
import { CARDS_BY_ID } from '@/data/cards';
import {
  moveArt,
  newCustomCard,
  withLayout,
  withLayoutIcons,
  type ArtLayer,
  type CustomCard,
  type LayoutId,
} from '@/lib/cardMaker/model';
import { deleteCustomCard, hasPendingArt, uploadCardArt } from '@/lib/cardMaker/artUpload';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { useLeaveGuard } from '@/lib/useLeaveGuard';
import { customCardActions, useOwnCustomCards } from '@/lib/cardMaker/store';
import { CARD_TYPE_LABEL, type Card } from '@/models/card';
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

/** Espaço sob a prévia (comparar com a original, ajustar posições, aviso e botões). */
const PREVIEW_CONTROLS = 150;

/** Caixas que a alter pode ajustar (os dados e os textos são os da carta): a do texto de efeito e a das características. */
const ALTER_BOXES = ['textBox', 'characteristics'];

const button = 'rounded-lg px-4 py-2 font-semibold text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text';

/** Conteúdo da carta para saber se o rascunho mudou (as datas não contam). */
function contentKey(card: CustomCard | undefined): string {
  if (!card) return '';
  const { createdAt: _c, updatedAt: _u, ...rest } = card;
  return JSON.stringify(rest);
}

/** Troca só os endereços das artes enviadas, sem desfazer o que mudou na carta enquanto a imagem subia. */
function withUploadedArt(current: CustomCard, sent: CustomCard, uploaded: CustomCard): CustomCard {
  if (current.id !== sent.id) return current;
  const next = { ...current };
  if (current.art.src === sent.art.src) next.art = { ...current.art, src: uploaded.art.src };
  if (current.artFront && uploaded.artFront && current.artFront.src === sent.artFront?.src) {
    next.artFront = { ...current.artFront, src: uploaded.artFront.src };
  }
  if (current.customIcon && uploaded.customIcon && current.customIcon.src === sent.customIcon?.src) {
    next.customIcon = { ...current.customIcon, src: uploaded.customIcon.src };
  }
  return next;
}

export default function CardMakerPage() {
  const cards = useOwnCustomCards();
  const [draft, setDraft] = useState<CustomCard | null>(null);
  const [importing, setImporting] = useState(false);
  // Carta do catálogo escolhida para importar: falta dizer se é uma carta nova ou uma alter.
  const [importChoice, setImportChoice] = useState<{ card: Card; layout?: LayoutId } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reference, setReference] = useState(0);
  // Ajustar posições: caixas arrastáveis na prévia, que mudam só esta carta (`layoutOverrides`), não o layout.
  const [positions, setPositions] = useState(false);
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

  // Abre a carta mais recente ao carregar, ou a de `/criar?carta=<id>` (link "Editar no criador" do montador).
  useEffect(() => {
    if (!cards || draft || !cards.length) return;
    const wanted = new URLSearchParams(window.location.search).get('carta');
    setDraft(cards.find((c) => c.id === wanted) ?? cards[0]);
    if (wanted) window.history.replaceState(null, '', '/criar');
  }, [cards, draft]);

  // Rascunho: as edições só são gravadas no botão Salvar (que também envia a arte ao servidor).
  const stored = draft ? cards?.find((c) => c.id === draft.id) : undefined;
  const isNew = !!draft && !!cards && !stored;
  const dirty = !!draft && (isNew || contentKey(draft) !== contentKey(stored));
  // Carta salva com a arte ainda só neste navegador (o envio falhou): o Salvar tenta enviar de novo.
  const pendingArt = !!draft && hasPendingArt(draft);
  // Alter: carta ligada a uma carta do catálogo, em que só as artes mudam. Precisa de uma arte para salvar.
  const isAlter = !!draft?.source;
  const alterSource = isAlter ? CARDS_BY_ID.get(draft.source!) : undefined;
  const missingArt = isAlter && !draft.art.src && !draft.artFront?.src;
  const guard = useLeaveGuard(dirty);

  /**
   * Salva a carta na nuvem: envia ao servidor (Vercel Blob) as artes ainda não enviadas e grava a carta (a alter fica
   * ligada à carta do catálogo pelo `source`). Se o envio da arte falhar, nada é gravado e o aviso pede para salvar de
   * novo.
   */
  const save = async () => {
    if (!draft || saving || missingArt) return;
    const sent = draft;
    setSaving(true);
    setSaveError(null);
    try {
      const uploaded = await uploadCardArt(sent);
      await customCardActions.save(uploaded);
      setDraft((d) => d && withUploadedArt(d, sent, uploaded));
    } catch (e) {
      setSaveError(`A carta não foi salva: a arte não foi enviada ao servidor (${(e as Error).message}). Clique em Salvar de novo.`);
    } finally {
      setSaving(false);
    }
  };

  /** Troca de carta: com alterações não salvas, pergunta antes de descartar. */
  const confirmDiscard = () => !dirty || confirm('Descartar as alterações não salvas desta carta?');

  // `/criar?importar=<id da carta>[&layout=layout-02]`: começa uma carta a partir de uma carta do catálogo (pergunta se é
  // uma carta nova ou uma alter; sem `layout`, o layout 1).
  const imported = useRef(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('importar');
    const layout = (params.get('layout') ?? undefined) as LayoutId | undefined;
    if (!id || imported.current) return;
    imported.current = true;
    const source = CARDS_BY_ID.get(id);
    if (source) setImportChoice({ card: source, layout });
    window.history.replaceState(null, '', '/criar');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (card: CustomCard) => {
    if (card.id === draft?.id || !confirmDiscard()) return;
    setDraft(card);
    setReference(0);
    setSaveError(null);
  };

  /** Carta nova (do zero, do catálogo ou duplicada): fica só no rascunho até o Salvar. */
  const create = (card: CustomCard) => open(card);

  /**
   * Importa a carta do catálogo escolhida. `new`: uma carta nova com os dados dela, tudo editável e sem ligação com a do
   * catálogo (a imagem original fica só para comparar). `alter`: ligada à carta do catálogo (`source`), com os dados
   * travados; mudam o layout, a moldura do Atributo de Combate e as artes (começa sem arte).
   */
  const importAs = (kind: 'new' | 'alter') => {
    if (!importChoice) return;
    const imported = importCatalogCard(importChoice.card, importChoice.layout ?? draft?.layout);
    setImportChoice(null);
    if (kind === 'new') {
      const { source: _source, ...rest } = imported;
      create(rest);
    } else {
      create({ ...imported, art: { src: '', x: 0, y: 0, zoom: 1 }, artFront: undefined });
    }
  };

  // Exclui de vez: some também dos decks e a arte é apagada do Vercel Blob (como no detalhe da carta).
  const remove = () => {
    if (!draft) return;
    // Carta nova ainda não salva: só descarta o rascunho.
    if (isNew) {
      if (confirm('Descartar esta carta nova?')) setDraft(cards?.[0] ?? null);
      return;
    }
    if (
      !confirm(
        `Excluir "${draft.name || 'carta sem nome'}" de vez?

Ela sai de todos os seus decks (que ficam inválidos até completar de novo), e a arte é apagada do servidor: quem importou esta carta fica sem a arte.`,
      )
    ) {
      return;
    }
    const next = cards?.find((c) => c.id !== draft.id) ?? null;
    setDraft(next);
    void deleteCustomCard(draft);
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
          <p className="text-sm text-muted">
            Monte cartas nos layouts das coleções (escolha no formulário). Clique em <strong>Salvar</strong> para guardar a
            carta; a arte vai para o servidor.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Editor das molduras, ícones e posições de cada layout (vale para todas as cartas montadas). */}
          <Link href="/criar/layouts" className={button}>
            Editar layouts
          </Link>
          {/* Some enquanto uma carta nova (ainda não salva) está aberta. */}
          {!isNew && (
            <button type="button" onClick={() => setImporting(true)} className={button}>
              Importar do catálogo
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              create(withLayoutIcons(withLayout(newCustomCard(draft?.type ?? 'ninja'), draft?.layout ?? 'layout-01')))
            }
            className={button}
          >
            Nova carta
          </button>
          {draft && (
            <button
              type="button"
              onClick={save}
              disabled={saving || missingArt || (!dirty && !pendingArt)}
              title={
                missingArt ? 'Envie uma arte para a alter' : !dirty && !pendingArt ? 'Nenhuma alteração para salvar' : undefined
              }
              className="rounded-lg bg-accent px-4 py-2 font-semibold text-bg hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar'}
              {dirty && !saving && (
                <span className="ml-1.5 inline-block size-1.5 rounded-full bg-bg align-middle" aria-label="(alterações não salvas)" />
              )}
            </button>
          )}
        </div>
      </div>

      {saveError && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{saveError}</p>}

      {cards && !draft && (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted">
          Nenhuma carta ainda. Crie uma do zero ou parta de uma carta do catálogo.
        </p>
      )}

      {(draft || (cards && cards.length > 0)) && (
        <div ref={areaRef} className="grid min-h-0 flex-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:grid-rows-[minmax(0,1fr)]">
          <div className="flex min-h-0 flex-col gap-6 lg:h-full lg:overflow-y-auto lg:pr-2">
            {draft && (
              <CardEditor
                card={draft}
                onChange={setDraft}
                artLayer={artLayer}
                onArtLayerChange={setArtLayer}
                mode={isAlter ? 'alter' : 'full'}
              />
            )}
            {cards && (cards.length > 0 || isNew) && (
              <section className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">Minhas cartas ({cards.length})</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
                  {(isNew && draft ? [draft, ...cards] : cards).map((c) => {
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
                        <span className="text-[11px] text-muted">
                          {shown.source ? 'Alter' : CARD_TYPE_LABEL[shown.type]}
                          {c.id === draft?.id && dirty && <span className="text-accent"> · não salva</span>}
                        </span>
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
                {positions ? (
                  <CardPositionEditor
                    card={draft}
                    only={isAlter ? ALTER_BOXES : undefined}
                    width={width}
                    referenceOpacity={reference}
                    onChange={(update) => setDraft((d) => d && update(d))}
                  />
                ) : (
                  <CardRender
                    card={draft}
                    width={width}
                    referenceOpacity={reference}
                    onArtMove={(dx, dy) => setDraft((d) => d && moveArt(d, artLayer, dx, dy))}
                    className="mx-auto shadow-2xl"
                  />
                )}
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
              {downloadFailed && <p className="text-xs text-danger">Não foi possível gerar a imagem da carta.</p>}
              {(
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPositions((p) => !p)}
                    aria-pressed={positions}
                    title={
                      isAlter
                        ? 'Ajuste a caixa do texto e a das características na carta (o canto muda o tamanho). Vale só para esta alter: o layout não muda.'
                        : 'Arraste os elementos na carta (o canto muda o tamanho; as setas movem o selecionado). Vale só para esta carta: o layout não muda.'
                    }
                    className={`rounded-lg px-3 py-1.5 font-semibold ring-1 ${positions ? 'bg-accent/15 text-accent ring-accent' : 'text-muted ring-border hover:bg-surface-2 hover:text-text'}`}
                  >
                    {positions ? 'Concluir' : isAlter ? 'Ajustar caixas de texto' : 'Ajustar posições'}
                  </button>
                  {overrideCount(draft) > 0 && (
                    <>
                      <span className="text-muted">{overrideCount(draft)} ajuste(s) só nesta carta</span>
                      <button
                        type="button"
                        onClick={() => setDraft((d) => d && (({ layoutOverrides: _o, ...rest }) => rest)(d))}
                        className="text-accent hover:underline"
                      >
                        Voltar às do layout
                      </button>
                    </>
                  )}
                </div>
              )}
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

      <UnsavedChangesDialog
        open={guard.pending}
        onSave={async () => {
          await save();
          guard.proceed();
        }}
        onDiscard={guard.proceed}
        onCancel={guard.cancel}
      />

      <CatalogImportDialog open={importing} onClose={() => setImporting(false)} onPick={(card) => setImportChoice({ card })} />

      <Dialog open={!!importChoice} onClose={() => setImportChoice(null)} title="Importar do catálogo">
        {importChoice && (
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm">
              O que você quer fazer com <strong>{importChoice.card.name}</strong>?
            </p>
            <button type="button" onClick={() => importAs('new')} className={`${button} text-left`}>
              Criar uma carta nova a partir dela
              <span className="block text-xs font-normal">
                Os dados vêm preenchidos e tudo fica editável. A carta salva não tem ligação com a do catálogo.
              </span>
            </button>
            <button type="button" onClick={() => importAs('alter')} className={`${button} text-left`}>
              Criar uma alter para ela
              <span className="block text-xs font-normal">
                Os dados e os textos ficam travados; você escolhe o layout e a moldura do Atributo de Combate e envia as artes novas. No montador de deck, a alter
                pode ser escolhida como o design da carta.
              </span>
            </button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
