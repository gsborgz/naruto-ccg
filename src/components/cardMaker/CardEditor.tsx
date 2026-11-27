'use client';

import { compressImage, ImageTooLargeError } from '@/lib/images/compressImage';
import { translateAttribute } from '@/data/ptbr/glossary';
import { useEffect, useState } from 'react';
import {
  ATTRIBUTE_KANJI,
  COST_ICONS,
  attributeFrames,
  entranceIcons,
  handIcons,
  ATTRIBUTE_NAMES,
  attributeSlug,
  LAYOUT_LIST,
  MAX_ELEMENTS,
  MAX_ATTRIBUTES,
  attributeNames,
  elementVariants,
  cardLayout,
  typeIconVariants,
} from '@/lib/cardMaker/layouts';
import {
  switchLayout,
  VILLAGES,
  CUSTOM_ICON_SIZE,
  MAX_VILLAGES,
  cardVillages,
  withVillages,
  getArt,
  hasCharacteristics,
  hasEntranceCost,
  nameFontSize,
  NAME_WRAP_LABEL,
  resetArt,
  setArtImage,
  setArtFrame,
  type ArtLayer,
  type CustomCard,
  type ElementVariant,
  type EntranceIcon,
  type HandIcon,
  type JutsuCostPart,
  type LayoutId,
  type NameWrap,
  type Village,
} from '@/lib/cardMaker/model';
import { NAME_WRAPS } from '@/models/cardLayout';
import {
  CARD_TYPE_LABEL,
  ELEMENT_KANJI,
  ELEMENT_LABEL,
  type CardType,
  type ElementSymbol,
} from '@/models/card';

/** Alcance do controle deslizante do ajuste do nome (px); o campo numérico aceita qualquer valor. */
const NAME_SIZE_RANGE = 30;

const formatSize = (n: number) => String(Math.round(n * 100) / 100);

const ELEMENTS: ElementSymbol[] = [
  'fire',
  'water',
  'wind',
  'lightning',
  'earth',
  'void',
];
/** Nomes das vilas no seletor (os que existem no glossário PT-BR seguem ele). */
const VILLAGE_LABEL: Record<Village, string> = {
  leaf: 'Folha',
  sand: 'Areia',
  mist: 'Névoa',
  sound: 'Som',
  cloud: 'Nuvem',
  stone: 'Pedra',
  rain: 'Chuva',
  grass: 'Grama',
  waterfall: 'Cachoeira',
  snow: 'Neve',
  star: 'Estrela',
  'hot-water': 'Fontes Termais',
  moon: 'Lua',
  whirlpool: 'Redemoinho',
  lock: 'Cadeado',
  artisan: 'Artesãos',
  nadeshiko: 'Nadeshiko',
};
/** Nomes dos ícones de custo impressos; os criados no editor usam o nome deles (`name`) ou o id. */
const COST_ICON_LABELS: Record<string, string> = {
  'entrance-01': 'Shuriken verde',
  'entrance-02': 'Escudo',
  'entrance-03': 'Shuriken azul',
  'entrance-04': 'Entrada 04',
  'hand-01': 'Cartas vermelhas',
  'hand-02': 'Cartas douradas',
  'hand-03': 'Mão 03',
};
const costLabel = (id: string) => COST_ICONS[id as EntranceIcon]?.name || COST_ICON_LABELS[id] || id;
const ENTRANCE_ICON_OPTIONS = (): { value: EntranceIcon; label: string }[] => entranceIcons().map((value) => ({ value, label: costLabel(value) }));
const HAND_ICON_OPTIONS = (): { value: HandIcon; label: string }[] => handIcons().map((value) => ({ value, label: costLabel(value) }));

/**
 * Trata a imagem escolhida (reduz e comprime, ver `compressImage`). Ela fica no rascunho e só vai para o servidor
 * no **Salvar** do criador. WebP guarda a transparência da arte da frente.
 */
function loadArt(file: File, transparent: boolean): Promise<string> {
  return compressImage(file, { transparent });
}

const field =
  'rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent';
const input = `w-full min-w-0 ${field}`;
const label = 'flex flex-col gap-1 text-xs font-semibold text-muted';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <legend className="px-1 text-sm font-bold text-text">{title}</legend>
      {children}
    </fieldset>
  );
}

