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
  /* Dock the markers over the colour accent band (same side as HueStripe),
   * never over the name/price. Accent side per ring side:
   *   south=top · north=bottom · west=right · east=left */
  const dock =
    side === 'west'
      ? 'inset-y-0 right-0.5 flex-col'
      : side === 'east'
        ? 'inset-y-0 left-0.5 flex-col'
        : side === 'north'
          ? 'inset-x-0 bottom-0.5 flex-row'
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
        /* Ruler: hotel is the top asset — biggest single object (~55% width). */
        <HotelIso
          className="drop-shadow-md"
          style={{ width: 'max(2rem, 46cqmin)', height: 'max(2rem, 46cqmin)' }}
        />
      ) : (
        /* Ruler: houses are the asset — bigger than the car. Each shrinks a
         * little as more sit side by side so the row fits the coloured band. */
        Array.from({ length: houses }, (_, index) => (
          <HouseIso
            key={index}
            className="drop-shadow-sm"
            style={{
              width: `max(1.2rem, ${houses >= 3 ? 26 : 34}cqmin)`,
              height: `max(1.2rem, ${houses >= 3 ? 26 : 34}cqmin)`,
            }}
          />
        ))
      )}
    </span>
  );
}
