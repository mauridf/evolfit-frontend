import { describe, expect, it } from 'vitest';
import { generateWorkoutSchema, exerciseLogSchema } from '@/schemas/workout.schema';

describe('workout.schema', () => {
  const valid = {
    name: 'Treino Full Body',
    goal: 'hypertrophy',
    periodDays: 30,
    bodyParts: ['chest', 'back'],
    difficulty: 'intermediate',
  };

  it('generateWorkoutSchema aceita entrada válida', () => {
    expect(generateWorkoutSchema.safeParse(valid).success).toBe(true);
  });

  it('rejeita período fora de 7–180 (VALID-002)', () => {
    expect(generateWorkoutSchema.safeParse({ ...valid, periodDays: 6 }).success).toBe(false);
    expect(generateWorkoutSchema.safeParse({ ...valid, periodDays: 181 }).success).toBe(false);
  });

  it('rejeita lista de bodyParts vazia', () => {
    expect(generateWorkoutSchema.safeParse({ ...valid, bodyParts: [] }).success).toBe(false);
  });

  it('exerciseLogSchema exige data ISO e permite peso opcional', () => {
    const base = { workoutExerciseId: 1, date: '2026-09-12', completed: true };
    expect(exerciseLogSchema.safeParse(base).success).toBe(true);
    expect(exerciseLogSchema.safeParse({ ...base, date: '12/09/2026' }).success).toBe(false);
    expect(exerciseLogSchema.safeParse({ ...base, weightUsed: 80 }).success).toBe(true);
  });
});