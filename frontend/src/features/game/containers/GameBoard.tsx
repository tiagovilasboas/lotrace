import type { ImobiliarioState, TurnStage } from '@lotrace/shared';
import type { BoardProps } from 'boardgame.io/react';
import type { ReactElement } from 'react';
import { TopBar } from '@/features/game/board/TopBar.tsx';
import { BoardCenter } from '@/features/game/board/BoardCenter.tsx';
import { BoardRing } from '@/features/game/board/BoardRing.tsx';
import { ActionBar } from '@/features/game/components/ActionBar.tsx';
import { EventLog } from '@/features/game/components/EventLog.tsx';
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
  const viewerID    = playerID ?? '0';
  const stage       = ctx.activePlayers?.[ctx.currentPlayer] as TurnStage | undefined;
  const current     = G.players[ctx.currentPlayer];
  const winner      = readWinner(ctx.gameover, G.players);
  const chrome      = useMatchChrome();
  const playerCount = Object.keys(G.players).length;
  const playerList  = Object.values(G.players);

  return (
    /**
     * 3 rows:
     *   TopBar  32px  — logo + player chips + toggle
     *   Board   flex-1 — hero
     *   Footer  auto   — action bar
     */
    <div
      className="game-screen flex h-dvh w-full flex-col overflow-hidden"
      style={{ gap: '6px', padding: '6px 8px 0' }}
    >
      {/* ── 32px top bar with inline player chips ── */}
      <TopBar
        players={playerList}
        currentPlayer={ctx.currentPlayer}
        viewerID={viewerID}
        chrome={chrome}
      />

      {/* ── Board fills everything, stays square, max width & height ── */}
      <div className="board-3d-scene board-area">
        <div className="board-square">
          <BoardRing
            players={G.players}
            owners={G.owners}
            houses={G.houses}
            pendingCell={G.pendingCell}
            center={
              <BoardCenter dice={G.lastDice} events={G.log} players={G.players} />
            }
          />
        </div>
      </div>

      {/* ── Footer action bar ── */}
      <div
        className="shrink-0"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
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
