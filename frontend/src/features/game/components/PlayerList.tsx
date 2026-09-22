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
 * Horizontal carousel — spec: mobile card 148×66px, active card 168px wide.
 * Snap-scrolls to centre the active player.
 * Desktop: 4-column grid (no scroll).
 */
export function PlayerList({
  players,
  currentPlayer,
  viewerID,
}: PlayerListProps): ReactElement {
  return (
    <ul
      className="flex gap-2 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {players.map((player) => {
        const isTurn = player.id === currentPlayer;
        const isViewer = player.id === viewerID;

        return (
          <li
            key={player.id}
            className={cn(
              'flex shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-3',
              player.bankrupt && 'opacity-40',
            )}
            style={{
              /* active card wider: 168px vs 148px */
              width: isTurn ? '168px' : '148px',
              height: '66px',
              scrollSnapAlign: 'start',
              backgroundColor: isTurn
                ? 'var(--surface-hud-active)'
                : 'var(--surface-hud)',
              border: isTurn
                ? '2px solid var(--turn-highlight)'
                : '1px solid var(--border-hud)',
              boxShadow: isTurn ? 'var(--glow-turn)' : undefined,
              transition: 'width 200ms ease',
            }}
          >
            {/* Top row: car + badge */}
            <div className="flex items-center justify-between gap-1">
              <CarToken playerID={player.id} size="hud" />
              {isTurn ? (
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase leading-none tracking-wide"
                  style={{
                    backgroundColor: 'var(--turn-badge-bg)',
                    color: 'var(--turn-badge-text)',
                  }}
                >
                  {t('yourTurnBadge')}
                </span>
              ) : null}
            </div>

            {/* Bottom row: name + balance */}
            <div className="min-w-0">
              <p
                className="truncate text-[11px] font-extrabold uppercase leading-none tracking-wide"
                style={{ color: isViewer ? 'var(--text-on-table)' : 'var(--text-on-table-dim)' }}
              >
                {isViewer ? t('you') : player.nickname}
              </p>
              <p
                className="truncate text-sm font-bold tabular-nums leading-none"
                style={{ color: 'var(--text-on-table)', marginTop: '2px' }}
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
