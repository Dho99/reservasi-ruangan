import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiUser, FiShield } from "react-icons/fi";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <main className="flex flex-col items-center text-center space-y-8 p-8 max-w-2xl">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Sistem Reservasi Ruangan
          </h1>
          <p className="text-lg text-slate-600">
            Platform terpadu untuk pengelolaan dan peminjaman fasilitas kampus.
            Mudah, Cepat, dan Transparan.
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <FiUser size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Mahasiswa</h2>
            <p className="text-slate-500 text-sm mb-6">
              Ajukan reservasi, cek jadwal, dan pantau status pengajuan.
            </p>
            <Link href="/user/login" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Masuk sebagai Mahasiswa</Button>
            </Link>
          </div>

          <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="h-16 w-16 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-4">
              <FiShield size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Admin</h2>
            <p className="text-slate-500 text-sm mb-6">
              Kelola ruangan, jadwal, dan persetujuan reservasi.
            </p>
            <Link href="/admin/login" className="w-full">
                <Button variant="primary" className="w-full bg-slate-900 hover:bg-slate-800">Masuk sebagai Admin</Button>
            </Link>
          </div>
        </div>

        <footer className="text-sm text-slate-400 pt-8">
          &copy; 2025 Universitas • All Rights Reserved
        </footer>
      </main>
    </div>
  );
}
