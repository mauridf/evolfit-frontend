import { Badge } from '@/components/ui/Badge';

export interface BmiCategoryBadgeProps {
  /** Texto bruto da API (ex.: "Normal weight"). */
  category: string;
}

function normalize(raw: string): { label: string; tone: 'success' | 'info' | 'warning' | 'danger' } {
  const r = raw.toLowerCase();
  if (r.includes('normal')) return { label: 'Normal (18.5 – 24.9)', tone: 'success' };
  if (r.includes('under') || r.includes('abaixo')) return { label: 'Abaixo do peso (< 18.5)', tone: 'info' };
  if (r.includes('over') || r.includes('sobre')) return { label: 'Sobrepeso (25.0 – 29.9)', tone: 'warning' };
  if (r.includes('obes')) return { label: 'Obesidade (≥ 30.0)', tone: 'danger' };
  return { label: raw, tone: 'info' };
}

export function BmiCategoryBadge({ category }: BmiCategoryBadgeProps) {
  const { label, tone } = normalize(category);
  return <Badge tone={tone}>{label}</Badge>;
}