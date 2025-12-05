"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/services/api";
import { toast } from "sonner";
import { FiArrowLeft, FiSave, FiUpload, FiX, FiImage } from "react-icons/fi";
import Link from "next/link";

export default function TambahRuanganPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadType, setUploadType] = useState<"url" | "file">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    kapasitas: "",
    lokasi: "",
    gambar: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, gambar: base64String });
      setImagePreview(base64String);
      toast.success("Gambar berhasil diupload");
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, gambar: "" });
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.kapasitas || !formData.lokasi) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/room", {
        ...formData,
        kapasitas: parseInt(formData.kapasitas),
      });
      toast.success("Ruangan berhasil ditambahkan");
      router.push("/admin/ruangan");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/ruangan">
          <Button variant="outline" size="sm">
            <FiArrowLeft className="mr-2" /> Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tambah Ruangan Baru
          </h1>
          <p className="text-slate-500">
            Tambahkan ruangan baru ke sistem
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Ruangan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">
                  Nama Ruangan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nama"
                  placeholder="Contoh: Aula Utama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kapasitas">
                  Kapasitas <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="kapasitas"
                  type="number"
                  placeholder="Contoh: 50"
                  value={formData.kapasitas}
                  onChange={(e) =>
                    setFormData({ ...formData, kapasitas: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">
                Lokasi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lokasi"
                placeholder="Contoh: Gedung A Lantai 1"
                value={formData.lokasi}
                onChange={(e) =>
                  setFormData({ ...formData, lokasi: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <textarea
                id="deskripsi"
                placeholder="Deskripsi ruangan..."
                value={formData.deskripsi}
                onChange={(e) =>
                  setFormData({ ...formData, deskripsi: e.target.value })
                }
                className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Gambar Ruangan (opsional)
              </Label>
              
              {/* Upload Type Toggle */}
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant={uploadType === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadType("file")}
                >
                  <FiUpload className="mr-2" /> Upload File
                </Button>
                <Button
                  type="button"
                  variant={uploadType === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUploadType("url")}
                >
                  <FiImage className="mr-2" /> URL Gambar
                </Button>
              </div>

              {uploadType === "file" ? (
                <div className="space-y-3">
                  {/* File Upload */}
                  <div className="flex items-center gap-3">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <FiX className="mr-1" /> Hapus
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Format: JPG, PNG, GIF. Maksimal 2MB
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* URL Input */}
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={formData.gambar}
                    onChange={(e) => {
                      setFormData({ ...formData, gambar: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                  />
                  <p className="text-xs text-slate-500">
                    Masukkan URL gambar dari internet
                  </p>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <Label className="text-xs text-slate-500 mb-2 block">
                    Preview:
                  </Label>
                  <div className="relative w-full h-64 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => {
                        toast.error("Gagal memuat gambar");
                        setImagePreview("");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button 
                type="submit" 
                disabled={saving}
                className="min-w-[120px]"
              >
                {saving ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <FiSave className="mr-2" /> Simpan Ruangan
                  </>
                )}
              </Button>
              <Link href="/admin/ruangan">
                <Button type="button" variant="outline" disabled={saving}>
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}



