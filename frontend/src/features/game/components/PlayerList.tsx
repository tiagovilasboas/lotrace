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
    <ul className="flex gap-2 overflow-x-auto px-3 pb-1">
      {players.map((player) => {
        const isTurn = player.id === currentPlayer;
        return (
          <li
            key={player.id}
            className={cn(
              'flex min-w-[10.25rem] flex-1 items-center gap-2 rounded-2xl px-3 py-2',
              'bg-[color-mix(in_srgb,var(--match-card)_88%,transparent)] shadow-md',
              isTurn
                ? 'ring-2 ring-sky-400/90 shadow-[0_0_18px_rgba(56,189,248,0.28)]'
                : 'ring-1 ring-white/10',
              player.bankrupt && 'opacity-45',
            )}
          >
            <CarToken playerID={player.id} size="hud" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold leading-tight text-white">
                <span className="truncate">{player.nickname}</span>
                {player.id === viewerID ? (
                  <span className="shrink-0 text-[10px] font-medium text-white/55">
                    {t('you')}
                  </span>
                ) : null}
              </p>
              <p className="text-sm font-bold tabular-nums leading-tight text-white">
                {player.bankrupt ? t('bankrupt') : formatCash(player.cash)}
              </p>
            </div>
            {isTurn ? (
              <span className="shrink-0 rounded-full bg-sky-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-950">
                {t('yourTurnBadge')}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
