import type { ImobiliarioState, PlayerState } from '../types.ts';
import { MAX_CONSECUTIVE_DOUBLES } from '../types.ts';
import { getPlayer } from './players.ts';

export function registerRollDoubles(
  G: ImobiliarioState,
  die1: number,
  die2: number,
): boolean {
  if (die1 === die2) {
    G.consecutiveDoubles += 1;
  } else {
    G.consecutiveDoubles = 0;
  }
  return G.consecutiveDoubles >= MAX_CONSECUTIVE_DOUBLES;
}

export function shouldGrantExtraRoll(
  G: ImobiliarioState,
  playerID: string,
): boolean {
  const player: PlayerState = getPlayer(G, playerID);
  return G.consecutiveDoubles > 0 && !player.inJail && !player.bankrupt;
}
