import { Client } from 'boardgame.io/client';
import { MockRandom } from 'boardgame.io/testing';
import { describe, expect, it } from 'vitest';
import { getCell } from './board.ts';
import { Imobiliario } from './game.ts';
import { payRent, payToBank } from './rules/economy.ts';
import {
  applyBuyHouse,
  canBuyHouse,
  houseCost,
  rentWithHouses,
} from './rules/houses.ts';
import { resolveLanding } from './rules/landing.ts';
import { advancePosition, collectSalary } from './rules/movement.ts';
import { findWinner } from './rules/players.ts';
import {
  GO_SALARY,
  JAIL_INDEX,
  STARTING_CASH,
  type ImobiliarioState,
} from './types.ts';

function emptyState(): ImobiliarioState {
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
    houses: {},
    lastDice: null,
    pendingCell: null,
    consecutiveDoubles: 0,
    log: [],
  };
}

function createClient(
  d6Queue: number[],
  patch?: (G: ImobiliarioState) => void,
) {
  const queue = [...d6Queue];
  const client = Client<ImobiliarioState>({
    game: {
      ...Imobiliario,
      plugins: [
        MockRandom({
          D6: () => queue.shift() ?? 1,
        }),
      ],
      setup: (context: Parameters<NonNullable<typeof Imobiliario.setup>>[0]) => {
        const G = Imobiliario.setup!(context, { nicknames: ['Ana', 'Bia'] });
        patch?.(G);
        return G;
      },
    },
    numPlayers: 2,
  });
  client.start();
  return client;
}

function requireG(client: ReturnType<typeof createClient>): ImobiliarioState {
  const state = client.getState();
  if (!state) {
    throw new Error('Missing game state');
  }
  return state.G;
}

describe('move', () => {
  it('advances around the board without wrapping', () => {
    expect(advancePosition(0, 3)).toEqual({ position: 3, passedGo: false });
  });

  it('moves the current player after a 2d6 roll', () => {
    const client = createClient([1, 2]);
    client.moves.rollDice();
    const G = requireG(client);
    expect(G.players['0']?.position).toBe(3);
    expect(G.lastDice).toEqual({ die1: 1, die2: 2, total: 3 });
  });
});

describe('buy', () => {
  it('offers a purchase on an unowned property', () => {
    const G = emptyState();
    G.players['0']!.position = 3;
    expect(resolveLanding(G, '0')).toBe('buy');
    expect(G.pendingCell).toBe(3);
  });

  it('transfers cash and records ownership', () => {
    const client = createClient([1, 2]);
    client.moves.rollDice();
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('buy');
    client.moves.buyProperty();
    const G = requireG(client);
    const ipanema = getCell(3);
    expect(G.owners[3]).toBe('0');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - (ipanema.price ?? 0));
  });
});

describe('rent', () => {
  it('pays the owner when landing on an owned lot', () => {
    const G = emptyState();
    G.players['0']!.position = 3;
    G.owners[3] = '1';
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 25);
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 25);
  });
});

describe('pass-GO', () => {
  it('wraps past Partida and collects the salary', () => {
    const G = emptyState();
    G.players['0']!.position = 22;
    const moved = advancePosition(22, 4);
    expect(moved).toEqual({ position: 2, passedGo: true });
    G.players['0']!.position = moved.position;
    collectSalary(G, '0');
    expect(G.players['0']?.cash).toBe(STARTING_CASH + GO_SALARY);
    expect(G.log.some((event) => event.type === 'salary')).toBe(true);
  });
});

describe('bankruptcy', () => {
  it('bankrupts a player who cannot pay rent and returns properties to the bank', () => {
    const G = emptyState();
    G.players['0']!.cash = 10;
    G.owners[1] = '0';
    payRent(G, '0', '1', 25, 3);
    expect(G.players['0']?.bankrupt).toBe(true);
    expect(G.players['0']?.cash).toBe(0);
    expect(G.owners[1]).toBeNull();
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 10);
    expect(findWinner(G)).toBe('1');
  });

  it('bankrupts a player who cannot pay a tax', () => {
    const G = emptyState();
    G.players['0']!.cash = 40;
    payToBank(G, '0', 100);
    expect(G.players['0']?.bankrupt).toBe(true);
    expect(findWinner(G)).toBe('1');
  });
});

