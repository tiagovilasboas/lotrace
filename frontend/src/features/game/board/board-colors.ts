import type { ColorGroup } from '@lotrace/shared';

/**
 * Maps colour groups to their CSS token.
 * Source of truth: design-system/tokens/game.css (--group-*).
 * All values come from new-design/tabuleiro/lotrace-mobile-redesign.json spec.
 */
export const COLOR_GROUP_HUE: Record<ColorGroup, string> = {
  brown:  'var(--group-brown)',   // #98653B
  sky:    'var(--group-sky)',     // #71C4F2 (skyBlue)
  pink:   'var(--group-pink)',    // #EA55AE
  orange: 'var(--group-orange)',  // #FF9D38
  red:    'var(--group-red)',     // #FF5964
  yellow: 'var(--group-yellow)', // #F4DA38
  green:  'var(--group-green)',   // #46CF91
  navy:   'var(--group-navy)',    // #428BF3 (blue)
};

export const BOARD_COLOR = {
  track:   'var(--board-track)',    // --lr-ivory  #F4E8C9
  felt:    'var(--board-felt)',     // --lr-felt   #08493D
  ink:     'var(--board-ink)',      // --lr-ink-tile
  station: 'var(--cell-station)',   // #111111
  tax:     'var(--cell-tax)',       // #9B0000
  go:      'var(--cell-go)',        // --lr-corner-go   #46CF91
  jail:    'var(--cell-jail)',      // --lr-corner-jail #8C99A5
} as const;

export function colorGroupHue(group: ColorGroup): string {
  return COLOR_GROUP_HUE[group];
}
