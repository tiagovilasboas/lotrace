import { getCell, JAIL_FEE, JAIL_WAIT_TURNS, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import { Dices } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { BuyHouseActions } from '@/features/game/components/BuyHouseActions.tsx';
import { useRollBusy } from '@/features/game/hooks/use-roll-busy.ts';
import { listBuildableLots } from '@/features/game/lib/buildable-lots.ts';
import { formatCash } from '@/features/game/lib/format-cash.ts';
import { tokenCssVar } from '@/features/game/player-tokens.ts';
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

/* Avatar circle — only inline style is the player-specific bg colour */
function TurnAvatar({ playerID }: { playerID: string }): ReactElement {
  return (
    <span
      className="turn-avatar"
      style={{ backgroundColor: tokenCssVar(playerID) }}
      aria-hidden
    />
  );
}

function TurnPrompt({ playerID, title, hint }: { playerID: string; title: string; hint: string }): ReactElement {
  return (
    <div className="turn-prompt-row">
      <TurnAvatar playerID={playerID} />
      <div className="min-w-0 flex-1">
        <p className="turn-title">{title}</p>
        <p className="turn-hint">{hint}</p>
      </div>
    </div>
  );
}

function PrimaryCTA({ children, onClick, disabled, loading, ariaLabel }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; ariaLabel?: string;
}): ReactElement {
  return (
    <Button
      size="lg"
      className="match-cta w-full"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}
export function ActionBar({ G, stage, isActive, currentName, viewerID, moves }: ActionBarProps): ReactElement {
  const { rollBusy, beginRoll } = useRollBusy(stage, isActive);
  const viewer     = G.players[viewerID];
  const viewerName = viewer?.nickname ?? currentName;

  const handleRoll = (): void => { if (beginRoll()) moves.rollDice?.(); };

  const pending   = G.pendingCell !== null ? getCell(G.pendingCell) : null;
  const canAfford = pending?.price !== undefined && viewer !== undefined && viewer.cash >= pending.price;
  const canJail   = viewer !== undefined && viewer.cash >= JAIL_FEE;
  const buildable = listBuildableLots(G, viewerID);
  const waitsLeft = JAIL_WAIT_TURNS - (viewer?.jailTurns ?? 0);

  const hint = !isActive
    ? t('waitHint', { name: currentName })
    : stage === 'buy' && pending
      ? t('buyHint', { name: pending.name, price: pending.price === undefined ? '' : formatCash(pending.price) })
      : stage === 'jail'
        ? t('jailHint', { turns: String(waitsLeft) })
        : stage === 'end' ? t('buildHint') : t('rollHint');

  const title = !isActive
    ? t('waitTurn', { name: currentName })
    : t('yourTurnNamed', { name: viewerName });

  return (
    <div className="turn-panel">
      <TurnPrompt playerID={viewerID} title={title} hint={hint} />

      {isActive ? (
        <>
          {rollBusy ? (
            <PrimaryCTA loading ariaLabel={t('rolling')}>{t('rolling')}</PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'roll' ? (
            <PrimaryCTA onClick={handleRoll} ariaLabel={t('roll')}>
              <Dices className="size-4" aria-hidden /> {t('roll')}
            </PrimaryCTA>
          ) : null}

          {!rollBusy && stage === 'buy' && pending ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canAfford} onClick={() => moves.buyProperty?.()}>{t('buy')}</PrimaryCTA>
              <Button size="lg" className="match-secondary h-8 w-full" onClick={() => moves.skipBuy?.()}>{t('skip')}</Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'jail' ? (
            <div className="grid grid-cols-2 gap-2">
              <PrimaryCTA disabled={!canJail} onClick={() => moves.payJail?.()}>{t('payJail')}</PrimaryCTA>
              <Button size="lg" className="match-secondary h-8 w-full" onClick={() => moves.waitJail?.()}>{t('waitJail')}</Button>
            </div>
          ) : null}

          {!rollBusy && stage === 'end' ? (
            <>
              {buildable.length > 0 ? (
                <BuyHouseActions lots={buildable} onBuy={(i) => moves.buyHouse?.(i)} />
              ) : null}
              <Button size="lg" className="match-secondary h-8 w-full" onClick={() => moves.endTurn?.()}>{t('endTurn')}</Button>
            </>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
