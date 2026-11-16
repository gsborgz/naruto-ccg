'use client';

import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { altArtApi, chooseArt, useChosenArt } from '@/lib/altArtClient';
import { withFixedArt, type AltArtFrame, type AltArtView } from '@/lib/altArts';
import type { ArtLayer } from '@/models/cardLayout';
import { cardCornerCss } from '@/lib/cardMaker/layouts/corners';
import type { ArtPreview } from './cardMaker/CatalogCardRender';
import { uploadArt } from '@/lib/cardMaker/artUpload';
import { compressImage, ImageTooLargeError } from '@/lib/images/compressImage';
import { cardImageUrl, type Card } from '@/models/card';
import { CardFace } from './CardFace';

// Carregada sob demanda: traz as fontes e a configuração dos layouts do criador de cartas.
const CatalogCardRender = dynamic(() => import('./cardMaker/CatalogCardRender').then((m) => m.CatalogCardRender), {
  ssr: false,
});

const small = 'rounded-lg px-3 py-1.5 text-sm ring-1 ring-border hover:bg-surface-2 disabled:opacity-50';
const label = 'flex flex-col gap-1 text-xs font-semibold text-muted';

/** Uma camada da arte nova: a imagem ainda só neste navegador (data URL já tratado) e o enquadramento. */
export type DraftLayer = AltArtFrame;

/**
 * Arte nova sendo montada no detalhe da carta: as duas camadas do criador (fundo atrás da moldura; frente na frente
 * da moldura e atrás do painel), se arrastar move as duas juntas (`linked`) e, separadas, qual delas (`layer`).
 */
export interface AltArtDraft extends ArtPreview {
  back: DraftLayer | null;
  front: DraftLayer | null;
  linked: boolean;
  layer: ArtLayer;
}

export const EMPTY_DRAFT: AltArtDraft = { back: null, front: null, linked: true, layer: 'back' };

/** Camadas que o arrastar na carta move: as duas quando ligadas, senão a escolhida (como no criador). */
function movedLayers(draft: AltArtDraft): ArtLayer[] {
  return draft.linked ? ['back', 'front'] : [draft.layer];
}

/**
 * Carta com a arte nova sendo enquadrada (arraste para mover), no lugar da face no detalhe da carta. Montada no
 * layout identificado para a carta (`card.layout`).
 */
