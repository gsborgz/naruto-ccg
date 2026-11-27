'use client';

import { useRef, useState } from 'react';
import { prepareSleeveImage, sleeveActions, uploadSleeveImage, useSleeves, type SleeveItem } from '@/lib/sleeves/client';
import { DEFAULT_BACK, SLEEVE_LIMITS, type Sleeve } from '@/lib/sleeves/types';
import { Dialog } from './Dialog';
import { SleeveImage } from './SleeveImage';

type Form = { id: string; name: string; image: string | null; createdAt: string; isNew: boolean };

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

  const close = () => {
    setForm(null);
    setError(null);
    onClose();
  };

  function startNew() {
    setError(null);
    setForm({ id: crypto.randomUUID(), name: '', image: null, createdAt: new Date().toISOString(), isNew: true });
  }

  function startEdit(s: Sleeve) {
    setError(null);
    setForm({ id: s.id, name: s.name, image: s.image, createdAt: s.createdAt, isNew: false });
  }

  async function pick(file: File | undefined) {
    if (!file || !form) return;
    if (!file.type.startsWith('image/')) {
      setError('Escolha uma imagem (JPEG, PNG ou WebP).');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const image = await prepareSleeveImage(file);
      setForm((f) => f && { ...f, image });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível ler a imagem.');
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!form || busy) return;
    if (!form.image) {
      setError('Escolha a imagem do sleeve.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const image = form.image.startsWith('data:') ? await uploadSleeveImage(form.image) : form.image;
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
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="flex aspect-[5/7] w-28 shrink-0 items-center justify-center overflow-hidden rounded-md text-center text-xs text-muted ring-1 ring-border hover:ring-accent"
              title="Escolher a imagem"
            >
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL ou Blob, já tratada
                <img src={form.image} alt="" className="size-full object-cover" />
              ) : (
                <span className="p-2">{busy ? 'Tratando…' : 'Escolher imagem'}</span>
              )}
            </button>
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
                {form.image ? 'Trocar imagem' : 'Escolher imagem'}
              </button>
              <p className="text-xs text-muted">A imagem é recortada no centro, na proporção da carta (5×7).</p>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                void pick(e.target.files?.[0]);
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
