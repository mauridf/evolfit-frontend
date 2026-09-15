import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as healthService from '@/services/health.service';
import { queryKeys } from '@/lib/api/queryClient';
import { toast } from '@/lib/ui/toast';
import type { PaginationParams } from '@/types/api.types';
import type { CreateHealthMetricRequest } from '@/types/health.types';

/* --------------------- Queries --------------------- */

export function useHealthMetrics(params: PaginationParams = {}) {
    const { page = 1, pageSize = 20 } = params;
    return useQuery({
        queryKey: queryKeys.healthMetrics(page, pageSize),
        queryFn: () => healthService.listMetrics({ page, pageSize }),
        placeholderData: (prev) => prev,
    });
}

export function useLatestHealthMetric() {
    return useQuery({
        queryKey: queryKeys.healthLatest,
        queryFn: healthService.getLatestMetric,
    });
}

export function useHealthMetric(id: number, enabled = true) {
    return useQuery({
        queryKey: queryKeys.healthMetric(id),
        queryFn: () => healthService.getMetricById(id),
        enabled: enabled && Number.isFinite(id) && id > 0,
    });
}

export function useHealthEvolution(period = 90) {
    return useQuery({
        queryKey: queryKeys.healthEvolution(period),
        queryFn: () => healthService.getEvolution(period),
    });
}

/* --------------------- Mutations --------------------- */

export function useCreateHealthMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateHealthMetricRequest) => healthService.createMetric(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        },
    });
}

export function useDeleteHealthMetric() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => healthService.deleteMetric(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['health'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
            toast.success('Medição removida.');
        },
    });
}