import type { ColorGroup } from '@lotrace/shared';

export const COLOR_GROUP_HUE: Record<ColorGroup, string> = {
  brown: 'var(--group-brown)',
  sky: 'var(--group-sky)',
  pink: 'var(--group-pink)',
  orange: 'var(--group-orange)',
  red: 'var(--group-red)',
  yellow: 'var(--group-yellow)',
  green: 'var(--group-green)',
  navy: 'var(--group-navy)',
};

export const BOARD_COLOR = {
  track: 'var(--board-track)',
  felt: 'var(--board-felt)',
  ink: 'var(--board-ink)',
  station: 'var(--station)',
  tax: 'var(--tax)',
  go: 'var(--go)',
  jail: 'var(--jail)',
} as const;

export function colorGroupHue(group: ColorGroup): string {
  return COLOR_GROUP_HUE[group];
}
