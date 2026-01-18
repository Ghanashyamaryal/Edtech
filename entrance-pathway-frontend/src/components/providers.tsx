'use client';

import { ApolloProvider } from '@/lib/apollo';
import { ReactQueryProvider } from '@/lib/react-query';
import { AuthProvider } from '@/context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <ApolloProvider>{children}</ApolloProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
