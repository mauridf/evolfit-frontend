import { KeyRound, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfileHero } from '@/components/profile/ProfileHero';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';
import { LogoutDialog } from '@/components/profile/LogoutDialog';
import { useProfile } from '@/hooks/useAuth';

export default function ProfilePage() {
    const [pwdOpen, setPwdOpen] = useState(false);
    const { data: profile, isLoading, isError, error, refetch } = useProfile();

    return (
        <section className="mx-auto flex max-w-5xl flex-col gap-6">
            {/* Header */}
            <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 transition-colors hover:bg-surface-hover"
                    >
                        ← Voltar
                    </Link>
                    <div>
                        <h1 className="flex items-center gap-3 text-headline-lg text-foreground">
                            Meu Perfil
                            <span className="rounded-pill border border-[#6366F1]/40 bg-[#6366F1]/15 px-2.5 py-0.5 font-mono text-mono-label text-[#6366F1]">
                                /profile
                            </span>
                        </h1>
                        <p className="mt-0.5 text-body-sm text-foreground/60">
                            Gerenciamento de credenciais, dados pessoais e segurança da conta.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setPwdOpen(true)}>
                        <KeyRound className="h-4 w-4" />
                        Alterar senha
                    </Button>
                    <LogoutDialog
                        trigger={
                            <Button variant="danger" size="sm">
                                <LogOut className="h-4 w-4" />
                                Sair
                            </Button>
                        }
                    />
                </div>
            </header>

            {/* Conteúdo */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="p-6">
                        <Skeleton className="mx-auto h-28 w-28" />
                        <Skeleton className="mx-auto mt-4 h-5 w-40" />
                        <Skeleton className="mx-auto mt-2 h-4 w-56" />
                    </Card>
                    <Card className="lg:col-span-2 p-6">
                        <Skeleton className="h-6 w-48" />
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                            <Skeleton className="h-10" />
                        </div>
                    </Card>
                </div>
            )}

            {isError && (
                <EmptyState
                    icon={<span>⚠️</span>}
                    title="Não foi possível carregar o perfil"
                    description={error instanceof Error ? error.message : 'Tente novamente em instantes.'}
                    action={
                        <Button variant="secondary" onClick={() => void refetch()}>
                            Tentar novamente
                        </Button>
                    }
                />
            )}

            {profile && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <ProfileHero
                        displayName={profile.displayName}
                        username={profile.username}
                        email={profile.email}
                        birthDate={profile.birthDate}
                        createdAt={profile.createdAt}
                    />
                    <div className="lg:col-span-2">
                        <ProfileForm profile={profile} />
                    </div>
                </div>
            )}

            {/* Modais */}
            <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
        </section>
    );
}