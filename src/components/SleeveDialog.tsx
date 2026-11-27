'use client';

import { useEffect, useRef, useState } from 'react';
import { renderSleeveImage, sleeveActions, uploadSleeveImage, useSleeves, type SleeveItem } from '@/lib/sleeves/client';
import { CENTERED, frameRect, SLEEVE_ZOOM, zoomFrame, type SleeveFrame } from '@/lib/sleeves/frame';
import { DEFAULT_BACK, SLEEVE_LIMITS, SLEEVE_SIZE, type Sleeve } from '@/lib/sleeves/types';
import { Dialog } from './Dialog';
import { SleeveImage } from './SleeveImage';

/** Imagem em enquadramento: o arquivo escolhido (`file`, com um `blob:` para a prévia) ou a imagem atual do sleeve. */
type Source = { src: string; file?: Blob; w?: number; h?: number };

type Form = {
  id: string;
  name: string;
  /** Imagem gravada do sleeve (Blob); fica a mesma se o enquadramento não mudar. */
  image: string | null;
  source: Source | null;
  frame: SleeveFrame;
  /** O enquadramento ou a imagem mudou: o Salvar recorta e envia de novo. */
  reframed: boolean;
  createdAt: string;
  isNew: boolean;
};

/**
 * Sleeve do deck (montador): escolhe o verso das cartas entre o padrão e os sleeves de todos os jogadores, e cadastra
 * sleeves novos (nome + imagem, recortada na proporção da carta). Só quem criou um sleeve edita ou exclui. A escolha
 * entra no rascunho do deck (vale ao salvar o deck); o cadastro vai para a nuvem na hora, no **Salvar** do sleeve.
 */
