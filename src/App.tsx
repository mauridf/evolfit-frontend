import { useState } from 'react';
import { Eye, Mail, Plus } from 'lucide-react';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  FormField,
  Input,
  Pill,
  ProgressBar,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';

export default function App() {
  const [progress] = useState(40);

  return (
    <ThemeProvider>
      <div className="bg-grid relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-headline-xl">
                EvolFit — <span className="text-primary">UI Base</span>
              </h1>
              <p className="mt-1 text-body-sm text-foreground/60">
                Etapa 6B — componentes do Kinetic Obsidian.
              </p>
            </div>
            <ThemeToggle />
          </header>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>Primary · Secondary · Ghost · Danger · Loading · Sizes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Excluir</Button>
              <Button loading>Salvando…</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Adicionar">
                <Plus className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Estados normal, com ícones, inválido e desabilitado.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="E-mail" htmlFor="demo-email" required hint="Chave imutável de login.">
                <Input id="demo-email" leading={<Mail className="h-4 w-4" />} placeholder="carlos@email.com" />
              </FormField>

              <FormField label="Senha" htmlFor="demo-pass" required error="Senha deve ter ao menos 8 caracteres.">
                <Input
                  id="demo-pass"
                  type="password"
                  invalid
                  trailing={<Eye className="h-4 w-4" />}
                  defaultValue="123"
                />
              </FormField>

              <FormField label="Peso (kg)" htmlFor="demo-weight">
                <Input id="demo-weight" inputMode="decimal" placeholder="75.50" />
              </FormField>

              <FormField label="Objetivo" htmlFor="demo-goal">
                <Select id="demo-goal" defaultValue="hypertrophy">
                  <option value="strength">Força</option>
                  <option value="hypertrophy">Hipertrofia</option>
                  <option value="endurance">Resistência</option>
                </Select>
              </FormField>

              <FormField label="Observações" htmlFor="demo-obs" className="sm:col-span-2">
                <Textarea id="demo-obs" rows={3} placeholder="Opcional…" />
              </FormField>

              <div className="sm:col-span-2 flex items-center gap-6">
                <Checkbox label="Peito" defaultChecked />
                <Checkbox label="Costas" />
                <Checkbox label="Pernas" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Pills & Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Pills & Badges</CardTitle>
              <CardDescription>Módulos, status (com dot pulsante) e valores delta.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                <Pill module="auth">Auth / Perfil</Pill>
                <Pill module="health">Health / Saúde</Pill>
                <Pill module="workouts">Workouts / Treinos</Pill>
                <Pill module="dashboard">Dashboard</Pill>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill status="active" />
                <Pill status="paused" />
                <Pill status="completed" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="success">-1.20 (-4.9%)</Badge>
                <Badge tone="danger">+0.80</Badge>
                <Badge tone="info">Normal weight</Badge>
                <Badge>Atual</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress & Skeletons */}
          <Card>
            <CardHeader>
              <CardTitle>Progress & Skeleton</CardTitle>
              <CardDescription>Barras com variantes e skeletons de carregamento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={progress} showLabel />
              <ProgressBar value={75} tone="success" showLabel />
              <ProgressBar value={100} tone="info" showLabel />
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}