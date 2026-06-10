// app/layout.tsx  ← ThemeProvider goes HERE, not in (public)/layout.tsx
import { QueryProvider } from "@/providers/query-client.provider";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
export default function Rootlayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
