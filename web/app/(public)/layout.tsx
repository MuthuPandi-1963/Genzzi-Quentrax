import PublicNavbar from "@/components/navigation/PublicNavbar";
import PublicFooter from "@/components/footer/PubicFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}

