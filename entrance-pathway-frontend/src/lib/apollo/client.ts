'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { supabase } from '@/lib/supabase/client';

// Singleton pattern - only create one client instance
let apolloClientInstance: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient() {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
    fetchOptions: {
      keepalive: true,
    },
  });

  const authLink = setContext(async (_, { headers }) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return {
        headers: {
          ...headers,
          authorization: session?.access_token ? `Bearer ${session.access_token}` : '',
        },
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { headers };
      }
      throw error;
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      if (networkError.name === 'AbortError') {
        return;
      }
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            courses: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            questions: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            exams: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            subjects: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            notes: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
            users: {
              merge(existing = [], incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });
}

export function getApolloClient() {
  // Server-side: always create a new client
  if (typeof window === 'undefined') {
    return createApolloClient();
  }

  // Client-side: reuse existing client or create new one
  if (!apolloClientInstance) {
    apolloClientInstance = createApolloClient();
  }

  return apolloClientInstance;
}

// For backwards compatibility
export const apolloClient = typeof window !== 'undefined' ? getApolloClient() : null!;
