/**
 * React Query Client Configuration
 * Centralized configuration for TanStack React Query
 */

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      // Data is considered fresh for 5 minutes after fetching
      staleTime: 5 * 60 * 1000,

      // Cache time: 10 minutes
      // Unused data will be garbage collected after 10 minutes
      gcTime: 10 * 60 * 1000,

      // Retry failed requests
      retry: 3,

      // Retry delay with exponential backoff
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});
