import type { ReactElement } from 'react';
import {
  carTravelRotate,
  type RingSide,
} from '@/features/game/board/ring-geometry.ts';
import { tokenFillClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenProps = {
  playerID: string;
  side?: RingSide;
};

export function CarToken({ playerID, side = 'north' }: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 24 14"
      className={cn(
        'car-token-arrive h-3.5 w-6 shrink-0 drop-shadow-sm',
        carTravelRotate(side),
      )}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="12" cy="12.6" rx="8.5" ry="1.15" fill="#1c1917" opacity="0.28" />
      <circle cx="7.2" cy="10.2" r="2.15" fill="#1c1917" />
      <circle cx="16.8" cy="10.2" r="2.15" fill="#1c1917" />
      <circle cx="7.2" cy="10.2" r="0.7" fill="#e7e5e4" />
      <circle cx="16.8" cy="10.2" r="0.7" fill="#e7e5e4" />
      <path
        className={tokenFillClass(playerID)}
        d="M4.2 8.4 6.4 4.7c.35-.55.96-.9 1.62-.9h5.2c.5 0 .97.2 1.32.54L17.4 7.1h2.3c.83 0 1.5.64 1.5 1.42v1.55c0 .33-.27.6-.6.6h-.7a2.15 2.15 0 0 1-4.2 0H9.1a2.15 2.15 0 0 1-4.2 0h-.9c-.44 0-.8-.36-.8-.8V9.2c0-.45.36-.8.8-.8h.2z"
      />
      <path d="M8.2 4.15h4.7l2.2 2.55H7.35z" fill="#fff" opacity="0.35" />
    </svg>
  );
}

type CarTokenStackProps = {
  playerIDs: string[];
  side: RingSide;
};

export function CarTokenStack({
  playerIDs,
  side,
}: CarTokenStackProps): ReactElement | null {
  if (playerIDs.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0.5 z-20 flex items-end justify-center px-0.5">
      {playerIDs.map((id, index) => (
        <span
          key={id}
          className="relative"
          style={{ marginLeft: index === 0 ? 0 : -10, zIndex: index + 1 }}
        >
          <CarToken playerID={id} side={side} />
        </span>
      ))}
    </div>
  );
}
