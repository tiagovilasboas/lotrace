import type { HTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement {
  return <div className={cn('surface-card p-4', className)} {...props} />;
}
