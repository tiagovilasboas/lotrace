import type { ReactElement } from 'react';
import type { RingSide } from '@/features/game/board/ring-geometry.ts';
import { tokenTextClass } from '@/features/game/player-tokens.ts';
import { cn } from '@/lib/utils.ts';

type CarTokenProps = {
  playerID: string;
  size?: 'board' | 'hud' | 'lobby';
};

const SIZE_CLASS = {
  board: 'h-9 w-10',
  hud: 'h-7 w-8',
  lobby: 'h-8 w-9',
} as const;

export function CarToken({
  playerID,
  size = 'board',
}: CarTokenProps): ReactElement {
  return (
    <svg
      viewBox="0 0 48 36"
      className={cn(
        'car-token-arrive shrink-0 overflow-visible drop-shadow-md',
        tokenTextClass(playerID),
        SIZE_CLASS[size],
      )}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="24" cy="32.4" rx="15" ry="2.6" fill="#1c1917" opacity="0.3" />
      <ellipse cx="15" cy="24.4" rx="4.1" ry="2.3" fill="#1c1917" />
      <ellipse cx="34.4" cy="22.2" rx="4.1" ry="2.3" fill="#1c1917" />
      <path fill="currentColor" d="M9.2 20.4 22.6 13.6 40.6 17.4 27.4 25.2Z" />
      <path fill="currentColor" opacity="0.72" d="M9.2 20.4 27.4 25.2 27.4 29.2 9.2 24.4Z" />
      <path fill="currentColor" opacity="0.9" d="M27.4 25.2 40.6 17.4 40.6 21.4 27.4 29.2Z" />
      <path fill="currentColor" d="M16.6 18.8 22.8 14.2 31.2 16.2 24.8 21.2Z" />
      <path fill="#fff" opacity="0.48" d="M18.4 18.2 23.4 14.8 29.6 16.4 24.4 20.2Z" />
      <path fill="#1c1917" opacity="0.22" d="M11.2 21.6 26.4 26.2 26.4 27.6 11.2 23Z" />
      <ellipse cx="17.2" cy="27.6" rx="4.4" ry="2.5" fill="#1c1917" />
      <ellipse cx="32.6" cy="25.6" rx="4.4" ry="2.5" fill="#1c1917" />
      <ellipse cx="17.2" cy="26.8" rx="1.4" ry="0.8" fill="#e7e5e4" />
      <ellipse cx="32.6" cy="24.8" rx="1.4" ry="0.8" fill="#e7e5e4" />
      <path fill="#fef08a" d="M37.8 18.2 40.2 18.8 40.2 20.4 37.8 19.8Z" />
    </svg>
  );
}

type CarTokenStackProps = {
  playerIDs: string[];
  side?: RingSide;
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
        <span
          key={id}
          className="relative"
          style={{ marginLeft: index === 0 ? 0 : -16, zIndex: index + 1 }}
        >
          <CarToken playerID={id} size="board" />
        </span>
      ))}
    </div>
  );
}
