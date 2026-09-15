import type { ReactElement } from 'react';
import {
  tokenRotateClass,
  tokenDockClass,
  type RingSide,
} from '@/features/game/board/ring-geometry.ts';
import { tokenTextClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenProps = {
  playerID: string;
  size?: 'board' | 'hud' | 'lobby';
  side?: RingSide;
};

const SIZE_CLASS = {
  board: 'h-9 w-6',
  hud: 'h-8 w-5',
  lobby: 'h-9 w-6',
} as const;

export function CarToken({
  playerID,
  size = 'board',
  side,
}: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 28 44"
      className={cn(
        'car-token-arrive shrink-0 overflow-visible drop-shadow-md',
        tokenTextClass(playerID),
        SIZE_CLASS[size],
        side ? tokenRotateClass(side) : undefined,
      )}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="14" cy="41.4" rx="8.2" ry="2" fill="#1c1917" opacity="0.28" />
      <rect x="3.2" y="12" width="3.6" height="7.2" rx="1.1" fill="#1c1917" />
      <rect x="21.2" y="12" width="3.6" height="7.2" rx="1.1" fill="#1c1917" />
      <rect x="3.2" y="26.2" width="3.6" height="7.2" rx="1.1" fill="#1c1917" />
      <rect x="21.2" y="26.2" width="3.6" height="7.2" rx="1.1" fill="#1c1917" />
      <path
        fill="currentColor"
        stroke="#faf6e8"
        strokeWidth="1.15"
        d="M9.2 5.2c.4-2.2 9.2-2.2 9.6 0l3.6 10.4v16.2c0 4.6-16.8 4.6-16.8 0V15.6Z"
      />
      <path fill="#0c1917" opacity="0.38" d="M10.2 8.1h7.6l1.3 7.2H8.9Z" />
      <path fill="#fff" opacity="0.55" d="M11 8.6h6l.8 4.4h-7.6Z" />
      <path fill="#faf6e8" opacity="0.35" d="M13.2 17.2h1.6v14.2h-1.6Z" />
      <path fill="currentColor" d="M10.6 36.4h6.8l.8 2.2h-8.4Z" />
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

  const stacked = side === 'west' || side === 'east';

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-20 flex items-center',
        tokenDockClass(side),
      )}
    >
      {playerIDs.map((id, index) => (
        <span
          key={id}
          className="relative"
          style={
            stacked
              ? { marginTop: index === 0 ? 0 : -14, zIndex: index + 1 }
              : { marginLeft: index === 0 ? 0 : -12, zIndex: index + 1 }
          }
        >
          <CarToken playerID={id} size="board" side={side} />
        </span>
      ))}
    </div>
  );
}
