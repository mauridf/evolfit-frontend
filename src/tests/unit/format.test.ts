import { describe, expect, it } from 'vitest';
import { formatDate, formatDecimal2, formatPercent } from '@/lib/format';

describe('format pt-BR (UX-004)', () => {
    it('formata decimais com 2 casas', () => {
        expect(formatDecimal2(75.5)).toBe('75,50');
        expect(formatDecimal2(23.3)).toBe('23,30');
        expect(formatDecimal2(null)).toBe('—');
    });

    it('formata percentuais como inteiros', () => {
        expect(formatPercent(40)).toBe('40%');
        expect(formatPercent(75.5)).toBe('76%');
    });

    it('formata datas ISO em pt-BR', () => {
        expect(formatDate('2026-09-10')).toBe('10/09/2026');
        expect(formatDate('2026-09-10T14:30:00Z')).toMatch(/10\/09\/2026/);
        expect(formatDate(null)).toBe('—');
    });
});