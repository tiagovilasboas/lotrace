/**
 * Decorative city skyline behind the iso ring.
 *
 * The isometric diamond is wide but short, so a portrait (phone) viewport
 * leaves empty felt above and below the board. Rather than distort the iso
 * geometry to fill it, we paint a low-opacity skyline silhouette in those
 * bands — turning dead space into city depth. This matches the design spec
 * (`lotrace-mobile-redesign.json` → center.decoration.citySilhouette).
 *
 * The silhouette is deterministic (seeded by column index) so the E2E
 * screenshot is stable between runs.
 */

/** Deterministic pseudo-random in [0,1) from an integer seed. */
function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Paint one horizontal band of building silhouettes across the full width,
 * with rooftops sitting on `baselineY` and rising up to `bandHeight`.
 */
function skylineBand(
  ctx: CanvasRenderingContext2D,
  boxW: number,
  baselineY: number,
  bandHeight: number,
  fill: string,
  seedBase: number,
): void {
  const cols = 14;
  const colW = boxW / cols;
  ctx.fillStyle = fill;
  for (let i = 0; i < cols; i += 1) {
    const r = seeded(seedBase + i);
    const h = bandHeight * (0.4 + r * 0.6);
    const w = colW * (0.72 + seeded(seedBase + i + 100) * 0.2);
    const x = i * colW + (colW - w) / 2;
    ctx.fillRect(x, baselineY - h, w, h);
    // A small setback rooftop for a city feel.
    if (r > 0.55) {
      const rw = w * 0.5;
      ctx.fillRect(x + (w - rw) / 2, baselineY - h - bandHeight * 0.18, rw, bandHeight * 0.18);
    }
  }
}

/**
 * Draw the skyline decoration into the felt behind the ring. Called right after
 * the felt fill, before any tiles, so the ring always sits in front of it.
 */
export function drawSkyline(ctx: CanvasRenderingContext2D, boxW: number, boxH: number): void {
  ctx.save();
  // A slightly lighter felt tint so the silhouette reads without stealing focus.
  const fill = 'rgba(255,255,255,0.05)';

  // Top band: skyline rising from ~34% down toward the top.
  skylineBand(ctx, boxW, boxH * 0.34, boxH * 0.16, fill, 1);
  // Bottom band: skyline standing on the lower felt.
  skylineBand(ctx, boxW, boxH * 0.9, boxH * 0.14, fill, 50);

  ctx.restore();
}
