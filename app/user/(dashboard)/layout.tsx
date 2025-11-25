"use client"

import UserLayoutWrapper from "@/components/layouts/user/UserLayoutWrapper";
import { useSession } from "next-auth/react"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session } = useSession();

  if (session?.user?.role !== "USER" as string) {
    return <div>Access Denied</div>;
  }

  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}

