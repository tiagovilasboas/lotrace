import type { RoomView, SessionPayload } from '@lotrace/shared';
import { useState, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
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
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-6">
      <header>
        <p className="text-sm text-muted-foreground">{t('roomCode')}</p>
        <p className="font-mono text-4xl font-bold tracking-[0.3em]">{room.code}</p>
        <p className="mt-2 text-sm text-muted-foreground">{t('inviteHint')}</p>
      </header>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => void copy()}>
          {copied ? t('copied') : t('copyCode')}
        </Button>
        <Button variant="ghost" onClick={onLeave}>
          {t('leave')}
        </Button>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {t('players')} ({room.players.length}/{room.maxPlayers})
        </h2>
        <ul className="space-y-2">
          {room.players.map((player) => (
            <li
              key={player.seat}
              className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2">
                <LobbyPlayerChip seat={player.seat} />
                <span className="truncate font-medium">
                  {player.nickname}
                  {player.seat === Number(session.playerID) ? (
                    <span className="ml-2 text-xs text-muted-foreground">({t('you')})</span>
                  ) : null}
                </span>
              </span>
              {player.isHost ? (
                <span className="shrink-0 text-xs font-semibold text-primary">{t('host')}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Card>

      {session.isHost ? (
        <div className="flex flex-col gap-2">
          <Button size="lg" disabled={!canStart || busy} onClick={() => void onStart()}>
            {t('startGame')}
          </Button>
          {missingPlayers > 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t('needMorePlayers', { count: String(missingPlayers) })}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">{t('waiting')}</p>
      )}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
