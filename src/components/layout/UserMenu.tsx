import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDown, KeyRound, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/hooks/useAuth';
import { cn } from '@/lib/utils/cn';

export function UserMenu() {
    const user = useAuthStore((s) => s.user);
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    function handleLogout() {
        logoutMutation.mutate();
    }

    const initials =
        user?.displayName
            ?.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join('') ?? '?';

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label="Menu do usuário"
                    className={cn(
                        'flex items-center gap-2 rounded-input border border-border bg-surface px-2 py-1.5 text-body-sm',
                        'transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:shadow-focus',
                    )}
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 font-mono text-mono-label text-primary">
                        {initials}
                    </span>
                    <span className="hidden max-w-[10rem] truncate sm:inline">
                        {user?.displayName ?? 'Conta'}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-foreground/50" aria-hidden />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className={cn(
                        'card-tier2 z-modal min-w-48 p-1 text-body-sm',
                        'data-[state=open]:animate-fade-in',
                    )}
                >
                    <DropdownMenu.Label className="px-2 py-1.5 text-mono-label text-foreground/50">
                        {user?.email ?? ''}
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator className="my-1 h-px bg-border" />

                    <DropdownMenu.Item
                        onSelect={() => navigate('/profile')}
                        className="flex cursor-pointer items-center gap-2 rounded-micro px-2 py-1.5 outline-none data-[highlighted]:bg-surface-hover"
                    >
                        <User className="h-4 w-4" aria-hidden />
                        Perfil
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onSelect={() => navigate('/profile/password')}
                        className="flex cursor-pointer items-center gap-2 rounded-micro px-2 py-1.5 outline-none data-[highlighted]:bg-surface-hover"
                    >
                        <KeyRound className="h-4 w-4" aria-hidden />
                        Alterar senha
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="my-1 h-px bg-border" />

                    <DropdownMenu.Item
                        onSelect={handleLogout}
                        className="flex cursor-pointer items-center gap-2 rounded-micro px-2 py-1.5 text-danger outline-none data-[highlighted]:bg-danger/10"
                    >
                        <LogOut className="h-4 w-4" aria-hidden />
                        Sair
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}