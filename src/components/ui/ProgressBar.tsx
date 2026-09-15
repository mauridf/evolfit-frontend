import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps {
    /** Valor entre 0 e 100. */
    value: number;
    className?: string;
    tone?: 'primary' | 'success' | 'warning' | 'info';
    showLabel?: boolean;
    label?: string;
}

const TONES = {
    primary: 'bg-primary',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',
    info: 'bg-[#0EA5E9]',
};

export function ProgressBar({
    value,
    className,
    tone = 'primary',
    showLabel = false,
    label,
}: ProgressBarProps) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div
                role="progressbar"
                aria-valuenow={clamped}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label}
                className="h-2 flex-1 overflow-hidden rounded-pill bg-surface-hover"
            >
                <div
                    className={cn('h-full rounded-pill transition-[width] duration-300', TONES[tone])}
                    style={{ width: `${clamped}%` }}
                />
            </div>
            {showLabel && (
                <span className="min-w-10 text-right font-mono text-mono-label text-foreground/80">
                    {clamped}%
                </span>
            )}
        </div>
    );
}