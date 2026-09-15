import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';

type LobbyPlayerChipProps = {
  seat: number;
};

export function LobbyPlayerChip({ seat }: LobbyPlayerChipProps): ReactElement {
  return (
    <span
      className="inline-flex h-8 w-9 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border [&_.car-token-arrive]:animate-none"
      aria-hidden="true"
    >
      <CarToken playerID={String(seat)} />
    </span>
  );
}
