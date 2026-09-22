import type { ReactElement } from 'react';
import { OwnerDot } from '@/features/game/board/OwnerDot.tsx';
import { type RingSide } from '@/features/game/board/ring-geometry.ts';
import { cn } from '@/lib/utils.ts';

type HueStripeProps = {
  hue: string;
  side: RingSide;
  ownerID?: string | null;
};

function isVertical(side: RingSide): boolean {
  return side === 'west' || side === 'east';
}

export function HueStripe({ hue, side, ownerID = null }: HueStripeProps): ReactElement {
  return (
    <span
      className={cn('tile-accent', isVertical(side) ? 'tile-accent--v' : 'tile-accent--h')}
      style={{ backgroundColor: hue }}
    >
      <OwnerDot ownerID={ownerID} />
    </span>
  );
}
