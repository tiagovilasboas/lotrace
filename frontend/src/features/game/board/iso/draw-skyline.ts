/**
 * Decorative iso city behind the ring.
 *
 * The isometric diamond is wide but short, so a portrait (phone) viewport
 * leaves empty felt above and below the board. Rather than distort the iso
 * geometry, we fill that dead space with a low-opacity CITY of little
 * isometric blocks (top + two shaded faces), so the background reads as a
 * living city in the same 3D grammar as the ring — not a flat equaliser.
 * Matches the design premise (SimCity BuildIt: no dead empty ground).
 *
 * Deterministic (seeded by grid cell) so the E2E screenshot is stable.
 */

type Pt = { x: number; y: number };

/** Deterministic pseudo-random in [0,1) from two integer seeds. */
function seeded(a: number, b: number): number {
  const x = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Fill a polygon path. */
function poly(ctx: CanvasRenderingContext2D, pts: Pt[], fill: string): void {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/**
 * Draw one little iso block with its ground centre at (cx, cy): a top face and
 * two shaded side faces raised by `h`. `w`/`d` are the half-width/half-depth of
 * the diamond base. Alpha controls how faint the whole city is.
 */
function block(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  d: number,
  h: number,
  alpha: number,
): void {
  const gt: Pt = { x: cx, y: cy - d };
  const gr: Pt = { x: cx + w, y: cy };
  const gb: Pt = { x: cx, y: cy + d };
  const gl: Pt = { x: cx - w, y: cy };
  const rt: Pt = { x: gt.x, y: gt.y - h };
  const rr: Pt = { x: gr.x, y: gr.y - h };
  const rb: Pt = { x: gb.x, y: gb.y - h };
  const rl: Pt = { x: gl.x, y: gl.y - h };

  // Side faces (darker) then lit top — a touch lighter than the felt.
  poly(ctx, [gr, gb, rb, rr], `rgba(255,255,255,${alpha * 0.5})`);
  poly(ctx, [gb, gl, rl, rb], `rgba(0,0,0,${alpha * 0.9})`);
  poly(ctx, [rt, rr, rb, rl], `rgba(255,255,255,${alpha})`);
}

/**
 * Fill a horizontal band of the felt with a faint iso city grid. `topY`..`botY`
 * is the vertical range; blocks are laid on an iso grid and given random heights.
 */
function cityBand(
  ctx: CanvasRenderingContext2D,
  boxW: number,
  topY: number,
  botY: number,
  seedBase: number,
): void {
  const tileW = boxW / 7; // block footprint ~ a ring tile, so it reads as city
  const w = tileW / 2;
  const d = w * 0.5;
  const cols = 9;
  const rows = Math.max(2, Math.round((botY - topY) / (d * 1.6)));
  const alpha = 0.05;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (seeded(seedBase + c, r) < 0.35) continue; // gaps → streets
      const cx = (c - (r % 2 ? 0.5 : 0)) * tileW * 0.6 + tileW * 0.2;
      const cy = topY + r * d * 1.5;
      const h = tileW * (0.25 + seeded(seedBase + c + 20, r) * 0.7);
      block(ctx, cx, cy, w, d, h, alpha);
    }
  }
}

/**
 * Draw the decorative iso city into the felt behind the ring. Called right
 * after the felt fill, before any tiles, so the ring always sits in front.
 */
export function drawSkyline(ctx: CanvasRenderingContext2D, boxW: number, boxH: number): void {
  ctx.save();
  // Top band fills the empty felt above the diamond.
  cityBand(ctx, boxW, boxH * 0.06, boxH * 0.3, 1);
  // Bottom band fills below the diamond.
  cityBand(ctx, boxW, boxH * 0.72, boxH * 0.96, 40);
  ctx.restore();
}
