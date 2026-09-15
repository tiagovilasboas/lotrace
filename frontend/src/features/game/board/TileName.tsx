import type { ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

type TileNameProps = {
  lines: readonly string[];
  align?: 'start' | 'center';
  strong?: boolean;
};

export function TileName({
  lines,
  align = 'start',
  strong = false,
}: TileNameProps): ReactElement {
  return (
    <span
      className={cn(
        'flex min-w-0 max-w-full flex-col px-0.5',
        align === 'center' && 'items-center text-center',
        strong && 'font-bold uppercase tracking-wide',
      )}
    >
      {lines.map((line) => (
        <span
          key={line}
          className="max-w-full truncate text-[0.58rem] font-semibold leading-[1.05] sm:text-[0.7rem]"
        >
          {line}
        </span>
      ))}
    </span>
  );
}
