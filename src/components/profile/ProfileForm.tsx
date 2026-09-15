import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Lock, Pencil, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { updateProfileSchema, type UpdateProfileFormData } from '@/schemas/auth.schema';
import { useUpdateProfile } from '@/hooks/useAuth';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';
import { cn } from '@/lib/utils/cn';
import type { ProfileResponse } from '@/types/auth.types';

export interface ProfileFormProps {
    profile: ProfileResponse;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const [editing, setEditing] = useState(false);
    const updateProfile = useUpdateProfile();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            displayName: profile.displayName,
            birthDate: profile.birthDate ?? '',
        },
    });

    // Sincroniza quando o profile muda (ex.: refetch após salvar)
    useEffect(() => {
        reset({
            displayName: profile.displayName,
            birthDate: profile.birthDate ?? '',
        });
    }, [profile, reset]);

    function startEdit() {
        setEditing(true);
    }

    function cancelEdit() {
        reset({
            displayName: profile.displayName,
            birthDate: profile.birthDate ?? '',
        });
        setEditing(false);
    }

    async function onSubmit(data: UpdateProfileFormData) {
        try {
            await updateProfile.mutateAsync({
                displayName: data.displayName,
                ...(data.birthDate ? { birthDate: data.birthDate } : {}),
            });
            setEditing(false);
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 422) {
                const fieldErrors = extractFieldErrors(parseApiError(err).problem);
                for (const [field, messages] of Object.entries(fieldErrors)) {
                    const k = field as keyof UpdateProfileFormData;
                    setError(k, { message: messages[0] ?? 'Inválido.' });
                }
                return;
            }
            const { problem } = parseApiError(err);
            toast.error(problem.title || 'Erro ao salvar.', problem.detail);
        }
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                    <h3 className="flex items-center gap-2 text-headline-sm text-foreground">
                        <span aria-hidden>👤</span> Dados do usuário
                    </h3>
                    <p className="mt-0.5 text-body-sm text-foreground/60">
                        Endpoint:{' '}
                        <code className="font-mono text-primary">GET /auth/profile</code>{' '}
                        &{' '}
                        <code className="font-mono text-primary">PUT /auth/profile</code>
                    </p>
                </div>
                <span
                    className={cn(
                        'rounded-micro border px-2.5 py-1 font-mono text-mono-label',
                        editing
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'border-border bg-surface text-foreground/70',
                    )}
                >
                    {editing ? 'Modo Edição (PUT /auth/profile)' : 'Modo Leitura'}
                </span>
            </CardHeader>

            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    {/* Campos imutáveis */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            label="Nome de usuário"
                            htmlFor="pf-username"
                            hint="Identificador único no sistema."
                        >
                            <div className="relative">
                                <Input id="pf-username" value={profile.username} disabled className="pr-10 font-mono" />
                                <Lock
                                    aria-hidden
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
                                />
                            </div>
                        </FormField>

                        <FormField
                            label="E-mail"
                            htmlFor="pf-email"
                            hint="Usado para login e tokens de segurança."
                        >
                            <div className="relative">
                                <Input id="pf-email" value={profile.email} disabled className="pr-10 font-mono" />
                                <Lock
                                    aria-hidden
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
                                />
                            </div>
                        </FormField>
                    </div>

                    {/* Campos editáveis */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            label="Nome de exibição"
                            htmlFor="pf-display"
                            required
                            error={errors.displayName?.message}
                            hint="Como você será chamado nos treinos e dashboards."
                        >
                            <Input
                                id="pf-display"
                                disabled={!editing}
                                invalid={!!errors.displayName}
                                {...register('displayName')}
                            />
                        </FormField>

                        <FormField
                            label="Data de nascimento"
                            htmlFor="pf-birth"
                            error={errors.birthDate?.message}
                            hint="Recalcula idade e métricas BMR/TDEE."
                        >
                            <Input
                                id="pf-birth"
                                type="date"
                                disabled={!editing}
                                invalid={!!errors.birthDate}
                                {...register('birthDate')}
                            />
                        </FormField>
                    </div>

                    {/* Barra de ações */}
                    <div className="flex flex-col-reverse gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-body-sm text-foreground/50">
                            {editing
                                ? 'Alterações são aplicadas ao salvar.'
                                : 'Clique em "Editar" para alterar seus dados.'}
                        </p>

                        <div className="flex justify-end gap-3">
                            {!editing ? (
                                <Button type="button" variant="secondary" onClick={startEdit}>
                                    <Pencil className="h-4 w-4" />
                                    Editar Perfil
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={cancelEdit}
                                        disabled={isSubmitting}
                                    >
                                        <X className="h-4 w-4" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={!isDirty && !isSubmitting}
                                    >
                                        <Save className="h-4 w-4" />
                                        Salvar alterações
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}