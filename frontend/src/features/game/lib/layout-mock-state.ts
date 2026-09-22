import { JAIL_INDEX, STARTING_CASH, type ImobiliarioState } from '@lotrace/shared';

/**
 * Layout mock — a richly populated 4-player board for LAYOUT preview mode only.
 *
 * Purpose: validate every visual piece and icon at once without playing a
 * full match. It seeds an "advanced table" so the reviewer can see:
 *   - all four car colours parked on the four ring sides (S / W / N / E)
 *   - a player with many properties, a hotel and houses at several levels
 *   - players with medium and few holdings
 *   - owned stations (owner dots on the station stripe)
 *   - a player sitting in jail
 *   - the last-move pill and a non-empty log
 *
 * This is NOT used by real matches (online or normal local) — only the
 * LAYOUT code wires it into the game setup.
 *
 * Board indices (see shared/src/board.ts):
 *   props:    1,3 brown · 5 sky · 7,8 pink · 10,11 orange · 13,14 red
 *             16,17 yellow · 19,21 green · 23 navy
 *   stations: 4, 9, 15, 20
 *   corners:  0 go · 6 jail · 12 park · 18 goto-jail
 */
export function buildLayoutMockState(nicknames: readonly string[]): ImobiliarioState {
  const name = (seat: number, fallback: string): string => nicknames[seat] ?? fallback;

  const owners: ImobiliarioState['owners'] = {
    // ── Player 0: the advanced table (hotel + houses + monopolies) ──
    1: '0',  // Leblon        (brown monopoly)
    3: '0',  // Ipanema       (brown monopoly)
    7: '0',  // Jardins       (pink monopoly)
    8: '0',  // Vila Madalena (pink monopoly)
    10: '0', // Paulista      (orange)
    4: '0',  // Estação Rio
    9: '0',  // Estação SP

    // ── Player 1: medium (a red monopoly + premium + station) ──
    13: '1', // Recife   (red monopoly)
    14: '1', // Salvador (red monopoly)
    23: '1', // Moinhos  (navy, premium)
    20: '1', // Estação Sul

    // ── Player 2: few holdings ──
    5: '2',  // Copacabana (sky)
    11: '2', // Pinheiros  (orange)

    // ── Player 3: a single station (and stuck in jail below) ──
    15: '3', // Estação NE
  };

  const houses: ImobiliarioState['houses'] = {
    1: 5,  // Leblon        → HOTEL
    3: 4,  // Ipanema       → 4 houses
    7: 3,  // Jardins       → 3 houses
    8: 2,  // Vila Madalena → 2 houses
    10: 1, // Paulista      → 1 house
    13: 2, // Recife        → 2 houses
    14: 3, // Salvador      → 3 houses
  };

  return {
    players: {
      '0': {
        id: '0',
        nickname: name(0, 'Você'),
        cash: STARTING_CASH - 1_240_000,
        position: 3, // Ipanema — south side
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      },
      '1': {
        id: '1',
        nickname: name(1, 'Mesa'),
        cash: STARTING_CASH - 620_000,
        position: 8, // Vila Madalena — west side
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      },
      '2': {
        id: '2',
        nickname: name(2, 'Jogador 3'),
        cash: STARTING_CASH - 210_000,
        position: 16, // Brasília — north side
        inJail: false,
        jailTurns: 0,
        bankrupt: false,
      },
      '3': {
        id: '3',
        nickname: name(3, 'Jogador 4'),
        cash: STARTING_CASH - 100_000,
        position: JAIL_INDEX, // in jail — validates the jail state
        inJail: true,
        jailTurns: 1,
        bankrupt: false,
      },
    },
    owners,
    houses,
    lastDice: { die1: 4, die2: 3, total: 7 },
    pendingCell: null,
    consecutiveDoubles: 0,
    log: [
      { type: 'buy-house', playerID: '0', cell: 1, hotel: true },
      { type: 'buy-house', playerID: '0', cell: 3 },
      { type: 'rent', playerID: '2', ownerID: '0', amount: 260_000, cell: 3 },
      { type: 'jail', playerID: '3', reason: 'goto' },
      { type: 'move', playerID: '0', from: 23, to: 3, passedGo: true },
    ],
  };
}
