import type { ImobiliarioState, TurnStage } from '@lotrace/shared';
import type { BoardProps } from 'boardgame.io/react';
import { Dices } from 'lucide-react';
import type { ReactElement } from 'react';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { BoardCenter } from '@/features/game/board/BoardCenter.tsx';
import { BoardRing } from '@/features/game/board/BoardRing.tsx';
import { ActionBar } from '@/features/game/components/ActionBar.tsx';
import { EventLog } from '@/features/game/components/EventLog.tsx';
import { PlayerList } from '@/features/game/components/PlayerList.tsx';
import { PiecesCanvas } from '@/features/game/pieces3d/PiecesCanvas.tsx';
import { useMatchChrome } from '@/features/game/lib/match-chrome.ts';
import { t } from '@/lib/i18n.ts';

function readWinner(
  gameover: unknown,
  players: ImobiliarioState['players'],
): string | null {
  if (typeof gameover !== 'object' || gameover === null || !('winner' in gameover)) return null;
  const winner = (gameover as { winner: unknown }).winner;
  if (typeof winner !== 'string') return null;
  return players[winner]?.nickname ?? winner;
}

export function GameBoard({
  G,
  ctx,
  moves,
  playerID,
  isActive,
}: BoardProps<ImobiliarioState>): ReactElement {
  const viewerID = playerID ?? '0';
  const stage = ctx.activePlayers?.[ctx.currentPlayer] as TurnStage | undefined;
  const current = G.players[ctx.currentPlayer];
  const winner = readWinner(ctx.gameover, G.players);
  const chrome = useMatchChrome();
  const playerCount = Object.keys(G.players).length;

  return (
    /* game-screen: dot-grid bg. Tailwind: layout grid h-dvh */
    <div
      className="game-screen grid h-dvh w-full overflow-hidden"
      style={{
        gridTemplateRows: 'auto auto minmax(0,1fr) auto',
        gap: '12px',
        padding: '12px 12px 0 12px',
      }}
    >
      {/* Header — 32px, single line */}
      <header className="game-header">
        <span className="game-logo-icon">
          <Dices className="size-3" aria-hidden />
        </span>
        <p className="game-logo-title min-w-0 flex-1 truncate">{t('appName')}</p>
        {chrome ? (
          <div className="flex shrink-0 items-center gap-1 [&_button]:h-6 [&_button]:rounded-md [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--surface-hud)] [&_button]:px-1.5 [&_button]:text-[9px] [&_button]:text-[color:var(--text-on-table)]">
            {chrome}
          </div>
        ) : null}
        <ThemeToggle className="size-6 shrink-0 text-[color:var(--text-on-table-dim)]" />
      </header>

      {/* Player carousel */}
      <PlayerList
        players={Object.values(G.players)}
        currentPlayer={ctx.currentPlayer}
        viewerID={viewerID}
      />

      {/* Board hero — CSS 3D perspective + Three.js pieces overlay */}
      <div className="board-3d-scene relative min-h-0">
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          {/* Tilt wrapper — CSS perspective */}
          <div
            className="board-3d-tilt relative aspect-square max-h-full max-w-full"
            style={{ height: '88%', width: 'auto' }}
          >
            {/* DOM board — tiles, names, prices */}
            <BoardRing
              players={G.players}
              owners={G.owners}
              houses={G.houses}
              pendingCell={G.pendingCell}
              center={<BoardCenter dice={G.lastDice} events={G.log} players={G.players} />}
            />
            {/* Three.js pieces — cars, houses, hotels, trees (pointer-events:none) */}
            <PiecesCanvas G={G} />
          </div>
        </div>
      </div>

      {/* Turn panel */}
      <div style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        {winner ? (
          <p className="winner-banner">{t('winner', { name: winner })}</p>
        ) : (
          <ActionBar
            G={G}
            stage={isActive ? (ctx.activePlayers?.[viewerID] as TurnStage | undefined) : stage}
            isActive={Boolean(isActive && !ctx.gameover)}
            currentName={current?.nickname ?? ctx.currentPlayer}
            viewerID={viewerID}
            moves={moves}
          />
        )}
        <p className="game-player-count">{t('playerCount', { count: String(playerCount) })}</p>
        <div className="sr-only">
          <EventLog events={G.log} players={G.players} />
        </div>
      </div>
    </div>
  );
}
