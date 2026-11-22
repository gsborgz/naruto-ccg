'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { withoutLayout } from '@/lib/cardMaker/catalogEdit';
import { fetchVersions, removeVersion, type VersionView } from '@/lib/cardMaker/versions';
import { saveCatalogCard } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import { cardImageUrl, type Card } from '@/models/card';
import { CardRender } from './CardRender';

/**
 * Artes alternativas no fim do detalhe da carta: a original e as versões dela (as cartas do criador importadas desta
 * carta, de todos os jogadores, na nuvem). Clicar numa a torna o design padrão da carta, para todo mundo: a carta
 * guarda só o id da versão (`Card.design`). O ✕ exclui a versão (a sua ou a do sistema) ou tira da lista a de outro
 * jogador; se era a padrão, a carta volta para a original. Carregado sob demanda (traz o criador de cartas).
 */

const TILE_W = 112;

const OWNER_LABEL = { mine: 'Sua', system: 'Do site' } as const;

export default function AltCardList({ card }: { card: Card }) {
  const content = useContent();
  const [items, setItems] = useState<VersionView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    fetchVersions(card.id)
      .then((list) => !cancelled && setItems(list))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [card.id]);
  // A carta mudou de versão no conteúdo (salva pela aba Editar): a lista pode ter ganhado uma versão.
  useEffect(load, [load, content.version]);

  /** Grava a escolhida como design padrão da carta (`null` = a original). */
  const choose = async (v: VersionView | null) => {
    const what = v ? `a arte de ${v.owner === 'mine' ? 'você' : v.author || 'um jogador'}` : 'a imagem original';
    if (!confirm(`Usar ${what} como design padrão desta carta? Vale para todo mundo.`)) return;
    setSaving(v?.card.id ?? 'original');
    setError(null);
    try {
      await saveCatalogCard(v ? { ...withoutLayout(card), design: v.card.id } : withoutLayout(card));
      await content.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(null);
    }
  };

  const remove = async (v: VersionView) => {
    const deletes = v.owner !== 'other';
    const question = deletes
      ? `Excluir esta versão de vez? A arte dela sai do servidor${v.owner === 'mine' ? ' e ela some do seu criador e dos seus decks' : ''}.`
      : `Tirar a versão de ${v.author || 'outro jogador'} desta lista? Ela continua no criador de quem a fez.`;
    if (!confirm(card.design === v.card.id ? `${question}\n\nEla é o design padrão: a carta volta para a original.` : question)) return;
    setSaving(v.card.id);
    setError(null);
    try {
      const changed = await removeVersion(card.id, v.card.id);
      setItems((list) => list?.filter((x) => x.card.id !== v.card.id) ?? null);
      if (changed) await content.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(null);
    }
  };

  return (
    <section className="flex flex-col gap-2 border-t border-border px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold">Artes alternativas</h3>
        <span className="text-xs text-muted">Clique numa delas para torná-la o design padrão da carta.</span>
        <Link
          href={`/criar?importar=${card.id}`}
          className="ml-auto rounded-lg px-3 py-1 text-sm font-semibold text-accent ring-1 ring-accent/50 hover:bg-accent/10"
        >
          + Criar arte alternativa
        </Link>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      <ul className="flex gap-3 overflow-x-auto pb-2">
        <Tile
          label="Original"
          active={!card.design}
          busy={saving === 'original'}
          disabled={saving !== null}
          onClick={() => choose(null)}
        >
          <img src={cardImageUrl(card, 'thumb')} alt="" className="size-full object-cover" />
        </Tile>
        {items?.map((v) => (
          <Tile
            key={v.card.id}
            label={v.owner === 'other' ? v.author || 'Jogador' : OWNER_LABEL[v.owner]}
            active={card.design === v.card.id}
            busy={saving === v.card.id}
            disabled={saving !== null}
            onClick={() => choose(v)}
            onRemove={() => remove(v)}
            removeLabel={v.owner === 'other' ? 'Tirar da lista' : 'Excluir versão'}
          >
            <CardRender card={v.card} width={TILE_W} />
          </Tile>
        ))}
      </ul>
      {items === null && !error && <p className="text-xs text-muted">Carregando…</p>}
      {items?.length === 0 && <p className="text-xs text-muted">Ninguém criou uma arte para esta carta ainda.</p>}
    </section>
  );
}

function Tile({
  label,
  active,
  busy,
  disabled,
  onClick,
  onRemove,
  removeLabel,
  children,
}: {
  label: string;
  active: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || active}
        aria-pressed={active}
        title={active ? 'Design padrão atual' : 'Usar como design padrão'}
        className={`flex flex-col items-center gap-1 rounded-lg p-1 text-xs disabled:cursor-default ${
          active ? 'bg-accent/15 ring-2 ring-accent' : 'ring-1 ring-border hover:bg-surface-2 disabled:opacity-60'
        }`}
        style={{ width: TILE_W + 8 }}
      >
        <span className="block aspect-[5/7] w-full overflow-hidden rounded-md bg-surface-2">{children}</span>
        <span className="max-w-full truncate">{busy ? 'Salvando…' : active ? `${label} · padrão` : label}</span>
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          title={removeLabel}
          aria-label={removeLabel}
          className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-bg/85 text-xs text-muted ring-1 ring-border hover:text-danger disabled:opacity-50"
        >
          ✕
        </button>
      )}
    </li>
  );
}
