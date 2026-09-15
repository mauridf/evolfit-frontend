import { AxiosError } from 'axios';
import type { ApiError, ProblemDetails } from '@/types/api.types';

const FALLBACK_BY_STATUS: Record<number, ProblemDetails> = {
    400: { type: 'about:blank', title: 'Requisição inválida', status: 400 },
    401: { type: 'about:blank', title: 'Não autenticado', status: 401 },
    403: { type: 'about:blank', title: 'Sem permissão', status: 403 },
    404: { type: 'about:blank', title: 'Recurso não encontrado', status: 404 },
    409: { type: 'about:blank', title: 'Conflito', status: 409 },
    422: { type: 'about:blank', title: 'Validação de negócio', status: 422 },
    429: { type: 'about:blank', title: 'Muitas tentativas', status: 429 },
    500: { type: 'about:blank', title: 'Erro interno', status: 500 },
    503: { type: 'about:blank', title: 'Serviço indisponível', status: 503 },
};

/**
 * Extrai um ProblemDetails de um AxiosError.
 * - Se o backend devolveu ProblemDetails completo, usa direto.
 * - Se devolveu envelope com "errors", converte.
 * - Caso contrário, usa fallback por status.
 */
export function parseApiError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0;
        const data = error.response?.data as Partial<ProblemDetails> | undefined;

        if (data && typeof data === 'object' && 'title' in data && 'status' in data) {
            const problem: ProblemDetails = {
                type: data.type ?? 'about:blank',
                title: data.title ?? 'Erro',
                status: data.status ?? status,
                ...(data.detail !== undefined && { detail: data.detail }),
                ...(data.instance !== undefined && { instance: data.instance }),
                ...(data.traceId !== undefined && { traceId: data.traceId }),
                ...(data.errors !== undefined && { errors: data.errors }),
            };
            return { status: problem.status, problem };
        }

        const fallback =
            FALLBACK_BY_STATUS[status] ?? { type: 'about:blank', title: error.message, status };
        return { status, problem: fallback };
    }

    return {
        status: 0,
        problem: { type: 'about:blank', title: 'Falha de rede', status: 0 },
    };
}

/** Extrai erros por campo do `errors` do 422 (para React Hook Form). */
export function extractFieldErrors(problem: ProblemDetails): Record<string, string[]> {
    return problem.errors ?? {};
}

/** Lê o header `Retry-After` (segundos). */
export function getRetryAfterSeconds(error: unknown): number | null {
    if (!(error instanceof AxiosError)) return null;
    const raw = error.response?.headers?.['retry-after'];
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.ceil(n) : null;
}