import { BOARD, type BoardCell, type PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { BOARD_COLOR } from '@/features/game/board/board-colors.ts';
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
  houses,
  pendingCell,
  center,
  className,
}: BoardRingProps): ReactElement {
  return (
    <div
      className={cn(
        'aspect-square h-full w-full rounded-2xl p-[5px] shadow-[0_16px_36px_rgba(3,10,24,0.55)]',
        className,
      )}
      style={{ backgroundColor: 'var(--group-brown)' }}
    >
      <div
        className="grid h-full w-full grid-cols-[minmax(0,1.28fr)_repeat(5,minmax(0,1fr))_minmax(0,1.28fr)] grid-rows-[minmax(0,1.28fr)_repeat(5,minmax(0,1fr))_minmax(0,1.28fr)] gap-px rounded-xl p-0.5"
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
                houseCount: houses[cell.index] ?? 0,
              })}
            </div>
          );
        })}
        <div className="col-start-2 col-end-7 row-start-2 row-end-7 flex items-center justify-center overflow-hidden p-1 text-board-track">
          {center}
        </div>
      </div>
    </div>
  );
}
