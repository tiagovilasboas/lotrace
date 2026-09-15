import type { ReactElement } from 'react';
import { colorGroupHue } from '@/features/game/board/board-colors.ts';
import { HouseMarkers } from '@/features/game/board/HouseMarkers.tsx';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout, tileBodyPadClass } from '@/features/game/board/ring-geometry.ts';
import { tileCaption } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
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
          'flex min-h-0 min-w-0 flex-1 flex-col justify-center',
          tileBodyPadClass(side),
        )}
      >
        <TileName>{tileCaption(cell)}</TileName>
        {cell.price !== undefined ? (
          <span className="px-px text-[0.5rem] tabular-nums leading-none opacity-70 sm:text-[0.62rem]">
            R${cell.price}
          </span>
        ) : null}
      </div>
    </div>
  );
}
