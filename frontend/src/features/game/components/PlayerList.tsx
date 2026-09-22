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

export function PlayerList({ players, currentPlayer, viewerID }: PlayerListProps): ReactElement {
  return (
    /* Horizontal snap-scroll carousel. Tailwind: layout + scroll behaviour only. */
    <ul
      className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {players.map((player) => {
        const isTurn    = player.id === currentPlayer;
        const isViewer  = player.id === viewerID;

        return (
          <li
            key={player.id}
            className={cn(
              'player-card',
              isTurn  && 'player-card--active',
              player.bankrupt && 'opacity-40',
            )}
          >
            {/* Top: car + badge */}
            <div className="flex items-center justify-between gap-1">
              <CarToken playerID={player.id} size="hud" />
              {isTurn ? (
                <span className="player-badge-vez">{t('yourTurnBadge')}</span>
              ) : null}
            </div>

            {/* Bottom: name + balance */}
            <div className="min-w-0">
              <p className={cn('player-name', isViewer ? 'player-name--viewer' : 'player-name--other')}>
                {isViewer ? t('you') : player.nickname}
              </p>
              <p className="player-balance">
                {player.bankrupt ? t('bankrupt') : formatCash(player.cash)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
