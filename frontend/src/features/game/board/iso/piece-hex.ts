/**
 * Player car colours resolved to concrete hex for the canvas (canvas can't
 * read CSS vars). Mirrors --car-0..5 from the design tokens; resolved at
 * runtime so the tokens stay the single source of truth.
 */
const PLAYER_COLOR_COUNT = 6;

/** Fallbacks match game.css --car-0..5 if a var can't be read. */
const FALLBACK = ['#FF5964', '#53DC9E', '#F5C64B', '#A98AFF', '#55D8FF', '#FF9D38'];

export function carHexForCanvas(
  playerID: string,
  root: HTMLElement = document.documentElement,
): string {
  const index = Number(playerID) % PLAYER_COLOR_COUNT;
  const value = getComputedStyle(root).getPropertyValue(`--car-${index}`).trim();
  return value.length > 0 ? value : (FALLBACK[index] ?? FALLBACK[0]);
}
