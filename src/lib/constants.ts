/**
 * Enums, labels e ranges do domínio EvolFit.
 * Fonte: API_REFERENCE.md §4 (Health), §5 (Workouts), MASTER_SPECIFICATION §33.
 */

/* ------------------------------------------------------------------ */
/* Ranges e limites (VALID-001 / VALID-002 / VALID-003)                */
/* ------------------------------------------------------------------ */

export const WEIGHT_KG_MIN = 40;
export const WEIGHT_KG_MAX = 300;

export const HEIGHT_CM_MIN = 100;
export const HEIGHT_CM_MAX = 250;

export const AGE_MIN = 10;
export const AGE_MAX = 120;

export const PERIOD_DAYS_MIN = 7;
export const PERIOD_DAYS_MAX = 180;

export const PASSWORD_MIN = 8;

/* ------------------------------------------------------------------ */
/* Auth                                                               */
/* ------------------------------------------------------------------ */

export type Gender = 'male' | 'female';

export const GENDER_LABELS: Record<Gender, string> = {
    male: 'Masculino',
    female: 'Feminino',
};

/* ------------------------------------------------------------------ */
/* Health — Activity Level                                            */
/* ------------------------------------------------------------------ */

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'extreme';

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
    sedentary: 'Sedentário (pouco ou nenhum exercício)',
    light: 'Leve (1–3x por semana)',
    moderate: 'Moderado (3–5x por semana)',
    active: 'Ativo (6–7x por semana)',
    extreme: 'Extremo (atleta / 2x por dia)',
};

export const ACTIVITY_LEVEL_ORDER: ActivityLevel[] = [
    'sedentary',
    'light',
    'moderate',
    'active',
    'extreme',
];

/* ------------------------------------------------------------------ */
/* Workouts — Goal, BodyPart, Difficulty, Status                      */
/* ------------------------------------------------------------------ */

export type WorkoutGoal = 'strength' | 'hypertrophy' | 'endurance' | 'flexibility' | 'cardio';

export const WORKOUT_GOAL_LABELS: Record<WorkoutGoal, string> = {
    strength: 'Força',
    hypertrophy: 'Hipertrofia',
    endurance: 'Resistência',
    flexibility: 'Flexibilidade',
    cardio: 'Cardiovascular',
};

export type BodyPart =
    | 'chest'
    | 'back'
    | 'legs'
    | 'glutes'
    | 'shoulders'
    | 'arms'
    | 'abs'
    | 'cardio';

export const BODY_PART_LABELS: Record<BodyPart, string> = {
    chest: 'Peito',
    back: 'Costas',
    legs: 'Pernas',
    glutes: 'Glúteos',
    shoulders: 'Ombros',
    arms: 'Braços',
    abs: 'Abdômen',
    cardio: 'Cardiovascular',
};

export const BODY_PARTS_ORDER: BodyPart[] = [
    'chest',
    'back',
    'legs',
    'glutes',
    'shoulders',
    'arms',
    'abs',
    'cardio',
];

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
};

/** Status da rotina (Proposta_Tela §2). */
export type WorkoutStatus = 0 | 1 | 2;

export const WORKOUT_STATUS = {
    paused: 0,
    active: 1,
    completed: 2,
} as const;

export const WORKOUT_STATUS_LABELS: Record<WorkoutStatus, string> = {
    0: 'Pausada',
    1: 'Ativa',
    2: 'Concluída',
};

/* ------------------------------------------------------------------ */
/* Dashboard — períodos disponíveis                                   */
/* ------------------------------------------------------------------ */

export const DASHBOARD_PERIOD_OPTIONS = [30, 60, 90, 180, 365] as const;
export const COMPLIANCE_DAYS_OPTIONS = [7, 14, 30] as const;