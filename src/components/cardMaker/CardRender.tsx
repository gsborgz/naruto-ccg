'use client';

import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  CARD_H,
  CARD_W,
  JUTSU_COST_ELEMENT_ICON,
  MAX_ELEMENTS,
  NAME_BANNER_ASPECT,
  NAME_BANNER_URL,
  attributeIcon,
  attributeKanjiUrls,
  attributeNames,
  chakraIcon,
  costIcon,
  elementIcon,
  cardLayout,
  TEXT_DIVIDER_COLOR,
  textDividerColor,
  frameFor,
  panelFor,
  typeIcon,
  villageBox,
  villageIconUrl,
  type IconPlacement,
  type IconTextAlign,
  type LayoutSpec,
  type PlacedIcon,
  type PlacedNumber,
} from '@/lib/cardMaker/layouts';
import { cardCorner } from '@/lib/cardMaker/layouts/corners';
import { ATTRIBUTE_SHADOW } from '@/lib/cardMaker/icons';
import { assetUrl } from '@/lib/content/assets';
import {
  cardVillages,
  hasCharacteristics,
  hasEntranceCost,
  nameFontSize,
  parseCardText,
  wrapName,
  type CustomCard,
  type JutsuCostPart,
} from '@/lib/cardMaker/model';
import { CARD_FONT_VARIABLES, TEXT_BOLD_WEIGHT } from './fonts';

const TITLE_FONT = 'var(--font-card-title), var(--font-card-name), Georgia, serif';
const NAME_FONT = 'var(--font-card-name), Georgia, serif';
const BODY_FONT = 'var(--font-card-body), "Segoe UI", sans-serif';
const NUMBER_FONT = NAME_FONT;
const KANJI_FONT = '"Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", "MS Mincho", serif';

interface Props {
  card: CustomCard;
  /** Largura exibida, em px. A carta é desenhada em 750×1050 e escalada. */
  width: number;
  /** Opacidade da imagem original sobreposta (0 = escondida). */
  referenceOpacity?: number;
  /** Arrastar a arte: recebe o deslocamento em unidades da carta. */
  onArtMove?: (dx: number, dy: number) => void;
  className?: string;
}

/** Props comuns às partes da carta: a carta e a configuração do layout dela. */
interface PartProps {
  card: CustomCard;
  spec: LayoutSpec;
}

/** Deslocamento e alinhamento de um texto do ícone em relação ao ponto dele (`IconTextAlign`; padrão: centrado). */
const ALIGN_SHIFT: Record<IconTextAlign, string> = { left: '0%', center: '-50%', right: '-100%' };
const SVG_ANCHOR: Record<IconTextAlign, 'start' | 'middle' | 'end'> = { left: 'start', center: 'middle', right: 'end' };

/** Contorno de texto: o traço fica por trás do preenchimento (`paint-order`). */
function stroke(color: string, width: number): CSSProperties {
  return { WebkitTextStroke: `${width}px ${color}`, paintOrder: 'stroke fill' };
}

function Img({ src, x, y, w, h, style }: { src: string; x: number; y: number; w: number; h?: number; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={assetUrl(src)}
      alt=""
      draggable={false}
      // maxWidth: o preflight do Tailwind limita <img> à largura do pai.
      style={{ position: 'absolute', left: x, top: y, width: w, height: h ?? 'auto', maxWidth: 'none', pointerEvents: 'none', ...style }}
    />
  );
}

const ICON_LABEL_FONT = 'var(--font-card-icon-label), "Segoe UI", sans-serif';
/** Altura das maiúsculas da Montserrat, em em. */
const ICON_LABEL_CAP = 0.7;

/**
 * Ícone de tipo ou de elemento: a arte e, por cima, o nome escrito de lado (lido de baixo para cima),
 * no estilo do arquivo do ícone (src/lib/cardMaker/icons/). O texto tem o comprimento medido no ícone
 * impresso (`textLength`), então fica igual em qualquer fonte.
 */
