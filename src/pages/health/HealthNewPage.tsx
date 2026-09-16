import { Link } from 'react-router-dom';
import { HealthMetricForm } from '@/components/health/HealthMetricForm';

export default function HealthNewPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3 border-b border-border/60 pb-6">
        <Link
          to="/health"
          className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 transition-colors hover:bg-surface-hover"
        >
          ← Voltar
        </Link>
        <div>
          <h1 className="text-headline-lg text-foreground">Nova medição</h1>
          <p className="mt-0.5 text-body-sm text-foreground/60">
            Registre peso e altura para calcular IMC, BMR e TDEE via TinyFn.
          </p>
        </div>
      </header>
      <HealthMetricForm />
    </section>
  );
}