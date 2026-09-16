import { Dumbbell, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { ExerciseSearchResult } from '@/types/exercise.types';

export interface ExerciseCardProps {
  exercise: ExerciseSearchResult;
  onOpen: (exercise: ExerciseSearchResult) => void;
}

export function ExerciseCard({ exercise, onOpen }: ExerciseCardProps) {
  return (
    <Card className="card-interactive transition-colors">
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-input border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 text-[#0EA5E9]">
            <Dumbbell className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-headline-sm text-foreground">{exercise.name}</h3>
            <p className="mt-0.5 flex items-center gap-2 text-body-sm text-foreground/60">
              <span>Categoria: {exercise.category}</span>
            </p>
          </div>
        </div>

        {exercise.muscles.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {exercise.muscles.slice(0, 4).map((m) => (
              <Badge key={m} tone="info">
                {m}
              </Badge>
            ))}
            {exercise.muscles.length > 4 && <Badge>+{exercise.muscles.length - 4}</Badge>}
          </div>
        )}

        <div className="flex items-center justify-end border-t border-border/60 pt-3">
          <Button variant="ghost" size="sm" onClick={() => onOpen(exercise)}>
            Ver detalhe
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}