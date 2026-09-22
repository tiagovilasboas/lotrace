import { Imobiliario } from '@lotrace/shared';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useCallback, useMemo, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { GameBoard } from '@/features/game/containers/GameBoard.tsx';
import { buildLayoutMockState } from '@/features/game/lib/layout-mock-state.ts';
import { MatchChromeProvider } from '@/features/game/lib/match-chrome.tsx';
import { SeatFollowContext } from '@/features/game/lib/seat-follow.ts';
import {
  LAYOUT_MATCH_ID,
  LAYOUT_PLAYERS,
  layoutNicknames,
} from '@/features/lobby/lib/layout-code.ts';
import { t } from '@/lib/i18n.ts';

type LayoutMatchScreenProps = {
  nickname: string;
};

const SEATS = Array.from({ length: LAYOUT_PLAYERS }, (_, i) => String(i));

export function LayoutMatchScreen({
  nickname,
}: LayoutMatchScreenProps): ReactElement {
  const navigate = useNavigate();
  const [seat, setSeat] = useState('0');
  const names = useMemo(() => layoutNicknames(nickname), [nickname]);

  /* LAYOUT preview: seed a richly populated 4-player board so every piece,
   * icon and state (hotel, houses, stations, jail, cars on all sides) is
   * visible at once. Not used by real matches. */
  const LayoutClient = useMemo(
    () =>
      Client({
        game: {
          ...Imobiliario,
          setup: () => buildLayoutMockState(names),
        },
        board: GameBoard,
        numPlayers: LAYOUT_PLAYERS,
        multiplayer: Local(),
        debug: false,
      }),
    [names],
  );

  const nextSeat = String((Number(seat) + 1) % LAYOUT_PLAYERS);
  const nextName = names[Number(nextSeat)] ?? `Jogador ${Number(nextSeat) + 1}`;

  /* Follow the active player automatically across all four seats. */
  const followActivePlayer = useCallback((currentPlayer: string): void => {
    if (SEATS.includes(currentPlayer)) {
      setSeat(currentPlayer);
    }
  }, []);

  return (
    <MatchChromeProvider
      chrome={
        <>
          <p className="sr-only">{t('layoutMode')}</p>
          <Button size="sm" variant="outline" onClick={() => setSeat(nextSeat)}>
            {t('layoutSwitch', { name: nextName })}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              void navigate('/');
            }}
          >
            {t('leave')}
          </Button>
        </>
      }
    >
      {SEATS.map((s) => (
        <div key={s} className={seat === s ? 'contents' : 'hidden'}>
          <SeatFollowContext.Provider value={{ onActivePlayerChange: followActivePlayer }}>
            <LayoutClient matchID={LAYOUT_MATCH_ID} playerID={s} />
          </SeatFollowContext.Provider>
        </div>
      ))}
    </MatchChromeProvider>
  );
}
