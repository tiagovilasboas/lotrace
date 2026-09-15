import { Imobiliario } from '@lotrace/shared';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import type { ReactElement } from 'react';
import { GameBoard } from '@/features/game/containers/GameBoard.tsx';
import { getServerUrl } from '@/lib/api-base.ts';
import { t } from '@/lib/i18n.ts';

const ImobiliarioClient = Client({
  game: Imobiliario,
  board: GameBoard,
  multiplayer: SocketIO({ server: getServerUrl() }),
  debug: false,
  loading: () => (
    <p className="p-6 text-center text-sm text-muted-foreground">{t('connecting')}</p>
  ),
});

type MatchScreenProps = {
  matchID: string;
  playerID: string;
  credentials: string;
};

export function MatchScreen({
  matchID,
  playerID,
  credentials,
}: MatchScreenProps): ReactElement {
  return (
    <ImobiliarioClient
      matchID={matchID}
      playerID={playerID}
      credentials={credentials}
    />
  );
}
