import type { BodyPart, Difficulty, WorkoutGoal, WorkoutStatus } from '@/lib/constants';

/* ---------- POST /workouts/generate ---------- */

export interface GenerateWorkoutRequest {
    name: string;
    goal: WorkoutGoal;
    periodDays: number;
    bodyParts: BodyPart[];
    difficulty: Difficulty;
}

export interface WorkoutExercise {
    id: number;
    dayNumber: number;
    exerciseName: string;
    wgerExerciseId: number;
    sets: number;
    reps: number;
    weight: number | null;
    orderInDay: number;
    completed?: boolean;
}

export interface WorkoutRoutineResponse {
    id: number;
    name: string;
    goal: WorkoutGoal;
    startDate: string; // YYYY-MM-DD
    endDate: string;
    status: WorkoutStatus;
    totalDays: number;
    totalExercises: number;
    exercises: WorkoutExercise[];
}

/* ---------- GET /workouts (listagem) ---------- */

export interface WorkoutRoutineListItem {
    id: number;
    name: string;
    goal: WorkoutGoal;
    startDate: string;
    endDate: string;
    status: WorkoutStatus;
    totalDays: number;
    totalExercises: number;
    completionPercent: number;
}

/* ---------- PUT /workouts/{id}/status ---------- */

export interface UpdateWorkoutStatusRequest {
    status: WorkoutStatus;
}

/* ---------- GET /workouts/today ---------- */

export interface TodayExercise {
    id: number;
    exerciseName: string;
    wgerExerciseId: number;
    sets: number;
    reps: number;
    weight: number | null;
    orderInDay: number;
    completed: boolean;
}

export interface TodayWorkoutResponse {
    routineName: string;
    dayNumber: number;
    date: string; // YYYY-MM-DD
    exercises: TodayExercise[];
    completionPercent: number;
}

/* ---------- POST /workouts/log ---------- */

export interface ExerciseLogRequest {
    workoutExerciseId: number;
    date: string; // YYYY-MM-DD
    completed: boolean;
    weightUsed?: number;
}

export interface ExerciseLogResponse {
    id: number;
    workoutExerciseId: number;
    date: string;
    completed: boolean;
    weightUsed: number | null;
}

/* ---------- GET /workouts/{id}/progress ---------- */

export interface WorkoutProgressResponse {
    routineId: number;
    totalExercises: number;
    completedExercises: number;
    completionPercent: number;
    daysCompleted: number;
    totalDays: number;
}