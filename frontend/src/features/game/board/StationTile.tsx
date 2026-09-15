import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { StationIso } from '@/features/game/board/IsoIcons.tsx';
import { hueBarLayout, tileBodyPadClass } from '@/features/game/board/ring-geometry.ts';
import { tileCaption } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { cn } from '@/lib/utils.ts';

export function StationTile({
  cell,
  occupants,
  ownerID,
  isPending,
  side,
}: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);

  return (
    <div className={cn(tileSurfaceClass(isPending), bar.containerClass)}>
      <HueStripe hue={BOARD_COLOR.station} side={side} ownerID={ownerID} />
      <CarTokenStack playerIDs={occupants} side={side} />
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center',
          tileBodyPadClass(side),
        )}
      >
        <StationIso className="h-8 w-8" />
        <TileName align="center">{tileCaption(cell)}</TileName>
        {cell.price !== undefined ? (
          <span className="px-px text-[0.5rem] tabular-nums leading-none opacity-70 sm:text-[0.62rem]">
            R${cell.price}
          </span>
        ) : null}
      </div>
    </div>
  );
}
