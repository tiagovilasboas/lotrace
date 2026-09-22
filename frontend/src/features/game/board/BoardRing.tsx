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

function occupantsOnCell(
  players: Record<string, PlayerState>,
  cellIndex: number,
): string[] {
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

export function BoardRing({
  players,
  owners,
  houses,
  pendingCell,
  center,
  className,
}: BoardRingProps): ReactElement {
  return (
    /*
     * Spec: outerBorder 7px brass r=24px, innerBorder 8px felt r=18px
     * Outer shell = brass colour, 7px padding, r=24px
     * Inner felt shell = 8px padding, r=18px
     */
    <div
      className={cn('aspect-square h-full w-full', className)}
      style={{
        backgroundColor: 'var(--lr-brass)',
        padding: '7px',
        borderRadius: 'var(--radius-board-outer)',
        boxShadow:
          '0 0 0 1px var(--lr-brass-dim), ' +
          '0 20px 50px rgba(3,10,24,0.65), ' +
          'inset 0 1px 0 rgba(255,249,236,0.18)',
      }}
    >
      {/* Felt inner border — 8px padding */}
      <div
        style={{
          backgroundColor: 'var(--surface-board)',
          padding: '8px',
          borderRadius: 'var(--radius-board-inner)',
          height: '100%',
        }}
      >
        {/* Tile grid */}
        <div
          className="grid h-full w-full gap-px"
          style={{
            gridTemplateColumns:
              'minmax(0,1.28fr) repeat(5,minmax(0,1fr)) minmax(0,1.28fr)',
            gridTemplateRows:
              'minmax(0,1.28fr) repeat(5,minmax(0,1fr)) minmax(0,1.28fr)',
            backgroundColor: 'var(--surface-board)',
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }}
        >
          {BOARD.map((cell: BoardCell) => {
            const pos = ringCellPosition(cell.index);
            return (
              <div
                key={cell.index}
                className="min-h-0 min-w-0"
                data-cell-index={cell.index}
                data-cell-kind={cell.kind}
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

          {/* Center panel */}
          <div
            className="col-start-2 col-end-7 row-start-2 row-end-7 overflow-hidden"
            style={{ backgroundColor: 'var(--surface-board)' }}
          >
            {center}
          </div>
        </div>
      </div>
    </div>
  );
}
