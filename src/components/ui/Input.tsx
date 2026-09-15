import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Ícone ou elemento no início (left). */
    leading?: ReactNode;
    /** Ícone/botão no final (right) — ex.: olho da senha. */
    trailing?: ReactNode;
    invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { leading, trailing, invalid, className, ...rest },
    ref,
) {
    return (
        <div className="relative">
            {leading && (
                <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-foreground/50"
                >
                    {leading}
                </span>
            )}
            <input
                ref={ref}
                aria-invalid={invalid || undefined}
                className={cn(
                    'input-base',
                    leading && 'pl-10',
                    trailing && 'pr-10',
                    className,
                )}
                {...rest}
            />
            {trailing && (
                <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>
            )}
        </div>
    );
});