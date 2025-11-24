import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiFileText, FiBox, FiCalendar, FiTrendingUp, FiUsers, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Ringkasan statistik dan manajemen sistem.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservasi Hari Ini</CardTitle>
            <FiCalendar className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-slate-500">+2 dari kemarin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Approval</CardTitle>
            <FiClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-slate-500">Pengajuan pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ruangan</CardTitle>
            <FiBox className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-slate-500">Siap digunakan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jadwal Terblokir</CardTitle>
            <FiXCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-slate-500">Maintenance / Event</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/pengajuan">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-blue-500 hover:bg-blue-50">
                <FiFileText size={24} className="text-blue-600" />
                <span>Kelola Pengajuan</span>
            </Button>
        </Link>
        <Link href="/admin/ruangan">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-indigo-500 hover:bg-indigo-50">
                <FiBox size={24} className="text-indigo-600" />
                <span>Data Ruangan</span>
            </Button>
        </Link>
        <Link href="/admin/jadwal">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-green-500 hover:bg-green-50">
                <FiCalendar size={24} className="text-green-600" />
                <span>Atur Jadwal</span>
            </Button>
        </Link>
        <Link href="/admin/laporan">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 items-center justify-center hover:border-slate-500 hover:bg-slate-50">
                <FiTrendingUp size={24} className="text-slate-600" />
                <span>Laporan</span>
            </Button>
        </Link>
      </div>
    </div>
  );
}

