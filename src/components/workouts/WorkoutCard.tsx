import { ArrowRight, Calendar, Dumbbell, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WorkoutStatusBadge } from './WorkoutStatusBadge';
import type { WorkoutRoutineListItem } from '@/types/workout.types';
import { WORKOUT_GOAL_LABELS } from '@/lib/constants';
import { formatDate, formatPercent } from '@/lib/format';

export interface WorkoutCardProps {
  workout: WorkoutRoutineListItem;
  onDelete?: (id: number) => void | Promise<void>;
}

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  const isActive = workout.status === 1;

  return (
    <Card className="card-interactive overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6">
          {/* Linha 1: nome + badge de status */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-[#F59E0B]" aria-hidden />
                <h3 className="truncate text-headline-sm text-foreground">{workout.name}</h3>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-body-sm text-foreground/60">
                <span>{WORKOUT_GOAL_LABELS[workout.goal]}</span>
                <span aria-hidden>·</span>
                <span>{workout.totalDays} dias</span>
                <span aria-hidden>·</span>
                <span>{workout.totalExercises} exercícios</span>
              </p>
            </div>
            <WorkoutStatusBadge status={workout.status} />
          </div>

          {/* Linha 2: período + progresso */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-body-sm text-foreground/70">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              <span className="font-mono text-mono-body">
                {formatDate(workout.startDate)} → {formatDate(workout.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ProgressBar
                value={workout.completionPercent}
                tone={isActive ? 'primary' : 'info'}
                className="flex-1"
              />
              <span className="min-w-12 text-right font-mono text-mono-label text-foreground/80">
                {formatPercent(workout.completionPercent)}
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé: ver detalhe + excluir */}
        <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-background/30 px-6 py-3">
          <Link
            to={`/workouts/${workout.id}`}
            className="inline-flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-accent"
          >
            Ver detalhe
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>

          {onDelete && (
            <ConfirmDialog
              trigger={
                <Button variant="ghost" size="sm" aria-label="Excluir rotina">
                  <Trash2 className="h-4 w-4 text-danger" />
                </Button>
              }
              title="Excluir rotina?"
              description={`"${workout.name}" e todos os exercícios e logs serão removidos definitivamente (cascade).`}
              confirmLabel="Excluir"
              onConfirm={() => onDelete(workout.id)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}