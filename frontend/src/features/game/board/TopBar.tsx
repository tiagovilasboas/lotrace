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
  /* In a 32px bar with up to 6 players, only the viewer shows a name.
   * The others are identified by their colour dot + balance. */
  return (
    <span
      className="topbar-chip"
      style={{
        borderColor: isTurn ? 'var(--turn-highlight)' : 'var(--border-hud)',
        borderWidth: isTurn ? '1.5px' : '1px',
        opacity: player.bankrupt ? 0.4 : 1,
      }}
    >
      {/* Colour dot identifies the player (viewer dot is ringed) */}
      <span
        className="topbar-chip-dot"
        style={{
          backgroundColor: tokenCssVar(player.id),
          boxShadow: isViewer ? '0 0 0 2px var(--lr-signal)' : undefined,
        }}
      />
      {/* Balance — colour dot already says who it is */}
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

      {/* Only the viewer's balance lives in the 32px bar — opponents' money
       * belongs to a dedicated player panel, not squeezed here. */}
      <div className="topbar-chips">
        {players
          .filter((player) => player.id === viewerID)
          .map((player) => (
            <PlayerChip
              key={player.id}
              player={player}
              isTurn={player.id === currentPlayer}
              isViewer
            />
          ))}
      </div>

      {/* Layout-mode chrome */}
      {chrome ? <div className="topbar-chrome">{chrome}</div> : null}

      <ThemeToggle className="topbar-toggle" />
    </div>
  );
}
