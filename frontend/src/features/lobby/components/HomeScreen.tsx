import { useState, type FormEvent, type ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
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
    <div
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-4 py-8"
      style={{ backgroundColor: 'var(--surface-table)' }}
    >
      {/* ── Brand hero ─────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-[0.6875rem] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'var(--turn-highlight)' }}
        >
          {t('appName')}
        </p>
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: 'var(--font-brand)', color: 'var(--text-on-table)' }}
        >
          {t('tagline')}
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('homeMinPlayers')}
        </p>
      </header>

      {/* ── Nickname ───────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--surface-hud)',
          border: '1px solid var(--border-hud)',
        }}
      >
        <label
          className="text-sm font-semibold"
          style={{ color: 'var(--text-on-table)' }}
          htmlFor="nickname"
        >
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
        <form onSubmit={submitCreate}>
          <Button
            type="submit"
            size="lg"
            className="match-cta w-full"
            disabled={createDisabled}
            aria-describedby={showCreateHint ? 'create-need-nickname' : undefined}
          >
            {t('createRoom')}
          </Button>
        </form>
        {showCreateHint ? (
          <p
            id="create-need-nickname"
            className="text-xs"
            style={{ color: 'var(--text-on-table-dim)' }}
          >
            {t('createNeedNickname')}
          </p>
        ) : null}
      </section>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hud)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          ou
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hud)' }} />
      </div>

      {/* ── Join ───────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: 'var(--surface-hud)',
          border: '1px solid var(--border-hud)',
        }}
      >
        <label
          className="text-sm font-semibold"
          style={{ color: 'var(--text-on-table)' }}
          htmlFor="code"
        >
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
        <form onSubmit={submitJoin}>
          <Button
            type="submit"
            size="lg"
            className="match-secondary w-full"
            disabled={joinDisabled}
            aria-describedby={showJoinHint ? 'join-need-nickname-and-code' : undefined}
          >
            {t('joinRoom')}
          </Button>
        </form>
        {showJoinHint ? (
          <p
            id="join-need-nickname-and-code"
            className="text-xs"
            style={{ color: 'var(--text-on-table-dim)' }}
          >
            {t('joinNeedNicknameAndCode')}
          </p>
        ) : null}
        <p
          className="text-center text-xs"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {t('layoutCodeHint')}
        </p>
      </section>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
