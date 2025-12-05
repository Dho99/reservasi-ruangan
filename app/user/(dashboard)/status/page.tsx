"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/services/api";
import { FiEye, FiPrinter, FiX } from "react-icons/fi";

interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  jumlahPeserta: number;
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "DIBATALKAN";
  alasanPenolakan?: string;
  createdAt: string;
  room: {
    nama: string;
    lokasi: string;
    kapasitas: number;
  };
  user: {
    nama: string;
    email: string;
  };
}

export default function StatusPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchReservations();
    }
  }, [session]);

  const fetchReservations = async () => {
    try {
      const response = await api.get("/api/reservation");
      // Filter by current user
      const userReservations = response.data.data.filter(
        (res: Reservation) => res.userId === session?.user?.id
      );
      setReservations(userReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Status Pengajuan
        </h1>
        <p className="text-slate-500">
          Pantau status persetujuan reservasi Anda.
        </p>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Ruangan</th>
                  <th className="px-6 py-3">Tanggal & Waktu</th>
                  <th className="px-6 py-3">Keperluan</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Belum ada pengajuan reservasi
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="bg-white border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {reservation.room.nama}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(reservation.waktuMulai)}
                        <br />
                        <span className="text-slate-500 text-xs">
                          {formatTime(reservation.waktuMulai)} -{" "}
                          {formatTime(reservation.waktuSelesai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 truncate max-w-[200px]">
                        {reservation.keperluan}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(reservation.status)}
                          {reservation.status === "DITOLAK" &&
                            reservation.alasanPenolakan && (
                              <span className="text-xs text-red-500">
                                {reservation.alasanPenolakan}
                              </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetail(reservation)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                          <FiEye className="mr-2" /> Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-slate-500">
              Belum ada pengajuan reservasi
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {reservation.room.nama}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatDate(reservation.waktuMulai)}
                    </p>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                    {formatTime(reservation.waktuMulai)} - {formatTime(reservation.waktuSelesai)}
                  </span>
                </div>

                {/* Keperluan */}
                <div>
                  <p className="text-xs text-slate-500 mb-1">Keperluan:</p>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    {reservation.keperluan}
                  </p>
                </div>

                {/* Alasan Penolakan */}
                {reservation.status === "DITOLAK" && reservation.alasanPenolakan && (
                  <div className="bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-700">
                      {reservation.alasanPenolakan}
                    </p>
                  </div>
                )}

                {/* Button */}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleViewDetail(reservation)}
                  className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                  <FiEye className="mr-2" /> Lihat Detail
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Detail */}
      {showModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 print:bg-white">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto print:max-w-full print:shadow-none">
            {/* Modal Header - Hidden saat print */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 print:hidden">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Detail Pengajuan Reservasi
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 print:p-8">
              {/* Header untuk Print */}
              <div className="hidden print:block text-center mb-8 pb-4 border-b-2 border-slate-900">
                <h1 className="text-2xl font-bold mb-3 text-slate-900">
                  DETAIL PENGAJUAN RESERVASI RUANGAN
                </h1>
                <p className="text-base font-medium text-slate-700">Universitas Siliwangi</p>
                <p className="text-xs text-slate-600 mt-2">
                  Sistem Informasi Reservasi Ruangan
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:border print:border-slate-300 print:p-4 print:rounded-lg print:bg-slate-50">
                <div>
                  <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Status Pengajuan</p>
                  <div className="mt-1 print:mt-2">
                    {/* Badge untuk screen */}
                    <span className="print:hidden">{getStatusBadge(selectedReservation.status)}</span>
                    {/* Text untuk print */}
                    <span className="hidden print:inline-block px-3 py-1 text-sm font-semibold rounded print:text-slate-900">
                      {selectedReservation.status === "MENUNGGU" && "⏳ MENUNGGU"}
                      {selectedReservation.status === "DISETUJUI" && "✅ DISETUJUI"}
                      {selectedReservation.status === "DITOLAK" && "❌ DITOLAK"}
                      {selectedReservation.status === "DIBATALKAN" && "🚫 DIBATALKAN"}
                    </span>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">ID Reservasi</p>
                  <p className="text-sm font-mono text-slate-900 mt-1 print:text-base print:font-bold">
                    {selectedReservation.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Alasan Penolakan */}
              {selectedReservation.status === "DITOLAK" && selectedReservation.alasanPenolakan && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-900 mb-1">
                    Alasan Penolakan:
                  </p>
                  <p className="text-sm text-red-700">
                    {selectedReservation.alasanPenolakan}
                  </p>
                </div>
              )}

              {/* Detail Pemohon */}
              <div className="print:border print:border-slate-300 print:p-4 print:rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase print:text-base print:mb-4 print:pb-2 print:border-b print:border-slate-300">
                  Detail Pemohon
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-6">
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Nama</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {selectedReservation.user.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Email</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 break-all print:text-base print:mt-2">
                      {selectedReservation.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Ruangan */}
              <div className="print:border print:border-slate-300 print:p-4 print:rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase print:text-base print:mb-4 print:pb-2 print:border-b print:border-slate-300">
                  Detail Ruangan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-6">
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Nama Ruangan</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {selectedReservation.room.nama}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Lokasi</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {selectedReservation.room.lokasi}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Kapasitas Ruangan</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {selectedReservation.room.kapasitas} orang
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Jumlah Peserta</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {selectedReservation.jumlahPeserta} orang
                    </p>
                  </div>
                </div>
              </div>

              {/* Detail Waktu */}
              <div className="print:border print:border-slate-300 print:p-4 print:rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase print:text-base print:mb-4 print:pb-2 print:border-b print:border-slate-300">
                  Jadwal Penggunaan
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-6">
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Waktu Mulai</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {formatDateTime(selectedReservation.waktuMulai)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium">Waktu Selesai</p>
                    <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-2">
                      {formatDateTime(selectedReservation.waktuSelesai)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Keperluan */}
              <div className="print:border print:border-slate-300 print:p-4 print:rounded-lg">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase print:text-base print:mb-4 print:pb-2 print:border-b print:border-slate-300">
                  Keperluan Penggunaan
                </h3>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg print:text-base print:bg-white print:p-0 print:leading-relaxed">
                  {selectedReservation.keperluan}
                </p>
              </div>

              {/* Tanggal Pengajuan */}
              <div className="print:border print:border-slate-300 print:p-4 print:rounded-lg">
                <p className="text-sm text-slate-500 print:text-slate-700 print:font-medium print:mb-2">Tanggal Pengajuan</p>
                <p className="text-sm font-medium text-slate-900 mt-1 print:text-base print:mt-0">
                  {formatDateTime(selectedReservation.createdAt)}
                </p>
              </div>

              {/* Footer untuk Print - 3 Tanda Tangan */}
              <div className="hidden print:block mt-12 pt-8 border-t-2 border-slate-900">
                <div className="grid grid-cols-3 gap-12">
                  {/* Pemohon */}
                  <div className="text-center">
                    <p className="text-sm font-medium mb-20 text-slate-900">Pemohon,</p>
                    <div>
                      <p className="text-sm font-bold border-t-2 border-slate-900 pt-2 inline-block px-6 text-slate-900">
                        {selectedReservation.user.nama}
                      </p>
                      <p className="text-xs text-slate-700 mt-2 font-medium">
                        {selectedReservation.user.email}
                      </p>
                    </div>
                  </div>

                  {/* Admin */}
                  <div className="text-center">
                    <p className="text-sm font-medium mb-20 text-slate-900">Admin,</p>
                    <p className="text-sm font-bold border-t-2 border-slate-900 pt-2 inline-block px-6 text-slate-900">
                      (.................................)
                    </p>
                  </div>

                  {/* Kepala Lab */}
                  <div className="text-center">
                    <p className="text-sm font-medium mb-20 text-slate-900">Kepala Lab,</p>
                    <p className="text-sm font-bold border-t-2 border-slate-900 pt-2 inline-block px-6 text-slate-900">
                      (.................................)
                    </p>
                  </div>
                </div>

                {/* Catatan Footer */}
                <div className="mt-10 text-center border-t border-slate-300 pt-4">
                  <p className="text-xs text-slate-700 font-medium">
                    Dokumen ini dicetak pada: {new Date().toLocaleString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer - Hidden saat print */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t border-slate-200 print:hidden">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto"
              >
                Tutup
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto"
              >
                <FiPrinter className="mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Reset all visibility */
          body * {
            visibility: hidden;
          }
          
          /* Show modal content */
          .fixed.inset-0,
          .fixed.inset-0 * {
            visibility: visible;
          }
          
          /* Position modal for print */
          .fixed.inset-0 {
            position: static !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Remove modal styling for print */
          .fixed.inset-0 > div {
            max-width: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
          
          /* Ensure proper spacing */
          body {
            margin: 0;
            padding: 20px;
          }
          
          /* Page breaks */
          .grid {
            page-break-inside: avoid;
          }
          
          /* Ensure text is visible */
          h1, h2, h3, p, span, div {
            color: black !important;
          }
          
          /* Hide scrollbar */
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}


