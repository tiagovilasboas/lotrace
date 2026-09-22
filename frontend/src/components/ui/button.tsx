import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

/**
 * LotRace Button
 *
 * Variants map to City Night identity:
 *   default  — action-primary (blue CTA, same as match-cta)
 *   outline  — match-secondary (dark ghost with border)
 *   ghost    — fully transparent, text-on-table
 *   danger   — destructive red
 *
 * For game screens prefer the utility classes match-cta / match-secondary
 * directly on <Button className="match-cta"> so the button inherits the
 * pill shape and shadow from game.css.
 */
const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors',
    'disabled:pointer-events-none outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-[color:var(--turn-highlight)]/50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'rounded-xl',
          'bg-[color:var(--action-primary)] text-[color:var(--action-primary-text)]',
          'hover:bg-[color:var(--action-primary-hover)]',
          'shadow-[var(--shadow-action)]',
        ].join(' '),
        outline: [
          'rounded-xl',
          'border border-[color:var(--border-hud)]',
          'bg-[color:var(--action-secondary)] text-[color:var(--text-on-table)]',
          'hover:bg-[color:var(--surface-hud-raised)]',
        ].join(' '),
        ghost: [
          'rounded-xl',
          'bg-transparent text-[color:var(--text-on-table)]',
          'hover:bg-[color:var(--action-secondary)]',
        ].join(' '),
        danger: [
          'rounded-xl',
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
        ].join(' '),
      },
      size: {
        default: 'h-11 px-4 text-sm',
        lg: 'touch-cta px-5',
        sm: 'h-9 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    busy?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  type = 'button',
  loading = false,
  busy = false,
  disabled = false,
  children,
  ...props
}: ButtonProps): ReactElement {
  const isBusy = loading || busy;

  return (
    <button
      type={type}
      disabled={disabled || isBusy}
      aria-busy={isBusy || undefined}
      data-loading={isBusy ? 'true' : undefined}
      className={cn(
        buttonVariants({ variant, size }),
        disabled && !isBusy && 'opacity-50',
        isBusy && 'scale-[0.98] opacity-90',
        className,
      )}
      {...props}
    >
      {isBusy ? <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
