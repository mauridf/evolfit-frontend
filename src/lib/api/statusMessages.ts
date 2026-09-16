import type { ProblemDetails } from '@/types/api.types';

/**
 * Mapa de status HTTP → mensagem pt-BR (§3.2 / UX-003).
 * Usado por toasts, Error Boundary e mensagens padrão.
 */
export const HTTP_MESSAGES: Record<number, string> = {
  400: 'Verifique os dados enviados.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para esta ação.',
  404: 'Recurso não encontrado.',
  409: 'Sessão antiga ou reutilizada — refaça o login.',
  422: 'Verifique os campos destacados.',
  429: 'Muitas tentativas. Aguarde alguns instantes.',
  500: 'Erro interno. Tente novamente em instantes.',
  503: 'Serviço indisponível. Tente novamente em instantes.',
};

export function messageForStatus(status: number): string {
  return HTTP_MESSAGES[status] ?? 'Ocorreu um erro inesperado.';
}

export function messageForProblem(problem: ProblemDetails): string {
  return problem.detail || problem.title || messageForStatus(problem.status);
}