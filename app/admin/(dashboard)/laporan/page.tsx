"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiDownload, FiPrinter, FiFilter } from "react-icons/fi";

interface Room {
  id: string;
  nama: string;
}

interface Reservation {
  id: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  jumlahPeserta: number;
  status: string;
  room: {
    nama: string;
  };
  user: {
    nama: string;
    email: string;
  };
}

export default function LaporanPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    roomId: "all",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, reservations]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch rooms
      const roomsResponse = await api.get("/api/room");
      setRooms(roomsResponse.data.data || []);

      // Fetch all reservations
      const reservationsResponse = await api.get("/api/reservation");
      setReservations(reservationsResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(
        (res) =>
          new Date(res.waktuMulai) >= new Date(filters.startDate + "T00:00:00")
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (res) =>
          new Date(res.waktuMulai) <= new Date(filters.endDate + "T23:59:59")
      );
    }

    // Filter by room
    if (filters.roomId !== "all") {
      filtered = filtered.filter((res) => res.room.id === filters.roomId);
    }

    // Sort by date descending
    filtered.sort(
      (a, b) =>
        new Date(b.waktuMulai).getTime() - new Date(a.waktuMulai).getTime()
    );

    setFilteredReservations(filtered);
    setCurrentPage(1); // Reset to first page
  };

  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = [
        "No",
        "Ruangan",
        "Pemohon",
        "Email",
        "Tanggal",
        "Waktu Mulai",
        "Waktu Selesai",
        "Keperluan",
        "Jumlah Peserta",
        "Status",
      ];

      const rows = filteredReservations.map((res, index) => [
        index + 1,
        res.room.nama,
        res.user.nama,
        res.user.email,
        formatDate(res.waktuMulai),
        formatTime(res.waktuMulai),
        formatTime(res.waktuSelesai),
        res.keperluan,
        res.jumlahPeserta,
        getStatusText(res.status),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `laporan-reservasi-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Laporan berhasil diexport");
    } catch (error) {
      toast.error("Gagal export laporan");
    }
  };

  const handlePrint = () => {
    window.print();
    toast.info("Membuka dialog print...");
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "MENUNGGU":
        return <Badge variant="warning">Menunggu</Badge>;
      case "DISETUJUI":
        return <Badge variant="success">Disetujui</Badge>;
      case "DITOLAK":
        return <Badge variant="danger">Ditolak</Badge>;
      case "DIBATALKAN":
        return <Badge variant="outline">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredReservations.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Laporan Penggunaan
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Rekapitulasi data reservasi dan penggunaan ruangan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <FiPrinter className="mr-2" /> Cetak PDF
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <FiDownload className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Dari Tanggal
              </label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="bg-white dark:bg-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Sampai Tanggal
              </label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="bg-white dark:bg-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Ruangan
              </label>
              <select
                value={filters.roomId}
                onChange={(e) =>
                  setFilters({ ...filters, roomId: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Ruangan</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={applyFilters}>
                <FiFilter className="mr-2" /> Terapkan Filter
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total Reservasi
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredReservations.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Disetujui
              </p>
              <p className="text-2xl font-bold text-green-600">
                {
                  filteredReservations.filter((r) => r.status === "DISETUJUI")
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Menunggu
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  filteredReservations.filter((r) => r.status === "MENUNGGU")
                    .length
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ditolak
              </p>
              <p className="text-2xl font-bold text-red-600">
                {
                  filteredReservations.filter((r) => r.status === "DITOLAK")
                    .length
                }
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Ruangan</th>
                  <th className="px-6 py-3">Pemohon</th>
                  <th className="px-6 py-3">Keperluan</th>
                  <th className="px-6 py-3">Tanggal & Jam</th>
                  <th className="px-6 py-3">Peserta</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      Tidak ada data reservasi
                    </td>
                  </tr>
                ) : (
                  currentData.map((res, index) => (
                    <tr
                      key={res.id}
                      className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="px-6 py-4">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                        {res.room.nama}
                      </td>
                      <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                        {res.user.nama}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {res.keperluan}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {formatDate(res.waktuMulai)}, {formatTime(res.waktuMulai)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {res.jumlahPeserta}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(res.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredReservations.length > 0 && (
            <div className="flex justify-between items-center pt-4 text-sm text-slate-500 dark:text-slate-400">
              <span>
                Menampilkan {startIndex + 1}-
                {Math.min(endIndex, filteredReservations.length)} dari{" "}
                {filteredReservations.length} data
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </Button>
                <span className="flex items-center px-3">
                  Hal {currentPage} dari {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
