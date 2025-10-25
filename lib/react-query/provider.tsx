"use client";

/**
 * React Query Provider Component
 * Wraps the application with QueryClientProvider
 */

import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { type ComponentType, type ReactNode } from "react";
import { queryClient } from "./client";

// Lazy-load Devtools only on the client and only when explicitly enabled.
// This avoids chunk load errors and React 19 compatibility issues during HMR.
const Devtools: ComponentType<{ initialIsOpen?: boolean }> | null =
  process.env.NEXT_PUBLIC_ENABLE_RQ_DEVTOOLS === "true"
    ? dynamic(() => import("@tanstack/react-query-devtools").then((m) => m.ReactQueryDevtools), {
        ssr: false,
      })
    : null;

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools (opt-in) */}
      {Devtools ? <Devtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
