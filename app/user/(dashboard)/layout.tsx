"use client"

import UserLayoutWrapper from "@/components/layouts/user/UserLayoutWrapper";
import { useSession } from "next-auth/react"
import InvalidRole from "@/components/invalid-role";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session } = useSession();

  if (session?.user?.role !== "MAHASISWA" as string) {
     return <InvalidRole />;
  }

  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}