/** Uma forma de pagar o custo do Jutsu: símbolos de elemento + Chakra genérico opcional. */
function JutsuCostRow({
  part,
  onChange,
}: {
  part: JutsuCostPart;
  onChange: (part: JutsuCostPart) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      {part.symbols.map((s, i) => (
        <button
          key={i}
          type="button"
          title="Remover"
          onClick={() =>
            onChange({
              ...part,
              symbols: part.symbols.filter((_, j) => j !== i),
            })
          }
          className="rounded-md bg-surface-2 px-2 py-1 text-sm ring-1 ring-border hover:text-danger"
        >
          {ELEMENT_KANJI[s]} ✕
        </button>
      ))}
      <select
        aria-label="Adicionar símbolo"
        className={field}
        value=""
        onChange={(e) =>
          e.target.value &&
          onChange({
            ...part,
            symbols: [...part.symbols, e.target.value as ElementSymbol],
          })
        }
      >
        <option value="">+ símbolo</option>
        {ELEMENTS.map((e) => (
          <option key={e} value={e}>
            {ELEMENT_KANJI[e]} {ELEMENT_LABEL[e]}
          </option>
        ))}
      </select>
      {/* O Chakra genérico (círculo vermelho) é opcional: vazio = custo só com os símbolos. */}
      <label className="ml-2 flex items-center gap-2 text-xs font-semibold text-muted">
        <input
          type="checkbox"
          checked={part.generic !== ''}
          onChange={(e) =>
            onChange({ ...part, generic: e.target.checked ? '1' : '' })
          }
        />
        Chakra genérico
      </label>
      {part.generic !== '' && (
        <input
          aria-label="Chakra genérico"
          className={`${field} w-16 text-center`}
          value={part.generic.trim()}
          placeholder="1 ou X"
          // Campo apagado guarda ' ': continua marcado enquanto se digita (a carta só desenha valor não vazio).
          onChange={(e) =>
            onChange({ ...part, generic: e.target.value.trim() || ' ' })
          }
        />
      )}
    </div>
  );
}

/** Opções dos seletores de atributo: os que têm kanji, em ordem alfabética do nome impresso. */
/** Os atributos com kanji, em PT-BR (como no conteúdo do jogo; o kanji é achado pelo nome em PT-BR também). */
const ATTRIBUTE_OPTIONS = [...new Set(Object.values(ATTRIBUTE_NAMES).map(translateAttribute))].sort((a, b) => a.localeCompare(b, 'pt-BR'));

/**
 * Até 3 Atributos de Combate (a maioria dos Ninjas tem 1; 190 têm 2; os trios do S25 têm 3).
 * Guardados juntos, separados por "/" ("Genjutsu/Tree"), como `attribute.label`.
 */
function AttributeSelects({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const names = attributeNames(value);
  const setSlot = (slot: number, name: string) => {
    const next = [...names];
    if (name) next[slot] = name;
    else next.splice(slot);
    onChange(next.filter(Boolean).join('/'));
  };
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: MAX_ATTRIBUTES }, (_, slot) => {
        const current = names[slot] ?? '';
        // Cartas antigas (nome em inglês, ou sem kanji): mantém como opção para não perder o valor.
        const extra = current && !ATTRIBUTE_OPTIONS.includes(current) ? [current] : [];
        const noKanji = (n: string) => !ATTRIBUTE_KANJI.has(attributeSlug(n));
        return (
          <label key={slot} className={label}>
            {slot === 0 ? 'Atributo' : `${slot + 1}º atributo`}
            <select
              className={input}
              value={current}
              disabled={slot > 0 && !names[slot - 1]}
              onChange={(e) => setSlot(slot, e.target.value)}
            >
              <option value="">—</option>
              {[...extra, ...ATTRIBUTE_OPTIONS].map((n) => (
                <option key={n} value={n}>
                  {n === '?' ? '? (desconhecido)' : n}
                  {extra.includes(n) && noKanji(n) ? ' (sem kanji)' : ''}
                </option>
              ))}
            </select>
          </label>
        );
      })}
    </div>
  );
}

/**
 * Vilas à esquerda do nome (até `MAX_VILLAGES`): um seletor por vila, com o símbolo de renegado, e
 * um seletor vazio a mais para adicionar a próxima. Com 2 a carta põe na diagonal; com 3, em triângulo.
 */
