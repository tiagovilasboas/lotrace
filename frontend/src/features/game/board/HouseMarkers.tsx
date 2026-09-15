import { MAX_HOUSES } from '@lotrace/shared';
import type { ReactElement } from 'react';
import type { RingSide } from '@/features/game/board/ring-geometry.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type HouseMarkersProps = {
  count: number;
  side: RingSide;
};

function HouseGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 10 10" className="size-2.5 shrink-0 sm:size-3" aria-hidden>
      <path
        d="M1.15 4.25 5 1.35l3.85 2.9V8.7H1.15Z"
        fill="var(--success)"
        stroke="var(--board-ink)"
        strokeWidth="0.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HouseMarkers({ count, side }: HouseMarkersProps): ReactElement | null {
  const visible = Math.min(MAX_HOUSES, Math.max(0, Math.floor(count)));
  if (visible === 0) {
    return null;
  }

  const alongBar = side === 'west' || side === 'east';

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center gap-px px-px py-px',
        alongBar ? 'flex-col' : 'flex-row',
      )}
      aria-label={t('housesOnLot', { count: String(visible) })}
    >
      {Array.from({ length: visible }, (_, index) => (
        <HouseGlyph key={index} />
      ))}
    </span>
  );
}
