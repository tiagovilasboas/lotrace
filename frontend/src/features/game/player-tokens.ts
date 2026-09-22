/**
 * Player token colours — single source of truth.
 *
 * Colours map to CSS vars defined in design-system/tokens/game.css (--car-0…--car-5),
 * which are set from the spec in primitives.css.
 *
 * Rule: nothing outside this file should hardcode a player colour.
 * Use tokenCssVar() for SVG fill/stroke, tokenBgStyle() for DOM background.
 */

/** Number of distinct player colours */
const PLAYER_COLOR_COUNT = 6;

/** Returns the CSS variable for a player's colour, e.g. "var(--car-0)" */
export function tokenCssVar(playerID: string): string {
  const index = Number(playerID) % PLAYER_COLOR_COUNT;
  return `var(--car-${index})`;
}

/**
 * Returns an inline style object with backgroundColor set to the player's token colour.
 * Use for DOM elements (div, span) — avoids Tailwind purge issues with dynamic class names.
 */
export function tokenBgStyle(playerID: string): { backgroundColor: string } {
  return { backgroundColor: tokenCssVar(playerID) };
}

// ---------------------------------------------------------------------------
// Legacy shims — kept so existing callers compile without mass-refactor.
// These should be migrated to tokenCssVar() / tokenBgStyle() over time.
// ---------------------------------------------------------------------------

/** @deprecated Use tokenBgStyle() for DOM or tokenCssVar() for SVG fill. */
export function tokenClass(_playerID: string): string {
  // Returns empty string — callers must migrate to tokenBgStyle().
  return '';
}

/** @deprecated Use tokenCssVar() directly. */
export function tokenFillClass(_playerID: string): string {
  return '';
}

/** @deprecated Use tokenCssVar() directly on SVG fill attribute. */
export function tokenTextClass(_playerID: string): string {
  return '';
}
