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
 * LotRace board — 24 cells.
 *
 * Economy rationale (rebalanced):
 *   STARTING_CASH = R$3 000
 *   GO_SALARY     = R$300
 *   Cheapest lot  = R$240  (~8 % of start)
 *   Most expensive= R$1 600 (~53 % of start)
 *   Ratio mirrors Monopoly Classic so players feel pressure
 *   after 3–4 turns instead of 10+.
 *
 * Rent ladder: [bare, 1 house, 2 houses, 3 houses, 4 houses, hotel]
 * Bare monopoly doubles [0] automatically in rentOnProperty().
 */
export const BOARD: BoardCell[] = [
  { index: 0, name: 'Partida', kind: 'go' },

  // ── Brown (cheapest) ─────────────────────────────────────────
  lot(1,  'Leblon',        'brown',   240, [    20,   100,   300,   900, 1_600, 2_500]),
  { index: 2, name: 'IPTU',        kind: 'tax', tax: 400 },
  lot(3,  'Ipanema',       'brown',   320, [    40,   200,   600, 1_800, 3_200, 4_500]),

  { index: 4, name: 'Estação Rio', kind: 'station', price: 800, rent: 100 },

  // ── Sky ──────────────────────────────────────────────────────
  lot(5,  'Copacabana',    'sky',     400, [    60,   300,   900, 2_700, 4_000, 5_500]),

  { index: 6, name: 'Visita', kind: 'jail' },

  // ── Pink ─────────────────────────────────────────────────────
  lot(7,  'Jardins',       'pink',    560, [   100,   500, 1_500, 4_500, 6_250, 7_500]),
  lot(8,  'Vila Madalena', 'pink',    640, [   120,   600, 1_800, 5_000, 7_000, 9_000]),

  { index: 9, name: 'Estação SP', kind: 'station', price: 800, rent: 100 },

  // ── Orange ───────────────────────────────────────────────────
  lot(10, 'Paulista',      'orange',  720, [   140,   700, 2_000, 5_500, 7_500, 9_500]),
  lot(11, 'Pinheiros',     'orange',  800, [   160,   800, 2_200, 6_000, 8_000, 10_000]),

  { index: 12, name: 'Parque', kind: 'park' },

  // ── Red ──────────────────────────────────────────────────────
  lot(13, 'Recife',        'red',     880, [   180,   900, 2_500, 7_000, 8_750, 10_500]),
  lot(14, 'Salvador',      'red',     960, [   200, 1_000, 3_000, 7_500, 9_250, 11_000]),

  { index: 15, name: 'Estação NE', kind: 'station', price: 800, rent: 100 },

  // ── Yellow ───────────────────────────────────────────────────
  lot(16, 'Brasília',      'yellow', 1_040, [  220, 1_100, 3_300, 8_000, 9_750, 11_500]),
  lot(17, 'Savassi',       'yellow', 1_120, [  240, 1_200, 3_600, 8_500, 10_250, 12_000]),

  { index: 18, name: 'Vá preso', kind: 'goto-jail' },

  // ── Green ────────────────────────────────────────────────────
  lot(19, 'Batel',         'green',  1_200, [  260, 1_300, 3_900, 9_000, 11_000, 12_750]),

  { index: 20, name: 'Estação Sul', kind: 'station', price: 800, rent: 100 },

  lot(21, 'Floripa',       'green',  1_280, [  280, 1_500, 4_500, 10_000, 12_000, 14_000]),

  { index: 22, name: 'IR', kind: 'tax', tax: 300 },

  // ── Navy (premium) ───────────────────────────────────────────
  lot(23, 'Moinhos',       'navy',   1_600, [  200, 1_000, 3_000, 7_500, 9_250, 11_000]),
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
