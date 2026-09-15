import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils/cn';

export function GlobalSearch({ className }: { className?: string }) {
    const [term, setTerm] = useState('');
    const navigate = useNavigate();

    function onSubmit(e: FormEvent) {
        e.preventDefault();
        const t = term.trim();
        if (!t) return;
        navigate(`/exercises?term=${encodeURIComponent(t)}`);
    }

    return (
        <form
            role="search"
            onSubmit={onSubmit}
            className={cn('relative hidden max-w-md flex-1 md:block', className)}
        >
            <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
            />
            <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar exercícios…"
                aria-label="Buscar exercícios"
                className="input-base pl-10"
            />
        </form>
    );
}