import type { ImobiliarioState, TurnStage } from '@lotrace/shared';
import type { BoardProps } from 'boardgame.io/react';
import type { ReactElement } from 'react';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { BoardRing } from '@/features/game/board/BoardRing.tsx';
import { ActionBar } from '@/features/game/components/ActionBar.tsx';
import { DiceDisplay } from '@/features/game/components/DiceDisplay.tsx';
import { EventLog } from '@/features/game/components/EventLog.tsx';
import { PlayerList } from '@/features/game/components/PlayerList.tsx';
import { useMatchChrome } from '@/features/game/lib/match-chrome.ts';
import { t } from '@/lib/i18n.ts';

function readWinner(
  gameover: unknown,
  players: ImobiliarioState['players'],
): string | null {
  if (typeof gameover !== 'object' || gameover === null || !('winner' in gameover)) {
    return null;
  }
  const winner = (gameover as { winner: unknown }).winner;
  if (typeof winner !== 'string') {
    return null;
  }
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
  const dice = G.lastDice;
  const chrome = useMatchChrome();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-page">
      <header className="flex shrink-0 items-center gap-1.5 px-2 pb-1 pt-[max(0.35rem,env(safe-area-inset-top))]">
        {chrome ? <div className="flex shrink-0 items-center gap-1">{chrome}</div> : null}
        <div className="min-w-0 flex-1">
          <PlayerList
            players={Object.values(G.players)}
            currentPlayer={ctx.currentPlayer}
            viewerID={viewerID}
          />
        </div>
        <ThemeToggle />
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center px-1">
        <div className="relative w-full max-w-[min(100%,calc(100dvh-11rem))]">
          <BoardRing
            players={G.players}
            owners={G.owners}
            houses={G.houses}
            pendingCell={G.pendingCell}
            center={
              <div className="board-center-felt flex h-full w-full flex-col items-center justify-center gap-2 px-2">
                <DiceDisplay dice={dice} />
                <div className="max-w-[16rem] rounded-xl bg-board-track/95 px-3 py-2 text-board-ink shadow-md">
                  <EventLog events={G.log} players={G.players} />
                </div>
              </div>
            }
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border/70 bg-page/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        {winner ? (
          <p className="rounded-xl bg-primary px-4 py-3 text-center text-lg font-bold text-primary-foreground">
            {t('winner', { name: winner })}
          </p>
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
      </div>
    </div>
  );
}
