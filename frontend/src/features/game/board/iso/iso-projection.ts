/**
 * iso-projection.ts — pure isometric projection for the canvas board.
 * No React, no canvas: just maths, so it is unit-testable.
 *
 * The board is a grid of cells (col, row). We project each cell to screen
 * space using a classic 2:1 isometric diamond:
 *
 *   screenX = originX + (col - row) * (tileW / 2)
 *   screenY = originY + (col + row) * (tileH / 2)
 *
 * Height (buildings/pieces) is applied by subtracting from screenY — taller
 * objects move up the screen, which reads as "standing up" from the ground.
 * Painter's order (back → front) is the ascending sum (col + row): cells with
 * a smaller sum are further back and are drawn first, so nearer objects overlap
 * them (the SimCity BuildIt effect).
 */

export type IsoConfig = {
  /** Full isometric tile width in pixels (diamond width). */
  tileW: number;
  /** Full isometric tile height in pixels (diamond height, ~tileW / 2). */
  tileH: number;
  /** Screen origin (pixels) where cell (0,0) top vertex lands. */
  originX: number;
  originY: number;
};

export type ScreenPoint = { x: number; y: number };

/** Centre of a cell on the ground plane (height 0). */
export function tileToScreen(col: number, row: number, cfg: IsoConfig): ScreenPoint {
  return {
    x: cfg.originX + (col - row) * (cfg.tileW / 2),
    y: cfg.originY + (col + row) * (cfg.tileH / 2),
  };
}

/** A ground point raised by `height` pixels (moves up the screen). */
export function withHeight(point: ScreenPoint, height: number): ScreenPoint {
  return { x: point.x, y: point.y - height };
}

/** The four corners of a cell's diamond on the ground plane (top, right, bottom, left). */
export function tileDiamond(col: number, row: number, cfg: IsoConfig): ScreenPoint[] {
  const c = tileToScreen(col, row, cfg);
  const hw = cfg.tileW / 2;
  const hh = cfg.tileH / 2;
  return [
    { x: c.x, y: c.y - hh }, // top
    { x: c.x + hw, y: c.y }, // right
    { x: c.x, y: c.y + hh }, // bottom
    { x: c.x - hw, y: c.y }, // left
  ];
}

/** Painter's-order key: smaller = further back (drawn first). */
export function depthKey(col: number, row: number): number {
  return col + row;
}

/**
 * Fit config: given the grid size (cols×rows) and the available canvas box,
 * choose a tile size and origin so the whole diamond fits centred.
 * For an N×N grid the iso bounding box is N*tileW wide and N*tileH tall.
 */
export type FitOptions = {
  /** Fraction of the box the diamond should fill (0..1). Default 0.98. */
  fill?: number;
  /** Iso squash: tileH / tileW. 0.5 = classic 2:1. Higher = taller diamond. */
  ratio?: number;
  /** Extra headroom (fraction of box height) kept at the top for tall buildings. */
  headroom?: number;
};

export function fitIso(
  cols: number,
  rows: number,
  boxW: number,
  boxH: number,
  opts: FitOptions = {},
): IsoConfig {
  const fill = opts.fill ?? 0.98;
  const ratio = opts.ratio ?? 0.5;
  const headroom = opts.headroom ?? 0;
  const span = cols + rows;

  // Diamond box: width = span * tileW/2, height = span * (tileW*ratio)/2.
  const usableH = boxH * (1 - headroom);
  const tileWByWidth = (boxW * fill * 2) / span;
  const tileWByHeight = (usableH * fill * 2) / (span * ratio);
  const tileW = Math.min(tileWByWidth, tileWByHeight);
  const tileH = tileW * ratio;

  const diamondH = span * (tileH / 2);
  const originX = boxW / 2;
  // Centre vertically within the usable (headroom-reduced) area, pushed down
  // by the headroom so tall buildings have room to rise into the top space.
  const originY = boxH * headroom + (usableH - diamondH) / 2 + tileH / 2;
  return { tileW, tileH, originX, originY };
}
