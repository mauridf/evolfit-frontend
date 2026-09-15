import { create } from 'zustand';
import type { AuthUser } from '@/types/auth.types';
import { tokenStore } from '@/lib/auth/tokenStore';

type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';

interface AuthState {
    user: AuthUser | null;
    status: AuthStatus;
    setUser: (user: AuthUser | null) => void;
    setAuthenticated: (user: AuthUser) => void;
    clear: () => void;
}

/**
 * Store de sessão. Apenas dados do usuário e status.
 * O token NÃO vive aqui — vive em tokenStore (memória + refresh no storage).
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: 'unknown',

    setUser: (user) =>
        set({
            user,
            status: user ? 'authenticated' : 'unauthenticated',
        }),

    setAuthenticated: (user) => set({ user, status: 'authenticated' }),

    clear: () => {
        tokenStore.clear();
        set({ user: null, status: 'unauthenticated' });
    },
}));