import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            aria-hidden
            className={cn('animate-pulse rounded-input bg-surface-hover/60', className)}
            {...rest}
        />
    );
}