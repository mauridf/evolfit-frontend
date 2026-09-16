import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { TodayExerciseList } from '@/components/workouts/TodayExerciseList';
import { ExerciseLogDialog } from '@/components/workouts/ExerciseLogDialog';
import { useTodayWorkout } from '@/hooks/useWorkouts';
import { formatDate } from '@/lib/format';
import type { TodayExercise } from '@/types/workout.types';

type DialogState =
  | { open: false; exercise: null; mode: 'complete' | 'undo' }
  | { open: true; exercise: TodayExercise; mode: 'complete' | 'undo' };

export default function WorkoutTodayPage() {
  const { data, isLoading } = useTodayWorkout();
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    exercise: null,
    mode: 'complete',
  });

  function handleComplete(ex: TodayExercise) {
    setDialog({ open: true, exercise: ex, mode: 'complete' });
  }
  function handleUndo(ex: TodayExercise) {
    setDialog({ open: true, exercise: ex, mode: 'undo' });
  }
  function closeDialog() {
    setDialog({ open: false, exercise: null, mode: 'complete' });
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
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
            <h1 className="flex items-center gap-2 text-headline-lg text-foreground">
              Hoje
              {data && (
                <span className="inline-flex items-center gap-1.5 rounded-micro border border-border bg-background/60 px-2 py-0.5 font-mono text-mono-label text-foreground/70">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(data.date)}
                </span>
              )}
            </h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              {data ? data.routineName : 'Carregando sua rotina de hoje…'}
            </p>
          </div>
        </div>

        {data && (
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="h-4 w-4" />
              Ver compliance
            </Button>
          </Link>
        )}
      </header>

      {/* Conteúdo */}
      {isLoading && (
        <Card>
          <CardContent className="space-y-3 pt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </CardContent>
        </Card>
      )}

      {!data && !isLoading && (
        <EmptyState
          icon={<span>💪</span>}
          title="Nenhuma rotina ativa"
          description="Gere uma rotina para começar a acompanhar seus exercícios diários."
          action={
            <Link to="/workouts/new">
              <Button>Gerar rotina</Button>
            </Link>
          }
        />
      )}

      {data && (
        <Card>
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle>Exercícios do dia {data.dayNumber}</CardTitle>
            <CardDescription>
              Endpoint: <code className="font-mono text-primary">GET /workouts/today</code> ·{' '}
              <code className="font-mono text-primary">POST /workouts/log</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <TodayExerciseList
              data={data}
              onComplete={handleComplete}
              onUndo={handleUndo}
            />
          </CardContent>
        </Card>
      )}

      {/* Modal de log */}
      <ExerciseLogDialog
        open={dialog.open}
        onOpenChange={(o) => !o && closeDialog()}
        exercise={dialog.exercise}
        mode={dialog.mode}
      />
    </section>
  );
}