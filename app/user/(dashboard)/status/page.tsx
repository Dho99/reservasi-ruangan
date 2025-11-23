import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiEye } from "react-icons/fi";

export default function StatusPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Status Pengajuan</h1>
        <p className="text-slate-500">Pantau status persetujuan reservasi Anda.</p>
      </div>

      <Card>
        <CardContent className="p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Ruangan</th>
                            <th className="px-6 py-3">Tanggal & Waktu</th>
                            <th className="px-6 py-3">Keperluan</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">Aula Utama</td>
                            <td className="px-6 py-4">24 Nov 2025<br/><span className="text-slate-500 text-xs">08:00 - 12:00</span></td>
                            <td className="px-6 py-4 truncate max-w-[200px]">Seminar Teknologi AI</td>
                            <td className="px-6 py-4"><Badge variant="warning">Menunggu</Badge></td>
                            <td className="px-6 py-4"><Button size="sm" variant="ghost"><FiEye className="mr-2"/> Detail</Button></td>
                        </tr>
                        <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">Lab Komputer 1</td>
                            <td className="px-6 py-4">20 Nov 2025<br/><span className="text-slate-500 text-xs">13:00 - 15:00</span></td>
                            <td className="px-6 py-4 truncate max-w-[200px]">Praktikum Jaringan</td>
                            <td className="px-6 py-4"><Badge variant="success">Disetujui</Badge></td>
                            <td className="px-6 py-4"><Button size="sm" variant="ghost"><FiEye className="mr-2"/> Detail</Button></td>
                        </tr>
                         <tr className="bg-white border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">Ruang Rapat B</td>
                            <td className="px-6 py-4">15 Nov 2025<br/><span className="text-slate-500 text-xs">09:00 - 11:00</span></td>
                            <td className="px-6 py-4 truncate max-w-[200px]">Rapat Internal</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    <Badge variant="danger">Ditolak</Badge>
                                    <span className="text-xs text-red-500">Jadwal bentrok</span>
                                </div>
                            </td>
                            <td className="px-6 py-4"><Button size="sm" variant="ghost"><FiEye className="mr-2"/> Detail</Button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

