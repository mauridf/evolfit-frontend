import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface ExerciseSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
  autoFocus?: boolean;
}

export function ExerciseSearchBar({
  value,
  onChange,
  onClear,
  className,
  autoFocus,
}: ExerciseSearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40"
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar exercícios (ex.: bench press, squat, esteira, corrida)…"
        aria-label="Buscar exercícios"
        className="input-base pl-10 pr-10"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpar busca"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-input p-1 text-foreground/40 transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}