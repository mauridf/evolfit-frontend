import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { HealthEvolutionResponse } from '@/types/health.types';
import { formatDecimal2, formatDate } from '@/lib/format';

export interface BmiEvolutionChartProps {
    data: HealthEvolutionResponse;
    /** Meta de IMC (usada para a linha tracejada). */
    targetBmi?: number;
    height?: number;
}

/** Recharts exige array de objetos achatados. */
interface Point {
    date: string;
    bmi: number;
    weightKg: number;
}

export function BmiEvolutionChart({ data, targetBmi = 22, height = 260 }: BmiEvolutionChartProps) {
    const points: Point[] = data.data.map((p) => ({
        date: p.date,
        bmi: p.bmi,
        weightKg: p.weightKg,
    }));

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <AreaChart data={points} margin={{ top: 16, right: 24, bottom: 8, left: 0 }}>
                    <defs>
                        <linearGradient id="bmiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#334155" strokeDasharray="4 4" strokeOpacity={0.3} vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(v: string) => formatDate(v).slice(0, 5)}
                        stroke="#64748B"
                        tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        domain={['dataMin - 1', 'dataMax + 1']}
                        stroke="#64748B"
                        tick={{ fontSize: 11, fontFamily: 'JetBrains Mono' }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        tickFormatter={(v: number) => v.toFixed(1)}
                    />

                    <Tooltip
                        contentStyle={{
                            background: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: 12,
                            fontSize: 12,
                            fontFamily: 'JetBrains Mono',
                        }}
                        labelFormatter={(label) => formatDate(String(label))}
                        formatter={(value, key) => {
                            const v = Number(value);
                            if (key === 'bmi') return [formatDecimal2(v), 'IMC'];
                            if (key === 'weightKg') return [`${formatDecimal2(v)} kg`, 'Peso'];
                            return [value, String(key)];
                        }}
                    />

                    {/* Linha de meta (targetBmi) */}
                    <ReferenceLine
                        y={targetBmi}
                        stroke="#0EA5E9"
                        strokeWidth={1.5}
                        strokeDasharray="6 4"
                        label={{
                            value: `Alvo: ${formatDecimal2(targetBmi)} IMC`,
                            position: 'insideBottomRight',
                            fill: '#38BDF8',
                            fontSize: 10,
                            fontFamily: 'JetBrains Mono',
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="bmi"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#bmiAreaGrad)"
                        dot={{ r: 4, fill: '#0F172A', stroke: '#10B981', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#10B981', stroke: '#F8FAFC', strokeWidth: 2 }}
                    />

                    {/* Linha de referência invisível para o peso (aparece só no tooltip). */}
                    <Line type="monotone" dataKey="weightKg" stroke="transparent" dot={false} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}