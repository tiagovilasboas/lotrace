import type { PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';
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
    <ul className="flex gap-1.5 overflow-x-auto pb-0.5">
      {players.map((player) => (
        <li
          key={player.id}
          className={cn(
            'flex min-w-0 shrink-0 items-center gap-1.5 rounded-full bg-card px-2 py-1 shadow-sm ring-1 ring-border',
            player.id === currentPlayer && 'player-turn-pulse bg-accent',
            player.bankrupt && 'opacity-50',
          )}
        >
          <CarToken playerID={player.id} size="hud" />
          <div className="min-w-0 pr-0.5">
            <p className="max-w-28 truncate text-xs font-semibold leading-tight">
              {player.nickname}
              {player.id === viewerID ? (
                <span className="ml-1 text-[10px] font-medium text-muted-foreground">
                  {t('you')}
                </span>
              ) : null}
            </p>
            <p className="text-[11px] font-bold tabular-nums leading-tight">
              {player.bankrupt ? t('bankrupt') : `R$ ${player.cash}`}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
