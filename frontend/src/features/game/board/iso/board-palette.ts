import type { ColorGroup } from '@lotrace/shared';

/**
 * Resolves the board's design-token CSS variables to concrete colour strings
 * that the canvas 2D context can use (canvas cannot read `var(--x)`).
 * Single source of truth stays the CSS tokens — we just read them at runtime.
 */
export type BoardPalette = {
  felt: string;
  track: string;
  ink: string;
  station: string;
  tax: string;
  go: string;
  jail: string;
  group: Record<ColorGroup, string>;
};

const GROUP_VARS: Record<ColorGroup, string> = {
  brown: '--group-brown',
  sky: '--group-sky',
  pink: '--group-pink',
  orange: '--group-orange',
  red: '--group-red',
  yellow: '--group-yellow',
  green: '--group-green',
  navy: '--group-navy',
};

function readVar(style: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = style.getPropertyValue(name).trim();
  return value.length > 0 ? value : fallback;
}

/** Concrete colour for a property group from a resolved palette. */
export function colorGroupCanvas(group: ColorGroup, palette: BoardPalette): string {
  return palette.group[group];
}

/** Read the palette from the document root. Call inside the browser (effect). */
export function readBoardPalette(root: HTMLElement = document.documentElement): BoardPalette {
  const s = getComputedStyle(root);
  const group = {} as Record<ColorGroup, string>;
  (Object.keys(GROUP_VARS) as ColorGroup[]).forEach((g) => {
    group[g] = readVar(s, GROUP_VARS[g], '#888');
  });
  return {
    felt: readVar(s, '--board-felt', '#08493D'),
    track: readVar(s, '--board-track', '#F4E8C9'),
    ink: readVar(s, '--board-ink', '#20140a'),
    station: readVar(s, '--cell-station', '#111111'),
    tax: readVar(s, '--cell-tax', '#9B0000'),
    go: readVar(s, '--cell-go', '#46CF91'),
    jail: readVar(s, '--cell-jail', '#8C99A5'),
    group,
  };
}
