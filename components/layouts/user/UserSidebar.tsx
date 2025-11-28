"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  FiHome,
  FiPlusSquare,
  FiCalendar,
  FiList,
  FiXCircle,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/user/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/user/reservasi", label: "Ajukan Reservasi", icon: FiPlusSquare },
  { href: "/user/jadwal", label: "Jadwal Ketersediaan", icon: FiCalendar },
  { href: "/user/status", label: "Status Pengajuan", icon: FiList },
  { href: "/user/pembatalan", label: "Pembatalan", icon: FiXCircle },
];

export function UserSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 fixed w-full top-0 z-50">
        <span className="font-bold text-lg text-slate-900">Reservasi.</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:static md:h-screen md:block"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-6 border-b border-slate-800">
            <span className="text-xl font-bold tracking-tight">Reservasi.</span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center w-full rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

