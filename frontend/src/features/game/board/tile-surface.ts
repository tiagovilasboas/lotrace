import { cn } from '@/lib/utils.ts';

export function tileSurfaceClass(isPending: boolean): string {
  return cn('board-tile', isPending && 'board-tile--pending');
}
