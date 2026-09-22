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

/** Silhouette variants so districts don't all share one shape (BuildIt variety). */
export type BuildingVariant = 'flat' | 'setback' | 'pitched';

/** Pick a stable variant from the tile index (deterministic for E2E). */
export function variantForIndex(index: number): BuildingVariant {
  const variants: BuildingVariant[] = ['flat', 'setback', 'pitched'];
  return variants[index % variants.length] ?? 'flat';
}

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

/** Scale a ground diamond [t,r,b,l] toward its centre by `k` (0..1). */
function scaleDiamond(g: ScreenPoint[], k: number): ScreenPoint[] {
  const cx = (g[1].x + g[3].x) / 2;
  const cy = (g[0].y + g[2].y) / 2;
  return g.map((p) => ({ x: cx + (p.x - cx) * k, y: cy + (p.y - cy) * k }));
}

/**
 * Draw one iso box: ground diamond `g` [t,r,b,l] raised by `height`, with two
 * shaded side faces, lit windows and a lit roof. Returns the raised (roof)
 * diamond so callers can stack another box or a roof on top.
 */
function isoBox(
  ctx: CanvasRenderingContext2D,
  g: ScreenPoint[],
  height: number,
  baseHex: string,
  windowRows: number,
): ScreenPoint[] {
  const [gt, gr, gb, gl] = g;
  const rt = withHeight(gt, height);
  const rr = withHeight(gr, height);
  const rb = withHeight(gb, height);
  const rl = withHeight(gl, height);

  poly(ctx, [gr, gb, rb, rr], shadeRgba(baseHex, -0.12)); // right face
  poly(ctx, [gb, gl, rl, rb], shadeRgba(baseHex, -0.32)); // left face

  const glow = 'rgba(255, 249, 224, 0.85)';
  drawWindows(ctx, gr, gb, rr, rb, windowRows, glow);
  drawWindows(ctx, gb, gl, rb, rl, windowRows, glow);

  poly(ctx, [rt, rr, rb, rl], shadeRgba(baseHex, 0.28)); // lit roof
  return [rt, rr, rb, rl];
}

/** A pitched (pyramid) roof on the raised diamond `r`, rising by `peak`. */
function pitchedRoof(
  ctx: CanvasRenderingContext2D,
  r: ScreenPoint[],
  peak: number,
  baseHex: string,
): void {
  const [rt, rr, rb, rl] = r;
  const apex: ScreenPoint = { x: (rr.x + rl.x) / 2, y: (rt.y + rb.y) / 2 - peak };
  poly(ctx, [rr, rb, apex], shadeRgba(baseHex, -0.05)); // front-right slope
  poly(ctx, [rb, rl, apex], shadeRgba(baseHex, -0.24)); // front-left slope (shade)
  poly(ctx, [rt, rr, apex], shadeRgba(baseHex, 0.34)); // lit back-right slope
  poly(ctx, [rl, rt, apex], shadeRgba(baseHex, 0.2)); // lit back-left slope
}

/**
 * Draw one coloured iso building on a cell, tinted by its group `baseHex` and
 * shaped by `variant` so districts don't all share one silhouette.
 */
export function drawColouredBuilding(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  shape: BuildingShape,
  baseHex: string,
  variant: BuildingVariant = 'flat',
): void {
  const height = HEIGHT[shape] * cfg.tileH;
  const ground = footprint(col, row, cfg, FOOTPRINT[shape], cfg.tileH * 0.18);

  // Ground contact shadow (soft).
  poly(ctx, ground, 'rgba(0,0,0,0.22)');

  if (variant === 'setback') {
    // Stepped tower: a tall base + a narrower upper section (skyscraper).
    const baseH = height * 0.62;
    const roof = isoBox(ctx, ground, baseH, baseHex, WINDOW_ROWS[shape]);
    const upper = scaleDiamond(roof, 0.66);
    isoBox(ctx, upper, height - baseH, baseHex, Math.max(1, WINDOW_ROWS[shape] - 1));
    return;
  }

  const roof = isoBox(ctx, ground, height, baseHex, WINDOW_ROWS[shape]);

  if (variant === 'pitched') {
    // Residential: a pitched roof crowning the box.
    pitchedRoof(ctx, roof, cfg.tileH * 0.55, baseHex);
    return;
  }

  // 'flat': crisp roof edge highlight.
  const [rt, rr, rb, rl] = roof;
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
