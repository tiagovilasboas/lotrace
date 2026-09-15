import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { HueStripe } from '@/features/game/board/HueStripe.tsx';
import {
  GoIso,
  GotoJailIso,
  JailIso,
  ParkIso,
} from '@/features/game/board/IsoIcons.tsx';
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

function CornerMark({ kind }: { kind: CellKind }): ReactElement | null {
  const iconClass = 'mb-0.5 h-8 w-8';
  if (kind === 'go') {
    return <GoIso className={iconClass} />;
  }
  if (kind === 'jail') {
    return <JailIso className={iconClass} />;
  }
  if (kind === 'park') {
    return <ParkIso className={iconClass} />;
  }
  if (kind === 'goto-jail') {
    return <GotoJailIso className={iconClass} />;
  }
  return null;
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
      <CarTokenStack playerIDs={occupants} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center px-0.5 pb-7 text-center">
        <CornerMark kind={cell.kind} />
        <span className="font-bold uppercase tracking-wide [overflow-wrap:anywhere]">
          {cell.name}
        </span>
      </div>
    </div>
  );
}
