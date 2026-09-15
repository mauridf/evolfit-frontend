import { z } from 'zod';
import {
    AGE_MAX,
    AGE_MIN,
    HEIGHT_CM_MAX,
    HEIGHT_CM_MIN,
    PASSWORD_MIN,
    WEIGHT_KG_MAX,
    WEIGHT_KG_MIN,
} from '@/lib/constants';

export const emailSchema = z
    .string()
    .min(1, 'Informe o e-mail.')
    .email('Informe um e-mail válido.') // VALID-004
    .max(255, 'E-mail muito longo.');

export const passwordSchema = z
    .string()
    .min(PASSWORD_MIN, `A senha deve ter ao menos ${PASSWORD_MIN} caracteres.`) // VALID-003
    .regex(/[A-Z]/, 'A senha deve conter ao menos 1 letra maiúscula.')
    .regex(/[a-z]/, 'A senha deve conter ao menos 1 letra minúscula.')
    .regex(/[0-9]/, 'A senha deve conter ao menos 1 número.');

export const usernameSchema = z
    .string()
    .min(3, 'O usuário deve ter ao menos 3 caracteres.')
    .max(100, 'O usuário deve ter no máximo 100 caracteres.');

export const displayNameSchema = z
    .string()
    .min(3, 'O nome de exibição deve ter ao menos 3 caracteres.')
    .max(255, 'O nome de exibição deve ter no máximo 255 caracteres.');

export const weightKgSchema = z
    .number({ error: 'Informe um número.' })
    .min(WEIGHT_KG_MIN, `Peso deve estar entre ${WEIGHT_KG_MIN} e ${WEIGHT_KG_MAX} kg.`)
    .max(WEIGHT_KG_MAX, `Peso deve estar entre ${WEIGHT_KG_MIN} e ${WEIGHT_KG_MAX} kg.`);

export const heightCmSchema = z
    .number({ error: 'Informe um número.' })
    .min(HEIGHT_CM_MIN, `Altura deve estar entre ${HEIGHT_CM_MIN} e ${HEIGHT_CM_MAX} cm.`)
    .max(HEIGHT_CM_MAX, `Altura deve estar entre ${HEIGHT_CM_MIN} e ${HEIGHT_CM_MAX} cm.`);

export const ageSchema = z
    .number({ error: 'Informe um número.' })
    .int('A idade deve ser um número inteiro.')
    .min(AGE_MIN, `Idade deve estar entre ${AGE_MIN} e ${AGE_MAX} anos.`)
    .max(AGE_MAX, `Idade deve estar entre ${AGE_MIN} e ${AGE_MAX} anos.`);

/** Data ISO no formato YYYY-MM-DD (API aceita esse formato). */
export const isoDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.');