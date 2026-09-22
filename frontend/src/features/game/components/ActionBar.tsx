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
 * Prompt card — player avatar + name + hint text.
 * Visually separate from the CTA button below it (matches mockup).
 */
function PromptCard({
  viewerID,
  title,
  hint,
}: {
  viewerID: string;
  title: string;
  hint: string;
}): ReactElement {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
      style={{
        backgroundColor: 'var(--surface-hud)',
        border: '1px solid var(--border-hud)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <CarToken playerID={viewerID} size="hud" />
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-bold leading-tight"
          style={{ color: 'var(--text-on-table)' }}
        >
          {title}
        </p>
        <p
          className="text-xs leading-snug"
          style={{ color: 'var(--text-on-table-dim)' }}
        >
          {hint}
        </p>
      </div>
    </div>
  );
}

/** Tall fullwidth pill CTA — mirrors mockup "LANÇAR DADOS" */
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
      className="match-cta h-14 w-full rounded-full text-base font-black tracking-wide"
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
    <div className="flex flex-col gap-2">
      {/* Prompt card — always visible */}
      <PromptCard viewerID={viewerID} title={title} hint={hint} />

      {/* CTA area — only when active */}
      {isActive ? (
        <>
          {/* Roll / rolling */}
          {rollBusy ? (
            <PrimaryCTA loading ariaLabel={t('rolling')}>
              {t('rolling')}
            </PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'roll' ? (
            <PrimaryCTA onClick={handleRoll} ariaLabel={t('roll')}>
              <Dices className="size-5" aria-hidden />
              {t('roll')}
            </PrimaryCTA>
          ) : null}

          {/* Buy property */}
          {!rollBusy && stage === 'buy' && pending ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canAfford} onClick={() => moves.buyProperty?.()}>
                {t('buy')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-14 w-full rounded-full text-base font-bold"
                onClick={() => moves.skipBuy?.()}
              >
                {t('skip')}
              </Button>
            </div>
          ) : null}

          {/* Jail */}
          {!rollBusy && stage === 'jail' ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canPayJail} onClick={() => moves.payJail?.()}>
                {t('payJail')}
              </PrimaryCTA>
              <Button
                size="lg"
                className="match-secondary h-14 w-full rounded-full text-base font-bold"
                onClick={() => moves.waitJail?.()}
              >
                {t('waitJail')}
              </Button>
            </div>
          ) : null}

          {/* Build houses */}
          {!rollBusy && stage === 'end' && buildableLots.length > 0 ? (
            <>
              <BuyHouseActions
                lots={buildableLots}
                onBuy={(cellIndex) => moves.buyHouse?.(cellIndex)}
              />
              <Button
                size="lg"
                className="match-secondary h-12 w-full rounded-full font-bold"
                onClick={() => moves.endTurn?.()}
              >
                {t('endTurn')}
              </Button>
            </>
          ) : null}

          {/* End turn — no houses to buy */}
          {!rollBusy && stage === 'end' && buildableLots.length === 0 ? (
            <Button
              size="lg"
              className="match-secondary h-12 w-full rounded-full font-bold"
              onClick={() => moves.endTurn?.()}
            >
              {t('endTurn')}
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
