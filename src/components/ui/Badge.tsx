import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
}

const TONES: Record<Tone, string> = {
    neutral: 'bg-surface-hover text-foreground/80 border-border',
    success: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/40',
    warning: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40',
    danger: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40',
    info: 'bg-[#0EA5E9]/15 text-[#0EA5E9] border-[#0EA5E9]/40',
    primary: 'bg-primary/15 text-primary border-primary/40',
};

export function Badge({ tone = 'neutral', className, children, ...rest }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 rounded-micro border px-2 py-0.5 text-mono-label font-medium uppercase tracking-[0.04em]',
                TONES[tone],
                className,
            )}
            {...rest}
        >
            {children}
        </span>
    );
}