import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
    { label, id, className, ...rest },
    ref,
) {
    const inputId = id ?? rest.name;
    return (
        <label
            htmlFor={inputId}
            className={cn(
                'inline-flex cursor-pointer items-center gap-2 text-body-md text-foreground',
                className,
            )}
        >
            <span className="relative inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                <input
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    className={cn(
                        'peer h-[18px] w-[18px] cursor-pointer appearance-none rounded-micro border border-border bg-input',
                        'checked:border-primary checked:bg-primary',
                        'focus-visible:outline-none focus-visible:shadow-focus',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                    )}
                    {...rest}
                />
                <Check
                    aria-hidden
                    className="pointer-events-none absolute h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100"
                    strokeWidth={3}
                />
            </span>
            {label && <span>{label}</span>}
        </label>
    );
});