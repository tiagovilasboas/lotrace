import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { LayoutMatchScreen } from '@/features/game/containers/LayoutMatchScreen.tsx';
import { MatchScreen } from '@/features/game/containers/MatchScreen.tsx';
import { LobbyScreen } from '@/features/lobby/components/LobbyScreen.tsx';
import { useRoom } from '@/features/lobby/hooks/use-room.ts';
import {
  isLayoutCode,
  readLayoutNickname,
} from '@/features/lobby/lib/layout-code.ts';
import { t } from '@/lib/i18n.ts';

export function RoomRoute(): ReactElement {
  const { code = '' } = useParams();
  if (isLayoutCode(code)) {
    return <LayoutMatchScreen nickname={readLayoutNickname()} />;
  }
  return <OnlineRoomRoute code={code} />;
}

function OnlineRoomRoute({ code }: { code: string }): ReactElement {
  const navigate = useNavigate();
  const { room, session, error, busy, startGame, leave } = useRoom(code);

  if (!session || !room) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4 text-sm text-muted-foreground">
        {error ?? t('connecting')}
      </div>
    );
  }

  const playing =
    room.status === 'playing' && session.matchID && session.credentials;

  return (
    <div className="relative">
      {playing ? null : (
        <div className="absolute right-2 top-2 z-10">
          <ThemeToggle />
        </div>
      )}
      {playing ? (
        <MatchScreen
          matchID={session.matchID as string}
          playerID={session.playerID}
          credentials={session.credentials as string}
        />
      ) : (
        <LobbyScreen
          room={room}
          session={session}
          busy={busy}
          error={error}
          onStart={startGame}
          onLeave={() => {
            leave();
            void navigate('/');
          }}
        />
      )}
    </div>
  );
}
