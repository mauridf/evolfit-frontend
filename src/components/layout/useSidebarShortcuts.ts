import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ShortcutRoute {
    /** Tecla "1".."9" */
    key: string;
    to: string;
    /** aria-keyshortcuts para acessibilidade */
    label?: string;
}

export function useSidebarShortcuts(routes: ShortcutRoute[]) {
    const navigate = useNavigate();

    useEffect(() => {
        function isTypingTarget(target: EventTarget | null): boolean {
            if (!(target instanceof HTMLElement)) return false;
            const tag = target.tagName;
            if (target.isContentEditable) return true;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (isTypingTarget(e.target)) return;

            const match = routes.find((r) => r.key === e.key);
            if (match) {
                e.preventDefault();
                navigate(match.to);
            }
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [navigate, routes]);
}