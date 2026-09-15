import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Pill } from '@/components/ui/Pill';
import { cn } from '@/lib/utils/cn';

type Tab = 'login' | 'register';

export default function LoginPage() {
    const [tab, setTab] = useState<Tab>('login');

    return (
        <div className="bg-grid relative flex min-h-screen flex-col bg-background text-foreground">
            {/* Glow decorativo */}
            <div className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Header minimalista */}
            <header className="relative z-10 flex items-center justify-between border-b border-border/60 bg-surface/60 px-6 py-4 backdrop-blur-sm">
                <Link to="/login" className="text-headline-sm font-bold text-primary">
                    EvolFit
                    <span className="ml-2 rounded-micro border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-mono-label text-primary">
                        v2.0
                    </span>
                </Link>
                <div className="flex items-center gap-3">
                    <span className="hidden items-center gap-2 rounded-input border border-border bg-surface px-3 py-1.5 font-mono text-mono-label text-foreground/70 sm:inline-flex">
                        <span className="status-dot bg-success animate-pulse-dot" />
                        PT-BR
                    </span>
                    <span className="hidden items-center gap-2 font-mono text-mono-label text-foreground/50 md:inline-flex">
                        <span className="rounded-micro border border-border bg-surface px-2 py-0.5 text-foreground/70">
                            REST API 100%
                        </span>
                    </span>
                    <ThemeToggle />
                </div>
            </header>

            {/* Conteúdo central */}
            <main className="relative z-10 flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-xl">
                    {/* Card */}
                    <div className="card-tier1 p-7 sm:p-9">
                        {/* Header do card */}
                        <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-input border border-primary/30 bg-primary/10 text-xl">
                                    💪
                                </div>
                                <div>
                                    <h1 className="flex items-center gap-2 text-headline-sm font-bold text-foreground">
                                        EvolFit
                                        <span className="rounded-micro border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-mono-label text-primary">
                                            v2.0
                                        </span>
                                    </h1>
                                    <p className="text-body-sm text-foreground/60">
                                        Plataforma de Saúde, Biometria e Treinos
                                    </p>
                                </div>
                            </div>
                            <Pill module="auth">Auth / Perfil</Pill>
                        </div>

                        {/* Tabs */}
                        <div
                            role="tablist"
                            aria-label="Login ou cadastro"
                            className="mt-6 mb-6 flex rounded-input border border-border bg-background/80 p-1"
                        >
                            <TabButton active={tab === 'login'} onClick={() => setTab('login')} controls="login-panel">
                                Login
                            </TabButton>
                            <TabButton
                                active={tab === 'register'}
                                onClick={() => setTab('register')}
                                controls="register-panel"
                            >
                                Cadastro
                                <span className="ml-1.5 rounded-micro bg-primary/10 px-1.5 py-0.5 font-mono text-mono-label text-primary">
                                    2 etapas
                                </span>
                            </TabButton>
                        </div>

                        {/* Painéis */}
                        <div role="tabpanel" id="login-panel" hidden={tab !== 'login'}>
                            {tab === 'login' && <LoginForm />}
                        </div>
                        <div role="tabpanel" id="register-panel" hidden={tab !== 'register'}>
                            {tab === 'register' && <RegisterForm />}
                        </div>
                    </div>

                    {/* Rodapé */}
                    <p className="mt-6 text-center font-mono text-mono-label text-foreground/40">
                        © 2026 EvolFit · v2.0.0 · Camada Frontend para API REST
                    </p>
                </div>
            </main>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    controls,
    children,
}: {
    active: boolean;
    onClick: () => void;
    controls: string;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={controls}
            onClick={onClick}
            className={cn(
                'flex flex-1 items-center justify-center gap-1 rounded-input py-2 text-body-sm font-semibold transition-all',
                active
                    ? 'bg-primary text-primary-foreground shadow-tier-1'
                    : 'text-foreground/60 hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}