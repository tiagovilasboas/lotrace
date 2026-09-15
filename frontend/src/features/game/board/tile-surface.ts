import { cn } from '@/lib/utils.ts';

export function tileSurfaceClass(isPending: boolean): string {
  return cn(
    'relative flex h-full min-h-0 min-w-0 overflow-hidden rounded-[2px] border bg-board-track text-board-ink',
    'text-[8px] leading-tight sm:text-[9px]',
    isPending ? 'z-10 border-primary ring-2 ring-primary/50' : 'border-black/25',
  );
}
