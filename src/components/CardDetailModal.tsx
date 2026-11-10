'use client';

import { useEffect, useRef } from 'react';
import { useCardLanguage, useLocalizedCard, useSetName } from '@/lib/cardLanguage';
import { CARD_TYPE_LABEL, cardImageUrl, isReinforcementCard, type Card } from '@/models/card';
import { CardCost } from './CardCost';
import { ElementBadge } from './ElementBadge';

interface Props {
  card: Card | null;
  onClose: () => void;
  /** Ações extras (ex.: +/- no montador de deck). */
  actions?: React.ReactNode;
}

export function CardDetailModal({ card, onClose, actions }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (card && !dialog.open) dialog.showModal();
    if (!card && dialog.open) dialog.close();
  }, [card]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-0 text-text backdrop:bg-black/70"
    >
      {card && <CardDetails card={card} onClose={onClose} actions={actions} />}
    </dialog>
  );
}

function CardDetails({ card, onClose, actions }: Props & { card: Card }) {
  const { language } = useCardLanguage();
  const localized = useLocalizedCard(card);
  const setName = useSetName()(card.set);
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      {/* A miniatura (já em cache pela grade) aparece por baixo enquanto a imagem grande carrega. */}
      <div
        className="mx-auto aspect-[5/7] w-full max-w-xs self-start overflow-hidden rounded-lg bg-surface-2 bg-cover shadow-xl sm:max-w-none"
        style={{ backgroundImage: `url(${cardImageUrl(card, 'thumb')})` }}
      >
        <img
          key={card.id}
          src={cardImageUrl(card)}
          alt={card.name}
          width={429}
          height={600}
          decoding="async"
          className="size-full object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {CARD_TYPE_LABEL[card.type]} · #{card.number} · {card.set}
              {localized.rarity ? ` · ${localized.rarity}` : ''}
            </p>
            {setName && <p className="text-xs text-muted">{setName}</p>}
            <h2 className="text-2xl font-bold">{localized.name}</h2>
            {/* Com o nome traduzido, o impresso continua visível: é ele que vale na regra de cópias. */}
            {localized.name !== card.name && <p className="text-sm text-muted">{card.name}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted hover:bg-surface-2 hover:text-text"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted">Símbolos</dt>
          <dd className="flex gap-1">
            {card.elements.map((e) => (
              <ElementBadge key={e} element={e} size="md" />
            ))}
          </dd>
          <dt className="text-muted">{card.type === 'jutsu' ? 'Custo de Jutsu' : 'Entrada / Mão'}</dt>
          <dd>
            <CardCost card={card} />
          </dd>
          {card.type === 'ninja' && (
            <>
              <dt className="text-muted">Poder (saudável)</dt>
              <dd className="font-mono">
                {card.healthy.combat}/{card.healthy.support}
              </dd>
              <dt className="text-muted">Poder (ferido)</dt>
              <dd className="font-mono">
                {card.injured.combat}/{card.injured.support}
              </dd>
              <dt className="text-muted">Atributo</dt>
              <dd>{localized.attributes.join(' / ')}</dd>
            </>
          )}
          {localized.characteristics.length > 0 && (
            <>
              <dt className="text-muted">Características</dt>
              <dd className="flex flex-wrap gap-1">
                {localized.characteristics.map((c) => (
                  <span key={c} className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">
                    {c}
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>

        {isReinforcementCard(card) && (
          <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm">
            <span className="font-semibold text-accent">Baralho de Reforço.</span> Esta carta fica fora do Deck
            (não conta nas 50) e nunca vai para a mão. Entra em jogo por efeitos de cartas ou, se for um
            Esquadrão [Squad], também ao ser formado na sua Fase de Missão.
          </p>
        )}

        {(localized.text.length > 0 || localized.flavor) && (
          <div className="space-y-2 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
            {localized.text.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {localized.flavor && <p className="italic text-muted">{localized.flavor}</p>}
          </div>
        )}
        {language === 'pt-BR' && !localized.translated && (
          <p className="text-xs text-muted">Esta carta ainda não tem tradução: os textos estão em inglês, como impressos.</p>
        )}

        {actions && <div className="mt-auto">{actions}</div>}
      </div>
    </div>
  );
}
