import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { tokenStore } from '@/lib/auth/tokenStore';
import { useAuthStore } from '@/stores/auth.store';

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('useLogin', () => {
  it('salva tokens e usuário em caso de sucesso', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({
      email: 'carlos@email.com',
      password: 'S3nh@F0rte!',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(tokenStore.getAccess()).toBe('access-token-teste');
    expect(tokenStore.getRefresh()).toBe('refresh-token-teste');
    expect(useAuthStore.getState().user?.email).toBe('carlos@email.com');
    expect(useAuthStore.getState().status).toBe('authenticated');
  });

  it('mantém sessão vazia em caso de 401', async () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate({
      email: 'erro@evolfit.app',
      password: 'S3nh@F0rte!',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(tokenStore.getAccess()).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });
});