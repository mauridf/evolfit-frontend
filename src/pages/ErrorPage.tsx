import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    const message = isRouteErrorResponse(error)
        ? `${error.status} — ${error.statusText}`
        : 'Ocorreu um erro inesperado.';

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-foreground">
            <h1 className="text-3xl font-bold">Ops!</h1>
            <p className="text-sm text-surface-foreground/70">{message}</p>
            <a href="/dashboard" className="text-primary underline">
                Voltar para o início
            </a>
        </main>
    );
}