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
export function fitIso(
  cols: number,
  rows: number,
  boxW: number,
  boxH: number,
): IsoConfig {
  // Diamond bounding box: width = (cols + rows) * tileW/2, height = (cols + rows) * tileH/2.
  const span = cols + rows;
  // Keep the 2:1 iso ratio (tileH = tileW / 2). Fit both axes.
  const tileWByWidth = (boxW * 2) / span;
  const tileWByHeight = (boxH * 4) / span; // since tileH = tileW/2, height uses /4
  const tileW = Math.min(tileWByWidth, tileWByHeight);
  const tileH = tileW / 2;
  // Origin: horizontally centre the diamond; top vertex near the top of the box.
  const originX = boxW / 2;
  const originY = (boxH - span * (tileH / 2)) / 2 + tileH / 2;
  return { tileW, tileH, originX, originY };
}
