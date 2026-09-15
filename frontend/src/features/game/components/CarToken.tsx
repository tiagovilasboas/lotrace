import type { ReactElement } from 'react';
import { tokenFillClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenProps = {
  playerID: string;
};

export function CarToken({ playerID }: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 16 10"
      className={cn('car-token-arrive h-2 w-3 shrink-0', tokenFillClass(playerID))}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.2 6.15 4.55 3.85A1.1 1.1 0 0 1 5.5 3.35h2.35c.32 0 .62.14.82.38L10.3 5.5h2.15c.5 0 .9.38.9.85v1.2c0 .2-.16.35-.35.35h-.55a1.3 1.3 0 0 1-2.5 0H7.05a1.3 1.3 0 0 1-2.5 0h-.7c-.28 0-.5-.22-.5-.5V6.75c0-.33.27-.6.6-.6h.25z" />
    </svg>
  );
}
