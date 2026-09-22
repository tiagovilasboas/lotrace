import type { DiceRoll, GameLogEvent, PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { DiceDisplay } from '@/features/game/components/DiceDisplay.tsx';
import { latestEventText } from '@/features/game/lib/format-event.ts';
import { t } from '@/lib/i18n.ts';

type BoardCanvasCenterProps = {
  dice: DiceRoll | null;
  events: GameLogEvent[];
  players: Record<string, PlayerState>;
};

/**
 * Centre HUD for the iso canvas board: dice + last-move pill, floated over the
 * middle of the city. The city is the hero, so this stays compact — no big
 * wordmark competing with the buildings.
 */
export function BoardCanvasCenter({
  dice,
  events,
  players,
}: BoardCanvasCenterProps): ReactElement {
  const latest = latestEventText(events, players);

  return (
    <div className="board-canvas-center" aria-live="polite">
      <DiceDisplay dice={dice} />
      <div className="board-canvas-lastmove">
        <span className="board-canvas-lastmove-label">{t('lastMove')}</span>
        <span className="board-canvas-lastmove-text">{latest ?? t('luck')}</span>
      </div>
    </div>
  );
}
