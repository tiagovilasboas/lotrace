import type { ReactElement } from 'react';
import { tokenFillClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenProps = {
  playerID: string;
  size?: 'board' | 'hud' | 'lobby';
};

const SIZE_CLASS = {
  board: 'h-8 w-9',
  hud: 'h-6 w-7',
  lobby: 'h-7 w-8',
} as const;

export function CarToken({
  playerID,
  size = 'board',
}: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 36 32"
      className={cn('car-token-arrive shrink-0 drop-shadow-md', SIZE_CLASS[size])}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="18" cy="28.2" rx="12" ry="2.4" fill="#1c1917" opacity="0.32" />
      <rect x="6" y="16.4" width="5.2" height="7.2" rx="1.6" fill="#1c1917" />
      <rect x="24.8" y="16.4" width="5.2" height="7.2" rx="1.6" fill="#1c1917" />
      <path
        className={tokenFillClass(playerID)}
        d="M8.2 18.6c0-1.2.7-2.3 1.8-2.8L13.4 14l2-6.2c.3-.9 1.1-1.5 2.1-1.5h3c1 0 1.8.6 2.1 1.5L24.6 14l3.4 1.8c1.1.5 1.8 1.6 1.8 2.8v3.2c0 .7-.6 1.3-1.3 1.3H9.5c-.7 0-1.3-.6-1.3-1.3z"
      />
      <path d="M15.6 8.4h4.8l1.8 5.4H13.8z" fill="#fff" opacity="0.42" />
      <path className={tokenFillClass(playerID)} d="M9.2 20.4h17.6v2.6H9.2z" opacity="0.55" />
      <circle cx="12.2" cy="24.2" r="2.15" fill="#1c1917" />
      <circle cx="23.8" cy="24.2" r="2.15" fill="#1c1917" />
      <circle cx="12.2" cy="24.2" r="0.7" fill="#e7e5e4" />
      <circle cx="23.8" cy="24.2" r="0.7" fill="#e7e5e4" />
    </svg>
  );
}

type CarTokenStackProps = {
  playerIDs: string[];
  side?: unknown;
};

export function CarTokenStack({
  playerIDs,
}: CarTokenStackProps): ReactElement | null {
  if (playerIDs.length === 0) {
    return null;
  }
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-center pb-0.5">
      {playerIDs.map((id, index) => (
        <span key={id} className="relative" style={{ marginLeft: index === 0 ? 0 : -14, zIndex: index + 1 }}>
          <CarToken playerID={id} size="board" />
        </span>
      ))}
    </div>
  );
}
