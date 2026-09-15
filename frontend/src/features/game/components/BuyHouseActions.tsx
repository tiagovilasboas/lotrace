import type { ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
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
                  'min-h-9 rounded-full px-3 text-xs font-semibold',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
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
        size="lg"
        onClick={() => onBuy(selected.index)}
        aria-label={t('buyHouseOn', {
          name: selected.name,
          cost: String(selected.cost),
        })}
      >
        {t('buyHouseOn', { name: selected.name, cost: String(selected.cost) })}
      </Button>
    </>
  );
}
