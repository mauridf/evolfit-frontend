import { AlertTriangle, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BmiCategoryBadge } from './BmiCategoryBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, formatDecimal2, formatInt } from '@/lib/format';
import type { HealthMetricResponse } from '@/types/health.types';

export interface HealthMetricDetailDialogProps {
  metric: HealthMetricResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: number) => Promise<void> | void;
  /** Heurística: considera aproximado quando não há macrosSuggestion. */
  approximate?: boolean;
}

export function HealthMetricDetailDialog({
  metric,
  open,
  onOpenChange,
  onDelete,
  approximate,
}: HealthMetricDetailDialogProps) {
  if (!metric) return null;

  const isApprox = approximate ?? !metric.macrosSuggestion;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={`Medição de ${formatDate(metric.measuredAt)}`}
        description={`ID #${metric.id} · Registrado em ${formatDate(metric.measuredAt)}`}
      >
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Peso" value={`${formatDecimal2(metric.weightKg)} kg`} />
          <Stat label="Altura" value={`${formatDecimal2(metric.heightCm)} cm`} />
          <Stat label="IMC" value={formatDecimal2(metric.bmi)} />
          <Stat label="BMR" value={`${formatInt(metric.bmr)} kcal/dia`} />
          <Stat label="TDEE" value={`${formatInt(metric.tdee)} kcal/dia`} className="col-span-2" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BmiCategoryBadge category={metric.activityLevel} />
          <Badge tone="info">{metric.activityLevel}</Badge>
          {isApprox && (
            <Badge tone="warning">
              <AlertTriangle className="h-3 w-3" />
              Aproximado (TFN-005)
            </Badge>
          )}
        </div>

        {metric.macrosSuggestion && (
          <div className="rounded-input border border-border/60 bg-background/40 p-3">
            <p className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
              Macros sugeridos
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-body-sm">
              <span className="text-foreground">P: {metric.macrosSuggestion.proteinG} g</span>
              <span className="text-foreground">C: {metric.macrosSuggestion.carbsG} g</span>
              <span className="text-foreground">G: {metric.macrosSuggestion.fatG} g</span>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {onDelete && (
            <ConfirmDialog
              trigger={
                <Button variant="danger">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              }
              title="Excluir medição?"
              description={`Isso remove a medição de ${formatDate(metric.measuredAt)} (IMC ${formatDecimal2(metric.bmi)}) definitivamente.`}
              confirmLabel="Excluir"
              onConfirm={async () => {
                await onDelete(metric.id);
                onOpenChange(false);
              }}
            />
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-mono-metric-md font-bold text-foreground">{value}</div>
    </div>
  );
}