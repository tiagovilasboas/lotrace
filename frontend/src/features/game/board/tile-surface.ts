import { cn } from '@/lib/utils.ts';

export function tileSurfaceClass(isPending: boolean): string {
  return cn(
    'board-tile relative flex h-full min-h-0 min-w-0 overflow-hidden rounded-[5px] border bg-board-track text-board-ink',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(7,20,40,0.35)]',
    isPending ? 'z-10 border-sky-400 ring-2 ring-sky-400/70' : 'border-black/20',
  );
}
