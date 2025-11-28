"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiPlusSquare, FiCalendar, FiList, FiXCircle } from "react-icons/fi";

export default function UserDashboard() {
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Selamat datang kembali, Mahasiswa.</p>
      </div>
      {/* Ringkasan Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
            <FiList className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">Semua riwayat reservasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Approval</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-slate-500">Pengajuan belum diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-slate-500">Reservasi aktif & selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-slate-500">Pengajuan tidak disetujui</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Nav */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/user/reservasi">
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50">
                <FiPlusSquare size={32} className="text-blue-600" />
                <span className="text-lg">Ajukan Reservasi</span>
            </Button>
        </Link>
        <Link href="/user/jadwal">
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2 hover:border-green-500 hover:bg-green-50">
                <FiCalendar size={32} className="text-green-600" />
                <span className="text-lg">Lihat Jadwal</span>
            </Button>
        </Link>
        <Link href="/user/status">
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2 hover:border-yellow-500 hover:bg-yellow-50">
                <FiList size={32} className="text-yellow-600" />
                <span className="text-lg">Status Pengajuan</span>
            </Button>
        </Link>
        <Link href="/user/pembatalan">
            <Button variant="outline" className="w-full h-32 flex flex-col gap-2 hover:border-red-500 hover:bg-red-50">
                <FiXCircle size={32} className="text-red-600" />
                <span className="text-lg">Pembatalan</span>
            </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[
                    { room: "Aula Utama", date: "24 Nov 2025", status: "pending" },
                    { room: "Lab Komputer 1", date: "20 Nov 2025", status: "approved" },
                    { room: "Ruang Rapat B", date: "15 Nov 2025", status: "rejected" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-4 last:pb-0 last:border-0">
                        <div>
                            <p className="font-medium text-slate-900">{item.room}</p>
                            <p className="text-sm text-slate-500">{item.date}</p>
                        </div>
                        <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'}>
                            {item.status === 'approved' ? 'Disetujui' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                        </Badge>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