function VillageSelects({ card, onChange }: { card: CustomCard; onChange: (card: CustomCard) => void }) {
  const villages = cardVillages(card);
  const slots = Math.min(villages.length + 1, MAX_VILLAGES);
  const setSlot = (slot: number, village: Village | null) => {
    const next = [...villages];
    if (village) next[slot] = { village, rogue: next[slot]?.rogue ?? false };
    else next.splice(slot, 1);
    onChange(withVillages(card, next));
  };
  const setRogue = (slot: number, rogue: boolean) =>
    onChange(withVillages(card, villages.map((v, i) => (i === slot ? { ...v, rogue } : v))));
  return (
    <div className="flex flex-col gap-1">
      <span className={label}>Vila{MAX_VILLAGES > 1 ? ` (até ${MAX_VILLAGES})` : ''}</span>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Array.from({ length: slots }, (_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <select
              aria-label={`Vila ${i + 1}`}
              className={input}
              value={villages[i]?.village ?? ''}
              onChange={(e) => setSlot(i, (e.target.value || null) as Village | null)}
            >
              <option value="">{i === 0 ? '—' : '+ adicionar'}</option>
              {VILLAGES.map((v) => (
                <option key={v} value={v}>
                  {VILLAGE_LABEL[v]}
                </option>
              ))}
            </select>
            {villages[i] && (
              <label className="flex items-center gap-2 text-xs font-semibold text-muted">
                <input type="checkbox" checked={villages[i].rogue} onChange={(e) => setRogue(i, e.target.checked)} />
                Renegado (rogue)
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Imagem, zoom e enquadramento de uma camada de arte. */
function ArtLayerControls({
  title,
  hint,
  card,
  layer,
  onChange,
  onError,
}: {
  title: string;
  hint?: string;
  card: CustomCard;
  layer: ArtLayer;
  onChange: (card: CustomCard) => void;
  onError: (message: string | null) => void;
}) {
  const art = getArt(card, layer);
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <label className={label}>
        {title}
        <input
          type="file"
          accept="image/*"
          className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-text"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              onError(null);
              onChange(setArtImage(card, layer, await loadArt(file, layer === 'front')));
            } catch (err) {
              onError(err instanceof ImageTooLargeError ? err.message : 'Não foi possível abrir essa imagem.');
            }
          }}
        />
        {hint && <span className="font-normal">{hint}</span>}
      </label>
      {art.src && (
        <>
          <label className={label}>
            Zoom ({art.zoom.toFixed(2)}×)
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.01}
              value={art.zoom}
              onChange={(e) => onChange(setArtFrame(card, layer, { zoom: Number(e.target.value) }))}
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
                  onChange={(e) => onChange(setArtFrame(card, layer, { [axis]: Number(e.target.value) }))}
                />
              </label>
            );
          })}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange(resetArt(card, layer))}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
            >
              Centralizar
            </button>
            <button
              type="button"
              onClick={() => onChange(setArtImage(card, layer, null))}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger"
            >
              Remover
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Ícone customizado: imagem enviada pelo jogador, desenhada logo abaixo do último elemento da carta, e a largura dela
 * (`CustomCard.customIcon`). Começa com a largura do ícone de elemento do layout.
 */
function CustomIconControls({
  card,
  defaultSize,
  onChange,
  onError,
}: {
  card: CustomCard;
  defaultSize: number;
  onChange: (card: CustomCard) => void;
  onError: (message: string | null) => void;
}) {
  const icon = card.customIcon;
  const remove = () => {
    const { customIcon: _removed, ...rest } = card;
    onChange(rest);
  };
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
      <label className={label}>
        Ícone customizado (abaixo dos elementos)
        <input
          type="file"
          accept="image/*"
          className="text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-text"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            try {
              onError(null);
              const src = await loadArt(file, true);
              const size = Math.round(Math.min(CUSTOM_ICON_SIZE.max, Math.max(CUSTOM_ICON_SIZE.min, icon?.size ?? defaultSize)));
              onChange({ ...card, customIcon: { src, size } });
            } catch (err) {
              onError(err instanceof ImageTooLargeError ? err.message : 'Não foi possível abrir essa imagem.');
            }
          }}
        />
        <span className="font-normal">
          Fica logo abaixo do último ícone de elemento. Use uma imagem com transparência (PNG) para o fundo não aparecer.
        </span>
      </label>
      {icon && (
        <>
          <label className={label}>
            Tamanho ({Math.round(icon.size)})
            <input
              type="range"
              min={CUSTOM_ICON_SIZE.min}
              max={CUSTOM_ICON_SIZE.max}
              step={1}
              value={icon.size}
              onChange={(e) => onChange({ ...card, customIcon: { ...icon, size: Number(e.target.value) } })}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ ...card, customIcon: { ...icon, size: defaultSize } })}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
            >
              Tamanho do elemento
            </button>
            <button
              type="button"
              onClick={remove}
              className="rounded-lg px-3 py-1.5 text-sm text-muted ring-1 ring-border hover:bg-surface-2 hover:text-danger"
            >
              Remover
            </button>
          </div>
        </>
      )}
    </div>
  );
}

