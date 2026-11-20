import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";

export default async function DashboardIndex() {
  const session = await requireRole();
  const role = (session.user as any).role || "customer";
  redirect(`/dashboard/${role}`);
}