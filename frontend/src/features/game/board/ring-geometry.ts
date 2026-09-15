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
      return { containerClass: 'flex-col', barClass: 'h-3.5 w-full shrink-0' };
    case 'north':
      return { containerClass: 'flex-col-reverse', barClass: 'h-3.5 w-full shrink-0' };
    case 'west':
      return { containerClass: 'flex-row-reverse', barClass: 'h-full w-3.5 shrink-0' };
    case 'east':
      return { containerClass: 'flex-row', barClass: 'h-full w-3.5 shrink-0' };
  }
}

export function tokenDockClass(side: RingSide): string {
  switch (side) {
    case 'south':
      return 'inset-x-0 bottom-0 justify-center pb-px';
    case 'north':
      return 'inset-x-0 top-0 justify-center pt-px';
    case 'west':
      return 'inset-y-0 right-0 flex-col justify-center pr-px';
    case 'east':
      return 'inset-y-0 left-0 flex-col justify-center pl-px';
  }
}

export function tileBodyPadClass(side: RingSide): string {
  switch (side) {
    case 'south':
      return 'pb-8';
    case 'north':
      return 'pt-8';
    case 'west':
      return 'pr-8';
    case 'east':
      return 'pl-8';
  }
}

export function tokenRotateClass(side: RingSide): string {
  switch (side) {
    case 'south':
      return '-rotate-90';
    case 'west':
      return 'rotate-0';
    case 'north':
      return 'rotate-90';
    case 'east':
      return 'rotate-180';
  }
}