function NamedIcon({ icon }: { icon: PlacedIcon }) {
  const { art, label } = icon;
  const filter = `icon-label-${useId().replace(/:/g, '')}`;
  const size = label.cap / ICON_LABEL_CAP;
  const { shadow } = label;
  return (
    <>
      <Img src={icon.url} x={art.x} y={art.y} w={art.w} h={art.h} />
      <svg
        width={CARD_W}
        height={CARD_H}
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          {/* Sombra para a direita da carta (para "baixo" do texto deitado). */}
          <filter id={filter} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx={label.cap * shadow.dx}
              dy={label.cap * shadow.dy}
              stdDeviation={label.cap * shadow.blur}
              floodColor={shadow.color}
              floodOpacity={shadow.opacity}
            />
          </filter>
        </defs>
        <g filter={`url(#${filter})`}>
          <text
            x={label.cx}
            y={label.cy + label.cap / 2}
            transform={`rotate(-90 ${label.cx} ${label.cy})`}
            textAnchor={SVG_ANCHOR[label.align ?? 'center']}
            textLength={label.length}
            lengthAdjust="spacingAndGlyphs"
            fontFamily={ICON_LABEL_FONT}
            fontWeight={label.weight}
            fontSize={size}
            fill={label.color}
            stroke={label.stroke}
            strokeWidth={label.cap * label.strokeWidth}
            strokeLinejoin="round"
            paintOrder="stroke fill"
          >
            {label.text}
          </text>
        </g>
      </svg>
    </>
  );
}

/**
 * Reduz a fonte do elemento até o conteúdo caber em `maxWidth`/`maxHeight` (unidades da carta).
 * Mede de novo quando o conteúdo muda e quando as fontes terminam de carregar.
 */
function useFit(ref: React.RefObject<HTMLElement | null>, size: number, deps: unknown[], maxWidth?: number, maxHeight?: number) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let s = size;
      el.style.fontSize = `${s}px`;
      while (
        s > size * 0.5 &&
        ((maxWidth !== undefined && el.scrollWidth > maxWidth + 0.5) ||
          (maxHeight !== undefined && el.scrollHeight > maxHeight + 0.5))
      ) {
        s -= 0.25;
        el.style.fontSize = `${s}px`;
      }
    };
    fit();
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, maxWidth, maxHeight, ...deps]);
}

/** "Susano'o (Sasuke)" → ["Susano'o", "(Sasuke)"], para layouts que põem os parênteses embaixo. */
function splitParentheses(name: string): [string, string | null] {
  const match = /^([\s\S]*\S)\s*(\([^()]+\))$/.exec(name.trim());
  return match ? [match[1], match[2]] : [name, null];
}

/** Fonte dos parênteses no fim do nome, em fração da fonte do nome (padrão de todos os layouts). */
const NAME_PARENTHESES_SCALE = 0.75;

/**
 * "Hinata Hyuga (Kimono)" → ["Hinata Hyuga ", "(Kimono)"]; o separador (espaço ou quebra de linha) fica na 1ª
 * parte. Sem parênteses no fim (ou o nome todo entre parênteses): [nome, null].
 */
function splitTrailingParentheses(name: string): [string, string | null] {
  const match = /^([\s\S]*\S[ \t\r\n]+)(\([^()]+\))$/.exec(name);
  return match ? [match[1], match[2]] : [name, null];
}

/** Altura de linha do nome quando ele ocupa mais de uma linha (em `em`). */
const NAME_LINE_HEIGHT = 0.95;

/** Fonte do nome em mais de uma linha, em relação ao tamanho de uma linha só. */
const NAME_MULTILINE_SCALE = 0.9;

/**
 * Altura extra que o nome em mais de uma linha pode ocupar além da área do nome (`maxHeight`), centrado nela: sem isso,
 * cada linha a mais encolhe muito a fonte.
 */
const NAME_MULTILINE_HEIGHT = 1.35;

