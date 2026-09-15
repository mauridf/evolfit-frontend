import { toast as sonner } from 'sonner';

/**
 * Wrapper de toasts com API pt-BR.
 * Tipos: success (✔ verde), warning (⚠ âmbar), error (✕ vermelho), info (ℹ azul).
 * O `error` é sticky por padrão (cartões de erro persistem até fechar — §3.2).
 */
export const toast = {
    success(message: string, description?: string) {
        sonner.success(message, { description });
    },
    warning(message: string, description?: string) {
        sonner.warning(message, { description, duration: 6000 });
    },
    error(message: string, description?: string) {
        sonner.error(message, { description, duration: Infinity });
    },
    info(message: string, description?: string) {
        sonner.info(message, { description });
    },
    dismiss(id?: string | number) {
        sonner.dismiss(id);
    },
};