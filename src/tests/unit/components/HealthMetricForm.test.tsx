import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { HealthMetricForm } from '@/components/health/HealthMetricForm';

function renderForm() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <HealthMetricForm />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HealthMetricForm', () => {
  it('rejeita peso fora de 40–300 kg (VALID-001)', async () => {
    renderForm();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/peso/i), '301');
    await user.type(screen.getByLabelText(/altura/i), '180');
    await user.type(screen.getByLabelText(/idade/i), '28');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/Peso deve estar entre 40 e 300/i)).toBeInTheDocument();
  });
});