import React from "react";
import StudentSidebar from "@/components/navigation/StudentSidebar";
import AppTopbar from "@/components/navigation/AppTopbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,30%,6%)] text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-500">
      <StudentSidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, hsl(263 70% 58% / 0.04), transparent)`
        }} />
        <AppTopbar />
        <main className="flex-1 overflow-auto p-4 md:p-8 z-10">
          <div className="max-w-6xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
