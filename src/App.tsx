import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { toast } from '@/lib/ui/toast';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  EmptyState,
  Input,
  Pagination,
  Toaster,
} from '@/components/ui';

export default function App() {
  const [page, setPage] = useState(2);
  const totalPages = 5;
  const pageSize = 20;
  const totalCount = 87;

  return (
    <ThemeProvider>
      <div className="bg-grid relative min-h-screen bg-background text-foreground">
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-5xl flex-col gap-6 p-8">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-headline-xl">
                EvolFit — <span className="text-primary">Transversais</span>
              </h1>
              <p className="mt-1 text-body-sm text-foreground/60">
                Etapa 6C — dialogs, toasts, pagination, empty state.
              </p>
            </div>
            <ThemeToggle />
          </header>

          <Card>
            <CardHeader>
              <CardTitle>Toasts (Sonner)</CardTitle>
              <CardDescription>Success, warning, error (sticky) e info.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success('Medição salva com sucesso!')}>
                Success
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  toast.warning(
                    'Cota diária TinyFn atingida',
                    'Cálculo local aproximado (TFN-002/005).',
                  )
                }
              >
                Warning
              </Button>
              <Button
                variant="danger"
                onClick={() => toast.error('Erro: rotina não encontrada (404).')}
              >
                Error (sticky)
              </Button>
              <Button variant="ghost" onClick={() => toast.info('Tudo em ordem por aqui.')}>
                Info
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialogs</CardTitle>
              <CardDescription>Radix Dialog e ConfirmDialog acessíveis (foco preso).</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Abrir Dialog</Button>
                </DialogTrigger>
                <DialogContent
                  title="Registrar exercício"
                  description="Preencha os dados opcionais e confirme."
                >
                  <label className="text-body-sm text-foreground/80">
                    Peso usado (kg)
                    <Input className="mt-1" inputMode="decimal" placeholder="15.00" />
                  </label>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancelar</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={() => toast.success('Exercício registrado.')}>
                        Confirmar
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <ConfirmDialog
                trigger={
                  <Button variant="danger">
                    <Trash2 className="h-4 w-4" />
                    Excluir medição
                  </Button>
                }
                title="Excluir medição?"
                description="Isso remove a medição de 10/09/2026 (IMC 23.30) definitivamente."
                confirmLabel="Excluir"
                onConfirm={() => {
                  toast.success('Removido.');
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagination</CardTitle>
              <CardDescription>Componente com reticências e totalCount.</CardDescription>
            </CardHeader>
            <CardContent>
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </CardContent>
          </Card>

          <EmptyState
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            title="Sem medições ainda"
            description="Registre peso e altura para calcular IMC, BMR e TDEE via TinyFn."
            action={
              <Button>
                <Plus className="h-4 w-4" />
                Registrar primeira medição
              </Button>
            }
          />
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}