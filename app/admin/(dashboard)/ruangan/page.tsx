import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiUsers } from "react-icons/fi";

export default function KelolaRuanganPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Ruangan</h1>
            <p className="text-slate-500">Tambah, edit, atau hapus data ruangan.</p>
        </div>
        <Button><FiPlus className="mr-2" /> Tambah Ruangan</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
            { name: "Aula Utama", cap: 200, loc: "Gedung A Lt. 1", facil: ["AC", "Proyektor", "Sound System"] },
            { name: "Lab Komputer 1", cap: 30, loc: "Gedung B Lt. 2", facil: ["30 PC", "AC", "Whiteboard"] },
            { name: "Ruang Rapat B", cap: 15, loc: "Gedung A Lt. 2", facil: ["Meja Bundar", "AC", "TV"] },
            { name: "Kelas 101", cap: 40, loc: "Gedung C Lt. 1", facil: ["AC", "Whiteboard"] },
        ].map((room, i) => (
            <Card key={i}>
                <div className="h-40 bg-slate-200 w-full rounded-t-xl flex items-center justify-center text-slate-500">
                    Foto Ruangan
                </div>
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">{room.name}</h3>
                            <div className="flex items-center text-slate-500 text-sm mt-1">
                                <FiMapPin className="mr-1" /> {room.loc}
                            </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <FiUsers size={12} /> {room.cap}
                        </Badge>
                    </div>
                    
                    <div className="mb-6">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Fasilitas:</p>
                        <div className="flex flex-wrap gap-2">
                            {room.facil.map((f, idx) => (
                                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <Button variant="outline" size="sm" className="flex-1"><FiEdit2 className="mr-2"/> Edit</Button>
                        <Button variant="danger" size="sm" className="flex-1"><FiTrash2 className="mr-2"/> Hapus</Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}

