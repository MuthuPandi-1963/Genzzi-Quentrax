"use client"; // remove if not using Next.js App Router

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";
import { queryClient } from "@/lib/query-client";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={process.env.NEXT_PUBLIC_NODE_ENV == "dev"} />
      )}
    </QueryClientProvider>
  );
}