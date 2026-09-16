import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Dumbbell, Plus, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ExerciseCard } from '@/components/exercises/ExerciseCard';
import { ExerciseDetailDialog } from '@/components/exercises/ExerciseDetailDialog';
import { ExerciseSearchBar } from '@/components/exercises/ExerciseSearchBar';
import { useExerciseSearch } from '@/hooks/useExercises';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

const PAGE_SIZE = 12;

export default function ExerciseSearchPage() {
  const [params, setParams] = useSearchParams();
  const initialTerm = params.get('term') ?? '';

  const [term, setTerm] = useState(initialTerm);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<number | null>(null);

  const debouncedTerm = useDebounce(term.trim(), 300);

  // Reseta a paginação quando o termo muda — "adjust state during render"
  // (padrão documentado), evitando setState síncrono dentro de effect.
  const [seenTerm, setSeenTerm] = useState(debouncedTerm);
  if (debouncedTerm !== seenTerm) {
    setSeenTerm(debouncedTerm);
    setVisible(PAGE_SIZE);
  }

  // Sincroniza a URL quando o termo debounced muda (para deep-link/compartilhamento).
  useEffect(() => {
    const current = params.get('term') ?? '';
    if (current === debouncedTerm) return;
    const next = new URLSearchParams(params);
    if (debouncedTerm) next.set('term', debouncedTerm);
    else next.delete('term');
    setParams(next, { replace: true });
  }, [debouncedTerm, params, setParams]);

  const { data, isLoading, isError, isFetching } = useExerciseSearch(debouncedTerm);

  const allResults = useMemo(() => data?.results ?? [], [data]);
  const results = useMemo(() => allResults.slice(0, visible), [allResults, visible]);
  const hasMore = visible < allResults.length;

  const sentinelRef = useInfiniteScroll({
    onIntersect: () => {
      if (hasMore) setVisible((v) => v + PAGE_SIZE);
    },
    enabled: hasMore,
  });

  const noSearchYet = debouncedTerm.length < 2;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-input border border-border bg-surface px-3 text-body-sm font-medium text-foreground/80 hover:bg-surface-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div>
            <h1 className="flex items-center gap-2 text-headline-lg text-foreground">
              <Dumbbell className="h-5 w-5 text-[#0EA5E9]" aria-hidden />
              Busca de Exercícios
            </h1>
            <p className="mt-0.5 text-body-sm text-foreground/60">
              Fonte: wger API. Endpoint:{' '}
              <code className="font-mono text-primary">GET /exercises/search</code>
            </p>
          </div>
        </div>

        <Link to="/workouts/new">
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4" />
            Nova rotina
          </Button>
        </Link>
      </header>

      {/* Busca */}
      <div className="space-y-3">
        <ExerciseSearchBar
          value={term}
          onChange={setTerm}
          onClear={() => setTerm('')}
          autoFocus
        />
        {isFetching && !isLoading && (
          <p className="font-mono text-mono-label text-foreground/50">Buscando…</p>
        )}
      </div>

      {/* Estados */}
      {noSearchYet && (
        <EmptyState
          icon={<span>🔎</span>}
          title="Busque um exercício"
          description="Digite ao menos 2 caracteres (ex.: bench, squat, esteira, corrida)."
        />
      )}

      {isLoading && !noSearchYet && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {isError && !noSearchYet && (
        <EmptyState
          icon={<span>⚠️</span>}
          title="Erro ao buscar exercícios"
          description="Tente novamente em instantes."
        />
      )}

      {!noSearchYet && !isLoading && !isError && allResults.length === 0 && (
        <EmptyState
          icon={<SearchX className="h-5 w-5 text-foreground/60" />}
          title="Nenhum resultado"
          description={`Nada encontrado para "${debouncedTerm}". Tente outro termo em português ou inglês.`}
        />
      )}

      {/* Resultados */}
      {!noSearchYet && results.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="font-mono text-mono-label text-foreground/60">
              {allResults.length} resultado{allResults.length === 1 ? '' : 's'}
            </p>
            <p className="font-mono text-mono-label text-foreground/40">
              exibindo {results.length} de {allResults.length}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} onOpen={(e) => setSelected(e.id)} />
            ))}
          </div>

          {/* Sentinel para scroll infinito (client-side) */}
          {hasMore && (
            <>
              <div ref={sentinelRef} aria-hidden className="h-4" />
              <div className="flex justify-center pt-2">
                <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Carregar mais
                </Button>
              </div>
            </>
          )}

          {!hasMore && (
            <p className="pt-4 text-center font-mono text-mono-label text-foreground/40">
              — fim dos resultados —
            </p>
          )}
        </>
      )}

      {/* Modal de detalhe */}
      <ExerciseDetailDialog
        exerciseId={selected}
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </section>
  );
}