import { TrendingDown, TrendingUp } from 'lucide-react';
import type { HealthEvolutionResponse } from '@/types/health.types';
import { formatDecimal2 } from '@/lib/format';
import { cn } from '@/lib/utils/cn';

export interface HealthSummaryBarProps {
  evolution?: HealthEvolutionResponse | null | undefined;
}

export function HealthSummaryBar({ evolution }: HealthSummaryBarProps) {
  if (!evolution) return null;

  const bmiDown = evolution.bmiChange <= 0;
  const weightDown = evolution.weightChange <= 0;
  const BmiIcon = bmiDown ? TrendingDown : TrendingUp;
  const WeightIcon = weightDown ? TrendingDown : TrendingUp;

  return (
    <div className="grid grid-cols-2 gap-3 rounded-input border border-border/60 bg-background/40 p-4 sm:grid-cols-3">
      <Cell label="Medições" value={`${evolution.data.length}`} />
      <Cell
        label="Δ IMC"
        value={formatDecimal2(evolution.bmiChange)}
        icon={<BmiIcon className={cn('h-4 w-4', bmiDown ? 'text-primary' : 'text-danger')} />}
        tone={bmiDown ? 'primary' : 'danger'}
      />
      <Cell
        label="Δ Peso"
        value={`${formatDecimal2(evolution.weightChange)} kg`}
        icon={<WeightIcon className={cn('h-4 w-4', weightDown ? 'text-primary' : 'text-danger')} />}
        tone={weightDown ? 'primary' : 'danger'}
        className="col-span-2 sm:col-span-1"
      />
    </div>
  );
}

function Cell({
  label,
  value,
  icon,
  tone = 'default',
  className,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'primary' | 'danger';
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 flex items-center gap-1.5 font-mono text-mono-metric-md font-bold',
          tone === 'primary' ? 'text-primary' : tone === 'danger' ? 'text-danger' : 'text-foreground',
        )}
      >
        {icon}
        {value}
      </div>
    </div>
  );
}