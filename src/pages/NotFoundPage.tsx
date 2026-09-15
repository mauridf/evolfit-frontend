import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-sm text-surface-foreground/70">Página não encontrada.</p>
            <Link to="/dashboard" className="text-primary underline">
                Ir para o dashboard
            </Link>
        </main>
    );
}