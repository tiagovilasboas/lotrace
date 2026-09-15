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

function CornerMark({ kind }: { kind: CellKind }): ReactElement | null {
  if (kind === 'go') {
    return (
      <svg viewBox="0 0 16 16" className="mb-0.5 size-4 text-[var(--go)]" aria-hidden>
        <path
          d="M2.5 8h8.2M8.2 4.2 12.8 8l-4.6 3.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === 'jail') {
    return (
      <svg viewBox="0 0 16 16" className="mb-0.5 size-4 text-[var(--jail)]" aria-hidden>
        <rect x="3" y="3" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 3v10M10 3v10" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === 'park') {
    return (
      <svg viewBox="0 0 16 16" className="mb-0.5 size-4 text-[var(--board-felt)]" aria-hidden>
        <circle cx="8" cy="7" r="3.4" fill="currentColor" />
        <path d="M8 9.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'goto-jail') {
    return (
      <svg viewBox="0 0 16 16" className="mb-0.5 size-4 text-[var(--jail)]" aria-hidden>
        <path
          d="M13.5 8H5.3M7.8 4.2 3.2 8l4.6 3.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center px-0.5 pb-4 text-center">
        <CornerMark kind={cell.kind} />
        <span className="font-bold uppercase tracking-wide [overflow-wrap:anywhere]">
          {cell.name}
        </span>
      </div>
      <CarTokenStack playerIDs={occupants} side={side} />
    </div>
  );
}
