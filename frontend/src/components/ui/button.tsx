import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactElement } from 'react';
import { cn } from '@/lib/utils.ts';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all disabled:pointer-events-none outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary-strong',
        outline: 'border border-border bg-background hover:bg-muted',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted',
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
