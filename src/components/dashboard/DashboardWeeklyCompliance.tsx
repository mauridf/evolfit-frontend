import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDashboardCompliance } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils/cn';
import { formatPercent } from '@/lib/format';

export interface DashboardWeeklyComplianceProps {
    days: 7 | 14 | 30;
    onDaysChange?: (days: 7 | 14 | 30) => void;
}

const WEEKDAY_PT: Record<number, string> = {
    0: 'Dom',
    1: 'Seg',
    2: 'Ter',
    3: 'Qua',
    4: 'Qui',
    5: 'Sex',
    6: 'Sáb',
};

function formatShortDate(iso: string): string {
    // "2026-09-04" → "04/09"
    const [, m, d] = iso.split('-');
    return `${d}/${m}`;
}

function columnTone(percent: number, isToday: boolean): string {
    if (isToday && percent > 0 && percent < 100) return 'bg-[#F59E0B]';
    if (percent >= 100) return 'bg-[#22C55E]';
    if (percent >= 60) return 'bg-[#10B981]';
    if (percent > 0) return 'bg-[#F59E0B]';
    return 'bg-surface-hover';
}

export function DashboardWeeklyCompliance({
    days,
    onDaysChange,
}: DashboardWeeklyComplianceProps) {
    const { data, isLoading, isError } = useDashboardCompliance(days);
    const today = new Date().toISOString().slice(0, 10);

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between gap-3 border-b border-border/60 pb-4 sm:flex-row">
                <div>
                    <CardTitle>Compliance semanal</CardTitle>
                    <CardDescription>
                        Endpoint: <code className="font-mono text-primary">GET /dashboard/compliance</code>
                    </CardDescription>
                </div>

                <div className="inline-flex rounded-input border border-border bg-background p-1">
                    {([7, 14, 30] as const).map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => onDaysChange?.(d)}
                            aria-pressed={days === d}
                            className={cn(
                                'rounded-micro px-2.5 py-1 font-mono text-mono-label transition-colors',
                                days === d
                                    ? 'bg-primary/15 text-primary'
                                    : 'text-foreground/50 hover:text-foreground',
                            )}
                        >
                            {d}d
                        </button>
                    ))}
                </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
                {isLoading && (
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <Skeleton key={i} className="h-32" />
                        ))}
                    </div>
                )}

                {isError && (
                    <p className="text-body-sm text-danger">Não foi possível carregar o compliance.</p>
                )}

                {data && (
                    <>
                        {/* Resumo */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="font-mono text-mono-label text-foreground/60">
                                Média dos últimos {data.period} dias
                            </span>
                            <span className="text-headline-sm font-bold text-primary">
                                {formatPercent(data.averagePercent)}
                            </span>
                        </div>

                        {/* Colunas */}
                        <div
                            className={cn(
                                'grid gap-2',
                                data.days.length <= 7 ? 'grid-cols-7' : 'grid-cols-7 md:grid-cols-14',
                            )}
                        >
                            {data.days.map((day) => {
                                const wd = new Date(`${day.date}T00:00:00`).getDay();
                                const isToday = day.date === today;
                                const isRest = day.totalExercises === 0;
                                return (
                                    <div
                                        key={day.date}
                                        className={cn(
                                            'flex flex-col items-center rounded-input border bg-background/40 p-2 transition-colors',
                                            isToday
                                                ? 'border-primary/40 ring-1 ring-primary/20'
                                                : 'border-border/60 hover:border-primary/40',
                                            isRest && 'opacity-60',
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-mono-label font-semibold',
                                                isToday ? 'text-primary' : 'text-foreground/70',
                                            )}
                                        >
                                            {WEEKDAY_PT[wd]}
                                            {isToday ? ' (hoje)' : ''}
                                        </span>
                                        <span className="font-mono text-mono-label text-foreground/40">
                                            {formatShortDate(day.date)}
                                        </span>

                                        <div className="my-2 flex h-24 w-full flex-col justify-end rounded-input bg-surface-hover/40 p-1">
                                            {isRest ? (
                                                <span className="rotate-90 self-center font-mono text-mono-label text-foreground/40">
                                                    Descanso
                                                </span>
                                            ) : (
                                                <div
                                                    className={cn(
                                                        'w-full rounded-micro transition-all',
                                                        columnTone(day.percent, isToday),
                                                        isToday && day.percent < 100 && 'animate-pulse-dot',
                                                    )}
                                                    style={{ height: `${Math.max(6, day.percent)}%` }}
                                                />
                                            )}
                                        </div>

                                        <span
                                            className={cn(
                                                'font-mono text-mono-label font-bold',
                                                isRest
                                                    ? 'text-foreground/40'
                                                    : isToday
                                                        ? 'text-warning'
                                                        : 'text-primary',
                                            )}
                                        >
                                            {isRest ? '—' : formatPercent(day.percent)}
                                        </span>
                                        <span className="text-mono-label text-foreground/50">
                                            {isRest ? 'Recuperação' : `${day.completed}/${day.totalExercises} ex`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legenda */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
                            <div className="flex flex-wrap items-center gap-3 text-mono-label text-foreground/60">
                                <Legend color="bg-[#22C55E]" label="Concluído" />
                                <Legend color="bg-[#F59E0B]" label="Parcial" />
                                <Legend color="bg-surface-hover" label="Descanso" />
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className={cn('h-2.5 w-2.5 rounded-micro', color)} />
            {label}
        </span>
    );
}

// Silencia linter para import não usado (mantido para eventual uso futuro)
void ProgressBar;