import { ELEMENT_KANJI, ELEMENT_LABEL, type ElementSymbol } from '@/models/card';

const BG: Record<ElementSymbol, string> = {
  lightning: 'bg-el-lightning',
  fire: 'bg-el-fire',
  wind: 'bg-el-wind',
  water: 'bg-el-water',
  earth: 'bg-el-earth',
  void: 'bg-el-void',
};

export function ElementBadge({ element, size = 'sm' }: { element: ElementSymbol; size?: 'sm' | 'md' }) {
  return (
    <span
      title={ELEMENT_LABEL[element]}
      aria-label={ELEMENT_LABEL[element]}
      className={`inline-grid shrink-0 place-items-center rounded-full font-normal leading-none text-white ${BG[element]} ${
        size === 'sm' ? 'size-5 text-xs' : 'size-7 text-base'
      }`}
    >
      {ELEMENT_KANJI[element]}
    </span>
  );
}
