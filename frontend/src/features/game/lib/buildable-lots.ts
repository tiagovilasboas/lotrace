import {
  BOARD,
  canBuyHouse,
  houseCost,
  type ImobiliarioState,
} from '@lotrace/shared';

export type BuildableLot = {
  index: number;
  name: string;
  cost: number;
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
    }),
  );
}
