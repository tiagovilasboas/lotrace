import { Color } from 'three';

/** Car token colours — mirrors game.css --car-0…--car-5 */
const CAR_HEX = [
  '#FF5964', // 0 red
  '#53DC9E', // 1 green
  '#F5C64B', // 2 yellow
  '#A98AFF', // 3 purple
  '#55D8FF', // 4 cyan
  '#FF9D38', // 5 orange
] as const;

export function carColor(playerID: string): Color {
  const hex = CAR_HEX[Number(playerID) % CAR_HEX.length] ?? CAR_HEX[0];
  return new Color(hex);
}

export function carHex(playerID: string): string {
  return CAR_HEX[Number(playerID) % CAR_HEX.length] ?? CAR_HEX[0];
}
