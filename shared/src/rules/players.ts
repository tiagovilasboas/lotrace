import type { GameLogEvent, ImobiliarioState, PlayerState } from '../types.ts';
import { MAX_LOG } from '../types.ts';

export function pushLog(G: ImobiliarioState, event: GameLogEvent): void {
  G.log.push(event);
  if (G.log.length > MAX_LOG) {
    G.log.splice(0, G.log.length - MAX_LOG);
  }
}

export function getPlayer(G: ImobiliarioState, playerID: string): PlayerState {
  const player = G.players[playerID];
  if (!player) {
    throw new Error(`Unknown player ${playerID}`);
  }
  return player;
}

export function solventPlayers(G: ImobiliarioState): PlayerState[] {
  return Object.values(G.players).filter((player) => !player.bankrupt);
}

export function findWinner(G: ImobiliarioState): string | undefined {
  const alive = solventPlayers(G);
  if (alive.length === 1) {
    return alive[0].id;
  }
  return undefined;
}
