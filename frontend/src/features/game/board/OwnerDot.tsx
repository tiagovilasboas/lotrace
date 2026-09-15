import type { ReactElement } from 'react';
import { tokenClass } from '@/features/game/player-tokens.ts';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type OwnerDotProps = {
  ownerID: string | null;
};

export function OwnerDot({ ownerID }: OwnerDotProps): ReactElement | null {
  if (ownerID === null) {
    return null;
  }

  return (
    <span
      className={cn('size-2 shrink-0 rounded-full ring-1 ring-white', tokenClass(ownerID))}
      style={{ boxShadow: '0 0 0 1px var(--board-ink)' }}
      title={t('owned')}
    />
  );
}
