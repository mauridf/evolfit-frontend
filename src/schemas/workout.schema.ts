import { z } from 'zod';
import {
    BODY_PARTS_ORDER,
    DIFFICULTY_LABELS,
    PERIOD_DAYS_MAX,
    PERIOD_DAYS_MIN,
    WORKOUT_GOAL_LABELS,
    type BodyPart,
    type Difficulty,
    type WorkoutGoal,
} from '@/lib/constants';

export const generateWorkoutSchema = z.object({
    name: z
        .string()
        .min(3, 'O nome deve ter ao menos 3 caracteres.')
        .max(255, 'O nome deve ter no máximo 255 caracteres.'),
    // Casts preservando os literais — `[string, ...string[]]` alargaria para `string`.
    goal: z.enum(Object.keys(WORKOUT_GOAL_LABELS) as [WorkoutGoal, ...WorkoutGoal[]], {
        error: 'Selecione o objetivo.',
    }),
    periodDays: z
        .number({ error: 'Informe um número.' })
        .int('O período deve ser um número inteiro de dias.')
        .min(PERIOD_DAYS_MIN, `O período deve estar entre ${PERIOD_DAYS_MIN} e ${PERIOD_DAYS_MAX} dias.`)
        .max(PERIOD_DAYS_MAX, `O período deve estar entre ${PERIOD_DAYS_MIN} e ${PERIOD_DAYS_MAX} dias.`),
    bodyParts: z
        .array(z.enum(BODY_PARTS_ORDER as [BodyPart, ...BodyPart[]]))
        .min(1, 'Selecione ao menos uma parte do corpo.'),
    difficulty: z.enum(Object.keys(DIFFICULTY_LABELS) as [Difficulty, ...Difficulty[]], {
        error: 'Selecione a dificuldade.',
    }),
});
export type GenerateWorkoutFormData = z.infer<typeof generateWorkoutSchema>;

export const exerciseLogSchema = z.object({
    workoutExerciseId: z.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.'),
    completed: z.boolean(),
    weightUsed: z
        .number({ error: 'Informe um número.' })
        .min(0, 'Peso não pode ser negativo.')
        .max(500, 'Peso muito alto.')
        .optional(),
});
export type ExerciseLogFormData = z.infer<typeof exerciseLogSchema>;