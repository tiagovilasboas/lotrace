import { BOARD, isHotel, type BoardCell, type ImobiliarioState } from '@lotrace/shared';
import { ringCellPosition } from '@/features/game/board/ring-geometry.ts';
import { colorGroupCanvas } from '@/features/game/board/iso/board-palette.ts';
import type { BoardPalette } from '@/features/game/board/iso/board-palette.ts';
import type { BoardAssetKey } from '@/features/game/board/iso/asset-images.ts';
import { drawSkyline } from '@/features/game/board/iso/draw-skyline.ts';
import { drawColouredBuilding, type BuildingShape } from '@/features/game/board/iso/draw-building.ts';
import {
  drawCar,
  drawCornerAsset,
  drawTileIcon,
} from '@/features/game/board/iso/draw-pieces.ts';
import {
  depthKey,
  tileDiamond,
  tileToScreen,
  type IsoConfig,
  type ScreenPoint,
} from '@/features/game/board/iso/iso-projection.ts';

/** RING grid is 7x7; ring cells sit on the outer frame. */
const RING_SPAN = 7;

type PlacedCell = { cell: BoardCell; col: number; row: number };

/** Cells with their grid position, sorted back-to-front for painter's order. */
export function placedCells(): PlacedCell[] {
  return BOARD.map((cell) => {
    const pos = ringCellPosition(cell.index);
    // ring-geometry columns/rows are 1-indexed; canvas grid is 0-indexed.
    return { cell, col: pos.column - 1, row: pos.row - 1 };
  }).sort((a, b) => depthKey(a.col, a.row) - depthKey(b.col, b.row));
}

function fillDiamond(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  fill: string,
  stroke?: string,
): void {
  const [top, right, bottom, left] = tileDiamond(col, row, cfg);
  ctx.beginPath();
  ctx.moveTo(top.x, top.y);
  ctx.lineTo(right.x, right.y);
  ctx.lineTo(bottom.x, bottom.y);
  ctx.lineTo(left.x, left.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, cfg.tileW * 0.02);
    ctx.stroke();
  }
}

function cellFill(cell: BoardCell, palette: BoardPalette): string {
  switch (cell.kind) {
    case 'go':
      return palette.go;
    case 'jail':
    case 'goto-jail':
      return palette.jail;
    case 'station':
      return palette.station;
    case 'tax':
      return palette.tax;
    case 'park':
      return palette.go;
    default:
      return palette.track;
  }
}

function drawAccent(
  ctx: CanvasRenderingContext2D,
  col: number,
  row: number,
  cfg: IsoConfig,
  hue: string,
): void {
  const centre = tileToScreen(col, row, cfg);
  const inset = 0.34;
  const [t, r, b, l] = tileDiamond(col, row, cfg);
  ctx.beginPath();
  ctx.moveTo(centre.x, centre.y + (t.y - centre.y) * inset);
  ctx.lineTo(centre.x + (r.x - centre.x) * inset, centre.y);
  ctx.lineTo(centre.x, centre.y + (b.y - centre.y) * inset);
  ctx.lineTo(centre.x + (l.x - centre.x) * inset, centre.y);
  ctx.closePath();
  ctx.fillStyle = hue;
  ctx.fill();
}

/** The SVG asset used as the corner glyph for a corner-kind cell. */
function cornerAsset(cell: BoardCell): BoardAssetKey | null {
  switch (cell.kind) {
    case 'go':
      return 'corner-go';
    case 'jail':
      return 'corner-jail';
    case 'goto-jail':
      return 'corner-goto-jail';
    case 'park':
      return 'corner-park';
    default:
      return null;
  }
}

/** The SVG icon shown on a non-property tile (station / tax) with no building. */
function tileIconAsset(cell: BoardCell): BoardAssetKey | null {
  switch (cell.kind) {
    case 'station':
      return 'station';
    case 'tax':
      return 'tax';
    default:
      return null;
  }
}

/** House count → building shape (0 = none). */
function buildingFor(houseCount: number): BuildingShape | null {
  if (houseCount <= 0) return null;
  if (isHotel(houseCount)) return 'hotel';
  return houseCount >= 3 ? 'tower' : 'house';
}

/** Small per-car offsets so multiple cars on a tile don't fully overlap. */
function carOffset(i: number, cfg: IsoConfig): ScreenPoint {
  const spread = cfg.tileW * 0.14;
  const dx = (i % 2 === 0 ? -1 : 1) * spread;
  const dy = (i < 2 ? -1 : 1) * (cfg.tileH * 0.12);
  return { x: dx, y: dy };
}

/**
 * Draw the whole board: felt + tiles + colour accents + buildings + cars, all
 * in a single back-to-front pass so nearer objects overlap the ones behind
 * (SimCity BuildIt city depth). G is optional (ground only when omitted).
 * Coordinates are in the ctx's own pixel space (caller sets the dpr transform).
 */
export function drawBoard(
  ctx: CanvasRenderingContext2D,
  cfg: IsoConfig,
  palette: BoardPalette,
  boxW: number,
  boxH: number,
  G?: ImobiliarioState,
): void {
  ctx.clearRect(0, 0, boxW, boxH);

  // Felt background.
  ctx.fillStyle = palette.felt;
  ctx.fillRect(0, 0, boxW, boxH);

  // Decorative skyline behind the ring, filling the empty portrait felt.
  drawSkyline(ctx, boxW, boxH);

  // Cars grouped by cell index for the painter pass.
  const carsByCell = new Map<number, string[]>();
  if (G) {
    for (const p of Object.values(G.players)) {
      if (p.bankrupt) continue;
      const list = carsByCell.get(p.position) ?? [];
      list.push(p.id);
      carsByCell.set(p.position, list);
    }
  }

  // One back-to-front pass: tile ground + colour accent, then its glyph/asset,
  // then its building, then its cars — so nearer sprites overlap the ones behind.
  for (const { cell, col, row } of placedCells()) {
    fillDiamond(ctx, col, row, cfg, cellFill(cell, palette), 'rgba(0,0,0,0.28)');

    if (cell.kind === 'property' && cell.colorGroup) {
      drawAccent(ctx, col, row, cfg, colorGroupCanvas(cell.colorGroup, palette));
    }

    const corner = cornerAsset(cell);
    if (corner) drawCornerAsset(ctx, col, row, cfg, corner);

    const houses = G ? (G.houses[cell.index] ?? 0) : 0;
    const kind = buildingFor(houses);
    if (kind && cell.kind === 'property' && cell.colorGroup) {
      // Coloured vector building tinted by the tile's neighbourhood group.
      drawColouredBuilding(ctx, col, row, cfg, kind, colorGroupCanvas(cell.colorGroup, palette));
    } else {
      // No building: show the tile's own icon (station / tax) as the landmark.
      const icon = tileIconAsset(cell);
      if (icon) drawTileIcon(ctx, col, row, cfg, icon);
    }

    if (G) {
      const cars = carsByCell.get(cell.index);
      if (cars) {
        cars.forEach((id, i) => drawCar(ctx, col, row, cfg, id, carOffset(i, cfg)));
      }
    }
  }
}

export { RING_SPAN };