/**
 * Ajusta o nome: numa linha só, reduz a fonte até 80%; se ainda não couber (ou se o nome tiver
 * quebra manual), deixa quebrar linha, começa um pouco menor (`NAME_MULTILINE_SCALE`) e reduz até o
 * bloco caber em `maxWidth` × `maxHeight` (com a folga `NAME_MULTILINE_HEIGHT`). Os espaços digitados são mantidos (`pre`/`pre-wrap`).
 */
function useFitName(
  ref: React.RefObject<HTMLElement | null>,
  size: number,
  maxWidth: number,
  maxHeight: number,
  deps: unknown[],
  singleLine = false,
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fits = (height = maxHeight) => el.scrollWidth <= maxWidth + 0.5 && el.scrollHeight <= height + 0.5;
    const shrink = (from: number, min: number, height = maxHeight) => {
      let s = from;
      el.style.fontSize = `${s}px`;
      while (s > min && !fits(height)) {
        s -= 0.25;
        el.style.fontSize = `${s}px`;
      }
      return fits(height);
    };
    const fit = () => {
      const manualBreak = (el.textContent ?? '').includes('\n');
      if (!manualBreak) {
        el.style.whiteSpace = 'pre';
        el.style.lineHeight = '1';
        // Uma linha só (`nameWrap: 'single'`): encolhe o quanto precisar, sem quebrar.
        if (shrink(size, size * (singleLine ? 0.4 : 0.8)) || singleLine) return;
      }
      el.style.whiteSpace = 'pre-wrap';
      el.style.lineHeight = String(NAME_LINE_HEIGHT);
      shrink(size * NAME_MULTILINE_SCALE, size * 0.4, maxHeight * NAME_MULTILINE_HEIGHT);
    };
    fit();
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, maxWidth, maxHeight, singleLine, ...deps]);
}

function CardName({ card, spec }: PartProps) {
  const style = spec.name[card.type];
  const ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  // Só tira as quebras de linha das pontas: espaços (inclusive no começo) servem para ajustar a posição.
  const full = card.name.trim() ? card.name.replace(/^[\r\n]+|[\r\n]+$/g, '') : 'Nome da carta';
  const [first, sub] = style.parenthesesBelow ? splitParentheses(full) : [full, null];
  // Quebra de linha escolhida na carta (automática, uma linha só ou duas linhas).
  const main = wrapName(first, card.nameWrap);
  const height = style.maxHeight ?? style.size * 1.5;
  // Fonte do layout mais o ajuste da carta (a área do nome continua a mesma); a 2ª linha acompanha na mesma proporção.
  const size = nameFontSize(style.size, card.nameSize);
  const subSize = (style.parenthesesBelow?.size ?? 0) * (size / style.size);
  useFitName(ref, size, style.maxWidth, height, [main, card.type, spec.id], card.nameWrap === 'single');
  useFit(subRef, subSize, [sub, card.type, spec.id], style.maxWidth);
  // A fonte do título já tem a espessura impressa: sem negrito sintetizado.
  const text = (size: number): CSSProperties => ({
    fontFamily: TITLE_FONT,
    fontWeight: 400,
    fontSynthesis: 'none',
    fontSize: size,
    lineHeight: 1,
    // `pre`: mantém os espaços extras digitados no nome.
    whiteSpace: 'pre',
    textAlign: style.align,
    color: style.color,
    fontVariant: style.smallCaps ? 'small-caps' : undefined,
    ...(style.stroke ? stroke(style.stroke, 6) : {}),
  });
  const line = (cy: number, h: number): CSSProperties => ({
    position: 'absolute',
    top: cy - h / 2,
    height: h,
    width: style.maxWidth,
    left: style.align === 'center' ? style.x - style.maxWidth / 2 : style.x,
    display: 'flex',
    alignItems: 'center',
    justifyContent: style.align === 'center' ? 'center' : 'flex-start',
  });
  return (
    <>
      <div style={line(style.cy, height)}>
        <div ref={ref} style={text(size)}>
          {(() => {
            // Parênteses no fim do nome, menores (na mesma linha ou na de baixo).
            const [before, paren] = splitTrailingParentheses(main);
            if (!paren) return main;
            return (
              <>
                {before}
                <span style={{ fontSize: `${style.parenthesesScale ?? NAME_PARENTHESES_SCALE}em` }}>{paren}</span>
              </>
            );
          })()}
        </div>
      </div>
      {sub && style.parenthesesBelow && (
        <div style={line(style.cy + style.parenthesesBelow.dy, style.parenthesesBelow.size * 1.4)}>
          <div ref={subRef} style={text(subSize)}>
            {sub}
          </div>
        </div>
      )}
    </>
  );
}

