import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
    { invalid, className, ...rest },
    ref,
) {
    return (
        <textarea
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn(
                'w-full rounded-input border border-border bg-input px-3 py-2 text-body-md text-foreground',
                'placeholder:text-foreground/40 focus-visible:outline-none focus-visible:shadow-focus focus-visible:border-primary',
                'disabled:cursor-not-allowed disabled:opacity-60',
                invalid && 'border-danger focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]',
                className,
            )}
            {...rest}
        />
    );
});