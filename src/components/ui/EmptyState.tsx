import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'card-tier1 flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
                className,
            )}
        >
            {icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                    {icon}
                </div>
            )}
            <h3 className="text-headline-sm text-foreground">{title}</h3>
            {description && (
                <p className="max-w-md text-body-sm text-foreground/60">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}