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
  rentOnProperty,
  stationRent,
} from './rules/houses.ts';
import { resolveLanding } from './rules/landing.ts';
import { advancePosition, collectSalary } from './rules/movement.ts';
import { findWinner } from './rules/players.ts';
import {
  GO_SALARY,
  JAIL_FEE,
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
    expect(client.getState()?.ctx.currentPlayer).toBe('1');
  });
});

describe('rent', () => {
  it('pays unimproved rent when landing on an owned lot', () => {
    const G = emptyState();
    G.players['0']!.position = 3;
    G.owners[3] = '1';
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 4);
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 4);
  });

  it('doubles unimproved rent on a color-group monopoly', () => {
    const G = emptyState();
    G.players['0']!.position = 3;
    G.owners[1] = '1';
    G.owners[3] = '1';
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 8);
  });

  it('scales station rent with how many stations the owner holds', () => {
    const G = emptyState();
    G.owners[4] = '1';
    G.owners[9] = '1';
    expect(stationRent(G, '1')).toBe(50);
    G.players['0']!.position = 4;
    expect(resolveLanding(G, '0')).toBe('end');
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 50);
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

describe('turn flow', () => {
  it('passes the turn automatically when landing has no choices', () => {
    const client = createClient([4, 2]);
    client.moves.rollDice();
    expect(requireG(client).players['0']?.position).toBe(6);
    expect(client.getState()?.ctx.currentPlayer).toBe('1');
  });

  it('ends the turn automatically after paying rent with no house choice', () => {
    const client = createClient([1, 2], (G) => {
      G.owners[3] = '1';
    });
    client.moves.rollDice();
    expect(requireG(client).players['0']?.position).toBe(3);
    expect(client.getState()?.ctx.currentPlayer).toBe('1');
  });
});

describe('doubles', () => {
  it('keeps the same player and allows another roll after doubles', () => {
    const client = createClient([6, 6, 1, 2]);
    client.moves.rollDice();
    expect(requireG(client).players['0']?.position).toBe(12);
    expect(requireG(client).consecutiveDoubles).toBe(1);
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
    client.moves.rollDice();
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

describe('jail', () => {
  it('leaves jail and moves when rolling doubles, without an extra turn', () => {
    const client = createClient([4, 4], (G) => {
      G.players['0']!.inJail = true;
      G.players['0']!.position = JAIL_INDEX;
    });
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('jail');
    client.moves.rollDice();
    const G = requireG(client);
    expect(G.players['0']?.inJail).toBe(false);
    expect(G.players['0']?.position).toBe(14);
    expect(G.consecutiveDoubles).toBe(0);
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('buy');
  });

  it('stays in jail after a failed roll and forces pay plus move on the third try', () => {
    const client = createClient([1, 2, 1, 3, 2, 3], (G) => {
      G.players['0']!.inJail = true;
      G.players['0']!.position = JAIL_INDEX;
    });
    client.moves.rollDice();
    expect(requireG(client).players['0']?.inJail).toBe(true);
    expect(requireG(client).players['0']?.jailTurns).toBe(1);
    expect(client.getState()?.ctx.currentPlayer).toBe('1');

    const second = createClient([2, 3], (G) => {
      G.players['0']!.inJail = true;
      G.players['0']!.jailTurns = 2;
      G.players['0']!.position = JAIL_INDEX;
    });
    const before = requireG(second).players['0']!.cash;
    second.moves.rollDice();
    const G = requireG(second);
    expect(G.players['0']?.inJail).toBe(false);
    expect(G.players['0']?.cash).toBe(before - JAIL_FEE);
    expect(G.players['0']?.position).toBe(11);
  });
});

describe('houses', () => {
  it('charges house cost by color-group band', () => {
    expect(houseCost(getCell(1))).toBe(50);
    expect(houseCost(getCell(3))).toBe(50);
    expect(houseCost(getCell(21))).toBe(200);
  });

  it('uses a steep rent ladder and hotel', () => {
    const ipanema = getCell(3);
    expect(rentOnProperty(ipanema, 0, false)).toBe(4);
    expect(rentOnProperty(ipanema, 1, false)).toBe(20);
    expect(rentOnProperty(ipanema, 2, false)).toBe(60);
    expect(rentOnProperty(ipanema, 4, false)).toBe(320);
    expect(rentOnProperty(ipanema, 5, false)).toBe(450);
  });

  it('buys a house when the player owns the color-group monopoly', () => {
    const client = createClient([6, 6], (G) => {
      G.owners[1] = '0';
      G.owners[3] = '0';
    });
    client.moves.rollDice();
    expect(client.getState()?.ctx.activePlayers?.['0']).toBe('end');
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
    expect(G.players['0']?.cash).toBe(STARTING_CASH - 60);
    expect(G.players['1']?.cash).toBe(STARTING_CASH + 60);
  });

  it('requires even build across the color group', () => {
    const G = emptyState();
    G.owners[1] = '0';
    G.owners[3] = '0';
    expect(applyBuyHouse(G, '0', 1)).toBe(true);
    expect(canBuyHouse(G, '0', 1)).toBe(false);
    expect(canBuyHouse(G, '0', 3)).toBe(true);
  });

  it('upgrades four houses into a hotel', () => {
    const G = emptyState();
    G.owners[1] = '0';
    G.owners[3] = '0';
    G.houses[1] = 4;
    G.houses[3] = 4;
    expect(applyBuyHouse(G, '0', 1)).toBe(true);
    expect(G.houses[1]).toBe(5);
    expect(canBuyHouse(G, '0', 1)).toBe(false);
    expect(
      G.log.some((event) => event.type === 'buy-house' && event.hotel === true),
    ).toBe(true);
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
