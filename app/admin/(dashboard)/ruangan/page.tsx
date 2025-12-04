"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiUsers } from "react-icons/fi";
import Link from "next/link";

interface Room {
  id: string;
  nama: string;
  deskripsi?: string;
  kapasitas: number;
  lokasi: string;
  gambar?: string;
  isActive: boolean;
}

export default function KelolaRuanganPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/api/room");
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Gagal memuat data ruangan");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roomId: string) => {
    router.push(`/admin/ruangan/edit/${roomId}`);
  };

  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roomToDelete) return;

    setShowDeleteModal(false);
    
    try {
      await api.delete(`/api/room/delete/${roomToDelete.id}`);
      toast.success("Ruangan berhasil dihapus");
      fetchRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus ruangan");
    } finally {
      setRoomToDelete(null);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Kelola Ruangan
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Tambah, edit, atau hapus data ruangan.
          </p>
        </div>
        <Link href="/admin/ruangan/tambah">
          <Button>
            <FiPlus className="mr-2" /> Tambah Ruangan
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-slate-200 dark:bg-slate-700 w-full flex items-center justify-center text-slate-500 relative">
              {room.gambar ? (
                <img
                  src={room.gambar}
                  alt={room.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <FiMapPin className="mx-auto mb-2" size={32} />
                  <span className="text-sm">Foto Ruangan</span>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {room.nama}
                  </h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <FiMapPin className="mr-1" /> {room.lokasi}
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <FiUsers size={12} /> {room.kapasitas}
                </Badge>
              </div>

              {room.deskripsi && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {room.deskripsi}
                </p>
              )}

              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(room.id)}
                >
                  <FiEdit2 className="mr-2" /> Edit
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteClick(room)}
                >
                  <FiTrash2 className="mr-2" /> Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={64} />
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Belum ada ruangan. Klik "Tambah Ruangan" untuk menambahkan.
          </p>
          <Link href="/admin/ruangan/tambah">
            <Button>
              <FiPlus className="mr-2" /> Tambah Ruangan Pertama
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Hapus Ruangan"
        description={
          roomToDelete ? (
            <div className="space-y-2">
              <p>Apakah Anda yakin ingin menghapus ruangan ini?</p>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-sm">
                <p><strong>Nama:</strong> {roomToDelete.nama}</p>
                <p><strong>Lokasi:</strong> {roomToDelete.lokasi}</p>
                <p><strong>Kapasitas:</strong> {roomToDelete.kapasitas} orang</p>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm">
                Tindakan ini tidak dapat dibatalkan!
              </p>
            </div>
          ) : (
            ""
          )
        }
        onConfirm={handleDeleteConfirm}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}
