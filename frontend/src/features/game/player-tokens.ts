type TokenColor = {
  bg: string;
  fill: string;
  text: string;
};

const TOKEN_COLORS: readonly TokenColor[] = [
  { bg: 'bg-rose-500', fill: 'fill-rose-500', text: 'text-rose-500' },
  { bg: 'bg-emerald-500', fill: 'fill-emerald-500', text: 'text-emerald-500' },
  { bg: 'bg-amber-500', fill: 'fill-amber-500', text: 'text-amber-500' },
  { bg: 'bg-violet-500', fill: 'fill-violet-500', text: 'text-violet-500' },
  { bg: 'bg-cyan-500', fill: 'fill-cyan-500', text: 'text-cyan-500' },
  { bg: 'bg-fuchsia-500', fill: 'fill-fuchsia-500', text: 'text-fuchsia-500' },
];

function tokenColor(playerID: string): TokenColor {
  return TOKEN_COLORS[Number(playerID) % TOKEN_COLORS.length] ?? TOKEN_COLORS[0];
}

export function tokenClass(playerID: string): string {
  return tokenColor(playerID).bg;
}

export function tokenFillClass(playerID: string): string {
  return tokenColor(playerID).fill;
}

export function tokenTextClass(playerID: string): string {
  return tokenColor(playerID).text;
}
