import { ArrowRight, ListChecks } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTodayWorkout } from '@/hooks/useWorkouts';
import { formatDate, formatPercent } from '@/lib/format';

export function TodayWorkoutCard() {
    const { data, isLoading } = useTodayWorkout();

    return (
        <Card>
            <CardContent className="space-y-5 pt-6">
                <header className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-input border border-primary/30 bg-primary/10 text-primary">
                            <ListChecks className="h-4 w-4" aria-hidden />
                        </span>
                        <div>
                            <h3 className="text-headline-sm text-foreground">
                                {data ? data.routineName : 'Treino de Hoje'}
                            </h3>
                            <p className="text-body-sm text-foreground/60">
                                {data
                                    ? `Dia ${data.dayNumber} · ${formatDate(data.date)}`
                                    : isLoading
                                        ? 'Carregando…'
                                        : 'Sem rotina ativa hoje'}
                            </p>
                        </div>
                    </div>

                    {data && (
                        <span className="rounded-micro border border-border bg-background/60 px-2 py-1 font-mono text-mono-label text-foreground/80">
                            {data.exercises.filter((e) => e.completed).length}/{data.exercises.length} concluídos
                        </span>
                    )}
                </header>

                {isLoading && <Skeleton className="h-24 w-full" />}

                {!data && !isLoading && (
                    <p className="text-body-sm text-foreground/60">
                        Nenhuma rotina ativa no momento.{' '}
                        <Link to="/workouts/new" className="text-primary hover:underline">
                            Gerar rotina
                        </Link>
                    </p>
                )}

                {data && (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between font-mono text-mono-label">
                                <span className="text-foreground/70">Progresso da sessão</span>
                                <span className="font-bold text-primary">
                                    {formatPercent(data.completionPercent)}
                                </span>
                            </div>
                            <ProgressBar value={data.completionPercent} />
                        </div>

                        {/* Mini-lista */}
                        <ul className="flex flex-wrap gap-2 text-mono-label">
                            {data.exercises.slice(0, 5).map((ex) => (
                                <li
                                    key={ex.id}
                                    className={
                                        ex.completed
                                            ? 'text-primary'
                                            : 'text-foreground/50'
                                    }
                                >
                                    {ex.exerciseName}
                                    {ex.completed ? ' ✔' : ''}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <footer className="flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-body-sm text-foreground/50">
                        {data?.exercises[0]?.completed ? 'Continue de onde parou' : 'Comece o treino de hoje'}
                    </span>
                    <Link
                        to="/workouts/today"
                        className="inline-flex items-center gap-1 text-body-sm font-semibold text-primary hover:text-accent"
                    >
                        Ver treino de hoje
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                </footer>
            </CardContent>
        </Card>
    );
}