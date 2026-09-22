import type { ReactElement } from 'react';
import { tokenBgStyle } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';

type OwnerDotProps = {
  ownerID: string | null;
};

/**
 * Small circle in the colour of the owner player.
 * Rendered inside the HueStripe — always justified to the right/bottom of the accent bar.
 */
export function OwnerDot({ ownerID }: OwnerDotProps): ReactElement | null {
  if (ownerID === null) return null;

  return (
    <span
      className="size-2 shrink-0 rounded-full"
      style={{
        ...tokenBgStyle(ownerID),
        boxShadow: '0 0 0 1.5px var(--lr-ivory), 0 0 0 2.5px rgba(0,0,0,0.25)',
      }}
      title={t('owned')}
    />
  );
}
