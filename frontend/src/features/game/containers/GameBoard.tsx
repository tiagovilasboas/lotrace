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
      className="flex min-h-dvh w-full flex-col gap-2"
      style={{ backgroundColor: 'var(--surface-table)', paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {/* ── Header — floating card ──────────────────────────────── */}
      <header
        className="mx-3 mt-[max(0.5rem,env(safe-area-inset-top))] flex items-center gap-2 rounded-2xl px-3 py-2.5"
        style={{
          backgroundColor: 'var(--surface-hud)',
          border: '1px solid var(--border-hud)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Logo icon */}
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'var(--surface-board)',
            color: 'var(--lr-brass)',
          }}
        >
          <Dices className="size-5" aria-hidden />
        </span>

        {/* Wordmark */}
        <div className="min-w-0 flex-1">
          <p
            className="text-base font-black leading-none tracking-tight"
            style={{ fontFamily: 'var(--font-brand)', color: 'var(--text-on-table)' }}
          >
            {t('appName')}
          </p>
          <p
            className="text-[9px] font-semibold uppercase leading-none"
            style={{ letterSpacing: '0.18em', color: 'var(--turn-highlight)', marginTop: '2px' }}
          >
            {t('brandSub')}
          </p>
        </div>

        {/* Layout chrome buttons */}
        {chrome ? (
          <div className="flex shrink-0 items-center gap-1 [&_button]:h-8 [&_button]:rounded-lg [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--surface-hud-raised)] [&_button]:px-2.5 [&_button]:text-xs [&_button]:text-[color:var(--text-on-table)]">
            {chrome}
          </div>
        ) : null}

        <ThemeToggle
          className="shrink-0 text-[color:var(--text-on-table-dim)] hover:bg-[color:var(--action-secondary)]"
        />
      </header>

      {/* ── Player cards ────────────────────────────────────────── */}
      <div className="px-3">
        <PlayerList
          players={Object.values(G.players)}
          currentPlayer={ctx.currentPlayer}
          viewerID={viewerID}
        />
      </div>

      {/* ── Board hero — fills remaining space ──────────────────── */}
      <div className="min-h-0 flex-1 px-3">
        <div className="flex h-full items-center justify-center">
          <div className="aspect-square h-full max-h-full max-w-full" style={{ width: 'auto' }}>
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

      {/* ── Action bar ──────────────────────────────────────────── */}
      <div className="px-3">
        {winner ? (
          <p
            className="rounded-2xl px-4 py-4 text-center text-lg font-bold"
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
        <p
          className="mt-1.5 text-center text-[10px] font-medium"
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
