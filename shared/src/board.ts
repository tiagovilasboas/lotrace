import type { BoardCell, ColorGroup, RentLadder } from './types.ts';
import { BOARD_SIZE } from './types.ts';

function lot(
  index: number,
  name: string,
  colorGroup: ColorGroup,
  price: number,
  rentLevels: RentLadder,
): BoardCell {
  return {
    index,
    name,
    kind: 'property',
    colorGroup,
    price,
    rent: rentLevels[0],
    rentLevels,
  };
}

/**
 * LotRace board — 24 cells. "Millionaire" scale.
 *
 * Prices (accessible on purpose, per design brief):
 *   Cheap    R$80k – R$150k   (brown, sky)
 *   Mid      R$180k – R$350k  (pink, orange, red)
 *   Premium  R$400k – R$700k  (yellow, green, navy)
 *
 * Rent ladder: [bare, 1 house, 2 houses, 3 houses, 4 houses, hotel]
 *   bare/1h  R$10k – R$40k    (weak early income)
 *   2h/3h    R$80k – R$250k   (strong income)
 *   4h/hotel R$300k+          (extreme income)
 * Bare monopoly doubles [0] automatically in rentOnProperty().
 */
export const BOARD: BoardCell[] = [
  { index: 0, name: 'Partida', kind: 'go' },

  // ── Brown (cheapest) ─────────────────────────────────────────
  lot(1,  'Leblon',        'brown',    80_000, [ 10_000,  30_000,  90_000, 200_000, 320_000, 450_000]),
  { index: 2, name: 'IPTU',        kind: 'tax', tax: 100_000 },
  lot(3,  'Ipanema',       'brown',   120_000, [ 12_000,  40_000, 120_000, 260_000, 380_000, 520_000]),

  { index: 4, name: 'Estação Rio', kind: 'station', price: 200_000, rent: 100_000 },

  // ── Sky ──────────────────────────────────────────────────────
  lot(5,  'Copacabana',    'sky',     150_000, [ 15_000,  50_000, 140_000, 300_000, 420_000, 560_000]),

  { index: 6, name: 'Visita', kind: 'jail' },

  // ── Pink ─────────────────────────────────────────────────────
  lot(7,  'Jardins',       'pink',    180_000, [ 20_000,  80_000, 180_000, 340_000, 480_000, 620_000]),
  lot(8,  'Vila Madalena', 'pink',    220_000, [ 24_000,  90_000, 200_000, 360_000, 520_000, 680_000]),

  { index: 9, name: 'Estação SP', kind: 'station', price: 200_000, rent: 100_000 },

  // ── Orange ───────────────────────────────────────────────────
  lot(10, 'Paulista',      'orange',  260_000, [ 28_000, 100_000, 220_000, 400_000, 560_000, 720_000]),
  lot(11, 'Pinheiros',     'orange',  300_000, [ 32_000, 110_000, 240_000, 440_000, 600_000, 780_000]),

  { index: 12, name: 'Parque', kind: 'park' },

  // ── Red ──────────────────────────────────────────────────────
  lot(13, 'Recife',        'red',     340_000, [ 36_000, 120_000, 250_000, 480_000, 640_000, 820_000]),
  lot(14, 'Salvador',      'red',     380_000, [ 40_000, 130_000, 260_000, 520_000, 680_000, 880_000]),

  { index: 15, name: 'Estação NE', kind: 'station', price: 200_000, rent: 100_000 },

  // ── Yellow ───────────────────────────────────────────────────
  lot(16, 'Brasília',      'yellow',  420_000, [ 44_000, 150_000, 300_000, 560_000, 720_000, 920_000]),
  lot(17, 'Savassi',       'yellow',  470_000, [ 48_000, 160_000, 320_000, 600_000, 760_000, 980_000]),

  { index: 18, name: 'Vá preso', kind: 'goto-jail' },

  // ── Green ────────────────────────────────────────────────────
  lot(19, 'Batel',         'green',   550_000, [ 52_000, 180_000, 360_000, 640_000, 820_000, 1_050_000]),

  { index: 20, name: 'Estação Sul', kind: 'station', price: 200_000, rent: 100_000 },

  lot(21, 'Floripa',       'green',   620_000, [ 56_000, 200_000, 400_000, 700_000, 900_000, 1_150_000]),

  { index: 22, name: 'IR', kind: 'tax', tax: 200_000 },

  // ── Navy (premium) ───────────────────────────────────────────
  lot(23, 'Moinhos',       'navy',    700_000, [ 60_000, 250_000, 480_000, 800_000, 1_000_000, 1_300_000]),
];

if (BOARD.length !== BOARD_SIZE) {
  throw new Error(`Board must have ${BOARD_SIZE} cells`);
}

export function getCell(index: number): BoardCell {
  const cell = BOARD[index];
  if (!cell) {
    throw new Error(`Unknown cell ${index}`);
  }
  return cell;
}

export function isPurchasable(cell: BoardCell): boolean {
  return cell.kind === 'property' || cell.kind === 'station';
}

export function getPropertyCellsByColorGroup(colorGroup: ColorGroup): BoardCell[] {
  return BOARD.filter(
    (cell) => cell.kind === 'property' && cell.colorGroup === colorGroup,
  );
}
