'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { supabase } from '@/lib/supabase/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
  fetchOptions: {
    // Prevent request from being aborted on component unmount
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
    // Handle abort errors gracefully
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
    // Ignore abort errors - these happen during navigation/unmount
    if (networkError.name === 'AbortError') {
      return;
    }
    console.error(`[Network error]: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
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
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
