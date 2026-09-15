import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '@/services/dashboard.service';
import { queryKeys } from '@/lib/api/queryClient';

export function useDashboard() {
    return useQuery({
        queryKey: queryKeys.dashboard,
        queryFn: dashboardService.getDashboard,
        refetchOnMount: 'always',
    });
}

export function useDashboardProgress(period = 90) {
    return useQuery({
        queryKey: queryKeys.dashboardProgress(period),
        queryFn: () => dashboardService.getDashboardProgress(period),
    });
}

export function useDashboardCompliance(days = 7) {
    return useQuery({
        queryKey: queryKeys.dashboardCompliance(days),
        queryFn: () => dashboardService.getDashboardCompliance(days),
    });
}