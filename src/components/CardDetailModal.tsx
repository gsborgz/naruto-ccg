'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CARDS_BY_ID } from '@/data/cards';
import { useOptionalContent } from '@/lib/content/ContentProvider';
import { setName as setNameOf } from '@/lib/setName';
import { customDeckCardId, customSourceId, isCustomCardId } from '@/lib/cardMaker/customIds';
import { deleteCustomCard } from '@/lib/cardMaker/artUpload';
import { readCustomCards } from '@/lib/cardMaker/store';
import { CustomSourceContext, useIsLocalCustomCard } from '@/lib/useCardCatalog';
import { CARD_TYPE_LABEL, isReinforcementCard, isTokenCard, type Card } from '@/models/card';
import { CardCost } from './CardCost';
import { CardFace } from './CardFace';
import { NameSizeTuner } from './NameSizeTuner';
import { ElementBadge } from './ElementBadge';

/** Abas da coluna da direita: os dados da carta ou a edição da carta. */
type DetailTab = 'details' | 'edit';

/** Aba Editar: carregada sob demanda (o editor do criador não pesa no detalhe da carta). */
const CardEditTab = dynamic(() => import('./cardMaker/CardEditTab'), { ssr: false });

/** Artes alternativas no fim do detalhe: carregadas sob demanda (montam cartas do criador). */
const AltCardList = dynamic(() => import('./cardMaker/AltCardList'), { ssr: false });

const UNSAVED = 'Descartar as alterações não salvas desta carta?';

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
  // Alterações não salvas na aba Editar: pergunta antes de fechar.
  const dirty = useRef(false);
  const requestClose = () => {
    if (!dirty.current || confirm(UNSAVED)) {
      dirty.current = false;
      onClose();
    }
  };

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
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => e.target === e.currentTarget && requestClose()}
      className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-xl border border-border bg-surface p-0 text-text backdrop:bg-black/70"
    >
      {card && (
        <CardDetails
          key={card.id}
          card={card}
          onClose={requestClose}
          actions={actions}
          onDeleted={onDeleted}
          onDirtyChange={(d) => (dirty.current = d)}
        />
      )}
    </dialog>
  );
}

function CardDetails({
  card: opened,
  onClose,
  actions,
  onDeleted,
  onDirtyChange,
}: Props & { card: Card; onDirtyChange: (dirty: boolean) => void }) {
  // A carta como está no conteúdo agora (depois de salvar na aba Editar, a nova versão).
  useOptionalContent();
  const custom = isCustomCardId(opened.id);
  const card = (!custom && CARDS_BY_ID.get(opened.id)) || opened;
  const setName = setNameOf(card.set);
  const localCustom = useIsLocalCustomCard(card.id);
  // Na partida (cartas vindas da sala) não se exclui nada: a carta é a cópia que foi para a sala.
  const inMatch = useContext(CustomSourceContext) !== null;
  // Ajuste do tamanho do nome (atalho na carta montada), aplicado na carta antes de gravar.
  const [sizeEdit, setSizeEdit] = useState<number | null>(null);
  const shown = card.layout && sizeEdit !== null ? { ...card, layout: { ...card.layout, nameSize: sizeEdit } } : card;
  const [tab, setTab] = useState<DetailTab>('details');
  // Aba Editar: todas as cartas do catálogo, fora da partida; grava no conteúdo do jogo.
  const canEdit = !custom && !inMatch;
  const [editDirty, setEditDirty] = useState(false);
  const reportDirty = useCallback(
    (d: boolean) => {
      setEditDirty(d);
      onDirtyChange(d);
    },
    [onDirtyChange],
  );
  const switchTab = (next: DetailTab) => {
    if (tab === 'edit' && next !== 'edit' && editDirty && !confirm(UNSAVED)) return;
    if (next !== 'edit') reportDirty(false);
    setTab(next);
  };
  const tabs: [DetailTab, string][] = [
    ...(canEdit ? ([['details', 'Detalhes']] as [DetailTab, string][]) : []),
    ...(canEdit ? ([['edit', 'Editar']] as [DetailTab, string][]) : []),
  ];
  const header = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            {custom ? CARD_TYPE_LABEL[card.type] : `${CARD_TYPE_LABEL[card.type]} · #${card.number} · ${card.set}`}
          </p>
          {setName && <p className="text-xs text-muted">{setName}</p>}
          <h2 className="text-2xl font-bold">{card.name}</h2>
        </div>
        <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-muted hover:bg-surface-2 hover:text-text" aria-label="Fechar">
          ✕
        </button>
      </div>

      {tabs.length > 0 && (
        <div role="tablist" aria-label="Seções da carta" className="flex gap-1 border-b border-border text-sm">
          {tabs.map(([value, text]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => switchTab(value)}
              className={`-mb-px border-b-2 px-3 py-1.5 ${tab === value ? 'border-accent font-semibold text-text' : 'border-transparent text-muted hover:text-text'}`}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </>
  );

  if (canEdit && tab === 'edit') return <CardEditTab card={card} header={header} onDirtyChange={reportDirty} />;

  return (
    <>
    <div className="grid gap-6 p-4 sm:grid-cols-[minmax(0,22rem)_1fr] sm:p-6">
      <div className="mx-auto flex w-full max-w-xs flex-col gap-2 self-start sm:max-w-none">
        {/* O design padrão da carta: montada, se ela tem `layout` (escolhido na aba Editar ou nas artes alternativas); senão a impressa. */}
        <CardFace card={shown} size="full" rendered className="rounded-lg shadow-xl" />
        {canEdit && card.layout && (
          <NameSizeTuner
            cardId={card.id}
            saved={card.layout.nameSize ?? 0}
            value={sizeEdit ?? card.layout.nameSize ?? 0}
            onChange={setSizeEdit}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        {header}

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
                <dd>{card.attributes.join(' / ')}</dd>
              </>
            )}
            {'characteristics' in card && card.characteristics.length > 0 && (
              <>
                <dt className="text-muted">Características</dt>
                <dd className="flex flex-wrap gap-1">
                  {card.characteristics.map((c) => (
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

          {(card.text.length > 0 || card.flavor) && (
            <div className="space-y-2 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
              {card.text.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              {card.flavor && <p className="italic text-muted">{card.flavor}</p>}
            </div>
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

        {actions && <div className="mt-auto">{actions}</div>}
      </div>
    </div>
    {canEdit && <AltCardList card={card} />}
    </>
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
