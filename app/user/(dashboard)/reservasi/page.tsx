import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FiUpload } from "react-icons/fi";

export default function ReservasiPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ajukan Reservasi</h1>
        <p className="text-slate-500">Isi formulir di bawah ini untuk meminjam ruangan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulir Peminjaman</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ruangan */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Pilih Ruangan</label>
            <select className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Pilih Ruangan --</option>
              <option value="aula">Aula Utama (Kapasitas 200)</option>
              <option value="lab1">Lab Komputer 1 (Kapasitas 30)</option>
              <option value="rapat">Ruang Rapat B (Kapasitas 15)</option>
            </select>
          </div>

          {/* Waktu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tanggal Mulai</label>
                <Input type="datetime-local" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tanggal Selesai</label>
                <Input type="datetime-local" />
            </div>
          </div>

          {/* Keperluan */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Keperluan Penggunaan</label>
            <textarea
                className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contoh: Rapat Koordinasi Himpunan Mahasiswa..."
            />
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Surat Izin (Opsional)</label>
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                        <p className="text-xs text-slate-500">PDF, DOCX, JPG (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" />
                </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" type="button">Batal</Button>
            <Button type="submit">Kirim Pengajuan</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

