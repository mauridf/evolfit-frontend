import { del, get, post } from '@/lib/api/client';
import type { Paginated, PaginationParams } from '@/types/api.types';
import type {
    CreateHealthMetricRequest,
    HealthEvolutionResponse,
    HealthMetricListItem,
    HealthMetricResponse,
} from '@/types/health.types';

/* POST /health/metrics */
export function createMetric(body: CreateHealthMetricRequest): Promise<HealthMetricResponse> {
    return post<HealthMetricResponse, CreateHealthMetricRequest>('/health/metrics', body);
}

/* GET /health/metrics?page=&pageSize= */
export function listMetrics(
    { page = 1, pageSize = 20 }: PaginationParams = {},
): Promise<Paginated<HealthMetricListItem>> {
    return get<Paginated<HealthMetricListItem>>('/health/metrics', {
        params: { page, pageSize },
    });
}

/* GET /health/metrics/latest */
export function getLatestMetric(): Promise<HealthMetricResponse> {
    return get<HealthMetricResponse>('/health/metrics/latest');
}

/* GET /health/metrics/{id} */
export function getMetricById(id: number): Promise<HealthMetricResponse> {
    return get<HealthMetricResponse>(`/health/metrics/${id}`);
}

/* GET /health/metrics/evolution?period=90 */
export function getEvolution(period = 90): Promise<HealthEvolutionResponse> {
    return get<HealthEvolutionResponse>('/health/metrics/evolution', { params: { period } });
}

/* DELETE /health/metrics/{id} */
export function deleteMetric(id: number): Promise<void> {
    return del<void>(`/health/metrics/${id}`);
}