import type { DiceRoll, GameLogEvent, PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { DiceDisplay } from '@/features/game/components/DiceDisplay.tsx';
import { latestEventText } from '@/features/game/lib/format-event.ts';
import { t } from '@/lib/i18n.ts';

type BoardCenterProps = {
  dice: DiceRoll | null;
  events: GameLogEvent[];
  players: Record<string, PlayerState>;
};

export function BoardCenter({ dice, events, players }: BoardCenterProps): ReactElement {
  const latest = latestEventText(events, players);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">

      {/* City silhouette + route trail */}
      <svg
        className="pointer-events-none absolute inset-x-[3%] bottom-[5%] h-[52%] w-[94%]"
        viewBox="0 0 240 120"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        {/* Hill */}
        <path
          fill="var(--surface-board-deep)"
          opacity="0.50"
          d="M0 120V78C28 52 46 70 68 44C92 14 118 38 140 22C162 8 178 36 198 28C214 22 228 40 240 34V120Z"
        />
        {/* City silhouette — spec opacity 0.16 */}
        <path
          fill="var(--surface-board-deep)"
          opacity="0.16"
          d="M8 120V86h10v-22h8v22h9v-34h7v34h11v-16h8v16h14v-26h8v26h16v-18h9v18h18v-28h8v28h14v-12h8v12h16v-22h9v22h18V120Z"
        />
        {/* Route trail — spec: dashed brass opacity 0.40 */}
        <path
          fill="none"
          stroke="var(--lr-brass)"
          strokeWidth="1.4"
          strokeDasharray="5,4"
          opacity="0.40"
          d="M14 108C72 94 142 110 226 96"
        />
      </svg>

      {/* Content */}
      <div className="relative z-[1] flex flex-col items-center gap-1 px-2">

        {/* Wordmark — spec boardLogo size 44 desktop, 28 mobile */}
        <p
          className="text-center font-black leading-none tracking-tight"
          style={{
            fontFamily: 'var(--font-brand)',
            fontSize: '8cqw',
            color: 'var(--lr-ivory-light)',
            letterSpacing: '1px',
            textShadow: '0 2px 14px rgba(0,0,0,0.45)',
          }}
        >
          {t('appName')}
        </p>

        {/* Subtitle — spec subtitle size 9, brass */}
        <p
          className="text-center font-bold uppercase"
          style={{
            fontSize: '2.4cqw',
            letterSpacing: '0.22em',
            color: 'var(--lr-brass)',
          }}
        >
          COMPRE · CONSTRUA · ACELERE
        </p>

        {/* Dice — scale atomically with the board via .die-face cqmin */}
        <div style={{ margin: '0.4cqw 0' }}>
          <DiceDisplay dice={dice} />
        </div>

        {/* Last move pill — spec rgba(1,31,27,0.82), borderRadius 18 */}
        {latest ? (
          <div
            className="flex max-w-[76%] flex-col items-center px-3 py-1.5"
            style={{
              gap: '0.4cqw',
              backgroundColor: 'rgba(1,31,27,0.82)',
              borderRadius: '2.3cqw',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span
              className="font-bold uppercase"
              style={{
                fontSize: '1.6cqw',
                letterSpacing: '0.2em',
                color: 'var(--lr-ivory-light)',
                opacity: 0.9,
              }}
            >
              {t('lastMove')}
            </span>
            <span
              className="truncate text-center font-semibold leading-snug"
              style={{
                fontSize: '2.2cqw',
                color: 'var(--lr-ivory-light)',
              }}
            >
              {latest}
            </span>
          </div>
        ) : (
          <p
            style={{
              fontSize: '2.2cqw',
              color: 'var(--text-board-label)',
            }}
          >
            {t('luck')}
          </p>
        )}
      </div>
    </div>
  );
}
