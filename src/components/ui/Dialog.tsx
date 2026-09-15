import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/* ---------------------------------------------------------------------
   Reexports
   --------------------------------------------------------------------- */

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;
export const DialogPortal = RadixDialog.Portal;

/* ---------------------------------------------------------------------
   Overlay
   --------------------------------------------------------------------- */

const DialogOverlay = forwardRef<
    ElementRef<typeof RadixDialog.Overlay>,
    ComponentPropsWithoutRef<typeof RadixDialog.Overlay>
>(function DialogOverlay({ className, ...rest }, ref) {
    return (
        <RadixDialog.Overlay
            ref={ref}
            className={cn(
                'fixed inset-0 z-modal bg-black/60 backdrop-blur-sm',
                'data-[state=open]:animate-fade-in data-[state=closed]:opacity-0',
                className,
            )}
            {...rest}
        />
    );
});

/* ---------------------------------------------------------------------
   Content + Header/Body/Footer
   --------------------------------------------------------------------- */

export interface DialogContentProps
    extends ComponentPropsWithoutRef<typeof RadixDialog.Content> {
    title: string;
    description?: string;
    /** Oculta o "X" superior direito (ex.: modal de sessão expirada). */
    hideClose?: boolean;
    children?: ReactNode;
}

export const DialogContent = forwardRef<
    ElementRef<typeof RadixDialog.Content>,
    DialogContentProps
>(function DialogContent(
    { title, description, hideClose, className, children, ...rest },
    ref,
) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <RadixDialog.Content
                ref={ref}
                className={cn(
                    'fixed left-1/2 top-1/2 z-modal w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2',
                    'card-tier2 p-6 focus:outline-none',
                    'data-[state=open]:animate-fade-in',
                    className,
                )}
                {...rest}
            >
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <RadixDialog.Title className="text-headline-sm text-foreground">
                            {title}
                        </RadixDialog.Title>
                        {description ? (
                            <RadixDialog.Description className="mt-1 text-body-sm text-foreground/60">
                                {description}
                            </RadixDialog.Description>
                        ) : (
                            <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
                        )}
                    </div>
                    {!hideClose && (
                        <RadixDialog.Close
                            aria-label="Fechar"
                            className="-mr-1 -mt-1 rounded-input p-1.5 text-foreground/60 transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:shadow-focus"
                        >
                            <X className="h-4 w-4" />
                        </RadixDialog.Close>
                    )}
                </header>

                <div className="space-y-4">{children}</div>
            </RadixDialog.Content>
        </DialogPortal>
    );
});

export function DialogFooter({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <footer
            className={cn('mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
            {...rest}
        />
    );
}