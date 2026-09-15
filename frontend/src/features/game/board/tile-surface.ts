import { cn } from '@/lib/utils.ts';

export function tileSurfaceClass(isPending: boolean): string {
  return cn(
    'relative flex h-full min-h-0 min-w-0 overflow-hidden rounded-[3px] border bg-board-track text-board-ink',
    'text-[9px] leading-tight sm:text-[10px]',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(28,25,23,0.28)]',
    isPending ? 'z-10 border-primary ring-2 ring-primary/50' : 'border-board-ink/45',
  );
}
