import type { PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';
import { formatCash } from '@/features/game/lib/format-cash.ts';
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
    <ul className="flex flex-wrap gap-2 px-3 pb-1">
      {players.map((player) => {
        const isTurn = player.id === currentPlayer;
        return (
          <li
            key={player.id}
            className={cn(
              'flex min-w-0 flex-1 basis-[calc(50%-0.25rem)] items-center gap-2.5 rounded-2xl px-3 py-2.5',
              'surface-card',
              isTurn ? 'surface-card-active' : '',
              player.bankrupt && 'opacity-45',
            )}
          >
            <CarToken playerID={player.id} size="hud" />
            <div className="min-w-0 flex-1">
              <p className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-sm font-semibold leading-tight text-on-table">
                  {player.nickname}
                  {player.id === viewerID ? (
                    <span className="ml-1 text-[10px] font-medium text-on-table-dim">
                      {t('you')}
                    </span>
                  ) : null}
                </span>
                {isTurn ? (
                  <span className="shrink-0 rounded-full bg-[color:var(--turn-badge-bg)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[color:var(--turn-badge-text)]">
                    {t('yourTurnBadge')}
                  </span>
                ) : null}
              </p>
              <p className="text-sm font-bold tabular-nums leading-tight text-on-table">
                {player.bankrupt ? t('bankrupt') : formatCash(player.cash)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
