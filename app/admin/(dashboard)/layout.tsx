"use client"

import AdminLayoutWrapper from "@/components/layouts/admin/AdminLayoutWrapper";
import { useSession } from "next-auth/react"
import InvalidRole from "@/components/invalid-role";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session } = useSession();

  if (session?.user?.role !== "ADMIN" as string) {
    return <InvalidRole />;
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

