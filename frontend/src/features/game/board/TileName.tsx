import type { ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

type TileNameProps = {
  children: string;
  align?: 'start' | 'center';
  strong?: boolean;
};

export function TileName({
  children,
  align = 'start',
  strong = false,
}: TileNameProps): ReactElement {
  return (
    <span
      className={cn(
        'min-w-0 max-w-full px-px hyphens-none [overflow-wrap:normal] [word-break:normal]',
        'text-[0.55rem] font-semibold leading-[1.08] sm:text-[0.68rem]',
        'line-clamp-2',
        align === 'center' && 'text-center',
        strong && 'font-bold tracking-normal',
      )}
    >
      {children}
    </span>
  );
}
