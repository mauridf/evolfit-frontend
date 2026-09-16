import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

/* ---------------------------------------------------------------------
   Polyfills mínimos para jsdom
   --------------------------------------------------------------------- */

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!('ResizeObserver' in window)) {
  // @ts-expect-error stubbing global
  window.ResizeObserver = ResizeObserverStub;
}

/* ---------------------------------------------------------------------
   MSW lifecycle
   --------------------------------------------------------------------- */

import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/* ---------------------------------------------------------------------
   Limpeza entre testes
   --------------------------------------------------------------------- */

afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});