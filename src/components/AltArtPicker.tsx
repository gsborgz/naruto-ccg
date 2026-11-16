'use client';

import dynamic from 'next/dynamic';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { altArtApi, chooseArt, useChosenArt } from '@/lib/altArtClient';
import { withFixedArt, type AltArtPlacement, type AltArtView } from '@/lib/altArts';
import { uploadArt } from '@/lib/cardMaker/artUpload';
import { compressImage, ImageTooLargeError } from '@/lib/images/compressImage';
import { cardImageUrl, type Card } from '@/models/card';
import { CardFace } from './CardFace';

// Carregada sob demanda: traz as fontes e a configuração dos layouts do criador de cartas.
const CatalogCardRender = dynamic(() => import('./cardMaker/CatalogCardRender').then((m) => m.CatalogCardRender), {
  ssr: false,
});

/** Arte nova sendo enquadrada: a imagem ainda só neste navegador (data URL já tratado). */
export type AltArtDraft = AltArtPlacement;

const small = 'rounded-lg px-3 py-1.5 text-sm ring-1 ring-border hover:bg-surface-2 disabled:opacity-50';

/**
 * Carta com a arte nova sendo enquadrada (arraste para mover), no lugar da face no detalhe da carta.
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
  return (
    <div className={`aspect-[5/7] w-full overflow-hidden bg-surface-2 ${className}`}>
      <CatalogCardRender
        card={card}
        art={draft}
        onArtMove={(dx, dy) => {
          const next = { ...latest.current, x: latest.current.x + dx, y: latest.current.y + dy };
          latest.current = next;
          onChange(next);
        }}
      />
    </div>
  );
}

/**
 * Escolha da arte da carta no detalhe (README, "Artes alternativas"): a original ou uma das artes enviadas por
 * qualquer jogador; e o envio de uma arte nova, enquadrada na própria carta (`draft`, mostrado por `AltArtDraftFace`).
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
  const fileRef = useRef<HTMLInputElement>(null);

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

  const pickFile = async (file: File) => {
    setError(null);
    try {
      onDraftChange({ src: await compressImage(file), x: 0, y: 0, zoom: 1 });
    } catch (e) {
      setError(e instanceof ImageTooLargeError ? e.message : 'Não foi possível abrir essa imagem.');
    }
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setError(null);
    try {
      const src = await uploadArt(draft.src);
      const art = await altArtApi.add(card.id, { ...draft, src });
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
        <h3 className="text-sm font-semibold">Arte</h3>
        {!draft && (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={small}>
            + Nova arte
          </button>
        )}
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

      {draft ? (
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-xs text-muted">
            Arraste a arte na carta para enquadrar. Ao salvar, ela fica disponível para todo mundo nesta carta.
          </p>
          <label className="flex flex-col gap-1 text-xs font-semibold text-muted">
            Zoom ({draft.zoom.toFixed(2)}×)
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={draft.zoom}
              onChange={(e) => onDraftChange({ ...draft, zoom: Number(e.target.value) })}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-bg hover:bg-accent-strong disabled:opacity-50"
            >
              {busy ? 'Salvando…' : 'Salvar arte'}
            </button>
            <button type="button" onClick={() => onDraftChange({ ...draft, x: 0, y: 0, zoom: 1 })} disabled={busy} className={small}>
              Centralizar
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={small}>
              Trocar imagem
            </button>
            <button type="button" onClick={() => onDraftChange(null)} disabled={busy} className={`${small} text-muted`}>
              Cancelar
            </button>
          </div>
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
