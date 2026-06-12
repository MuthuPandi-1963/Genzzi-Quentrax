import { AdminLayout } from "@/components/admin/AdminLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Quentrax",
  description: "Quentrax Admin Panel — Manage quizzes, assessments, users, and analytics",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return(
    <AdminLayout>{children}</AdminLayout>

  )
}