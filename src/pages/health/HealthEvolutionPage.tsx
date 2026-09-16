import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { BmiEvolutionChart } from '@/components/dashboard/BmiEvolutionChart';
import { HealthSummaryBar } from '@/components/health/HealthSummaryBar';
import { useHealthEvolution } from '@/hooks/useHealth';
import { cn } from '@/lib/utils/cn';
import { formatDecimal2 } from '@/lib/format';

const PERIODS = [30, 60, 90, 180, 365] as const;

export default function HealthEvolutionPage() {
  const [period, setPeriod] = useState<number>(90);
  const { data, isLoading, isError } = useHealthEvolution(period);

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/health"
            className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
          >
            ← Voltar
          </Link>
          <div>
            <h1 className="text-headline-lg text-foreground">Evolução do IMC</h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              Variação de peso e IMC ao longo do tempo (regra UX-004: 2 casas decimais).
            </p>
          </div>
        </div>

        <div className="inline-flex rounded-input border border-border bg-background p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={cn(
                'rounded-micro px-3 py-1 font-mono text-mono-label transition-colors',
                period === p
                  ? 'bg-primary/15 text-primary'
                  : 'text-foreground/50 hover:text-foreground',
              )}
            >
              {p}d
            </button>
          ))}
        </div>
      </header>

      <HealthSummaryBar evolution={data} />

      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle>Histórico</CardTitle>
          <CardDescription>
            Endpoint:{' '}
            <code className="font-mono text-primary">
              GET /health/metrics/evolution?period={period}
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {isLoading && <Skeleton className="h-[260px] w-full" />}

          {isError && (
            <EmptyState
              icon={<span>⚠️</span>}
              title="Erro ao carregar evolução"
              description="Tente novamente em instantes."
            />
          )}

          {data && data.data.length === 0 && (
            <EmptyState
              icon={<span>📈</span>}
              title="Sem dados no período"
              description="Registre mais medições para visualizar sua evolução."
              action={
                <Link to="/health/new">
                  <Button>Registrar medição</Button>
                </Link>
              }
            />
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 rounded-input border border-border/60 bg-background/40 p-4 sm:grid-cols-4">
                <Stat label="IMC inicial" value={formatDecimal2(data.startBmi)} />
                <Stat label="IMC atual" value={formatDecimal2(data.currentBmi)} tone="primary" />
                <Stat
                  label="Δ IMC"
                  value={formatDecimal2(data.bmiChange)}
                  tone={data.bmiChange <= 0 ? 'primary' : 'danger'}
                />
                <Stat
                  label="Δ Peso"
                  value={`${formatDecimal2(data.weightChange)} kg`}
                  tone={data.weightChange <= 0 ? 'primary' : 'danger'}
                />
              </div>
              <BmiEvolutionChart data={data} targetBmi={22} />
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
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
          tone === 'primary' ? 'text-primary' : tone === 'danger' ? 'text-danger' : 'text-foreground',
        )}
      >
        {value}
      </div>
    </div>
  );
}