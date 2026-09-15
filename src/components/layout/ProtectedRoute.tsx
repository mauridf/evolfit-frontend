import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { tokenStore } from '@/lib/auth/tokenStore';

/**
 * Guard de rota.
 * - Se não há sessão mínima (access OU refresh), redireciona para /login.
 * - Se há sessão mas `user` ainda não foi carregado, mostra skeleton simples.
 *   (O carregamento do perfil será feito na Etapa 9 via useProfile.)
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
    const status = useAuthStore((s) => s.status);
    const location = useLocation();

    const hasTokens = tokenStore.hasSession();

    useEffect(() => {
        if (!hasTokens && status !== 'unauthenticated') {
            useAuthStore.setState({ status: 'unauthenticated' });
        }
    }, [hasTokens, status]);

    if (!hasTokens) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (status === 'unknown') {
        // Sessão existente mas usuário ainda não carregado — loading leve.
        return (
            <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
                <div className="animate-pulse text-sm text-surface-foreground/70">
                    Carregando sessão…
                </div>
            </div>
        );
    }

    return <>{children}</>;
}