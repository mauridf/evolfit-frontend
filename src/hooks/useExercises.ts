import { useQuery } from '@tanstack/react-query';
import * as exercisesService from '@/services/exercises.service';
import { queryKeys } from '@/lib/api/queryClient';

export function useExerciseSearch(term: string, enabled = true) {
    const trimmed = term.trim();
    return useQuery({
        queryKey: queryKeys.exerciseSearch(trimmed),
        queryFn: () => exercisesService.searchExercises(trimmed),
        enabled: enabled && trimmed.length >= 2,
        staleTime: 5 * 60_000, // cache de 5 min na sessão (wger já cacheia 7d no backend)
        placeholderData: (prev) => prev,
    });
}

export function useExerciseDetail(id: number, enabled = true) {
    return useQuery({
        queryKey: queryKeys.exerciseDetail(id),
        queryFn: () => exercisesService.getExerciseById(id),
        enabled: enabled && Number.isFinite(id) && id > 0,
        staleTime: 30 * 60_000, // detalhes mudam raramente
    });
}