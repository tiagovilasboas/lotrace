import type { BoardCell, ColorGroup } from './types.ts';
import { BOARD_SIZE } from './types.ts';

export const BOARD: BoardCell[] = [
  { index: 0, name: 'Partida', kind: 'go' },
  {
    index: 1,
    name: 'Leblon',
    kind: 'property',
    colorGroup: 'brown',
    price: 60,
    rent: 20,
  },
  { index: 2, name: 'IPTU', kind: 'tax', tax: 100 },
  {
    index: 3,
    name: 'Ipanema',
    kind: 'property',
    colorGroup: 'brown',
    price: 80,
    rent: 25,
  },
  { index: 4, name: 'Estação Rio', kind: 'station', price: 200, rent: 50 },
  {
    index: 5,
    name: 'Copacabana',
    kind: 'property',
    colorGroup: 'sky',
    price: 100,
    rent: 30,
  },
  { index: 6, name: 'Visita', kind: 'jail' },
  {
    index: 7,
    name: 'Jardins',
    kind: 'property',
    colorGroup: 'pink',
    price: 120,
    rent: 40,
  },
  {
    index: 8,
    name: 'Vila Madalena',
    kind: 'property',
    colorGroup: 'pink',
    price: 140,
    rent: 45,
  },
  { index: 9, name: 'Estação SP', kind: 'station', price: 200, rent: 50 },
  {
    index: 10,
    name: 'Paulista',
    kind: 'property',
    colorGroup: 'orange',
    price: 160,
    rent: 50,
  },
  {
    index: 11,
    name: 'Pinheiros',
    kind: 'property',
    colorGroup: 'orange',
    price: 180,
    rent: 55,
  },
  { index: 12, name: 'Parque', kind: 'park' },
  {
    index: 13,
    name: 'Recife',
    kind: 'property',
    colorGroup: 'red',
    price: 200,
    rent: 60,
  },
  {
    index: 14,
    name: 'Salvador',
    kind: 'property',
    colorGroup: 'red',
    price: 220,
    rent: 70,
  },
  { index: 15, name: 'Estação NE', kind: 'station', price: 200, rent: 50 },
  {
    index: 16,
    name: 'Brasília',
    kind: 'property',
    colorGroup: 'yellow',
    price: 240,
    rent: 80,
  },
  {
    index: 17,
    name: 'Savassi',
    kind: 'property',
    colorGroup: 'yellow',
    price: 260,
    rent: 85,
  },
  { index: 18, name: 'Vá preso', kind: 'goto-jail' },
  {
    index: 19,
    name: 'Batel',
    kind: 'property',
    colorGroup: 'green',
    price: 280,
    rent: 90,
  },
  { index: 20, name: 'Estação Sul', kind: 'station', price: 200, rent: 50 },
  {
    index: 21,
    name: 'Floripa',
    kind: 'property',
    colorGroup: 'green',
    price: 300,
    rent: 100,
  },
  { index: 22, name: 'IR', kind: 'tax', tax: 150 },
  {
    index: 23,
    name: 'Moinhos',
    kind: 'property',
    colorGroup: 'navy',
    price: 350,
    rent: 120,
  },
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
