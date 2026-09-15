import { getCell, isPurchasable } from '../board.ts';
import {
  GO_TO_JAIL_INDEX,
  JAIL_INDEX,
  type ImobiliarioState,
  type TurnStage,
} from '../types.ts';
import { payRent, payToBank } from './economy.ts';
import { getPlayer, pushLog } from './players.ts';

export function sendToJail(
  G: ImobiliarioState,
  playerID: string,
  reason: 'goto' | 'doubles' = 'goto',
): void {
  const player = getPlayer(G, playerID);
  player.position = JAIL_INDEX;
  player.inJail = true;
  player.jailTurns = 0;
  G.pendingCell = null;
  G.consecutiveDoubles = 0;
  pushLog(G, { type: 'jail', playerID, reason });
}

export function resolveLanding(
  G: ImobiliarioState,
  playerID: string,
): TurnStage {
  const player = getPlayer(G, playerID);
  if (player.bankrupt) {
    G.pendingCell = null;
    return 'end';
  }

  const cell = getCell(player.position);
  G.pendingCell = player.position;

  if (cell.kind === 'goto-jail' || player.position === GO_TO_JAIL_INDEX) {
    sendToJail(G, playerID);
    return 'end';
  }

  if (cell.kind === 'tax') {
    const amount = cell.tax ?? 0;
    payToBank(G, playerID, amount);
    if (!getPlayer(G, playerID).bankrupt) {
      pushLog(G, { type: 'tax', playerID, amount });
    }
    G.pendingCell = null;
    return 'end';
  }

  if (isPurchasable(cell)) {
    const owner = G.owners[cell.index] ?? null;
    if (owner === null) {
      return 'buy';
    }
    if (owner !== playerID && !getPlayer(G, owner).bankrupt) {
      payRent(G, playerID, owner, cell.rent ?? 0, cell.index);
    }
    G.pendingCell = null;
    return 'end';
  }

  G.pendingCell = null;
  return 'end';
}
