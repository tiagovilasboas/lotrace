import type { InputHTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>): ReactElement {
  return (
    <input
      className={cn(
        'flex h-12 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none ring-ring/40 placeholder:text-muted-foreground focus-visible:ring-[3px]',
        className,
      )}
      {...props}
    />
  );
}
