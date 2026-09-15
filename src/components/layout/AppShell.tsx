import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { SIDEBAR_SHORTCUTS } from './sidebarConfig';
import { Topbar } from './Topbar';
import { useSidebarShortcuts } from './useSidebarShortcuts';
import { cn } from '@/lib/utils/cn';

const STORAGE_KEY = 'evolfit:sidebarCollapsed';

export function AppShell() {
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return window.localStorage.getItem(STORAGE_KEY) === '1';
        } catch {
            return false;
        }
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useSidebarShortcuts(SIDEBAR_SHORTCUTS);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
        } catch {
            /* ignore */
        }
    }, [collapsed]);

    // Bloqueia scroll do body quando o drawer está aberto
    useEffect(() => {
        if (!mobileOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    // Esc fecha o drawer
    useEffect(() => {
        if (!mobileOpen) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setMobileOpen(false);
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [mobileOpen]);

    return (
        <div className="bg-grid relative flex min-h-screen bg-background text-foreground">
            {/* Glow global */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-3xl" />

            {/* Sidebar desktop */}
            <div className="relative z-10 hidden md:block">
                <Sidebar collapsed={collapsed} />
            </div>

            {/* Drawer mobile */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative h-full w-64 animate-fade-in">
                        <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
                    </div>
                </div>
            )}

            {/* Conteúdo */}
            <div className={cn('relative z-10 flex min-w-0 flex-1 flex-col')}>
                <Topbar
                    onOpenMobileSidebar={() => setMobileOpen(true)}
                    onToggleSidebar={() => setCollapsed((c) => !c)}
                />

                <main className="flex-1 px-4 py-6 sm:px-6">
                    <div className="mx-auto w-full max-w-6xl">
                        <Outlet />
                    </div>
                </main>

                <footer className="border-t border-border px-4 py-3 text-mono-label text-foreground/40 sm:px-6">
                    © 2026 EvolFit · v2.0.0 · REST API 100%
                </footer>
            </div>
        </div>
    );
}