import type { ReactElement } from 'react';
import { colorGroupHue } from '@/features/game/board/board-colors.ts';
import { HouseMarkers } from '@/features/game/board/HouseMarkers.tsx';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-0.5">
        <TileName lines={tileCaptionLines(cell)} align="center" />
        {cell.price !== undefined ? (
          <span className="px-px text-[0.48rem] font-medium tabular-nums leading-none opacity-70 sm:text-[0.58rem]">
            {formatCash(cell.price)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
