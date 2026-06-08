import React from "react";
import SiteLogo from "@/components/SiteLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(260,20%,96%)] dark:bg-[hsl(260,50%,4%)] p-4 relative overflow-hidden transition-colors duration-700">
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -20%, hsl(263 70% 58% / 0.1), transparent),
                            radial-gradient(ellipse 60% 40% at 80% 80%, hsl(330 80% 50% / 0.05), transparent)`
        }} 
      />
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(263 70% 58% / 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(263 70% 58% / 0.04) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <SiteLogo variantIndex={1} className="w-20 h-20 object-contain drop-shadow-xl rounded-2xl" />
        </div>
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-[hsl(263,70%,58%)]" />
          {children}
        </div>
      </div>
    </div>
  );
}
