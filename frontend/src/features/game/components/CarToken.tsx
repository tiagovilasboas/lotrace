import type { ReactElement } from 'react';
import { tokenFillClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenSize = 'sm' | 'md';

type CarTokenProps = {
  playerID: string;
  size?: CarTokenSize;
};

const SIZE_CLASS: Record<CarTokenSize, string> = {
  sm: 'h-2 w-3',
  md: 'h-2.5 w-[13px]',
};

export function CarToken({ playerID, size = 'md' }: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 16 10"
      className={cn(
        'car-token-arrive shrink-0 text-board-ink',
        SIZE_CLASS[size],
        tokenFillClass(playerID),
      )}
      aria-hidden="true"
      focusable="false"
    >
      <path
        stroke="currentColor"
        strokeWidth="0.45"
        d="M3.2 6.15 4.55 3.85A1.1 1.1 0 0 1 5.5 3.35h2.35c.32 0 .62.14.82.38L10.3 5.5h2.15c.5 0 .9.38.9.85v1.2c0 .2-.16.35-.35.35h-.55a1.3 1.3 0 0 1-2.5 0H7.05a1.3 1.3 0 0 1-2.5 0h-.7c-.28 0-.5-.22-.5-.5V6.75c0-.33.27-.6.6-.6h.25z"
      />
    </svg>
  );
}

type CarTokenStackProps = {
  playerIDs: string[];
};

export function CarTokenStack({ playerIDs }: CarTokenStackProps): ReactElement | null {
  if (playerIDs.length === 0) {
    return null;
  }

  return (
    <div className="mt-auto flex max-w-full flex-wrap items-end gap-px p-px">
      {playerIDs.map((id) => (
        <CarToken key={id} playerID={id} size="sm" />
      ))}
    </div>
  );
}
