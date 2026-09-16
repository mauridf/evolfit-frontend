import { del, get, getOptional, post, put } from '@/lib/api/client';
import type { Paginated, PaginationParams } from '@/types/api.types';
import type {
    ExerciseLogRequest,
    ExerciseLogResponse,
    GenerateWorkoutRequest,
    TodayWorkoutResponse,
    UpdateWorkoutStatusRequest,
    WorkoutProgressResponse,
    WorkoutRoutineListItem,
    WorkoutRoutineResponse,
} from '@/types/workout.types';

/* POST /workouts/generate */
export function generateWorkout(
    body: GenerateWorkoutRequest,
): Promise<WorkoutRoutineResponse> {
    return post<WorkoutRoutineResponse, GenerateWorkoutRequest>('/workouts/generate', body);
}

/* GET /workouts?page=&pageSize=&status= */
export function listWorkouts(
    params: PaginationParams & { status?: number } = {},
): Promise<Paginated<WorkoutRoutineListItem>> {
    const { page = 1, pageSize = 20, status } = params;
    return get<Paginated<WorkoutRoutineListItem>>('/workouts', {
        params: { page, pageSize, ...(status !== undefined && { status }) },
    });
}

/* GET /workouts/{id} */
export function getWorkoutById(id: number): Promise<WorkoutRoutineResponse> {
    return get<WorkoutRoutineResponse>(`/workouts/${id}`);
}

/* PUT /workouts/{id}/status */
export function updateWorkoutStatus(
    id: number,
    body: UpdateWorkoutStatusRequest,
): Promise<void> {
    return put<void, UpdateWorkoutStatusRequest>(`/workouts/${id}/status`, body);
}

/* GET /workouts/today — 404 (sem rotina ativa) vira null */
export function getTodayWorkout(): Promise<TodayWorkoutResponse | null> {
    return getOptional<TodayWorkoutResponse>('/workouts/today');
}

/* POST /workouts/log */
export function logExercise(body: ExerciseLogRequest): Promise<ExerciseLogResponse> {
    return post<ExerciseLogResponse, ExerciseLogRequest>('/workouts/log', body);
}

/* GET /workouts/{id}/progress */
export function getWorkoutProgress(id: number): Promise<WorkoutProgressResponse> {
    return get<WorkoutProgressResponse>(`/workouts/${id}/progress`);
}

/* DELETE /workouts/{id} */
export function deleteWorkout(id: number): Promise<void> {
    return del<void>(`/workouts/${id}`);
}