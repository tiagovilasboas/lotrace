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
  const chrome = useMatchChrome();
  const playerCount = Object.keys(G.players).length;

  return (
    <div
      className="grid h-dvh w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-table)',
        /* rows: top-bar | board | action-bar */
        gridTemplateRows: 'auto minmax(0,1fr) auto',
      }}
    >
      {/* ═══ TOP STRIP — header + player chips, one block ════════ */}
      <div
        className="px-2 pt-[max(0.3rem,env(safe-area-inset-top))]"
        style={{ backgroundColor: 'var(--surface-table)' }}
      >
        {/* Header bar — logo left, chrome + toggle right */}
        <div className="flex h-9 items-center gap-1.5">
          {/* Logo icon */}
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--surface-board)', color: 'var(--lr-brass)' }}
          >
            <Dices className="size-[15px]" aria-hidden />
          </span>

          <p
            className="min-w-0 flex-1 truncate text-sm font-black tracking-tight"
            style={{ fontFamily: 'var(--font-brand)', color: 'var(--text-on-table)' }}
          >
            {t('appName')}
          </p>

          {chrome ? (
            <div className="flex shrink-0 items-center gap-1 [&_button]:h-6 [&_button]:rounded-md [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--surface-hud-raised)] [&_button]:px-2 [&_button]:text-[10px] [&_button]:text-[color:var(--text-on-table)]">
              {chrome}
            </div>
          ) : null}

          <ThemeToggle className="size-7 shrink-0 text-[color:var(--text-on-table-dim)]" />
        </div>

        {/* Player chips — compact row right below the header */}
        <div className="pb-1 pt-0.5">
          <PlayerList
            players={Object.values(G.players)}
            currentPlayer={ctx.currentPlayer}
            viewerID={viewerID}
          />
        </div>
      </div>

      {/* ═══ BOARD — fills all remaining space ═══════════════════ */}
      <div className="relative min-h-0 px-2 pb-1">
        <div className="absolute inset-x-2 bottom-1 top-0 flex items-center justify-center">
          <div
            className="aspect-square h-full max-h-full max-w-full"
            style={{ width: 'auto' }}
          >
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
      </div>

      {/* ═══ FOOTER — action bar, minimal ════════════════════════ */}
      <div
        className="px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1"
      >
        {winner ? (
          <p
            className="rounded-xl px-3 py-2.5 text-center text-base font-bold"
            style={{
              backgroundColor: 'var(--turn-highlight)',
              color: 'var(--turn-badge-text)',
              fontFamily: 'var(--font-brand)',
            }}
          >
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

        {/* Player count — sr-only on tiny screens, faint on desktop */}
        <p
          className="mt-1 text-center text-[10px]"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('playerCount', { count: String(playerCount) })}
        </p>

        <div className="sr-only">
          <EventLog events={G.log} players={G.players} />
        </div>
      </div>
    </div>
  );
}
