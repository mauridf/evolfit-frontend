import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { WorkoutExercise } from '@/types/workout.types';

export interface WorkoutDayNavigatorProps {
  exercises: WorkoutExercise[];
  totalDays: number;
  /** Chamado ao clicar em "Concluir" de um exercício. */
  onLog?: (exercise: WorkoutExercise) => void;
}

export function WorkoutDayNavigator({ exercises, totalDays, onLog }: WorkoutDayNavigatorProps) {
  const daysWithExercises = Array.from(new Set(exercises.map((e) => e.dayNumber))).sort(
    (a, b) => a - b,
  );
  const [dayIdx, setDayIdx] = useState(0);
  const currentDay = daysWithExercises[dayIdx] ?? 1;

  const dayExercises = exercises
    .filter((e) => e.dayNumber === currentDay)
    .sort((a, b) => a.orderInDay - b.orderInDay);

  return (
    <div className="space-y-4">
      {/* Navegação */}
      <div className="flex items-center justify-between rounded-input border border-border/60 bg-background/40 p-3">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Dia anterior"
          disabled={dayIdx === 0}
          onClick={() => setDayIdx((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-mono text-mono-label text-foreground/80">
          Dia {currentDay} de {totalDays}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Próximo dia"
          disabled={dayIdx >= daysWithExercises.length - 1}
          onClick={() => setDayIdx((i) => Math.min(daysWithExercises.length - 1, i + 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Exercícios do dia */}
      <ul className="space-y-2">
        {dayExercises.map((ex) => (
          <li
            key={ex.id}
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 rounded-input border border-border/60 bg-background/40 p-3',
              ex.completed && 'border-primary/40 bg-primary/5',
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-body-md text-foreground">
                <span className="mr-2 font-mono text-mono-label text-foreground/50">
                  #{ex.orderInDay}
                </span>
                {ex.exerciseName}
              </p>
              <p className="mt-0.5 font-mono text-mono-label text-foreground/60">
                {ex.sets}×{ex.reps}
                {ex.weight != null && ` · ${ex.weight} kg`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {ex.completed ? (
                <span className="inline-flex items-center gap-1.5 rounded-micro border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-mono-label text-primary">
                  ✓ Concluído
                </span>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => onLog?.(ex)}>
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