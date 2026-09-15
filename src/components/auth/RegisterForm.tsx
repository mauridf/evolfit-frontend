/* eslint-disable react-hooks/incompatible-library */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check, Mail, User } from 'lucide-react';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { PasswordField } from './PasswordField';
import { PasswordRequirements } from './PasswordRequirements';
import { registerSchema, type RegisterFormData } from '@/schemas/auth.schema';
import { useRegister } from '@/hooks/useAuth';
import { extractFieldErrors, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';
import { toIsoDate, fromIsoDate } from '@/lib/format';

type Step = 1 | 2;

export function RegisterForm() {
    const [step, setStep] = useState<Step>(1);
    const registerMutation = useRegister();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: '',
            email: '',
            displayName: '',
            birthDate: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    const { register, handleSubmit, trigger, watch, setError, formState } = form;
    const { errors, isSubmitting } = formState;
    const passwordValue = watch('password');

    async function goToStep2() {
        const ok = await trigger(['username', 'email', 'displayName', 'birthDate', 'password', 'confirmPassword']);
        if (ok) setStep(2);
    }

    async function onSubmit(data: RegisterFormData) {
        try {
            await registerMutation.mutateAsync({
                username: data.username,
                email: data.email,
                displayName: data.displayName,
                ...(data.birthDate ? { birthDate: data.birthDate } : {}),
                password: data.password,
            });
            // O hook navega e mostra toast.
        } catch (err) {
            if (err instanceof AxiosError && err.response?.status === 409) {
                const problem = parseApiError(err).problem;
                if (/email/i.test(problem.detail ?? '')) {
                    setError('email', { message: 'E-mail já cadastrado.' });
                } else if (/username|usuário/i.test(problem.detail ?? '')) {
                    setError('username', { message: 'Usuário já existe.' });
                }
                setStep(1);
                toast.error('E-mail ou usuário já cadastrado.');
                return;
            }
            if (err instanceof AxiosError && err.response?.status === 422) {
                const fieldErrors = extractFieldErrors(parseApiError(err).problem);
                for (const [field, messages] of Object.entries(fieldErrors)) {
                    const k = field as keyof RegisterFormData;
                    setError(k, { message: messages[0] ?? 'Inválido.' });
                }
                setStep(1);
                return;
            }
            const { problem } = parseApiError(err);
            toast.error(problem.title || 'Erro ao criar conta.', problem.detail);
        }
    }

    // Summary (Etapa 2)
    const summary = {
        username: watch('username'),
        email: watch('email'),
        displayName: watch('displayName'),
        birthDate: watch('birthDate'),
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Indicador de etapa */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="rounded-micro border border-primary/40 bg-primary/15 px-2 py-0.5 font-mono text-mono-label font-bold text-primary">
                        Etapa {step}/2
                    </span>
                    <span className="text-body-sm text-foreground/70">
                        {step === 1 ? 'Preenchimento dos dados' : 'Revisão e confirmação'}
                    </span>
                </div>
                <span className="font-mono text-mono-label text-foreground/40">UX-001</span>
            </div>

            {step === 1 && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <FormField label="Nome de usuário" htmlFor="reg-username" required error={errors.username?.message} hint="3–100 chars; único.">
                            <Input
                                id="reg-username"
                                autoComplete="username"
                                leading={<User className="h-4 w-4" />}
                                invalid={!!errors.username}
                                {...register('username')}
                            />
                        </FormField>
                        <FormField label="E-mail" htmlFor="reg-email" required error={errors.email?.message} hint="Chave única de login.">
                            <Input
                                id="reg-email"
                                type="email"
                                autoComplete="email"
                                leading={<Mail className="h-4 w-4" />}
                                invalid={!!errors.email}
                                {...register('email')}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <FormField label="Nome de exibição" htmlFor="reg-display" required error={errors.displayName?.message}>
                            <Input id="reg-display" autoComplete="name" invalid={!!errors.displayName} {...register('displayName')} />
                        </FormField>
                        <FormField
                            label="Data de nascimento"
                            htmlFor="reg-birth"
                            error={errors.birthDate?.message}
                            hint="Utilizada nos cálculos de BMR/TDEE."
                        >
                            <Input
                                id="reg-birth"
                                type="date"
                                invalid={!!errors.birthDate}
                                // RHF trabalha com string YYYY-MM-DD; o input nativo já usa esse formato.
                                {...register('birthDate')}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                        <FormField label="Senha" htmlFor="reg-pwd" required error={errors.password?.message}>
                            <PasswordField
                                id="reg-pwd"
                                autoComplete="new-password"
                                invalid={!!errors.password}
                                {...register('password')}
                            />
                        </FormField>
                        <FormField label="Confirmar senha" htmlFor="reg-pwd2" required error={errors.confirmPassword?.message}>
                            <PasswordField
                                id="reg-pwd2"
                                autoComplete="new-password"
                                invalid={!!errors.confirmPassword}
                                {...register('confirmPassword')}
                            />
                        </FormField>
                    </div>

                    <PasswordRequirements password={passwordValue} />

                    <Button type="button" size="lg" className="w-full" onClick={goToStep2}>
                        Continuar
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div className="rounded-input border border-border bg-background/60 p-4">
                        <h3 className="flex items-center gap-2 font-mono text-mono-label uppercase tracking-[0.04em] text-primary">
                            <span aria-hidden>📋</span> Revise seus dados
                        </h3>
                        <dl className="mt-3 divide-y divide-border text-body-sm">
                            <SummaryRow label="Usuário" value={summary.username} />
                            <SummaryRow label="E-mail" value={summary.email} />
                            <SummaryRow label="Exibição" value={summary.displayName} />
                            <SummaryRow
                                label="Nascimento"
                                value={
                                    summary.birthDate
                                        ? `${formatDate(summary.birthDate)} (${calculateAge(summary.birthDate)} anos)`
                                        : '—'
                                }
                            />
                            <SummaryRow label="Segurança" value="✔ Requisitos de senha atendidos (SEC-001)" tone="success" />
                        </dl>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" size="lg" onClick={() => setStep(1)} className="w-1/3">
                            <ArrowLeft className="h-4 w-4" />
                            Voltar
                        </Button>
                        <Button type="submit" size="lg" loading={isSubmitting} className="flex-1">
                            Criar conta
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}

function SummaryRow({
    label,
    value,
    tone = 'default',
}: {
    label: string;
    value?: string;
    tone?: 'default' | 'success';
}) {
    return (
        <div className="flex items-center justify-between py-2">
            <dt className="text-foreground/60">{label}:</dt>
            <dd
                className={
                    tone === 'success'
                        ? 'text-success'
                        : 'font-mono text-foreground'
                }
            >
                {value || '—'}
            </dd>
        </div>
    );
}

function calculateAge(iso: string): number {
    const birth = fromIsoDate(iso);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

// Import tardio para evitar colisão de nome com o componente local
import { formatDate } from '@/lib/format';
// (silencia linter caso unused)
void toIsoDate;