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

/**
 * Corner icon — each corner has a distinct isometric illustration.
 * Size uses cqmin so it fills the corner tile proportionally.
 */
function CornerIcon({ kind }: { kind: CellKind }): ReactElement | null {
  const cls = 'w-[clamp(1.4rem,14cqmin,2.6rem)] h-[clamp(1.4rem,14cqmin,2.6rem)]';
  switch (kind) {
    case 'go':         return <GoIso className={cls} />;
    case 'jail':       return <JailIso className={cls} />;
    case 'goto-jail':  return <GotoJailIso className={cls} />;
    case 'park':       return <ParkIso className={cls} />;
    default:           return null;
  }
}

export function BoardCorner({ cell, occupants, isPending, side }: BoardTileProps): ReactElement {
  return (
    <div className={tileSurfaceClass(isPending)}>
      <CarTokenStack playerIDs={occupants} side={side} dock="center" />
      <div className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5">
        <CornerIcon kind={cell.kind} />
        <TileName lines={tileCaptionLines(cell)} align="center" strong />
      </div>
    </div>
  );
}
