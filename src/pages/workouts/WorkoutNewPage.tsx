import { Link } from 'react-router-dom';
import { WorkoutGenerateForm } from '@/components/workouts/WorkoutGenerateForm';

export default function WorkoutNewPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="flex items-center gap-3 border-b border-border/60 pb-6">
        <Link
          to="/workouts"
          className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
        >
          ← Voltar
        </Link>
        <div>
          <h1 className="text-headline-lg text-foreground">Nova rotina</h1>
          <p className="mt-0.5 text-body-sm text-foreground/60">
            Gere uma rotina personalizada com exercícios da wger API.
          </p>
        </div>
      </header>
      <WorkoutGenerateForm />
    </section>
  );
}