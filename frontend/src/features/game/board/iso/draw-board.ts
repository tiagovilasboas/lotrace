import { BOARD, type BoardCell } from '@lotrace/shared';
import { ringCellPosition } from '@/features/game/board/ring-geometry.ts';
import { colorGroupCanvas } from '@/features/game/board/iso/board-palette.ts';
import type { BoardPalette } from '@/features/game/board/iso/board-palette.ts';
import {
  depthKey,
  tileDiamond,
  tileToScreen,
  type IsoConfig,
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

/**
 * Draw the ground: felt background + each ring tile as an iso diamond, with a
 * colour accent for property groups. Buildings/pieces are drawn later (3.3).
 * Coordinates are in the ctx's own pixel space (caller sets the dpr transform).
 */
export function drawBoard(
  ctx: CanvasRenderingContext2D,
  cfg: IsoConfig,
  palette: BoardPalette,
  boxW: number,
  boxH: number,
): void {
  ctx.clearRect(0, 0, boxW, boxH);

  // Felt background.
  ctx.fillStyle = palette.felt;
  ctx.fillRect(0, 0, boxW, boxH);

  // Tiles back-to-front.
  for (const { cell, col, row } of placedCells()) {
    fillDiamond(ctx, col, row, cfg, cellFill(cell, palette), 'rgba(0,0,0,0.28)');

    // Property colour accent: a smaller inner diamond in the group hue.
    if (cell.kind === 'property' && cell.colorGroup) {
      const centre = tileToScreen(col, row, cfg);
      const hue = colorGroupCanvas(cell.colorGroup, palette);
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
  }
}

export { RING_SPAN };