export function AltArtDraftFace({
  card,
  draft,
  onChange,
  className = '',
}: {
  card: Card;
  draft: AltArtDraft;
  onChange: (draft: AltArtDraft) => void;
  className?: string;
}) {
  // O arrastar manda deslocamentos; o rascunho mais recente fica no ref para somar sem perder movimentos.
  const latest = useRef(draft);
  useLayoutEffect(() => {
    latest.current = draft;
  });
  const preview = useMemo(() => ({ back: draft.back, front: draft.front }), [draft.back, draft.front]);
  return (
    <div
      className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 ${className}`}
      style={{ borderRadius: cardCornerCss(card.layout?.layout, card.type, card.layout?.panelVariant) }}
    >
      <CatalogCardRender
        card={card}
        preview={preview}
        onArtMove={(dx, dy) => {
          const next = { ...latest.current };
          for (const l of movedLayers(next)) {
            const art = next[l];
            if (art) next[l] = { ...art, x: art.x + dx, y: art.y + dy };
          }
          latest.current = next;
          onChange(next);
        }}
      />
    </div>
  );
}

const LAYER_TITLE: Record<ArtLayer, string> = {
  back: 'Fundo (atrás da moldura)',
  front: 'Frente (na frente da moldura, atrás do painel)',
};

/** Imagem, zoom e posição de uma camada da arte nova (os mesmos controles do criador). */
function DraftLayerControls({
  draft,
  layer,
  onChange,
  onError,
  disabled,
}: {
  draft: AltArtDraft;
  layer: ArtLayer;
  onChange: (draft: AltArtDraft) => void;
  onError: (message: string | null) => void;
  disabled: boolean;
}) {
  const art = draft[layer];
  const fileRef = useRef<HTMLInputElement>(null);
  const setLayer = (value: DraftLayer | null) => onChange({ ...draft, [layer]: value });
  const pickFile = async (file: File) => {
    onError(null);
    try {
      // A frente guarda a transparência (o personagem recortado).
      const src = await compressImage(file, { transparent: layer === 'front' });
      // Com as camadas ligadas, a imagem nova herda o enquadramento da outra (para ficarem alinhadas).
      const other = draft[layer === 'back' ? 'front' : 'back'];
      const frame = draft.linked && other ? { x: other.x, y: other.y, zoom: other.zoom } : { x: 0, y: 0, zoom: 1 };
      setLayer({ src, ...frame });
    } catch (e) {
      onError(e instanceof ImageTooLargeError ? e.message : 'Não foi possível abrir essa imagem.');
    }
  };
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className={label}>{LAYER_TITLE[layer]}</span>
        <button type="button" onClick={() => fileRef.current?.click()} disabled={disabled} className={small}>
          {art ? 'Trocar imagem' : 'Escolher imagem'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (file) void pickFile(file);
          }}
        />
      </div>
      {layer === 'front' && !art && (
        <p className="text-xs text-muted">Opcional. Use uma imagem com transparência (PNG), como o personagem recortado.</p>
      )}
      {art && (
        <>
          <label className={label}>
            Zoom ({art.zoom.toFixed(2)}×)
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={art.zoom}
              onChange={(e) => setLayer({ ...art, zoom: Number(e.target.value) })}
            />
          </label>
          {(['x', 'y'] as const).map((axis) => {
            // Unidades da carta (750×1050); a faixa cresce se o arrastar levou a arte mais longe.
            const span = axis === 'x' ? 750 : 1050;
            const value = Math.round(art[axis]);
            return (
              <label key={axis} className={label}>
                {axis === 'x' ? 'Horizontal' : 'Vertical'} ({value})
                <input
                  type="range"
                  min={Math.min(-span, value)}
                  max={Math.max(span, value)}
                  step={1}
                  value={value}
                  onChange={(e) => setLayer({ ...art, [axis]: Number(e.target.value) })}
                />
              </label>
            );
          })}
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setLayer({ ...art, x: 0, y: 0, zoom: 1 })} disabled={disabled} className={small}>
              Centralizar
            </button>
            <button type="button" onClick={() => setLayer(null)} disabled={disabled} className={`${small} hover:text-danger`}>
              Remover
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Escolha da arte da carta no detalhe (README, "Artes alternativas"): a original ou uma das artes enviadas por
 * qualquer jogador; e o envio de uma arte nova (fundo e, opcional, frente), enquadrada na própria carta (`draft`,
 * mostrado por `AltArtDraftFace`). Só nas cartas já mapeadas (`canEditAltArt`).
 */
export function AltArtPicker({
  card,
  draft,
  onDraftChange,
}: {
  card: Card;
  draft: AltArtDraft | null;
  onDraftChange: (draft: AltArtDraft | null) => void;
}) {
  const chosen = useChosenArt(card.id);
  const [arts, setArts] = useState<AltArtView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    altArtApi
      .list(card.id)
      .then((list) => {
        if (cancelled) return;
        setArts(list);
        // A arte escolhida foi removida por quem a enviou: volta para a original.
        const current = chosen?.id;
        if (current && !list.some((a) => a.id === current)) chooseArt(card.id, null);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
    // Só ao abrir a carta: a escolha muda aqui mesmo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  const save = async () => {
    if (!draft?.back) return;
    setBusy(true);
    setError(null);
    try {
      // As imagens vão para o Blob; depois a arte (as duas camadas) é registrada para a carta.
      const back = { ...draft.back, src: await uploadArt(draft.back.src) };
      const front = draft.front && { ...draft.front, src: await uploadArt(draft.front.src) };
      const art = await altArtApi.add(card.id, { ...back, ...(front && { front }) });
      setArts((list) => (list?.some((a) => a.id === art.id) ? list : [...(list ?? []), art]));
      chooseArt(card.id, art);
      onDraftChange(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (art: AltArtView) => {
    if (!confirm('Remover esta arte? Ela some para todo mundo que a escolheu.')) return;
    setBusy(true);
    setError(null);
    try {
      await altArtApi.remove(card.id, art.id);
      setArts((list) => list?.filter((a) => a.id !== art.id) ?? null);
      if (chosen?.id === art.id) chooseArt(card.id, null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const option = (selected: boolean) =>
    `relative w-16 shrink-0 overflow-hidden rounded ring-2 ${selected ? 'ring-accent' : 'ring-transparent hover:ring-border'}`;

  return (
    <section className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{draft ? 'Nova arte' : 'Arte'}</h3>
        {!draft && (
          <button type="button" onClick={() => onDraftChange(EMPTY_DRAFT)} disabled={busy} className={small}>
            + Nova arte
          </button>
        )}
      </div>

      {draft ? (
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-xs text-muted">
            Monte a arte no layout desta carta: o fundo fica atrás da moldura e a frente (opcional) na frente da
            moldura, atrás do painel. Arraste a arte na carta para enquadrar, ou use os controles de cada camada. Ao
            salvar, ela fica disponível para todo mundo nesta carta.
          </p>
          {(['back', 'front'] as const).map((layer) => (
            <DraftLayerControls
              key={layer}
              draft={draft}
              layer={layer}
              onChange={onDraftChange}
              onError={setError}
              disabled={busy}
            />
          ))}
          {draft.back && draft.front && (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted">
                <input
                  type="checkbox"
                  checked={draft.linked}
                  onChange={(e) => onDraftChange({ ...draft, linked: e.target.checked })}
                />
                Arrastar na carta move as duas camadas juntas
              </label>
              {!draft.linked && (
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted" role="radiogroup">
                  Arrastar na carta:
                  {(['back', 'front'] as const).map((l) => (
                    <label key={l} className="flex items-center gap-1">
                      <input type="radio" checked={draft.layer === l} onChange={() => onDraftChange({ ...draft, layer: l })} />
                      {l === 'back' ? 'fundo' : 'frente'}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy || !draft.back}
              title={draft.back ? undefined : 'Escolha a imagem de fundo'}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:opacity-50"
            >
              {busy ? 'Salvando…' : 'Salvar arte'}
            </button>
            <button type="button" onClick={() => onDraftChange(null)} disabled={busy} className={`${small} text-muted`}>
              Cancelar
            </button>
          </div>
          {!draft.back && <p className="text-xs text-muted">O fundo é obrigatório para salvar.</p>}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => chooseArt(card.id, null)}
            aria-pressed={!chosen}
            title="Arte original"
            className={option(!chosen)}
          >
            <img src={cardImageUrl(card, 'thumb')} alt="Original" className="aspect-[5/7] w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/70 text-center text-[10px] text-white">Original</span>
          </button>
          {arts?.map((art) => (
            <div key={art.id} className="flex shrink-0 flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => chooseArt(card.id, art)}
                aria-pressed={chosen?.id === art.id}
                title="Usar esta arte"
                className={option(chosen?.id === art.id)}
              >
                <CardFace card={withFixedArt(card, art)} size="thumb" />
              </button>
              {art.mine && (
                <button
                  type="button"
                  onClick={() => remove(art)}
                  disabled={busy}
                  className="text-[10px] text-muted hover:text-danger"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          {!arts && !error && <p className="self-center text-xs text-muted">Carregando as artes…</p>}
        </div>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
      {!draft && (
        <p className="text-xs text-muted">
          A arte escolhida vale neste navegador, na listagem, no montador e nas suas partidas.
        </p>
      )}
    </section>
  );
}
