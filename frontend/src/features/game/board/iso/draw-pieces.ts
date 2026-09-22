import { assetImage, carImage, type BoardAssetKey } from '@/features/game/board/iso/asset-images.ts';
import { tileToScreen, type IsoConfig, type ScreenPoint } from '@/features/game/board/iso/iso-projection.ts';

/**
 * Isometric building + car drawing (asset-first).
 *
 * Buildings, corner glyphs and cars are hand-drawn SVG assets from
 * `design-system/assets` (loaded via asset-images.ts). We draw each sprite with
 * `ctx.drawImage`, anchoring its baseline (the sprite's ground shadow) on the
 * tile centre and scaling it to the tile. The sprites are already isometric, so
 * no reprojection is needed — footprint is controlled by the draw width, and the
 * exaggerated visual height comes from the artwork itself (SimCity BuildIt feel).
 */

type BuildingKind = 'house' | 'tower' | 'hotel';

/** Which SVG asset renders each building kind. */
const BUILDING_ASSET: Record<BuildingKind, BoardAssetKey> = {
  house: 'house',
  tower: 'hotel',
  hotel: 'hotel',
};

/**
 * Draw width as a fraction of the iso tile width. The taller assets (hotel) are
 * drawn a touch wider so wealth reads bigger, but footprint stays controlled so
 * they don't swamp the tile behind. The car stays the smallest movable marker.
 */
const BUILDING_WIDTH: Record<BuildingKind, number> = {
  house: 0.92,
  tower: 1.02,
  hotel: 1.12,
};

/** Vertical scale multiplier per kind — exaggerate height for towers/hotels. */
const BUILDING_STRETCH: Record<BuildingKind, number> = {
  house: 1.0,
  tower: 1.18,
  hotel: 1.3,
};

/** The car sprite drawn width as a fraction of the iso tile width (a marker). */
const CAR_WIDTH = 0.4;

/**
 * Where the sprite's baseline sits vertically within its own viewBox (0..1).
 * Both piece SVGs (32×32) and car SVGs (28×44) place their ground shadow near
 * the bottom, so anchoring at ~0.9 lands the shadow on the tile centre.
 */
const BASELINE = 0.9;

/**
 * Draw a sprite so its baseline (ground shadow) lands on `ground`, scaled to
 * `drawW` wide, keeping the SVG's aspect ratio and optional vertical stretch.
 */
function drawSprite(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  ground: ScreenPoint,
  drawW: number,
  stretch: number,
): void {
  const aspect = img.naturalHeight / img.naturalWidth || 1;
  const drawH = drawW * aspect * stretch;
  const x = ground.x - drawW / 2;
  const y = ground.y - drawH * BASELINE;
  ctx.drawImage(img, x, y, drawW, drawH);
}

/**
 * Draw one iso building on a cell using its SVG asset. Skipped silently if the
 * asset is not loaded yet (picked up on the next render tick).
 */
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  kind: BuildingKind,
): void {
  const img = assetImage(BUILDING_ASSET[kind]);
  if (!img) return;
  const c = tileToScreen(col, row, cfg);
  // Seat the building toward the BACK of the tile so its body sits behind the
  // DOM label (anchored on the tile's front edge), never covering the name.
  const ground = { x: c.x, y: c.y - cfg.tileH * 0.16 };
  drawSprite(ctx, img, ground, cfg.tileW * BUILDING_WIDTH[kind], BUILDING_STRETCH[kind]);
}

/**
 * Draw the tile's icon (station / tax) when it has no building on it. Uses the
 * SVG asset; skipped silently until loaded.
 */
export function drawTileIcon(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  key: BoardAssetKey,
): void {
  const img = assetImage(key);
  if (!img) return;
  const ground = tileToScreen(col, row, cfg);
  drawSprite(ctx, img, ground, cfg.tileW * 0.72, 1.0);
}

/**
 * Draw a corner glyph (go / jail / goto-jail / park) from its SVG asset.
 */
export function drawCornerAsset(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  key: BoardAssetKey,
): void {
  const img = assetImage(key);
  if (!img) return;
  const ground = tileToScreen(col, row, cfg);
  drawSprite(ctx, img, ground, cfg.tileW * 0.78, 1.0);
}

/**
 * Draw a player car marker on a cell using the per-seat SVG (colour baked in).
 * A low marker (~half the tile wide) — it marks position, not wealth.
 */
export function drawCar(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  playerID: string,
  offset: ScreenPoint = { x: 0, y: 0 },
): void {
  const img = carImage(playerID);
  if (!img) return;
  const c = tileToScreen(col, row, cfg);
  // Seat the car toward the back of the tile (like buildings) so it sits behind
  // the DOM label anchored on the tile's front edge, not over the price.
  const ground = { x: c.x + offset.x, y: c.y - cfg.tileH * 0.14 + offset.y };
  drawSprite(ctx, img, ground, cfg.tileW * CAR_WIDTH, 1.0);
}

export type { BuildingKind };
export { BUILDING_WIDTH };
