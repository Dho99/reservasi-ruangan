"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/lib/services/api";
import { Calendar as CalendarIcon, Clock, Info } from "lucide-react"
import { toast } from "sonner";
import { ROOM_OPERATING_HOURS, getOperatingHoursText } from "@/lib/constants/room";

interface Room {
  id: string;
  nama: string;
  kapasitas: number;
  lokasi: string;
}

interface Reservation {
  id: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: string;
  user: {
    nama: string;
  };
}

interface BlockedSlot {
  id: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  alasan: string;
}

interface ScheduleItem {
  time: string;
  status: "tersedia" | "terpakai" | "diblokir";
  keperluan?: string;
  pemohon?: string;
}

export default function ReservasiPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

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
    // Fetch schedule when room and date are selected
    if (formData.roomId && formData.waktuMulai) {
      fetchRoomSchedule();
    } else {
      setScheduleItems([]);
    }
  }, [formData.roomId, formData.waktuMulai]);

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

  const fetchRoomSchedule = async () => {
    if (!formData.roomId || !formData.waktuMulai) return;

    setLoadingSchedule(true);
    try {
      const selectedDate = new Date(formData.waktuMulai).toISOString().split("T")[0];

      // Fetch reservations
      const reservationsResponse = await api.get("/api/reservation");
      const allReservations = reservationsResponse.data.data || [];

      // Fetch blocked slots
      const blockedResponse = await api.get("/api/blocked-slots");
      const allBlocked = blockedResponse.data.data || [];

      // Filter by selected room and date - HANYA tampilkan yang DISETUJUI
      const roomReservations = allReservations.filter((res: Reservation) => {
        const resDate = new Date(res.waktuMulai).toISOString().split("T")[0];
        return (
          res.roomId === formData.roomId &&
          resDate === selectedDate &&
          res.status === "DISETUJUI" // Hanya yang disetujui yang menghalangi
        );
      });

      const roomBlocked = allBlocked.filter((slot: BlockedSlot) => {
        const slotDate = new Date(slot.waktuMulai).toISOString().split("T")[0];
        return slot.roomId === formData.roomId && slotDate === selectedDate;
      });

      // Generate schedule items
      const schedule: ScheduleItem[] = [];

      // Add reservations
      roomReservations.forEach((res: Reservation) => {
        const startTime = new Date(res.waktuMulai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(res.waktuSelesai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        schedule.push({
          time: `${startTime} - ${endTime}`,
          status: "terpakai",
          keperluan: res.keperluan,
          pemohon: res.user.nama,
        });
      });

      // Add blocked slots
      roomBlocked.forEach((slot: BlockedSlot) => {
        const startTime = new Date(slot.waktuMulai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTime = new Date(slot.waktuSelesai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        });

        schedule.push({
          time: `${startTime} - ${endTime}`,
          status: "diblokir",
          keperluan: slot.alasan,
        });
      });

      // Sort by time
      schedule.sort((a, b) => {
        const timeA = a.time.split(" - ")[0];
        const timeB = b.time.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });

      setScheduleItems(schedule);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Gagal memuat jadwal ruangan");
    } finally {
      setLoadingSchedule(false);
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

    // Validasi waktu tidak boleh di masa lalu
    const waktuMulai = new Date(formData.waktuMulai);
    const waktuSelesai = new Date(formData.waktuSelesai);
    const sekarang = new Date();
    
    if (waktuMulai < sekarang) {
      toast.error("Tidak dapat membuat reservasi di waktu yang sudah berlalu");
      setLoading(false);
      return;
    }

    if (waktuSelesai < sekarang) {
      toast.error("Waktu selesai tidak boleh di masa lalu");
      setLoading(false);
      return;
    }

    if (waktuSelesai <= waktuMulai) {
      toast.error("Waktu selesai harus lebih besar dari waktu mulai");
      setLoading(false);
      return;
    }

    // Validasi jumlah peserta dengan kapasitas ruangan
    if (selectedRoom && parseInt(formData.jumlahPeserta) > selectedRoom.kapasitas) {
      toast.error(`Jumlah peserta tidak boleh melebihi kapasitas ruangan (${selectedRoom.kapasitas} orang)`);
      setLoading(false);
      return;
    }

    // Validasi jam operasional ruangan
    const jamMulai = waktuMulai.toTimeString().slice(0, 5); // HH:mm
    const jamSelesai = waktuSelesai.toTimeString().slice(0, 5); // HH:mm
    
    if (jamMulai < ROOM_OPERATING_HOURS.OPEN || jamSelesai > ROOM_OPERATING_HOURS.CLOSE) {
      toast.error(`Ruangan hanya beroperasi pada jam ${getOperatingHoursText()}`);
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
    } catch (error: any) { //eslint-disable-line
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Ajukan Reservasi
        </h1>
        <p className="text-slate-500">
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
              <label className="text-sm font-medium text-slate-700">
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
                className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Ruangan --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.nama} (Kapasitas {room.kapasitas}) - {room.lokasi}
                  </option>
                ))}
              </select>
              {selectedRoom && (
                <div className="space-y-1 mt-2">
                  <p className="text-xs text-slate-600">
                    👥 Kapasitas maksimal: <span className="font-semibold">{selectedRoom.kapasitas} orang</span>
                  </p>
                  <p className="text-xs text-slate-600">
                    🕐 Jam operasional: <span className="font-semibold">{getOperatingHoursText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Waktu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Tanggal & Waktu Mulai *
                </label>
                <Input
                  type="datetime-local"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                  value={formData.waktuMulai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuMulai: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">
                  Pilih waktu minimal dari sekarang
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Tanggal & Waktu Selesai *
                </label>
                <Input
                  type="datetime-local"
                  required
                  min={formData.waktuMulai || new Date().toISOString().slice(0, 16)}
                  value={formData.waktuSelesai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuSelesai: e.target.value })
                  }
                />
                <p className="text-xs text-slate-500">
                  Harus lebih besar dari waktu mulai
                </p>
              </div>
            </div>

            {/* Jadwal Ruangan */}
            {formData.roomId && formData.waktuMulai && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-600" />
                  <label className="text-sm font-medium text-slate-700">
                    Jadwal Ruangan pada Tanggal Ini
                  </label>
                </div>
                
                {loadingSchedule ? (
                  <div className="text-center py-4 text-sm text-slate-500">
                    Memuat jadwal...
                  </div>
                ) : scheduleItems.length === 0 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Ruangan Tersedia Sepanjang Hari
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Tidak ada reservasi atau pemblokiran pada tanggal ini
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-3">
                    {scheduleItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          item.status === "terpakai"
                            ? "bg-red-50 border-red-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-semibold text-slate-900">
                                {item.time}
                              </span>
                              <Badge
                                variant={
                                  item.status === "terpakai" ? "danger" : "warning"
                                }
                                className="text-xs"
                              >
                                {item.status === "terpakai" ? "Terpakai" : "Diblokir"}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-700 ml-6">
                              <span className="font-medium">Keperluan:</span> {item.keperluan}
                            </p>
                            {item.pemohon && (
                              <p className="text-xs text-slate-600 ml-6">
                                <span className="font-medium">Pemohon:</span> {item.pemohon}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <span className="font-medium">💡 Tips:</span> Pilih waktu di luar jadwal yang terpakai/diblokir untuk menghindari konflik
                  </p>
                </div>
              </div>
            )}

            {/* Jumlah Peserta */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
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
              <label className="text-sm font-medium text-slate-700">
                Keperluan Penggunaan *
              </label>
              <textarea
                required
                value={formData.keperluan}
                onChange={(e) =>
                  setFormData({ ...formData, keperluan: e.target.value })
                }
                className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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


