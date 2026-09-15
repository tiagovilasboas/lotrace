import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <span className="px-0.5 pt-0.5 font-semibold [overflow-wrap:anywhere]">{cell.name}</span>
        {cell.price !== undefined ? (
          <span className="px-0.5 tabular-nums opacity-70">R${cell.price}</span>
        ) : null}
        <CarTokenStack playerIDs={occupants} />
      </div>
    </div>
  );
}
