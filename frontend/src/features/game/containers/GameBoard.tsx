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
    <div className="match-table grid min-h-dvh w-full grid-rows-[auto_auto_minmax(0,1fr)_auto]">

      {/* ── Header bar ─────────────────────────────────────────── */}
      <header
        className="flex items-center gap-2 px-3 pb-1 pt-[max(0.4rem,env(safe-area-inset-top))]"
        style={{ backgroundColor: 'var(--surface-hud-raised)' }}
      >
        {/* Logo */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--turn-highlight) 15%, transparent)',
              color: 'var(--turn-highlight)',
            }}
          >
            <Dices className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p
              className="text-lg font-black tracking-tight"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--text-on-table)' }}
            >
              {t('appName')}
            </p>
            <p
              className="text-[10px] font-semibold uppercase"
              style={{
                letterSpacing: '0.22em',
                color: 'color-mix(in srgb, var(--turn-highlight) 80%, transparent)',
              }}
            >
              {t('brandSub')}
            </p>
          </div>
        </div>

        {/* Layout chrome (switch seat / leave) */}
        {chrome ? (
          <div
            className="flex shrink-0 items-center gap-1"
            style={{
              ['--btn-border' as string]: 'var(--border-hud)',
              ['--btn-bg' as string]: 'var(--action-secondary)',
              ['--btn-text' as string]: 'var(--text-on-table)',
            }}
          >
            <div className="flex items-center gap-1 [&_button]:h-8 [&_button]:rounded-lg [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--action-secondary)] [&_button]:px-2.5 [&_button]:text-xs [&_button]:text-[color:var(--text-on-table)]">
              {chrome}
            </div>
          </div>
        ) : null}

        <ThemeToggle
          className="text-[color:var(--text-on-table-dim)] hover:bg-[color:var(--action-secondary)]"
        />
      </header>

      {/* ── Player cards ───────────────────────────────────────── */}
      <PlayerList
        players={Object.values(G.players)}
        currentPlayer={ctx.currentPlayer}
        viewerID={viewerID}
      />

      {/* ── Board hero ─────────────────────────────────────────── */}
      <div className="relative min-h-0">
        <div className="absolute inset-0 flex items-center justify-center px-2">
          <div className="aspect-square h-full max-h-full w-auto max-w-full">
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

      {/* ── Action bar ─────────────────────────────────────────── */}
      <div className="px-3 pb-[max(0.85rem,env(safe-area-inset-bottom))] pt-2">
        {winner ? (
          <p
            className="rounded-2xl px-4 py-3 text-center text-lg font-bold"
            style={{
              backgroundColor: 'var(--turn-highlight)',
              color: 'var(--turn-badge-text)',
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
        <p
          className="mt-2 text-center text-[11px] font-medium"
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
