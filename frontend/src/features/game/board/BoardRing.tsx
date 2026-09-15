import { BOARD, type BoardCell, type PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
import { BoardCorner } from '@/features/game/board/BoardCorner.tsx';
import { PropertyTile } from '@/features/game/board/PropertyTile.tsx';
import { ringCellPosition, ringCellSide } from '@/features/game/board/ring-geometry.ts';
import { StationTile } from '@/features/game/board/StationTile.tsx';
import { TaxTile } from '@/features/game/board/TaxTile.tsx';
import type { BoardTileProps } from '@/features/game/board/tile-types.ts';

type BoardRingProps = {
  players: Record<string, PlayerState>;
  owners: Record<number, string | null>;
  pendingCell: number | null;
  center: ReactElement;
};

function occupantsOnCell(
  players: Record<string, PlayerState>,
  cellIndex: number,
): string[] {
  return Object.values(players)
    .filter((player) => !player.bankrupt && player.position === cellIndex)
    .map((player) => player.id);
}

function renderRingTile(props: BoardTileProps): ReactElement {
  switch (props.cell.kind) {
    case 'property':
      return <PropertyTile {...props} />;
    case 'station':
      return <StationTile {...props} />;
    case 'tax':
      return <TaxTile {...props} />;
    case 'go':
    case 'jail':
    case 'park':
    case 'goto-jail':
      return <BoardCorner {...props} />;
  }
}

export function BoardRing({
  players,
  owners,
  pendingCell,
  center,
}: BoardRingProps): ReactElement {
  return (
    <div
      className="grid aspect-square w-full grid-cols-7 grid-rows-7 gap-px rounded-md p-1"
      style={{ backgroundColor: BOARD_COLOR.felt }}
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
            })}
          </div>
        );
      })}
      <div className="col-start-2 col-end-7 row-start-2 row-end-7 flex items-center justify-center p-2 text-board-track">
        {center}
      </div>
    </div>
  );
}
