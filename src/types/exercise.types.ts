/* ---------- GET /exercises/search ---------- */

export interface ExerciseSearchResult {
    id: number;
    name: string;
    description: string;
    category: string;
    muscles: string[];
}

export interface ExerciseSearchResponse {
    results: ExerciseSearchResult[];
}

/* ---------- GET /exercises/{id} ---------- */

export interface ExerciseDetailResponse {
    id: number;
    name: string;
    description: string;
    category: string;
    muscles: string[];
    equipment: string[];
    images: string[];
}