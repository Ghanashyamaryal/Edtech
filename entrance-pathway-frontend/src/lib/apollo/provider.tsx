'use client';

import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { getApolloClient } from './client';
import { useMemo } from 'react';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  // Create/get the singleton client instance and memoize it
  const client = useMemo(() => getApolloClient(), []);

  return <BaseApolloProvider client={client}>{children}</BaseApolloProvider>;
}
