import { BOARD, getCell, getPropertyCellsByColorGroup } from '../board.ts';
import type { BoardCell, ColorGroup, ImobiliarioState } from '../types.ts';
import { HOTEL_LEVEL, MAX_HOUSES, STATION_RENTS } from '../types.ts';
import { getPlayer, pushLog } from './players.ts';

const HOUSE_COST_BY_GROUP: Record<ColorGroup, number> = {
  brown: 50,
  sky: 50,
  pink: 100,
  orange: 100,
  red: 150,
  yellow: 150,
  green: 200,
  navy: 200,
};

export function houseCost(cell: BoardCell): number {
  if (cell.colorGroup !== undefined) {
    return HOUSE_COST_BY_GROUP[cell.colorGroup];
  }
  return Math.floor((cell.price ?? 0) / 2);
}

export function isHotel(houses: number): boolean {
  return houses >= HOTEL_LEVEL;
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

export function rentOnProperty(
  cell: BoardCell,
  houses: number,
  monopoly: boolean,
): number {
  const levels = cell.rentLevels;
  const idx = Math.min(HOTEL_LEVEL, Math.max(0, houses));
  const amount = levels
    ? (levels[idx] ?? levels[0])
    : rentWithHouses(cell.rent ?? 0, Math.min(MAX_HOUSES, idx));
  if (idx === 0 && monopoly) {
    return amount * 2;
  }
  return amount;
}

export function stationRent(G: ImobiliarioState, ownerID: string): number {
  const owned = BOARD.filter(
    (cell) => cell.kind === 'station' && G.owners[cell.index] === ownerID,
  ).length;
  const bracket = Math.min(STATION_RENTS.length, Math.max(1, owned)) - 1;
  return STATION_RENTS[bracket] ?? STATION_RENTS[0];
}

export function rentForLanding(
  G: ImobiliarioState,
  cell: BoardCell,
  ownerID: string,
): number {
  if (cell.kind === 'station') {
    return stationRent(G, ownerID);
  }
  const houses = G.houses[cell.index] ?? 0;
  const monopoly =
    cell.colorGroup !== undefined && ownsMonopoly(G, ownerID, cell.colorGroup);
  return rentOnProperty(cell, houses, monopoly);
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
  if ((G.houses[cell.index] ?? 0) >= HOTEL_LEVEL) {
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
  const next = (G.houses[cell.index] ?? 0) + 1;
  G.houses[cell.index] = next;
  pushLog(G, {
    type: 'buy-house',
    playerID,
    cell: cell.index,
    hotel: isHotel(next),
  });
  return true;
}
