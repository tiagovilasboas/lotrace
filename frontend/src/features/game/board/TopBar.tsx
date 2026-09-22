/**
 * TopBar — 32px height, single line.
 *
 * Layout: [icon] [LOTRACE] [player-chips...] [theme-toggle]
 *
 * Player chips are tiny pills: colour dot + nickname + balance.
 * Active player gets a signal cyan border.
 * Everything fits in 32px — no wrapping, no scroll.
 */
import { Dices } from 'lucide-react';
import type { PlayerState } from '@lotrace/shared';
import type { ReactElement, ReactNode } from 'react';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { formatCashCompact } from '@/features/game/lib/format-cash.ts';
import { tokenCssVar } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';

type TopBarProps = {
  players: PlayerState[];
  currentPlayer: string;
  viewerID: string;
  chrome?: ReactNode;
};

function PlayerChip({
  player,
  isTurn,
  isViewer,
}: {
  player: PlayerState;
  isTurn: boolean;
  isViewer: boolean;
}): ReactElement {
  return (
    <span
      className="topbar-chip"
      style={{
        borderColor: isTurn ? 'var(--turn-highlight)' : 'var(--border-hud)',
        borderWidth: isTurn ? '1.5px' : '1px',
        opacity: player.bankrupt ? 0.4 : 1,
      }}
    >
      {/* Colour dot */}
      <span
        className="topbar-chip-dot"
        style={{ backgroundColor: tokenCssVar(player.id) }}
      />
      {/* Name */}
      <span
        className="topbar-chip-name"
        style={{ color: isViewer ? 'var(--text-on-table)' : 'var(--text-on-table-dim)' }}
      >
        {isViewer ? t('you') : player.nickname}
      </span>
      {/* Balance */}
      <span className="topbar-chip-balance">
        {player.bankrupt ? t('bankrupt') : formatCashCompact(player.cash)}
      </span>
    </span>
  );
}

export function TopBar({ players, currentPlayer, viewerID, chrome }: TopBarProps): ReactElement {
  return (
    <div className="topbar">
      {/* Logo */}
      <span className="topbar-icon" aria-hidden>
        <Dices className="size-3" />
      </span>
      <span className="topbar-title">{t('appName')}</span>

      {/* Player chips — flex-1 so they take remaining space */}
      <div className="topbar-chips">
        {players.map((player) => (
          <PlayerChip
            key={player.id}
            player={player}
            isTurn={player.id === currentPlayer}
            isViewer={player.id === viewerID}
          />
        ))}
      </div>

      {/* Layout-mode chrome */}
      {chrome ? <div className="topbar-chrome">{chrome}</div> : null}

      <ThemeToggle className="topbar-toggle" />
    </div>
  );
}
