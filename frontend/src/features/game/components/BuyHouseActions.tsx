import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { HotelIso, HouseIso } from '@/features/game/board/IsoIcons.tsx';
import type { BuildableLot } from '@/features/game/lib/buildable-lots.ts';
import { formatCashShort } from '@/features/game/lib/format-cash.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type BuyHouseActionsProps = {
  lots: BuildableLot[];
  onBuy: (cellIndex: number) => void;
  /** End-turn button rendered beside the build button, same footer row. */
  endButton: ReactNode;
};

/**
 * Build stage controls. Layout:
 *   [ lot pills ]        (only when there's more than one buildable lot)
 *   [ Build ] [ End ]    (same-height footer buttons, side by side)
 * Keeps the footer compact — no stacked full-width rows.
 */
export function BuyHouseActions({
  lots,
  onBuy,
  endButton,
}: BuyHouseActionsProps): ReactElement | null {
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  if (lots.length === 0) {
    return null;
  }

  const selected = lots.find((lot) => lot.index === pickedIndex) ?? lots[0];
  const cost = formatCashShort(selected.cost);
  const label = t(selected.hotel ? 'buyHotelOn' : 'buyHouseOn', { cost });
  const aria = t(selected.hotel ? 'buyHotelOnAria' : 'buyHouseOnAria', {
    name: selected.name,
    cost,
  });

  return (
    <div className="build-panel">
      {lots.length > 1 ? (
        <div
          className="flex flex-wrap justify-center gap-1.5"
          role="group"
          aria-label={t('buyHousePick')}
        >
          {lots.map((lot) => {
            const isSelected = lot.index === selected.index;
            return (
              <button
                key={lot.index}
                type="button"
                onClick={() => setPickedIndex(lot.index)}
                className={cn(
                  'footer-btn',
                  isSelected ? 'footer-btn--primary' : 'footer-btn--secondary',
                )}
                aria-pressed={isSelected}
              >
                {lot.name}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="footerbar-actions-inline">
        <Button
          variant="bare"
          size="none"
          className="footer-btn footer-btn--primary"
          onClick={() => onBuy(selected.index)}
          aria-label={aria}
        >
          {selected.hotel ? (
            <HotelIso className="size-4 shrink-0" />
          ) : (
            <HouseIso className="size-4 shrink-0" />
          )}
          {label}
        </Button>
        {endButton}
      </div>
    </div>
  );
}