interface Props {
  card: CustomCard;
  onChange: (card: CustomCard) => void;
  /** Camada que o arrastar na prévia move quando as camadas não estão ligadas. */
  artLayer: ArtLayer;
  onArtLayerChange: (layer: ArtLayer) => void;
  /**
   * `alter`: a carta é uma alter de uma carta do catálogo (`source`): os dados e os textos ficam travados
   * (os da carta); mudam o layout, a moldura do Atributo de Combate e as artes (fundo e frente, com o enquadramento).
   */
  mode?: 'full' | 'alter';
}

export function CardEditor({ card, onChange, artLayer, onArtLayerChange, mode = 'full' }: Props) {
  const set = <K extends keyof CustomCard>(key: K, value: CustomCard[K]) =>
    onChange({ ...card, [key]: value });
  const type = card.type;
  const spec = cardLayout(card);
  const baseNameSize = spec.name[type].size;
  const nameSize = card.nameSize ?? 0;

  // Características: o campo guarda o texto digitado (com espaços e "|" no fim) e a carta, a lista.
  const [characteristicsRaw, setCharacteristicsRaw] = useState(
    card.characteristics.join(' | '),
  );
  useEffect(
    () => setCharacteristicsRaw(card.characteristics.join(' | ')),
    [card.id],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const [artError, setArtError] = useState<string | null>(null);

  const setElement = (slot: number, element: ElementSymbol | '') => {
    const elements = [...card.elements];
    if (!element) elements.splice(slot, 1);
    else
      elements[slot] = {
        element,
        variant: elements[slot]?.variant ?? spec.elements.variant,
      };
    set('elements', elements.slice(0, MAX_ELEMENTS));
  };
  const setVariant = (slot: number, variant: ElementVariant) =>
    set(
      'elements',
      card.elements.map((el, i) => (i === slot ? { ...el, variant } : el)),
    );

  const artControls = (
    <>
      <ArtLayerControls
        title="Fundo (atrás da moldura)"
        card={card}
        layer="back"
        onChange={onChange}
        onError={setArtError}
      />
      <ArtLayerControls
        title="Frente (na frente da moldura, atrás do painel)"
        hint="Use uma imagem com transparência (PNG), como o personagem recortado."
        card={card}
        layer="front"
        onChange={onChange}
        onError={setArtError}
      />
      <CustomIconControls
        card={card}
        defaultSize={Math.round(spec.elements.pos.size)}
        onChange={onChange}
        onError={setArtError}
      />
      {artError && <p className="text-xs text-danger">{artError}</p>}
      {(card.art.src || card.artFront?.src) && (
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <input
              type="checkbox"
              checked={card.artLinked ?? true}
              onChange={(e) => set('artLinked', e.target.checked)}
            />
            Arrastar na prévia move as duas camadas juntas
          </label>
          {card.artLinked === false && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted" role="radiogroup">
              Arrastar na prévia:
              {(['back', 'front'] as const).map((l) => (
                <label key={l} className="flex items-center gap-1">
                  <input type="radio" checked={artLayer === l} onChange={() => onArtLayerChange(l)} />
                  {l === 'back' ? 'fundo' : 'frente'}
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-muted">
            Arraste a arte na prévia para enquadrar, ou use os controles de cada camada (só mexem nela).
          </p>
        </div>
      )}
    </>
  );

  if (mode === 'alter') {
    return (
      <div className="flex flex-col gap-4">
        <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
          <strong className="text-text">Alter</strong> de uma carta do catálogo: os dados e os textos são os da carta. Escolha
          o layout, envie as artes novas e enquadre na prévia. No montador de deck, a alter pode ser escolhida como o design
          da carta.
        </p>
        <Section title="Design">
          <label className={label}>
            Layout
            <select className={input} value={spec.id} onChange={(e) => onChange(switchLayout(card, e.target.value as LayoutId))}>
              {/* Só os layouts que têm o tipo da carta (a alter não muda o tipo). */}
              {LAYOUT_LIST.filter((l) => l.types.includes(type)).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          {type === 'ninja' && (
            <label className={label}>
              Moldura do Atributo de Combate
              <select
                className={input}
                value={card.attribute.frame}
                onChange={(e) => set('attribute', { ...card.attribute, frame: e.target.value as CustomCard['attribute']['frame'] })}
              >
                {attributeFrames().map((f) => (
                  <option key={f} value={f}>
                    Kunai {f}
                  </option>
                ))}
              </select>
            </label>
          )}
        </Section>
        <Section title="Arte">{artControls}</Section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Section title="Carta">
        <label className={label}>
          Layout
          <select
            className={input}
            value={spec.id}
            onChange={(e) =>
              onChange(switchLayout(card, e.target.value as LayoutId))
            }
          >
            {LAYOUT_LIST.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
                {l.types.length < 4
                  ? ` (só ${l.types.map((t) => CARD_TYPE_LABEL[t]).join(', ')})`
                  : ''}
              </option>
            ))}
          </select>
          <span className="font-normal">
            Trocar de layout carrega os ícones padrão dele (os do editor de layouts); depois dá para trocar cada um.
          </span>
        </label>
        <div
          className="flex flex-wrap gap-1"
          role="radiogroup"
          aria-label="Tipo"
        >
          {spec.types.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              onClick={() => set('type', t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 ring-border ${
                type === t
                  ? 'bg-accent text-bg ring-accent'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              }`}
            >
              {CARD_TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          <input
            type="checkbox"
            checked={card.token ?? false}
            onChange={(e) => set('token', e.target.checked || undefined)}
          />
          Token (no deck, vai para a parte Tokens: 1 cópia de cada, fora das 50 cartas e do Reforço)
        </label>
        {typeIconVariants(type).length > 0 && (
          <label className={label}>
            Ícone do tipo
            <select
              className={input}
              value={typeIconVariants(type).some((v) => v.id === card.typeVariant) ? card.typeVariant : ''}
              onChange={(e) => set('typeVariant', e.target.value || undefined)}
            >
              <option value="">Padrão</option>
              {typeIconVariants(type).map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={label}>
          Nome
          <textarea
            className={`${input} resize-y`}
            rows={2}
            value={card.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <span className="font-normal">Quebra sozinho quando não cabe; Enter pula linha.</span>
        </label>
        {/* div, e não label: o botão Restaurar seria o alvo do clique no rótulo. */}
        <div className={label}>
          <span className="flex items-center justify-between">
            <span>
              Tamanho do nome: {formatSize(nameFontSize(baseNameSize, nameSize))} px
              <span className="font-normal"> (layout: {formatSize(baseNameSize)})</span>
            </span>
            {nameSize !== 0 && (
              <button
                type="button"
                className="font-normal text-accent hover:underline"
                onClick={() => set('nameSize', 0)}
              >
                Restaurar
              </button>
            )}
          </span>
          <span className="flex items-center gap-2">
            <input
              type="range"
              className="min-w-0 flex-1"
              min={-NAME_SIZE_RANGE}
              max={NAME_SIZE_RANGE}
              step={0.5}
              value={Math.max(-NAME_SIZE_RANGE, Math.min(NAME_SIZE_RANGE, nameSize))}
              onChange={(e) => set('nameSize', Number(e.target.value))}
              aria-label="Ajuste do tamanho do nome"
            />
            <input
              type="number"
              // Sem `input` (que tem w-full): com ele o campo ocupa a linha e o slider some.
              className={`${field} w-20 shrink-0`}
              step={0.5}
              value={nameSize}
              onChange={(e) => {
                const value = Number(e.target.value);
                set('nameSize', Number.isFinite(value) ? value : 0);
              }}
              aria-label="Ajuste do tamanho do nome (px)"
            />
          </span>
          <span className="font-normal">Negativo diminui, positivo aumenta; 0 usa o tamanho do layout.</span>
        </div>
        <label className={label}>
          Quebra de linha do nome
          <select
            className={input}
            value={card.nameWrap ?? 'auto'}
            onChange={(e) => set('nameWrap', e.target.value === 'auto' ? undefined : (e.target.value as NameWrap))}
          >
            {NAME_WRAPS.map((w) => (
              <option key={w} value={w}>
                {NAME_WRAP_LABEL[w]}
              </option>
            ))}
          </select>
          <span className="font-normal">Duas linhas: quebra antes do parêntese ou no meio do nome (uma quebra digitada vale sempre).</span>
        </label>
        {spec.nameBanner && (
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <input
              type="checkbox"
              checked={card.nameBanner ?? spec.nameBanner.default}
              onChange={(e) => set('nameBanner', e.target.checked)}
            />
            Mancha preta atrás do nome
          </label>
        )}
        {spec.textBox[type] && (
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <input
              type="checkbox"
              checked={card.textDivider ?? spec.textDivider?.default ?? true}
              onChange={(e) => set('textDivider', e.target.checked)}
            />
            Linha acima do texto (a posição muda em Ajustar posições)
          </label>
        )}
        {spec.panelVariants && spec.panelVariants.length > 0 && (
          <label className={label}>
            Design
            <select
              className={input}
              value={spec.panelVariants.some((v) => v.id === card.panelVariant) ? card.panelVariant : ''}
              onChange={(e) => set('panelVariant', e.target.value || undefined)}
            >
              <option value="">{spec.panelLabel ?? 'Padrão'}</option>
              {spec.panelVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <div
          className="grid grid-cols-3 gap-3"
        >
          {Array.from({ length: MAX_ELEMENTS }, (_, slot) => {
            const el = card.elements[slot];
            const disabled = slot > 0 && !card.elements[slot - 1];
            return (
              <div key={slot} className="flex flex-col gap-1">
                <label className={label}>
                  {slot === 0 ? 'Elemento' : `${slot + 1}º elemento`}
                  <select
                    className={input}
                    disabled={disabled}
                    value={el?.element ?? ''}
                    onChange={(e) =>
                      setElement(slot, e.target.value as ElementSymbol | '')
                    }
                  >
                    <option value="">—</option>
                    {ELEMENTS.map((e) => (
                      <option key={e} value={e}>
                        {ELEMENT_KANJI[e]} {ELEMENT_LABEL[e]}
                      </option>
                    ))}
                  </select>
                </label>
                {el && elementVariants(el.element).length > 1 && (
                  <select
                    aria-label="Variante do ícone"
                    className={input}
                    value={el.variant}
                    onChange={(e) =>
                      setVariant(slot, e.target.value as ElementVariant)
                    }
                  >
                    {elementVariants(el.element).map((v) => (
                      <option key={v} value={v}>
                        Ícone {v}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Arte">
        {artControls}
        <label className={label}>
          Frase
          <textarea
            className={`${input} min-h-16`}
            value={card.flavor}
            onChange={(e) => set('flavor', e.target.value)}
            placeholder={'"Fala do personagem."'}
          />
        </label>
        {card.printedFlavor !== undefined && (
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            <input
              type="checkbox"
              checked={card.flavorShade ?? true}
              onChange={(e) => set('flavorShade', e.target.checked)}
            />
            Sombreado atrás da frase (apaga de leve a frase impressa no fundo)
          </label>
        )}
      </Section>

      <Section title="Dados">
        {hasCharacteristics(type) && (
          <div className="flex flex-col gap-3">
            <VillageSelects card={card} onChange={onChange} />
            <label className={label}>
              Características (separadas por |)
              <input
                className={input}
                value={characteristicsRaw}
                placeholder="Leaf | Genin | Male"
                onChange={(e) => {
                  setCharacteristicsRaw(e.target.value);
                  set(
                    'characteristics',
                    e.target.value
                      .split('|')
                      .map((c) => c.trim())
                      .filter(Boolean),
                  );
                }}
              />
            </label>
          </div>
        )}

        {hasEntranceCost(type) && (
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Custo de entrada
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
                <input
                  className={`${field} min-w-0 text-center`}
                  value={card.entranceCost}
                  onChange={(e) => set('entranceCost', e.target.value)}
                />
                <select
                  aria-label="Ícone do custo de entrada"
                  className={input}
                  value={card.entranceIcon}
                  onChange={(e) =>
                    set('entranceIcon', e.target.value as EntranceIcon)
                  }
                >
                  {ENTRANCE_ICON_OPTIONS().map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <label className={label}>
              Custo de mão
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
                <input
                  className={`${field} min-w-0 text-center`}
                  value={card.handCost}
                  onChange={(e) => set('handCost', e.target.value)}
                />
                <select
                  aria-label="Ícone do custo de mão"
                  className={input}
                  value={card.handIcon}
                  onChange={(e) => set('handIcon', e.target.value as HandIcon)}
                >
                  {HAND_ICON_OPTIONS().map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          </div>
        )}

        {type === 'jutsu' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted">
              Custo (símbolos de elemento e Chakra genérico opcional)
            </span>
            <JutsuCostRow
              part={card.jutsuCost}
              onChange={(part) =>
                set('jutsuCost', { ...card.jutsuCost, ...part })
              }
            />
            {(card.jutsuCost.alternatives ?? []).map((alt, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">or</span>
                <JutsuCostRow
                  part={alt}
                  onChange={(part) =>
                    set('jutsuCost', {
                      ...card.jutsuCost,
                      alternatives: card.jutsuCost.alternatives?.map((a, j) =>
                        j === i ? part : a,
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() =>
                    set('jutsuCost', {
                      ...card.jutsuCost,
                      alternatives: card.jutsuCost.alternatives?.filter(
                        (_, j) => j !== i,
                      ),
                    })
                  }
                  className="rounded-md px-2 py-1 text-xs text-muted ring-1 ring-border hover:text-danger"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                set('jutsuCost', {
                  ...card.jutsuCost,
                  alternatives: [
                    ...(card.jutsuCost.alternatives ?? []),
                    { symbols: [], generic: '1' },
                  ],
                })
              }
              className="self-start rounded-md px-2 py-1 text-xs text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
            >
              + custo alternativo (&quot;or&quot;)
            </button>
          </div>
        )}

        {type === 'ninja' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>
                Saudável (Combate/Suporte)
                <input
                  className={input}
                  value={card.healthy}
                  onChange={(e) => set('healthy', e.target.value)}
                />
              </label>
              <label className={label}>
                Ferido
                <input
                  className={input}
                  value={card.injured}
                  onChange={(e) => set('injured', e.target.value)}
                />
              </label>
            </div>
            <div className="grid grid-cols-[12rem_1fr] gap-3">
              <label className={label}>
                Moldura do atributo
                <select
                  className={input}
                  value={card.attribute.frame}
                  onChange={(e) =>
                    set('attribute', {
                      ...card.attribute,
                      frame: e.target.value as CustomCard['attribute']['frame'],
                    })
                  }
                >
                  {attributeFrames().map((f) => (
                    <option key={f} value={f}>
                      Kunai {f}
                    </option>
                  ))}
                </select>
              </label>
              <AttributeSelects
                value={card.attribute.label}
                onChange={(value) => set('attribute', { ...card.attribute, label: value })}
              />
            </div>
          </>
        )}

        {spec.textBox[type] ? (
          <label className={label}>
            Texto (um bloco por linha)
            <textarea
              className={`${input} min-h-32 font-mono text-xs`}
              value={card.text}
              onChange={(e) => set('text', e.target.value)}
              placeholder={'[[ABILITY NAME]]\n[Effect:] ...'}
            />
            <span className="font-normal">
              [negrito], {'{vermelho}'} e (azul): a marcação não aparece na
              carta; dobrada ([[ ]], {'{{ }}'}, (( ))) ela aparece. Dá para
              combinar ([{'{'}trecho{'}'}]). Para escrever o símbolo normal, use
              \ antes: \(3\). Ícones: ~1~ (ou ~X~) vira o Chakra genérico com o valor e ~fire~ (ou ~fogo~, ~water~,
              ~agua~...) o símbolo do elemento.
            </span>
          </label>
        ) : (
          <p className="text-xs text-muted">
            Este layout não tem texto de efeito.
          </p>
        )}
      </Section>
    </div>
  );
}

/**
 * Aba Editar das cartas do catálogo: só os textos (PT-BR) e os números da carta, sem o design (a carta do catálogo
 * mostra sempre a imagem impressa). Nos Jutsus, o custo pode ser o Chakra genérico (com um número) e/ou os ícones de
 * elemento: dá para escolher quais e quantos de cada.
 */
export function CardDataEditor({ card, onChange }: { card: CustomCard; onChange: (card: CustomCard) => void }) {
  const set = <K extends keyof CustomCard>(key: K, value: CustomCard[K]) => onChange({ ...card, [key]: value });
  const type = card.type;
  const [characteristicsRaw, setCharacteristicsRaw] = useState(card.characteristics.join(' | '));
  useEffect(() => setCharacteristicsRaw(card.characteristics.join(' | ')), [card.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const setJutsuCost = (jutsuCost: CustomCard['jutsuCost']) => set('jutsuCost', jutsuCost);

  return (
    <div className="flex flex-col gap-4">
      <Section title="Textos">
        <label className={label}>
          Nome
          <input className={input} value={card.name.replace(/\n/g, ' ')} onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className={label}>
          Texto (um bloco por linha)
          <textarea
            className={`${input} min-h-32 font-mono text-xs`}
            value={card.text}
            onChange={(e) => set('text', e.target.value)}
          />
          <span className="font-normal">
            [negrito], {'{vermelho}'} e (azul) marcam trechos; dobrada ([[ ]], {'{{ }}'}, (( ))) a marcação aparece. Para
            escrever o símbolo normal, use \ antes: \(3\). Ícones: ~1~ (ou ~X~) vira o Chakra genérico com o valor e
            ~fire~ (ou ~fogo~...) o símbolo do elemento.
          </span>
        </label>
        <label className={label}>
          Frase
          <textarea className={`${input} min-h-16`} value={card.flavor} onChange={(e) => set('flavor', e.target.value)} />
        </label>
        {hasCharacteristics(type) && (
          <label className={label}>
            Características (separadas por |)
            <input
              className={input}
              value={characteristicsRaw}
              onChange={(e) => {
                setCharacteristicsRaw(e.target.value);
                set(
                  'characteristics',
                  e.target.value
                    .split('|')
                    .map((c) => c.trim())
                    .filter(Boolean),
                );
              }}
            />
          </label>
        )}
        {type === 'ninja' && (
          <AttributeSelects value={card.attribute.label} onChange={(value) => set('attribute', { ...card.attribute, label: value })} />
        )}
      </Section>

      <Section title="Números">
        {hasEntranceCost(type) && (
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Custo de entrada
              <input className={`${input} text-center`} value={card.entranceCost} onChange={(e) => set('entranceCost', e.target.value)} />
            </label>
            <label className={label}>
              Custo de mão
              <input className={`${input} text-center`} value={card.handCost} onChange={(e) => set('handCost', e.target.value)} />
            </label>
          </div>
        )}
        {type === 'ninja' && (
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>
              Saudável (Combate/Suporte)
              <input className={input} value={card.healthy} onChange={(e) => set('healthy', e.target.value)} />
            </label>
            <label className={label}>
              Ferido
              <input className={input} value={card.injured} onChange={(e) => set('injured', e.target.value)} />
            </label>
          </div>
        )}
        {type === 'jutsu' && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted">
              Custo do Jutsu: ícones de elemento (quais e quantos de cada) e/ou o Chakra genérico com um número
            </span>
            <JutsuCostRow part={card.jutsuCost} onChange={(part) => setJutsuCost({ ...card.jutsuCost, ...part })} />
            {(card.jutsuCost.alternatives ?? []).map((alt, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted">ou</span>
                <JutsuCostRow
                  part={alt}
                  onChange={(part) =>
                    setJutsuCost({ ...card.jutsuCost, alternatives: card.jutsuCost.alternatives?.map((a, j) => (j === i ? part : a)) })
                  }
                />
                <button
                  type="button"
                  onClick={() => setJutsuCost({ ...card.jutsuCost, alternatives: card.jutsuCost.alternatives?.filter((_, j) => j !== i) })}
                  className="rounded-md px-2 py-1 text-xs text-muted ring-1 ring-border hover:text-danger"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setJutsuCost({ ...card.jutsuCost, alternatives: [...(card.jutsuCost.alternatives ?? []), { symbols: [], generic: '1' }] })
              }
              className="self-start rounded-md px-2 py-1 text-xs text-muted ring-1 ring-border hover:bg-surface-2 hover:text-text"
            >
              + custo alternativo (&quot;ou&quot;)
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
