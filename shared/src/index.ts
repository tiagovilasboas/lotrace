export { BOARD, getCell, getPropertyCellsByColorGroup, isPurchasable } from './board.ts';
export { Imobiliario } from './game.ts';
export {
  BOARD_SIZE,
  GAME_NAME,
  GO_SALARY,
  GO_TO_JAIL_INDEX,
  JAIL_FEE,
  JAIL_INDEX,
  JAIL_MAX_TURNS,
  MAX_CONSECUTIVE_DOUBLES,
  MAX_HOUSES,
  MAX_PLAYERS,
  MIN_PLAYERS,
  STARTING_CASH,
} from './types.ts';
export { canBuyHouse, houseCost } from './rules/houses.ts';
export type {
  BoardCell,
  CellKind,
  ColorGroup,
  DiceRoll,
  GameLogEvent,
  ImobiliarioSetupData,
  ImobiliarioState,
  PlayerState,
  RoomPlayerView,
  RoomStatus,
  RoomView,
  SessionPayload,
  TurnStage,
} from './types.ts';
