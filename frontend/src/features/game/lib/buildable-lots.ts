import {
  BOARD,
  canBuyHouse,
  houseCost,
  isHotel,
  type ImobiliarioState,
} from '@lotrace/shared';

export type BuildableLot = {
  index: number;
  name: string;
  cost: number;
  hotel: boolean;
};

export function listBuildableLots(
  G: ImobiliarioState,
  playerID: string,
): BuildableLot[] {
  return BOARD.filter((cell) => canBuyHouse(G, playerID, cell.index)).map(
    (cell) => ({
      index: cell.index,
      name: cell.name,
      cost: houseCost(cell),
      hotel: isHotel((G.houses[cell.index] ?? 0) + 1),
    }),
  );
}
