import type { GameLogEvent, PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { formatEvent } from '@/features/game/lib/format-event.ts';

type EventLogProps = {
  events: GameLogEvent[];
  players: Record<string, PlayerState>;
};

export function EventLog({ events, players }: EventLogProps): ReactElement {
  const latest = [...events].reverse().slice(0, 4);
  return (
    <ul className="space-y-1">
      {latest.map((event, index) => (
        <li key={`${event.type}-${index}`}>{formatEvent(event, players)}</li>
      ))}
    </ul>
  );
}
