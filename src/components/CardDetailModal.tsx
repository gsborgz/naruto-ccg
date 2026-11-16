'use client';

import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
import { customDeckCardId, customSourceId, isCustomCardId } from '@/lib/cardMaker/customIds';
import { deleteCustomCard } from '@/lib/cardMaker/artUpload';
import { readCustomCards } from '@/lib/cardMaker/store';
import { CustomSourceContext, useIsLocalCustomCard } from '@/lib/useCardCatalog';
import { useCardDesign } from '@/lib/cardDesign';
import { useCardLanguage, useLocalizedCard, useSetName } from '@/lib/cardLanguage';
import { CARD_TYPE_LABEL, isReinforcementCard, isTokenCard, type Card } from '@/models/card';
import { acceptsAltArt, canEditAltArt, hasFixedArt } from '@/lib/altArts';
import { chooseArt, useChosenArt } from '@/lib/altArtClient';
import { AltArtDraftFace, AltArtPicker, type AltArtDraft } from './AltArtPicker';
import { CardCost } from './CardCost';
import type { LayoutSizeField } from '@/lib/devCardLayoutEdit';
import { CardFace } from './CardFace';
import { DevNameSizeTuner } from './DevNameSizeTuner';
import { ElementBadge } from './ElementBadge';

type CardView = 'original' | 'rendered';
/** Abas da coluna da direita: os dados da carta ou a arte (artes alternativas). */
type DetailTab = 'details' | 'art';

interface Props {
  card: Card | null;
  onClose: () => void;
  /** Ações extras (ex.: +/- no montador de deck). */
  actions?: React.ReactNode;
  /** Carta criada excluída de vez pelo botão do detalhe (ex.: o montador tira do rascunho do deck). */
  onDeleted?: (card: Card) => void;
}

export function CardDetailModal({ card, onClose, actions, onDeleted }: Props) {
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
      {card && <CardDetails key={card.id} card={card} onClose={onClose} actions={actions} onDeleted={onDeleted} />}
    </dialog>
  );
}

