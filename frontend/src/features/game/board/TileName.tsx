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
        strong && 'uppercase tracking-wide',
      )}
    >
      {lines.map((line) => (
        <span key={line} className="tile-name-line">
          {line}
        </span>
      ))}
    </span>
  );
}
