import type { InputHTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

/**
 * LotRace Input
 *
 * Dark surface aligned with City Night: surface-hud background,
 * border-hud border, text-on-table text, turn-highlight focus ring.
 */
export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>): ReactElement {
  return (
    <input
      className={cn(
        // layout
        'flex h-12 w-full min-w-0 rounded-xl px-3 text-base outline-none',
        // colours via tokens — no hardcoded hex
        'bg-[color:var(--surface-hud-raised)] text-[color:var(--text-on-table)]',
        'border border-[color:var(--border-hud)]',
        'placeholder:text-[color:var(--text-on-table-dim)]',
        // focus
        'focus-visible:ring-[3px] focus-visible:ring-[color:var(--turn-highlight)]/40',
        'focus-visible:border-[color:var(--turn-highlight)]',
        // disabled
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      {...props}
    />
  );
}
