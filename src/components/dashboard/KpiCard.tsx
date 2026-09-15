import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

export type KpiTone = 'primary' | 'sky' | 'amber';

export interface KpiCardProps {
    label: string;
    value: string;
    unit?: string;
    /** Texto auxiliar (badge de categoria, status, etc.). */
    badge?: ReactNode;
    /** Texto secundário alinhado à direita (ex.: "BMR: 1.680 kcal"). */
    hint?: string | undefined;
    /** Rota de destino — torna o card clicável. */
    to?: string;
    tone?: KpiTone;
}

const TONE_DOT: Record<KpiTone, string> = {
    primary: 'bg-primary',
    sky: 'bg-[#0EA5E9]',
    amber: 'bg-[#F59E0B]',
};

const TONE_BAR: Record<KpiTone, string> = {
    primary: 'from-[#10B981] to-[#34D399]',
    sky: 'from-[#0EA5E9] to-[#3B82F6]',
    amber: 'from-[#F59E0B] to-[#F97316]',
};

const TONE_HOVER: Record<KpiTone, string> = {
    primary: 'hover:border-primary/60',
    sky: 'hover:border-[#0EA5E9]/60',
    amber: 'hover:border-[#F59E0B]/60',
};

export function KpiCard({
    label,
    value,
    unit,
    badge,
    hint,
    to,
    tone = 'primary',
}: KpiCardProps) {
    const inner = (
        <div
            className={cn(
                'card-tier1 group relative overflow-hidden p-5 transition-colors',
                TONE_HOVER[tone],
            )}
        >
            <header className="mb-3 flex items-center justify-between text-body-sm text-foreground/60">
                <span className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', TONE_DOT[tone])} />
                    <span>{label}</span>
                </span>
                {to && <span className="font-mono text-mono-label">abrir →</span>}
            </header>

            <div className="flex items-baseline gap-2">
                <span className="font-mono text-mono-metric-lg font-bold text-foreground">{value}</span>
                {unit && <span className="text-body-sm text-foreground/50">{unit}</span>}
            </div>

            {(badge || hint) && (
                <div className="mt-4 flex items-center justify-between gap-2">
                    {badge ?? <span />}
                    {hint && <span className="font-mono text-mono-label text-foreground/50">{hint}</span>}
                </div>
            )}

            {/* Borda inferior em gradiente */}
            <span
                aria-hidden
                className={cn(
                    'absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-60',
                    TONE_BAR[tone],
                )}
            />
        </div>
    );

    return to ? (
        <Link to={to} className="block focus-visible:outline-none">
            {inner}
        </Link>
    ) : (
        inner
    );
}