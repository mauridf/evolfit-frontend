import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useState, type ReactNode } from 'react';
import { Button } from './Button';
import { cn } from '@/lib/utils/cn';

export interface ConfirmDialogProps {
    trigger: ReactNode;
    title: string;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Variante do botão de confirmação. Padrão: 'danger'. */
    confirmVariant?: 'primary' | 'danger';
    onConfirm: () => void | Promise<void>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    confirmVariant = 'danger',
    onConfirm,
    open,
    onOpenChange,
}: ConfirmDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const handleOpenChange = onOpenChange ?? setInternalOpen;

    async function handleConfirm() {
        try {
            setLoading(true);
            await onConfirm();
            handleOpenChange(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    className={cn(
                        'fixed inset-0 z-modal bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in',
                    )}
                />
                <AlertDialog.Content
                    className={cn(
                        'card-tier2 fixed left-1/2 top-1/2 z-modal w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 p-6',
                        'focus:outline-none data-[state=open]:animate-fade-in',
                    )}
                >
                    <AlertDialog.Title className="text-headline-sm text-foreground">
                        {title}
                    </AlertDialog.Title>
                    {description && (
                        <AlertDialog.Description className="mt-2 text-body-sm text-foreground/70">
                            {description}
                        </AlertDialog.Description>
                    )}

                    <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <AlertDialog.Cancel asChild>
                            <Button variant="secondary" disabled={loading}>
                                {cancelLabel}
                            </Button>
                        </AlertDialog.Cancel>
                        <Button
                            variant={confirmVariant}
                            loading={loading}
                            onClick={handleConfirm}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}