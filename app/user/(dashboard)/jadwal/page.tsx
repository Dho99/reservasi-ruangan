import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JadwalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Jadwal Ketersediaan</h1>
        <p className="text-slate-500">Cek ketersediaan ruangan sebelum mengajukan.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input placeholder="Cari nama ruangan..." />
            <Input type="date" />
            <select className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Semua Jenis</option>
              <option value="kelas">Kelas</option>
              <option value="lab">Laboratorium</option>
              <option value="aula">Aula</option>
            </select>
            <Button variant="primary">Filter</Button>
        </CardContent>
      </Card>

      {/* Mock Calendar / Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
                <div className="h-32 bg-slate-200 flex items-center justify-center text-slate-400">
                    Gambar Ruangan {i}
                </div>
                <CardHeader>
                    <CardTitle>Ruang {i}</CardTitle>
                    <Badge variant="outline" className="w-fit">Kapasitas: {20 + i * 10}</Badge>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-slate-900">Jadwal Hari Ini:</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">08:00 - 10:00</span>
                                <Badge variant="danger">Terpakai</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">10:00 - 12:00</span>
                                <Badge variant="success">Tersedia</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">13:00 - 15:00</span>
                                <Badge variant="warning">Pending</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

