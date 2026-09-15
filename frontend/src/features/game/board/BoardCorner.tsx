import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import {
  GoIso,
  GotoJailIso,
  JailIso,
  ParkIso,
} from '@/features/game/board/IsoIcons.tsx';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';

function CornerMark({ kind }: { kind: CellKind }): ReactElement | null {
  const iconClass = 'h-7 w-7 sm:h-8 sm:w-8';
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
  return (
    <div className={tileSurfaceClass(isPending)}>
      <CarTokenStack playerIDs={occupants} side={side} dock="center" />
      <div className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5">
        <CornerMark kind={cell.kind} />
        <TileName lines={tileCaptionLines(cell)} align="center" strong />
      </div>
    </div>
  );
}
