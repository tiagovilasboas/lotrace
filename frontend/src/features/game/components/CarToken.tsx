import type { ReactElement } from 'react';
import {
  tokenRotateClass,
  tokenDockClass,
  type RingSide,
} from '@/features/game/board/ring-geometry.ts';
import { cn } from '@/lib/utils.ts';

/**
 * Car token colours — spec: car-red, car-green, car-yellow, car-purple, +2 extras
 * Uses CSS vars from game.css (--car-0 … --car-5).
 */
const CAR_COLORS = [
  'var(--car-0)', // red    #FF5964
  'var(--car-1)', // green  #53DC9E
  'var(--car-2)', // yellow #F5C64B
  'var(--car-3)', // purple #A98AFF
  'var(--car-4)', // cyan   #55D8FF
  'var(--car-5)', // orange #FF9D38
] as const;

function carColor(playerID: string): string {
  return CAR_COLORS[Number(playerID) % CAR_COLORS.length] ?? CAR_COLORS[0];
}

type CarTokenProps = {
  playerID: string;
  size?: 'board' | 'hud' | 'lobby';
  side?: RingSide;
};

/**
 * Arcade side-view car — spec: rounded body, roof bump, 2 wheels.
 * Uses fill="<color>" so currentColor trick is not needed.
 */
export function CarToken({ playerID, size = 'board', side }: CarTokenProps): ReactElement {
  const color = carColor(playerID);

  if (size === 'hud') {
    return (
      <svg
        viewBox="0 0 72 36"
        className="car-token-arrive h-8 w-[3.8rem] shrink-0 overflow-visible drop-shadow-md"
        aria-hidden="true"
        focusable="false"
      >
        {/* Shadow */}
        <ellipse cx="36" cy="34" rx="28" ry="3" fill="rgba(0,0,0,0.22)" />
        {/* Body */}
        <rect x="4" y="18" width="64" height="14" rx="7" fill={color} />
        {/* Roof bump */}
        <path
          d="M18 18 C18 8 22 6 28 6 L44 6 C50 6 54 8 54 18Z"
          fill={color}
        />
        {/* Roof darkening */}
        <path
          d="M20 18 C20 10 24 8 29 8 L43 8 C48 8 52 10 52 18Z"
          fill="rgba(0,0,0,0.20)"
        />
        {/* Windshield */}
        <path
          d="M22 18 C22 11 25 9 30 9 L42 9 C47 9 50 11 50 18Z"
          fill="rgba(125,211,252,0.85)"
        />
        {/* Windshield glare */}
        <path d="M24 13 L30 9 L35 9 L29 14Z" fill="rgba(255,255,255,0.50)" />
        {/* Wheels */}
        <circle cx="18" cy="32" r="7" fill="var(--piece-wheel)" />
        <circle cx="54" cy="32" r="7" fill="var(--piece-wheel)" />
        <circle cx="18" cy="32" r="3" fill="var(--piece-wheel-hub)" />
        <circle cx="54" cy="32" r="3" fill="var(--piece-wheel-hub)" />
        {/* Body highlight */}
        <rect x="8" y="18" width="56" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
      </svg>
    );
  }

  /* board / lobby sizes — top-down vertical orientation */
  const isLobby = size === 'lobby';
  return (
    <svg
      viewBox="0 0 28 44"
      className={cn(
        'car-token-arrive shrink-0 overflow-visible drop-shadow-md',
        isLobby ? 'h-10 w-7' : 'h-[2.1rem] w-[1.35rem]',
        side ? tokenRotateClass(side) : undefined,
      )}
      aria-hidden="true"
      focusable="false"
    >
      {/* Ground shadow */}
      <ellipse cx="14" cy="41.4" rx="8.2" ry="2" fill="var(--piece-shadow)" />
      {/* Wheels */}
      <rect x="2.5" y="11" width="4" height="7.5" rx="2" fill="var(--piece-wheel)" />
      <rect x="21.5" y="11" width="4" height="7.5" rx="2" fill="var(--piece-wheel)" />
      <rect x="2.5" y="25" width="4" height="7.5" rx="2" fill="var(--piece-wheel)" />
      <rect x="21.5" y="25" width="4" height="7.5" rx="2" fill="var(--piece-wheel)" />
      {/* Body */}
      <path
        d="M8 5 C8.4 2.8 19.6 2.8 20 5 L23.5 15.5 V31 C23.5 35.8 4.5 35.8 4.5 31 V15.5Z"
        fill={color}
        stroke="var(--piece-outline)"
        strokeWidth="1"
      />
      {/* Windshield */}
      <path d="M10 8.5 L18 8.5 L19.5 15.5 H8.5Z" fill="rgba(125,211,252,0.82)" />
      {/* Windshield glare */}
      <path d="M10.5 9 L14 8.5 L14 13 L10.5 13Z" fill="rgba(255,255,255,0.50)" />
      {/* Roof shade */}
      <path d="M10 8.5 L18 8.5 L19.5 15.5 H8.5Z" fill="rgba(0,0,0,0.15)" />
      {/* Centre stripe */}
      <rect x="12.8" y="17" width="2.4" height="13.5" rx="1.2" fill="var(--piece-stripe)" />
      {/* Bumper */}
      <path d="M10 35.5 H18 L18.8 37.8 H9.2Z" fill={color} />
    </svg>
  );
}

/* ─── CarTokenStack ──────────────────────────────────────────── */

type CarTokenStackProps = {
  playerIDs: string[];
  side: RingSide;
  dock?: 'stripe' | 'center';
};

export function CarTokenStack({
  playerIDs,
  side,
  dock = 'stripe',
}: CarTokenStackProps): ReactElement | null {
  if (playerIDs.length === 0) return null;

  const stacked = side === 'west' || side === 'east';
  const count   = playerIDs.length;
  const scale   = count === 1 ? 1 : count === 2 ? 0.84 : count <= 4 ? 0.70 : 0.60;

  return (
    <div
      className={cn(
        'pointer-events-none absolute z-20 flex items-center',
        dock === 'center'
          ? 'inset-0 justify-center'
          : tokenDockClass(side),
      )}
    >
      {playerIDs.map((id, index) => (
        <span
          key={id}
          className="relative"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            ...(stacked && dock !== 'center'
              ? { marginTop: index === 0 ? 0 : `${-2.1 * (1 - scale) * 16 - 2}px`, zIndex: index + 1 }
              : { marginLeft: index === 0 ? 0 : `${-1.35 * (1 - scale) * 16 - 2}px`, zIndex: index + 1 }),
          }}
        >
          <CarToken playerID={id} size="board" side={side} />
        </span>
      ))}
    </div>
  );
}
