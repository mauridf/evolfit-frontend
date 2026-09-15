import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as workoutsService from '@/services/workouts.service';
import { queryKeys } from '@/lib/api/queryClient';
import { toast } from '@/lib/ui/toast';
import type { PaginationParams } from '@/types/api.types';
import type {
    ExerciseLogRequest,
    GenerateWorkoutRequest,
    UpdateWorkoutStatusRequest,
} from '@/types/workout.types';

/* --------------------- Queries --------------------- */

export function useWorkouts(params: PaginationParams & { status?: number } = {}) {
    const { page = 1, pageSize = 20, status } = params;
    const queryParams = { page, pageSize, ...(status !== undefined && { status }) };
    return useQuery({
        queryKey: queryKeys.workouts(queryParams),
        queryFn: () => workoutsService.listWorkouts(queryParams),
        placeholderData: (prev) => prev,
    });
}

export function useWorkout(id: number, enabled = true) {
    return useQuery({
        queryKey: queryKeys.workout(id),
        queryFn: () => workoutsService.getWorkoutById(id),
        enabled: enabled && Number.isFinite(id) && id > 0,
    });
}

export function useTodayWorkout() {
    return useQuery({
        queryKey: queryKeys.workoutToday,
        queryFn: workoutsService.getTodayWorkout,
    });
}

export function useWorkoutProgress(id: number, enabled = true) {
    return useQuery({
        queryKey: queryKeys.workoutProgress(id),
        queryFn: () => workoutsService.getWorkoutProgress(id),
        enabled: enabled && Number.isFinite(id) && id > 0,
    });
}

/* --------------------- Mutations --------------------- */

export function useGenerateWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: GenerateWorkoutRequest) => workoutsService.generateWorkout(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            toast.success('Rotina gerada com sucesso.');
        },
    });
}

export function useUpdateWorkoutStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateWorkoutStatusRequest }) =>
            workoutsService.updateWorkoutStatus(id, body),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.workout(variables.id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.workoutToday });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            toast.success('Status atualizado.');
        },
    });
}

export function useLogExercise() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ExerciseLogRequest) => workoutsService.logExercise(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workoutToday });
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        },
    });
}

export function useDeleteWorkout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => workoutsService.deleteWorkout(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workouts'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            toast.success('Rotina removida.');
        },
    });
}