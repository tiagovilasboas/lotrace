import { carHexForCanvas } from '@/features/game/board/iso/piece-hex.ts';
import {
  tileDiamond,
  tileToScreen,
  withHeight,
  type IsoConfig,
  type ScreenPoint,
} from '@/features/game/board/iso/iso-projection.ts';

/**
 * Isometric building + car drawing (Phase 3.3).
 * Buildings are boxes with an EXAGGERATED height: footprint controlled, but the
 * drawn height is several "tile units" so it reads like a SimCity BuildIt tower.
 * The car is a low marker (a rounded plate) ~ the road width.
 * All heights are in pixels derived from the tile size.
 */

/** How tall one "level" of building is, relative to the iso tile height.
 * Kept modest so towers read as buildings on a tile, not skyscraper poles. */
const LEVEL_H = 0.85; // multiples of tileH per visualHeight unit

type BuildingKind = 'house' | 'tower' | 'hotel';

/** visualHeight per kind — clear hierarchy house < tower < hotel. */
const VISUAL_HEIGHT: Record<BuildingKind, number> = {
  house: 0.9,
  tower: 1.7,
  hotel: 2.6,
};

/** Building footprint as a fraction of the tile diamond (0..1). Wider = reads
 * as a solid building, not a pole. */
const FOOTPRINT: Record<BuildingKind, number> = {
  house: 0.72,
  tower: 0.74,
  hotel: 0.8,
};

const FACE_LIGHT = '#f4e8c9';
const FACE_MID = '#d9c7a0';
const FACE_DARK = '#b7a074';
const WINDOW = 'rgba(85,216,255,0.55)';

/** A scaled diamond (footprint) around a cell centre, on the ground plane. */
function footprintDiamond(col: number, row: number, cfg: IsoConfig, scale: number): ScreenPoint[] {
  const c = tileToScreen(col, row, cfg);
  const [t, r, b, l] = tileDiamond(col, row, cfg);
  return [
    { x: c.x, y: c.y + (t.y - c.y) * scale },
    { x: c.x + (r.x - c.x) * scale, y: c.y },
    { x: c.x, y: c.y + (b.y - c.y) * scale },
    { x: c.x + (l.x - c.x) * scale, y: c.y },
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

/**
 * Draw one iso building box on a cell: two visible side faces + the top face,
 * raised by `height` pixels. [top, right, bottom, left] ground corners.
 */
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  kind: BuildingKind,
): void {
  const height = VISUAL_HEIGHT[kind] * LEVEL_H * cfg.tileH;
  const g = footprintDiamond(col, row, cfg, FOOTPRINT[kind]); // ground
  const [gt, gr, gb, gl] = g;
  const rt = withHeight(gt, height);
  const rr = withHeight(gr, height);
  const rb = withHeight(gb, height);
  const rl = withHeight(gl, height);

  // Right face (front-right): ground right→bottom up to roof.
  poly(ctx, [gr, gb, rb, rr], FACE_MID);
  // Left face (front-left): ground bottom→left up to roof.
  poly(ctx, [gb, gl, rl, rb], FACE_DARK);
  // Roof (top diamond).
  poly(ctx, [rt, rr, rb, rl], FACE_LIGHT);

  // A couple of window bands on the two front faces for a city feel.
  const bands = kind === 'house' ? 1 : kind === 'tower' ? 2 : 3;
  for (let i = 1; i <= bands; i += 1) {
    const f = i / (bands + 1);
    const yr1 = { x: gr.x, y: gr.y - height * f };
    const yb = { x: gb.x, y: gb.y - height * f };
    const yl1 = { x: gl.x, y: gl.y - height * f };
    ctx.strokeStyle = WINDOW;
    ctx.lineWidth = Math.max(1, cfg.tileH * 0.06);
    ctx.beginPath();
    ctx.moveTo(yr1.x, yr1.y);
    ctx.lineTo(yb.x, yb.y);
    ctx.lineTo(yl1.x, yl1.y);
    ctx.stroke();
  }
}

/**
 * Draw a car marker on a cell: a small rounded plate (~road width) at ground
 * level with the player's colour. Low profile — it marks position, not wealth.
 */
export function drawCar(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  playerID: string,
  offset: ScreenPoint = { x: 0, y: 0 },
): void {
  const c = tileToScreen(col, row, cfg);
  const cx = c.x + offset.x;
  const cy = c.y + offset.y;
  const rw = cfg.tileW * 0.22;
  const rh = cfg.tileH * 0.34;
  const lift = cfg.tileH * 0.28;

  // Shadow on the ground.
  ctx.beginPath();
  ctx.ellipse(cx, cy, rw, rh, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fill();

  // Body (raised a touch off the ground).
  ctx.beginPath();
  ctx.ellipse(cx, cy - lift, rw, rh, 0, 0, Math.PI * 2);
  ctx.fillStyle = carHexForCanvas(playerID);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = Math.max(1, cfg.tileW * 0.015);
  ctx.stroke();

  // Roof highlight.
  ctx.beginPath();
  ctx.ellipse(cx, cy - lift - rh * 0.25, rw * 0.5, rh * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fill();
}

export type { BuildingKind };
export { VISUAL_HEIGHT, FOOTPRINT };
