import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as authService from '@/services/auth.service';
import { queryKeys } from '@/lib/api/queryClient';
import { tokenStore } from '@/lib/auth/tokenStore';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/lib/ui/toast';
import type {
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
} from '@/types/auth.types';

/* --------------------- GET /auth/profile --------------------- */

export function useProfile() {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: queryKeys.profile,
        queryFn: async () => {
            const profile = await authService.getProfile();
            setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email,
                displayName: profile.displayName,
            });
            return profile;
        },
        enabled: tokenStore.hasSession(),
        retry: false,
    });
}

/* --------------------- POST /auth/login --------------------- */

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (body: LoginRequest) => authService.login(body),
        onSuccess: async (data) => {
            tokenStore.setTokens(data.accessToken, data.refreshToken);
            useAuthStore.getState().setAuthenticated(data.user);
            await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
            toast.success('Bem-vindo de volta!');
            navigate('/dashboard', { replace: true });
        },
    });
}

/* --------------------- POST /auth/register --------------------- */

export function useRegister() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (body: RegisterRequest) => authService.register(body),
        onSuccess: async (data) => {
            // A API devolve tokens no cadastro — já autenticamos.
            tokenStore.setTokens(data.accessToken, data.refreshToken);
            useAuthStore.getState().setAuthenticated({
                id: data.id,
                username: data.username,
                email: data.email,
                displayName: data.username, // ajustado no próximo GET /auth/profile
            });
            await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
            toast.success('Conta criada com sucesso!');
            navigate('/dashboard', { replace: true });
        },
    });
}

/* --------------------- POST /auth/logout --------------------- */

export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const refresh = tokenStore.getRefresh();
            if (refresh) {
                // Ignora erro de logout no backend — limpamos localmente de qualquer forma.
                await authService.logout({ refreshToken: refresh }).catch(() => undefined);
            }
        },
        onSettled: () => {
            tokenStore.clear();
            useAuthStore.getState().clear();
            queryClient.clear();
            navigate('/login', { replace: true });
        },
    });
}

/* --------------------- PUT /auth/profile --------------------- */

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((s) => s.setUser);

    return useMutation({
        mutationFn: (body: UpdateProfileRequest) => authService.updateProfile(body),
        onSuccess: (profile) => {
            setUser({
                id: profile.id,
                username: profile.username,
                email: profile.email,
                displayName: profile.displayName,
            });
            queryClient.setQueryData(queryKeys.profile, profile);
            toast.success('Perfil atualizado.');
        },
    });
}

/* --------------------- POST /auth/change-password --------------------- */

export function useChangePassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (body: ChangePasswordRequest) => authService.changePassword(body),
        onSuccess: () => {
            toast.success('Senha alterada. Faça login novamente.');
            tokenStore.clear();
            useAuthStore.getState().clear();
            navigate('/login', { replace: true });
        },
    });
}