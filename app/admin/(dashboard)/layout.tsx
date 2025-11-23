import AdminLayoutWrapper from "@/components/layouts/admin/AdminLayoutWrapper";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

