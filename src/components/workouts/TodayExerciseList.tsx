import { CheckCircle2, Circle, RotateCcw, Scale } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils/cn';
import { formatPercent } from '@/lib/format';
import type { TodayExercise, TodayWorkoutResponse } from '@/types/workout.types';

export interface TodayExerciseListProps {
  data: TodayWorkoutResponse;
  onComplete: (exercise: TodayExercise) => void;
  onUndo: (exercise: TodayExercise) => void;
}

export function TodayExerciseList({ data, onComplete, onUndo }: TodayExerciseListProps) {
  const completed = data.exercises.filter((e) => e.completed).length;

  return (
    <div className="space-y-4">
      {/* Barra de progresso */}
      <div className="flex items-center gap-3">
        <ProgressBar value={data.completionPercent} className="flex-1" />
        <span className="min-w-24 text-right font-mono text-mono-label text-foreground/80">
          {completed}/{data.exercises.length} · {formatPercent(data.completionPercent)}
        </span>
      </div>

      {/* Lista */}
      <ul className="space-y-2">
        {data.exercises.map((ex) => (
          <li
            key={ex.id}
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 rounded-input border border-border/60 bg-background/40 p-3 transition-colors',
              ex.completed && 'border-primary/40 bg-primary/5',
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                aria-hidden
                className={cn(
                  'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-micro border',
                  ex.completed
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-input text-foreground/40',
                )}
              >
                {ex.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-body-md text-foreground">
                  <span className="mr-2 font-mono text-mono-label text-foreground/50">
                    #{ex.orderInDay}
                  </span>
                  {ex.exerciseName}
                </p>
                <p className="mt-0.5 font-mono text-mono-label text-foreground/60">
                  {ex.sets}×{ex.reps}
                  {ex.weight != null ? ` · ${ex.weight} kg` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {ex.completed ? (
                <>
                  <span className="hidden font-mono text-mono-label text-primary sm:inline">
                    ✓ Concluído
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => onUndo(ex)}>
                    <RotateCcw className="h-4 w-4" />
                    Desfazer
                  </Button>
                </>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => onComplete(ex)}>
                  <Scale className="h-4 w-4" />
                  Concluir
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}