import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { BmiEvolutionChart } from './BmiEvolutionChart';
import { useHealthEvolution } from '@/hooks/useHealth';
import { cn } from '@/lib/utils/cn';
import { formatDecimal2 } from '@/lib/format';

const PERIODS = [30, 60, 90, 180, 365] as const;

export function DashboardProgressCard({ initialPeriod = 90 }: { initialPeriod?: number }) {
    const [period, setPeriod] = useState<number>(initialPeriod);
    const { data, isLoading } = useHealthEvolution(period);

    return (
        <Card>
            <CardHeader className="flex-row items-start justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                    <CardTitle>Evolução do IMC — Histórico</CardTitle>
                    <CardDescription>
                        Endpoint:{' '}
                        <code className="font-mono text-primary">GET /health/evolution</code>
                    </CardDescription>
                </div>

                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-input border border-border bg-background p-1">
                        {PERIODS.map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPeriod(p)}
                                aria-pressed={period === p}
                                className={cn(
                                    'rounded-micro px-2 py-1 font-mono text-mono-label transition-colors',
                                    period === p
                                        ? 'bg-primary/15 text-primary'
                                        : 'text-foreground/50 hover:text-foreground',
                                )}
                            >
                                {p}d
                            </button>
                        ))}
                    </div>
                    <Link
                        to="/health/evolution"
                        aria-label="Abrir em tela cheia"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-input border border-border text-foreground/60 hover:bg-surface-hover"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
                {isLoading && <Skeleton className="h-[260px] w-full" />}

                {data && (
                    <>
                        <div className="grid grid-cols-2 gap-4 rounded-input border border-border/60 bg-background/40 p-4 sm:grid-cols-4">
                            <Stat label="Ponto de partida" value={formatDecimal2(data.startBmi)} hint={`${formatDecimal2(data.startWeight)} kg`} />
                            <Stat label="Atual registrado" value={formatDecimal2(data.currentBmi)} hint={`${formatDecimal2(data.currentWeight)} kg`} tone="primary" />
                            <Stat label="Delta IMC" value={formatDecimal2(data.bmiChange)} hint={`${data.bmiChange <= 0 ? '' : '+'}${formatDecimal2(data.bmiChange)}`} tone={data.bmiChange <= 0 ? 'primary' : 'danger'} />
                            <Stat label="Delta peso" value={`${formatDecimal2(data.weightChange)} kg`} hint={data.weightChange <= 0 ? '↓' : '↑'} tone={data.weightChange <= 0 ? 'primary' : 'danger'} />
                        </div>

                        <BmiEvolutionChart data={data} targetBmi={22} height={240} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function Stat({
    label,
    value,
    hint,
    tone = 'default',
}: {
    label: string;
    value: string;
    hint?: string;
    tone?: 'default' | 'primary' | 'danger';
}) {
    return (
        <div>
            <div className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
                {label}
            </div>
            <div
                className={cn(
                    'mt-0.5 font-mono text-mono-metric-md font-bold',
                    tone === 'primary'
                        ? 'text-primary'
                        : tone === 'danger'
                            ? 'text-danger'
                            : 'text-foreground',
                )}
            >
                {value}
                {hint && <span className="ml-1 text-body-sm font-normal text-foreground/50">{hint}</span>}
            </div>
        </div>
    );
}