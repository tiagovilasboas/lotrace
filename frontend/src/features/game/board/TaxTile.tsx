import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { TaxIso } from '@/features/game/board/IsoIcons.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { cn } from '@/lib/utils.ts';

export function TaxTile({
  cell,
  occupants,
  isPending,
  side,
}: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);

  return (
    <div className={cn(tileSurfaceClass(isPending), bar.containerClass)}>
      <HueStripe hue={BOARD_COLOR.tax} side={side} />
      <CarTokenStack playerIDs={occupants} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center pb-7">
        <TaxIso className="mt-0.5 h-7 w-7" />
        <span className="px-0.5 font-semibold [overflow-wrap:anywhere]">{cell.name}</span>
        {cell.tax !== undefined ? (
          <span className="px-0.5 tabular-nums opacity-70">R${cell.tax}</span>
        ) : null}
      </div>
    </div>
  );
}
