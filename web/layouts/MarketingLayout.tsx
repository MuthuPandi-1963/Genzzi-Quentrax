// app/(public)/layout.tsx

"use client"
import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/footer/PubicFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  
  // Keep as a simple wrapper; individual pages handle dark/light if needed.
  return (
    <>
      <PublicNavbar />
      <main className="bg-auto bg-background">{children}</main>
      <PublicFooter/>
    </>
  );
}

