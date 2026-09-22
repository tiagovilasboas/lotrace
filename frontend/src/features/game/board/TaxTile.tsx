import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout, tileBodyClass } from '@/features/game/board/ring-geometry.ts';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { formatCashCompact } from '@/features/game/lib/format-cash.ts';
import { cn } from '@/lib/utils.ts';

export function TaxTile({ cell, occupants, isPending, side }: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);
  return (
    <div className={cn(tileSurfaceClass(isPending), bar.containerClass)}>
      <HueStripe hue={BOARD_COLOR.tax} side={side} />
      <CarTokenStack playerIDs={occupants} side={side} />
      <div className={cn('tile-body', tileBodyClass(side))}>
        <TileName lines={tileCaptionLines(cell)} align="center" />
        {cell.tax !== undefined ? (
          <span className="tile-price">{formatCashCompact(cell.tax)}</span>
        ) : null}
      </div>
    </div>
  );
}
