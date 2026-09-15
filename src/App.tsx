import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function App() {
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                EvolFit — <span className="text-primary">tema</span>
              </h1>
              <p className="mt-1 text-sm text-surface-foreground/70">
                Etapa 2 concluída. Tokens do §2 aplicados.
              </p>
            </div>
            <ThemeToggle />
          </header>

          <section className="rounded-card border border-border bg-surface p-6 shadow-card">
            <h2 className="text-lg font-semibold">Tokens de módulo</h2>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium">
              <span className="rounded-full bg-module-auth px-3 py-1 text-white">Auth</span>
              <span className="rounded-full bg-module-health px-3 py-1 text-black">Health</span>
              <span className="rounded-full bg-module-workouts px-3 py-1 text-black">Workouts</span>
              <span className="rounded-full bg-module-dashboard px-3 py-1 text-black">Dashboard</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium">
              <span className="rounded-full bg-success px-3 py-1 text-success-foreground">
                Success
              </span>
              <span className="rounded-full bg-warning px-3 py-1 text-warning-foreground">
                Warning
              </span>
              <span className="rounded-full bg-danger px-3 py-1 text-danger-foreground">
                Danger
              </span>
            </div>
          </section>

          <section className="rounded-card border border-border bg-surface p-6 shadow-card">
            <h2 className="text-lg font-semibold">Formatação pt-BR (UX-004)</h2>
            <p className="mt-2 text-sm">
              Peso: <span className="font-mono">75.50 kg</span> · IMC:{' '}
              <span className="font-mono">23.30</span> · Data:{' '}
              <span className="font-mono">10/09/2026</span>
            </p>
          </section>
        </div>
      </main>
    </ThemeProvider>
  );
}