import { CalendarCheck2, Dumbbell, HeartPulse, LayoutDashboard, Search, User } from 'lucide-react';
import type { ShortcutRoute } from './useSidebarShortcuts';

export interface NavItem {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    shortcut?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: '1' },
    { to: '/health', label: 'Saúde', icon: HeartPulse, shortcut: '2' },
    { to: '/health/evolution', label: 'Evolução do IMC', icon: HeartPulse, shortcut: '3' },
    { to: '/workouts', label: 'Treinos', icon: Dumbbell, shortcut: '4' },
    { to: '/workouts/today', label: 'Hoje', icon: CalendarCheck2, shortcut: '5' },
    { to: '/exercises', label: 'Exercícios', icon: Search, shortcut: '6' },
];

export const FOOTER_ITEMS: NavItem[] = [{ to: '/profile', label: 'Perfil', icon: User, shortcut: '7' }];

export const SIDEBAR_SHORTCUTS: ShortcutRoute[] = [...NAV_ITEMS, ...FOOTER_ITEMS].map((i) => ({
    key: i.shortcut ?? '',
    to: i.to,
}));