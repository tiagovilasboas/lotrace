import { BOARD_SIZE, GO_SALARY } from '../types.ts';
import type { ImobiliarioState } from '../types.ts';
import { getPlayer, pushLog } from './players.ts';

export function advancePosition(
  position: number,
  steps: number,
  boardSize: number = BOARD_SIZE,
): { position: number; passedGo: boolean } {
  const next = (position + steps) % boardSize;
  const passedGo = position + steps >= boardSize;
  return { position: next, passedGo };
}

export function collectSalary(G: ImobiliarioState, playerID: string): void {
  const player = getPlayer(G, playerID);
  player.cash += GO_SALARY;
  pushLog(G, { type: 'salary', playerID, amount: GO_SALARY });
}
