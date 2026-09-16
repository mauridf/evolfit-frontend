import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema, changePasswordSchema } from '@/schemas/auth.schema';

describe('auth.schema', () => {
  it('loginSchema valida e-mail e senha obrigatória', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'invalido', password: 'x' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });

  it('registerSchema aplica VALID-003 e confirmação de senha', () => {
    const base = {
      username: 'carlos',
      email: 'carlos@email.com',
      displayName: 'Carlos Silva',
      birthDate: '',
      password: 'S3nh@F0rte!',
      confirmPassword: 'S3nh@F0rte!',
    };
    expect(registerSchema.safeParse(base).success).toBe(true);

    expect(
      registerSchema.safeParse({ ...base, confirmPassword: 'diferente' }).success,
    ).toBe(false);

    expect(registerSchema.safeParse({ ...base, password: 'fraca' }).success).toBe(false);
  });

  it('changePasswordSchema exige nova senha válida e confirmação', () => {
    const ok = {
      currentPassword: 'atual',
      newPassword: 'N0va@Senha!',
      confirmPassword: 'N0va@Senha!',
    };
    expect(changePasswordSchema.safeParse(ok).success).toBe(true);
    expect(
      changePasswordSchema.safeParse({ ...ok, confirmPassword: 'outra' }).success,
    ).toBe(false);
  });
});