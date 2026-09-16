import { useState } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { HealthMetricDetailDialog } from '@/components/health/HealthMetricDetailDialog';
import { HealthSummaryBar } from '@/components/health/HealthSummaryBar';
import { useDeleteHealthMetric, useHealthEvolution, useHealthMetrics } from '@/hooks/useHealth';
import { formatDate, formatDecimal2, formatInt } from '@/lib/format';
import type { HealthMetricListItem } from '@/types/health.types';

const PAGE_SIZE = 10;

export default function HealthHistoryPage() {
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data, isLoading, isError } = useHealthMetrics({ page, pageSize: PAGE_SIZE });
  const { data: evolution } = useHealthEvolution(90);
  const del = useDeleteHealthMetric();

  const selected = data?.items.find((m) => m.id === selectedId) ?? null;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
          >
            ← Voltar
          </Link>
          <div>
            <h1 className="text-headline-lg text-foreground">Métricas de Saúde</h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              Histórico completo de medições e evolução biométrica.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/health/evolution">
            <Button variant="secondary" size="sm">
              Ver evolução
            </Button>
          </Link>
          <Link to="/health/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Nova medição
            </Button>
          </Link>
        </div>
      </header>

      {/* Resumo */}
      <HealthSummaryBar evolution={evolution} />

      {/* Tabela / Cards */}
      {isLoading && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </CardContent>
        </Card>
      )}

      {isError && (
        <EmptyState
          icon={<span>⚠️</span>}
          title="Erro ao carregar medições"
          description="Tente novamente em instantes."
        />
      )}

      {data && data.items.length === 0 && (
        <EmptyState
          icon={<span>📈</span>}
          title="Sem medições ainda"
          description="Registre peso e altura para calcular IMC, BMR e TDEE via TinyFn."
          action={
            <Link to="/health/new">
              <Button>
                <Plus className="h-4 w-4" />
                Registrar primeira medição
              </Button>
            </Link>
          }
        />
      )}

      {data && data.items.length > 0 && (
        <Card>
          <CardContent className="p-0">
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-body-sm">
                <thead className="border-b border-border/60 bg-background/40 text-mono-label uppercase tracking-[0.04em] text-foreground/50">
                  <tr>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Peso</th>
                    <th className="px-4 py-3">Altura</th>
                    <th className="px-4 py-3">IMC</th>
                    <th className="px-4 py-3">BMR</th>
                    <th className="px-4 py-3">TDEE</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((m, idx) => (
                    <Row
                      key={m.id}
                      metric={m}
                      isLatest={idx === 0 && page === 1}
                      onOpen={() => setSelectedId(m.id)}
                      onDelete={() => del.mutate(m.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-border/60 md:hidden">
              {data.items.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-body-sm text-foreground/70">
                        {formatDate(m.measuredAt)}
                      </span>
                      {m.id === data.items[0]?.id && page === 1 && <Badge tone="primary">Atual</Badge>}
                    </div>
                    <div className="mt-1 font-mono text-body-sm">
                      {formatDecimal2(m.weightKg)} kg · IMC {formatDecimal2(m.bmi)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" aria-label="Ver detalhes" onClick={() => setSelectedId(m.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <ConfirmDeleteButton onConfirm={() => del.mutate(m.id)} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border/60 px-4 py-3">
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                totalCount={data.totalCount}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de detalhe — reaproveita os dados da lista */}
      <HealthMetricDetailDialog
        metric={
          selected
            ? {
                id: selected.id,
                weightKg: selected.weightKg,
                heightCm: selected.heightCm,
                bmi: selected.bmi,
                bmr: selected.bmr,
                tdee: selected.tdee,
                activityLevel: selected.activityLevel,
                measuredAt: selected.measuredAt,
              }
            : null
        }
        open={selectedId !== null}
        onOpenChange={(open) => !open && setSelectedId(null)}
        onDelete={async (id) => {
          await del.mutateAsync(id);
          setSelectedId(null);
        }}
      />
    </section>
  );
}

function Row({
  metric,
  isLatest,
  onOpen,
  onDelete,
}: {
  metric: HealthMetricListItem;
  isLatest: boolean;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border/40 last:border-0 hover:bg-surface-hover/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-foreground/70">{formatDate(metric.measuredAt)}</span>
          {isLatest && <Badge tone="primary">Atual</Badge>}
        </div>
      </td>
      <td className="px-4 py-3 font-mono">{formatDecimal2(metric.weightKg)} kg</td>
      <td className="px-4 py-3 font-mono">{formatDecimal2(metric.heightCm)} cm</td>
      <td className="px-4 py-3 font-mono text-primary">{formatDecimal2(metric.bmi)}</td>
      <td className="px-4 py-3 font-mono">{formatInt(metric.bmr)}</td>
      <td className="px-4 py-3 font-mono">{formatInt(metric.tdee)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" aria-label="Ver detalhes" onClick={onOpen}>
            <Eye className="h-4 w-4" />
          </Button>
          <ConfirmDeleteButton onConfirm={onDelete} />
        </div>
      </td>
    </tr>
  );
}

function ConfirmDeleteButton({ onConfirm }: { onConfirm: () => void }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" aria-label="Excluir medição">
          <Trash2 className="h-4 w-4 text-danger" />
        </Button>
      }
      title="Excluir medição?"
      description="Isso remove a medição definitivamente (LGPD §9.6)."
      confirmLabel="Excluir"
      onConfirm={onConfirm}
    />
  );
}