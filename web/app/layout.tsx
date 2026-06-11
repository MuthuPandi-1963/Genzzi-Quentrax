// app/layout.tsx  ← ThemeProvider goes HERE, not in (public)/layout.tsx
import { QueryProvider } from "@/providers/query-client.provider";
import { ThemeProvider } from "next-themes";
import './globals.css'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
          {children}
          </QueryProvider>
        </ThemeProvider>
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