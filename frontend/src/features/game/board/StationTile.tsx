import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { StationIso } from '@/features/game/board/IsoIcons.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { formatCash } from '@/features/game/lib/format-cash.ts';
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 py-0.5">
        <StationIso className="h-5 w-5 sm:h-6 sm:w-6" />
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
