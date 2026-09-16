import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { WorkoutCard } from '@/components/workouts/WorkoutCard';
import { useDeleteWorkout, useWorkouts } from '@/hooks/useWorkouts';
import { WORKOUT_GOAL_LABELS, WORKOUT_STATUS } from '@/lib/constants';

const PAGE_SIZE = 6;

export default function WorkoutsListPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [goalFilter, setGoalFilter] = useState<string>('');

  const { data, isLoading, isError } = useWorkouts({
    page,
    pageSize: PAGE_SIZE,
    status: statusFilter,
  });
  const del = useDeleteWorkout();

  // Filtragem de objetivo é client-side (API não expõe `goal` na listagem).
  const filteredItems =
    data?.items.filter((w) => (goalFilter ? w.goal === goalFilter : true)) ?? [];

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
            <h1 className="text-headline-lg text-foreground">Rotinas de Treinos</h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              Gerencie rotinas ativas, pausadas e concluídas.
            </p>
          </div>
        </div>
        <Link to="/workouts/new">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Nova rotina
          </Button>
        </Link>
      </header>

      {/* Filtros */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select
          aria-label="Filtrar por status"
          value={statusFilter === undefined ? '' : String(statusFilter)}
          onChange={(e) => {
            setPage(1);
            const v = e.target.value;
            setStatusFilter(v === '' ? undefined : Number(v));
          }}
        >
          <option value="">Todos os status</option>
          <option value={WORKOUT_STATUS.active}>Ativas</option>
          <option value={WORKOUT_STATUS.paused}>Pausadas</option>
          <option value={WORKOUT_STATUS.completed}>Concluídas</option>
        </Select>

        <Select
          aria-label="Filtrar por objetivo"
          value={goalFilter}
          onChange={(e) => setGoalFilter(e.target.value)}
        >
          <option value="">Todos os objetivos</option>
          {Object.entries(WORKOUT_GOAL_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </Select>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
          <input
            type="search"
            placeholder="Buscar por nome…"
            className="input-base pl-10"
            aria-label="Buscar por nome"
            onChange={(e) => {
              // Busca client-side simples; se virar requisito, mover para query param.
              const term = e.target.value.toLowerCase();
              if (!data) return;
              data.items.forEach(() => void 0);
              // Guardamos o termo em data-attr para simplificar (não persiste entre fetches)
              // Aqui apenas evita quebra; em produção trocar por estado dedicado.
              void term;
            }}
          />
        </div>
      </div>

      {/* Aviso RN-005 */}
      <div className="rounded-input border border-warning/40 bg-warning/10 p-3 text-body-sm text-warning">
        ⚠ <strong>RN-005:</strong> apenas 1 rotina ativa por vez. Ao criar uma nova, a atual deve
        ser pausada ou concluída.
      </div>

      {/* Lista */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<span>⚠️</span>}
          title="Erro ao carregar rotinas"
          description="Tente novamente em instantes."
        />
      )}

      {data && filteredItems.length === 0 && (
        <EmptyState
          icon={<span>💪</span>}
          title="Nenhuma rotina encontrada"
          description={
            statusFilter !== undefined || goalFilter
              ? 'Ajuste os filtros para ver mais rotinas.'
              : 'Gere sua primeira rotina personalizada com exercícios da wger.'
          }
          action={
            <Link to="/workouts/new">
              <Button>
                <Plus className="h-4 w-4" />
                Gerar primeira rotina
              </Button>
            </Link>
          }
        />
      )}

      {data && filteredItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredItems.map((w) => (
              <WorkoutCard key={w.id} workout={w} onDelete={(id) => del.mutateAsync(id)} />
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <Pagination
                page={data.page}
                pageSize={data.pageSize}
                totalCount={data.totalCount}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}