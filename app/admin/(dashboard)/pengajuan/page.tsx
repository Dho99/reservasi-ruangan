"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiCheck, FiX, FiInfo, FiSearch } from "react-icons/fi";

interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  jumlahPeserta: number;
  status: string;
  user: {
    nama: string;
    email: string;
  };
  room: {
    nama: string;
  };
}

export default function KelolaPengajuanPage() {
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [historyReservations, setHistoryReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      // Fetch pending
      const pendingResponse = await api.get("/api/admin/reservations/pending");
      setPendingReservations(pendingResponse.data.data || []);

      // Fetch all for history
      const allResponse = await api.get("/api/reservation");
      const history = allResponse.data.data.filter(
        (res: Reservation) => res.status !== "MENUNGGU"
      );
      setHistoryReservations(history);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Gagal memuat data reservasi");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowApproveModal(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedReservation) return;
    
    setProcessingId(selectedReservation.id);
    setShowApproveModal(false);
    
    try {
      await api.post("/api/admin/reservations/pending", {
        reservationId: selectedReservation.id,
        userId: selectedReservation.userId,
        roomId: selectedReservation.roomId,
        status: "DISETUJUI",
      });
      toast.success("Reservasi berhasil disetujui");
      fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyetujui reservasi");
    } finally {
      setProcessingId(null);
      setSelectedReservation(null);
    }
  };

  const handleRejectClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedReservation || !rejectReason.trim()) {
      toast.error("Alasan penolakan harus diisi");
      return;
    }

    setProcessingId(selectedReservation.id);
    setShowRejectModal(false);
    
    try {
      await api.post("/api/admin/reservations/pending", {
        reservationId: selectedReservation.id,
        userId: selectedReservation.userId,
        roomId: selectedReservation.roomId,
        status: "DITOLAK",
        alasanPenolakan: rejectReason,
      });
      toast.success("Reservasi berhasil ditolak");
      fetchReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menolak reservasi");
    } finally {
      setProcessingId(null);
      setSelectedReservation(null);
      setRejectReason("");
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

  // Filter pending reservations based on search term
  const filteredPendingReservations = pendingReservations.filter((reservation) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reservation.room.nama.toLowerCase().includes(searchLower) ||
      reservation.user.nama.toLowerCase().includes(searchLower) ||
      reservation.user.email.toLowerCase().includes(searchLower) ||
      reservation.keperluan.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Kelola Pengajuan
          </h1>
          <p className="text-slate-500">
            Tinjau dan proses pengajuan reservasi yang masuk.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Daftar Pending ({pendingReservations.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari ruangan, pemohon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPendingReservations.length === 0 ? (
            <p className="text-center py-8 text-slate-500">
              {searchTerm ? "Tidak ada hasil pencarian" : "Tidak ada pengajuan pending"}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredPendingReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex flex-col p-4 border rounded-lg border-slate-200 bg-slate-50"
                >
                  {/* Header dengan Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">
                        {reservation.room.nama}
                      </span>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                  </div>

                  {/* Info Detail */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Pemohon:</span>{" "}
                      {reservation.user.nama}
                    </p>
                    <p className="text-sm text-slate-600 break-all">
                      <span className="font-medium">Email:</span>{" "}
                      {reservation.user.email}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Waktu:</span>{" "}
                      {formatDate(reservation.waktuMulai)},{" "}
                      {formatTime(reservation.waktuMulai)} -{" "}
                      {formatTime(reservation.waktuSelesai)}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Peserta:</span>{" "}
                      {reservation.jumlahPeserta} orang
                    </p>
                    <p className="text-sm text-slate-500 italic bg-slate-100 p-2 rounded">
                      "{reservation.keperluan}"
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full sm:w-auto order-3 sm:order-1"
                    >
                      <FiInfo className="mr-2" /> Detail
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRejectClick(reservation)}
                      disabled={processingId === reservation.id}
                      className="w-full sm:flex-1 bg-red-600 hover:bg-red-700 text-white order-2"
                    >
                      <FiX className="mr-2" /> Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white order-1 sm:order-3"
                      onClick={() => handleApproveClick(reservation)}
                      disabled={processingId === reservation.id}
                    >
                      <FiCheck className="mr-2" /> Setujui
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop Table View - Riwayat */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Riwayat Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Ruangan</th>
                  <th className="px-6 py-3">Pemohon</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyReservations.slice(0, 5).map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="bg-white border-b border-slate-100"
                  >
                    <td className="px-6 py-4 font-medium">
                      {reservation.room.nama}
                    </td>
                    <td className="px-6 py-4">{reservation.user.nama}</td>
                    <td className="px-6 py-4">
                      {formatDate(reservation.waktuMulai)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          reservation.status === "DISETUJUI"
                            ? "success"
                            : "danger"
                        }
                      >
                        {reservation.status === "DISETUJUI"
                          ? "Disetujui"
                          : "Ditolak"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card View - Riwayat */}
      <Card className="md:hidden">
        <CardHeader>
          <CardTitle>Riwayat Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          {historyReservations.length === 0 ? (
            <p className="text-center py-8 text-slate-500">
              Belum ada riwayat
            </p>
          ) : (
            <div className="space-y-3">
              {historyReservations.slice(0, 5).map((reservation) => (
                <div
                  key={reservation.id}
                  className="p-3 border rounded-lg border-slate-200 bg-slate-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {reservation.room.nama}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {reservation.user.nama}
                      </p>
                    </div>
                    <Badge
                      variant={
                        reservation.status === "DISETUJUI"
                          ? "success"
                          : "danger"
                      }
                    >
                      {reservation.status === "DISETUJUI"
                        ? "Disetujui"
                        : "Ditolak"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    {formatDate(reservation.waktuMulai)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        open={showApproveModal}
        onOpenChange={setShowApproveModal}
        title="Setujui Reservasi"
        description={
          selectedReservation ? (
            <div className="space-y-2">
              <p>Apakah Anda yakin ingin menyetujui reservasi ini?</p>
              <div className="bg-slate-100 p-3 rounded-md text-sm">
                <p><strong>Ruangan:</strong> {selectedReservation.room.nama}</p>
                <p><strong>Pemohon:</strong> {selectedReservation.user.nama}</p>
                <p><strong>Waktu:</strong> {formatDate(selectedReservation.waktuMulai)}, {formatTime(selectedReservation.waktuMulai)} - {formatTime(selectedReservation.waktuSelesai)}</p>
              </div>
            </div>
          ) : ""
        }
        onConfirm={handleApproveConfirm}
        confirmText="Ya, Setujui"
        cancelText="Batal"
      />

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        open={showRejectModal}
        onOpenChange={(open) => {
          setShowRejectModal(open);
          if (!open) setRejectReason("");
        }}
        title="Tolak Reservasi"
        description={
          selectedReservation ? (
            <div className="space-y-4">
              <p>Apakah Anda yakin ingin menolak reservasi ini?</p>
              <div className="bg-slate-100 p-3 rounded-md text-sm">
                <p><strong>Ruangan:</strong> {selectedReservation.room.nama}</p>
                <p><strong>Pemohon:</strong> {selectedReservation.user.nama}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Alasan Penolakan *</Label>
                <Input
                  id="reject-reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  className="w-full"
                />
              </div>
            </div>
          ) : ""
        }
        onConfirm={handleRejectConfirm}
        confirmText="Ya, Tolak"
        cancelText="Batal"
        variant="destructive"
      />
    </div>
  );
}


