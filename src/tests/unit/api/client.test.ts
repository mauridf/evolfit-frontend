import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api, get, getOptional } from '@/lib/api/client';
import { tokenStore } from '@/lib/auth/tokenStore';
import { AUTH_EXPIRED_EVENT, uiBus } from '@/lib/api/events';

// axios-mock-adapter intercepta a instância `api`. Para o refresh "cru"
// (axios.post direto), vamos mockar com vi.spyOn(axios, 'post').
import axios from 'axios';

// Uma única instância para os dois describes: o MockAdapter embrulha o
// adapter da instância axios e múltiplas instâncias não se enfileiram.
const mock = new MockAdapter(api, { onNoMatch: 'throwException' });

describe('api client — getOptional (404 = estado vazio)', () => {
    beforeEach(() => {
        tokenStore.clear();
        mock.reset();
    });

    it('retorna null em 404 (estado vazio)', async () => {
        mock.onGet('/workouts/today').reply(404, {
            title: 'Not Found',
            status: 404,
            detail: 'Nenhuma rotina ativa encontrada.',
        });

        await expect(getOptional('/workouts/today')).resolves.toBeNull();
    });

    it('retorna os dados em 200', async () => {
        mock.onGet('/health/metrics/evolution').reply(200, { data: [] });

        await expect(getOptional('/health/metrics/evolution')).resolves.toEqual({ data: [] });
    });

    it('relança o erro em 500 (não é estado vazio)', async () => {
        mock.onGet('/health/metrics/evolution').reply(500, { title: 'Erro interno', status: 500 });

        await expect(getOptional('/health/metrics/evolution')).rejects.toBeTruthy();
    });
});

describe('api client — interceptor 401→refresh→replay', () => {
    beforeEach(() => {
        tokenStore.clear();
        mock.reset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('adiciona Authorization quando há access token', async () => {
        tokenStore.setTokens('access-1', 'refresh-1');
        mock.onGet('/health/metrics/latest').reply((config) => {
            expect(config.headers?.Authorization).toBe('Bearer access-1');
            return [200, { id: 1 }];
        });

        await get('/health/metrics/latest');
    });

    it('faz refresh e reenvia a requisição original (200)', async () => {
        tokenStore.setTokens('access-1', 'refresh-1');

        let firstCall = true;
        mock.onGet('/health/metrics/latest').reply(() => {
            if (firstCall) {
                firstCall = false;
                return [401, { title: 'Unauthorized', status: 401 }];
            }
            return [200, { id: 1, bmi: 23.3 }];
        });

        vi.spyOn(axios, 'post').mockResolvedValueOnce({
            data: { accessToken: 'access-2', refreshToken: 'refresh-2' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        } as never);

        const result = await get<{ id: number; bmi: number }>('/health/metrics/latest');
        expect(result.id).toBe(1);
        expect(tokenStore.getAccess()).toBe('access-2');
    });

    it('emite auth:expired quando o refresh falha', async () => {
        tokenStore.setTokens('access-1', 'refresh-1');

        mock.onGet('/health/metrics/latest').reply(401, { title: 'Unauthorized', status: 401 });
        vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error('refresh failed'));

        const listener = vi.fn();
        uiBus.addEventListener(AUTH_EXPIRED_EVENT, listener);

        await expect(get('/health/metrics/latest')).rejects.toBeTruthy();
        expect(listener).toHaveBeenCalledTimes(1);
        expect(tokenStore.getAccess()).toBeNull();
        expect(tokenStore.getRefresh()).toBeNull();

        uiBus.removeEventListener(AUTH_EXPIRED_EVENT, listener);
    });

    it('409 no /auth/refresh encerra a sessão', async () => {
        tokenStore.setTokens('access-1', 'refresh-1');

        mock.onGet('/health/metrics/latest').reply(401, { title: 'Unauthorized', status: 401 });
        vi.spyOn(axios, 'post').mockRejectedValueOnce({
            response: { status: 409 },
            isAxiosError: true,
        });

        const listener = vi.fn();
        uiBus.addEventListener(AUTH_EXPIRED_EVENT, listener);

        await expect(get('/health/metrics/latest')).rejects.toBeTruthy();
        expect(listener).toHaveBeenCalledTimes(1);

        uiBus.removeEventListener(AUTH_EXPIRED_EVENT, listener);
    });
});