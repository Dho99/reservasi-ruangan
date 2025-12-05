"use client"

import UserLayoutWrapper from "@/components/layouts/user/UserLayoutWrapper";
import { useSession } from "next-auth/react"
import InvalidRole from "@/components/invalid-role";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { data: session, status } = useSession();

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  // Check role after session is loaded
  if (session?.user?.role !== "MAHASISWA") {
     return <InvalidRole />;
  }

  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}



