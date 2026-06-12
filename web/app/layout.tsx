"use client"
import AppProvider from "@/providers/app.provider";
import "./globals.css"
export default function Rootlayout({ children }: { children: React.ReactNode }) {
  return (
   <html lang="en" suppressHydrationWarning>
  <body>
    <AppProvider>
      {children}
    </AppProvider>
  </body>
</html>
  );
}