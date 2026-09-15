import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { StatusDot, type StatusDotTone } from './StatusDot';

export type ModuleKey = 'auth' | 'health' | 'workouts' | 'dashboard';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
    module?: ModuleKey;
    status?: 'active' | 'paused' | 'completed';
}

const MODULE_STYLES: Record<ModuleKey, string> = {
    auth: 'border-[#6366F1]/40 bg-[#6366F1]/15 text-[#6366F1]',
    health: 'border-[#10B981]/40 bg-[#10B981]/15 text-[#10B981]',
    workouts: 'border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F59E0B]',
    dashboard: 'border-[#0EA5E9]/40 bg-[#0EA5E9]/15 text-[#0EA5E9]',
};

const STATUS_LABELS: Record<NonNullable<PillProps['status']>, string> = {
    active: 'Ativa',
    paused: 'Pausada',
    completed: 'Concluída',
};

const STATUS_TONE: Record<NonNullable<PillProps['status']>, StatusDotTone> = {
    active: 'active',
    paused: 'paused',
    completed: 'completed',
};

export function Pill({ module, status, className, children, ...rest }: PillProps) {
    return (
        <span
            className={cn(
                'pill',
                module && MODULE_STYLES[module],
                status && 'border-transparent',
                className,
            )}
            {...rest}
        >
            {status && <StatusDot tone={STATUS_TONE[status]} />}
            {children ?? (status ? STATUS_LABELS[status] : null)}
        </span>
    );
}