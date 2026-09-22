/**
 * tile-positions.ts — Pure function, no React, no Three.
 * Calculates the [x, z] world position of each board tile index
 * so pieces can be placed on top of the CSS board.
 *
 * The board is a 7×7 grid. Corner tiles occupy 1.28 units,
 * inner tiles occupy 1 unit each.
 * Total board size in world units: 2 corners (1.28) + 5 inner (1) = 7.56
 */

const CORNER = 1.28;
const INNER  = 1.0;
/** Board total size in world units — exported for camera zoom calculation */
export const TOTAL = 2 * CORNER + 5 * INNER; // 7.56

/** Centre offset so board is centred at world origin */
const HALF = TOTAL / 2;

/** Cumulative x positions of each column start (0-indexed, left to right) */
function colX(col: number): number {
  // col is 1-indexed in the CSS grid (1..7)
  const c = col - 1; // 0-indexed
  if (c === 0) return 0;
  if (c === 1) return CORNER;
  if (c <= 5)  return CORNER + (c - 1) * INNER;
  return CORNER + 5 * INNER; // col 7 = right corner
}

/** Centre of a column in world X */
function colCentre(col: number): number {
  const start = colX(col);
  const width = col === 1 || col === 7 ? CORNER : INNER;
  return start + width / 2 - HALF;
}

/** Centre of a row in world Z (row 1 = top = positive Z) */
function rowCentre(row: number): number {
  // Mirror colCentre for Z axis (row 1 is the top)
  const c = row - 1;
  let start: number;
  if (c === 0) start = 0;
  else if (c === 1) start = CORNER;
  else if (c <= 5) start = CORNER + (c - 1) * INNER;
  else start = CORNER + 5 * INNER;
  const height = row === 1 || row === 7 ? CORNER : INNER;
  // Flip: row 1 at top → positive Z
  return HALF - (start + height / 2);
}

/**
 * Returns the [x, 0, z] world position for a tile index (0–23).
 * Y is always 0 — pieces add their own height.
 */
export function tileWorldPosition(index: number): [number, number, number] {
  // Replicate ring-geometry.ts ringCellPosition logic
  let col: number;
  let row: number;

  if (index <= 6) {
    col = 7 - index;
    row = 7;
  } else if (index <= 12) {
    col = 1;
    row = 7 - (index - 6);
  } else if (index <= 18) {
    col = 1 + (index - 12);
    row = 1;
  } else {
    col = 7;
    row = 2 + (index - 19);
  }

  return [colCentre(col), 0, rowCentre(row)];
}

/** Scale factor: CSS board is rendered at roughly `boardPx` pixels,
 *  Three.js world units = 7.56. Pass the rendered board size in px. */
export function worldScale(boardPx: number): number {
  return boardPx / TOTAL;
}
