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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-2">
      <svg
        className="pointer-events-none absolute inset-x-[4%] bottom-[8%] h-[62%] w-[92%] text-emerald-950/55"
        viewBox="0 0 240 120"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 120 V78 C28 52 46 70 68 44 C92 14 118 38 140 22 C162 8 178 36 198 28 C214 22 228 40 240 34 V120Z"
        />
        <path
          fill="#0b3a28"
          opacity="0.85"
          d="M8 120 V86 h10 v-22 h8 v22 h9 v-34 h7 v34 h11 v-16 h8 v16 h14 v-26 h8 v26 h16 v-18 h9 v18 h18 v-28 h8 v28 h14 v-12 h8 v12 h16 v-22 h9 v22 h18 V120Z"
        />
        <path
          fill="none"
          stroke="#d4b45a"
          strokeWidth="1.2"
          opacity="0.35"
          d="M12 104 C70 90 120 108 228 92"
        />
      </svg>
      <div className="relative z-[1] flex flex-col items-center gap-2">
        <DiceDisplay dice={dice} />
        <p className="max-w-[12.5rem] truncate text-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#e8d48a]">
          {latest ?? t('luck')}
        </p>
      </div>
    </div>
  );
}
