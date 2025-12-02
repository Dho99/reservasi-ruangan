"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { api } from "@/lib/services/api";
import { toast } from "sonner";

interface Room {
  id: string;
  nama: string;
  kapasitas: number;
  lokasi: string;
}

export default function ReservasiPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    roomId: "",
    waktuMulai: "",
    waktuSelesai: "",
    keperluan: "",
    jumlahPeserta: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    // Auto-select room from URL parameter
    const roomIdFromUrl = searchParams.get("roomId");
    if (roomIdFromUrl && rooms.length > 0) {
      const room = rooms.find(r => r.id === roomIdFromUrl);
      if (room) {
        setSelectedRoom(room);
        setFormData(prev => ({ ...prev, roomId: roomIdFromUrl }));
      }
    }
  }, [searchParams, rooms]);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/api/room");
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      setLoading(false);
      return;
    }

    // Validasi jumlah peserta dengan kapasitas ruangan
    if (selectedRoom && parseInt(formData.jumlahPeserta) > selectedRoom.kapasitas) {
      toast.error(`Jumlah peserta tidak boleh melebihi kapasitas ruangan (${selectedRoom.kapasitas} orang)`);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/reservation", {
        userId: session.user.id,
        roomId: formData.roomId,
        waktuMulai: new Date(formData.waktuMulai).toISOString(),
        waktuSelesai: new Date(formData.waktuSelesai).toISOString(),
        keperluan: formData.keperluan,
        jumlahPeserta: parseInt(formData.jumlahPeserta),
      });

      toast.success("Pengajuan reservasi berhasil dikirim!");
      setTimeout(() => {
        router.push("/user/status");
      }, 1500);
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Ruangan sudah dipesan pada waktu tersebut. Pilih waktu lain.");
      } else {
        toast.error(error.response?.data?.message || "Gagal mengirim pengajuan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Ajukan Reservasi
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Isi formulir di bawah ini untuk meminjam ruangan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Peminjaman</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Ruangan */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Pilih Ruangan *
              </label>
              <select
                required
                value={formData.roomId}
                onChange={(e) => {
                  const room = rooms.find(r => r.id === e.target.value);
                  setSelectedRoom(room || null);
                  setFormData({ ...formData, roomId: e.target.value });
                }}
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
              >
                <option value="">-- Pilih Ruangan --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nama} (Kapasitas {room.kapasitas}) - {room.lokasi}
                  </option>
                ))}
              </select>
              {selectedRoom && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kapasitas maksimal: {selectedRoom.kapasitas} orang
                </p>
              )}
            </div>

            {/* Waktu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tanggal & Waktu Mulai *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.waktuMulai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuMulai: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Tanggal & Waktu Selesai *
                </label>
                <Input
                  type="datetime-local"
                  required
                  value={formData.waktuSelesai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuSelesai: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Jumlah Peserta */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Jumlah Peserta *
              </label>
              <Input
                type="number"
                required
                min="1"
                max={selectedRoom?.kapasitas || undefined}
                placeholder="Contoh: 25"
                value={formData.jumlahPeserta}
                onChange={(e) =>
                  setFormData({ ...formData, jumlahPeserta: e.target.value })
                }
              />
              {selectedRoom && formData.jumlahPeserta && parseInt(formData.jumlahPeserta) > selectedRoom.kapasitas && (
                <p className="text-xs text-red-500">
                  Jumlah peserta melebihi kapasitas ruangan ({selectedRoom.kapasitas} orang)
                </p>
              )}
            </div>

            {/* Keperluan */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Keperluan Penggunaan *
              </label>
              <textarea
                required
                value={formData.keperluan}
                onChange={(e) =>
                  setFormData({ ...formData, keperluan: e.target.value })
                }
                className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Contoh: Rapat Koordinasi Himpunan Mahasiswa..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mengirim..." : "Kirim Pengajuan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
