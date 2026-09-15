import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface PasswordRequirementsProps {
    password: string;
    className?: string;
}

interface Rule {
    label: string;
    test: (pwd: string) => boolean;
}

const RULES: Rule[] = [
    { label: '8+ caracteres', test: (p) => p.length >= 8 },
    { label: 'Letra maiúscula', test: (p) => /[A-Z]/.test(p) },
    { label: 'Letra minúscula', test: (p) => /[a-z]/.test(p) },
    { label: 'Número', test: (p) => /[0-9]/.test(p) },
];

export function PasswordRequirements({ password, className }: PasswordRequirementsProps) {
    const passed = RULES.filter((r) => r.test(password)).length;
    const allPassed = passed === RULES.length;

    return (
        <div
            className={cn(
                'rounded-input border border-border bg-background/60 p-3 text-body-sm',
                className,
            )}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="text-mono-label uppercase tracking-[0.04em] text-foreground/60">
                    Requisitos de senha (SEC-001)
                </span>
                <span
                    className={cn(
                        'text-mono-label',
                        allPassed ? 'text-success' : 'text-foreground/50',
                    )}
                >
                    {allPassed ? '100% válido' : `${passed}/${RULES.length}`}
                </span>
            </div>
            <ul className="grid grid-cols-2 gap-1">
                {RULES.map((r) => {
                    const ok = r.test(password);
                    return (
                        <li
                            key={r.label}
                            className={cn(
                                'flex items-center gap-1.5',
                                ok ? 'text-success' : 'text-foreground/50',
                            )}
                        >
                            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                            <span>{r.label}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}