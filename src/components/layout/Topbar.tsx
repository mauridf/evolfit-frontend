import { Bell, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { GlobalSearch } from './GlobalSearch';
import { cn } from '@/lib/utils/cn';

export interface TopbarProps {
    onOpenMobileSidebar: () => void;
    onToggleSidebar: () => void;
}

export function Topbar({ onOpenMobileSidebar, onToggleSidebar }: TopbarProps) {
    return (
        <header
            className={cn(
                'sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-3 backdrop-blur-sm sm:px-4',
            )}
        >
            {/* Mobile: abre drawer */}
            <button
                type="button"
                aria-label="Abrir menu"
                onClick={onOpenMobileSidebar}
                className="inline-flex h-9 w-9 items-center justify-center rounded-input text-foreground/80 hover:bg-surface-hover md:hidden"
            >
                <Menu className="h-5 w-5" aria-hidden />
            </button>

            {/* Desktop: colapsa sidebar */}
            <button
                type="button"
                aria-label="Alternar barra lateral"
                onClick={onToggleSidebar}
                className="hidden h-9 w-9 items-center justify-center rounded-input text-foreground/80 hover:bg-surface-hover md:inline-flex"
            >
                <Menu className="h-5 w-5" aria-hidden />
            </button>

            {/* Logo (mobile) */}
            <Link
                to="/dashboard"
                className="text-headline-sm font-bold tracking-tight text-primary md:hidden"
            >
                EvolFit
            </Link>

            <GlobalSearch />

            <div className="ml-auto flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Notificações"
                    title="Em breve (Fase 2)"
                    className="hidden h-9 w-9 items-center justify-center rounded-input text-foreground/60 hover:bg-surface-hover sm:inline-flex"
                >
                    <Bell className="h-4 w-4" aria-hidden />
                </button>
                <ThemeToggle />
                <UserMenu />
            </div>
        </header>
    );
}