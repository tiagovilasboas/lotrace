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
      style={{ backgroundColor: 'var(--lr-ivory)' }}
    >
      {/* ── Brand hero ─────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-1 text-center">
        <p
          className="text-[0.6875rem] font-bold uppercase tracking-[0.22em]"
          style={{ color: 'var(--lr-felt)' }}
        >
          {t('appName')}
        </p>
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: 'var(--font-brand)', color: 'var(--lr-midnight)' }}
        >
          {t('tagline')}
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: 'rgba(6,18,33,0.55)' }}
        >
          {t('homeMinPlayers')}
        </p>
      </header>

      {/* ── Nickname ───────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(6,18,33,0.10)',
          boxShadow: '0 2px 12px rgba(6,18,33,0.08)',
        }}
      >
        <label
          className="text-sm font-semibold"
          style={{ color: 'var(--lr-midnight)' }}
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
          className="border-[rgba(6,18,33,0.18)] bg-[var(--lr-ivory)] text-[var(--lr-midnight)] placeholder:text-[rgba(6,18,33,0.35)] focus-visible:border-[var(--lr-midnight)]"
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
            style={{ color: 'rgba(6,18,33,0.45)' }}
          >
            {t('createNeedNickname')}
          </p>
        ) : null}
      </section>

      {/* ── Divider ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1" style={{ backgroundColor: 'rgba(6,18,33,0.14)' }} />
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'rgba(6,18,33,0.35)' }}
        >
          ou
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: 'rgba(6,18,33,0.14)' }} />
      </div>

      {/* ── Join ───────────────────────────────────────────────── */}
      <section
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid rgba(6,18,33,0.10)',
          boxShadow: '0 2px 12px rgba(6,18,33,0.08)',
        }}
      >
        <label
          className="text-sm font-semibold"
          style={{ color: 'var(--lr-midnight)' }}
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
          className="border-[rgba(6,18,33,0.18)] bg-[var(--lr-ivory)] text-[var(--lr-midnight)] placeholder:text-[rgba(6,18,33,0.35)] focus-visible:border-[var(--lr-midnight)] font-mono tracking-[0.2em] text-lg"
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
            style={{ color: 'rgba(6,18,33,0.45)' }}
          >
            {t('joinNeedNicknameAndCode')}
          </p>
        ) : null}
        <p
          className="text-center text-xs"
          style={{ color: 'rgba(6,18,33,0.35)' }}
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
