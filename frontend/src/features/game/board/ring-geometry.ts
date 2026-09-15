export const RING_SPAN = 7;

export type RingSide = 'south' | 'west' | 'north' | 'east';

export type RingCellPosition = {
  column: number;
  row: number;
};

export type HueBarLayout = {
  containerClass: string;
  barClass: string;
};

export function ringCellPosition(index: number): RingCellPosition {
  if (index <= 6) {
    return { column: RING_SPAN - index, row: RING_SPAN };
  }
  if (index <= 12) {
    return { column: 1, row: RING_SPAN - (index - 6) };
  }
  if (index <= 18) {
    return { column: 1 + (index - 12), row: 1 };
  }
  return { column: RING_SPAN, row: 2 + (index - 19) };
}

export function ringCellSide(index: number): RingSide {
  if (index <= 6) {
    return 'south';
  }
  if (index <= 12) {
    return 'west';
  }
  if (index <= 18) {
    return 'north';
  }
  return 'east';
}

export function hueBarLayout(side: RingSide): HueBarLayout {
  switch (side) {
    case 'south':
      return { containerClass: 'flex-col', barClass: 'h-2 w-full shrink-0' };
    case 'north':
      return { containerClass: 'flex-col-reverse', barClass: 'h-2 w-full shrink-0' };
    case 'west':
      return { containerClass: 'flex-row-reverse', barClass: 'h-full w-2 shrink-0' };
    case 'east':
      return { containerClass: 'flex-row', barClass: 'h-full w-2 shrink-0' };
  }
}