export function SleeveDialog({
  open,
  onClose,
  value,
  onChoose,
}: {
  open: boolean;
  onClose: () => void;
  /** Id do sleeve escolhido no deck. */
  value: string | undefined;
  onChoose: (id: string | undefined) => void;
}) {
  const sleeves = useSleeves();
  const [form, setForm] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mineCount = sleeves?.filter((s) => s.mine).length ?? 0;

  // O `blob:` da prévia do arquivo escolhido é liberado quando sai de uso.
  const previewUrl = form?.source?.file ? form.source.src : null;
  useEffect(() => (previewUrl ? () => URL.revokeObjectURL(previewUrl) : undefined), [previewUrl]);

  const close = () => {
    setForm(null);
    setError(null);
    onClose();
  };

  function startNew() {
    setError(null);
    setForm({
      id: crypto.randomUUID(),
      name: '',
      image: null,
      source: null,
      frame: CENTERED,
      reframed: false,
      createdAt: new Date().toISOString(),
      isNew: true,
    });
  }

  function startEdit(s: Sleeve) {
    setError(null);
    setForm({
      id: s.id,
      name: s.name,
      image: s.image,
      source: { src: s.image },
      frame: CENTERED,
      reframed: false,
      createdAt: s.createdAt,
      isNew: false,
    });
  }

  function pick(file: File | undefined) {
    if (!file || !form) return;
    if (!file.type.startsWith('image/')) {
      setError('Escolha uma imagem (JPEG, PNG ou WebP).');
      return;
    }
    setError(null);
    setForm((f) => f && { ...f, source: { src: URL.createObjectURL(file), file }, frame: CENTERED, reframed: true });
  }

  async function save() {
    if (!form || busy) return;
    if (!form.source) {
      setError('Escolha a imagem do sleeve.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const image =
        form.reframed || !form.image
          ? await uploadSleeveImage(await renderSleeveImage(form.source.file ?? form.source.src, form.frame))
          : form.image;
      const sleeve: Sleeve = {
        id: form.id,
        name: form.name.trim() || 'Sleeve sem nome',
        image,
        createdAt: form.createdAt,
        updatedAt: new Date().toISOString(),
      };
      if (!(await sleeveActions.save(sleeve))) return;
      // O sleeve novo já fica escolhido no deck.
      if (form.isNew) onChoose(sleeve.id);
      setForm(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível salvar o sleeve.');
    } finally {
      setBusy(false);
    }
  }

  async function remove(s: Sleeve) {
    if (!confirm(`Excluir o sleeve "${s.name}"? Os decks que o usam (de qualquer jogador) voltam ao verso padrão.`)) return;
    if (value === s.id) onChoose(undefined);
    await sleeveActions.remove(s.id);
  }

  return (
    <Dialog open={open} onClose={close} title="Sleeve do deck">
      {form ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <div className="flex gap-4">
            {form.source ? (
              <SleeveFramer
                source={form.source}
                frame={form.frame}
                disabled={busy}
                onLoad={(w, h) => setForm((f) => (f?.source ? { ...f, source: { ...f.source, w, h } } : f))}
                onFrame={(frame) => setForm((f) => f && { ...f, frame, reframed: true })}
              />
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="flex aspect-[5/7] w-40 shrink-0 items-center justify-center overflow-hidden rounded-md text-center text-xs text-muted ring-1 ring-border hover:ring-accent"
                title="Escolher a imagem"
              >
                <span className="p-2">Escolher imagem</span>
              </button>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-muted">Nome</span>
                <input
                  value={form.name}
                  maxLength={SLEEVE_LIMITS.nameLength}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  autoFocus
                  className="rounded-lg bg-bg px-3 py-2 text-text ring-1 ring-border outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="self-start rounded-lg px-3 py-1.5 text-sm ring-1 ring-border hover:bg-surface-2 disabled:opacity-50"
              >
                {form.source ? 'Trocar imagem' : 'Escolher imagem'}
              </button>
              <p className="text-xs text-muted">
                {form.source
                  ? 'Arraste a imagem para enquadrar e use o zoom (ou a roda do mouse). O sleeve fica com o que aparece na prévia, na proporção da carta (5×7).'
                  : 'A imagem é recortada na proporção da carta (5×7); depois de escolher, dá para arrastar e dar zoom.'}
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                pick(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(null);
                setError(null);
              }}
              className="rounded-lg px-4 py-2 text-sm text-muted hover:bg-surface-2 hover:text-text"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong disabled:opacity-50"
            >
              {busy ? 'Salvando…' : 'Salvar sleeve'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            O verso das cartas deste deck na partida, para os dois jogadores. Os sleeves cadastrados ficam disponíveis para
            todos.
          </p>
          {!sleeves ? (
            <p className="text-sm text-muted">Carregando os sleeves…</p>
          ) : (
            <ul className="grid max-h-[55vh] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
              <SleeveOption name="Padrão" image={DEFAULT_BACK} chosen={!value} onChoose={() => onChoose(undefined)} />
              {sleeves.map((item) => (
                <SleeveOption
                  key={item.sleeve.id}
                  name={item.sleeve.name}
                  author={item.mine ? 'seu' : item.author}
                  image={item.sleeve.image}
                  chosen={value === item.sleeve.id}
                  onChoose={() => onChoose(item.sleeve.id)}
                  item={item}
                  onEdit={startEdit}
                  onRemove={(s) => void remove(s)}
                />
              ))}
            </ul>
          )}
          <div className="flex justify-between gap-2">
            <button
              type="button"
              onClick={startNew}
              disabled={!sleeves || mineCount >= SLEEVE_LIMITS.sleeves}
              className="rounded-lg px-4 py-2 text-sm ring-1 ring-border hover:bg-surface-2 disabled:opacity-50"
            >
              + Novo sleeve
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent-strong"
            >
              Pronto
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

/**
 * Prévia do sleeve em enquadramento: arrastar move a imagem, a roda do mouse dá zoom em volta do ponteiro e o controle
 * embaixo dá zoom em volta do centro. A conta é a do recorte (`frameRect`), em px da carta de 750×1050.
 */
function SleeveFramer({
  source,
  frame,
  disabled,
  onLoad,
  onFrame,
}: {
  source: Source;
  frame: SleeveFrame;
  disabled?: boolean;
  onLoad: (w: number, h: number) => void;
  onFrame: (frame: SleeveFrame) => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; frame: SleeveFrame } | null>(null);
  const { w: iw, h: ih } = source;
  const ready = !!iw && !!ih;
  const r = ready ? frameRect(iw, ih, frame) : null;
  // px da tela → px da carta.
  const toCard = () => SLEEVE_SIZE.w / (boxRef.current?.clientWidth || SLEEVE_SIZE.w);

  // A roda precisa de um ouvinte não passivo para não rolar o diálogo junto.
  const wheel = useRef<(e: WheelEvent) => void>(() => {});
  wheel.current = (e) => {
    if (!ready || disabled || !boxRef.current) return;
    e.preventDefault();
    const box = boxRef.current.getBoundingClientRect();
    const k = toCard();
    const zoom = frame.zoom * Math.exp(-e.deltaY * 0.0015);
    onFrame(zoomFrame(iw, ih, frame, zoom, (e.clientX - box.left) * k, (e.clientY - box.top) * k));
  };
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const on = (e: WheelEvent) => wheel.current(e);
    el.addEventListener('wheel', on, { passive: false });
    return () => el.removeEventListener('wheel', on);
  }, []);

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div className="flex w-40 shrink-0 flex-col gap-2">
      <div
        ref={boxRef}
        className={`relative aspect-[5/7] w-full touch-none overflow-hidden rounded-md bg-[#26262c] ring-1 ring-border select-none ${
          ready && !disabled ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        title="Arraste para enquadrar; a roda do mouse dá zoom"
        onPointerDown={(e) => {
          if (!ready || disabled || e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, frame };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          const k = toCard();
          onFrame({ ...d.frame, x: d.frame.x + (e.clientX - d.x) * k, y: d.frame.y + (e.clientY - d.y) * k });
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- arquivo local (blob:) ou imagem do Blob */}
        <img
          src={source.src}
          alt=""
          draggable={false}
          onLoad={(e) => onLoad(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
          className="pointer-events-none absolute max-w-none"
          style={
            r
              ? {
                  left: pct(r.left, SLEEVE_SIZE.w),
                  top: pct(r.top, SLEEVE_SIZE.h),
                  width: pct(r.width, SLEEVE_SIZE.w),
                  height: pct(r.height, SLEEVE_SIZE.h),
                }
              : { visibility: 'hidden' }
          }
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-muted" title="Zoom">
        <span aria-hidden>−</span>
        <input
          type="range"
          min={SLEEVE_ZOOM.min}
          max={SLEEVE_ZOOM.max}
          step={0.01}
          value={frame.zoom}
          disabled={!ready || disabled}
          onChange={(e) => onFrame(zoomFrame(iw!, ih!, frame, Number(e.target.value)))}
          aria-label="Zoom da imagem"
          className="min-w-0 flex-1 accent-accent"
        />
        <span aria-hidden>+</span>
      </label>
      <button
        type="button"
        onClick={() => onFrame(CENTERED)}
        disabled={!ready || disabled || (frame.x === 0 && frame.y === 0 && frame.zoom === 1)}
        className="self-center rounded px-2 py-0.5 text-xs text-muted hover:bg-surface-2 hover:text-text disabled:opacity-40"
      >
        Centralizar
      </button>
    </div>
  );
}

function SleeveOption({
  name,
  author,
  image,
  chosen,
  onChoose,
  item,
  onEdit,
  onRemove,
}: {
  name: string;
  author?: string;
  image: string;
  chosen: boolean;
  onChoose: () => void;
  item?: SleeveItem;
  onEdit?: (s: Sleeve) => void;
  onRemove?: (s: Sleeve) => void;
}) {
  return (
    <li className="group relative flex flex-col gap-1">
      <button
        type="button"
        onClick={onChoose}
        aria-pressed={chosen}
        title={chosen ? `${name} (escolhido)` : `Usar ${name}`}
        className={`overflow-hidden rounded-md transition ${chosen ? 'ring-2 ring-accent' : 'ring-1 ring-border hover:ring-accent'}`}
      >
        <SleeveImage src={image} className="aspect-[5/7] w-full object-cover" />
      </button>
      <span className="truncate text-xs font-semibold" title={name}>
        {name}
      </span>
      {author && <span className="-mt-1 truncate text-[11px] text-muted">{author}</span>}
      {item?.mine && onEdit && onRemove && (
        <span className="absolute top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(item.sleeve)}
            className="grid size-6 place-items-center rounded-full bg-surface/90 text-xs ring-1 ring-border hover:bg-surface-2"
            aria-label={`Editar ${name}`}
            title="Editar"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.sleeve)}
            className="grid size-6 place-items-center rounded-full bg-surface/90 text-xs text-danger ring-1 ring-border hover:bg-danger/10"
            aria-label={`Excluir ${name}`}
            title="Excluir"
          >
            ✕
          </button>
        </span>
      )}
    </li>
  );
}
