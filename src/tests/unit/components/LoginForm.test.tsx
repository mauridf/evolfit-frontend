import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from '@/components/ui/Toaster';

function renderLoginForm() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginForm />
        <Toaster />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginForm', () => {
  it('mostra erro de validação quando o e-mail é inválido', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), 'invalido');
    await user.type(screen.getByLabelText(/senha/i), 'x');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/e-mail válido/i)).toBeInTheDocument();
  });

  it('exibe erro genérico quando a API devolve 401', async () => {
    renderLoginForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), 'erro@evolfit.app');
    await user.type(screen.getByLabelText(/senha/i), 'S3nh@F0rte!');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() =>
      expect(screen.getByText(/e-mail ou senha incorretos/i)).toBeInTheDocument(),
    );
  });
});