describe('doubles', () => {
  it('keeps the same player and allows another roll after doubles', () => {
    const client = createClient([6, 6, 1, 2]);
    client.moves.rollDice();
    expect(requireG(client).players['0']?.position).toBe(12);
    expect(requireG(client).consecutiveDoubles).toBe(1);
    expect(client.getState()?.ctx.currentPlayer).toBe('0');
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('end');

    client.moves.endTurn();
    expect(client.getState()?.ctx.currentPlayer).toBe('0');
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('roll');

    client.moves.rollDice();
    expect(requireG(client).players['0']?.position).toBe(15);
    expect(requireG(client).consecutiveDoubles).toBe(0);
    expect(client.getState()?.ctx.currentPlayer).toBe('0');
  });

  it('sends the player to jail on three consecutive doubles', () => {
    const client = createClient([1, 1, 2, 2, 3, 3]);
    client.moves.rollDice();
    client.moves.endTurn();
    client.moves.rollDice();
    client.moves.endTurn();
    expect(requireG(client).players['0']?.position).toBe(6);
    expect(requireG(client).consecutiveDoubles).toBe(2);

    client.moves.rollDice();
    const G = requireG(client);
    expect(G.players['0']?.inJail).toBe(true);
    expect(G.players['0']?.position).toBe(JAIL_INDEX);
    expect(G.consecutiveDoubles).toBe(0);
    expect(
      G.log.some((event) => event.type === 'jail' && event.reason === 'doubles'),
    ).toBe(true);
  });
});

describe('houses', () => {
  it('charges half the lot price, rounded down', () => {
    expect(houseCost(getCell(1))).toBe(30);
    expect(houseCost(getCell(3))).toBe(40);
  });

  it('scales rent from 1x to 5x the base rent', () => {
    expect(rentWithHouses(25, 0)).toBe(25);
    expect(rentWithHouses(25, 1)).toBe(50);
    expect(rentWithHouses(25, 2)).toBe(75);
    expect(rentWithHouses(25, 4)).toBe(125);
  });

  it('buys a house when the player owns the color-group monopoly', () => {
    const client = createClient([6, 6], (G) => {
      G.owners[1] = '0';
      G.owners[3] = '0';
    });
    client.moves.rollDice();
    const before = requireG(client).players['0']!.cash;
    client.moves.buyHouse(1);
    const G = requireG(client);
    expect(G.houses[1]).toBe(1);
    expect(G.players['0']?.cash).toBe(before - houseCost(getCell(1)));
    expect(
      G.log.some((event) => event.type === 'buy-house' && event.cell === 1),
    ).toBe(true);
  });

  it('rejects a house without a monopoly', () => {
    const G = emptyState();
    G.owners[1] = '0';
    expect(canBuyHouse(G, '0', 1)).toBe(false);
    expect(applyBuyHouse(G, '0', 1)).toBe(false);
    expect(G.houses[1] ?? 0).toBe(0);
  });

  it('increases rent when the landed property has houses', () => {
    const G = emptyState();
    G.players['0']!.position = 3;
    G.owners[3] = '1';
    G.houses[3] = 2;
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 75);
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 75);
  });

  it('requires even build across the color group', () => {
    const G = emptyState();
    G.owners[1] = '0';
    G.owners[3] = '0';
    expect(applyBuyHouse(G, '0', 1)).toBe(true);
    expect(canBuyHouse(G, '0', 1)).toBe(false);
    expect(canBuyHouse(G, '0', 3)).toBe(true);
  });

  it('clears houses when properties return to the bank', () => {
    const G = emptyState();
    G.players['0']!.cash = 10;
    G.owners[1] = '0';
    G.houses[1] = 3;
    payRent(G, '0', '1', 25, 3);
    expect(G.owners[1]).toBeNull();
    expect(G.houses[1] ?? 0).toBe(0);
  });
});
