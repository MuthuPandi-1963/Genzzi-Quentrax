// app/(public)/layout.tsx
import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/footer/PubicFooter";


export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Keep as a simple wrapper; individual pages handle dark/light if needed.
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter isDark={false} />
    </>
  );
}

