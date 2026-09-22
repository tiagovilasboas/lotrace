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
    /* Single row — never wraps. Each card takes equal flex space. */
    <ul className="flex gap-2">
      {players.map((player) => {
        const isTurn = player.id === currentPlayer;
        const isViewer = player.id === viewerID;

        return (
          <li
            key={player.id}
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl px-2.5 py-2.5',
              'surface-card',
              isTurn && 'surface-card-active',
              player.bankrupt && 'opacity-45',
            )}
          >
            {/* Car — hero element */}
            <CarToken playerID={player.id} size="hud" />

            {/* Name + cash */}
            <div className="min-w-0 flex-1 overflow-hidden">
              {/* Name row: badge VEZ left, then name */}
              <div className="flex min-w-0 items-center gap-1 leading-none">
                {isTurn ? (
                  <span
                    className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: 'var(--turn-badge-bg)',
                      color: 'var(--turn-badge-text)',
                    }}
                  >
                    {t('yourTurnBadge')}
                  </span>
                ) : null}
                <span
                  className={cn(
                    'truncate text-xs font-bold leading-none',
                    isViewer ? 'text-on-table' : 'text-on-table-dim',
                  )}
                  style={{ color: isViewer ? 'var(--text-on-table)' : 'var(--text-on-table-dim)' }}
                >
                  {isViewer ? t('you').toUpperCase() : player.nickname}
                </span>
              </div>

              {/* Cash */}
              <p
                className="mt-0.5 truncate text-sm font-black tabular-nums leading-none"
                style={{ color: 'var(--text-on-table)' }}
              >
                {player.bankrupt ? t('bankrupt') : formatCash(player.cash)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
