import { describe, expect, it } from 'vitest';
import { Client } from 'boardgame.io/client';
import { BOARD, isPurchasable } from './board.ts';
import { Imobiliario } from './game.ts';
import { declareBankrupt, payRent, payToBank } from './rules/economy.ts';
import { resolveLanding } from './rules/landing.ts';
import { advancePosition } from './rules/movement.ts';
import { findWinner } from './rules/players.ts';
import {
  BOARD_SIZE,
  GO_SALARY,
  JAIL_INDEX,
  STARTING_CASH,
  type ImobiliarioState,
} from './types.ts';

function emptyState(overrides?: Partial<ImobiliarioState>): ImobiliarioState {
  return {
    players: {
      '0': {
        id: '0',
        nickname: 'Ana',
        cash: STARTING_CASH,
        position: 0,
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      },
      '1': {
        id: '1',
        nickname: 'Bia',
        cash: STARTING_CASH,
        position: 0,
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      },
    },
    owners: {},
    lastDice: null,
    pendingCell: null,
    log: [],
    ...overrides,
  };
}

describe('board', () => {
  it('has 24 unique cells with Brazilian-flavored names', () => {
    expect(BOARD).toHaveLength(BOARD_SIZE);
    expect(BOARD[0]?.kind).toBe('go');
    expect(BOARD.some((cell) => cell.name === 'Leblon')).toBe(true);
    expect(BOARD.filter(isPurchasable).length).toBeGreaterThan(10);
  });
});

describe('movement', () => {
  it('wraps around Partida and flags salary', () => {
    expect(advancePosition(22, 4)).toEqual({ position: 2, passedGo: true });
    expect(advancePosition(3, 2)).toEqual({ position: 5, passedGo: false });
  });
});

describe('economy', () => {
  it('pays rent when the guest can afford it', () => {
    const G = emptyState();
    payRent(G, '0', '1', 100, 1);
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 100);
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 100);
  });

  it('bankrupts a player who cannot pay and returns properties', () => {
    const G = emptyState();
    G.players['0']!.cash = 30;
    G.owners[1] = '0';
    payToBank(G, '0', 100);
    expect(G.players['0']?.bankrupt).toBe(true);
    expect(G.owners[1]).toBeNull();
  });

  it('declares a winner when one player remains solvent', () => {
    const G = emptyState();
    declareBankrupt(G, '1');
    expect(findWinner(G)).toBe('0');
  });
});

describe('landing', () => {
  it('offers a buy on an unowned property', () => {
    const G = emptyState();
    G.players['0']!.position = 1;
    expect(resolveLanding(G, '0')).toBe('buy');
    expect(G.pendingCell).toBe(1);
  });

  it('sends the player to jail on Vá preso', () => {
    const G = emptyState();
    G.players['0']!.position = 18;
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.position).toBe(JAIL_INDEX);
    expect(G.players['0']?.inJail).toBe(true);
  });
});

describe('Imobiliario game', () => {
  it('starts with starting cash and lets player 0 roll then end the turn', () => {
    const game = {
      ...Imobiliario,
      setup: (
        context: Parameters<NonNullable<typeof Imobiliario.setup>>[0],
      ) => Imobiliario.setup!(context, { nicknames: ['Ana', 'Bia'] }),
    };
    const client = Client({
      game,
      numPlayers: 2,
    });
    client.start();
    const first = client.getState();
    expect(first?.G.players['0']?.cash).toBe(STARTING_CASH);
    expect(first?.G.players['0']?.nickname).toBe('Ana');

    client.moves.rollDice();
    const afterRoll = client.getState();
    expect(afterRoll?.G.lastDice?.total).toBeGreaterThanOrEqual(2);
    expect(afterRoll?.G.lastDice?.total).toBeLessThanOrEqual(12);

    const stage = afterRoll?.ctx.activePlayers?.['0'];
    if (stage === 'buy') {
      client.moves.skipBuy();
    }
    client.moves.endTurn();
    const afterTurn = client.getState();
    expect(afterTurn?.ctx.currentPlayer).toBe('1');
    if (afterRoll?.G.log.some((event) => event.type === 'salary')) {
      expect(afterRoll.G.players['0']?.cash).toBeGreaterThanOrEqual(
        STARTING_CASH + GO_SALARY - 150,
      );
    }
  });
});
