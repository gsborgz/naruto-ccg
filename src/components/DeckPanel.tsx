'use client';

import { useEffect, useState } from 'react';
import { isCustomCardId } from '@/lib/cardMaker/customIds';
import { useCustomCards } from '@/lib/cardMaker/store';
import { DECK_RULES, deckPartOf, type CardLookup, type DeckSummary } from '@/lib/deckRules';
import { sortCost } from '@/lib/cardFilters';
import type { Deck } from '@/lib/deckStore';
import { CARD_TYPE_LABEL, cardImageUrl, type Card, type CardType } from '@/models/card';
import { useCardLanguage, useCardName } from '@/lib/cardLanguage';
import type { PrintDesign } from '@/lib/print/printDeck';
import { CardFace } from './CardFace';

const TYPES: CardType[] = ['ninja', 'jutsu', 'mission', 'client'];

/** Abas do painel: uma por tipo de carta do Deck, uma para o Baralho de Reforço e uma para os Tokens. */
type Tab = CardType | 'reinforcement' | 'token';
const TABS: Tab[] = [...TYPES, 'reinforcement', 'token'];
const TAB_LABEL: Record<Tab, string> = { ...CARD_TYPE_LABEL, reinforcement: 'Reforço', token: 'Tokens' };

type Entry = { card: Card; qty: number };

