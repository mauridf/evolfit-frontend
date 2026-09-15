import { useState } from 'react';
import { Plus, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { DashboardKpiGrid } from '@/components/dashboard/DashboardKpiGrid';
import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState';
import { DashboardStateSwitcher, type DashboardView } from '@/components/dashboard/DashboardStateSwitcher';
import { DashboardProgressCard } from '@/components/dashboard/DashboardProgressCard';
import { DashboardWeeklyCompliance } from '@/components/dashboard/DashboardWeeklyCompliance';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/stores/auth.store';

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const { data, isLoading, isError, refetch } = useDashboard();
    const [devView, setDevView] = useState<DashboardView>('populated');

    // Detecção do estado vazio real (produção): sem métricas E sem rotina ativa.
    const isEmptyReal =
        !!data && data.totalHealthMetrics === 0 && data.activeRoutines === 0;

    // Em DEV, o switcher permite forçar a visualização.
    const isEmpty = import.meta.env.DEV ? devView === 'empty' : isEmptyReal;

    return (
        <section className="space-y-8">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-headline-xl text-foreground">Dashboard</h1>
                        <span className="rounded-pill border border-[#0EA5E9]/40 bg-[#0EA5E9]/15 px-2 py-0.5 font-mono text-mono-label text-[#0EA5E9]">
                            GET /dashboard
                        </span>
                        <span className="hidden text-body-sm text-foreground/50 lg:inline">
                            · Sincronizado via TinyFn
                        </span>
                    </div>
                    <p className="mt-1 text-body-sm text-foreground/60">
                        Visão geral do seu desempenho biométrico, metas e cronograma de treinos.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {import.meta.env.DEV && (
                        <DashboardStateSwitcher value={devView} onChange={setDevView} />
                    )}
                    <Link to="/health/new">
                        <Button variant="secondary" size="md">
                            <Plus className="h-4 w-4" />
                            Nova medição
                        </Button>
                    </Link>
                    <Link to="/workouts/today">
                        <Button size="md">
                            <PlayCircle className="h-4 w-4" />
                            Treinar agora
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Conteúdo */}
            {isLoading && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                    <Skeleton className="h-64" />
                </div>
            )}

            {isError && (
                <EmptyState
                    icon={<span>⚠️</span>}
                    title="Não foi possível carregar o dashboard"
                    description="Tente novamente em instantes."
                    action={
                        <Button variant="secondary" onClick={() => void refetch()}>
                            Tentar novamente
                        </Button>
                    }
                />
            )}

            {data && isEmpty && <DashboardEmptyState userName={user?.displayName} />}

            {data && !isEmpty && (
                <>
                    <DashboardKpiGrid data={data} />

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        <TodayWorkoutCard />
                        <DashboardWeeklyCompliance days={7} />
                    </div>

                    <DashboardProgressCard initialPeriod={90} />

                    <DashboardWeeklyCompliance days={7} />
                </>
            )}
        </section>
    );
}