function CardDetails({ card, onClose, actions, onDeleted }: Props & { card: Card }) {
  const { language } = useCardLanguage();
  const localized = useLocalizedCard(card);
  const setName = useSetName()(card.set);
  const custom = isCustomCardId(card.id);
  const localCustom = useIsLocalCustomCard(card.id);
  // Na partida (cartas vindas da sala) não se exclui nada: a carta é a cópia que foi para a sala.
  const inMatch = useContext(CustomSourceContext) !== null;
  // Abre no design escolhido na listagem (padrão: a original); o outro fica a um clique.
  const [view, setView] = useState<CardView>(useCardDesign());
  // Desenvolvimento: ajuste do tamanho do nome, aplicado na carta montada antes de gravar no arquivo da coleção.
  // Nome traduzido na tela → `nameSizePtBr`; senão `nameSize` (como em `withLocalizedText`).
  const [sizeEdits, setSizeEdits] = useState<Partial<Record<LayoutSizeField, number>>>({});
  const sizeField: LayoutSizeField = language === 'pt-BR' && localized.name !== card.name ? 'nameSizePtBr' : 'nameSize';
  const shown = card.layout && Object.keys(sizeEdits).length > 0 ? { ...card, layout: { ...card.layout, ...sizeEdits } } : card;
  // Artes alternativas: só nas cartas do catálogo e fora da partida (lá vale a arte que cada jogador levou). A aba
  // Arte aparece em todas elas, mas editar só nas cartas já mapeadas (`card.layout`): a arte é montada no layout dela.
  const canPickArt = !custom && acceptsAltArt(card.id) && !hasFixedArt(card) && !inMatch;
  const canEditArt = canPickArt && canEditAltArt(card);
  const [tab, setTab] = useState<DetailTab>('details');
  const [draft, setDraft] = useState<AltArtDraft | null>(null);
  const chosen = useChosenArt(card.id);
  // Com uma arte alternativa (escolhida ou fixada), a carta sai sempre montada: não há Original | Montada.
  const withAltArt = hasFixedArt(card) ? !!card.altArt : !!chosen;
  return (
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      <div className="mx-auto flex w-full max-w-xs flex-col gap-2 self-start sm:max-w-none">
        {draft ? (
          <AltArtDraftFace card={card} draft={draft} onChange={setDraft} className="rounded-lg shadow-xl" />
        ) : (
          <CardFace card={shown} size="full" rendered={view === 'rendered'} className="rounded-lg shadow-xl" />
        )}
        {process.env.NODE_ENV === 'development' && card.layout && view === 'rendered' && !withAltArt && !draft && (
          <DevNameSizeTuner
            key={sizeField}
            cardId={card.id}
            field={sizeField}
            saved={card.layout[sizeField] ?? 0}
            value={sizeEdits[sizeField] ?? card.layout[sizeField] ?? 0}
            onChange={(value) => setSizeEdits((edits) => ({ ...edits, [sizeField]: value }))}
          />
        )}
        {/* Cartas escaneadas (`card.layout`) também podem ser vistas montadas a partir do layout e das artes. */}
        {card.layout && !withAltArt && !draft && (
          <div role="group" aria-label="Imagem da carta" className="flex justify-center gap-1 text-sm">
            {(
              [
                ['original', 'Original'],
                ['rendered', 'Montada'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`rounded-md px-3 py-1 ${view === value ? 'bg-accent font-semibold text-bg' : 'text-muted hover:bg-surface-2 hover:text-text'}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {custom ? CARD_TYPE_LABEL[card.type] : `${CARD_TYPE_LABEL[card.type]} · #${card.number} · ${card.set}`}
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

        {canPickArt && (
          <div role="tablist" aria-label="Seções da carta" className="flex gap-1 border-b border-border text-sm">
            {(
              [
                ['details', 'Detalhes'],
                ['art', 'Arte'],
              ] as const
            ).map(([value, text]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`-mb-px border-b-2 px-3 py-1.5 ${tab === value ? 'border-accent font-semibold text-text' : 'border-transparent text-muted hover:text-text'}`}
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {canPickArt && tab === 'art' ? (
          canEditArt ? (
            <AltArtPicker card={card} draft={draft} onDraftChange={setDraft} />
          ) : (
            <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted">
              <p>
                A coleção desta carta ainda não foi mapeada (layout e ícones das cartas montadas), então a arte dela
                ainda não pode ser trocada.
              </p>
              {chosen && (
                <button type="button" onClick={() => chooseArt(card.id, null)} className="self-start text-accent hover:underline">
                  Voltar para a arte original
                </button>
              )}
            </div>
          )
        ) : (
          <>
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

          {isTokenCard(card) && (
            <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm">
              <span className="font-semibold text-accent">Token.</span> Esta carta fica na parte Tokens do deck (fora
              das 50 e do Baralho de Reforço), com no máximo 1 cópia.
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
          </>
        )}
        {custom && (
          <p className="text-xs text-muted">
            {localCustom ? (
              <>
                Carta criada neste navegador.{' '}
                <Link href={`/criar?carta=${customSourceId(card.id)}`} className="text-accent hover:underline">
                  Editar no criador
                </Link>
              </>
            ) : (
              'Carta criada por outro jogador.'
            )}
          </p>
        )}
        {custom && localCustom && !inMatch && (
          <DeleteCustomCardButton
            cardId={card.id}
            onDeleted={() => {
              onDeleted?.(card);
              onClose();
            }}
          />
        )}
        {language === 'pt-BR' && !localized.translated && !custom && (
          <p className="text-xs text-muted">Esta carta ainda não tem tradução: os textos estão em inglês, como impressos.</p>
        )}

        {actions && <div className="mt-auto">{actions}</div>}
      </div>
    </div>
  );
}

/**
 * Exclui de vez a carta criada: some do criador e de todos os decks deste navegador (que ficam inválidos até
 * completar de novo), e a arte dela é apagada do Vercel Blob.
 */
function DeleteCustomCardButton({ cardId, onDeleted }: { cardId: string; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  const remove = async () => {
    const source = readCustomCards().find((c) => customDeckCardId(c.id) === cardId);
    if (!source) return;
    const name = source.name.trim() || 'carta sem nome';
    if (
      !confirm(
        `Excluir "${name}" de vez?

Ela sai do criador e de todos os seus decks (que ficam inválidos até completar de novo), e a arte é apagada do servidor: quem importou esta carta fica sem a arte. Não dá para desfazer.`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await deleteCustomCard(source);
    } finally {
      setBusy(false);
    }
    onDeleted();
  };
  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="self-start rounded-lg px-3 py-1.5 text-sm font-semibold text-danger ring-1 ring-danger/40 hover:bg-danger/10 disabled:cursor-wait disabled:opacity-60"
    >
      {busy ? 'Excluindo…' : 'Excluir carta permanentemente'}
    </button>
  );
}
