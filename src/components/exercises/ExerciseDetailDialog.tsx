import { ExternalLink, ImageOff, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useExerciseDetail } from '@/hooks/useExercises';

export interface ExerciseDetailDialogProps {
  exerciseId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailDialog({
  exerciseId,
  open,
  onOpenChange,
}: ExerciseDetailDialogProps) {
  const { data, isLoading } = useExerciseDetail(exerciseId ?? 0, open && exerciseId !== null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={data?.name ?? 'Detalhe do exercício'}
        description={data ? `Categoria: ${data.category} · ID wger: ${data.id}` : 'Carregando…'}
      >
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {data.muscles.length > 0 && (
              <div>
                <p className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
                  Músculos
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {data.muscles.map((m) => (
                    <Badge key={m} tone="info">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.equipment.length > 0 && (
              <div>
                <p className="font-mono text-mono-label uppercase tracking-[0.04em] text-foreground/50">
                  Equipamento
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {data.equipment.map((e) => (
                    <Badge key={e}>{e}</Badge>
                  ))}
                </div>
              </div>
            )}

            {data.images.length > 0 ? (
              <div className="overflow-hidden rounded-input border border-border/60">
                <img
                  src={data.images[0]}
                  alt={data.name}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center gap-2 rounded-input border border-dashed border-border/60 bg-background/40 text-body-sm text-foreground/50">
                <ImageOff className="h-4 w-4" />
                Sem imagem disponível
              </div>
            )}

            <div className="flex items-start gap-2 rounded-input border border-border/60 bg-background/40 p-3 text-body-sm text-foreground/80">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p>{data.description || 'Sem descrição disponível.'}</p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {data && (
            <a
              href={`https://wger.de/en/exercise/${data.id}/view`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <Button>
                <ExternalLink className="h-4 w-4" />
                Ver na wger
              </Button>
            </a>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}