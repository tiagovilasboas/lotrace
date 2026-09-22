import { getCell, JAIL_FEE, JAIL_WAIT_TURNS, type ImobiliarioState, type TurnStage } from '@lotrace/shared';
import { Dices } from 'lucide-react';
import type { ReactElement } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { BuyHouseActions } from '@/features/game/components/BuyHouseActions.tsx';
import { FooterBar } from '@/features/game/board/FooterBar.tsx';
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
    <>
      {/* ── Roll / waiting: single 32px FooterBar ── */}
      {(!isActive || stage === 'roll' || rollBusy) ? (
        <FooterBar playerID={viewerID} title={title}>
          {rollBusy ? (
            <Button className="footer-btn footer-btn--primary" loading aria-label={t('rolling')}>
              {t('rolling')}
            </Button>
          ) : stage === 'roll' ? (
            <Button className="footer-btn footer-btn--primary" onClick={handleRoll} aria-label={t('roll')}>
              <Dices className="size-3 shrink-0" aria-hidden /> {t('roll')}
            </Button>
          ) : (
            /* Waiting for other player — no button, hint on right */
            <span className="footerbar-hint">{hint}</span>
          )}
        </FooterBar>
      ) : stage === 'buy' && pending ? (
        /* ── Buy: two buttons in the footer ── */
        <FooterBar playerID={viewerID} title={hint}>
          <Button className="footer-btn footer-btn--primary" disabled={!canAfford} onClick={() => moves.buyProperty?.()}>
            {t('buy')}
          </Button>
          <Button className="footer-btn footer-btn--secondary" onClick={() => moves.skipBuy?.()}>
            {t('skip')}
          </Button>
        </FooterBar>
      ) : stage === 'jail' ? (
        <FooterBar playerID={viewerID} title={hint}>
          <Button className="footer-btn footer-btn--primary" disabled={!canJail} onClick={() => moves.payJail?.()}>
            {t('payJail')}
          </Button>
          <Button className="footer-btn footer-btn--secondary" onClick={() => moves.waitJail?.()}>
            {t('waitJail')}
          </Button>
        </FooterBar>
      ) : stage === 'end' ? (
        /* ── Build stage: houses row (if any) + end-turn in footer ── */
        <div className="flex flex-col gap-1.5">
          {buildable.length > 0 ? (
            <BuyHouseActions lots={buildable} onBuy={(i) => moves.buyHouse?.(i)} />
          ) : null}
          <FooterBar playerID={viewerID} title={title}>
            <Button className="footer-btn footer-btn--secondary" onClick={() => moves.endTurn?.()}>
              {t('endTurn')}
            </Button>
          </FooterBar>
        </div>
      ) : null}
    </>
  );
}
