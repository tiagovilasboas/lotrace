import { isHotel, MAX_HOUSES } from '@lotrace/shared';
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
    <svg viewBox="0 0 12 12" className="size-3.5 shrink-0" aria-hidden>
      <path
        d="M1.2 5.1 6 1.6l4.8 3.5V10.6H1.2Z"
        fill="var(--success)"
        stroke="var(--board-ink)"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HotelGlyph(): ReactElement {
  return (
    <svg viewBox="0 0 14 16" className="h-5 w-4 shrink-0" aria-hidden>
      <path
        d="M2 15V5.2L7 1.6 12 5.2V15H2Z"
        fill="#b91c1c"
        stroke="var(--board-ink)"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <path d="M5 7.2h1.6v1.6H5zm2.4 0H9v1.6H7.4zM5 10.2h1.6V12H5zm2.4 0H9V12H7.4z" fill="#fde68a" />
    </svg>
  );
}

export function HouseMarkers({ count, side }: HouseMarkersProps): ReactElement | null {
  const level = Math.max(0, Math.floor(count));
  if (level === 0) {
    return null;
  }
  const alongBar = side === 'west' || side === 'east';
  const houses = isHotel(level) ? 0 : Math.min(MAX_HOUSES, level);
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center gap-px px-px py-px',
        alongBar ? 'flex-col' : 'flex-row',
      )}
      aria-label={isHotel(level) ? t('hotelOnLot') : t('housesOnLot', { count: String(houses) })}
    >
      {isHotel(level) ? (
        <HotelGlyph />
      ) : (
        Array.from({ length: houses }, (_, index) => <HouseGlyph key={index} />)
      )}
    </span>
  );
}
