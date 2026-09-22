import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';

const CORNER_CLASS: Partial<Record<CellKind, string>> = {
  go:          'corner-circle corner-circle--go',
  jail:        'corner-circle corner-circle--jail',
  'goto-jail': 'corner-circle corner-circle--return',
  park:        'corner-circle corner-circle--park',
};

export function BoardCorner({ cell, occupants, isPending, side }: BoardTileProps): ReactElement {
  const circleClass = CORNER_CLASS[cell.kind];

  return (
    <div className={tileSurfaceClass(isPending)}>
      <CarTokenStack playerIDs={occupants} side={side} dock="center" />
      <div className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center gap-1 px-0.5">
        {circleClass ? <span className={circleClass} aria-hidden /> : null}
        <TileName lines={tileCaptionLines(cell)} align="center" strong />
      </div>
    </div>
  );
}
