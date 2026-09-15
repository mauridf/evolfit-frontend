import { Toaster as SonnerToaster } from 'sonner';

/**
 * Toaster global — Kinetic Obsidian.
 * - Duração 4s (padrão), cartões de erro persistem até fechar (sticky).
 * - `aria-live="polite"` por padrão do Sonner.
 * - Fica acima de modais (z-index toast=50 < modal=100 na prática; Sonner
 *   monta em um portal de topo, então não conflita com dialogs).
 */
export function Toaster() {
    return (
        <SonnerToaster
            position="top-right"
            duration={4000}
            closeButton
            richColors={false}
            toastOptions={{
                classNames: {
                    toast:
                        'card-tier2 !rounded-card !border !border-border !bg-surface !text-foreground !shadow-tier-2',
                    title: '!text-body-md !font-semibold',
                    description: '!text-body-sm !text-foreground/70',
                    actionButton: '!bg-primary !text-primary-foreground',
                    cancelButton: '!bg-surface-hover !text-foreground',
                    success: '!border-[#22C55E]/40',
                    warning: '!border-[#F59E0B]/40',
                    error: '!border-[#EF4444]/40',
                    info: '!border-[#0EA5E9]/40',
                },
            }}
        />
    );
}