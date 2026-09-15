import { Camera, Check } from 'lucide-react';
import { Avatar } from './Avatar';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/format';

export interface ProfileHeroProps {
    displayName: string;
    username: string;
    email: string;
    birthDate?: string | null;
    createdAt: string;
}

function calculateAge(iso: string | null | undefined): number | null {
    if (!iso) return null;
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return null;
    const today = new Date();
    let age = today.getFullYear() - y;
    const mm = today.getMonth() + 1 - m;
    if (mm < 0 || (mm === 0 && today.getDate() < d)) age--;
    return age;
}

export function ProfileHero({
    displayName,
    username,
    email,
    birthDate,
    createdAt,
}: ProfileHeroProps) {
    const age = calculateAge(birthDate ?? null);

    return (
        <Card className="relative flex flex-col items-center p-6 text-center">
            {/* Glow decorativo */}
            <span
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl"
            />

            {/* Avatar + botão de foto */}
            <div className="relative">
                <Avatar displayName={displayName} size="lg" />
                <button
                    type="button"
                    aria-label="Alterar foto (em breve)"
                    title="Alterar foto (Fase 2)"
                    className="absolute -bottom-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-input border border-primary/40 bg-primary text-primary-foreground shadow-tier-1"
                    disabled
                >
                    <Camera className="h-3.5 w-3.5" aria-hidden />
                </button>
            </div>

            <h2 className="mt-4 flex items-center gap-2 text-headline-sm text-foreground">
                {displayName}
                <Check className="h-4 w-4 text-success" aria-label="Conta ativa" />
            </h2>
            <p className="mt-0.5 font-mono text-mono-body text-foreground/60">
                @{username} · {email}
            </p>

            <dl className="mt-6 w-full space-y-3 border-t border-border/60 pt-6 text-left text-body-sm">
                <Row label="Membro desde" value={formatDate(createdAt)} mono />
                <Row label="Idade apurada" value={age != null ? `${age} anos` : '—'} mono />
                <Row label="Perfil biométrico" value="Completo (TinyFn)" tone="success" />
                <Row label="Sessão Auth" value="JWT Bearer" mono />
            </dl>
        </Card>
    );
}

function Row({
    label,
    value,
    mono,
    tone = 'default',
}: {
    label: string;
    value: string;
    mono?: boolean;
    tone?: 'default' | 'success';
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <dt className="text-foreground/60">{label}:</dt>
            <dd
                className={
                    tone === 'success'
                        ? 'font-semibold text-success'
                        : mono
                            ? 'font-mono text-foreground'
                            : 'text-foreground'
                }
            >
                {value}
            </dd>
        </div>
    );
}