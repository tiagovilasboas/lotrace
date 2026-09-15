import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { HomeScreen } from '@/features/lobby/components/HomeScreen.tsx';
import { useRoom } from '@/features/lobby/hooks/use-room.ts';

export function HomeRoute(): ReactElement {
  const navigate = useNavigate();
  const { busy, error, createRoom, joinRoom } = useRoom();

  return (
    <div className="relative">
      <div className="absolute right-3 top-3">
        <ThemeToggle />
      </div>
      <HomeScreen
        busy={busy}
        error={error}
        onCreate={async (nickname) => {
          const session = await createRoom(nickname);
          await navigate(`/sala/${session.code}`);
        }}
        onJoin={async (code, nickname) => {
          const session = await joinRoom(code, nickname);
          await navigate(`/sala/${session.code}`);
        }}
      />
    </div>
  );
}
