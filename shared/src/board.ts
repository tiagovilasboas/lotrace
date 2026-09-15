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

export const BOARD: BoardCell[] = [
  { index: 0, name: 'Partida', kind: 'go' },
  lot(1, 'Leblon', 'brown', 60, [2, 10, 30, 90, 160, 250]),
  { index: 2, name: 'IPTU', kind: 'tax', tax: 200 },
  lot(3, 'Ipanema', 'brown', 80, [4, 20, 60, 180, 320, 450]),
  { index: 4, name: 'Estação Rio', kind: 'station', price: 200, rent: 25 },
  lot(5, 'Copacabana', 'sky', 100, [6, 30, 90, 270, 400, 550]),
  { index: 6, name: 'Visita', kind: 'jail' },
  lot(7, 'Jardins', 'pink', 140, [10, 50, 150, 450, 625, 750]),
  lot(8, 'Vila Madalena', 'pink', 160, [12, 60, 180, 500, 700, 900]),
  { index: 9, name: 'Estação SP', kind: 'station', price: 200, rent: 25 },
  lot(10, 'Paulista', 'orange', 180, [14, 70, 200, 550, 750, 950]),
  lot(11, 'Pinheiros', 'orange', 200, [16, 80, 220, 600, 800, 1000]),
  { index: 12, name: 'Parque', kind: 'park' },
  lot(13, 'Recife', 'red', 220, [18, 90, 250, 700, 875, 1050]),
  lot(14, 'Salvador', 'red', 240, [20, 100, 300, 750, 925, 1100]),
  { index: 15, name: 'Estação NE', kind: 'station', price: 200, rent: 25 },
  lot(16, 'Brasília', 'yellow', 260, [22, 110, 330, 800, 975, 1150]),
  lot(17, 'Savassi', 'yellow', 280, [24, 120, 360, 850, 1025, 1200]),
  { index: 18, name: 'Vá preso', kind: 'goto-jail' },
  lot(19, 'Batel', 'green', 300, [26, 130, 390, 900, 1100, 1275]),
  { index: 20, name: 'Estação Sul', kind: 'station', price: 200, rent: 25 },
  lot(21, 'Floripa', 'green', 320, [28, 150, 450, 1000, 1200, 1400]),
  { index: 22, name: 'IR', kind: 'tax', tax: 100 },
  lot(23, 'Moinhos', 'navy', 400, [50, 200, 600, 1400, 1700, 2000]),
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
