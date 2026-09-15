import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type StatusDotTone = 'active' | 'paused' | 'completed' | 'danger';

const TONES: Record<StatusDotTone, string> = {
    active: 'bg-[#22C55E]',
    paused: 'bg-[#F59E0B]',
    completed: 'bg-[#0EA5E9]',
    danger: 'bg-[#EF4444]',
};

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: StatusDotTone;
    /** Anima com pulse (DESIGN.md). Default: true. */
    pulse?: boolean;
}

export function StatusDot({ tone = 'active', pulse = true, className, ...rest }: StatusDotProps) {
    return (
        <span
            aria-hidden
            className={cn(
                'status-dot',
                TONES[tone],
                pulse && 'animate-pulse-dot',
                className,
            )}
            {...rest}
        />
    );
}