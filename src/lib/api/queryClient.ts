import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

/**
 * Regras gerais:
 * - Não repetir automaticamente requisições que falharam com 4xx (exceto 429).
 * - Repetir 2x em 5xx e falhas de rede, com backoff exponencial.
 * - Dados considerados "frescos" por 30s (reduz refetch agressivo).
 * - Refetch ao focar a janela desativado no MVP (evita surpresas durante o dev).
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
                if (error instanceof AxiosError) {
                    const status = error.response?.status ?? 0;
                    if (status >= 400 && status < 500 && status !== 429) return false;
                }
                return failureCount < 2;
            },
            retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
        },
        mutations: {
            retry: 0,
        },
    },
});

/* ------------------------------------------------------------------ */
/* Query keys centralizadas                                           */
/* ------------------------------------------------------------------ */

export const queryKeys = {
    // Auth
    profile: ['auth', 'profile'] as const,

    // Health
    healthMetrics: (page: number, pageSize: number) =>
        ['health', 'metrics', { page, pageSize }] as const,
    healthLatest: ['health', 'metrics', 'latest'] as const,
    healthMetric: (id: number) => ['health', 'metrics', id] as const,
    healthEvolution: (period: number) => ['health', 'evolution', period] as const,

    // Workouts
    workouts: (params: { page: number; pageSize: number; status?: number }) =>
        ['workouts', 'list', params] as const,
    workout: (id: number) => ['workouts', id] as const,
    workoutToday: ['workouts', 'today'] as const,
    workoutProgress: (id: number) => ['workouts', id, 'progress'] as const,

    // Exercises (wger)
    exerciseSearch: (term: string) => ['exercises', 'search', term] as const,
    exerciseDetail: (id: number) => ['exercises', id] as const,

    // Dashboard
    dashboard: ['dashboard'] as const,
    dashboardProgress: (period: number) => ['dashboard', 'progress', period] as const,
    dashboardCompliance: (days: number) => ['dashboard', 'compliance', days] as const,
} as const;