import { cn } from '@/lib/utils.ts';

export function tileSurfaceClass(isPending: boolean): string {
  return cn(
    'board-tile relative flex h-full min-h-0 min-w-0 overflow-hidden surface-tile-base border',
    isPending ? 'surface-tile-pending' : '',
  );
}
