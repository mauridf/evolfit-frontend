import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useUpdateWorkoutStatus } from '@/hooks/useWorkouts';
import { WORKOUT_STATUS, type WorkoutStatus } from '@/lib/constants';
import type { WorkoutRoutineResponse } from '@/types/workout.types';

export interface WorkoutStatusDialogProps {
  workout: WorkoutRoutineResponse | { id: number; name: string; status: WorkoutStatus };
  /** Status alvo (pausar = 0, retomar = 1, concluir = 2). */
  target: WorkoutStatus;
  trigger: React.ReactNode;
}

const COPY: Record<
  WorkoutStatus,
  { title: string; description: string; confirmLabel: string; variant: 'primary' | 'danger' }
> = {
  [WORKOUT_STATUS.paused]: {
    title: 'Pausar rotina?',
    description: 'O acompanhamento diário pausa; você pode retomar quando quiser.',
    confirmLabel: 'Pausar',
    variant: 'danger',
  },
  [WORKOUT_STATUS.active]: {
    title: 'Retomar rotina?',
    description: 'A rotina volta a contar no acompanhamento diário.',
    confirmLabel: 'Retomar',
    variant: 'primary',
  },
  [WORKOUT_STATUS.completed]: {
    title: 'Concluir rotina?',
    description: 'A rotina é marcada como concluída. Você pode gerar uma nova depois.',
    confirmLabel: 'Concluir',
    variant: 'primary',
  },
};

export function WorkoutStatusDialog({ workout, target, trigger }: WorkoutStatusDialogProps) {
  const update = useUpdateWorkoutStatus();
  const copy = COPY[target];

  return (
    <ConfirmDialog
      trigger={trigger}
      title={copy.title}
      description={`"${workout.name}" será atualizada. ${copy.description}`}
      confirmLabel={copy.confirmLabel}
      confirmVariant={copy.variant}
      onConfirm={async () => {
        await update.mutateAsync({ id: workout.id, body: { status: target } });
      }}
    />
  );
}

/** Dialog "solto" (para uso programático, se necessário). */
export interface WorkoutStatusDialogControlledProps {
  workout: { id: number; name: string };
  target: WorkoutStatus;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WorkoutStatusDialogControlled({
  workout,
  target,
  open,
  onOpenChange,
}: WorkoutStatusDialogControlledProps) {
  const update = useUpdateWorkoutStatus();
  const copy = COPY[target];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={copy.title} description={copy.description}>
        <p className="text-body-sm text-foreground/70">
          "{workout.name}" será atualizada.
        </p>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant={copy.variant}
            loading={update.isPending}
            onClick={async () => {
              await update.mutateAsync({ id: workout.id, body: { status: target } });
              onOpenChange(false);
            }}
          >
            {copy.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}