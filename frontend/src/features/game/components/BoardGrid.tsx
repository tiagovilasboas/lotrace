import { BOARD, type BoardCell, type PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { CellTile } from '@/features/game/components/CellTile.tsx';

function cellGridPosition(index: number): { column: number; row: number } {
  if (index <= 6) {
    return { column: 7 - index, row: 7 };
  }
  if (index <= 12) {
    return { column: 1, row: 7 - (index - 6) };
  }
  if (index <= 18) {
    return { column: 1 + (index - 12), row: 1 };
  }
  return { column: 7, row: 2 + (index - 19) };
}

type BoardGridProps = {
  players: Record<string, PlayerState>;
  owners: Record<number, string | null>;
  pendingCell: number | null;
  center: ReactElement;
};

export function BoardGrid({
  players,
  owners,
  pendingCell,
  center,
}: BoardGridProps): ReactElement {
  const occupants = (cell: BoardCell): string[] =>
    Object.values(players)
      .filter((player) => !player.bankrupt && player.position === cell.index)
      .map((player) => player.id);

  return (
    <div className="grid aspect-square w-full grid-cols-7 grid-rows-7 gap-0.5">
      {BOARD.map((cell) => {
        const pos = cellGridPosition(cell.index);
        return (
          <div
            key={cell.index}
            style={{ gridColumn: pos.column, gridRow: pos.row }}
          >
            <CellTile
              cell={cell}
              occupants={occupants(cell)}
              ownerID={owners[cell.index] ?? null}
              isPending={pendingCell === cell.index}
            />
          </div>
        );
      })}
      <div className="col-start-2 col-end-7 row-start-2 row-end-7 flex items-center justify-center p-2">
        {center}
      </div>
    </div>
  );
}
