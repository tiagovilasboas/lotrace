import { BOARD } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { tileCaption } from '@/features/game/board/tile-caption.ts';
import { formatCashCompact } from '@/features/game/lib/format-cash.ts';
import type { IsoLayout } from '@/features/game/board/iso/use-iso-layout.ts';

type BoardTextOverlayProps = {
  layout: IsoLayout;
};

/**
 * DOM text overlay for the iso canvas board (Phase 3.4).
 * Names/prices are real DOM (crisp + accessible) positioned at each tile's
 * iso centre. Not projected/transformed — just absolutely placed, so it stays
 * sharp and stays in sync with the canvas via the shared IsoLayout.
 */
export function BoardTextOverlay({ layout }: BoardTextOverlayProps): ReactElement {
  const { tileCentres } = layout;

  return (
    <div className="board-text-overlay" aria-hidden={false}>
      {BOARD.map((cell) => {
        const centre = tileCentres[cell.index];
        if (!centre) return null;

        const price =
          cell.price !== undefined
            ? cell.price
            : cell.tax !== undefined
              ? cell.tax
              : null;

        return (
          <div
            key={cell.index}
            className="board-tile-label"
            style={{ left: `${centre.x}px`, top: `${centre.y}px` }}
          >
            <span className="board-tile-label-name">{tileCaption(cell)}</span>
            {price !== null ? (
              <span className="board-tile-label-price">{formatCashCompact(price)}</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
