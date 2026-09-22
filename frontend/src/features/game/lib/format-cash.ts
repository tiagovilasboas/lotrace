export function formatCash(amount: number): string {
  return `R$ ${amount.toLocaleString('pt-BR')}`;
}

/**
 * Compact currency for tight spots (board tiles, header chips) where the
 * full value would overflow. Keeps one decimal for millions.
 *   1_760_000 -> "R$ 1,76M"   340_000 -> "R$ 340k"   80_000 -> "R$ 80k"
 *   950       -> "R$ 950"
 */
export function formatCashCompact(amount: number): string {
  return `R$ ${formatCashShort(amount)}`;
}

/**
 * Currency without the "R$ " prefix, for very tight spots (player strip)
 * where the context already reads as money.
 *   1_760_000 -> "1,76M"   340_000 -> "340k"   950 -> "950"
 */
export function formatCashShort(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000) {
    const millions = abs / 1_000_000;
    const text = millions.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: millions >= 10 ? 0 : 2,
    });
    return `${sign}${text}M`;
  }

  if (abs >= 1_000) {
    const thousands = Math.round(abs / 1_000);
    return `${sign}${thousands}k`;
  }

  return `${sign}${abs.toLocaleString('pt-BR')}`;
}
