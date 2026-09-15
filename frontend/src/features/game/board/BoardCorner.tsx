import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import { hueBarLayout } from '@/features/game/board/ring-geometry.ts';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';
import { cn } from '@/lib/utils.ts';

function cornerHue(kind: CellKind): string {
  switch (kind) {
    case 'go':
      return BOARD_COLOR.go;
    case 'jail':
    case 'goto-jail':
      return BOARD_COLOR.jail;
    case 'park':
      return BOARD_COLOR.felt;
    default:
      return BOARD_COLOR.ink;
  }
}

export function BoardCorner({
  cell,
  occupants,
  isPending,
  side,
}: BoardTileProps): ReactElement {
  const bar = hueBarLayout(side);

  return (
    <div className={cn(tileSurfaceClass(isPending), bar.containerClass)}>
      <HueStripe hue={cornerHue(cell.kind)} side={side} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center text-center">
        <span className="px-0.5 font-bold uppercase tracking-wide [overflow-wrap:anywhere]">
          {cell.name}
        </span>
        <CarTokenStack playerIDs={occupants} />
      </div>
    </div>
  );
}
