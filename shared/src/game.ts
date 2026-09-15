import type { Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { BOARD, getCell, isPurchasable } from './board.ts';
import { registerRollDoubles, shouldGrantExtraRoll } from './rules/doubles.ts';
import { payToBank } from './rules/economy.ts';
import { applyBuyHouse, canBuyHouse } from './rules/houses.ts';
import { resolveLanding, sendToJail } from './rules/landing.ts';
import { advancePosition, collectSalary } from './rules/movement.ts';
import { findWinner, getPlayer, pushLog } from './rules/players.ts';
import {
  GAME_NAME,
  JAIL_FEE,
  JAIL_WAIT_TURNS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  STARTING_CASH,
  type ImobiliarioSetupData,
  type ImobiliarioState,
  type TurnStage,
} from './types.ts';

function createInitialState(
  numPlayers: number,
  setupData: ImobiliarioSetupData | undefined,
): ImobiliarioState {
  const players: ImobiliarioState['players'] = {};
  const owners: ImobiliarioState['owners'] = {};
  const nicknames = setupData?.nicknames ?? [];

  for (let seat = 0; seat < numPlayers; seat += 1) {
    const id = String(seat);
    players[id] = {
      id,
      nickname: nicknames[seat] ?? `Jogador ${seat + 1}`,
      cash: STARTING_CASH,
      position: 0,
      inJail: false,
      jailTurns: 0,
      bankrupt: false,
    };
  }

  return {
    players,
    owners,
    houses: {},
    lastDice: null,
    pendingCell: null,
    consecutiveDoubles: 0,
    log: [],
  };
}

type TurnEvents = {
  setActivePlayers: (arg: { currentPlayer: { stage: TurnStage } }) => void;
  endTurn: () => void;
};

function setStage(events: TurnEvents, stage: TurnStage): void {
  events.setActivePlayers({ currentPlayer: { stage } });
}

function hasHouseChoice(G: ImobiliarioState, playerID: string): boolean {
  return BOARD.some((cell) => canBuyHouse(G, playerID, cell.index));
}

function continueAfterAction(
  G: ImobiliarioState,
  playerID: string,
  events: TurnEvents,
): void {
  if (hasHouseChoice(G, playerID)) {
    setStage(events, 'end');
    return;
  }
  if (shouldGrantExtraRoll(G, playerID)) {
    setStage(events, 'roll');
    return;
  }
  events.endTurn();
}

function applyLanding(
  G: ImobiliarioState,
  playerID: string,
  events: TurnEvents,
): void {
  const stage = resolveLanding(G, playerID);
  if (stage === 'end') {
    continueAfterAction(G, playerID, events);
    return;
  }
  setStage(events, stage);
}

function moveAfterDice(
  G: ImobiliarioState,
  playerID: string,
  total: number,
  events: TurnEvents,
): void {
  const player = getPlayer(G, playerID);
  const from = player.position;
  const moved = advancePosition(from, total);
  player.position = moved.position;
  if (moved.passedGo) {
    collectSalary(G, playerID);
  }
  pushLog(G, {
    type: 'move',
    playerID,
    from,
    to: moved.position,
    passedGo: moved.passedGo,
  });
  applyLanding(G, playerID, events);
}

export const Imobiliario: Game<
  ImobiliarioState,
  Record<string, unknown>,
  ImobiliarioSetupData
> = {
  name: GAME_NAME,
  minPlayers: MIN_PLAYERS,
  maxPlayers: MAX_PLAYERS,
  disableUndo: true,
  setup: ({ ctx }, setupData) =>
    createInitialState(ctx.numPlayers, setupData),
  endIf: ({ G }) => {
    const winner = findWinner(G);
    if (winner) {
      return { winner };
    }
    return undefined;
  },
  turn: {
    onBegin: ({ G, ctx, events }) => {
      G.consecutiveDoubles = 0;
      const player = getPlayer(G, ctx.currentPlayer);
      if (player.bankrupt) {
        events.endTurn();
        return;
      }
      if (player.inJail) {
        if (player.jailTurns >= JAIL_WAIT_TURNS) {
          player.inJail = false;
          player.jailTurns = 0;
          G.consecutiveDoubles = 0;
          pushLog(G, {
            type: 'jail',
            playerID: ctx.currentPlayer,
            reason: 'free',
          });
          setStage(events, 'roll');
          return;
        }
        setStage(events, 'jail');
        return;
      }
      setStage(events, 'roll');
    },
    order: {
      first: () => 0,
      next: ({ G, ctx }) => {
        const count = ctx.playOrder.length;
        for (let step = 1; step <= count; step += 1) {
          const pos = (ctx.playOrderPos + step) % count;
          const id = ctx.playOrder[pos];
          if (id && !G.players[id]?.bankrupt) {
            return pos;
          }
        }
        return undefined;
      },
    },
    stages: {
      roll: {
        moves: {
          rollDice: {
            move: ({ G, ctx, random, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              const player = getPlayer(G, playerID);
              if (player.bankrupt || player.inJail) {
                return INVALID_MOVE;
              }
              const die1 = random.D6();
              const die2 = random.D6();
              const total = die1 + die2;
              G.lastDice = { die1, die2, total };
              pushLog(G, { type: 'roll', playerID, die1, die2 });

              if (registerRollDoubles(G, die1, die2)) {
                sendToJail(G, playerID, 'doubles');
                continueAfterAction(G, playerID, events);
                return undefined;
              }

              moveAfterDice(G, playerID, total, events);
              return undefined;
            },
            client: false,
            undoable: false,
          },
        },
      },
      jail: {
        moves: {
          payJail: {
            move: ({ G, ctx, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              const player = getPlayer(G, playerID);
              if (!player.inJail || player.cash < JAIL_FEE) {
                return INVALID_MOVE;
              }
              payToBank(G, playerID, JAIL_FEE);
              player.inJail = false;
              player.jailTurns = 0;
              G.consecutiveDoubles = 0;
              pushLog(G, { type: 'jail', playerID, reason: 'pay' });
              setStage(events, 'roll');
              return undefined;
            },
            client: false,
          },
          waitJail: {
            move: ({ G, ctx, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              const player = getPlayer(G, playerID);
              if (!player.inJail || player.bankrupt) {
                return INVALID_MOVE;
              }
              player.jailTurns += 1;
              pushLog(G, { type: 'jail', playerID, reason: 'wait' });
              events.endTurn();
              return undefined;
            },
            client: false,
          },
        },
      },
      buy: {
        moves: {
          buyProperty: {
            move: ({ G, ctx, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              const cellIndex = G.pendingCell;
              if (cellIndex === null) {
                return INVALID_MOVE;
              }
              const cell = getCell(cellIndex);
              const player = getPlayer(G, playerID);
              if (
                !isPurchasable(cell) ||
                G.owners[cell.index] ||
                cell.price === undefined ||
                player.cash < cell.price
              ) {
                return INVALID_MOVE;
              }
              player.cash -= cell.price;
              G.owners[cell.index] = playerID;
              G.pendingCell = null;
              pushLog(G, { type: 'buy', playerID, cell: cell.index });
              continueAfterAction(G, playerID, events);
              return undefined;
            },
            client: false,
          },
          skipBuy: {
            move: ({ G, ctx, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              if (G.pendingCell === null) {
                return INVALID_MOVE;
              }
              pushLog(G, {
                type: 'skip-buy',
                playerID,
                cell: G.pendingCell,
              });
              G.pendingCell = null;
              continueAfterAction(G, playerID, events);
              return undefined;
            },
            client: false,
          },
        },
      },
      end: {
        moves: {
          buyHouse: {
            move: ({ G, ctx, events, playerID }, cellIndex: unknown) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              if (typeof cellIndex !== 'number' || !Number.isInteger(cellIndex)) {
                return INVALID_MOVE;
              }
              if (!applyBuyHouse(G, playerID, cellIndex)) {
                return INVALID_MOVE;
              }
              continueAfterAction(G, playerID, events);
              return undefined;
            },
            client: false,
          },
          endTurn: {
            move: ({ G, ctx, events, playerID }) => {
              if (playerID !== ctx.currentPlayer) {
                return INVALID_MOVE;
              }
              if (shouldGrantExtraRoll(G, playerID)) {
                setStage(events, 'roll');
                return undefined;
              }
              events.endTurn();
              return undefined;
            },
            client: false,
          },
        },
      },
    },
  },
};
