import type { ReactElement } from 'react';
import { OwnerDot } from '@/features/game/board/OwnerDot.tsx';
import { hueBarLayout, type RingSide } from '@/features/game/board/ring-geometry.ts';
import { cn } from '@/lib/utils.ts';

type HueStripeProps = {
  hue: string;    // CSS colour value — from colorGroupHue() or BOARD_COLOR.*
  side: RingSide;
  ownerID?: string | null;
};

/**
 * Colour accent stripe on a property tile.
 * Spec: accentHeight = 8px on mobile (--tile-accent-height token).
 * Position follows the tile side: south/north = horizontal bar, east/west = vertical bar.
 */
export function HueStripe({ hue, side, ownerID = null }: HueStripeProps): ReactElement {
  const bar = hueBarLayout(side);

  return (
    <span
      className={cn('flex shrink-0 items-center justify-end px-px', bar.barClass)}
      style={{ backgroundColor: hue }}
    >
      <OwnerDot ownerID={ownerID} />
    </span>
  );
}
