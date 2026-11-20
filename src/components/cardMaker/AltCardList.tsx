'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchAltCards, type AltCardView } from '@/lib/cardMaker/altCardsClient';
import { withAltDesign, withoutLayout } from '@/lib/cardMaker/catalogEdit';
import { saveCatalogCard } from '@/lib/content/client';
import { useContent } from '@/lib/content/ContentProvider';
import { cardImageUrl, type Card } from '@/models/card';
import { CardRender } from './CardRender';

/**
 * Artes alternativas no fim do detalhe da carta: a original e as cartas do criador importadas desta carta, de todos
 * os jogadores (`src/lib/altCards.ts`). Clicar numa delas a torna o design padrão da carta, para todo mundo: grava o
 * visual dela no `layout` da carta (a original tira o `layout`). Carregado sob demanda (traz o criador de cartas).
 */

const TILE_W = 112;

const sameJson = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export default function AltCardList({ card }: { card: Card }) {
  const content = useContent();
  const [items, setItems] = useState<AltCardView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAltCards(card.id)
      .then((list) => !cancelled && setItems(list))
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [card.id]);

  /** Grava a escolhida como design padrão da carta (`null` = a original). */
  const choose = async (alt: AltCardView | null) => {
    const what = alt ? `a arte de ${alt.author || 'um jogador'}` : 'a imagem original';
    if (!confirm(`Usar ${what} como design padrão desta carta? Vale para todo mundo.`)) return;
    setSaving(alt?.id ?? 'original');
    setError(null);
    try {
      const { version } = await saveCatalogCard(alt ? withAltDesign(card, alt.card) : withoutLayout(card));
      content.saved(version);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(null);
    }
  };

  const current = (alt: AltCardView) => !!card.layout && sameJson(withAltDesign(card, alt.card).layout, card.layout);

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
          active={!card.layout}
          busy={saving === 'original'}
          disabled={saving !== null}
          onClick={() => choose(null)}
        >
          <img src={cardImageUrl(card, 'thumb')} alt="" className="size-full object-cover" />
        </Tile>
        {items?.map((alt) => (
          <Tile
            key={alt.id}
            label={alt.mine ? 'Sua' : alt.author || 'Jogador'}
            active={current(alt)}
            busy={saving === alt.id}
            disabled={saving !== null}
            onClick={() => choose(alt)}
          >
            <CardRender card={alt.card} width={TILE_W} />
          </Tile>
        ))}
      </ul>
      {items === null && !error && <p className="text-xs text-muted">Carregando…</p>}
      {items?.length === 0 && (
        <p className="text-xs text-muted">Ninguém criou uma arte para esta carta ainda.</p>
      )}
    </section>
  );
}

function Tile({
  label,
  active,
  busy,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li className="shrink-0">
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
    </li>
  );
}
