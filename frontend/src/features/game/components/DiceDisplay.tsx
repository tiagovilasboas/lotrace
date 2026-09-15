import type { DiceRoll } from '@lotrace/shared';
import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react';
import { t } from '@/lib/i18n.ts';
import { cn } from '@/lib/utils.ts';

type DieValue = 1 | 2 | 3 | 4 | 5 | 6;

const PIP_SLOTS: Record<DieValue, ReadonlySet<number>> = {
  1: new Set([5]),
  2: new Set([1, 9]),
  3: new Set([1, 5, 9]),
  4: new Set([1, 3, 7, 9]),
  5: new Set([1, 3, 5, 7, 9]),
  6: new Set([1, 3, 4, 6, 7, 9]),
};

const ROLL_ANIMATION_MS = 560;

type DiceDisplayProps = {
  dice: DiceRoll | null;
};

function toDieValue(value: number): DieValue | null {
  if (value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6) {
    return value;
  }
  return null;
}

type DieFaceProps = {
  value: DieValue | null;
  rolling: boolean;
  delayMs: number;
};

function DieFace({ value, rolling, delayMs }: DieFaceProps): ReactElement {
  const pips = value === null ? null : PIP_SLOTS[value];
  const style: CSSProperties | undefined = rolling
    ? { animationDelay: `${delayMs}ms` }
    : undefined;

  return (
    <span
      className={cn('die-face', value === null && 'die-face-empty', rolling && 'dice-face-roll')}
      style={style}
      aria-hidden
    >
      {Array.from({ length: 9 }, (_, index) => {
        const slot = index + 1;
        const on = pips?.has(slot) ?? false;
        return <span key={slot} className={cn(on ? 'die-pip' : 'die-pip-slot')} />;
      })}
    </span>
  );
}

export function DiceDisplay({ dice }: DiceDisplayProps): ReactElement {
  const prevKeyRef = useRef<string | undefined>(undefined);
  const [rolling, setRolling] = useState(false);

  const die1 = dice === null ? null : toDieValue(dice.die1);
  const die2 = dice === null ? null : toDieValue(dice.die2);
  const hasFaces = die1 !== null && die2 !== null;

  useEffect(() => {
    const key = die1 === null || die2 === null ? 'empty' : `${die1}-${die2}`;
    const previous = prevKeyRef.current;
    prevKeyRef.current = key;

    if (previous === undefined || previous === key || key === 'empty') {
      return undefined;
    }

    setRolling(true);
    const id = window.setTimeout(() => {
      setRolling(false);
    }, ROLL_ANIMATION_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [die1, die2]);

  const label = hasFaces && dice !== null
    ? t('diceAriaRolled', {
        die1: String(die1),
        die2: String(die2),
        total: String(dice.total),
      })
    : t('diceAriaEmpty');

  return (
    <div className="flex flex-col items-center gap-1.5" role="img" aria-label={label}>
      <div className="flex items-center justify-center gap-1.5">
        <span className="-rotate-[9deg]">
          <DieFace value={die1} rolling={rolling} delayMs={0} />
        </span>
        <span className="rotate-[8deg]">
          <DieFace value={die2} rolling={rolling} delayMs={80} />
        </span>
      </div>
      {hasFaces && dice !== null ? (
        <span className="sr-only">{dice.total}</span>
      ) : null}
    </div>
  );
}
