import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiPlus, FiLock } from "react-icons/fi";

export default function KelolaJadwalPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Jadwal</h1>
            <p className="text-slate-500">Atur jadwal manual atau blokir ruangan untuk maintenance.</p>
        </div>
        <div className="flex gap-2">
             <Button variant="outline"><FiLock className="mr-2" /> Blok Jadwal</Button>
             <Button><FiPlus className="mr-2" /> Buat Jadwal Manual</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
            <div className="flex gap-4 mb-6">
                <Input type="date" className="w-auto" />
                <select className="h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option>Semua Ruangan</option>
                    <option>Aula Utama</option>
                    <option>Lab Komputer 1</option>
                </select>
            </div>

            <div className="space-y-4">
                 {/* Timeline header mock */}
                 <div className="grid grid-cols-12 gap-1 text-xs text-center text-slate-400 border-b pb-2">
                    <div className="col-span-2 text-left pl-4">Ruangan</div>
                    <div className="col-span-10 grid grid-cols-10">
                        <span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span><span>12:00</span>
                        <span>13:00</span><span>14:00</span><span>15:00</span><span>16:00</span><span>17:00</span>
                    </div>
                 </div>

                 {/* Row 1 */}
                 <div className="grid grid-cols-12 gap-1 items-center py-2 border-b border-slate-50">
                    <div className="col-span-2 font-medium pl-4">Aula Utama</div>
                    <div className="col-span-10 relative h-8 bg-slate-100 rounded-md overflow-hidden">
                        {/* Event Block */}
                        <div className="absolute top-0 left-[0%] w-[40%] h-full bg-blue-200 border-l-4 border-blue-500 flex items-center px-2 text-xs text-blue-800 truncate">
                            Seminar Nasional (08:00 - 12:00)
                        </div>
                         {/* Blocked */}
                        <div className="absolute top-0 left-[60%] w-[20%] h-full bg-red-100 border-l-4 border-red-500 flex items-center px-2 text-xs text-red-800 truncate">
                            <FiLock className="mr-1" /> Maintenance
                        </div>
                    </div>
                 </div>

                  {/* Row 2 */}
                 <div className="grid grid-cols-12 gap-1 items-center py-2 border-b border-slate-50">
                    <div className="col-span-2 font-medium pl-4">Lab Komputer 1</div>
                    <div className="col-span-10 relative h-8 bg-slate-100 rounded-md overflow-hidden">
                        <div className="absolute top-0 left-[50%] w-[20%] h-full bg-green-200 border-l-4 border-green-500 flex items-center px-2 text-xs text-green-800 truncate">
                            Praktikum (13:00 - 15:00)
                        </div>
                    </div>
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

