import { AdminSidebar } from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 pt-16 md:pt-0 md:overflow-y-auto h-screen">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
            {children}
        </div>
      </main>
    </div>
  );
}

