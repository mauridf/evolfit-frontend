import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Em produção, enviar para um serviço de telemetria (Sentry/etc.).
    // Em dev, deixamos o console para inspeção.
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="bg-grid flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
        <div className="flex h-12 w-12 items-center justify-center rounded-input border border-danger/40 bg-danger/10 text-danger">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h1 className="text-headline-lg">Algo deu errado</h1>
        <p className="max-w-md text-center text-body-sm text-foreground/70">
          Ocorreu um erro inesperado na interface. Você pode tentar recarregar a tela ou voltar ao
          dashboard.
        </p>
        {import.meta.env.DEV && this.state.error && (
          <pre className="mt-2 max-w-xl overflow-auto rounded-input border border-border bg-surface p-3 font-mono text-mono-body text-danger">
            {this.state.error.message}
          </pre>
        )}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => window.location.assign('/dashboard')}>
            Ir para o dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            Recarregar
          </Button>
        </div>
      </main>
    );
  }
}