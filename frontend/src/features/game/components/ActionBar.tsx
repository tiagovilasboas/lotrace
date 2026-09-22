import { getCell, JAIL_FEE, JAIL_WAIT_TURNS, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import { Dices } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { BuyHouseActions } from '@/features/game/components/BuyHouseActions.tsx';
import { CarToken } from '@/features/game/components/CarToken.tsx';
import { useRollBusy } from '@/features/game/hooks/use-roll-busy.ts';
import { listBuildableLots } from '@/features/game/lib/buildable-lots.ts';
import { formatCash } from '@/features/game/lib/format-cash.ts';
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

/**
 * Compact prompt row — single line: car + title + hint truncated.
 * Height: ~36px. No card, no padding bloat.
 */
function PromptRow({
  viewerID,
  title,
  hint,
}: {
  viewerID: string;
  title: string;
  hint: string;
}): ReactElement {
  return (
    <div className="flex items-center gap-2 px-0.5 py-0.5">
      <span className="shrink-0 scale-75 origin-left">
        <CarToken playerID={viewerID} size="hud" />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-xs font-bold leading-none"
          style={{ color: 'var(--text-on-table)' }}
        >
          {title}
        </p>
        <p
          className="truncate text-[10px] leading-none"
          style={{ color: 'var(--text-on-table-dim)', marginTop: '2px' }}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}

/** Primary CTA — tall fullwidth pill */
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
      className="match-cta h-11 w-full rounded-full text-sm font-black tracking-wide"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}

export function ActionBar({
  G,
  stage,
  isActive,
  currentName,
  viewerID,
  moves,
}: ActionBarProps): ReactElement {
  const { rollBusy, beginRoll } = useRollBusy(stage, isActive);
  const viewer = G.players[viewerID];
  const viewerName = viewer?.nickname ?? currentName;

  const handleRoll = (): void => {
    if (!beginRoll()) return;
    moves.rollDice?.();
  };

  const pending = G.pendingCell !== null ? getCell(G.pendingCell) : null;
  const canAfford = pending?.price !== undefined && viewer !== undefined && viewer.cash >= pending.price;
  const canPayJail = viewer !== undefined && viewer.cash >= JAIL_FEE;
  const buildableLots = listBuildableLots(G, viewerID);
  const waitsLeft = JAIL_WAIT_TURNS - (viewer?.jailTurns ?? 0);

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
    <div className="flex flex-col gap-1.5">
      {/* Compact prompt row */}
      <PromptRow viewerID={viewerID} title={title} hint={hint} />

      {/* CTA — only when active */}
      {isActive ? (
        <>
          {rollBusy ? (
            <PrimaryCTA loading ariaLabel={t('rolling')}>
              {t('rolling')}
            </PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'roll' ? (
            <PrimaryCTA onClick={handleRoll} ariaLabel={t('roll')}>
              <Dices className="size-4" aria-hidden />
              {t('roll')}
            </PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'buy' && pending ? (
            <div className="grid grid-cols-2 gap-1.5">
              <PrimaryCTA disabled={!canAfford} onClick={() => moves.buyProperty?.()}>
                {t('buy')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-11 w-full rounded-full text-sm font-bold"
                onClick={() => moves.skipBuy?.()}
              >
                {t('skip')}
              </Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'jail' ? (
            <div className="grid grid-cols-2 gap-1.5">
              <PrimaryCTA disabled={!canPayJail} onClick={() => moves.payJail?.()}>
                {t('payJail')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-11 w-full rounded-full text-sm font-bold"
                onClick={() => moves.waitJail?.()}
              >
                {t('waitJail')}
              </Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'end' ? (
            <>
              {buildableLots.length > 0 ? (
                <BuyHouseActions
                  lots={buildableLots}
                  onBuy={(cellIndex) => moves.buyHouse?.(cellIndex)}
                />
              ) : null}
              <Button
                size="lg"
                className="match-secondary h-10 w-full rounded-full text-sm font-bold"
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
