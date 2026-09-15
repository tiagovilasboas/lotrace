import type { ReactElement } from 'react';
import { colorGroupHue } from '@/features/game/board/board-colors.ts';
import { HouseMarkers } from '@/features/game/board/HouseMarkers.tsx';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout, tileBodyClass } from '@/features/game/board/ring-geometry.ts';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { formatCash } from '@/features/game/lib/format-cash.ts';
import { cn } from '@/lib/utils.ts';

export function PropertyTile({
  cell,
  occupants,
  ownerID,
  isPending,
  side,
  houseCount,
}: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);
  const hue = cell.colorGroup ? colorGroupHue(cell.colorGroup) : undefined;

  return (
    <div
      className={cn(tileSurfaceClass(isPending), bar.containerClass)}
      data-house-count={houseCount}
    >
      {hue ? <HueStripe hue={hue} side={side} ownerID={ownerID} /> : null}
      <HouseMarkers count={houseCount} side={side} />
      <CarTokenStack playerIDs={occupants} side={side} />
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col gap-0.5',
          tileBodyClass(side),
        )}
      >
        <TileName lines={tileCaptionLines(cell)} align="center" />
        {cell.price !== undefined ? (
          <span className="tile-price">{formatCash(cell.price)}</span>
        ) : null}
      </div>
    </div>
  );
}
