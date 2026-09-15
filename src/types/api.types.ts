/**
 * Tipos genéricos do envelope de resposta do EvolFit.
 * Fonte: API_REFERENCE.md §2 (Envelope de Resposta) e §7 (Paginação).
 */

/** Envelope de sucesso quando a API usa wrapper. */
export interface ApiEnvelope<T> {
    success: true;
    data: T;
    errors: [];
    traceId: string;
}

/** Erro RFC 7807 (Problem Details). */
export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    traceId?: string;
    /** Erros por campo quando status = 422 (FluentValidation). */
    errors?: Record<string, string[]>;
}

/** Resposta paginada padrão (API_REFERENCE §7). */
export interface Paginated<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

/** Parâmetros comuns de paginação. */
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}

/** Erro tipado que o Axios interceptor propaga para a UI. */
export interface ApiError {
    status: number;
    problem: ProblemDetails;
}