import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/theme/ThemeProvider';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/health', label: 'Saúde' },
    { to: '/workouts', label: 'Treinos' },
    { to: '/workouts/today', label: 'Hoje' },
    { to: '/exercises', label: 'Exercícios' },
    { to: '/profile', label: 'Perfil' },
] as const;

export function AppShell() {
    const { theme, toggleTheme } = useTheme();
    const user = useAuthStore((s) => s.user);
    const clear = useAuthStore((s) => s.clear);
    const navigate = useNavigate();

    function handleLogout() {
        clear();
        navigate('/login', { replace: true });
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-lg font-bold text-primary">
                        EvolFit
                    </Link>
                    <nav className="hidden gap-3 text-sm md:flex">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    isActive ? 'font-semibold text-primary' : 'text-foreground/80 hover:text-primary'
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                        className="rounded-input border border-border px-3 py-1.5 text-xs"
                    >
                        {theme === 'dark' ? '☀' : '🌙'}
                    </button>
                    {user && <span className="hidden text-sm text-surface-foreground/80 sm:inline">{user.displayName}</span>}
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Sair
                    </Button>
                </div>
            </header>

            <main className="flex-1 px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
}