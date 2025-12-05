"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/services/api";
import { FiFileText, FiBox, FiCalendar, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";

interface Stats {
  totalReservationsToday: number;
  pendingReservations: number;
  totalRooms: number;
  blockedSlots: number;
}

interface Reservation {
  id: string;
  status: string;
  waktuMulai: string;
  room: {
    nama: string;
  };
  user: {
    nama: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalReservationsToday: 0,
    pendingReservations: 0,
    totalRooms: 0,
    blockedSlots: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all reservations
      const reservationsResponse = await api.get("/api/reservation");
      const allReservations = reservationsResponse.data.data || [];

      // Calculate today's reservations
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayReservations = allReservations.filter((res: Reservation) => {
        const resDate = new Date(res.waktuMulai);
        return resDate >= today && resDate < tomorrow;
      });

      // Count pending reservations
      const pending = allReservations.filter(
        (res: Reservation) => res.status === "MENUNGGU"
      );

      // Fetch rooms
      const roomsResponse = await api.get("/api/room");
      const rooms = roomsResponse.data.data || [];

      // Fetch blocked slots
      const blockedResponse = await api.get("/api/blocked-slots");
      const blocked = blockedResponse.data.data || [];

      // Get recent reservations (last 5)
      const recent = allReservations
        .sort((a: Reservation, b: Reservation) => 
          new Date(b.waktuMulai).getTime() - new Date(a.waktuMulai).getTime()
        )
        .slice(0, 5);

      setStats({
        totalReservationsToday: todayReservations.length,
        pendingReservations: pending.length,
        totalRooms: rooms.length,
        blockedSlots: blocked.length,
      });

      setRecentReservations(recent);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DISETUJUI":
        return <FiCheckCircle className="text-green-500" />;
      case "DITOLAK":
        return <FiXCircle className="text-red-500" />;
      case "MENUNGGU":
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiClock className="text-slate-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return "Menunggu";
      case "DISETUJUI":
        return "Disetujui";
      case "DITOLAK":
        return "Ditolak";
      case "DIBATALKAN":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-slate-500">
          Ringkasan statistik dan manajemen sistem.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservasi Hari Ini</CardTitle>
            <FiCalendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservationsToday}</div>
            <p className="text-xs text-slate-500">
              Total reservasi untuk hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Approval</CardTitle>
            <FiClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReservations}</div>
            <p className="text-xs text-slate-500">
              Pengajuan menunggu persetujuan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ruangan</CardTitle>
            <FiBox className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-slate-500">
              Ruangan tersedia di sistem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Terblokir</CardTitle>
            <FiXCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedSlots}</div>
            <p className="text-xs text-slate-500">
              Slot waktu yang diblokir
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/pengajuan">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-blue-500 hover:bg-blue-50"
          >
            <FiFileText size={24} className="text-blue-600" />
            <span>Kelola Pengajuan</span>
            {stats.pendingReservations > 0 && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                {stats.pendingReservations} pending
              </span>
            )}
          </Button>
        </Link>

        <Link href="/admin/ruangan">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-indigo-500 hover:bg-indigo-50"
          >
            <FiBox size={24} className="text-indigo-600" />
            <span>Data Ruangan</span>
          </Button>
        </Link>

        <Link href="/admin/jadwal">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-green-500 hover:bg-green-50"
          >
            <FiCalendar size={24} className="text-green-600" />
            <span>Atur Jadwal</span>
          </Button>
        </Link>

        <Link href="/admin/laporan">
          <Button
            variant="outline"
            className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-slate-500 hover:bg-slate-50"
          >
            <FiTrendingUp size={24} className="text-slate-600" />
            <span>Laporan</span>
          </Button>
        </Link>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <Link href="/admin/pengajuan">
              <Button variant="ghost" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentReservations.length === 0 ? (
            <p className="text-center py-8 text-slate-500">
              Belum ada aktivitas reservasi
            </p>
          ) : (
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100">
                      {getStatusIcon(reservation.status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {reservation.room.nama}
                      </p>
                      <p className="text-sm text-slate-500">
                        {reservation.user.nama} • {formatDate(reservation.waktuMulai)}{" "}
                        {formatTime(reservation.waktuMulai)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    {getStatusText(reservation.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


