"use client"
import { QueryProvider } from "@/providers/query-client.provider";
import "./globals.css"
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
        {children}
        </QueryProvider>
        </body>
    </html>
  );
}