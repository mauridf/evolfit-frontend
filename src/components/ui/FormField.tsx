import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface FormFieldProps {
    label?: string;
    htmlFor?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormField({
    label,
    htmlFor,
    error,
    hint,
    required,
    children,
    className,
}: FormFieldProps) {
    const describedById = htmlFor ? `${htmlFor}-desc` : undefined;

    return (
        <div className={cn('flex flex-col gap-1.5', className)}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="text-body-sm font-medium text-foreground/80"
                >
                    {label}
                    {required && <span className="ml-0.5 text-danger">*</span>}
                </label>
            )}
            {children}
            {error ? (
                <p
                    id={describedById}
                    role="alert"
                    className="text-body-sm text-danger"
                >
                    {error}
                </p>
            ) : hint ? (
                <p id={describedById} className="text-body-sm text-foreground/50">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}