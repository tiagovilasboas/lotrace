import { BOARD, isHotel, type BoardCell, type ImobiliarioState } from '@lotrace/shared';
import { ringCellPosition } from '@/features/game/board/ring-geometry.ts';
import { colorGroupCanvas } from '@/features/game/board/iso/board-palette.ts';
import type { BoardPalette } from '@/features/game/board/iso/board-palette.ts';
import { drawBuilding, drawCar, type BuildingKind } from '@/features/game/board/iso/draw-pieces.ts';
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

/** A simple white glyph on a corner tile so it reads at a glance. */
function drawCornerGlyph(
  ctx: CanvasRenderingContext2D,
  cell: BoardCell,
  col: number,
  row: number,
  cfg: IsoConfig,
): void {
  const c = tileToScreen(col, row, cfg);
  const s = cfg.tileH * 0.5;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = Math.max(1.5, cfg.tileH * 0.09);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (cell.kind === 'go') {
    // Arrow pointing right-down (into the track).
    ctx.beginPath();
    ctx.moveTo(c.x - s * 0.5, c.y);
    ctx.lineTo(c.x + s * 0.5, c.y);
    ctx.moveTo(c.x + s * 0.1, c.y - s * 0.35);
    ctx.lineTo(c.x + s * 0.5, c.y);
    ctx.lineTo(c.x + s * 0.1, c.y + s * 0.35);
    ctx.stroke();
  } else if (cell.kind === 'jail' || cell.kind === 'goto-jail') {
    // Prison bars.
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      ctx.moveTo(c.x + i * s * 0.3, c.y - s * 0.4);
      ctx.lineTo(c.x + i * s * 0.3, c.y + s * 0.4);
      ctx.stroke();
    }
  } else if (cell.kind === 'park') {
    // Tree: broad canopy (two blobs) + short trunk — reads as a tree, not a pin.
    ctx.beginPath();
    ctx.arc(c.x - s * 0.18, c.y - s * 0.05, s * 0.3, 0, Math.PI * 2);
    ctx.arc(c.x + s * 0.18, c.y - s * 0.05, s * 0.3, 0, Math.PI * 2);
    ctx.arc(c.x, c.y - s * 0.28, s * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = Math.max(2, cfg.tileH * 0.13);
    ctx.beginPath();
    ctx.moveTo(c.x, c.y + s * 0.05);
    ctx.lineTo(c.x, c.y + s * 0.38);
    ctx.stroke();
  }
  ctx.restore();
}

/** House count → building kind (0 = none). */
function buildingFor(houseCount: number): BuildingKind | null {
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

  // One back-to-front pass: tile ground, then its building, then its cars.
  for (const { cell, col, row } of placedCells()) {
    fillDiamond(ctx, col, row, cfg, cellFill(cell, palette), 'rgba(0,0,0,0.28)');

    if (cell.kind === 'property' && cell.colorGroup) {
      drawAccent(ctx, col, row, cfg, colorGroupCanvas(cell.colorGroup, palette));
    } else if (cell.kind === 'go' || cell.kind === 'jail' || cell.kind === 'goto-jail' || cell.kind === 'park') {
      drawCornerGlyph(ctx, cell, col, row, cfg);
    }

    if (G) {
      const kind = buildingFor(G.houses[cell.index] ?? 0);
      if (kind) drawBuilding(ctx, col, row, cfg, kind);

      const cars = carsByCell.get(cell.index);
      if (cars) {
        cars.forEach((id, i) => drawCar(ctx, col, row, cfg, id, carOffset(i, cfg)));
      }
    }
  }
}

export { RING_SPAN };
