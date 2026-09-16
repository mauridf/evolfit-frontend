import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { queryClient } from '@/lib/api/queryClient';
import { ThemeProvider } from '@/lib/theme/ThemeProvider';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { SessionExpiredDialog } from '@/components/system/SessionExpiredDialog';
import { GlobalErrorListener } from '@/components/system/GlobalErrorListener';
import { Toaster } from '@/components/ui/Toaster';
import { router } from '@/router';

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GlobalErrorListener />
          <RouterProvider router={router} />
          <SessionExpiredDialog />
          <Toaster />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}