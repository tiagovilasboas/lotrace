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

function PromptCard({
  viewerID,
  title,
  hint,
  children,
}: {
  viewerID: string;
  title: string;
  hint: string;
  children?: ReactNode;
}): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3 rounded-2xl bg-[color-mix(in_srgb,var(--match-card)_92%,transparent)] px-3 py-2.5 ring-1 ring-white/10">
        <CarToken playerID={viewerID} size="hud" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold leading-tight text-white">{title}</p>
          <p className="text-xs leading-snug text-white/65">{hint}</p>
        </div>
      </div>
      {children}
    </div>
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
    if (!beginRoll()) {
      return;
    }
    moves.rollDice?.();
  };

  if (!isActive) {
    return (
      <PromptCard
        viewerID={viewerID}
        title={t('waitTurn', { name: currentName })}
        hint={t('waitHint', { name: currentName })}
      />
    );
  }

  const pending = G.pendingCell !== null ? getCell(G.pendingCell) : null;
  const canAfford =
    pending?.price !== undefined && viewer !== undefined && viewer.cash >= pending.price;
  const canPayJail = viewer !== undefined && viewer.cash >= JAIL_FEE;
  const buildableLots = listBuildableLots(G, viewerID);
  const waitsLeft = JAIL_WAIT_TURNS - (viewer?.jailTurns ?? 0);

  return (
    <PromptCard
      viewerID={viewerID}
      title={t('yourTurnNamed', { name: viewerName })}
      hint={
        stage === 'buy' && pending
          ? t('buyHint', {
              name: pending.name,
              price: pending.price === undefined ? '' : formatCash(pending.price),
            })
          : stage === 'jail'
            ? t('jailHint', { turns: String(waitsLeft) })
            : stage === 'end'
              ? t('buildHint')
              : t('rollHint')
      }
    >
      {rollBusy ? (
        <Button
          size="lg"
          className="rounded-full bg-[#2f6bff] text-white shadow-[0_8px_18px_rgba(47,107,255,0.4)] hover:bg-[#2563eb]"
          loading
          aria-label={t('rolling')}
        >
          {t('rolling')}
        </Button>
      ) : null}
      {!rollBusy && stage === 'roll' ? (
        <Button
          size="lg"
          className="rounded-full bg-[#2f6bff] text-white shadow-[0_8px_18px_rgba(47,107,255,0.4)] hover:bg-[#2563eb]"
          onClick={handleRoll}
          aria-label={t('roll')}
        >
          <Dices className="size-5" aria-hidden />
          {t('roll')}
        </Button>
      ) : null}
      {!rollBusy && stage === 'buy' && pending ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            className="rounded-full bg-[#2f6bff] text-white hover:bg-[#2563eb]"
            disabled={!canAfford}
            onClick={() => moves.buyProperty?.()}
          >
            {t('buy')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
            onClick={() => moves.skipBuy?.()}
          >
            {t('skip')}
          </Button>
        </div>
      ) : null}
      {!rollBusy && stage === 'jail' ? (
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            className="rounded-full bg-[#2f6bff] text-white hover:bg-[#2563eb]"
            disabled={!canPayJail}
            onClick={() => moves.payJail?.()}
          >
            {t('payJail')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
            onClick={() => moves.waitJail?.()}
          >
            {t('waitJail')}
          </Button>
        </div>
      ) : null}
      {!rollBusy && stage === 'end' && buildableLots.length > 0 ? (
        <>
          <BuyHouseActions
            lots={buildableLots}
            onBuy={(cellIndex) => moves.buyHouse?.(cellIndex)}
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
            onClick={() => moves.endTurn?.()}
          >
            {t('endTurn')}
          </Button>
        </>
      ) : null}
    </PromptCard>
  );
}
