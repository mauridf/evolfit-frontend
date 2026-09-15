import { get } from '@/lib/api/client';
import type {
    DashboardComplianceResponse,
    DashboardProgressResponse,
    DashboardResponse,
} from '@/types/dashboard.types';

/* GET /dashboard */
export function getDashboard(): Promise<DashboardResponse> {
    return get<DashboardResponse>('/dashboard');
}

/* GET /dashboard/progress?period=90 */
export function getDashboardProgress(period = 90): Promise<DashboardProgressResponse> {
    return get<DashboardProgressResponse>('/dashboard/progress', { params: { period } });
}

/* GET /dashboard/compliance?days=7 */
export function getDashboardCompliance(days = 7): Promise<DashboardComplianceResponse> {
    return get<DashboardComplianceResponse>('/dashboard/compliance', { params: { days } });
}