import type { PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { tokenClass } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type PlayerListProps = {
  players: PlayerState[];
  currentPlayer: string;
  viewerID: string;
};

export function PlayerList({
  players,
  currentPlayer,
  viewerID,
}: PlayerListProps): ReactElement {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {players.map((player) => (
        <li
          key={player.id}
          className={cn(
            'surface-card flex items-center gap-2 px-3 py-2',
            player.id === currentPlayer && 'ring-2 ring-primary',
            player.bankrupt && 'opacity-50',
          )}
        >
          <span className={cn('size-2.5 shrink-0 rounded-full', tokenClass(player.id))} />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {player.nickname}
              {player.id === viewerID ? (
                <span className="ml-1 text-xs text-muted-foreground">({t('you')})</span>
              ) : null}
            </p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {player.bankrupt ? t('bankrupt') : `R$ ${player.cash}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
