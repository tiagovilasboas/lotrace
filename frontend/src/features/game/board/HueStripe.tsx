import type { ReactElement } from 'react';
import { OwnerDot } from '@/features/game/board/OwnerDot.tsx';
import { hueBarLayout, type RingSide } from '@/features/game/board/ring-geometry.ts';
import { cn } from '@/lib/utils.ts';

type HueStripeProps = {
  hue: string;
  side: RingSide;
  ownerID?: string | null;
};

export function HueStripe({
  hue,
  side,
  ownerID = null,
}: HueStripeProps): ReactElement {
  const bar = hueBarLayout(side);

  return (
    <span
      className={cn('flex items-center justify-end px-px', bar.barClass)}
      style={{ backgroundColor: hue }}
    >
      <OwnerDot ownerID={ownerID} />
    </span>
  );
}
