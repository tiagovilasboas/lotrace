import type { BoardCell } from '@lotrace/shared';
import type { RingSide } from '@/features/game/board/ring-geometry.ts';

export type BoardTileProps = {
  cell: BoardCell;
  occupants: string[];
  ownerID: string | null;
  isPending: boolean;
  side: RingSide;
};