function Characteristics({ card, spec }: PartProps) {
  const style = spec.characteristics[card.type === 'client' ? 'client' : 'ninja'];
  const ref = useRef<HTMLDivElement>(null);
  useFit(ref, style.size, [card.characteristics.join('|'), spec.id, card.type], style.maxWidth);
  const height = style.size * 1.5;
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: style.x,
        top: style.cy - height / 2,
        width: style.maxWidth,
        lineHeight: `${height}px`,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        fontFamily: BODY_FONT,
        fontWeight: 700,
        color: style.color,
      }}
    >
      {card.characteristics.map((c, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: style.separator, fontWeight: 400 }}> | </span>}
          {c}
        </span>
      ))}
    </div>
  );
}

/** Escala da fonte do texto de efeito sobre o tamanho do layout (vale para todas as cartas montadas). */
const EFFECT_TEXT_SCALE = 0.92;

function EffectText({ card, spec }: PartProps) {
  const style = spec.textBox[card.type];
  const ref = useRef<HTMLDivElement>(null);
  const blocks = parseCardText(card.text);
  const size = (style?.size ?? 0) * EFFECT_TEXT_SCALE;
  useFit(ref, size, [card.text, card.type, spec.id], undefined, style ? style.bottom - style.top : undefined);
  // Layouts sem texto de efeito (ex.: layout 5).
  if (!style) return null;
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: style.x,
        top: style.top,
        width: style.w,
        fontFamily: BODY_FONT,
        fontSize: size,
        fontWeight: style.weight ?? 600,
        lineHeight: style.lineHeight / style.size,
        color: style.color,
        ...(style.stroke ? stroke(style.stroke, 1.5) : {}),
      }}
    >
      {blocks.map((runs, i) => (
        <p key={i} style={{ margin: 0, marginTop: i > 0 ? `${style.gap / style.size}em` : 0 }}>
          {runs.map((run, j) => (
            <span
              key={j}
              style={{
                fontWeight: run.bold ? TEXT_BOLD_WEIGHT : undefined,
                color: run.color ? spec.markColor[card.type][run.color] : undefined,
              }}
            >
              {run.text}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

/**
 * Sombreado da frase quando a arte de fundo é a carta impressa (`printedFlavor`): um brilho escuro em volta das
 * letras (camadas de `text-shadow`, da mais justa à mais aberta) que apaga de leve a frase impressa por baixo,
 * acompanhando o texto em vez de uma caixa.
 */
const FLAVOR_SHADE = '0 0 4px rgba(10,10,14,0.8), 0 0 9px rgba(10,10,14,0.6), 0 0 16px rgba(10,10,14,0.45)';

/**
 * Linha acima do texto de efeito (`LayoutSpec.textDivider`): um traço de pincel que afina nas pontas, centrado
 * `gap` px acima do topo da caixa de texto e com a largura dela.
 */
function TextDivider({ card, spec }: PartProps) {
  const box = spec.textBox[card.type];
  const style = spec.textDivider;
  if (!box || !style || !(card.textDivider ?? style.default)) return null;
  const w = box.w - style.inset * 2;
  const h = style.thickness;
  if (w <= 0 || h <= 0) return null;
  // Cor própria do tipo de carta no layout (`textDividerColor`) ou a padrão.
  const color = textDividerColor(spec, card.type) ?? TEXT_DIVIDER_COLOR;
  return (
    <svg
      viewBox="0 0 1000 20"
      preserveAspectRatio="none"
      style={{ position: 'absolute', left: box.x + style.inset, top: box.top - style.gap - h / 2, width: w, height: h, overflow: 'visible', pointerEvents: 'none' }}
    >
      {/* Traço principal: mais grosso no primeiro terço, afinando até as pontas. */}
      <path d="M0,10 C60,5 260,1 450,2 C700,3 900,6 1000,10 C900,13 700,17 450,18 C260,19 60,15 0,10 Z" fill={color} />
      {/* Fiapo do pincel na borda de cima. */}
      <path d="M20,9 C200,3 500,3 980,9" fill="none" stroke={color} strokeWidth={1.2} opacity={0.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Flavor({ card, spec }: PartProps) {
  const style = spec.flavor[card.type];
  if (!card.flavor.trim()) return null;
  const shade = card.printedFlavor !== undefined && (card.flavorShade ?? true);
  return (
    <div
      style={{
        position: 'absolute',
        left: style.x,
        width: style.w,
        bottom: CARD_H - style.bottom,
        fontFamily: BODY_FONT,
        fontSize: style.size,
        fontWeight: 600,
        lineHeight: `${style.lineHeight}px`,
        color: '#fff',
        ...stroke('rgba(20,20,20,0.85)', 4),
        ...(shade && { textShadow: FLAVOR_SHADE }),
      }}
    >
      {card.flavor}
    </div>
  );
}

/** Ícone de custo de entrada ou de mão: a posição e o tamanho vêm do layout; o número, do ícone. */
function CostIcon({ icon, placement, value }: { icon: Parameters<typeof costIcon>[1]; placement: IconPlacement; value: string }) {
  const { url, image, number } = costIcon(placement, icon);
  return (
    <>
      <Img src={url} x={image.x} y={image.y} w={image.w} />
      <OutlinedNumber number={number} text={value} />
    </>
  );
}

/** Número sobre um ícone, nas medidas do arquivo do ícone (`PlacedNumber`). */
function OutlinedNumber({ number, text, rotate }: { number: PlacedNumber; text: string; rotate?: number }) {
  if (!text) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: number.cx,
        top: number.cy,
        transform: `translate(${ALIGN_SHIFT[number.align ?? 'center']}, -50%)${rotate ? ` rotate(${rotate}deg)` : ''}`,
        fontFamily: NUMBER_FONT,
        fontWeight: 700,
        fontSize: number.size,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: number.color,
        ...stroke(number.stroke, number.strokeWidth),
      }}
    >
      {text}
    </div>
  );
}

/** Uma forma de pagar o custo: símbolos e Chakra genérico, separados por "|". */
function jutsuCostParts(part: JutsuCostPart, style: NonNullable<LayoutSpec['jutsuCost']>, key: string): ReactNode[] {
  const parts: ReactNode[] = part.symbols.map((element, i) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={`${key}s${i}`}
      src={assetUrl(JUTSU_COST_ELEMENT_ICON[element])}
      alt=""
      draggable={false}
      style={{ width: style.elementSize, height: style.elementSize, maxWidth: 'none' }}
    />
  ));
  const generic = part.generic.trim();
  if (generic) {
    const chakra = chakraIcon(style.chakraSize);
    parts.push(
      <span key={`${key}g`} style={{ position: 'relative', width: chakra.inline.w, height: chakra.inline.h, display: 'inline-block' }}>
        <Img src={chakra.url} x={chakra.image.x} y={chakra.image.y} w={chakra.image.w} h={chakra.image.h} />
        <OutlinedNumber number={chakra.number} text={generic} />
      </span>,
    );
  }
  return parts.map((node, i) => (
    <span key={`${key}${i}`} style={{ display: 'contents' }}>
      {/* O "|" fica colado no símbolo anterior (margens medidas nos exemplos). */}
      {i > 0 && (
        <span style={{ color: style.color, fontSize: style.separatorSize, fontFamily: BODY_FONT, margin: style.separatorMargin }}>|</span>
      )}
      {node}
    </span>
  ));
}

function JutsuCost({ card, spec }: PartProps) {
  const style = spec.jutsuCost;
  if (!style) return null;
  const options = [card.jutsuCost, ...(card.jutsuCost.alternatives ?? [])].filter(
    (o) => o.symbols.length > 0 || o.generic.trim(),
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: style.x,
        top: style.cy - 25,
        height: 50,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {options.map((option, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && (
            <span style={{ fontFamily: NAME_FONT, fontSize: style.orSize, color: style.orColor, margin: style.orMargin, ...stroke('#2a160b', 3) }}>
              or
            </span>
          )}
          {jutsuCostParts(option, style, `o${i}`)}
        </span>
      ))}
    </div>
  );
}

function CombatAttribute({ card, spec }: PartProps) {
  const { frame, kanji, label } = card.attribute;
  // Medidas da moldura (icons/combat-attributes/), no tamanho do layout.
  const icon = attributeIcon(spec, frame);
  const { circle, box } = icon;
  const labelSize = icon.label.size;
  // Vários atributos: só os nomes, um por linha, sem kanji. Um atributo: o kanji pela imagem dele
  // (o texto digitado só vale para cartas antigas cujo nome não tem imagem).
  const labelLines = attributeNames(label);
  const single = labelLines.length <= 1;
  const kanjiUrl = single ? attributeKanjiUrls(label)?.[0] : undefined;
  const legacyKanji = single && !kanjiUrl ? kanji : undefined;
  const hasKanji = Boolean(kanjiUrl || legacyKanji);
  // Vários atributos (sem kanji) têm o círculo todo para os nomes: fonte um pouco maior,
  // limitada para a linha mais comprida caber no círculo (~0,65 da fonte por letra).
  const longestLine = Math.max(...labelLines.map((line) => line.length), 1);
  const fontSize = single ? labelSize : Math.min(labelSize * icon.label.multiMax, (circle.r * 1.6) / (longestLine * 0.65));
  const kanjiSize = circle.r * icon.kanji.size;
  const kanjiCy = circle.cy + circle.r * icon.kanji.dy;
  const [dy1, dy2, dy3] = icon.label.dyWithKanji;
  const shadow = ATTRIBUTE_SHADOW;
  const tight = circle.r * shadow.tight;
  const soft = circle.r * shadow.soft;
  // Sombra do kanji (imagem): segue o contorno do desenho. Do texto: `text-shadow` com as mesmas medidas.
  const imageShadow = `drop-shadow(0 0 ${tight}px ${shadow.color}) drop-shadow(0 0 ${soft}px ${shadow.color})`;
  const textShadow = `0 0 ${tight}px ${shadow.color}, 0 0 ${soft}px ${shadow.color}`;
  return (
    <>
      <Img src={icon.url} x={box.x} y={box.y} w={box.w} h={box.h} />
      {kanjiUrl && (
        <Img
          src={kanjiUrl}
          x={circle.cx - kanjiSize / 2}
          y={kanjiCy - kanjiSize / 2}
          w={kanjiSize}
          h={kanjiSize}
          style={{ filter: imageShadow }}
        />
      )}
      {legacyKanji && (
        <div
          style={{
            position: 'absolute',
            left: circle.cx,
            top: kanjiCy,
            transform: 'translate(-50%, -50%)',
            fontFamily: KANJI_FONT,
            fontWeight: 700,
            fontSize: circle.r * icon.kanji.textSize,
            lineHeight: 1,
            color: icon.kanji.textColor,
            textShadow,
            ...stroke(icon.kanji.textStroke, 2),
          }}
        >
          {kanji}
        </div>
      )}
      {label && (
        <div
          style={{
            position: 'absolute',
            left: circle.cx,
            // Sem kanji, o nome do atributo vai no meio do círculo (ex.: layout 5, "Weapon").
            top: hasKanji ? circle.cy + circle.r * (labelLines.length > 2 ? dy3 : labelLines.length > 1 ? dy2 : dy1) : circle.cy,
            transform: 'translate(-50%, -50%)',
            textAlign: icon.label.align ?? 'center',
            fontFamily: BODY_FONT,
            fontWeight: 700,
            fontSize,
            textTransform: icon.label.uppercase ? 'uppercase' : undefined,
            letterSpacing: 0.3,
            lineHeight: 1.1,
            whiteSpace: 'pre',
            color: icon.label.color,
            textShadow,
            // O traço fica metade atrás da letra (`paint-order`): o dobro para aparecer `strokeWidth` em volta.
            ...(icon.label.strokeWidth > 0 ? stroke(icon.label.stroke, icon.label.strokeWidth * 2) : {}),
          }}
        >
          {labelLines.length > 1 ? labelLines.join('\n') : label}
        </div>
      )}
      <OutlinedNumber number={icon.healthy} text={card.healthy} />
      <OutlinedNumber number={icon.injured} text={card.injured} rotate={-90} />
    </>
  );
}

/**
 * Imagem de uma camada de arte, enquadrada sobre a carta inteira ("cobrir" + deslocamento + zoom).
 * A imagem é desenhada inteira, no tamanho natural escalado para cobrir a carta (sem `object-fit`,
 * que recortaria a imagem na caixa dela): ao arrastar ou diminuir o zoom, aparece o resto da imagem,
 * e só a borda da carta corta.
 */
function ArtImage({ art }: { art: CustomCard['art'] }) {
  const [natural, setNatural] = useState<{ src: string; w: number; h: number } | null>(null);
  if (!art.src) return null;
  const size = natural?.src === art.src ? natural : null;
  const fit = size ? Math.max(CARD_W / size.w, CARD_H / size.h) : 1;
  const w = size ? size.w * fit : CARD_W;
  const h = size ? size.h * fit : CARD_H;
  const measure = (img: HTMLImageElement | null) => {
    // Imagem já carregada (cache) antes do React ligar o onLoad.
    if (img?.complete && img.naturalWidth && natural?.src !== art.src) {
      setNatural({ src: art.src!, w: img.naturalWidth, h: img.naturalHeight });
    }
  };
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={measure}
      src={assetUrl(art.src)}
      alt=""
      draggable={false}
      onLoad={(e) => setNatural({ src: art.src!, w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
      style={{
        position: 'absolute',
        left: (CARD_W - w) / 2,
        top: (CARD_H - h) / 2,
        width: w,
        height: h,
        maxWidth: 'none',
        visibility: size ? 'visible' : 'hidden',
        transform: `translate(${art.x}px, ${art.y}px) scale(${art.zoom})`,
        pointerEvents: 'none',
      }}
    />
  );
}

/**
 * Arte de fundo (atrás da moldura) e superfície de arrastar. O arrastar vale para as duas camadas:
 * quem decide qual camada mexe é `onArtMove` (ver `moveArt`).
 */
function Art({ card, onArtMove, scale }: { card: CustomCard; onArtMove?: Props['onArtMove']; scale: number }) {
  const drag = useRef<{ x: number; y: number } | null>(null);
  const hasArt = Boolean(card.art.src || card.artFront?.src);
  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#2b2f3a', cursor: onArtMove && hasArt ? 'grab' : undefined, touchAction: onArtMove ? 'none' : undefined }}
      onPointerDown={(e) => {
        if (!onArtMove || !hasArt) return;
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current || !onArtMove) return;
        const dx = (e.clientX - drag.current.x) / scale;
        const dy = (e.clientY - drag.current.y) / scale;
        drag.current = { x: e.clientX, y: e.clientY };
        onArtMove(dx, dy);
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <ArtImage art={card.art} />
    </div>
  );
}

/**
 * Carta do criador montada a partir do layout dela (`card.layout`): moldura + ícones + textos nas
 * posições da configuração do layout (`src/lib/cardMaker/layouts/`).
 */
export function CardRender({ card, width, referenceOpacity = 0, onArtMove, className }: Props) {
  const scale = width / CARD_W;
  // O layout com as posições ajustadas só nesta carta.
  const spec = cardLayout(card);
  const type = card.type;
  const frame = frameFor(spec, type, card.panelVariant);
  const panel = panelFor(spec, type, card.panelVariant);
  // Cantos com o raio da moldura (senão a arte aparece fora do canto arredondado dela).
  const corner = cardCorner(card.layout, type, card.panelVariant) * scale;
  const parts = { card, spec };

  return (
    <div
      className={className}
      // textAlign: a carta não herda o alinhamento de quem a contém (ex.: o <button> da grade centraliza o texto).
      style={{ position: 'relative', width, height: width * (CARD_H / CARD_W), overflow: 'hidden', borderRadius: corner, textAlign: 'left' }}
    >
      <div
        className={CARD_FONT_VARIABLES}
        style={{ position: 'absolute', left: 0, top: 0, width: CARD_W, height: CARD_H, transform: `scale(${scale})`, transformOrigin: '0 0' }}
      >
        <Art card={card} onArtMove={onArtMove} scale={scale} />
        {frame && <Img src={frame} x={0} y={0} w={CARD_W} h={CARD_H} />}
        {/* Arte da frente: na frente da moldura e atrás do painel (ex.: personagem saindo da moldura). */}
        {card.artFront?.src && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <ArtImage art={card.artFront} />
          </div>
        )}
        <Flavor {...parts} />
        {panel && <Img src={panel} x={0} y={0} w={CARD_W} h={CARD_H} />}
        {/* Linha acima do texto: logo por cima do painel e atrás dos ícones (Atributo de Combate, vila, custos...). */}
        <TextDivider {...parts} />
        {/* Tipo e elementos por cima do painel (ex.: layout 3, cuja mancha do nome vem no painel). */}
        <NamedIcon icon={typeIcon(spec, type, card.typeVariant)} />
        {card.elements.slice(0, MAX_ELEMENTS).map((el, i) => (
          <NamedIcon key={i} icon={elementIcon(spec, el, i, card.elements[0])} />
        ))}

        {type === 'ninja' && <CombatAttribute {...parts} />}

        {hasCharacteristics(type) &&
          cardVillages(card).map((mark, i, all) => {
            const box = villageBox(spec, mark.village, i, all.length);
            return <Img key={i} src={villageIconUrl(mark.village, mark.rogue)} x={box.x} y={box.y} w={box.w} h={box.h} />;
          })}
        {spec.nameBanner && (card.nameBanner ?? spec.nameBanner.default) && (
          <Img
            src={NAME_BANNER_URL}
            x={spec.nameBanner.cx - spec.nameBanner.w / 2}
            y={spec.nameBanner.cy - (spec.nameBanner.w * NAME_BANNER_ASPECT) / 2}
            w={spec.nameBanner.w}
            h={spec.nameBanner.w * NAME_BANNER_ASPECT}
          />
        )}
        <CardName {...parts} />
        {hasEntranceCost(type) &&
          (() => {
            const cost = spec.cost[type === 'mission' ? 'mission' : type === 'client' ? 'client' : 'ninja'];
            return (
              <>
                <CostIcon icon={card.entranceIcon} placement={cost.entrance} value={card.entranceCost} />
                <CostIcon icon={card.handIcon} placement={cost.hand} value={card.handCost} />
              </>
            );
          })()}
        {type === 'jutsu' && <JutsuCost {...parts} />}
        {hasCharacteristics(type) && <Characteristics {...parts} />}
        <EffectText {...parts} />

        {referenceOpacity > 0 && card.reference && (
          <Img src={card.reference} x={0} y={0} w={CARD_W} h={CARD_H} style={{ opacity: referenceOpacity }} />
        )}
      </div>
    </div>
  );
}
