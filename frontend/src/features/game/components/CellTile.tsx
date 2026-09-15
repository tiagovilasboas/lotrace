import type { BoardCell, ColorGroup } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';
import { tokenClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

const GROUP_BAR: Record<ColorGroup, string> = {
  brown: 'bg-amber-800',
  sky: 'bg-sky-400',
  pink: 'bg-pink-400',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-600',
  navy: 'bg-indigo-900',
};

type CellTileProps = {
  cell: BoardCell;
  occupants: string[];
  ownerID: string | null;
  isPending: boolean;
};

export function CellTile({
  cell,
  occupants,
  ownerID,
  isPending,
}: CellTileProps): ReactElement {
  return (
    <div
      className={cn(
        'relative flex h-full min-h-0 flex-col overflow-hidden rounded-md border bg-card text-[9px] leading-tight',
        isPending ? 'border-primary ring-2 ring-primary/40' : 'border-border',
      )}
    >
      {cell.colorGroup ? (
        <span className={cn('block h-1.5 w-full', GROUP_BAR[cell.colorGroup])} />
      ) : null}
      <span className="px-0.5 pt-0.5 font-semibold">{cell.name}</span>
      {cell.price ? (
        <span className="px-0.5 text-muted-foreground">R${cell.price}</span>
      ) : null}
      {ownerID !== null ? (
        <span className={cn('absolute right-0.5 top-1.5 size-1.5 rounded-full', tokenClass(ownerID))} />
      ) : null}
      <div className="mt-auto flex flex-wrap items-end gap-0.5 p-0.5">
        {occupants.map((id) => (
          <CarToken key={id} playerID={id} />
        ))}
      </div>
    </div>
  );
}
