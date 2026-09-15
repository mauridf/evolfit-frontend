import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';
import { FOOTER_ITEMS, NAV_ITEMS, type NavItem } from './sidebarConfig';

export interface SidebarProps {
    collapsed: boolean;
    onNavigate?: () => void; // para fechar o drawer mobile
    onToggleCollapsed?: () => void;
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
    return (
        <aside
            className={cn(
                'flex h-full flex-col border-r border-border bg-surface/80 backdrop-blur-sm',
                collapsed ? 'w-16' : 'w-60',
                'transition-[width] duration-200',
            )}
        >
            {/* Itens principais */}
            <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto py-3">
                <ul className="flex flex-col gap-0.5 px-2">
                    {NAV_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavItemLink
                                item={item}
                                collapsed={collapsed}
                                {...(onNavigate !== undefined && { onNavigate })}
                            />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Rodapé */}
            <div className="border-t border-border py-3">
                <ul className="flex flex-col gap-0.5 px-2">
                    {FOOTER_ITEMS.map((item) => (
                        <li key={item.to}>
                            <NavItemLink
                                item={item}
                                collapsed={collapsed}
                                {...(onNavigate !== undefined && { onNavigate })}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

function NavItemLink({
    item,
    collapsed,
    onNavigate,
}: {
    item: NavItem;
    collapsed: boolean;
    onNavigate?: () => void;
}) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.to}
            end={item.to === '/health' || item.to === '/workouts'}
            onClick={onNavigate}
            aria-keyshortcuts={item.shortcut}
            title={collapsed ? `${item.label} (${item.shortcut ?? ''})` : undefined}
            className={({ isActive }) =>
                cn(
                    'group flex items-center gap-3 rounded-input px-3 py-2 text-body-md transition-colors',
                    collapsed && 'justify-center px-2',
                    isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground/80 hover:bg-surface-hover hover:text-foreground',
                )
            }
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {!collapsed && (
                <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut && (
                        <kbd
                            aria-hidden
                            className="hidden rounded-micro border border-border bg-background px-1.5 py-0.5 font-mono text-mono-label text-foreground/50 group-hover:inline-block"
                        >
                            {item.shortcut}
                        </kbd>
                    )}
                </>
            )}
        </NavLink>
    );
}