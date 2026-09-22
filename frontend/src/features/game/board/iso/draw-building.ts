import { shadeRgba } from '@/features/game/board/iso/color-shade.ts';
import {
  tileDiamond,
  tileToScreen,
  withHeight,
  type IsoConfig,
  type ScreenPoint,
} from '@/features/game/board/iso/iso-projection.ts';

/**
 * Vector iso building coloured by its neighbourhood (colour group).
 *
 * Instead of one fixed sprite repeated around the ring, each property draws a
 * box tinted with its group colour: a lit top face, two shaded side faces and
 * glowing window rows. A single base hue plus light/shadow gives the SimCity
 * BuildIt sense of volume, and colouring by group makes each neighbourhood read
 * as its own district rather than a repeated wallpaper.
 *
 * Footprint is controlled; visual height is exaggerated per kind (house < tower
 * < hotel) so wealth reads through height, BuildIt-style.
 */

export type BuildingShape = 'house' | 'tower' | 'hotel';

/** Drawn height per kind, in multiples of the iso tile height. */
const HEIGHT: Record<BuildingShape, number> = {
  house: 0.85,
  tower: 1.35,
  hotel: 1.85,
};

/** Footprint as a fraction of the tile diamond (0..1) — wider base reads as a
 * building, not a pole. */
const FOOTPRINT: Record<BuildingShape, number> = {
  house: 0.82,
  tower: 0.8,
  hotel: 0.84,
};

/** Window rows per kind. */
const WINDOW_ROWS: Record<BuildingShape, number> = {
  house: 2,
  tower: 4,
  hotel: 6,
};

/**
 * A scaled diamond (footprint) around a cell centre, on the ground plane,
 * seated slightly toward the back of the tile (`backY`) so the building body
 * sits behind the DOM label anchored on the tile's front edge.
 */
function footprint(
  col: number,
  row: number,
  cfg: IsoConfig,
  scale: number,
  backY: number,
): ScreenPoint[] {
  const base = tileToScreen(col, row, cfg);
  const c = { x: base.x, y: base.y - backY };
  const [t, r, b, l] = tileDiamond(col, row, cfg);
  return [
    { x: c.x, y: c.y + (t.y - base.y) * scale },
    { x: c.x + (r.x - base.x) * scale, y: c.y },
    { x: c.x, y: c.y + (b.y - base.y) * scale },
    { x: c.x + (l.x - base.x) * scale, y: c.y },
  ];
}

function poly(ctx: CanvasRenderingContext2D, pts: ScreenPoint[], fill: string): void {
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i += 1) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

/** Interpolate along a segment. */
function lerp(a: ScreenPoint, b: ScreenPoint, t: number): ScreenPoint {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * Draw window rows on one raised side face defined by ground edge [g0,g1] and
 * its raised counterparts [r0,r1]. Windows are small lit rectangles arranged in
 * rows up the face.
 */
function drawWindows(
  ctx: CanvasRenderingContext2D,
  g0: ScreenPoint,
  g1: ScreenPoint,
  r0: ScreenPoint,
  r1: ScreenPoint,
  rows: number,
  glow: string,
): void {
  const cols = 2;
  ctx.fillStyle = glow;
  for (let rr = 0; rr < rows; rr += 1) {
    const vFrac = (rr + 0.5) / rows; // vertical position 0(top)..1(bottom-ish)
    const bottom0 = lerp(g0, r0, vFrac);
    const bottom1 = lerp(g1, r1, vFrac);
    for (let cc = 0; cc < cols; cc += 1) {
      const uFrac = (cc + 0.5) / cols;
      const centre = lerp(bottom0, bottom1, uFrac);
      const w = Math.abs(g1.x - g0.x) * 0.12;
      const h = w * 0.9;
      ctx.fillRect(centre.x - w / 2, centre.y - h / 2, w, h);
    }
  }
}

/**
 * Draw one coloured iso building on a cell. `baseHex` is the group colour.
 * Ground point is the tile centre unless `ground` is provided (already offset).
 */
export function drawColouredBuilding(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  shape: BuildingShape,
  baseHex: string,
): void {
  const height = HEIGHT[shape] * cfg.tileH;
  const [gt, gr, gb, gl] = footprint(col, row, cfg, FOOTPRINT[shape], cfg.tileH * 0.18);
  const rt = withHeight(gt, height);
  const rr = withHeight(gr, height);
  const rb = withHeight(gb, height);
  const rl = withHeight(gl, height);

  // Ground contact shadow (soft).
  poly(ctx, [gt, gr, gb, gl], 'rgba(0,0,0,0.22)');

  // Two visible side faces (front-right lit a touch more than front-left).
  poly(ctx, [gr, gb, rb, rr], shadeRgba(baseHex, -0.12)); // right face
  poly(ctx, [gb, gl, rl, rb], shadeRgba(baseHex, -0.32)); // left face (deeper shadow)

  // Windows on both front faces.
  const glow = 'rgba(255, 249, 224, 0.85)';
  drawWindows(ctx, gr, gb, rr, rb, WINDOW_ROWS[shape], glow);
  drawWindows(ctx, gb, gl, rb, rl, WINDOW_ROWS[shape], glow);

  // Lit roof (top diamond).
  poly(ctx, [rt, rr, rb, rl], shadeRgba(baseHex, 0.28));

  // Roof edge highlight for a crisp top.
  ctx.strokeStyle = shadeRgba(baseHex, 0.5, 0.9);
  ctx.lineWidth = Math.max(1, cfg.tileW * 0.015);
  ctx.beginPath();
  ctx.moveTo(rt.x, rt.y);
  ctx.lineTo(rr.x, rr.y);
  ctx.lineTo(rb.x, rb.y);
  ctx.lineTo(rl.x, rl.y);
  ctx.closePath();
  ctx.stroke();
}
