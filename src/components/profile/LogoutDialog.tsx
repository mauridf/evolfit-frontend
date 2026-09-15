import { LogOut } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { useLogout } from '@/hooks/useAuth';

export interface LogoutDialogProps {
    trigger?: React.ReactNode;
    /** Modo controlado (ex.: menu do usuário) — sem trigger. */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function LogoutDialog({ trigger, open, onOpenChange }: LogoutDialogProps) {
    const logout = useLogout();

    return (
        <ConfirmDialog
            {...(trigger !== undefined && { trigger })}
            {...(open !== undefined && { open })}
            {...(onOpenChange !== undefined && { onOpenChange })}
            title="Sair da sua conta?"
            description={
                <span className="flex flex-col gap-2">
                    <span>Deseja encerrar a sessão atual?</span>
                    <span className="text-body-sm text-foreground/60">
                        Seus tokens de acesso e de renovação serão invalidados na API e excluídos com segurança.
                    </span>
                </span>
            }
            confirmLabel="Sair"
            cancelLabel="Cancelar"
            confirmVariant="danger"
            onConfirm={async () => {
                await logout.mutateAsync();
            }}
        />
    );
}

/** Versão "solta" — abre via callback controlado (usado no menu do usuário). */
export function LogoutButton({ variant = 'primary' }: { variant?: 'primary' | 'ghost' | 'secondary' | 'danger' }) {
    return (
        <LogoutDialog
            trigger={
                <Button variant={variant} size="sm">
                    <LogOut className="h-4 w-4" />
                    Sair
                </Button>
            }
        />
    );
}