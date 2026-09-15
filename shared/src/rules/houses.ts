import { getCell, getPropertyCellsByColorGroup } from '../board.ts';
import type { BoardCell, ColorGroup, ImobiliarioState } from '../types.ts';
import { MAX_HOUSES } from '../types.ts';
import { getPlayer, pushLog } from './players.ts';

export function houseCost(cell: BoardCell): number {
  return Math.floor((cell.price ?? 0) / 2);
}

export function rentWithHouses(baseRent: number, houses: number): number {
  const clamped = Math.min(MAX_HOUSES, Math.max(0, houses));
  return baseRent * (clamped + 1);
}

export function ownsMonopoly(
  G: ImobiliarioState,
  playerID: string,
  colorGroup: ColorGroup,
): boolean {
  const cells = getPropertyCellsByColorGroup(colorGroup);
  if (cells.length === 0) {
    return false;
  }
  return cells.every((cell) => G.owners[cell.index] === playerID);
}

export function allowsEvenBuild(
  G: ImobiliarioState,
  cellIndex: number,
  colorGroup: ColorGroup,
): boolean {
  const targetHouses = G.houses[cellIndex] ?? 0;
  return getPropertyCellsByColorGroup(colorGroup).every(
    (cell) => (G.houses[cell.index] ?? 0) >= targetHouses,
  );
}

export function canBuyHouse(
  G: ImobiliarioState,
  playerID: string,
  cellIndex: number,
): boolean {
  const player = getPlayer(G, playerID);
  if (player.bankrupt || player.inJail) {
    return false;
  }

  const cell = getCell(cellIndex);
  if (cell.kind !== 'property' || cell.colorGroup === undefined) {
    return false;
  }
  if (G.owners[cell.index] !== playerID) {
    return false;
  }
  if ((G.houses[cell.index] ?? 0) >= MAX_HOUSES) {
    return false;
  }
  if (!ownsMonopoly(G, playerID, cell.colorGroup)) {
    return false;
  }
  if (!allowsEvenBuild(G, cell.index, cell.colorGroup)) {
    return false;
  }
  return player.cash >= houseCost(cell);
}

export function applyBuyHouse(
  G: ImobiliarioState,
  playerID: string,
  cellIndex: number,
): boolean {
  if (!canBuyHouse(G, playerID, cellIndex)) {
    return false;
  }
  const cell = getCell(cellIndex);
  const player = getPlayer(G, playerID);
  player.cash -= houseCost(cell);
  G.houses[cell.index] = (G.houses[cell.index] ?? 0) + 1;
  pushLog(G, { type: 'buy-house', playerID, cell: cell.index });
  return true;
}
