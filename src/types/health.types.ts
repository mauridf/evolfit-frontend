import type { ActivityLevel, Gender } from '@/lib/constants';

/* ---------- POST /health/metrics ---------- */

export interface CreateHealthMetricRequest {
    weightKg: number;
    heightCm: number;
    gender: Gender;
    age: number;
    activityLevel: ActivityLevel;
}

export interface MacrosSuggestion {
    proteinG: number;
    carbsG: number;
    fatG: number;
}

export interface HealthMetricResponse {
    id: number;
    heightCm: number;
    weightKg: number;
    bmi: number;
    bmr: number;
    tdee: number;
    activityLevel: ActivityLevel;
    measuredAt: string; // ISO-8601
    macrosSuggestion?: MacrosSuggestion;
}

/* ---------- GET /health/metrics (listagem) ---------- */

export interface HealthMetricListItem {
    id: number;
    weightKg: number;
    heightCm: number;
    bmi: number;
    bmr: number;
    tdee: number;
    activityLevel: ActivityLevel;
    measuredAt: string;
}

/* ---------- GET /health/metrics/evolution ---------- */

export interface HealthEvolutionPoint {
    date: string;
    bmi: number;
    weightKg: number;
}

export interface HealthEvolutionResponse {
    data: HealthEvolutionPoint[];
    startBmi: number;
    currentBmi: number;
    bmiChange: number;
    startWeight: number;
    currentWeight: number;
    weightChange: number;
}