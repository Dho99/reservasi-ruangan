import UserLayoutWrapper from "@/components/layouts/user/UserLayoutWrapper";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserLayoutWrapper>{children}</UserLayoutWrapper>;
}

