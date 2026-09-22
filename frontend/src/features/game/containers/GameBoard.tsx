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
    /**
     * Layout: flex-col h-dvh, padding uniforme 12px.
     * Board row: flex-1 min-h-0 — pega tudo que sobrar.
     * Sem px fixos em altura — proporcional ao viewport.
     */
    <div
      className="game-screen flex h-dvh w-full flex-col overflow-hidden"
      style={{ padding: '10px 10px 0 10px', gap: '8px' }}
    >
      {/* ── Header — card arredondado com logo, subtítulo e toggle ── */}
      <header className="game-header shrink-0">
        {/* Logo icon: felt bg + brass border */}
        <span className="game-logo-icon">
          <Dices className="size-4" aria-hidden />
        </span>

        {/* Wordmark */}
        <div className="min-w-0 flex-1">
          <p className="game-logo-title">{t('appName')}</p>
          <p className="game-logo-sub">{t('brandSub')}</p>
        </div>

        {/* Layout-mode chrome buttons */}
        {chrome ? (
          <div className="flex shrink-0 items-center gap-1 [&_button]:h-7 [&_button]:rounded-lg [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--surface-hud)] [&_button]:px-2 [&_button]:text-[10px] [&_button]:text-[color:var(--text-on-table)]">
            {chrome}
          </div>
        ) : null}

        <ThemeToggle className="size-8 shrink-0 text-[color:var(--text-on-table-dim)]" />
      </header>

      {/* ── Player carousel ── */}
      <div className="shrink-0">
        <PlayerList
          players={Object.values(G.players)}
          currentPlayer={ctx.currentPlayer}
          viewerID={viewerID}
        />
      </div>

      {/* ── Board hero — fills all remaining height ── */}
      <div className="board-3d-scene relative min-h-0 flex-1">
        <div className="absolute inset-0 flex items-end justify-center">
          {/*
           * board-3d-tilt: CSS rotateX perspective.
           * Height: 96% of the container — leaves a sliver for visual breathing.
           * aspect-square: always square regardless of container shape.
           */}
          <div
            className="board-3d-tilt relative aspect-square max-w-full"
            style={{ height: '96%', width: 'auto' }}
          >
            <BoardRing
              players={G.players}
              owners={G.owners}
              houses={G.houses}
              pendingCell={G.pendingCell}
              center={<BoardCenter dice={G.lastDice} events={G.log} players={G.players} />}
            />
            {/* PiecesCanvas desativado — calibrar posições antes de reativar
            <PiecesCanvas G={G} />
            */}
          </div>
        </div>
      </div>

      {/* ── Turn panel / footer ── */}
      <div
        className="shrink-0"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
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
