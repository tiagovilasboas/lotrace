export type CellKind =
  | 'go'
  | 'property'
  | 'station'
  | 'tax'
  | 'jail'
  | 'goto-jail'
  | 'park';

export type ColorGroup =
  | 'brown'
  | 'sky'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'navy';

/** Unimproved, 1–4 houses, hotel. */
export type RentLadder = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
];

export type BoardCell = {
  index: number;
  name: string;
  kind: CellKind;
  colorGroup?: ColorGroup;
  price?: number;
  rent?: number;
  rentLevels?: RentLadder;
  tax?: number;
};

export type PlayerState = {
  id: string;
  nickname: string;
  cash: number;
  position: number;
  inJail: boolean;
  jailTurns: number;
  bankrupt: boolean;
};

export type DiceRoll = {
  die1: number;
  die2: number;
  total: number;
};

export type GameLogEvent =
  | { type: 'roll'; playerID: string; die1: number; die2: number }
  | {
      type: 'move';
      playerID: string;
      from: number;
      to: number;
      passedGo: boolean;
    }
  | { type: 'buy'; playerID: string; cell: number }
  | { type: 'buy-house'; playerID: string; cell: number; hotel?: boolean }
  | { type: 'skip-buy'; playerID: string; cell: number }
  | {
      type: 'rent';
      playerID: string;
      ownerID: string;
      amount: number;
      cell: number;
    }
  | { type: 'tax'; playerID: string; amount: number }
  | { type: 'salary'; playerID: string; amount: number }
  | {
      type: 'jail';
      playerID: string;
      reason: 'goto' | 'pay' | 'wait' | 'free' | 'doubles';
    }
  | { type: 'bankrupt'; playerID: string };

export type TurnStage = 'roll' | 'jail' | 'buy' | 'end';

export type ImobiliarioState = {
  players: Record<string, PlayerState>;
  owners: Record<number, string | null>;
  houses: Record<number, number>;
  lastDice: DiceRoll | null;
  pendingCell: number | null;
  consecutiveDoubles: number;
  log: GameLogEvent[];
};

export type ImobiliarioSetupData = {
  nicknames: string[];
};

export type RoomStatus = 'lobby' | 'playing';

export type RoomPlayerView = {
  seat: number;
  nickname: string;
  isHost: boolean;
};

export type RoomView = {
  code: string;
  status: RoomStatus;
  players: RoomPlayerView[];
  matchID: string | null;
  minPlayers: number;
  maxPlayers: number;
};

export type SessionPayload = {
  code: string;
  token: string;
  playerID: string;
  nickname: string;
  isHost: boolean;
  credentials: string | null;
  matchID: string | null;
};

export const GAME_NAME = 'lotrace';
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;
export const BOARD_SIZE = 24;

/**
 * Economy constants — "millionaire" scale.
 *
 * STARTING_CASH = R$3.000.000 so the early game feels liquid and aggressive:
 * a player can buy several assets without hitting a cash crunch right away.
 * Property prices stay accessible (R$80k–R$700k) so the vibe is
 * "race to build a portfolio", not "survive and manage cash".
 */
export const GO_SALARY = 120_000;
export const STARTING_CASH = 3_000_000;
export const JAIL_FEE = 100_000;
export const JAIL_WAIT_TURNS = 2;
export const JAIL_INDEX = 6;
export const GO_TO_JAIL_INDEX = 18;
export const MAX_CONSECUTIVE_DOUBLES = 3;
export const MAX_HOUSES = 4;
export const HOTEL_LEVEL = 5;
export const MAX_LOG = 20;

/**
 * Station rents scale with number of stations owned by the same player.
 * 1 station = R$100k, 4 stations = R$800k (8x multiplier, same as Monopoly).
 */
export const STATION_RENTS = [100_000, 200_000, 400_000, 800_000] as const;
