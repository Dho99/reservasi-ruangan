"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/services/api";
import { FiPlusSquare, FiCalendar, FiList, FiXCircle } from "react-icons/fi";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface Reservation {
  id: string;
  status: string;
  waktuMulai: string;
  room: {
    nama: string;
  };
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserReservations();
    }
  }, [session]);

  const fetchUserReservations = async () => {
    try {
      const response = await api.get("/api/reservation");
      const allReservations = response.data.data || [];

      // Filter by current user
      const userReservations = allReservations.filter(
        (res: Reservation) => res.userId === session?.user?.id
      );

      // Calculate stats
      const pending = userReservations.filter((res: Reservation) => res.status === "MENUNGGU");
      const approved = userReservations.filter(
        (res: Reservation) => res.status === "DISETUJUI"
      );
      const rejected = userReservations.filter((res: Reservation) => res.status === "DITOLAK");

      setStats({
        total: userReservations.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
      });

      // Get recent 3 reservations
      const recent = userReservations
        .sort((a: Reservation, b: Reservation) => 
          new Date(b.waktuMulai).getTime() - new Date(a.waktuMulai).getTime()
        )
        .slice(0, 3);

      setRecentReservations(recent);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return <Badge variant="warning">Menunggu</Badge>;
      case "DISETUJUI":
        return <Badge variant="success">Disetujui</Badge>;
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Selamat datang kembali, {session?.user?.name || "Mahasiswa"}.
        </p>
      </div>

      {/* Ringkasan Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
            <FiList className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Semua riwayat reservasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Approval</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengajuan belum diproses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reservasi aktif & selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengajuan tidak disetujui
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Nav */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/user/reservasi">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <FiPlusSquare size={32} className="text-blue-600" />
            <span className="text-lg">Ajukan Reservasi</span>
          </Button>
        </Link>

        <Link href="/user/jadwal">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col gap-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
          >
            <FiCalendar size={32} className="text-green-600" />
            <span className="text-lg">Lihat Jadwal</span>
          </Button>
        </Link>

        <Link href="/user/status">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col gap-2 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
          >
            <FiList size={32} className="text-yellow-600" />
            <span className="text-lg">Status Pengajuan</span>
          </Button>
        </Link>

        <Link href="/user/pembatalan">
          <Button
            variant="outline"
            className="w-full h-32 flex flex-col gap-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <FiXCircle size={32} className="text-red-600" />
            <span className="text-lg">Pembatalan</span>
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Aktivitas Terakhir</CardTitle>
            <Link href="/user/status">
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentReservations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Belum ada reservasi
              </p>
              <Link href="/user/reservasi">
                <Button>Buat Reservasi Pertama</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReservations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 last:pb-0 last:border-0"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.room.nama}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(item.waktuMulai)}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
