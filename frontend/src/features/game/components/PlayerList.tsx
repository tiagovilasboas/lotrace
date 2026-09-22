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

/**
 * Compact single-row player strip.
 * Each chip: car token + name/cash in ~44px height.
 * Active player gets a cyan ring; no text wrap; car scales down for 5-6 players.
 */
export function PlayerList({
  players,
  currentPlayer,
  viewerID,
}: PlayerListProps): ReactElement {
  const count = players.length;

  return (
    <ul className="flex gap-1.5">
      {players.map((player) => {
        const isTurn = player.id === currentPlayer;
        const isViewer = player.id === viewerID;

        return (
          <li
            key={player.id}
            className={cn(
              'relative flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-xl px-1.5 py-1',
              player.bankrupt && 'opacity-40',
            )}
            style={{
              backgroundColor: 'var(--surface-hud)',
              border: isTurn
                ? '1.5px solid var(--turn-highlight)'
                : '1px solid var(--border-hud)',
              boxShadow: isTurn
                ? '0 0 8px rgba(87,216,255,0.20)'
                : undefined,
            }}
          >
            {/* Active turn indicator — top-left dot */}
            {isTurn ? (
              <span
                className="absolute left-1 top-1 size-1.5 rounded-full"
                style={{ backgroundColor: 'var(--turn-highlight)' }}
              />
            ) : null}

            {/* Car — smaller when many players */}
            <span
              className="shrink-0"
              style={{
                transform: count >= 5 ? 'scale(0.72)' : count === 4 ? 'scale(0.85)' : 'scale(1)',
                transformOrigin: 'left center',
              }}
            >
              <CarToken playerID={player.id} size="hud" />
            </span>

            {/* Name + cash — right of car */}
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-[10px] font-bold uppercase leading-none tracking-wide"
                style={{
                  color: isViewer
                    ? 'var(--text-on-table)'
                    : 'var(--text-on-table-dim)',
                }}
              >
                {isViewer ? t('you') : player.nickname}
              </p>
              <p
                className="truncate text-xs font-black tabular-nums leading-none"
                style={{ color: 'var(--text-on-table)', marginTop: '2px' }}
              >
                {player.bankrupt ? t('bankrupt') : formatCash(player.cash)}
              </p>
            </div>

            {/* VEZ badge — bottom right, tiny */}
            {isTurn ? (
              <span
                className="absolute bottom-0.5 right-1 rounded-sm px-1 py-px text-[7px] font-black uppercase leading-none tracking-wide"
                style={{
                  backgroundColor: 'var(--turn-badge-bg)',
                  color: 'var(--turn-badge-text)',
                }}
              >
                {t('yourTurnBadge')}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