function Meter({ value, max }: { value: number; max: number }) {
  const over = value > max;
  const done = value === max;
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${over ? 'bg-danger' : done ? 'bg-ok' : 'bg-accent'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-sm font-semibold ${over ? 'text-danger' : done ? 'text-ok' : 'text-text'}`}>
        {value}/{max}
      </span>
    </div>
  );
}

/** Botão redondo pequeno de −/+ que aparece sobre a carta do deck. */
const roundBtn =
  'grid size-6 place-items-center rounded-full text-sm font-bold shadow ring-1 transition disabled:cursor-not-allowed disabled:opacity-35';
/** Esconde os botões até passar o mouse/focar (em telas de toque ficam sempre visíveis). */
const revealOnHover =
  'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100';

function DeckCard({
  entry,
  blocked,
  onSelect,
  onSetQty,
}: {
  entry: Entry;
  blocked: string | null;
  onSelect: (card: Card) => void;
  onSetQty: (card: Card, qty: number) => void;
}) {
  const { card, qty } = entry;
  const name = useCardName()(card);
  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onSelect(card)}
        className="block w-full overflow-hidden rounded-md ring-1 ring-border transition hover:-translate-y-0.5 hover:ring-accent"
        aria-label={`Ver detalhes de ${name}`}
        title={name}
      >
        {isCustomCardId(card.id) ? (
          <CardFace card={card} size="thumb" />
        ) : (
          <img
            src={cardImageUrl(card, 'thumb')}
            alt={card.name}
            width={300}
            height={420}
            loading="lazy"
            decoding="async"
            className="aspect-[5/7] w-full object-cover"
          />
        )}
      </button>
      <div className="absolute inset-x-0 -bottom-3 flex items-center justify-center gap-1">
        <span className={revealOnHover}>
          <button
            type="button"
            onClick={() => onSetQty(card, qty - 1)}
            className={`${roundBtn} bg-surface-2 text-text ring-border hover:bg-border`}
            aria-label={`Remover 1 ${name}`}
          >
            −
          </button>
        </span>
        <span
          className="grid size-7 place-items-center rounded-full bg-text font-mono text-sm font-bold text-bg shadow ring-2 ring-surface"
          aria-label={`${qty} no deck`}
        >
          {qty}
        </span>
        <span className={revealOnHover}>
          <button
            type="button"
            onClick={() => onSetQty(card, qty + 1)}
            disabled={blocked !== null}
            title={blocked ?? undefined}
            className={`${roundBtn} bg-accent text-bg ring-accent hover:bg-accent-strong`}
            aria-label={`Adicionar 1 ${name}`}
          >
            +
          </button>
        </span>
      </div>
    </li>
  );
}

/** Design escolhido para imprimir (lembrado neste navegador). */
const PRINT_DESIGN_KEY = 'naruto-ccg:print-design';

function readPrintDesign(): PrintDesign {
  try {
    return localStorage.getItem(PRINT_DESIGN_KEY) === 'rendered' ? 'rendered' : 'original';
  } catch {
    return 'original';
  }
}

/**
 * Baixa um PDF A4 com as cartas do deck (como está na tela, mesmo sem salvar) para imprimir e recortar.
 * O design vale para o deck inteiro: a imagem impressa ou a carta remontada (nas cartas já escaneadas).
 */
function PrintButton({ deck, lookup }: { deck: Deck; lookup: CardLookup }) {
  const [design, setDesign] = useState<PrintDesign>('original');
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { language, translations } = useCardLanguage();
  const customCards = useCustomCards();
  useEffect(() => setDesign(readPrintDesign()), []);

  const choose = (value: PrintDesign) => {
    setDesign(value);
    try {
      localStorage.setItem(PRINT_DESIGN_KEY, value);
    } catch {
      // Sem storage: vale só nesta tela.
    }
  };

  async function print() {
    setProgress('');
    setError(null);
    let renderer: { render: (card: Card) => Promise<Blob | null>; dispose: () => void } | null = null;
    try {
      // Carregados sob demanda: só quem imprime paga pelo código do PDF (e do desenho das cartas montadas).
      const [{ downloadDeckPdf, printsRendered }, { createCardImageRenderer }] = await Promise.all([
        import('@/lib/print/printDeck'),
        import('./cardMaker/cardImageRenderer'),
      ]);
      const needsRender = Object.keys(deck.cards).some((id) => {
        const card = lookup(id);
        return card && printsRendered(card, design);
      });
      if (needsRender) renderer = createCardImageRenderer({ language, translations, customCards: customCards ?? [] });
      await downloadDeckPdf(deck.name, deck.cards, {
        design,
        lookup,
        renderCard: renderer ? (card) => renderer!.render(card) : undefined,
        onProgress: (done, total) => setProgress(`${done}/${total}`),
      });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error && e.message.startsWith('Não foi possível montar') ? e.message : 'Não foi possível gerar o PDF.');
    } finally {
      renderer?.dispose();
      setProgress(null);
    }
  }

  const busy = progress !== null;
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {error && <span className="text-xs text-danger">{error}</span>}
      <label className="flex items-center gap-1.5 text-xs text-muted">
        Design
        <select
          value={design}
          onChange={(e) => choose(e.target.value as PrintDesign)}
          disabled={busy}
          title="Vale para todas as cartas do PDF. Remontado: as cartas ainda não escaneadas saem com a imagem original; as cartas criadas saem sempre montadas."
          className="rounded-md border border-border bg-surface px-1.5 py-1 text-xs text-text"
        >
          <option value="original">Original</option>
          <option value="rendered">Remontado</option>
        </select>
      </label>
      <button
        type="button"
        onClick={print}
        disabled={busy}
        title="Gera um PDF em folhas A4 com as cartas em tamanho real (63 × 88 mm), 9 por folha, com marcas de corte"
        className="rounded-md px-2 py-1 text-sm font-semibold text-accent transition-colors hover:bg-surface-2 disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? `Gerando PDF…${progress ? ` ${progress}` : ''}` : '🖨 Imprimir deck'}
      </button>
    </div>
  );
}

export function DeckPanel({
  deck,
  lookup,
  summary,
  dirty,
  blockedOf,
  onSelect,
  onSetQty,
  onRename,
  onClear,
  onSave,
  onClose,
}: {
  deck: Deck;
  /** Procura as cartas do deck (catálogo + cartas criadas). */
  lookup: CardLookup;
  summary: DeckSummary;
  /** Há alterações ainda não salvas. */
  dirty: boolean;
  blockedOf: (card: Card) => string | null;
  onSelect: (card: Card) => void;
  onSetQty: (card: Card, qty: number) => void;
  onRename: (name: string) => void;
  onClear: () => void;
  onSave: () => void;
  /** Painel aberto por cima da lista (celular): mostra o botão de fechar. */
  onClose?: () => void;
}) {
  const [tab, setTab] = useState<Tab>('ninja');
  const nameOf = useCardName();

  const entries = Object.entries(deck.cards)
    .map(([id, qty]) => ({ card: lookup(id), qty }))
    .filter((e): e is Entry => !!e.card && e.qty > 0);

  const group = entries
    .filter((e) =>
      tab === 'reinforcement' || tab === 'token'
        ? deckPartOf(e.card) === tab
        : deckPartOf(e.card) === 'main' && e.card.type === tab,
    )
    .sort((a, b) => sortCost(a.card) - sortCost(b.card) || nameOf(a.card).localeCompare(nameOf(b.card), 'pt-BR'));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex flex-col gap-3 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <input
            value={deck.name}
            onChange={(e) => onRename(e.target.value)}
            onBlur={(e) => !e.target.value.trim() && onRename('Deck sem nome')}
            aria-label="Nome do deck"
            className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 text-xl font-bold hover:border-border focus:border-accent"
          />
          <button
            type="button"
            onClick={onSave}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent-strong"
          >
            Salvar
            {dirty && <span className="ml-1.5 inline-block size-1.5 rounded-full bg-bg align-middle" aria-label="(alterações não salvas)" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-text"
              aria-label="Fechar deck"
            >
              ✕
            </button>
          )}
        </div>
        <Meter value={summary.total} max={DECK_RULES.size} />
        <p className="-mt-1.5 text-xs text-muted">
          Baralho de Reforço (opcional):{' '}
          <span
            className={`font-mono font-semibold ${summary.reinforcement > DECK_RULES.reinforcementMax ? 'text-danger' : 'text-text'}`}
          >
            {summary.reinforcement}/{DECK_RULES.reinforcementMax}
          </span>
        </p>
        {summary.isValid ? (
          <p className="rounded-lg bg-ok/15 px-3 py-1.5 text-sm font-semibold text-ok">✓ Deck válido para jogar</p>
        ) : (
          <ul className="space-y-0.5 rounded-lg bg-danger/10 px-3 py-1.5 text-sm text-danger">
            {summary.issues.map((issue, i) => (
              <li key={i}>• {issue.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div role="tablist" aria-label="Tipos de carta no deck" className="flex border-b border-border">
        {TABS.map((t) => {
          const selected = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t)}
              className={`relative flex flex-1 flex-col items-center py-2.5 transition-colors ${
                selected ? 'text-accent' : 'text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">{TAB_LABEL[t]}</span>
              <span className="font-mono text-lg font-bold leading-tight">
                {t === 'reinforcement' ? summary.reinforcement : t === 'token' ? summary.tokens : summary.byType[t]}
              </span>
              {selected && <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="min-h-48 flex-1 overflow-y-auto overscroll-contain p-4">
        {group.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            {tab === 'reinforcement'
              ? `Esquadrões [Squad] e Ninjas "Reinforcement" ficam aqui, fora do Deck: até ${DECK_RULES.reinforcementMax} cartas. Eles entram em jogo por efeitos de cartas ou, os Esquadrões, ao serem formados na Fase de Missão.`
              : tab === 'token'
                ? `Cartas de Token ficam aqui, fora do Deck: quantas quiser, mas ${DECK_RULES.copiesPerToken} cópia de cada.`
                : entries.length === 0
                ? 'Use o botão + nas cartas para montar seu deck.'
                : `Nenhuma carta do tipo ${CARD_TYPE_LABEL[tab]} no deck.`}
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-x-3 gap-y-6 pb-3">
            {group.map((entry) => (
              <DeckCard
                key={entry.card.id}
                entry={entry}
                blocked={blockedOf(entry.card)}
                onSelect={onSelect}
                onSetQty={onSetQty}
              />
            ))}
          </ul>
        )}
      </div>

      {entries.length > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
          <button
            type="button"
            onClick={() => confirm('Remover todas as cartas deste deck?') && onClear()}
            className="text-sm text-muted hover:text-danger"
          >
            Limpar deck
          </button>
          <PrintButton deck={deck} lookup={lookup} />
        </div>
      )}
    </div>
  );
}
