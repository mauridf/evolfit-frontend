import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

export interface DashboardEmptyStateProps {
    userName?: string | undefined;
}

const STEPS = [
    {
        n: '1',
        title: 'Medição de saúde',
        route: '/health/new',
        tag: '/health',
        cta: 'Começar medição 🩺',
        description:
            'Registre peso e altura para calcular IMC, BMR e TDEE em tempo real com o motor TinyFn.',
        tone: 'primary' as const,
    },
    {
        n: '2',
        title: 'Rotina de treino',
        route: '/workouts/new',
        tag: '/workouts',
        cta: 'Criar rotina 💪',
        description:
            'Gere uma rotina personalizada (hipertrofia, emagrecimento ou resistência) com exercícios da wger.',
        tone: 'amber' as const,
    },
    {
        n: '3',
        title: 'Executar hoje',
        route: '/workouts/today',
        tag: '/workouts/today',
        cta: 'Ver treino de hoje 📅',
        description:
            'Abra o treino do dia, registre cargas, repetições e séries para alimentar seus gráficos.',
        tone: 'sky' as const,
    },
];

const TONE_CTA: Record<'primary' | 'amber' | 'sky', string> = {
    primary: 'bg-primary hover:bg-accent text-primary-foreground',
    amber: 'bg-[#D97706] hover:bg-[#F59E0B] text-white',
    sky: 'bg-[#0284C7] hover:bg-[#0EA5E9] text-white',
};

const TONE_BADGE: Record<'primary' | 'amber' | 'sky', string> = {
    primary: 'border-primary/40 bg-primary/10 text-primary',
    amber: 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]',
    sky: 'border-[#0EA5E9]/40 bg-[#0EA5E9]/10 text-[#0EA5E9]',
};

export function DashboardEmptyState({ userName }: DashboardEmptyStateProps) {
    return (
        <div className="space-y-6">
            {/* Hero */}
            <Card className="relative overflow-hidden p-8">
                <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
                />
                <div className="relative max-w-2xl space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-pill border border-primary/30 bg-primary/10 px-3 py-1 text-mono-label text-primary">
                        👋 Boas-vindas ao EvolFit · <span className="font-mono">Onboarding</span>
                    </span>
                    <h1 className="text-headline-xl text-foreground">
                        Olá{userName ? `, ${userName.split(' ')[0]}` : ''}! Vamos começar sua jornada fitness?
                    </h1>
                    <p className="text-body-md text-foreground/70">
                        Para calcularmos seu IMC, Taxa Metabólica Basal (BMR) e prescrevermos seus treinos
                        automáticos via TinyFn, siga estes 3 passos essenciais:
                    </p>
                </div>
            </Card>

            {/* Passos */}
            <div>
                <h2 className="mb-4 font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/60">
                    Primeiros passos recomendados
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {STEPS.map((s) => (
                        <Card
                            key={s.n}
                            className="flex flex-col justify-between transition-colors hover:border-primary/40"
                        >
                            <CardContent className="flex h-full flex-col justify-between pt-6">
                                <div>
                                    <span
                                        className={cn(
                                            'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-input border font-mono text-headline-sm',
                                            TONE_BADGE[s.tone],
                                        )}
                                    >
                                        {s.n}
                                    </span>
                                    <span
                                        className={cn(
                                            'inline-flex rounded-micro border px-2 py-0.5 font-mono text-mono-label',
                                            TONE_BADGE[s.tone],
                                        )}
                                    >
                                        {s.tag}
                                    </span>
                                    <h3 className="mt-2 text-headline-sm text-foreground">{s.n}. {s.title}</h3>
                                    <p className="mt-1 text-body-sm text-foreground/60">{s.description}</p>
                                </div>
                                <Link
                                    to={s.route}
                                    className={cn(
                                        'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-input px-4 py-2.5 text-body-sm font-semibold transition-colors',
                                        TONE_CTA[s.tone],
                                    )}
                                >
                                    {s.cta}
                                    <ArrowRight className="h-4 w-4" aria-hidden />
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Dica UX-004 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-input border border-border/60 bg-background/40 p-4 text-body-sm text-foreground/60">
                <span>
                    <span className="text-primary">💡 Dica:</span> valores zerados como{' '}
                    <code className="font-mono">0.00</code> são omitidos até o primeiro registro (UX-004).
                </span>
            </div>
        </div>
    );
}