import { z } from 'zod';
import {
    displayNameSchema,
    emailSchema,
    isoDateSchema,
    passwordSchema,
    usernameSchema,
} from './common.schema';

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Informe a senha.'),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        displayName: displayNameSchema,
        birthDate: isoDateSchema.optional().or(z.literal('')),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'As senhas não coincidem.',
    });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const updateProfileSchema = z.object({
    displayName: displayNameSchema,
    birthDate: isoDateSchema.optional().or(z.literal('')),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Informe a senha atual.'),
        newPassword: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'As senhas não coincidem.',
    });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;