import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { exerciseLogSchema, type ExerciseLogFormData } from '@/schemas/workout.schema';
import { useLogExercise } from '@/hooks/useWorkouts';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';
import { toIsoDate } from '@/lib/format';
import type { TodayExercise } from '@/types/workout.types';

export interface ExerciseLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise: TodayExercise | null;
  /** Ação: 'complete' (default) ou 'undo'. */
  mode?: 'complete' | 'undo';
  date?: string; // ISO; padrão hoje
}

export function ExerciseLogDialog({
  open,
  onOpenChange,
  exercise,
  mode = 'complete',
  date,
}: ExerciseLogDialogProps) {
  const log = useLogExercise();
  const isUndo = mode === 'undo';

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseLogFormData>({
    resolver: zodResolver(exerciseLogSchema),
    defaultValues: {
      workoutExerciseId: exercise?.id ?? 0,
      date: date ?? toIsoDate(new Date()),
      completed: !isUndo,
      weightUsed: undefined,
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      workoutExerciseId: exercise?.id ?? 0,
      date: date ?? toIsoDate(new Date()),
      completed: !isUndo,
      weightUsed: exercise?.weight ?? undefined,
    });
  }, [open, exercise, date, isUndo, reset]);

  async function onSubmit(data: ExerciseLogFormData) {
    try {
      await log.mutateAsync({
        workoutExerciseId: data.workoutExerciseId,
        date: data.date,
        completed: data.completed,
        weightUsed: data.weightUsed,
      });
      toast.success(isUndo ? 'Marcação desfeita.' : 'Exercício concluído.');
      onOpenChange(false);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const fieldErrors = extractFieldErrors(parseApiError(err).problem);
        for (const [field, messages] of Object.entries(fieldErrors)) {
          const k = field as keyof ExerciseLogFormData;
          setError(k, { message: messages[0] ?? 'Inválido.' });
        }
        return;
      }
      const { problem } = parseApiError(err);
      toast.error(problem.title || 'Erro ao registrar.', problem.detail);
    }
  }

  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isUndo ? 'Desfazer conclusão' : 'Registrar conclusão'}
        description={`${exercise.exerciseName} · ${exercise.sets}×${exercise.reps} · #${exercise.orderInDay}`}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <input type="hidden" {...register('workoutExerciseId', { valueAsNumber: true })} />
          <input type="hidden" {...register('completed')} />

          {!isUndo && (
            <FormField
              label="Peso usado (kg)"
              htmlFor="log-weight"
              error={errors.weightUsed?.message}
              hint="Opcional — deixe vazio para registrar sem carga."
            >
              <Input
                id="log-weight"
                type="number"
                step="0.5"
                inputMode="decimal"
                invalid={!!errors.weightUsed}
                {...register('weightUsed', {
                  setValueAs: (v) => (v === '' ? undefined : Number(v)),
                })}
              />
            </FormField>
          )}

          <FormField label="Data" htmlFor="log-date" required error={errors.date?.message}>
            <Input id="log-date" type="date" invalid={!!errors.date} {...register('date')} />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting} variant={isUndo ? 'danger' : 'primary'}>
              {isUndo ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  Desfazer
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Confirmar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}