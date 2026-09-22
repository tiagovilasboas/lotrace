import type { RoomView, SessionPayload } from '@lotrace/shared';
import { useState, type ReactElement } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { LobbyPlayerChip } from '@/features/lobby/components/LobbyPlayerChip.tsx';
import { tokenCssVar } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';

type LobbyScreenProps = {
  room: RoomView;
  session: SessionPayload;
  busy: boolean;
  error: string | null;
  onStart: () => Promise<void>;
  onLeave: () => void;
};

export function LobbyScreen({ room, session, busy, error, onStart, onLeave }: LobbyScreenProps): ReactElement {
  const [copied, setCopied] = useState(false);
  const missingPlayers = Math.max(0, room.minPlayers - room.players.length);
  const canStart = session.isHost && missingPlayers === 0;

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    /* Dark chrome — mesmas cores do tabuleiro */
    <div className="game-screen flex min-h-dvh w-full flex-col" style={{ padding: '0 12px' }}>

      {/* ── Topbar ── */}
      <header className="game-header shrink-0 flex items-center gap-2">
        <span className="game-logo-icon shrink-0">
          <Dices className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="game-logo-title">{t('appName')}</p>
          <p className="game-logo-sub">{t('brandSub')}</p>
        </div>
        <Button className="match-secondary shrink-0 text-xs px-3" style={{ height: '28px' }} onClick={onLeave}>
          {t('leave')}
        </Button>
        <ThemeToggle className="size-7 shrink-0 text-[color:var(--text-on-table-dim)]" />
      </header>

      {/* ── Room code ── */}
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-on-table-dim)' }}>
          {t('roomCode')}
        </p>
        <p
          className="font-mono text-5xl font-black"
          style={{ fontFamily: 'var(--font-brand)', color: 'var(--lr-brass)', letterSpacing: '0.25em' }}
        >
          {room.code}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-table-dim)' }}>{t('inviteHint')}</p>
        <Button className="match-secondary mt-1 px-6 text-xs" style={{ height: '28px' }} onClick={() => void copy()}>
          {copied ? t('copied') : t('copyCode')}
        </Button>
      </div>

      {/* ── Player list — surface-hud cards ── */}
      <div className="mx-auto w-full max-w-sm flex-1 pb-6">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-on-table-dim)' }}>
          {t('players')} ({room.players.length}/{room.maxPlayers})
        </p>
        <ul className="flex flex-col gap-2">
          {room.players.map((player) => (
            <li
              key={player.seat}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{
                backgroundColor: 'var(--surface-hud)',
                border: `1px solid ${player.seat === Number(session.playerID) ? 'var(--turn-highlight)' : 'var(--border-hud)'}`,
              }}
            >
              {/* Avatar dot in player colour */}
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: tokenCssVar(String(player.seat)) }}
              />
              <LobbyPlayerChip seat={player.seat} />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold" style={{ color: 'var(--text-on-table)' }}>
                {player.nickname}
                {player.seat === Number(session.playerID) ? (
                  <span className="ml-1.5 text-[10px]" style={{ color: 'var(--text-on-table-dim)' }}>({t('you')})</span>
                ) : null}
              </span>
              {player.isHost ? (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: 'var(--turn-badge-bg)', color: 'var(--turn-badge-text)' }}
                >
                  {t('host')}
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        {/* Start / waiting */}
        <div className="mt-6">
          {session.isHost ? (
            <div className="flex flex-col gap-2">
              <Button size="lg" className="match-cta w-full" disabled={!canStart || busy} onClick={() => void onStart()}>
                {t('startGame')}
              </Button>
              {missingPlayers > 0 ? (
                <p className="text-center text-xs" style={{ color: 'var(--text-on-table-dim)' }}>
                  {t('needMorePlayers', { count: String(missingPlayers) })}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: 'var(--text-on-table-dim)' }}>{t('waiting')}</p>
          )}
        </div>

        {error ? <p className="mt-2 text-sm text-destructive" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
