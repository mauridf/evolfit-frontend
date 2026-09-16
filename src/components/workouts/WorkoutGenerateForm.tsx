/* eslint-disable react-hooks/incompatible-library */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Dumbbell, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { generateWorkoutSchema, type GenerateWorkoutFormData } from '@/schemas/workout.schema';
import { useGenerateWorkout } from '@/hooks/useWorkouts';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';
import {
  BODY_PART_LABELS,
  BODY_PARTS_ORDER,
  DIFFICULTY_LABELS,
  PERIOD_DAYS_MAX,
  PERIOD_DAYS_MIN,
  WORKOUT_GOAL_LABELS,
  type BodyPart,
} from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

export function WorkoutGenerateForm() {
  const navigate = useNavigate();
  const generate = useGenerateWorkout();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GenerateWorkoutFormData>({
    resolver: zodResolver(generateWorkoutSchema),
    defaultValues: {
      name: '',
      goal: 'hypertrophy',
      periodDays: 30,
      bodyParts: [],
      difficulty: 'intermediate',
    },
  });

  const selectedParts = watch('bodyParts');
  const periodDays = watch('periodDays');
  const previewCount =
    selectedParts.length > 0 && typeof periodDays === 'number'
      ? Math.round(periodDays * Math.max(2, selectedParts.length))
      : 0;

  function togglePart(part: BodyPart) {
    const current = watch('bodyParts');
    const next = current.includes(part)
      ? current.filter((p) => p !== part)
      : [...current, part];
    setValue('bodyParts', next, { shouldValidate: true, shouldDirty: true });
  }

  async function onSubmit(data: GenerateWorkoutFormData) {
    try {
      const workout = await generate.mutateAsync(data);
      navigate(`/workouts/${workout.id}`);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const fieldErrors = extractFieldErrors(parseApiError(err).problem);
        for (const [field, messages] of Object.entries(fieldErrors)) {
          const k = field as keyof GenerateWorkoutFormData;
          setError(k, { message: messages[0] ?? 'Inválido.' });
        }
        return;
      }
      const { problem } = parseApiError(err);
      toast.error(problem.title || 'Erro ao gerar rotina.', problem.detail);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#F59E0B]" />
            Gerar nova rotina
          </CardTitle>
          <CardDescription>
            Endpoint: <code className="font-mono text-primary">POST /workouts/generate</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <FormField label="Nome da rotina" htmlFor="w-name" required error={errors.name?.message} hint="3–255 caracteres">
            <Input id="w-name" invalid={!!errors.name} placeholder="Ex.: Treino Full Body" {...register('name')} />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Objetivo" htmlFor="w-goal" required error={errors.goal?.message}>
              <Select id="w-goal" invalid={!!errors.goal} {...register('goal')}>
                {Object.entries(WORKOUT_GOAL_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Período (dias)"
              htmlFor="w-period"
              required
              error={errors.periodDays?.message}
              hint={`${PERIOD_DAYS_MIN} – ${PERIOD_DAYS_MAX} dias (VALID-002)`}
            >
              <Input
                id="w-period"
                type="number"
                inputMode="numeric"
                invalid={!!errors.periodDays}
                {...register('periodDays', { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Dificuldade" htmlFor="w-diff" required error={errors.difficulty?.message}>
              <Select id="w-diff" invalid={!!errors.difficulty} {...register('difficulty')}>
                {Object.entries(DIFFICULTY_LABELS).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField
            label="Partes do corpo"
            required
            error={errors.bodyParts?.message as string | undefined}
            hint="Selecione ao menos uma."
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BODY_PARTS_ORDER.map((part) => (
                <Checkbox
                  key={part}
                  label={BODY_PART_LABELS[part]}
                  checked={selectedParts.includes(part)}
                  onChange={() => togglePart(part)}
                />
              ))}
            </div>
          </FormField>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            Prévia
          </CardTitle>
          <CardDescription>
            Estimativa baseada nas partes do corpo e no período selecionados.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {previewCount > 0 ? (
            <p className="font-mono text-body-md text-foreground/80">
              <span className="text-primary">{previewCount}</span> exercícios em{' '}
              <span className="text-primary">{periodDays}</span> dias
              <span className="ml-2 text-foreground/50">
                (~{Math.max(2, selectedParts.length)} por dia)
              </span>
            </p>
          ) : (
            <p className={cn('font-mono text-body-sm text-foreground/50')}>
              Selecione partes do corpo para ver a prévia.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/workouts')}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <Sparkles className="h-4 w-4" />
          Gerar rotina
        </Button>
      </div>
    </form>
  );
}