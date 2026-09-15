import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
} from 'axios';
import type { RefreshResponse } from '@/types/auth.types';
import { tokenStore } from '@/lib/auth/tokenStore';
import { uiBus } from './events';

/* ------------------------------------------------------------------ */
/* Config base                                                        */
/* ------------------------------------------------------------------ */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30_000, // RNF-02: timeouts para chamadas HTTP
    headers: { 'Content-Type': 'application/json' },
});

/* ------------------------------------------------------------------ */
/* Request interceptor: injeta Authorization                          */
/* ------------------------------------------------------------------ */

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccess();
    if (token && !config.headers.has('Authorization')) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

/* ------------------------------------------------------------------ */
/* Refresh coordenado (evita tempestade de refresh em paralelo)       */
/* ------------------------------------------------------------------ */

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
    const refresh = tokenStore.getRefresh();
    if (!refresh) return null;

    try {
        // Chamada "crua" (sem o interceptor), para evitar loop.
        const { data } = await axios.post<RefreshResponse>(
            `${BASE_URL}/auth/refresh`,
            { refreshToken: refresh },
            { timeout: 15_000, headers: { 'Content-Type': 'application/json' } },
        );
        tokenStore.setTokens(data.accessToken, data.refreshToken);
        return data.accessToken;
    } catch {
        return null;
    }
}

/* ------------------------------------------------------------------ */
/* Response interceptor: 401 → refresh → replay                       */
/* ------------------------------------------------------------------ */

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined;
        const status = error.response?.status;

        // ---- 401: tenta refresh uma vez ---------------------------------
        if (status === 401 && original && !original._retry) {
            original._retry = true;

            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }
            const newAccess = await refreshPromise;

            if (newAccess) {
                original.headers.set('Authorization', `Bearer ${newAccess}`);
                return api.request(original);
            }

            // Sem refresh válido → encerra sessão
            tokenStore.clear();
            uiBus.emitAuthExpired();
            return Promise.reject(error);
        }

        // ---- 409 no /auth/refresh: replay/revogação (SECURITY) ----------
        if (status === 409 && original?.url?.includes('/auth/refresh')) {
            tokenStore.clear();
            uiBus.emitAuthExpired();
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);

/* ------------------------------------------------------------------ */
/* Helpers tipados                                                    */
/* ------------------------------------------------------------------ */

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.get<T>(url, config);
    return data;
}

export async function post<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
): Promise<T> {
    const { data } = await api.post<T>(url, body, config);
    return data;
}

export async function put<T, B = unknown>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig,
): Promise<T> {
    const { data } = await api.put<T>(url, body, config);
    return data;
}

export async function del<T = void>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await api.delete<T>(url, config);
    return data;
}