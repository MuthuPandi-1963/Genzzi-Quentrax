"use client"
import { QueryProvider } from "@/providers/query-client.provider";
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeContex";
export default function Rootlayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>

        </QueryProvider>
        </body>
    </html>
  );
}
