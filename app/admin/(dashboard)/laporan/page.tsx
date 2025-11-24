import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiDownload, FiPrinter, FiFilter } from "react-icons/fi";

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Laporan Penggunaan</h1>
            <p className="text-slate-500">Rekapitulasi data reservasi dan penggunaan ruangan.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline"><FiPrinter className="mr-2" /> Cetak PDF</Button>
             <Button variant="outline"><FiDownload className="mr-2" /> Export Excel</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
            {/* Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Dari Tanggal</label>
                    <Input type="date" className="bg-white" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Sampai Tanggal</label>
                    <Input type="date" className="bg-white" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Ruangan</label>
                    <select className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Semua Ruangan</option>
                        <option>Aula Utama</option>
                        <option>Lab Komputer</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <Button className="w-full"><FiFilter className="mr-2"/> Terapkan Filter</Button>
                </div>
            </div>

            {/* Table */}
             <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3">No</th>
                            <th className="px-6 py-3">Ruangan</th>
                            <th className="px-6 py-3">Pemohon</th>
                            <th className="px-6 py-3">Departemen</th>
                            <th className="px-6 py-3">Tanggal & Jam</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="bg-white border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-6 py-4">{i}</td>
                                <td className="px-6 py-4 font-medium">Aula Utama</td>
                                <td className="px-6 py-4">Mahasiswa {i}</td>
                                <td className="px-6 py-4">Teknik Informatika</td>
                                <td className="px-6 py-4">2{i} Nov 2025, 09:00</td>
                                <td className="px-6 py-4"><Badge variant="success">Selesai</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center pt-4 text-sm text-slate-500">
                <span>Menampilkan 1-5 dari 50 data</span>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>Prev</Button>
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

