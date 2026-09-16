import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function ErrorPage() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : 'Ocorreu um erro inesperado.';

  const detail = isRouteErrorResponse(error) && error.data
    ? String(error.data)
    : undefined;

  return (
    <main className="bg-grid relative flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-input border border-danger/40 bg-danger/10 text-danger">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="text-headline-lg">Ops!</h1>
      <p className="max-w-md text-center text-body-sm text-foreground/70">{title}</p>
      {import.meta.env.DEV && detail && (
        <pre className="max-w-xl overflow-auto rounded-input border border-border bg-surface p-3 font-mono text-mono-body text-danger">
          {detail}
        </pre>
      )}
      <a href="/dashboard" className="mt-2">
        <Button>
          <ArrowLeft className="h-4 w-4" />
          Voltar ao dashboard
        </Button>
      </a>
    </main>
  );
}