import { useParams, Link } from 'react-router-dom';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useWorkout, useWorkoutProgress } from '@/hooks/useWorkouts';
import { useDashboardCompliance } from '@/hooks/useDashboard';
import { formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils/cn';

export default function WorkoutProgressPage() {
  const { id } = useParams<{ id: string }>();
  const workoutId = Number(id);

  const { data: workout } = useWorkout(workoutId);
  const { data: progress, isLoading } = useWorkoutProgress(workoutId);
  const { data: compliance } = useDashboardCompliance(7);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </section>
    );
  }

  if (!progress || !workout) {
    return (
      <EmptyState
        icon={<span>⚠️</span>}
        title="Progresso indisponível"
        description="Volte para a listagem e selecione uma rotina."
        action={
          <Link to="/workouts">
            <Button variant="secondary">Ver rotinas</Button>
          </Link>
        }
      />
    );
  }

  const days: number[] = compliance?.days.map((d) => d.percent) ?? [];

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border/60 pb-6">
        <Link
          to={`/workouts/${workoutId}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
        >
          ← Voltar
        </Link>
        <div>
          <h1 className="text-headline-lg text-foreground">
            Progresso — {workout.name}
          </h1>
          <p className="mt-0.5 text-body-sm text-foreground/60">
            Endpoint:{' '}
            <code className="font-mono text-primary">
              GET /workouts/{workoutId}/progress
            </code>
          </p>
        </div>
      </header>

      {/* Barra principal */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Visão geral
          </CardTitle>
          <CardDescription>Progresso consolidado da rotina atual.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="space-y-2">
            <ProgressBar value={progress.completionPercent} showLabel />
            <p className="font-mono text-mono-label text-foreground/60">
              {progress.completedExercises}/{progress.totalExercises} exercícios ·{' '}
              {progress.daysCompleted}/{progress.totalDays} dias
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-input border border-border/60 bg-background/40 p-4 sm:grid-cols-3">
            <Stat label="Conclusão" value={formatPercent(progress.completionPercent)} tone="primary" />
            <Stat label="Dias" value={`${progress.daysCompleted}/${progress.totalDays}`} />
            <Stat
              label="Exercícios"
              value={`${progress.completedExercises}/${progress.totalExercises}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Últimos 7 dias */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#0EA5E9]" />
            Últimos 7 dias
          </CardTitle>
          <CardDescription>Aderência diária recente.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {days.length === 0 ? (
            <p className="text-body-sm text-foreground/60">Sem dados nos últimos 7 dias.</p>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {compliance?.days.map((day) => {
                const isRest = day.totalExercises === 0;
                const color = isRest
                  ? 'bg-surface-hover'
                  : day.percent >= 100
                    ? 'bg-[#22C55E]'
                    : day.percent >= 60
                      ? 'bg-[#10B981]'
                      : 'bg-[#F59E0B]';
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center rounded-input border border-border/60 bg-background/40 p-2"
                    title={`${day.date}: ${day.completed}/${day.totalExercises}`}
                  >
                    <div className="my-2 flex h-16 w-full flex-col justify-end rounded-input bg-surface-hover/40 p-1">
                      <div
                        className={cn('w-full rounded-micro', color)}
                        style={{ height: `${isRest ? 4 : Math.max(6, day.percent)}%` }}
                      />
                    </div>
                    <span className="font-mono text-mono-label text-foreground/60">
                      {isRest ? '—' : formatPercent(day.percent)}
                    </span>
                  </div>
                );
              })}
            </div>
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
  tone?: 'default' | 'primary';
}) {
  return (
    <div>
      <div className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 font-mono text-mono-metric-md font-bold',
          tone === 'primary' ? 'text-primary' : 'text-foreground',
        )}
      >
        {value}
      </div>
    </div>
  );
}