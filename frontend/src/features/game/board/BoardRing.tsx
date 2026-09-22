import { BOARD, type BoardCell, type PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { BoardCorner } from '@/features/game/board/BoardCorner.tsx';
import { PropertyTile } from '@/features/game/board/PropertyTile.tsx';
import { ringCellPosition, ringCellSide } from '@/features/game/board/ring-geometry.ts';
import { StationTile } from '@/features/game/board/StationTile.tsx';
import { TaxTile } from '@/features/game/board/TaxTile.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';
import { cn } from '@/lib/utils.ts';

type BoardRingProps = {
  players: Record<string, PlayerState>;
  owners: Record<number, string | null>;
  houses: Record<number, number>;
  pendingCell: number | null;
  center: ReactElement;
  className?: string;
};

function occupantsOnCell(players: Record<string, PlayerState>, cellIndex: number): string[] {
  return Object.values(players)
    .filter((p) => !p.bankrupt && p.position === cellIndex)
    .map((p) => p.id);
}

function renderRingTile(props: BoardTileProps): ReactElement {
  switch (props.cell.kind) {
    case 'property':  return <PropertyTile {...props} />;
    case 'station':   return <StationTile {...props} />;
    case 'tax':       return <TaxTile {...props} />;
    case 'go':
    case 'jail':
    case 'park':
    case 'goto-jail': return <BoardCorner {...props} />;
  }
}

export function BoardRing({ players, owners, houses, pendingCell, center, className }: BoardRingProps): ReactElement {
  return (
    /* board-outer: brass frame 7px r=24px — board-inner: felt 8px r=18px */
    <div className={cn('board-outer aspect-square h-full w-full', className)}>
      <div className="board-inner">
        <div className="board-grid">
          {BOARD.map((cell: BoardCell) => {
            const pos = ringCellPosition(cell.index);
            return (
              <div
                key={cell.index}
                className="min-h-0 min-w-0"
                data-cell-index={cell.index}
                style={{ gridColumn: pos.column, gridRow: pos.row }}
              >
                {renderRingTile({
                  cell,
                  occupants: occupantsOnCell(players, cell.index),
                  ownerID: owners[cell.index] ?? null,
                  isPending: pendingCell === cell.index,
                  side: ringCellSide(cell.index),
                  houseCount: houses[cell.index] ?? 0,
                })}
              </div>
            );
          })}
          {/* Center */}
          <div className="col-start-2 col-end-7 row-start-2 row-end-7 overflow-hidden" style={{ backgroundColor: 'var(--surface-board)' }}>
            {center}
          </div>
        </div>
      </div>
    </div>
  );
}
