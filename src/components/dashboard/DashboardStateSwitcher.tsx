import { cn } from '@/lib/utils/cn';

export type DashboardView = 'populated' | 'empty';

export interface DashboardStateSwitcherProps {
    value: DashboardView;
    onChange: (view: DashboardView) => void;
}

export function DashboardStateSwitcher({ value, onChange }: DashboardStateSwitcherProps) {
    if (!import.meta.env.DEV) return null;
    return (
        <div className="inline-flex rounded-input border border-border bg-background p-0.5 text-mono-label">
            <button
                type="button"
                onClick={() => onChange('populated')}
                aria-pressed={value === 'populated'}
                className={cn(
                    'rounded-micro px-2.5 py-1 font-medium transition',
                    value === 'populated'
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground/50 hover:text-foreground',
                )}
            >
                Dados ativos
            </button>
            <button
                type="button"
                onClick={() => onChange('empty')}
                aria-pressed={value === 'empty'}
                className={cn(
                    'rounded-micro px-2.5 py-1 font-medium transition',
                    value === 'empty'
                        ? 'bg-primary/15 text-primary'
                        : 'text-foreground/50 hover:text-foreground',
                )}
            >
                Primeira visita (vazio)
            </button>
        </div>
    );
}