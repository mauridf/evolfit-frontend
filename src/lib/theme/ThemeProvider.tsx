import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'evolfit:theme';

type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return 'dark'; // dark é o padrão (§2)
}

function applyThemeClass(theme: Theme) {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => readInitialTheme());

    useEffect(() => {
        applyThemeClass(theme);
        window.localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = useCallback((t: Theme) => setThemeState(t), []);
    const toggleTheme = useCallback(
        () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
        [],
    );

    const value = useMemo<ThemeContextValue>(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}