import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <main className="bg-grid relative flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-foreground">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[320px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative flex h-14 w-14 items-center justify-center rounded-input border border-primary/40 bg-primary/10 text-primary">
        <Compass className="h-6 w-6" />
      </div>
      <h1 className="relative text-display-lg-mobile text-foreground sm:text-display-lg">404</h1>
      <p className="relative max-w-md text-center text-body-sm text-foreground/60">
        A página que você procura não existe ou foi movida.
      </p>
      <div className="relative mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard">
          <Button>
            <ArrowLeft className="h-4 w-4" />
            Ir para o dashboard
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Entrar</Button>
        </Link>
      </div>
    </main>
  );
}