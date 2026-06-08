import React from "react";
import AdminSidebar from "@/components/navigation/AdminSidebar";
import AdminTopbar from "@/components/navigation/AdminTopbar";

export default function AdminLayout({ children, isStaff = false }: { children: React.ReactNode, isStaff?: boolean }) {
  return (
    <div className="flex h-screen bg-[hsl(260,20%,98%)] dark:bg-[hsl(260,30%,6%)] text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-500">
      <AdminSidebar isStaff={isStaff} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `radial-gradient(ellipse 60% 50% at 50% 0%, ${isStaff ? 'hsl(210 70% 58% / 0.04)' : 'hsl(0 70% 58% / 0.04)'}, transparent)`
        }} />
        <AdminTopbar isStaff={isStaff} />
        <main className="flex-1 overflow-auto p-4 md:p-8 z-10">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
