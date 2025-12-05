"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiAlertTriangle } from "react-icons/fi";

interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "DIBATALKAN";
  room: {
    nama: string;
  };
}

export default function PembatalanPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCancellableReservations();
    }
  }, [session]);

  const fetchCancellableReservations = async () => {
    try {
      const response = await api.get("/api/reservation");
      // Filter: only MENUNGGU or DISETUJUI status, and future dates
      const cancellable = response.data.data.filter(
        (res: Reservation) =>
          res.userId === session?.user?.id &&
          (res.status === "MENUNGGU" || res.status === "DISETUJUI") &&
          new Date(res.waktuMulai) > new Date()
      );
      console.log(response)
      setReservations(cancellable);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Gagal memuat data reservasi");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (reservation: Reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!reservationToCancel) return;

    setCancellingId(reservationToCancel.id);
    setShowCancelModal(false);
    
    try {
      await api.delete("/api/reservation", {
        data: { reservationId: reservationToCancel.id },
      });
      toast.success("Reservasi berhasil dibatalkan");
      fetchCancellableReservations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal membatalkan reservasi");
    } finally {
      setCancellingId(null);
      setReservationToCancel(null);
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
          Pembatalan Reservasi
        </h1>
        <p className="text-slate-500">
          Batalkan reservasi yang masih berstatus Pending atau Disetujui.
        </p>
      </div>

      <div className="space-y-4">
        {reservations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-slate-500">
                Tidak ada reservasi yang dapat dibatalkan
              </p>
            </CardContent>
          </Card>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {reservation.room.nama}
                    </h3>
                    <Badge
                      variant={
                        reservation.status === "MENUNGGU" ? "warning" : "success"
                      }
                    >
                      {reservation.status === "MENUNGGU"
                        ? "Menunggu Approval"
                        : "Disetujui"}
                    </Badge>
                  </div>
                  <p className="text-slate-600 text-sm mb-1">
                    📅 {formatDate(reservation.waktuMulai)} • ⏰{" "}
                    {formatTime(reservation.waktuMulai)} -{" "}
                    {formatTime(reservation.waktuSelesai)}
                  </p>
                  <p className="text-slate-500 text-sm">
                    Keperluan: {reservation.keperluan}
                  </p>
                </div>
                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full md:w-auto"
                    onClick={() => handleCancelClick(reservation)}
                    disabled={cancellingId === reservation.id}
                  >
                    {cancellingId === reservation.id
                      ? "Membatalkan..."
                      : "Batalkan Reservasi"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
          <FiAlertTriangle />
          <span className="text-sm">
            Hanya reservasi yang belum berlangsung yang dapat dibatalkan.
          </span>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        title="Batalkan Reservasi"
        description={
          reservationToCancel ? (
            <div className="space-y-2">
              <p>Apakah Anda yakin ingin membatalkan reservasi ini?</p>
              <div className="bg-slate-100 p-3 rounded-md text-sm">
                <p><strong>Ruangan:</strong> {reservationToCancel.room.nama}</p>
                <p><strong>Tanggal:</strong> {formatDate(reservationToCancel.waktuMulai)}</p>
                <p><strong>Waktu:</strong> {formatTime(reservationToCancel.waktuMulai)} - {formatTime(reservationToCancel.waktuSelesai)}</p>
                <p><strong>Status:</strong> {reservationToCancel.status === "MENUNGGU" ? "Menunggu Approval" : "Disetujui"}</p>
              </div>
            </div>
          ) : ""
        }
        onConfirm={handleCancelConfirm}
        confirmText="Ya, Batalkan"
        cancelText="Tidak"
        variant="destructive"
      />
    </div>
  );
}


