import { useState, type FormEvent, type ReactElement } from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ThemeToggle } from '@/components/theme-toggle.tsx';
import { isLayoutCode } from '@/features/lobby/lib/layout-code.ts';
import { t } from '@/lib/i18n.ts';

type HomeScreenProps = {
  busy: boolean;
  error: string | null;
  onCreate: (nickname: string) => Promise<void>;
  onJoin: (code: string, nickname: string) => Promise<void>;
};

export function HomeScreen({ busy, error, onCreate, onJoin }: HomeScreenProps): ReactElement {
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');

  const nicknameReady  = nickname.trim().length >= 2;
  const codeReady      = code.trim().length === 6;
  const layoutJoin     = isLayoutCode(code);
  const createDisabled = busy || !nicknameReady;
  const joinDisabled   = busy || !codeReady || (!layoutJoin && !nicknameReady);
  const showCreateHint = !nicknameReady;
  const showJoinHint   = !layoutJoin && (!nicknameReady || !codeReady);

  const submitCreate = async (e: FormEvent): Promise<void> => { e.preventDefault(); await onCreate(nickname); };
  const submitJoin   = async (e: FormEvent): Promise<void> => { e.preventDefault(); await onJoin(code, nickname); };

  return (
    /* Dark chrome — mesmas cores do tabuleiro */
    <div className="game-screen flex min-h-dvh w-full flex-col" style={{ padding: '0 12px' }}>

      {/* ── Topbar — mesma estrutura do GameBoard ── */}
      <header className="game-header shrink-0 flex items-center gap-2" style={{ marginBottom: '0' }}>
        <span className="game-logo-icon shrink-0">
          <Dices className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="game-logo-title">{t('appName')}</p>
          <p className="game-logo-sub">{t('brandSub')}</p>
        </div>
        <ThemeToggle className="size-7 shrink-0 text-[color:var(--text-on-table-dim)]" />
      </header>

      {/* ── Brand hero ── */}
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <h1
          className="text-4xl font-black tracking-tight"
          style={{ fontFamily: 'var(--font-brand)', color: 'var(--lr-ivory-light)' }}
        >
          {t('tagline')}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-on-table-dim)' }}>
          {t('homeMinPlayers')}
        </p>
      </div>

      {/* ── Form cards — surface-hud, igual ao turn-panel ── */}
      <div className="mx-auto flex w-full max-w-sm flex-col gap-4 pb-8">

        {/* Create */}
        <section className="turn-panel">
          <label className="turn-title block" htmlFor="nickname">{t('nickname')}</label>
          <Input
            id="nickname"
            autoComplete="nickname"
            value={nickname}
            placeholder={t('nicknamePlaceholder')}
            onChange={(e) => setNickname(e.target.value)}
            required minLength={2} maxLength={20}
          />
          <form onSubmit={submitCreate}>
            <Button type="submit" size="lg" className="match-cta w-full" disabled={createDisabled}
              aria-describedby={showCreateHint ? 'c-hint' : undefined}>
              {t('createRoom')}
            </Button>
          </form>
          {showCreateHint ? (
            <p id="c-hint" className="turn-hint">{t('createNeedNickname')}</p>
          ) : null}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hud)' }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-table-dim)' }}>ou</span>
          <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-hud)' }} />
        </div>

        {/* Join */}
        <section className="turn-panel">
          <label className="turn-title block" htmlFor="code">{t('roomCode')}</label>
          <Input
            id="code"
            value={code}
            placeholder={t('roomCodePlaceholder')}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required minLength={6} maxLength={6} autoCapitalize="characters"
            className="font-mono tracking-[0.25em] text-lg"
          />
          <form onSubmit={submitJoin}>
            <Button type="submit" size="lg" className="match-secondary w-full" disabled={joinDisabled}
              aria-describedby={showJoinHint ? 'j-hint' : undefined}>
              {t('joinRoom')}
            </Button>
          </form>
          {showJoinHint ? (
            <p id="j-hint" className="turn-hint">{t('joinNeedNicknameAndCode')}</p>
          ) : null}
          <p className="turn-hint text-center">{t('layoutCodeHint')}</p>
        </section>

        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      </div>
    </div>
  );
}
