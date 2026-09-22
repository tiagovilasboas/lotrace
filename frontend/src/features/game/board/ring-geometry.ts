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
      return { containerClass: 'flex-col',         barClass: 'h-[var(--tile-accent-height)] w-full shrink-0' };
    case 'north':
      return { containerClass: 'flex-col-reverse', barClass: 'h-[var(--tile-accent-height)] w-full shrink-0' };
    case 'west':
      return { containerClass: 'flex-row-reverse', barClass: 'h-full w-[var(--tile-accent-height)] shrink-0' };
    case 'east':
      return { containerClass: 'flex-row',         barClass: 'h-full w-[var(--tile-accent-height)] shrink-0' };
  }
}

export function tokenDockClass(side: RingSide): string {
  switch (side) {
    case 'south':
      return 'inset-x-0 top-0 h-[max(1.8rem,44cqmin)] justify-center';
    case 'north':
      return 'inset-x-0 bottom-0 h-[max(1.8rem,44cqmin)] justify-center';
    case 'west':
      return 'inset-y-0 right-0 w-[max(1.8rem,44cqmin)] flex-col justify-center';
    case 'east':
      return 'inset-y-0 left-0 w-[max(1.8rem,44cqmin)] flex-col justify-center';
  }
}

export function tileBodyClass(side: RingSide): string {
  switch (side) {
    case 'south':
      return 'items-center justify-end';
    case 'north':
      return 'items-center justify-start';
    case 'west':
      return 'items-start justify-center';
    case 'east':
      return 'items-end justify-center';
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
