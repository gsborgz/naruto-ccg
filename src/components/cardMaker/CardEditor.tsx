'use client';

import { useEffect, useState } from 'react';
import {
  ATTRIBUTE_NAMES,
  LAYOUT_LIST,
  MAX_ELEMENTS,
  MAX_ATTRIBUTES,
  attributeNames,
  elementVariants,
  getLayout,
  typeIconVariants,
} from '@/lib/cardMaker/layouts';
import {
  ATTRIBUTE_FRAMES,
  withLayout,
  VILLAGES,
  MAX_VILLAGES,
  cardVillages,
  withVillages,
  getArt,
  hasCharacteristics,
  hasEntranceCost,
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
  type Village,
} from '@/lib/cardMaker/model';
import {
  CARD_TYPE_LABEL,
  ELEMENT_KANJI,
  ELEMENT_LABEL,
  type CardType,
  type ElementSymbol,
} from '@/models/card';

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
const ENTRANCE_ICONS: { value: EntranceIcon; label: string }[] = [
  { value: 'entrance-01', label: 'Shuriken verde' },
  { value: 'entrance-02', label: 'Escudo' },
  { value: 'entrance-03', label: 'Shuriken azul' },
  { value: 'entrance-04', label: 'Entrada 04' },
];
const HAND_ICONS: { value: HandIcon; label: string }[] = [
  { value: 'hand-01', label: 'Cartas vermelhas' },
  { value: 'hand-02', label: 'Cartas douradas' },
  { value: 'hand-03', label: 'Mão 03' },
];

/** Lado máximo da arte guardada: suficiente para a carta em 2× sem pesar no localStorage. */
const ART_MAX = 1500;

/**
 * Reduz a imagem e devolve um data URL: JPEG para o fundo (fica atrás da moldura) e WebP com
 * transparência para a arte da frente.
 */
async function loadArt(file: File, transparent = false): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const k = Math.min(1, ART_MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // A arte da frente precisa da transparência: WebP (o navegador cai para PNG se não suportar).
  return transparent ? canvas.toDataURL('image/webp', 0.9) : canvas.toDataURL('image/jpeg', 0.86);
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
const ATTRIBUTE_OPTIONS = Object.values(ATTRIBUTE_NAMES).sort((a, b) => a.localeCompare(b));

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
        // Cartas antigas podem ter um nome sem kanji: mantém como opção para não perder o valor.
        const extra = current && !ATTRIBUTE_OPTIONS.includes(current) ? [current] : [];
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
                  {extra.includes(n) ? ' (sem kanji)' : ''}
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
            } catch {
              onError('Não foi possível abrir essa imagem.');
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

interface Props {
  card: CustomCard;
  onChange: (card: CustomCard) => void;
  /** Camada que o arrastar na prévia move quando as camadas não estão ligadas. */
  artLayer: ArtLayer;
  onArtLayerChange: (layer: ArtLayer) => void;
}

export function CardEditor({ card, onChange, artLayer, onArtLayerChange }: Props) {
  const set = <K extends keyof CustomCard>(key: K, value: CustomCard[K]) =>
    onChange({ ...card, [key]: value });
  const type = card.type;
  const spec = getLayout(card.layout);

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

  return (
    <div className="flex flex-col gap-4">
      <Section title="Carta">
        <label className={label}>
          Layout
          <select
            className={input}
            value={spec.id}
            onChange={(e) =>
              onChange(withLayout(card, e.target.value as LayoutId))
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
            Trocar de layout mantém os ícones escolhidos (dá para misturar estilos).
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
        <label className={label}>
          Frase
          <textarea
            className={`${input} min-h-16`}
            value={card.flavor}
            onChange={(e) => set('flavor', e.target.value)}
            placeholder={'"Fala do personagem."'}
          />
        </label>
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
                  {ENTRANCE_ICONS.map((o) => (
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
                  {HAND_ICONS.map((o) => (
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
                  {ATTRIBUTE_FRAMES.map((f) => (
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
              \ antes: \(3\).
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
