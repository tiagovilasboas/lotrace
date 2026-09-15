import { isHotel, MAX_HOUSES } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { HotelIso, HouseIso } from '@/features/game/board/IsoIcons.tsx';
import type { RingSide } from '@/features/game/board/ring-geometry.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type HouseMarkersProps = {
  count: number;
  side: RingSide;
};

export function HouseMarkers({ count, side }: HouseMarkersProps): ReactElement | null {
  const level = Math.max(0, Math.floor(count));
  if (level === 0) {
    return null;
  }

  const houses = isHotel(level) ? 0 : Math.min(MAX_HOUSES, level);
  const dock =
    side === 'west'
      ? 'inset-y-0 right-0.5 flex-col'
      : side === 'east'
        ? 'inset-y-0 left-0.5 flex-col'
        : 'inset-x-0 top-0.5 flex-row';

  return (
    <span
      className={cn(
        'pointer-events-none absolute z-[15] flex items-center justify-center gap-px',
        dock,
      )}
      aria-label={
        isHotel(level)
          ? t('hotelOnLot')
          : t('housesOnLot', { count: String(houses) })
      }
    >
      {isHotel(level) ? (
        <HotelIso className="h-7 w-7 drop-shadow-md" />
      ) : (
        Array.from({ length: houses }, (_, index) => (
          <HouseIso key={index} className="h-5 w-5 drop-shadow-sm" />
        ))
      )}
    </span>
  );
}
