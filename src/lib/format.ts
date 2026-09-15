/**
 * Helpers de formatação pt-BR (Proposta_Tela §13, UX-004).
 */

const decimal2 = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const int = new Intl.NumberFormat('pt-BR');

/** "75.5" → "75,50" */
export function formatDecimal2(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return decimal2.format(value);
}

/** 2604 → "2.604" */
export function formatInt(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return int.format(value);
}

/** Percentual inteiro: 40.5 → "40%" (a API já entrega inteiro/1 casa). */
export function formatPercent(value: number | null | undefined): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `${Math.round(value)}%`;
}

/** "2026-09-10" ou ISO completo → "10/09/2026" */
export function formatDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('pt-BR');
}

/** Retorna "YYYY-MM-DD" (formato esperado pela API). */
export function toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Converte "YYYY-MM-DD" em Date local (sem shift de fuso). */
export function fromIsoDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return new Date(NaN);
    return new Date(y, m - 1, d);
}

/** Rótulo curto de tempo relativo simples ("hoje", "ontem", "10/09/2026"). */
export function formatRelativeDay(iso: string): string {
    const today = toIsoDate(new Date());
    if (iso === today) return 'hoje';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (iso === toIsoDate(yesterday)) return 'ontem';
    return formatDate(iso);
}