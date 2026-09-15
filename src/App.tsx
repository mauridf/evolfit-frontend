import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function App() {
  return (
    <ThemeProvider>
      <div className="bg-grid relative min-h-screen bg-background text-foreground">
        {/* Glow decorativo — mesma vibe do protótipo */}
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-col gap-6 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-headline-xl">
                EvolFit — <span className="text-primary">Kinetic Obsidian</span>
              </h1>
              <p className="mt-1 text-body-sm text-foreground/60">
                Etapa 6A concluída. Tokens refinados aplicados.
              </p>
            </div>
            <ThemeToggle />
          </header>

          {/* Tipografia nomeada */}
          <section className="card-tier1 p-6">
            <h2 className="text-headline-md">Escala tipográfica (DESIGN.md)</h2>
            <div className="mt-4 space-y-2">
              <p className="text-display-lg">Display LG</p>
              <p className="text-headline-lg">Headline LG</p>
              <p className="text-body-md">Body MD — texto padrão da interface.</p>
              <p className="text-mono-metric-lg text-primary">2.604 kcal</p>
              <p className="mono-label text-foreground/60">MONO LABEL · SEC-001</p>
            </div>
          </section>

          {/* Pills e status dots */}
          <section className="card-tier1 p-6">
            <h2 className="text-headline-md">Module Pills & Status</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill border-[#6366F1]/40 bg-[#6366F1]/15 text-[#6366F1]">
                Auth / Perfil
              </span>
              <span className="pill border-[#10B981]/40 bg-[#10B981]/15 text-[#10B981]">
                Health
              </span>
              <span className="pill border-[#F59E0B]/40 bg-[#F59E0B]/15 text-[#F59E0B]">
                Workouts
              </span>
              <span className="pill border-[#0EA5E9]/40 bg-[#0EA5E9]/15 text-[#0EA5E9]">
                Dashboard
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill border-transparent bg-[#22C55E]/15 text-[#22C55E]">
                <span className="status-dot bg-[#22C55E] animate-pulse-dot" />
                Ativa
              </span>
              <span className="pill border-transparent bg-[#F59E0B]/15 text-[#F59E0B]">
                <span className="status-dot bg-[#F59E0B] animate-pulse-dot" />
                Pausada
              </span>
              <span className="pill border-transparent bg-[#0EA5E9]/15 text-[#0EA5E9]">
                <span className="status-dot bg-[#0EA5E9] animate-pulse-dot" />
                Concluída
              </span>
            </div>
          </section>

          {/* Inputs */}
          <section className="card-tier1 p-6">
            <h2 className="text-headline-md">Inputs</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className="input-base" placeholder="E-mail" defaultValue="carlos@email.com" />
              <input className="input-base" placeholder="Altura (cm)" defaultValue="180.00" />
              <input
                className="input-base"
                aria-invalid="true"
                placeholder="Peso (kg)"
                defaultValue="301"
              />
              <input className="input-base" placeholder="Desabilitado" disabled />
            </div>
          </section>

          {/* Elevação */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="card-tier1 p-6">
              <h3 className="text-headline-sm">Tier 1</h3>
              <p className="mt-2 text-body-sm text-foreground/60">
                Cards, sidebars. Sombra suave + borda hairline.
              </p>
            </div>
            <div className="card-tier2 p-6">
              <h3 className="text-headline-sm">Tier 2</h3>
              <p className="mt-2 text-body-sm text-foreground/60">
                Modais, dropdowns, popovers.
              </p>
            </div>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}