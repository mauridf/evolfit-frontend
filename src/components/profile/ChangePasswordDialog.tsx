/* eslint-disable react-hooks/incompatible-library */
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { FormField } from '@/components/ui/FormField';
import { PasswordField } from '@/components/auth/PasswordField';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { changePasswordSchema, type ChangePasswordFormData } from '@/schemas/auth.schema';
import { useChangePassword } from '@/hooks/useAuth';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';

export interface ChangePasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const changePassword = useChangePassword();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    });

    // Reseta ao fechar o modal
    useEffect(() => {
        if (!open) reset();
    }, [open, reset]);

    async function onSubmit(data: ChangePasswordFormData) {
        try {
            await changePassword.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            // onSuccess do hook já navega para /login e mostra toast.
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 422) {
                const fieldErrors = extractFieldErrors(parseApiError(err).problem);
                for (const [field, messages] of Object.entries(fieldErrors)) {
                    const k = field as keyof ChangePasswordFormData;
                    setError(k, { message: messages[0] ?? 'Inválido.' });
                }
                return;
            }
            if (err instanceof AxiosError && err.response?.status === 401) {
                setError('currentPassword', { message: 'Senha atual incorreta.' });
                return;
            }
            const { problem } = parseApiError(err);
            toast.error(problem.title || 'Erro ao alterar senha.', problem.detail);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                title="Alterar senha"
                description="Informe a senha atual e escolha uma nova."
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    <FormField
                        label="Senha atual"
                        htmlFor="cp-current"
                        required
                        error={errors.currentPassword?.message}
                    >
                        <PasswordField
                            id="cp-current"
                            autoComplete="current-password"
                            invalid={!!errors.currentPassword}
                            {...register('currentPassword')}
                        />
                    </FormField>

                    <FormField
                        label="Nova senha"
                        htmlFor="cp-new"
                        required
                        error={errors.newPassword?.message}
                    >
                        <PasswordField
                            id="cp-new"
                            autoComplete="new-password"
                            invalid={!!errors.newPassword}
                            {...register('newPassword')}
                        />
                    </FormField>

                    <FormField
                        label="Confirmar nova senha"
                        htmlFor="cp-confirm"
                        required
                        error={errors.confirmPassword?.message}
                    >
                        <PasswordField
                            id="cp-confirm"
                            autoComplete="new-password"
                            invalid={!!errors.confirmPassword}
                            {...register('confirmPassword')}
                        />
                    </FormField>

                    <PasswordRequirements password={watch('newPassword')} />

                    <div className="flex items-start gap-2 rounded-input border border-warning/40 bg-warning/10 p-3 text-body-sm text-warning">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <p>
                            <strong className="font-semibold">Atenção:</strong> alterar a senha revoga todas as
                            sessões ativas — você precisará fazer login novamente em todos os dispositivos.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            <KeyRound className="h-4 w-4" />
                            Alterar senha
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}