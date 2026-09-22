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

export function BoardCenter({
  dice,
  events,
  players,
}: BoardCenterProps): ReactElement {
  const latest = latestEventText(events, players);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">

      {/* City skyline SVG — decorative background */}
      <svg
        className="pointer-events-none absolute inset-x-[4%] bottom-[6%] h-[55%] w-[92%]"
        viewBox="0 0 240 120"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <path
          fill="var(--surface-board-deep)"
          opacity="0.5"
          d="M0 120 V78 C28 52 46 70 68 44 C92 14 118 38 140 22 C162 8 178 36 198 28 C214 22 228 40 240 34 V120Z"
        />
        <path
          fill="var(--surface-board-deep)"
          opacity="0.82"
          d="M8 120 V86 h10 v-22 h8 v22 h9 v-34 h7 v34 h11 v-16 h8 v16 h14 v-26 h8 v26 h16 v-18 h9 v18 h18 v-28 h8 v28 h14 v-12 h8 v12 h16 v-22 h9 v22 h18 V120Z"
        />
        <path
          fill="none"
          stroke="var(--lr-brass-glow)"
          strokeWidth="1.2"
          opacity="0.3"
          d="M12 108 C70 94 140 110 228 96"
        />
      </svg>

      {/* Content stack */}
      <div className="relative z-[1] flex flex-col items-center gap-1.5 px-2">

        {/* Wordmark */}
        <p
          className="text-center font-black leading-none tracking-tight"
          style={{
            fontFamily: 'var(--font-brand)',
            fontSize: 'clamp(1.4rem, 8cqw, 2.4rem)',
            color: 'var(--lr-ivory)',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          }}
        >
          {t('appName')}
        </p>

        {/* Tagline */}
        <p
          className="text-center font-bold uppercase"
          style={{
            fontSize: 'clamp(0.42rem, 2.4cqw, 0.65rem)',
            letterSpacing: '0.22em',
            color: 'var(--lr-brass)',
          }}
        >
          COMPRE · CONSTRUA · ACELERE
        </p>

        {/* Dice */}
        <div className="my-1">
          <DiceDisplay dice={dice} />
        </div>

        {/* Last event pill */}
        {latest ? (
          <div
            className="flex max-w-[13rem] flex-col items-center gap-0.5 rounded-xl px-3 py-1.5"
            style={{
              backgroundColor: 'rgba(6,18,33,0.72)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <span
              className="font-bold uppercase"
              style={{
                fontSize: 'clamp(0.38rem, 2cqw, 0.55rem)',
                letterSpacing: '0.2em',
                color: 'var(--lr-brass)',
              }}
            >
            {t('lastMove')}
            </span>
            <span
              className="truncate text-center font-semibold leading-snug"
              style={{
                fontSize: 'clamp(0.5rem, 2.8cqw, 0.75rem)',
                color: 'var(--lr-ivory)',
              }}
            >
              {latest}
            </span>
          </div>
        ) : (
          <p
            className="font-semibold"
            style={{
              fontSize: 'clamp(0.5rem, 2.8cqw, 0.72rem)',
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
