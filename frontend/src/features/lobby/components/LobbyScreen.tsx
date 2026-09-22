import type { RoomView, SessionPayload } from '@lotrace/shared';
import { useState, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { LobbyPlayerChip } from '@/features/lobby/components/LobbyPlayerChip.tsx';
import { t } from '@/lib/i18n.ts';

type LobbyScreenProps = {
  room: RoomView;
  session: SessionPayload;
  busy: boolean;
  error: string | null;
  onStart: () => Promise<void>;
  onLeave: () => void;
};

export function LobbyScreen({
  room,
  session,
  busy,
  error,
  onStart,
  onLeave,
}: LobbyScreenProps): ReactElement {
  const [copied, setCopied] = useState(false);
  const missingPlayers = Math.max(0, room.minPlayers - room.players.length);
  const canStart = session.isHost && missingPlayers === 0;

  const copy = async (): Promise<void> => {
    await navigator.clipboard.writeText(room.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-4 py-8"
      style={{ backgroundColor: 'var(--surface-table)' }}
    >
      {/* ── Room code hero ─────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-2 text-center">
        <p
          className="text-[0.6875rem] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('roomCode')}
        </p>
        <p
          className="font-mono text-5xl font-black tracking-[0.3em]"
          style={{
            fontFamily: 'var(--font-brand)',
            color: 'var(--text-on-table)',
            letterSpacing: '0.3em',
          }}
        >
          {room.code}
        </p>
        <p
          className="text-sm"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('inviteHint')}
        </p>
      </header>

      {/* ── Copy / leave ───────────────────────────────────────── */}
      <div className="flex gap-2">
        <Button
          className="match-secondary flex-1"
          onClick={() => void copy()}
        >
          {copied ? t('copied') : t('copyCode')}
        </Button>
        <Button
          className="match-secondary"
          onClick={onLeave}
        >
          {t('leave')}
        </Button>
      </div>

      {/* ── Player list ────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-1 rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--surface-hud)',
          border: '1px solid var(--border-hud)',
        }}
      >
        <h2
          className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.12em]"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('players')} ({room.players.length}/{room.maxPlayers})
        </h2>
        <ul className="space-y-2">
          {room.players.map((player) => (
            <li
              key={player.seat}
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--surface-hud-raised) 80%, transparent)',
                border: '1px solid var(--border-hud)',
              }}
            >
              <span className="flex min-w-0 items-center gap-2">
                <LobbyPlayerChip seat={player.seat} />
                <span
                  className="truncate font-semibold text-sm"
                  style={{ color: 'var(--text-on-table)' }}
                >
                  {player.nickname}
                  {player.seat === Number(session.playerID) ? (
                    <span
                      className="ml-2 text-xs"
                      style={{ color: 'var(--text-on-table-dim)' }}
                    >
                      ({t('you')})
                    </span>
                  ) : null}
                </span>
              </span>
              {player.isHost ? (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--turn-highlight) 18%, transparent)',
                    color: 'var(--turn-highlight)',
                  }}
                >
                  {t('host')}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Start / waiting ────────────────────────────────────── */}
      {session.isHost ? (
        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            className="match-cta"
            disabled={!canStart || busy}
            onClick={() => void onStart()}
          >
            {t('startGame')}
          </Button>
          {missingPlayers > 0 ? (
            <p
              className="text-center text-sm"
              style={{ color: 'var(--text-on-table-dim)' }}
            >
              {t('needMorePlayers', { count: String(missingPlayers) })}
            </p>
          ) : null}
        </div>
      ) : (
        <p
          className="text-center text-sm"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('waiting')}
        </p>
      )}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
