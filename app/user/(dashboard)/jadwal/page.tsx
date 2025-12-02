"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiMapPin, FiUsers, FiCalendar, FiPlus } from "react-icons/fi";

interface Room {
  id: string;
  nama: string;
  kapasitas: number;
  lokasi: string;
  deskripsi?: string;
  gambar?: string;
  isActive: boolean;
}

interface Reservation {
  id: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  status: string;
}

interface BlockedSlot {
  id: string;
  roomId: string;
  waktuMulai: string;
  waktuSelesai: string;
  alasan: string;
}

export default function JadwalPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleReservasi = (roomId: string) => {
    router.push(`/user/reservasi?roomId=${roomId}`);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch rooms
      const roomsResponse = await api.get("/api/room");
      setRooms(roomsResponse.data.data || []);

      // Fetch reservations
      const reservationsResponse = await api.get("/api/reservation");
      const allReservations = reservationsResponse.data.data || [];
      
      // Filter reservations by selected date and approved status
      const filteredReservations = allReservations.filter((res: Reservation) => {
        const resDate = new Date(res.waktuMulai).toISOString().split("T")[0];
        return resDate === selectedDate && res.status === "DISETUJUI";
      });
      
      setReservations(filteredReservations);

      // Fetch blocked slots
      const blockedResponse = await api.get("/api/blocked-slots");
      const allBlocked = blockedResponse.data.data || [];
      
      // Filter blocked slots by selected date
      const filteredBlocked = allBlocked.filter((slot: BlockedSlot) => {
        const slotDate = new Date(slot.waktuMulai).toISOString().split("T")[0];
        return slotDate === selectedDate;
      });
      
      setBlockedSlots(filteredBlocked);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScheduleForRoom = (roomId: string) => {
    const roomReservations = reservations.filter((res) => res.roomId === roomId);
    const roomBlocked = blockedSlots.filter((slot) => slot.roomId === roomId);
    
    const scheduleItems: Array<{ time: string; status: string; alasan?: string }> = [];

    // Add reservations
    roomReservations.forEach((res) => {
      const start = new Date(res.waktuMulai);
      const end = new Date(res.waktuSelesai);
      
      const timeString = `${start.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      scheduleItems.push({
        time: timeString,
        status: res.status === "DISETUJUI" ? "terpakai" : "pending",
      });
    });

    // Add blocked slots
    roomBlocked.forEach((slot) => {
      const start = new Date(slot.waktuMulai);
      const end = new Date(slot.waktuSelesai);
      
      const timeString = `${start.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;

      scheduleItems.push({
        time: timeString,
        status: "diblokir",
        alasan: slot.alasan,
      });
    });

    if (scheduleItems.length === 0) {
      return [{ time: "Tidak ada jadwal", status: "tersedia" }];
    }

    return scheduleItems;
  };

  const isRoomAvailable = (roomId: string) => {
    const roomReservations = reservations.filter((res) => res.roomId === roomId);
    const roomBlocked = blockedSlots.filter((slot) => slot.roomId === roomId);
    return roomReservations.length === 0 && roomBlocked.length === 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-500 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Jadwal Ketersediaan
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Cek ketersediaan ruangan sebelum mengajukan.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Cari nama ruangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <FiCalendar className="text-slate-500" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Room Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRooms.map((room) => {
          const schedule = getScheduleForRoom(room.id);
          const available = isRoomAvailable(room.id);
          
          return (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Room Image */}
              <div className="h-40 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 relative overflow-hidden">
                {room.gambar ? (
                  <img
                    src={room.gambar}
                    alt={room.nama}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <FiMapPin className="mx-auto mb-2" size={32} />
                    <span className="text-sm">Foto Ruangan</span>
                  </div>
                )}
                
                {/* Availability Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant={available ? "success" : "danger"}>
                    {available ? "Tersedia" : "Terpakai"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{room.nama}</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FiUsers size={12} /> {room.kapasitas}
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <FiMapPin className="mr-1" size={14} />
                  {room.lokasi}
                </div>
                {room.deskripsi && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                    {room.deskripsi}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <FiCalendar size={14} />
                    Jadwal {new Date(selectedDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}:
                  </h4>
                  <div className="space-y-2">
                    {schedule.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-md bg-slate-50 dark:bg-slate-800">
                        <div className="flex-1">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {item.time}
                          </span>
                          {item.status === "diblokir" && item.alasan && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {item.alasan}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={
                            item.status === "tersedia"
                              ? "success"
                              : item.status === "terpakai"
                              ? "danger"
                              : item.status === "diblokir"
                              ? "outline"
                              : "warning"
                          }
                          className={
                            item.status === "diblokir"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700"
                              : ""
                          }
                        >
                          {item.status === "tersedia"
                            ? "Tersedia"
                            : item.status === "terpakai"
                            ? "Terpakai"
                            : item.status === "diblokir"
                            ? "Diblokir"
                            : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  {/* Button Reservasi */}
                  <Button 
                    onClick={() => handleReservasi(room.id)}
                    className="w-full mt-4"
                    size="sm"
                  >
                    <FiPlus className="mr-2" size={16} />
                    Reservasi Ruangan
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={64} />
          <p className="text-slate-500 dark:text-slate-400">
            Tidak ada ruangan ditemukan
          </p>
        </div>
      )}
    </div>
  );
}
