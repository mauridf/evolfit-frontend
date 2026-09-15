import { describe, expect, it } from 'vitest';
import { ageSchema, heightCmSchema, passwordSchema, weightKgSchema } from '@/schemas/common.schema';

describe('common.schema — VALID-001 / VALID-003', () => {
    it('rejeita peso fora do range 40–300 kg', () => {
        expect(weightKgSchema.safeParse(39).success).toBe(false);
        expect(weightKgSchema.safeParse(301).success).toBe(false);
        expect(weightKgSchema.safeParse(75.5).success).toBe(true);
    });

    it('rejeita altura fora do range 100–250 cm', () => {
        expect(heightCmSchema.safeParse(99).success).toBe(false);
        expect(heightCmSchema.safeParse(251).success).toBe(false);
        expect(heightCmSchema.safeParse(180).success).toBe(true);
    });

    it('rejeita idade fora do range 10–120 anos', () => {
        expect(ageSchema.safeParse(9).success).toBe(false);
        expect(ageSchema.safeParse(121).success).toBe(false);
        expect(ageSchema.safeParse(28).success).toBe(true);
    });

    it('aplica as 4 regras da senha (VALID-003)', () => {
        expect(passwordSchema.safeParse('curta').success).toBe(false);
        expect(passwordSchema.safeParse('semmaiuscula1').success).toBe(false);
        expect(passwordSchema.safeParse('SEMMINUSCULA1').success).toBe(false);
        expect(passwordSchema.safeParse('SemNumeroAqui').success).toBe(false);
        expect(passwordSchema.safeParse('S3nh@F0rte!').success).toBe(true);
    });
});