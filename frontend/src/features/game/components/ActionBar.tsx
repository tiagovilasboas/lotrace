import { getCell, JAIL_FEE, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useRollBusy } from '@/features/game/hooks/use-roll-busy.ts';
import { t } from '@/lib/i18n.ts';

type GameMoves = {
  rollDice?: () => void;
  buyProperty?: () => void;
  skipBuy?: () => void;
  endTurn?: () => void;
  payJail?: () => void;
  waitJail?: () => void;
};

type ActionBarProps = {
  G: ImobiliarioState;
  stage: TurnStage | undefined;
  isActive: boolean;
  currentName: string;
  viewerID: string;
  moves: GameMoves;
};

export function ActionBar({
  G,
  stage,
  isActive,
  currentName,
  viewerID,
  moves,
}: ActionBarProps): ReactElement {
  const { rollBusy, beginRoll } = useRollBusy(stage, isActive);

  const handleRoll = (): void => {
    if (!beginRoll()) {
      return;
    }
    moves.rollDice?.();
  };

  if (!isActive) {
    return (
      <div role="status" className="flex justify-center py-1">
        <p className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground">
          {t('waitTurn', { name: currentName })}
        </p>
      </div>
    );
  }

  const player = G.players[viewerID];
  const pending = G.pendingCell !== null ? getCell(G.pendingCell) : null;
  const canAfford =
    pending?.price !== undefined && player !== undefined && player.cash >= pending.price;
  const canPayJail = player !== undefined && player.cash >= JAIL_FEE;

  return (
    <div className="flex flex-col gap-2">
      <div role="status" className="flex justify-center">
        <p className="your-turn-pulse rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
          {t('yourTurn')}
        </p>
      </div>
      {stage === 'roll' || rollBusy ? (
        <Button
          size="lg"
          loading={rollBusy}
          onClick={handleRoll}
          aria-label={rollBusy ? t('rolling') : t('roll')}
        >
          {rollBusy ? t('rolling') : t('roll')}
        </Button>
      ) : null}
      {!rollBusy && stage === 'buy' && pending ? (
        <>
          <p className="text-center text-sm text-muted-foreground">
            {pending.name} · R${pending.price}
          </p>
          <Button size="lg" disabled={!canAfford} onClick={() => moves.buyProperty?.()}>
            {t('buy')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => moves.skipBuy?.()}>
            {t('skip')}
          </Button>
        </>
      ) : null}
      {!rollBusy && stage === 'jail' ? (
        <>
          <Button size="lg" disabled={!canPayJail} onClick={() => moves.payJail?.()}>
            {t('payJail')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => moves.waitJail?.()}>
            {t('waitJail')}
          </Button>
        </>
      ) : null}
      {!rollBusy && stage === 'end' ? (
        <Button size="lg" onClick={() => moves.endTurn?.()}>
          {t('endTurn')}
        </Button>
      ) : null}
    </div>
  );
}
