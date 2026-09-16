import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Pause, Play, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { WorkoutStatusBadge } from '@/components/workouts/WorkoutStatusBadge';
import { WorkoutStatusDialog } from '@/components/workouts/WorkoutStatusDialog';
import { WorkoutDayNavigator } from '@/components/workouts/WorkoutDayNavigator';
import { useDeleteWorkout, useWorkout, useWorkoutProgress } from '@/hooks/useWorkouts';
import { WORKOUT_GOAL_LABELS, WORKOUT_STATUS } from '@/lib/constants';
import { formatDate, formatPercent } from '@/lib/format';

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const workoutId = Number(id);
  const navigate = useNavigate();

  const { data: workout, isLoading, isError } = useWorkout(workoutId);
  const { data: progress } = useWorkoutProgress(workoutId);
  const del = useDeleteWorkout();

  if (isLoading) {
    return (
      <section className="mx-auto max-w-5xl space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </section>
    );
  }

  if (isError || !workout) {
    return (
      <EmptyState
        icon={<span>⚠️</span>}
        title="Rotina não encontrada"
        description="Verifique o link ou volte para a listagem."
        action={
          <Link to="/workouts">
            <Button variant="secondary">Ver todas as rotinas</Button>
          </Link>
        }
      />
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/workouts"
            className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
          >
            ← Voltar
          </Link>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-headline-lg text-foreground">
              {workout.name}
              <WorkoutStatusBadge status={workout.status} />
            </h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              {WORKOUT_GOAL_LABELS[workout.goal]} · {workout.totalDays} dias ·{' '}
              {workout.totalExercises} exercícios
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Pausar / Retomar */}
          {workout.status === WORKOUT_STATUS.active && (
            <WorkoutStatusDialog
              workout={workout}
              target={WORKOUT_STATUS.paused}
              trigger={
                <Button variant="secondary" size="sm">
                  <Pause className="h-4 w-4" />
                  Pausar
                </Button>
              }
            />
          )}
          {workout.status === WORKOUT_STATUS.paused && (
            <WorkoutStatusDialog
              workout={workout}
              target={WORKOUT_STATUS.active}
              trigger={
                <Button variant="secondary" size="sm">
                  <Play className="h-4 w-4" />
                  Retomar
                </Button>
              }
            />
          )}

          {/* Concluir */}
          {workout.status !== WORKOUT_STATUS.completed && (
            <WorkoutStatusDialog
              workout={workout}
              target={WORKOUT_STATUS.completed}
              trigger={
                <Button variant="secondary" size="sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Concluir
                </Button>
              }
            />
          )}

          {/* Progresso */}
          <Link to={`/workouts/${workout.id}/progress`}>
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="h-4 w-4" />
              Progresso
            </Button>
          </Link>

          {/* Excluir */}
          <ConfirmDialog
            trigger={
              <Button variant="danger" size="sm">
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            }
            title="Excluir rotina?"
            description={`"${workout.name}" e todos os exercícios e logs serão removidos (cascade).`}
            confirmLabel="Excluir"
            onConfirm={async () => {
              await del.mutateAsync(workout.id);
              navigate('/workouts', { replace: true });
            }}
          />
        </div>
      </header>

      {/* Progresso compacto */}
      {progress && (
        <Card>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/60">
                Progresso
              </span>
              <span className="font-mono text-mono-label text-foreground/80">
                {progress.completedExercises}/{progress.totalExercises} · {progress.daysCompleted}/
                {progress.totalDays} dias
              </span>
            </div>
            <ProgressBar value={progress.completionPercent} showLabel />
          </CardContent>
        </Card>
      )}

      {/* Navegação de dias + exercícios */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle>Exercícios da rotina</CardTitle>
          <CardDescription>
            Navegue pelos dias da rotina e marque os exercícios concluídos.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <WorkoutDayNavigator
            exercises={workout.exercises}
            totalDays={workout.totalDays}
            onLog={() => {
              // O log acontece na página Hoje (Etapa 14). Aqui enviamos o usuário para lá.
              navigate('/workouts/today');
            }}
          />
        </CardContent>
      </Card>

      {/* Rodapé de datas */}
      <p className="text-center font-mono text-mono-label text-foreground/40">
        {formatDate(workout.startDate)} → {formatDate(workout.endDate)} ·{' '}
        {formatPercent(workout.status === WORKOUT_STATUS.completed ? 100 : (progress?.completionPercent ?? 0))}
      </p>
    </section>
  );
}