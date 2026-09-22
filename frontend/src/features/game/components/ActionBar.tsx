import { getCell, JAIL_FEE, JAIL_WAIT_TURNS, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import { Dices } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { BuyHouseActions } from '@/features/game/components/BuyHouseActions.tsx';
import { useRollBusy } from '@/features/game/hooks/use-roll-busy.ts';
import { listBuildableLots } from '@/features/game/lib/buildable-lots.ts';
import { formatCash } from '@/features/game/lib/format-cash.ts';
import { tokenBgStyle } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';

type GameMoves = {
  rollDice?: () => void;
  buyProperty?: () => void;
  skipBuy?: () => void;
  endTurn?: () => void;
  payJail?: () => void;
  waitJail?: () => void;
  buyHouse?: (cellIndex: number) => void;
};

type ActionBarProps = {
  G: ImobiliarioState;
  stage: TurnStage | undefined;
  isActive: boolean;
  currentName: string;
  viewerID: string;
  moves: GameMoves;
};

// ─── Sub-components ────────────────────────────────────────────

/**
 * Player avatar — filled circle in the player's token colour.
 * Spec: avatar shape=circle, color=player token.
 */
function PlayerAvatar({ playerID }: { playerID: string }): ReactElement {
  return (
    <span
      className="size-9 shrink-0 rounded-full"
      style={{
        ...tokenBgStyle(playerID),
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 2px 6px rgba(0,0,0,0.3)',
      }}
      aria-hidden
    />
  );
}

/**
 * Prompt row — avatar + title/hint on one line.
 * Spec: turnPanel player title + description.
 */
function PromptRow({ playerID, title, hint }: { playerID: string; title: string; hint: string }): ReactElement {
  return (
    <div className="flex items-center gap-3">
      <PlayerAvatar playerID={playerID} />
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-bold leading-none"
          style={{ color: 'var(--text-on-table)' }}
        >
          {title}
        </p>
        <p
          className="mt-0.5 truncate text-xs leading-none"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}

/**
 * Primary CTA — spec: h=48px pill, action blue, uppercase tracking-wide.
 */
function PrimaryCTA({
  children,
  onClick,
  disabled,
  loading,
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}): ReactElement {
  return (
    <Button
      size="lg"
      className="match-cta h-12 w-full rounded-full text-xs font-black tracking-[2px]"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

// ─── Main component ────────────────────────────────────────────

export function ActionBar({
  G,
  stage,
  isActive,
  currentName,
  viewerID,
  moves,
}: ActionBarProps): ReactElement {
  const { rollBusy, beginRoll } = useRollBusy(stage, isActive);
  const viewer     = G.players[viewerID];
  const viewerName = viewer?.nickname ?? currentName;

  const handleRoll = (): void => {
    if (!beginRoll()) return;
    moves.rollDice?.();
  };

  const pending    = G.pendingCell !== null ? getCell(G.pendingCell) : null;
  const canAfford  = pending?.price !== undefined && viewer !== undefined && viewer.cash >= pending.price;
  const canPayJail = viewer !== undefined && viewer.cash >= JAIL_FEE;
  const buildable  = listBuildableLots(G, viewerID);
  const waitsLeft  = JAIL_WAIT_TURNS - (viewer?.jailTurns ?? 0);

  const hint = !isActive
    ? t('waitHint', { name: currentName })
    : stage === 'buy' && pending
      ? t('buyHint', { name: pending.name, price: pending.price === undefined ? '' : formatCash(pending.price) })
      : stage === 'jail'
        ? t('jailHint', { turns: String(waitsLeft) })
        : stage === 'end'
          ? t('buildHint')
          : t('rollHint');

  const title = !isActive
    ? t('waitTurn', { name: currentName })
    : t('yourTurnNamed', { name: viewerName });

  return (
    /*
     * Spec: turnPanel background=chromeLight (#123654), borderRadius=26, padding=18.
     * On mobile: padding=12, primaryActionHeight=48, safeArea handled by parent.
     */
    <div
      className="flex flex-col gap-2 rounded-[1.375rem] p-3"
      style={{
        backgroundColor: 'var(--surface-hud)',
        border: '1px solid var(--border-hud)',
      }}
    >
      <PromptRow playerID={viewerID} title={title} hint={hint} />

      {isActive ? (
        <>
          {rollBusy ? (
            <PrimaryCTA loading ariaLabel={t('rolling')}>{t('rolling')}</PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'roll' ? (
            <PrimaryCTA onClick={handleRoll} ariaLabel={t('roll')}>
              <Dices className="size-4" aria-hidden />
              {t('roll')}
            </PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'buy' && pending ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canAfford} onClick={() => moves.buyProperty?.()}>
                {t('buy')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-12 w-full rounded-full text-xs font-bold tracking-wide"
                onClick={() => moves.skipBuy?.()}
              >
                {t('skip')}
              </Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'jail' ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canPayJail} onClick={() => moves.payJail?.()}>
                {t('payJail')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-12 w-full rounded-full text-xs font-bold tracking-wide"
                onClick={() => moves.waitJail?.()}
              >
                {t('waitJail')}
              </Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'end' ? (
            <>
              {buildable.length > 0 ? (
                <BuyHouseActions lots={buildable} onBuy={(i) => moves.buyHouse?.(i)} />
              ) : null}
              <Button
                size="lg"
                className="match-secondary h-11 w-full rounded-full text-xs font-bold tracking-wide"
                onClick={() => moves.endTurn?.()}
              >
                {t('endTurn')}
              </Button>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
