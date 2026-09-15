import { useState, type FormEvent, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
import { isLayoutCode } from '@/features/lobby/lib/layout-code.ts';
import { t } from '@/lib/i18n.ts';

type HomeScreenProps = {
  busy: boolean;
  error: string | null;
  onCreate: (nickname: string) => Promise<void>;
  onJoin: (code: string, nickname: string) => Promise<void>;
};

export function HomeScreen({
  busy,
  error,
  onCreate,
  onJoin,
}: HomeScreenProps): ReactElement {
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');

  const nicknameReady = nickname.trim().length >= 2;
  const codeReady = code.trim().length === 6;
  const layoutJoin = isLayoutCode(code);
  const createDisabled = busy || !nicknameReady;
  const joinDisabled = busy || !codeReady || (!layoutJoin && !nicknameReady);
  const showCreateHint = !nicknameReady;
  const showJoinHint = !layoutJoin && (!nicknameReady || !codeReady);

  const submitCreate = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await onCreate(nickname);
  };

  const submitJoin = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await onJoin(code, nickname);
  };

  return (
    <div className="home-felt mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-4 py-6">
      <header>
        <p className="text-sm font-semibold tracking-wide text-go">{t('appName')}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{t('tagline')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('homeMinPlayers')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('layoutCodeHint')}</p>
      </header>

      <Card>
        <form className="flex flex-col gap-3" onSubmit={submitCreate}>
          <label className="text-sm font-medium" htmlFor="nickname">
            {t('nickname')}
          </label>
          <Input
            id="nickname"
            autoComplete="nickname"
            value={nickname}
            placeholder={t('nicknamePlaceholder')}
            onChange={(event) => setNickname(event.target.value)}
            required
            minLength={2}
            maxLength={20}
          />
          <Button
            type="submit"
            size="lg"
            disabled={createDisabled}
            aria-describedby={showCreateHint ? 'create-need-nickname' : undefined}
          >
            {t('createRoom')}
          </Button>
          {showCreateHint ? (
            <p id="create-need-nickname" className="text-xs text-muted-foreground">
              {t('createNeedNickname')}
            </p>
          ) : null}
        </form>
      </Card>

      <Card>
        <form className="flex flex-col gap-3" onSubmit={submitJoin}>
          <label className="text-sm font-medium" htmlFor="code">
            {t('roomCode')}
          </label>
          <Input
            id="code"
            value={code}
            placeholder={t('roomCodePlaceholder')}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            required
            minLength={6}
            maxLength={6}
            autoCapitalize="characters"
          />
          <Button
            type="submit"
            variant="outline"
            size="lg"
            disabled={joinDisabled}
            aria-describedby={showJoinHint ? 'join-need-nickname-and-code' : undefined}
          >
            {t('joinRoom')}
          </Button>
          {showJoinHint ? (
            <p id="join-need-nickname-and-code" className="text-xs text-muted-foreground">
              {t('joinNeedNicknameAndCode')}
            </p>
          ) : null}
        </form>
      </Card>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
