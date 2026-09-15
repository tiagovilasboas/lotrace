import { getCell, JAIL_FEE, JAIL_WAIT_TURNS, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { BuyHouseActions } from '@/features/game/components/BuyHouseActions.tsx';
import { useRollBusy } from '@/features/game/hooks/use-roll-busy.ts';
import { listBuildableLots } from '@/features/game/lib/buildable-lots.ts';
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
  const buildableLots = listBuildableLots(G, viewerID);
  const waitsLeft = JAIL_WAIT_TURNS - (player?.jailTurns ?? 0);

  return (
    <div className="flex flex-col gap-2">
      <p role="status" className="text-center text-xs font-semibold text-primary">
        {t('yourTurn')}
      </p>
      {rollBusy ? (
        <Button size="lg" loading aria-label={t('rolling')}>
          {t('rolling')}
        </Button>
      ) : null}
      {!rollBusy && stage === 'roll' ? (
        <Button size="lg" onClick={handleRoll} aria-label={t('roll')}>
          {t('roll')}
        </Button>
      ) : null}
      {!rollBusy && stage === 'buy' && pending ? (
        <>
          <p className="text-center text-sm font-medium">
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
          <p className="text-center text-sm text-muted-foreground">
            {t('jailHint', { turns: String(waitsLeft) })}
          </p>
          <Button size="lg" disabled={!canPayJail} onClick={() => moves.payJail?.()}>
            {t('payJail')}
          </Button>
          <Button size="lg" variant="outline" onClick={() => moves.waitJail?.()}>
            {t('waitJail')}
          </Button>
        </>
      ) : null}
      {!rollBusy && stage === 'end' && buildableLots.length > 0 ? (
        <>
          <BuyHouseActions
            lots={buildableLots}
            onBuy={(cellIndex) => moves.buyHouse?.(cellIndex)}
          />
          <Button size="lg" variant="outline" onClick={() => moves.endTurn?.()}>
            {t('endTurn')}
          </Button>
        </>
      ) : null}
    </div>
  );
}
