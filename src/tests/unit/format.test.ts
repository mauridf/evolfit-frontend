import { describe, expect, it } from 'vitest';
import { formatDecimal2, formatInt, formatPercent, formatDate, toIsoDate, fromIsoDate } from '@/lib/format';

describe('format', () => {
  it('formatDecimal2 usa 2 casas pt-BR', () => {
    expect(formatDecimal2(75.5)).toBe('75,50');
    expect(formatDecimal2(null)).toBe('—');
  });

  it('formatInt usa separador de milhar pt-BR', () => {
    expect(formatInt(2604)).toBe('2.604');
  });

  it('formatPercent arredonda', () => {
    expect(formatPercent(40.4)).toBe('40%');
    expect(formatPercent(40.6)).toBe('41%');
  });

  it('formatDate aceita ISO e YYYY-MM-DD', () => {
    expect(formatDate('2026-09-10')).toBe('10/09/2026');
    expect(formatDate(null)).toBe('—');
  });

  it('toIsoDate / fromIsoDate fazem round-trip', () => {
    const d = new Date(2026, 8, 10);
    const iso = toIsoDate(d);
    expect(iso).toBe('2026-09-10');
    const back = fromIsoDate(iso);
    expect(back.getFullYear()).toBe(2026);
    expect(back.getMonth()).toBe(8);
    expect(back.getDate()).toBe(10);
  });
});