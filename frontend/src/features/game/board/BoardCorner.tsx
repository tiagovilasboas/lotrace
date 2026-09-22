import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';

/**
 * Corner markers — spec: circle 36px diameter with accent colour.
 * start=green, stop(jail)=gray, return(goto-jail)=purple, park=signal-cyan
 */
function CornerCircle({ kind }: { kind: CellKind }): ReactElement | null {
  const colors: Partial<Record<CellKind, string>> = {
    go:         'var(--corner-go)',
    jail:       'var(--corner-jail)',
    'goto-jail':'var(--corner-return)',
    park:       'var(--corner-park)',
  };
  const color = colors[kind];
  if (!color) return null;

  return (
    <span
      className="shrink-0 rounded-full"
      style={{
        width: 'clamp(1.5rem, 12cqmin, 2.25rem)',
        height: 'clamp(1.5rem, 12cqmin, 2.25rem)',
        backgroundColor: color,
        boxShadow: `0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)`,
      }}
      aria-hidden
    />
  );
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
      <div className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center gap-1 px-0.5">
        <CornerCircle kind={cell.kind} />
        <TileName lines={tileCaptionLines(cell)} align="center" strong />
      </div>
    </div>
  );
}
