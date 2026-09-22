import type { CellKind } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { tileCaptionLines } from '@/features/game/board/tile-caption.ts';
import { TileName } from '@/features/game/board/TileName.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { tileSurfaceClass } from '@/features/game/board/tile-surface.ts';
import { CarTokenStack } from '@/features/game/components/CarToken.tsx';

/**
 * Corner marker — bold coloured circle that fills the tile proportionally.
 * Uses cqmin (container query) so it always fits without overflow.
 * SVG is inline and flat — readable at any tile size.
 */
function CornerMark({ kind }: { kind: CellKind }): ReactElement | null {
  const size = 'max(1.8rem, 40cqmin)';

  switch (kind) {
    case 'go':
      /* Green circle — Partida */
      return (
        <svg
          viewBox="0 0 32 32"
          style={{ width: size, height: size }}
          aria-hidden
        >
          <circle cx="16" cy="16" r="13" fill="var(--corner-go)" />
          {/* Arrow right */}
          <path
            d="M11 16h10M17 11l5 5-5 5"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'jail':
      /* Gray circle — Visita */
      return (
        <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden>
          <circle cx="16" cy="16" r="13" fill="var(--corner-jail)" />
          {/* Bars */}
          <path d="M12 9v14M16 9v14M20 9v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 14h12M10 18h12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'goto-jail':
      /* Purple circle — Vá Preso */
      return (
        <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden>
          <circle cx="16" cy="16" r="13" fill="var(--corner-return)" />
          {/* Bars */}
          <path d="M19 9v14M22 9v14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 14h7M17 18h7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
          {/* Arrow left pointing to jail */}
          <path d="M15 16H8M11 12l-4 4 4 4" fill="none" stroke="#ffd700" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'park':
      /* Cyan circle — Parque */
      return (
        <svg viewBox="0 0 32 32" style={{ width: size, height: size }} aria-hidden>
          <circle cx="16" cy="16" r="13" fill="var(--corner-park)" />
          {/* Tree */}
          <path d="M16 22v-4" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="16" cy="14" rx="6" ry="5" fill="#065f46" />
          <ellipse cx="16" cy="12" rx="4" ry="3.5" fill="#10b981" />
        </svg>
      );

    default:
      return null;
  }
}

export function BoardCorner({ cell, occupants, isPending, side }: BoardTileProps): ReactElement {
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
