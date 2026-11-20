import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireRole } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole();
  const u = session.user as any;

  return (
    <DashboardShell
      user={{ name: u.name, email: u.email, image: u.image, role: u.role || "customer" }}
    >
      {children}
    </DashboardShell>
  );
}