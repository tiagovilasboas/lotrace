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
    <div
      className="relative grid h-dvh w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-table)',
        /* dot-grid texture from spec */
        backgroundImage:
          'radial-gradient(circle, rgba(255,249,236,0.08) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        gridTemplateRows: 'auto auto minmax(0,1fr) auto',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        className="mx-3 mt-[max(0.4rem,env(safe-area-inset-top))] flex h-16 items-center gap-2 rounded-[1.125rem] px-3"
        style={{
          backgroundColor: 'var(--surface-hud-raised)',
          border: '1px solid var(--border-hud)',
        }}
      >
        {/* Logo icon — felt square with brass dice */}
        <span
          className="flex size-[2.625rem] shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: 'var(--surface-board)',
            border: '1px solid var(--lr-brass)',
          }}
        >
          <Dices
            className="size-5"
            aria-hidden
            style={{ color: 'var(--lr-ivory-light)' }}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p
            className="text-lg font-black leading-none tracking-tight"
            style={{
              fontFamily: 'var(--font-brand)',
              color: 'var(--text-on-table)',
              letterSpacing: '1.1px',
            }}
          >
            {t('appName')}
          </p>
          <p
            className="text-[7px] font-bold uppercase leading-none"
            style={{
              letterSpacing: '1.5px',
              color: 'var(--text-on-table-dim)',
              marginTop: '2px',
            }}
          >
            {t('brandSub')}
          </p>
        </div>

        {chrome ? (
          <div className="flex shrink-0 items-center gap-1 [&_button]:h-7 [&_button]:rounded-lg [&_button]:border [&_button]:border-[color:var(--border-hud)] [&_button]:bg-[color:var(--surface-hud)] [&_button]:px-2 [&_button]:text-[10px] [&_button]:text-[color:var(--text-on-table)]">
            {chrome}
          </div>
        ) : null}

        <ThemeToggle className="size-8 shrink-0 text-[color:var(--text-on-table-dim)]" />
      </header>

      {/* ── Player carousel ─────────────────────────────────────── */}
      <div className="px-3 pt-3">
        <PlayerList
          players={Object.values(G.players)}
          currentPlayer={ctx.currentPlayer}
          viewerID={viewerID}
        />
      </div>

      {/* ── Board hero ──────────────────────────────────────────── */}
      <div className="relative min-h-0 px-3 py-2">
        <div className="absolute inset-x-3 bottom-2 top-0 flex items-center justify-center">
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

      {/* ── Turn panel — sticky bottom ───────────────────────────── */}
      <div
        className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2"
      >
        {winner ? (
          <p
            className="rounded-[1.25rem] px-4 py-3 text-center text-base font-bold"
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
