import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { HotelIso, HouseIso } from '@/features/game/board/IsoIcons.tsx';
import type { BuildableLot } from '@/features/game/lib/buildable-lots.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type BuyHouseActionsProps = {
  lots: BuildableLot[];
  onBuy: (cellIndex: number) => void;
};

export function BuyHouseActions({
  lots,
  onBuy,
}: BuyHouseActionsProps): ReactElement | null {
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  if (lots.length === 0) {
    return null;
  }

  const selected = lots.find((lot) => lot.index === pickedIndex) ?? lots[0];

  return (
    <>
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
      <Button
        variant="bare"
        size="none"
        className="footer-btn footer-btn--primary"
        onClick={() => onBuy(selected.index)}
        aria-label={t(selected.hotel ? 'buyHotelOn' : 'buyHouseOn', {
          name: selected.name,
          cost: String(selected.cost),
        })}
      >
        {selected.hotel ? (
          <HotelIso className="size-4 shrink-0" />
        ) : (
          <HouseIso className="size-4 shrink-0" />
        )}
        {t(selected.hotel ? 'buyHotelOn' : 'buyHouseOn', {
          name: selected.name,
          cost: String(selected.cost),
        })}
      </Button>
    </>
  );
}
