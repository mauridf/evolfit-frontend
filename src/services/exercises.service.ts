import { get } from '@/lib/api/client';
import type { ExerciseDetailResponse, ExerciseSearchResponse } from '@/types/exercise.types';

/* GET /exercises/search?term=...&language=all */
export function searchExercises(
    term: string,
    language: 'all' | 'english' | 'portuguese' = 'all',
): Promise<ExerciseSearchResponse> {
    return get<ExerciseSearchResponse>('/exercises/search', {
        params: { term, language },
    });
}

/* GET /exercises/{id} */
export function getExerciseById(id: number): Promise<ExerciseDetailResponse> {
    return get<ExerciseDetailResponse>(`/exercises/${id}`);
}