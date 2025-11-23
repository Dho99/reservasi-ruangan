import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiAlertTriangle } from "react-icons/fi";

export default function PembatalanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pembatalan Reservasi</h1>
        <p className="text-slate-500">Batalkan reservasi yang masih berstatus Pending atau Disetujui.</p>
      </div>

      <div className="space-y-4">
        <Card>
             <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">Aula Utama</h3>
                         <Badge variant="warning">Menunggu Approval</Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-1">📅 24 Nov 2025 • ⏰ 08:00 - 12:00</p>
                    <p className="text-slate-500 text-sm">Keperluan: Seminar Teknologi AI</p>
                </div>
                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                     <Input placeholder="Alasan pembatalan (opsional)" className="md:w-64" />
                     <Button variant="danger" size="sm" className="w-full md:w-auto">Batalkan Reservasi</Button>
                </div>
             </CardContent>
        </Card>

        <Card>
             <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">Lab Komputer 1</h3>
                         <Badge variant="success">Disetujui</Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-1">📅 28 Nov 2025 • ⏰ 13:00 - 15:00</p>
                    <p className="text-slate-500 text-sm">Keperluan: Pelatihan Desain Grafis</p>
                </div>
                 <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                     <Input placeholder="Alasan pembatalan (opsional)" className="md:w-64" />
                     <Button variant="danger" size="sm" className="w-full md:w-auto">Batalkan Reservasi</Button>
                </div>
             </CardContent>
        </Card>

        {/* Empty State Mock */}
        <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
            <FiAlertTriangle />
            <span className="text-sm">Hanya reservasi yang belum berlangsung yang dapat dibatalkan.</span>
        </div>
      </div>
    </div>
  );
}

