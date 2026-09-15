import type { ReactElement } from 'react';
import { colorGroupHue } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
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
}: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);
  const hue = cell.colorGroup ? colorGroupHue(cell.colorGroup) : undefined;

  return (
    <div className={cn(tileSurfaceClass(isPending), bar.containerClass)}>
      {hue ? <HueStripe hue={hue} side={side} ownerID={ownerID} /> : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-4">
        <span className="px-0.5 pt-0.5 font-semibold [overflow-wrap:anywhere]">{cell.name}</span>
        {cell.price !== undefined ? (
          <span className="px-0.5 tabular-nums opacity-70">R${cell.price}</span>
        ) : null}
      </div>
      <CarTokenStack playerIDs={occupants} side={side} />
    </div>
  );
}
