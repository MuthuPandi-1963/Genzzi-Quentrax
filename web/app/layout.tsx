"use client"
import { QueryProvider } from "@/providers/query-client.provider";
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider";
export default function Rootlayout({ children }: { children: React.ReactNode }) {
  return (
   <html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </body>
</html>
  );
}