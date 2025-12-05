"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import InvalidRole from "@/components/invalid-role";
import { Button } from "@/components/ui/button";
import { FiLogOut } from "react-icons/fi";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { data: session } = useSession();

  const isAdminAttempt = type === "admin";
  const isUserAttempt = type === "user";

  let title = "Akses Ditolak";
  let description = "Anda tidak memiliki izin untuk mengakses halaman ini.";
  let menuName = "halaman ini";
  let homeHref = "/";

  if (isAdminAttempt && session?.user?.role === "MAHASISWA") {
    title = "Akses Admin Ditolak";
    description = "Akun Anda adalah akun mahasiswa dan tidak memiliki akses ke halaman admin. Hanya akun dengan email @unsil.ac.id (bukan @student.unsil.ac.id) yang dapat mengakses dashboard admin.";
    menuName = "Dashboard Admin";
    homeHref = "/user/dashboard";
  } else if (isUserAttempt && session?.user?.role === "ADMIN") {
    title = "Akses User Ditolak";
    description = "Akun Anda adalah akun admin. Silakan gunakan dashboard admin untuk mengelola sistem.";
    menuName = "Dashboard Mahasiswa";
    homeHref = "/admin/dashboard";
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <InvalidRole
      title={title}
      description={description}
      menuName={menuName}
      homeHref={homeHref}
      actions={
        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2"
        >
          <FiLogOut /> Logout
        </Button>
      }
    />
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <UnauthorizedContent />
    </Suspense>
  );
}

