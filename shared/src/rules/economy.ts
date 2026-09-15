import type { ImobiliarioState } from '../types.ts';
import { getPlayer, pushLog } from './players.ts';

export function returnPropertiesToBank(
  G: ImobiliarioState,
  playerID: string,
): void {
  for (const [index, owner] of Object.entries(G.owners)) {
    if (owner === playerID) {
      const cellIndex = Number(index);
      G.owners[cellIndex] = null;
      G.houses[cellIndex] = 0;
    }
  }
}

export function declareBankrupt(G: ImobiliarioState, playerID: string): void {
  const player = getPlayer(G, playerID);
  player.cash = 0;
  player.bankrupt = true;
  player.inJail = false;
  player.jailTurns = 0;
  returnPropertiesToBank(G, playerID);
  pushLog(G, { type: 'bankrupt', playerID });
}

export function payToBank(
  G: ImobiliarioState,
  playerID: string,
  amount: number,
): void {
  const player = getPlayer(G, playerID);
  if (player.cash >= amount) {
    player.cash -= amount;
    return;
  }
  declareBankrupt(G, playerID);
}

export function payRent(
  G: ImobiliarioState,
  fromID: string,
  toID: string,
  amount: number,
  cell: number,
): void {
  const from = getPlayer(G, fromID);
  const to = getPlayer(G, toID);
  if (from.cash >= amount) {
    from.cash -= amount;
    to.cash += amount;
    pushLog(G, { type: 'rent', playerID: fromID, ownerID: toID, amount, cell });
    return;
  }
  to.cash += from.cash;
  pushLog(G, {
    type: 'rent',
    playerID: fromID,
    ownerID: toID,
    amount: from.cash,
    cell,
  });
  declareBankrupt(G, fromID);
}
