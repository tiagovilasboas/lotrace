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
  const caption = latestEventText(events, players) ?? t('luck');

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-2">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-black/25"
        viewBox="0 0 200 140"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 140 V88 l18-10 14 8 22-28 16 12 20-22 12 8 24-36 18 20 28-16 28 22V140Z"
        />
        <path
          fill="currentColor"
          opacity="0.45"
          d="M0 140 V108 h12 v-18 h8 v18 h10 v-28 h7 v28 h14 v-12 h9 v12 h18 v-22 h8 v22 h22 v-16 h10 v16 h20 v-24 h9 v24 h16 v-10 h8 v10 h18 v-20 h10 v20 h20 V140Z"
        />
      </svg>
      <div className="relative z-[1] flex flex-col items-center gap-2">
        <DiceDisplay dice={dice} />
        <p
          className={
            caption === t('luck')
              ? 'max-w-[14rem] text-center text-[0.72rem] font-bold uppercase tracking-[0.18em] text-board-track/90'
              : 'max-w-[14rem] text-center text-[0.68rem] font-semibold leading-snug text-board-track/90'
          }
        >
          {caption}
        </p>
      </div>
    </div>
  );
}
