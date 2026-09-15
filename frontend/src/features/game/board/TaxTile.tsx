import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { TaxIso } from '@/features/game/board/IsoIcons.tsx';
import { hueBarLayout, tileBodyClass } from '@/features/game/board/ring-geometry.ts';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { formatCash } from '@/features/game/lib/format-cash.ts';
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
      <CarTokenStack playerIDs={occupants} side={side} />
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 flex-col gap-0.5',
          tileBodyClass(side),
        )}
      >
        <TaxIso className="h-5 w-5 sm:h-6 sm:w-6" />
        <TileName lines={tileCaptionLines(cell)} align="center" />
        {cell.tax !== undefined ? (
          <span className="tile-price">{formatCash(cell.tax)}</span>
        ) : null}
      </div>
    </div>
  );
}
