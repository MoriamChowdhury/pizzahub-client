import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type Role = "customer" | "vendor" | "admin";

// roles faka dile: shudhu login check. Role na mille /dashboard e pathay
export async function requireRole(roles: Role[] = []) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const user = session.user as any;
  if (user.isBlocked) redirect("/blocked");
  if (roles.length && !roles.includes(user.role)) redirect("/dashboard");

  return session;
}