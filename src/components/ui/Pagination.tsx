import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from './Button';

export interface PaginationProps {
    page: number; // 1-based
    pageSize: number;
    totalCount: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

/** Gera a sequência de páginas com reticências quando necessário. */
function buildPageItems(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const items: (number | 'ellipsis')[] = [1];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    if (left > 2) items.push('ellipsis');
    for (let p = left; p <= right; p++) items.push(p);
    if (right < total - 1) items.push('ellipsis');

    items.push(total);
    return items;
}

export function Pagination({
    page,
    pageSize,
    totalCount,
    totalPages,
    onPageChange,
    className,
}: PaginationProps) {
    if (totalPages <= 1) {
        return (
            <div className={cn('text-body-sm text-foreground/60', className)}>
                {totalCount} {totalCount === 1 ? 'registro' : 'registros'}
            </div>
        );
    }

    const items = buildPageItems(page, totalPages);
    const first = (page - 1) * pageSize + 1;
    const last = Math.min(page * pageSize, totalCount);

    return (
        <div className={cn('flex flex-wrap items-center justify-between gap-3', className)}>
            <p className="text-body-sm text-foreground/60">
                {first}–{last} de <span className="text-foreground">{totalCount}</span>
            </p>

            <nav aria-label="Paginação" className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Página anterior"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {items.map((it, idx) =>
                    it === 'ellipsis' ? (
                        <span
                            key={`e-${idx}`}
                            aria-hidden
                            className="px-2 font-mono text-body-sm text-foreground/40"
                        >
                            …
                        </span>
                    ) : (
                        <Button
                            key={it}
                            variant={it === page ? 'primary' : 'ghost'}
                            size="sm"
                            aria-current={it === page ? 'page' : undefined}
                            onClick={() => onPageChange(it)}
                        >
                            {it}
                        </Button>
                    ),
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Próxima página"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </nav>
        </div>
    );
}