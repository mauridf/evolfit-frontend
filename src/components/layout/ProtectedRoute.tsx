import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { tokenStore } from '@/lib/auth/tokenStore';
import { useProfile } from '@/hooks/useAuth';
import { AUTH_EXPIRED_EVENT, uiBus } from '@/lib/api/events';

/**
 * Guard de rota.
 * - Se não há sessão mínima (access OU refresh), redireciona para /login.
 * - Se há sessão (p.ex. só refresh token após reload), dispara o bootstrap
 *   do perfil (useProfile). A query faz GET /auth/profile → 401 → refresh →
 *   replay; no sucesso, `setUser` marca o status como authenticated.
 * - Se a sessão expirar (refresh inválido/revogado), o interceptor limpa os
 *   tokens e emite `auth:expired`; aqui escutamos e encerramos a sessão,
 *   o que redireciona para /login.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
    const status = useAuthStore((s) => s.status);
    const location = useLocation();

    const hasTokens = tokenStore.hasSession();

    useProfile(); // bootstrap da sessão (no-op sem tokens: `enabled` false)

    useEffect(() => {
        if (!hasTokens && status !== 'unauthenticated') {
            useAuthStore.setState({ status: 'unauthenticated' });
        }
    }, [hasTokens, status]);

    useEffect(() => {
        const onAuthExpired = () => useAuthStore.getState().clear();
        uiBus.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
        return () => uiBus.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired);
    }, []);

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