import { Imobiliario } from '@lotrace/shared';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useMemo, useState, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { GameBoard } from '@/features/game/containers/GameBoard.tsx';
import {
  LAYOUT_GUEST_NAME,
  LAYOUT_MATCH_ID,
  layoutNicknames,
} from '@/features/lobby/lib/layout-code.ts';
import { t } from '@/lib/i18n.ts';

type LayoutMatchScreenProps = {
  nickname: string;
};

export function LayoutMatchScreen({
  nickname,
}: LayoutMatchScreenProps): ReactElement {
  const navigate = useNavigate();
  const [seat, setSeat] = useState<'0' | '1'>('0');
  const names = useMemo(() => layoutNicknames(nickname), [nickname]);

  const LayoutClient = useMemo(
    () =>
      Client({
        game: {
          ...Imobiliario,
          setup: (context) => Imobiliario.setup!(context, { nicknames: names }),
        },
        board: GameBoard,
        numPlayers: 2,
        multiplayer: Local(),
        debug: false,
      }),
    [names],
  );

  const otherSeat = seat === '0' ? '1' : '0';
  const otherName = names[Number(otherSeat)] ?? LAYOUT_GUEST_NAME;

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-40">
        <ThemeToggle />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-[7.5rem] z-40 flex justify-center px-3">
        <div className="pointer-events-auto flex max-w-md flex-wrap items-center justify-center gap-2 rounded-full bg-card/95 px-2 py-1 shadow-sm ring-1 ring-border">
          <p className="px-2 text-[11px] font-medium text-muted-foreground">
            {t('layoutMode')}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSeat(otherSeat)}
          >
            {t('layoutSwitch', { name: otherName })}
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
        </div>
      </div>
      <div className={seat === '0' ? 'contents' : 'hidden'}>
        <LayoutClient matchID={LAYOUT_MATCH_ID} playerID="0" />
      </div>
      <div className={seat === '1' ? 'contents' : 'hidden'}>
        <LayoutClient matchID={LAYOUT_MATCH_ID} playerID="1" />
      </div>
    </div>
  );
}
