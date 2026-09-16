import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { createHealthMetricSchema, type CreateHealthMetricFormData } from '@/schemas/health.schema';
import { useCreateHealthMetric } from '@/hooks/useHealth';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';
import {
  ACTIVITY_LEVEL_LABELS,
  ACTIVITY_LEVEL_ORDER,
  GENDER_LABELS,
} from '@/lib/constants';
import { formatDecimal2, formatInt } from '@/lib/format';

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  extreme: 1.9,
};

/** Preview local (mesma fórmula do backend como estimativa visual). */
function previewBmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return m > 0 ? weightKg / (m * m) : 0;
}
function previewBmr(weightKg: number, heightCm: number, age: number, gender: string): number {
  // Mifflin-St Jeor (aproximação)
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

export function HealthMetricForm() {
  const navigate = useNavigate();
  const createMetric = useCreateHealthMetric();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateHealthMetricFormData>({
    resolver: zodResolver(createHealthMetricSchema),
    defaultValues: {
      weightKg: undefined as unknown as number,
      heightCm: undefined as unknown as number,
      gender: 'male',
      age: undefined as unknown as number,
      activityLevel: 'moderate',
    },
  });

  const values = watch();
  const canPreview =
    typeof values.weightKg === 'number' &&
    typeof values.heightCm === 'number' &&
    typeof values.age === 'number';

  const preview = canPreview
    ? {
        bmi: previewBmi(values.weightKg, values.heightCm),
        bmr: previewBmr(values.weightKg, values.heightCm, values.age, values.gender),
        tdee: Math.round(
          previewBmr(values.weightKg, values.heightCm, values.age, values.gender) *
            (ACTIVITY_MULTIPLIERS[values.activityLevel] ?? 1.55),
        ),
      }
    : null;

  async function onSubmit(data: CreateHealthMetricFormData) {
    try {
      const metric = await createMetric.mutateAsync(data);
      const isApprox = !metric.macrosSuggestion;
      if (isApprox) {
        toast.warning(
          'Cálculo aproximado',
          'A TinyFn não respondeu; usamos cálculo local (TFN-005).',
        );
      } else {
        toast.success('Medição salva com sucesso!');
      }
      navigate('/health');
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 422) {
        const fieldErrors = extractFieldErrors(parseApiError(err).problem);
        for (const [field, messages] of Object.entries(fieldErrors)) {
          const k = field as keyof CreateHealthMetricFormData;
          setError(k, { message: messages[0] ?? 'Inválido.' });
        }
        return;
      }
      const { problem } = parseApiError(err);
      toast.error(problem.title || 'Erro ao salvar medição.', problem.detail);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Nova medição de saúde</CardTitle>
          <CardDescription>
            Endpoint: <code className="font-mono text-primary">POST /health/metrics</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Peso (kg)" htmlFor="h-weight" required error={errors.weightKg?.message} hint="40 – 300 kg (VALID-001)">
              <Input
                id="h-weight"
                type="number"
                step="0.01"
                inputMode="decimal"
                invalid={!!errors.weightKg}
                {...register('weightKg', { valueAsNumber: true })}
              />
            </FormField>
            <FormField label="Altura (cm)" htmlFor="h-height" required error={errors.heightCm?.message} hint="100 – 250 cm (VALID-001)">
              <Input
                id="h-height"
                type="number"
                step="0.01"
                inputMode="decimal"
                invalid={!!errors.heightCm}
                {...register('heightCm', { valueAsNumber: true })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField label="Gênero" htmlFor="h-gender" required error={errors.gender?.message}>
              <Select id="h-gender" invalid={!!errors.gender} {...register('gender')}>
                <option value="male">{GENDER_LABELS.male}</option>
                <option value="female">{GENDER_LABELS.female}</option>
              </Select>
            </FormField>

            <FormField label="Idade" htmlFor="h-age" required error={errors.age?.message} hint="10 – 120 anos">
              <Input
                id="h-age"
                type="number"
                inputMode="numeric"
                invalid={!!errors.age}
                {...register('age', { valueAsNumber: true })}
              />
            </FormField>

            <FormField label="Nível de atividade" htmlFor="h-activity" required error={errors.activityLevel?.message}>
              <Select id="h-activity" invalid={!!errors.activityLevel} {...register('activityLevel')}>
                {ACTIVITY_LEVEL_ORDER.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {ACTIVITY_LEVEL_LABELS[lvl]}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </CardContent>
      </Card>

      {/* Preview TinyFn (local) */}
      <Card>
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Preview do cálculo
          </CardTitle>
          <CardDescription>
            Valores calculados localmente enquanto você digita; o cálculo oficial vem da TinyFn ao salvar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-3">
          <PreviewCell label="IMC" value={preview ? formatDecimal2(preview.bmi) : '—'} />
          <PreviewCell label="BMR" value={preview ? `${formatInt(preview.bmr)} kcal/dia` : '—'} />
          <PreviewCell label="TDEE" value={preview ? `${formatInt(preview.tdee)} kcal/dia` : '—'} />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={() => navigate('/health')}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          <Save className="h-4 w-4" />
          Salvar medição
        </Button>
      </div>
    </form>
  );
}

function PreviewCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-mono-metric-md font-bold text-primary">{value}</div>
    </div>
  );
}