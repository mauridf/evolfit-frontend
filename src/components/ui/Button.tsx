import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
    primary:
        'bg-primary text-primary-foreground hover:bg-accent hover:shadow-glow active:translate-y-px',
    secondary:
        'bg-surface text-foreground border border-border hover:border-accent hover:text-accent',
    ghost: 'bg-transparent text-foreground hover:bg-surface-hover',
    danger:
        'bg-danger/10 text-danger border border-danger/60 hover:bg-danger/20 active:translate-y-px',
};

const SIZES: Record<Size, string> = {
    sm: 'h-8 px-3 text-body-sm',
    md: 'h-10 px-4 text-body-md',
    lg: 'h-11 px-6 text-body-md',
    icon: 'h-10 w-10 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'primary', size = 'md', loading, disabled, className, children, ...rest },
    ref,
) {
    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-input font-semibold transition-all',
                'focus-visible:outline-none focus-visible:shadow-focus',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
                VARIANTS[variant],
                SIZES[size],
                className,
            )}
            {...rest}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    );
});