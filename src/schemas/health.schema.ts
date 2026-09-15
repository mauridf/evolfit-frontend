import { z } from 'zod';
import { ACTIVITY_LEVEL_ORDER, GENDER_LABELS } from '@/lib/constants';
import { ageSchema, heightCmSchema, weightKgSchema } from './common.schema';

export const createHealthMetricSchema = z.object({
    weightKg: weightKgSchema,
    heightCm: heightCmSchema,
    gender: z.enum(Object.keys(GENDER_LABELS) as ['male', 'female'], {
        error: 'Selecione o gênero.',
    }),
    age: ageSchema,
    activityLevel: z.enum(ACTIVITY_LEVEL_ORDER as [string, ...string[]], {
        error: 'Selecione o nível de atividade.',
    }),
});
export type CreateHealthMetricFormData = z.infer<typeof createHealthMetricSchema>;

export const evolutionPeriodSchema = z.union([
    z.literal(30),
    z.literal(60),
    z.literal(90),
    z.literal(180),
    z.literal(365),
]);
export type EvolutionPeriod = z.infer<typeof evolutionPeriodSchema>;