import * as RadixDialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';
import { DialogContent, DialogFooter } from './Dialog';

export interface InfoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    icon?: ReactNode;
    children?: ReactNode;
    /** Ações do rodapé. Ex.: [<Button>Entendi</Button>] */
    actions?: ReactNode;
    hideClose?: boolean;
}

export function InfoDialog({
    open,
    onOpenChange,
    title,
    description,
    icon,
    children,
    actions,
    hideClose,
}: InfoDialogProps) {
    return (
        <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
            <DialogContent
                title={title}
                {...(description !== undefined && { description })}
                {...(hideClose !== undefined && { hideClose })}
            >
                {icon && (
                    <div className="flex items-center gap-3 rounded-input border border-border bg-surface-hover/40 p-3 text-body-sm text-foreground/80">
                        <span className="text-lg">{icon}</span>
                        <span>{children}</span>
                    </div>
                )}
                {!icon && children}
                {actions && <DialogFooter>{actions}</DialogFooter>}
            </DialogContent>
        </RadixDialog.Root>
    );
}