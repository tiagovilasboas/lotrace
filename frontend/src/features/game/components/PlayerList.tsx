import type { PlayerState } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { CarToken } from '@/features/game/components/CarToken.tsx';
import { formatCashShort } from '@/features/game/lib/format-cash.ts';
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
      className="player-list"
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
            {/* Car token on the left */}
            <CarToken playerID={player.id} size="hud" />

            {/* Name + balance stacked on the right */}
            <div className="min-w-0 flex-1">
              <p className={cn('player-name', isViewer ? 'player-name--viewer' : 'player-name--other')}>
                {isViewer ? t('you') : player.nickname}
              </p>
              <p className="player-balance">
                {player.bankrupt ? t('bankrupt') : formatCashShort(player.cash)}
              </p>
            </div>

            {/* Turn badge — only for opponents; the viewer's turn is already
             * shown by the cyan card border, the header and the footer. */}
            {isTurn && !isViewer ? (
              <span className="player-badge-vez shrink-0">{t('yourTurnBadge')}</span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
