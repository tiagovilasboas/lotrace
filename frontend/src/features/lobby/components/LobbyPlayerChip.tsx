import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';

type LobbyPlayerChipProps = {
  seat: number;
};

export function LobbyPlayerChip({ seat }: LobbyPlayerChipProps): ReactElement {
  return (
    <span
      className="inline-flex h-10 w-11 shrink-0 items-center justify-center rounded-xl [&_.car-token-arrive]:animate-none"
      style={{
        backgroundColor: 'var(--surface-hud-raised)',
        border: '1px solid var(--border-hud)',
      }}
      aria-hidden="true"
    >
      <CarToken playerID={String(seat)} size="lobby" />
    </span>
  );
}
