import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiCheck, FiX, FiInfo } from "react-icons/fi";

export default function KelolaPengajuanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Pengajuan</h1>
            <p className="text-slate-500">Tinjau dan proses pengajuan reservasi yang masuk.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Daftar Pending</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg border-slate-200 bg-slate-50">
                        <div className="space-y-1 mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900">Aula Utama</span>
                                <Badge variant="warning">Pending</Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium">Pemohon:</span> Ahmad Fauzi (NIM: 123456)
                            </p>
                            <p className="text-sm text-slate-600">
                                <span className="font-medium">Waktu:</span> 24 Nov 2025, 08:00 - 12:00
                            </p>
                            <p className="text-sm text-slate-500 italic">"Untuk kegiatan Seminar Nasional..."</p>
                        </div>
                        <div className="flex gap-2">
                             <Button size="sm" variant="outline"><FiInfo className="mr-2"/> Detail</Button>
                             <Button size="sm" variant="danger"><FiX className="mr-2"/> Tolak</Button>
                             <Button size="sm" className="bg-green-600 hover:bg-green-700"><FiCheck className="mr-2"/> Setujui</Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Riwayat Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3">Ruangan</th>
                            <th className="px-6 py-3">Pemohon</th>
                            <th className="px-6 py-3">Tanggal</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white border-b border-slate-100">
                            <td className="px-6 py-4 font-medium">Lab Komputer 1</td>
                            <td className="px-6 py-4">Siti Aminah</td>
                            <td className="px-6 py-4">20 Nov 2025</td>
                            <td className="px-6 py-4"><Badge variant="success">Disetujui</Badge></td>
                        </tr>
                         <tr className="bg-white border-b border-slate-100">
                            <td className="px-6 py-4 font-medium">Ruang Rapat</td>
                            <td className="px-6 py-4">Budi Santoso</td>
                            <td className="px-6 py-4">19 Nov 2025</td>
                            <td className="px-6 py-4"><Badge variant="danger">Ditolak</Badge></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

