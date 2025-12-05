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
import { FiPlus, FiLock, FiX, FiCalendar } from "react-icons/fi";

interface Room {
  id: string;
  nama: string;
}

interface Reservation {
  id: string;
  waktuMulai: string;
  waktuSelesai: string;
  keperluan: string;
  status: string;
  room: {
    id: string;
    nama: string;
  };
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
  room: {
    nama: string;
  };
}

export default function KelolaJadwalPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string>("all");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [slotToUnblock, setSlotToUnblock] = useState<BlockedSlot | null>(null);
  const [blockFormData, setBlockFormData] = useState({
    roomId: "",
    waktuMulai: "",
    waktuSelesai: "",
    alasan: "",
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedRoomId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch rooms
      const roomsResponse = await api.get("/api/room");
      setRooms(roomsResponse.data.data || []);

      // Fetch reservations for selected date
      const reservationsResponse = await api.get("/api/reservation");
      const allReservations = reservationsResponse.data.data || [];

      // Filter by date and room
      const filteredReservations = allReservations.filter((res: Reservation) => {
        const resDate = new Date(res.waktuMulai).toISOString().split("T")[0];
        const matchesDate = resDate === selectedDate;
        const matchesRoom =
          selectedRoomId === "all" || res.room.id === selectedRoomId;
        return matchesDate && matchesRoom && res.status === "DISETUJUI";
      });

      setReservations(filteredReservations);

      // Fetch blocked slots
      const blockedResponse = await api.get("/api/blocked-slots");
      const allBlocked = blockedResponse.data.data || [];

      console.log("All blocked slots:", allBlocked);
      console.log("Selected date:", selectedDate);

      // Filter by date and room
      const filteredBlocked = allBlocked.filter((slot: BlockedSlot) => {
        const slotDate = new Date(slot.waktuMulai).toISOString().split("T")[0];
        const matchesDate = slotDate === selectedDate;
        const matchesRoom =
          selectedRoomId === "all" || slot.roomId === selectedRoomId;
        console.log(`Slot ${slot.id}: date=${slotDate}, matches=${matchesDate && matchesRoom}`);
        return matchesDate && matchesRoom;
      });

      console.log("Filtered blocked slots:", filteredBlocked);
      setBlockedSlots(filteredBlocked);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlot = async () => {
    if (
      !blockFormData.roomId ||
      !blockFormData.waktuMulai ||
      !blockFormData.waktuSelesai ||
      !blockFormData.alasan
    ) {
      toast.error("Mohon lengkapi semua field");
      return;
    }

    try {
      await api.post("/api/blocked-slots", {
        roomId: blockFormData.roomId,
        waktuMulai: new Date(blockFormData.waktuMulai).toISOString(),
        waktuSelesai: new Date(blockFormData.waktuSelesai).toISOString(),
        alasan: blockFormData.alasan,
      });

      toast.success("Jadwal berhasil diblokir");
      setShowBlockModal(false);
      setBlockFormData({
        roomId: "",
        waktuMulai: "",
        waktuSelesai: "",
        alasan: "",
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memblokir jadwal");
    }
  };

  const handleUnblockClick = (slot: BlockedSlot) => {
    setSlotToUnblock(slot);
    setShowUnblockModal(true);
  };

  const handleUnblockConfirm = async () => {
    if (!slotToUnblock) return;

    try {
      await api.delete("/api/blocked-slots", {
        data: { blockedSlotId: slotToUnblock.id },
      });

      toast.success("Blokir jadwal berhasil dihapus");
      setShowUnblockModal(false);
      setSlotToUnblock(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus blokir");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimePosition = (time: string) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // Calculate position from 08:00 to 17:00 (9 hours = 540 minutes)
    const startHour = 8;
    const totalMinutes = (hours - startHour) * 60 + minutes;
    return (totalMinutes / 540) * 100; // Convert to percentage
  };

  const getTimeWidth = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60); // in minutes
    return (duration / 540) * 100; // Convert to percentage
  };

  const getRoomSchedule = (roomId: string) => {
    const roomReservations = reservations.filter(
      (res) => res.room.id === roomId
    );
    const roomBlocked = blockedSlots.filter((slot) => slot.roomId === roomId);
    return { reservations: roomReservations, blocked: roomBlocked };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const displayRooms =
    selectedRoomId === "all"
      ? rooms
      : rooms.filter((room) => room.id === selectedRoomId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Kelola Jadwal
          </h1>
          <p className="text-slate-500">
            Atur jadwal manual atau blokir ruangan untuk maintenance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBlockModal(true)}>
            <FiLock className="mr-2" /> Blok Jadwal
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-slate-500" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">Semua Ruangan</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {/* Timeline header */}
            <div className="grid grid-cols-12 gap-1 text-xs text-center text-slate-400 border-b pb-2">
              <div className="col-span-2 text-left pl-4">Ruangan</div>
              <div className="col-span-10 grid grid-cols-9">
                <span>08:00</span>
                <span>09:00</span>
                <span>10:00</span>
                <span>11:00</span>
                <span>12:00</span>
                <span>13:00</span>
                <span>14:00</span>
                <span>15:00</span>
                <span>16:00</span>
              </div>
            </div>

            {/* Room rows */}
            {displayRooms.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                Tidak ada ruangan
              </p>
            ) : (
              displayRooms.map((room) => {
                const schedule = getRoomSchedule(room.id);
                return (
                  <div
                    key={room.id}
                    className="grid grid-cols-12 gap-1 items-center py-2 border-b border-slate-50"
                  >
                    <div className="col-span-2 font-medium pl-4 text-slate-900">
                      {room.nama}
                    </div>
                    <div className="col-span-10 relative h-10 bg-slate-100 rounded-md overflow-hidden">
                      {/* Reservations */}
                      {schedule.reservations.map((res) => (
                        <div
                          key={res.id}
                          className="absolute top-0 h-full bg-blue-200 border-l-4 border-blue-500 flex items-center px-2 text-xs text-blue-800 truncate"
                          style={{
                            left: `${getTimePosition(res.waktuMulai)}%`,
                            width: `${getTimeWidth(
                              res.waktuMulai,
                              res.waktuSelesai
                            )}%`,
                          }}
                          title={`${res.keperluan} (${formatTime(
                            res.waktuMulai
                          )} - ${formatTime(res.waktuSelesai)})`}
                        >
                          {res.keperluan}
                        </div>
                      ))}

                      {/* Blocked slots */}
                      {schedule.blocked.map((slot) => (
                        <div
                          key={slot.id}
                          className="absolute top-0 h-full bg-red-100 border-l-4 border-red-500 flex items-center justify-between px-2 text-xs text-red-800 truncate group"
                          style={{
                            left: `${getTimePosition(slot.waktuMulai)}%`,
                            width: `${getTimeWidth(
                              slot.waktuMulai,
                              slot.waktuSelesai
                            )}%`,
                          }}
                          title={`${slot.alasan} (${formatTime(
                            slot.waktuMulai
                          )} - ${formatTime(slot.waktuSelesai)})`}
                        >
                          <span className="flex items-center">
                            <FiLock className="mr-1" /> {slot.alasan}
                          </span>
                          <button
                            onClick={() => handleUnblockClick(slot)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="text-red-600" />
                          </button>
                        </div>
                      ))}

                      {schedule.reservations.length === 0 &&
                        schedule.blocked.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
                            Tidak ada jadwal
                          </div>
                        )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Block Schedule Modal - Custom */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Blokir Jadwal
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Blokir ruangan untuk maintenance atau keperluan khusus
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="block-room">Ruangan *</Label>
                <select
                  id="block-room"
                  value={blockFormData.roomId}
                  onChange={(e) =>
                    setBlockFormData({ ...blockFormData, roomId: e.target.value })
                  }
                  className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Ruangan --</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.nama}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="block-start">Waktu Mulai *</Label>
                  <Input
                    id="block-start"
                    type="datetime-local"
                    value={blockFormData.waktuMulai}
                    onChange={(e) =>
                      setBlockFormData({
                        ...blockFormData,
                        waktuMulai: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block-end">Waktu Selesai *</Label>
                  <Input
                    id="block-end"
                    type="datetime-local"
                    value={blockFormData.waktuSelesai}
                    onChange={(e) =>
                      setBlockFormData({
                        ...blockFormData,
                        waktuSelesai: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="block-reason">Alasan *</Label>
                <Input
                  id="block-reason"
                  placeholder="Contoh: Maintenance AC, Renovasi, dll"
                  value={blockFormData.alasan}
                  onChange={(e) =>
                    setBlockFormData({ ...blockFormData, alasan: e.target.value })
                  }
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBlockModal(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleBlockSlot}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Blokir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Confirmation Modal */}
      <ConfirmationModal
        open={showUnblockModal}
        onOpenChange={setShowUnblockModal}
        title="Hapus Blokir Jadwal"
        description={
          slotToUnblock ? (
            <div className="space-y-2">
              <span className="block">Apakah Anda yakin ingin menghapus blokir jadwal ini?</span>
              <div className="bg-slate-100 p-3 rounded-md text-sm space-y-1">
                <div>
                  <strong>Ruangan:</strong> {slotToUnblock.room.nama}
                </div>
                <div>
                  <strong>Waktu:</strong> {formatTime(slotToUnblock.waktuMulai)} -{" "}
                  {formatTime(slotToUnblock.waktuSelesai)}
                </div>
                <div>
                  <strong>Alasan:</strong> {slotToUnblock.alasan}
                </div>
              </div>
            </div>
          ) : (
            ""
          )
        }
        onConfirm={handleUnblockConfirm}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="destructive"
      />
    </div>
  );
}


