import { Badge } from '@/components/ui/Badge';
import { KpiCard } from './KpiCard';
import type { DashboardResponse } from '@/types/dashboard.types';
import { formatDecimal2, formatInt } from '@/lib/format';

export interface DashboardKpiGridProps {
    data: DashboardResponse;
}

/** Categoriza o IMC para o badge (pt-BR). */
function bmiCategoryLabel(raw: string): string {
    const r = raw.toLowerCase();
    if (r.includes('normal')) return 'Normal (18.5 – 24.9)';
    if (r.includes('under') || r.includes('abaixo')) return 'Abaixo do peso (< 18.5)';
    if (r.includes('over') || r.includes('sobre')) return 'Sobrepeso (25.0 – 29.9)';
    if (r.includes('obes')) return 'Obesidade (≥ 30.0)';
    return raw;
}

export function DashboardKpiGrid({ data }: DashboardKpiGridProps) {
    const hasBmi = data.currentBmi > 0;
    const hasTdee = data.currentTdee > 0;
    const hasRoutine = data.activeRoutines > 0;

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <KpiCard
                label="IMC Atual"
                value={hasBmi ? formatDecimal2(data.currentBmi) : '—'}
                unit="kg/m²"
                to="/health/evolution"
                tone="primary"
                badge={
                    hasBmi ? (
                        <Badge tone="success">{bmiCategoryLabel(data.currentBmiCategory)}</Badge>
                    ) : undefined
                }
                hint={hasBmi ? 'ver evolução' : undefined}
            />

            <KpiCard
                label="Gasto Energético (TDEE)"
                value={hasTdee ? formatInt(data.currentTdee) : '—'}
                unit="kcal/dia"
                to="/health"
                tone="sky"
                badge={
                    hasTdee ? <Badge tone="info">Basal ativo</Badge> : undefined
                }
                hint={hasTdee ? 'ver medições' : undefined}
            />

            <KpiCard
                label="Rotina Ativa"
                value={String(data.activeRoutines)}
                to="/workouts"
                tone="amber"
                badge={
                    hasRoutine ? (
                        <span className="pill border-transparent bg-[#22C55E]/15 text-[#22C55E]">
                            <span className="status-dot bg-[#22C55E] animate-pulse-dot" />
                            Ativa (RN-005)
                        </span>
                    ) : (
                        <Badge tone="warning">Nenhuma rotina</Badge>
                    )
                }
                hint={hasRoutine ? 'ver rotinas' : undefined}
            />
        </div>
    );
}