import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { PasswordField } from './PasswordField';
import { loginSchema, type LoginFormData } from '@/schemas/auth.schema';
import { useLogin } from '@/hooks/useAuth';
import { extractFieldErrors, getRetryAfterSeconds, parseApiError } from '@/lib/api/problemDetails';
import { toast } from '@/lib/ui/toast';

export function LoginForm() {
    const login = useLogin();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    async function onSubmit(data: LoginFormData) {
        try {
            await login.mutateAsync(data);
            // O hook já navega e mostra toast.
        } catch (err) {
            // 422 → erros por campo
            if (err instanceof AxiosError && err.response?.status === 422) {
                const fieldErrors = extractFieldErrors(parseApiError(err).problem);
                let mapped = false;
                for (const [field, messages] of Object.entries(fieldErrors)) {
                    if (field === 'email' || field === 'password') {
                        setError(field as keyof LoginFormData, { message: messages[0] ?? 'Inválido.' });
                        mapped = true;
                    }
                }
                if (mapped) return;
            }

            // 429 → Retry-After
            if (err instanceof AxiosError && err.response?.status === 429) {
                const secs = getRetryAfterSeconds(err) ?? 60;
                toast.warning(
                    'Muitas tentativas.',
                    `Tente novamente em ${secs} segundo${secs === 1 ? '' : 's'}.`,
                );
                return;
            }

            // 401 → credenciais inválidas ou lockout
            if (err instanceof AxiosError && err.response?.status === 401) {
                const problem = parseApiError(err).problem;
                // Heurística: lockout costuma vir com detail contendo "bloqueada"
                const detail = problem.detail ?? '';
                if (/bloque|lockout|tentativas/i.test(detail)) {
                    toast.warning('Conta bloqueada temporariamente.', detail);
                } else {
                    toast.error('E-mail ou senha incorretos.');
                }
                return;
            }

            // Demais erros → toast genérico
            const { problem } = parseApiError(err);
            toast.error(problem.title || 'Erro ao entrar.', problem.detail);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <FormField label="E-mail" htmlFor="login-email" required error={errors.email?.message}>
                <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    leading={<Mail className="h-4 w-4" />}
                    invalid={!!errors.email}
                    placeholder="seu.email@exemplo.com"
                    {...register('email')}
                />
            </FormField>

            <FormField
                label="Senha"
                htmlFor="login-password"
                required
                error={errors.password?.message}
            >
                <PasswordField
                    id="login-password"
                    autoComplete="current-password"
                    invalid={!!errors.password}
                    placeholder="•••••••••"
                    {...register('password')}
                />
            </FormField>

            <Button
                type="submit"
                size="lg"
                loading={isSubmitting}
                className="w-full"
            >
                Entrar
                <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-between text-body-sm">
                <span className="text-foreground/50">Esqueceu a senha?</span>
                <Link to="/login" className="text-primary hover:underline">
                    Fluxo de recuperação em breve
                </Link>
            </div>

            <div className="flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-body-sm sm:flex-row">
                <span className="flex items-center gap-2 text-foreground/60">
                    <span aria-hidden>🔐</span> BCrypt + JWT Bearer
                </span>
                <span className="flex items-center gap-1.5 text-success">
                    <span className="status-dot bg-success animate-pulse-dot" />
                    Refresh token em storage seguro (MVP)
                </span>
            </div>
        </form>
    );
}