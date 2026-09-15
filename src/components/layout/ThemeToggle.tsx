import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme/ThemeProvider';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={isDark ? 'Tema claro' : 'Tema escuro'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-input border border-border bg-surface text-surface-foreground transition-colors hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
        </button>
    );
}