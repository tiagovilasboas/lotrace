import { useState, type FormEvent, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Input } from '@/components/ui/input.tsx';
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

  const submitCreate = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await onCreate(nickname);
  };

  const submitJoin = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await onJoin(code, nickname);
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-4 py-6">
      <header className="pt-4">
        <p className="text-sm font-medium text-primary">{t('appName')}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{t('tagline')}</h1>
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
          <Button type="submit" size="lg" disabled={busy || nickname.trim().length < 2}>
            {t('createRoom')}
          </Button>
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
            disabled={busy || nickname.trim().length < 2 || code.trim().length !== 6}
          >
            {t('joinRoom')}
          </Button>
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
