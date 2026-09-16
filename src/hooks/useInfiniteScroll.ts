import { useEffect, useRef } from 'react';

export interface UseInfiniteScrollOptions {
  /** Chamado quando o sentinel entra na viewport. */
  onIntersect: () => void;
  /** Habilita/desabilita o observer (ex.: quando não há `nextPage`). */
  enabled?: boolean;
  /** Margem ao redor do sentinel (default: 300px). */
  rootMargin?: string;
}

export function useInfiniteScroll({
  onIntersect,
  enabled = true,
  rootMargin = '300px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const cb = useRef(onIntersect);

  useEffect(() => {
    cb.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!enabled) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) cb.current();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}