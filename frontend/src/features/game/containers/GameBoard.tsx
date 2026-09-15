import type { ImobiliarioState, TurnStage } from '@imobiliario/shared';
import type { BoardProps } from 'boardgame.io/react';
import type { ReactElement } from 'react';
import { ActionBar } from '@/features/game/components/ActionBar.tsx';
import { BoardGrid } from '@/features/game/components/BoardGrid.tsx';
import { EventLog } from '@/features/game/components/EventLog.tsx';
import { PlayerList } from '@/features/game/components/PlayerList.tsx';
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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-3 px-3 pb-6 pt-3">
      <PlayerList
        players={Object.values(G.players)}
        currentPlayer={ctx.currentPlayer}
        viewerID={viewerID}
      />

      <BoardGrid
        players={G.players}
        owners={G.owners}
        pendingCell={G.pendingCell}
        center={
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t('appName')}
            </p>
            {dice ? (
              <p className="mt-1 font-mono text-3xl font-bold tabular-nums">
                {dice.die1} + {dice.die2}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">2d6</p>
            )}
            <p className="mt-1 text-sm font-semibold">
              {t('cash')}: R$ {G.players[viewerID]?.cash ?? 0}
            </p>
          </div>
        }
      />

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

      <EventLog events={G.log} players={G.players} />
    </div>
  );
}
