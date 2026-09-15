import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
    { invalid, className, children, ...rest },
    ref,
) {
    return (
        <div className="relative">
            <select
                ref={ref}
                aria-invalid={invalid || undefined}
                className={cn(
                    'input-base appearance-none pr-9',
                    invalid && 'border-danger',
                    className,
                )}
                {...rest}
            >
                {children}
            </select>
            <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50"
            />
        </div>
    );
});