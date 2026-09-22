/**
 * Small colour helpers for shading the iso buildings.
 * Pure functions (no canvas/DOM) so they are unit-testable.
 *
 * A building face is the group's base colour lightened (top/lit face) or
 * darkened (side faces in shadow), which is what gives the SimCity BuildIt
 * sense of volume from a single base hue.
 */

export type Rgb = { r: number; g: number; b: number };

const clamp = (n: number): number => Math.max(0, Math.min(255, Math.round(n)));

/** Parse a #rrggbb / #rgb string to RGB. Falls back to mid-grey on garbage. */
export function parseHex(hex: string): Rgb {
  const h = hex.trim().replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (full.length !== 6) return { r: 136, g: 136, b: 136 };
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n)) return { r: 136, g: 136, b: 136 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function toRgba({ r, g, b }: Rgb, alpha = 1): string {
  return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${alpha})`;
}

/**
 * Shade a colour by a factor:
 *   amount > 0 lightens toward white, amount < 0 darkens toward black.
 * `amount` is in [-1, 1].
 */
export function shade(hex: string, amount: number): Rgb {
  const { r, g, b } = parseHex(hex);
  if (amount >= 0) {
    return {
      r: r + (255 - r) * amount,
      g: g + (255 - g) * amount,
      b: b + (255 - b) * amount,
    };
  }
  const k = 1 + amount; // amount is negative → k in [0,1]
  return { r: r * k, g: g * k, b: b * k };
}

/** Convenience: shaded colour as an rgba() string. */
export function shadeRgba(hex: string, amount: number, alpha = 1): string {
  return toRgba(shade(hex, amount), alpha);
}
